# GitDaily 🚀

> Discover today's trending open-source projects, curated daily

GitDaily is a modern web platform that showcases trending GitHub repositories with daily updates, smart categorization, and community curation. Built for developers who want to stay updated with the latest and most innovative open-source projects.

## ✨ Features

### Core Features ✅
- **Daily Trending Feed**: Automatically updated list of trending repositories
- **Smart Categorization**: Filter by AI, WebDev, DevOps, Mobile, Data, Security, Tools, Gaming
- **GitHub Integration**: Live stats (stars, forks, language, topics)
- **Responsive Design**: Beautiful UI with dark mode support
- **User Authentication**: Secure sign up and sign in with Supabase Auth
- **Favorites System**: Save and organize projects you love
- **Community Submissions**: Suggest projects for featuring
- **User Profiles**: Track activity, streaks, and earn badges
- **Real-time Updates**: Fresh content delivered daily via automation

### Coming Soon 🚧
- **AI Summaries**: Understand projects at a glance
- **Personalized Recommendations**: AI-powered project suggestions
- **Analytics Dashboard**: Weekly insights and trends
- **Enhanced Gamification**: Advanced badges and leaderboards
- **Audio Recaps**: Daily audio summaries of top projects
- **Multi-source Discovery**: GitLab, HuggingFace integration

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Automation**: GitHub Actions (daily cron jobs)
- **Deployment**: Vercel/Netlify compatible
- **State Management**: TanStack Query + React Context

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Supabase account** (free tier available)
- **GitHub account** (for automation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/S-YED/awesome-hub-feed.git
   cd awesome-hub-feed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the SQL migration from `supabase/migrations/` in your Supabase SQL editor

4. **Configure environment variables**
   ```bash
   # Create .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:5173`

## 📦 Project Structure

```
awesome-hub-feed/
├── .github/
│   ├── workflows/
│   │   └── daily-fetch.yml      # Daily automation workflow
│   └── ISSUE_TEMPLATE/          # GitHub issue templates
├── scripts/
│   └── fetch-trending.js        # GitHub trending fetcher script
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── FilterBar.tsx        # Category filtering
│   │   ├── Navbar.tsx           # Navigation component
│   │   ├── ProjectCard.tsx      # Project display cards
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.tsx          # Authentication logic
│   │   ├── useProjects.tsx      # Project data management
│   │   └── ...
│   ├── pages/                   # Route components
│   │   ├── Index.tsx            # Home page
│   │   ├── Auth.tsx             # Login/signup
│   │   ├── Profile.tsx          # User profile
│   │   ├── Submit.tsx           # Project submission
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/            # Supabase client & types
│   ├── lib/                     # Utility functions
│   └── data/                    # Static data & constants
├── supabase/
│   └── migrations/              # Database schema
├── public/                      # Static assets
└── configuration files          # Vite, Tailwind, TypeScript configs
```

## 🤖 Automation

GitDaily uses GitHub Actions to automatically fetch trending repositories daily:

1. **Daily Cron Job**: Runs at 6 AM UTC every day
2. **Fetches GitHub Trending**: Top 30 repositories
3. **Categorizes Automatically**: Based on topics and language
4. **Stores in Database**: Via Supabase REST API

### Setting Up Automation

To enable daily automation, configure GitHub repository secrets:

1. **Navigate to Repository Settings**
   - Go to **Settings** → **Secrets and variables** → **Actions**

2. **Add Required Secrets**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (not anon key)
   - `GITHUB_TOKEN`: Automatically provided by GitHub Actions

3. **Test the Workflow**
   - Go to **Actions** tab in your repository
   - Find "Daily Trending Fetch" workflow
   - Click **Run workflow** to test manually

4. **Verify Data Population**
   - Check your Supabase dashboard → Table Editor → `projects` table
   - Should contain ~30 trending repositories after successful run

## 🎯 Usage

### For Visitors
- Browse daily trending projects
- Filter by category
- View project details and statistics
- Sign up to favorite projects

### For Contributors
- Sign in with email
- Submit project suggestions
- Build your profile with badges
- Track your activity streaks

### For Admins
- Review community submissions
- Manage featured projects
- Monitor platform health

## 🔒 Security

- Row Level Security (RLS) on all database tables
- Separate user roles table (admin, moderator, user)
- Secure authentication with Supabase Auth
- API keys stored as GitHub Secrets

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Roadmap

- [x] Phase 1: MVP with daily trending
- [x] Phase 2: Auth, favorites, submissions
- [ ] Phase 3: Personalization & analytics
- [ ] AI-powered summaries
- [ ] Audio recaps
- [ ] Multi-source discovery (GitLab, HuggingFace)
- [ ] Mobile app

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema

The project uses PostgreSQL with the following main tables:
- `projects` - Trending repositories data
- `profiles` - User profiles and settings
- `favorites` - User's favorited projects
- `submissions` - Community project submissions
- `badges` - Gamification badges
- `user_badges` - User badge assignments

### API Integration

- **GitHub API**: Fetches trending repositories
- **Supabase API**: Handles authentication, data storage, and real-time updates
- **Row Level Security**: Ensures data privacy and security

## 💬 Community & Support

- **Issues**: [GitHub Issues](https://github.com/S-YED/awesome-hub-feed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/S-YED/awesome-hub-feed/discussions)
- **Feature Requests**: Use the issue templates provided

## 💖 Support GitDaily

GitDaily is free and open-source, built and maintained by **Syed Khaja Moinuddin** ([@S-YED](https://github.com/S-YED)).

If you find GitDaily useful, consider supporting the project:

- ⭐ [Star the repository](https://github.com/S-YED/awesome-hub-feed)
- 💖 [GitHub Sponsors](https://github.com/sponsors/S-YED)
- ☕ [Buy me a coffee](https://buymeacoffee.com/syedkhajams)
- ⚡ [Ko-fi](https://ko-fi.com/syedkhaja)

Your support helps keep GitDaily running and free for everyone!

## 🙏 Acknowledgments

- **Inspiration**: GitHub Trending, Product Hunt, and Hacker News
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) for beautiful, accessible components
- **Icons**: [Lucide React](https://lucide.dev) for consistent iconography
- **Backend**: [Supabase](https://supabase.com) for powerful backend-as-a-service
- **Deployment**: Compatible with Vercel, Netlify, and other modern platforms

## 📊 Project Stats

- **Language**: TypeScript
- **Framework**: React 18 with Vite
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Automation**: GitHub Actions
- **License**: MIT

---

**Made by [Syed Khaja Moinuddin](https://github.com/S-YED) for the developer community**

*GitDaily helps developers discover amazing open-source projects daily. Star the repo if you find it useful!*
