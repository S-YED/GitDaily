# GitDaily 🚀

> Discover today's trending open-source projects, curated daily

GitDaily is a modern web platform that showcases trending GitHub repositories with daily updates, AI-powered summaries, and community curation.

## ✨ Features

### Phase 1 (MVP) ✅
- **Daily Trending Feed**: Automatically updated list of trending repositories
- **Smart Categorization**: Filter by AI, WebDev, DevOps, Mobile, and more
- **GitHub Integration**: Live stats (stars, forks, language)
- **Responsive Design**: Beautiful UI with dark mode

### Phase 2 (Current) ✅
- **User Authentication**: Sign up and sign in with email
- **Favorites System**: Save projects you love
- **Community Submissions**: Suggest projects for featuring
- **User Profiles**: Track your activity, streaks, and badges
- **AI Summaries**: (Coming soon) Understand projects at a glance

### Phase 3 (In Progress) 🚧
- **Personalized Recommendations**: AI-powered project suggestions
- **Analytics Dashboard**: Weekly insights and trends
- **Gamification**: Badges, streaks, and leaderboards
- **Audio Recaps**: Daily audio summaries of top projects

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Automation**: GitHub Actions (daily cron jobs)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Lovable account (for backend)
- GitHub account (for automation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gitdaily
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 📦 Project Structure

```
gitdaily/
├── .github/
│   └── workflows/
│       └── daily-fetch.yml      # Daily automation
├── scripts/
│   └── fetch-trending.js        # GitHub trending fetcher
├── src/
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   ├── pages/                   # Page components
│   └── integrations/           # Backend integration
└── README.md
```

## 🤖 Automation

GitDaily uses GitHub Actions to automatically fetch trending repositories daily:

1. **Daily Cron Job**: Runs at 6 AM UTC every day
2. **Fetches GitHub Trending**: Top 30 repositories
3. **Categorizes Automatically**: Based on topics and language
4. **Stores in Database**: Via Supabase REST API

### Setting Up Automation

To enable daily automation, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `GITHUB_TOKEN`: (Automatically provided by GitHub Actions)

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

## 💬 Community

- [GitHub Discussions](https://github.com/gitdaily/gitdaily/discussions)
- [Discord](https://discord.gg/gitdaily) (Coming soon)

## 🙏 Acknowledgments

- Inspired by GitHub Trending and Product Hunt
- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)

---

**Made with ❤️ by the open-source community**
