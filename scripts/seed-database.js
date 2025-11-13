import { createClient } from '@supabase/supabase-js';

// Use environment variables for credentials
const supabaseUrl = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "your_service_key_here";

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleProjects = [
  {
    repo_name: "ESPectre",
    repo_url: "https://github.com/example/espectre",
    description: "A powerful ESP32-based network analysis and security testing tool with Wi-Fi capabilities",
    language: "C++",
    stars: 3200,
    forks: 450,
    topics: ["security", "esp32", "wifi"],
    category: "Security",
    why_trending: "Featured in security conferences this week"
  },
  {
    repo_name: "Myna",
    repo_url: "https://github.com/example/myna",
    description: "Modern AI-powered code completion and refactoring assistant for developers",
    language: "Python",
    stars: 15400,
    forks: 1200,
    topics: ["ai", "code-completion", "developer-tools"],
    category: "AI",
    why_trending: "Major update with GPT-4 integration"
  },
  {
    repo_name: "ReactFlow Designer",
    repo_url: "https://github.com/example/reactflow-designer",
    description: "Visual workflow designer and automation builder for React applications",
    language: "TypeScript",
    stars: 18700,
    forks: 1500,
    topics: ["react", "workflow", "visual-programming"],
    category: "WebDev",
    why_trending: "New drag-and-drop features released"
  },
  {
    repo_name: "CloudSync Pro",
    repo_url: "https://github.com/example/cloudsync-pro",
    description: "Multi-cloud synchronization tool with encryption and versioning support",
    language: "Go",
    stars: 5600,
    forks: 430,
    topics: ["cloud", "sync", "encryption"],
    category: "DevOps",
    why_trending: "Added support for 5 new cloud providers"
  },
  {
    repo_name: "MobileKit",
    repo_url: "https://github.com/example/mobilekit",
    description: "Cross-platform mobile development framework with native performance",
    language: "Dart",
    stars: 22400,
    forks: 2100,
    topics: ["mobile", "cross-platform", "flutter"],
    category: "Mobile",
    why_trending: "Flutter 3.0 compatibility update"
  }
];

async function seedDatabase() {
  console.log('Seeding database with sample projects...');
  
  const { data, error } = await supabase
    .from('projects')
    .insert(sampleProjects);
    
  if (error) {
    console.error('Error seeding database:', error);
  } else {
    console.log('Database seeded successfully!');
    console.log(`Added ${sampleProjects.length} projects`);
  }
}

seedDatabase();