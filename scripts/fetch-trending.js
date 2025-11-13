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
  'ai': 'AI',
  'machine-learning': 'AI',
  'deep-learning': 'AI',
  'artificial-intelligence': 'AI',
  'llm': 'AI',
  'web': 'WebDev',
  'react': 'WebDev',
  'vue': 'WebDev',
  'angular': 'WebDev',
  'frontend': 'WebDev',
  'backend': 'WebDev',
  'devops': 'DevOps',
  'kubernetes': 'DevOps',
  'docker': 'DevOps',
  'ci-cd': 'DevOps',
  'mobile': 'Mobile',
  'ios': 'Mobile',
  'android': 'Mobile',
  'react-native': 'Mobile',
  'data': 'Data',
  'database': 'Data',
  'analytics': 'Data',
  'security': 'Security',
  'cybersecurity': 'Security',
  'tools': 'Tools',
  'cli': 'Tools',
  'game': 'Gaming',
  'gaming': 'Gaming',
};

// Fetch trending repositories from GitHub
async function fetchTrending() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/search/repositories?q=created:>2025-01-01&sort=stars&order=desc&per_page=30',
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
  // Check topics first
  if (topics && topics.length > 0) {
    for (const topic of topics) {
      const normalized = topic.toLowerCase();
      if (categoryMapping[normalized]) {
        return categoryMapping[normalized];
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
  
  return 'Other';
}

// Insert projects into Supabase
async function insertProjects(projects) {
  const url = `${SUPABASE_URL}/rest/v1/projects`;
  
  const body = JSON.stringify(projects.map(repo => ({
    repo_name: repo.full_name,
    repo_url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics || [],
    category: determineCategory(repo.topics, repo.language),
    featured_date: new Date().toISOString().split('T')[0],
  })));

  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: '/rest/v1/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Successfully inserted projects');
          resolve(data);
        } else {
          console.error('❌ Supabase error:', res.statusCode, data);
          reject(new Error(`Supabase error: ${res.statusCode}`));
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
