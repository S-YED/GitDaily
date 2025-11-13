-- Create enum for project categories
CREATE TYPE public.project_category AS ENUM (
  'AI',
  'WebDev',
  'DevOps',
  'Mobile',
  'Data',
  'Security',
  'Tools',
  'Gaming',
  'Other'
);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Projects table (daily trending repos)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_name TEXT NOT NULL,
  repo_url TEXT NOT NULL UNIQUE,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics TEXT[],
  category public.project_category NOT NULL,
  ai_summary TEXT,
  why_trending TEXT,
  demo_url TEXT,
  featured_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_repo_per_day UNIQUE (repo_url, featured_date)
);

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  github_username TEXT,
  visits INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_visited TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- User favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, project_id)
);

-- Badges table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB
);

-- User badges (junction table)
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- Community submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  repo_url TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  category public.project_category NOT NULL,
  description TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for projects (public read)
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

-- Allow service role to insert projects (for GitHub workflow)
CREATE POLICY "Service role can insert projects"
  ON public.projects FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for badges
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "User badges are viewable by everyone"
  ON public.user_badges FOR SELECT
  USING (true);

-- RLS Policies for submissions
CREATE POLICY "Anyone can view submissions"
  ON public.submissions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can update any submission"
  ON public.submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, criteria) VALUES
  ('First Submit', 'Submitted your first project', '🎯', '{"submissions": 1}'),
  ('Top Curator', 'Had 5 projects approved', '⭐', '{"approved": 5}'),
  ('Week Streak', 'Visited 7 days in a row', '🔥', '{"streak": 7}'),
  ('Month Streak', 'Visited 30 days in a row', '💎', '{"streak": 30}'),
  ('Early Adopter', 'Joined in the first month', '🚀', '{"early": true}');