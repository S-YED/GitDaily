export interface Project {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  category: string;
}

export const sampleProjects: Project[] = [
  {
    id: "1",
    name: "ESPectre",
    description: "A powerful ESP32-based network analysis and security testing tool with Wi-Fi capabilities",
    stars: 3200,
    forks: 450,
    language: "C++",
    url: "https://github.com/topics/security",
    category: "Security"
  },
  {
    id: "2",
    name: "Myna",
    description: "Modern AI-powered code completion and refactoring assistant for developers",
    stars: 15400,
    forks: 1200,
    language: "Python",
    url: "https://github.com/topics/ai",
    category: "AI"
  },
  {
    id: "3",
    name: "Mydia",
    description: "Self-hosted media server with beautiful UI and powerful organization features",
    stars: 8900,
    forks: 670,
    language: "TypeScript",
    url: "https://github.com/topics/media",
    category: "Media"
  },
  {
    id: "4",
    name: "Omnilingual ASR",
    description: "Universal automatic speech recognition system supporting 100+ languages",
    stars: 6700,
    forks: 890,
    language: "Python",
    url: "https://github.com/topics/speech-recognition",
    category: "AI"
  },
  {
    id: "5",
    name: "Davia",
    description: "Lightweight and fast data visualization library for modern web applications",
    stars: 4500,
    forks: 320,
    language: "JavaScript",
    url: "https://github.com/topics/data-visualization",
    category: "Web"
  },
  {
    id: "6",
    name: "triforce.nvim",
    description: "Ultimate Neovim configuration with LSP, treesitter, and modern plugin ecosystem",
    stars: 12300,
    forks: 980,
    language: "Lua",
    url: "https://github.com/topics/neovim",
    category: "DevTools"
  },
  {
    id: "7",
    name: "dashwise",
    description: "Real-time analytics dashboard builder with drag-and-drop interface",
    stars: 7800,
    forks: 560,
    language: "TypeScript",
    url: "https://github.com/topics/analytics",
    category: "Web"
  },
  {
    id: "8",
    name: "git-rewrite-commits",
    description: "Powerful tool for rewriting Git history with advanced filtering and scripting",
    stars: 2900,
    forks: 210,
    language: "Rust",
    url: "https://github.com/topics/git",
    category: "DevTools"
  },
  {
    id: "9",
    name: "CloudSync Pro",
    description: "Multi-cloud synchronization tool with encryption and versioning support",
    stars: 5600,
    forks: 430,
    language: "Go",
    url: "https://github.com/topics/cloud",
    category: "DevOps"
  },
  {
    id: "10",
    name: "ReactFlow Designer",
    description: "Visual workflow designer and automation builder for React applications",
    stars: 18700,
    forks: 1500,
    language: "TypeScript",
    url: "https://github.com/topics/react",
    category: "Web"
  },
  {
    id: "11",
    name: "SecureVault",
    description: "End-to-end encrypted password manager with biometric authentication",
    stars: 9200,
    forks: 720,
    language: "Kotlin",
    url: "https://github.com/topics/security",
    category: "Security"
  },
  {
    id: "12",
    name: "MobileKit",
    description: "Cross-platform mobile development framework with native performance",
    stars: 22400,
    forks: 2100,
    language: "Dart",
    url: "https://github.com/topics/mobile",
    category: "Mobile"
  }
];

export const categories = ["All", "AI", "Web", "DevTools", "Security", "DevOps", "Media", "Mobile"];
