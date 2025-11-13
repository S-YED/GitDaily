/**
 * Daily Trending Fetch Script
 * 
 * This script fetches trending repositories from GitHub and inserts them into Supabase.
 * It runs daily via GitHub Actions.
 * 
 * Requirements:
 * - GITHUB_TOKEN: GitHub Personal Access Token (set in GitHub Secrets)
 * - SUPABASE_URL: Your Supabase project URL (set in GitHub Secrets)
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key (set in GitHub Secrets)
 */

import https from 'https';

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GITHUB_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Category mapping based on topics/languages
const categoryMapping = {
  // AI & Machine Learning
  'ai': 'AI', 'artificial-intelligence': 'AI', 'machine-learning': 'AI', 'deep-learning': 'AI',
  'llm': 'AI', 'neural-network': 'AI', 'tensorflow': 'AI', 'pytorch': 'AI', 'opencv': 'AI',
  'nlp': 'AI', 'computer-vision': 'AI', 'chatbot': 'AI', 'gpt': 'AI', 'transformers': 'AI',
  
  // Web Development
  'web': 'WebDev', 'frontend': 'WebDev', 'backend': 'WebDev', 'fullstack': 'WebDev',
  'react': 'WebDev', 'vue': 'WebDev', 'angular': 'WebDev', 'svelte': 'WebDev', 'nextjs': 'WebDev',
  'nodejs': 'WebDev', 'express': 'WebDev', 'fastapi': 'WebDev', 'django': 'WebDev', 'flask': 'WebDev',
  'javascript': 'WebDev', 'typescript': 'WebDev', 'html': 'WebDev', 'css': 'WebDev', 'sass': 'WebDev',
  'tailwindcss': 'WebDev', 'bootstrap': 'WebDev', 'webpack': 'WebDev', 'vite': 'WebDev',
  'api': 'WebDev', 'rest': 'WebDev', 'graphql': 'WebDev', 'websocket': 'WebDev',
  
  // DevOps & Infrastructure
  'devops': 'DevOps', 'kubernetes': 'DevOps', 'docker': 'DevOps', 'ci-cd': 'DevOps',
  'terraform': 'DevOps', 'ansible': 'DevOps', 'jenkins': 'DevOps', 'github-actions': 'DevOps',
  'aws': 'DevOps', 'azure': 'DevOps', 'gcp': 'DevOps', 'cloud': 'DevOps', 'serverless': 'DevOps',
  'monitoring': 'DevOps', 'prometheus': 'DevOps', 'grafana': 'DevOps', 'nginx': 'DevOps',
  
  // Mobile Development
  'mobile': 'Mobile', 'ios': 'Mobile', 'android': 'Mobile', 'react-native': 'Mobile',
  'flutter': 'Mobile', 'swift': 'Mobile', 'kotlin': 'Mobile', 'xamarin': 'Mobile',
  'ionic': 'Mobile', 'cordova': 'Mobile', 'app': 'Mobile',
  
  // Data & Analytics
  'data': 'Data', 'database': 'Data', 'analytics': 'Data', 'big-data': 'Data',
  'sql': 'Data', 'postgresql': 'Data', 'mysql': 'Data', 'mongodb': 'Data', 'redis': 'Data',
  'elasticsearch': 'Data', 'spark': 'Data', 'hadoop': 'Data', 'etl': 'Data', 'data-science': 'Data',
  'pandas': 'Data', 'numpy': 'Data', 'jupyter': 'Data', 'visualization': 'Data',
  
  // Security
  'security': 'Security', 'cybersecurity': 'Security', 'encryption': 'Security',
  'authentication': 'Security', 'oauth': 'Security', 'jwt': 'Security', 'penetration-testing': 'Security',
  'vulnerability': 'Security', 'firewall': 'Security', 'blockchain': 'Security',
  
  // Tools & Utilities
  'tools': 'Tools', 'cli': 'Tools', 'utility': 'Tools', 'automation': 'Tools',
  'productivity': 'Tools', 'editor': 'Tools', 'ide': 'Tools', 'vscode': 'Tools',
  'git': 'Tools', 'github': 'Tools', 'terminal': 'Tools', 'shell': 'Tools',
  
  // Gaming
  'game': 'Gaming', 'gaming': 'Gaming', 'unity': 'Gaming', 'unreal': 'Gaming',
  'gamedev': 'Gaming', 'game-engine': 'Gaming', '2d': 'Gaming', '3d': 'Gaming',
  
  // Languages -> Categories
  'python': 'AI', 'java': 'WebDev', 'c++': 'Tools', 'c#': 'Tools', 'go': 'DevOps',
  'rust': 'Tools', 'php': 'WebDev', 'ruby': 'WebDev', 'scala': 'Data', 'r': 'Data',
  'matlab': 'Data', 'shell': 'DevOps', 'powershell': 'DevOps', 'bash': 'DevOps'
};

// Fetch trending repositories from GitHub
async function fetchTrending() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/search/repositories?q=created:>2024-12-01&sort=stars&order=desc&per_page=30',
      method: 'GET',
      headers: {
        'User-Agent': 'GitDaily-Bot',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`GitHub API error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Determine category based on topics and language
function determineCategory(topics, language) {
  // Check topics first (more specific)
  if (topics && topics.length > 0) {
    for (const topic of topics) {
      const normalized = topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (categoryMapping[normalized]) {
        return categoryMapping[normalized];
      }
      // Also check partial matches
      for (const [key, category] of Object.entries(categoryMapping)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          return category;
        }
      }
    }
  }
  
  // Check language
  if (language) {
    const normalized = language.toLowerCase();
    if (categoryMapping[normalized]) {
      return categoryMapping[normalized];
    }
  }
  
  // Check repo name for hints
  return 'Tools'; // Default to Tools instead of Other
}

// Insert projects one by one to handle duplicates
async function insertProjects(projects) {
  let inserted = 0;
  let updated = 0;
  
  for (const repo of projects) {
    const projectData = {
      repo_name: repo.full_name,
      repo_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      category: determineCategory(repo.topics, repo.language),
      featured_date: new Date().toISOString().split('T')[0],
    };
    
    try {
      await insertSingleProject(projectData);
      inserted++;
    } catch (error) {
      if (error.message.includes('409')) {
        // Try to update existing project
        try {
          await updateProject(projectData);
          updated++;
        } catch (updateError) {
          console.log(`⚠️ Skipped ${repo.full_name}: already exists`);
        }
      } else {
        console.error(`❌ Error with ${repo.full_name}:`, error.message);
      }
    }
  }
  
  console.log(`✅ Processed: ${inserted} new, ${updated} updated`);
}

// Insert single project
function insertSingleProject(projectData) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(projectData);
    
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: '/rest/v1/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

// Update existing project
function updateProject(projectData) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      stars: projectData.stars,
      forks: projectData.forks,
      featured_date: projectData.featured_date
    });
    
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: `/rest/v1/projects?repo_url=eq.${encodeURIComponent(projectData.repo_url)}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log('🚀 Fetching trending repositories...');
    const data = await fetchTrending();
    
    if (!data.items || data.items.length === 0) {
      console.log('⚠️  No repositories found');
      return;
    }
    
    console.log(`📦 Found ${data.items.length} repositories`);
    
    // Insert into Supabase
    await insertProjects(data.items);
    
    console.log('✅ Daily fetch completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
