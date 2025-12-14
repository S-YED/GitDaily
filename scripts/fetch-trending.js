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

import 'dotenv/config';
import https from 'https';
import {
  normalizeTopics,
  buildSummary,
  buildWhyTrending,
  resolveDemoUrl,
} from './lib/project-metadata.js';
import { determineCategory } from './lib/category-mapper.js';

// Configuration
// NOTE: GitHub Actions secrets cannot be named "GITHUB_TOKEN", but we can still
// expose the token to the script as either env var name.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TRENDING_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GITHUB_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  const missing = [
    !GITHUB_TOKEN ? 'GITHUB_TOKEN (or GH_TRENDING_TOKEN)' : null,
    !SUPABASE_URL ? 'SUPABASE_URL' : null,
    !SUPABASE_SERVICE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY' : null,
  ].filter(Boolean);
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// Best-effort sanity check: warn if the provided key doesn't look like a service role JWT.
try {
  const [, payload] = String(SUPABASE_SERVICE_KEY).split('.');
  if (payload) {
    const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    const role = json?.role;
    if (role && role !== 'service_role') {
      console.warn(`⚠️ SUPABASE_SERVICE_ROLE_KEY role is "${role}" (expected "service_role"). Deletes/updates may be blocked by RLS.`);
    }
  }
} catch {
  // ignore
}


const LOOKBACK_DAYS = Number(process.env.TRENDING_LOOKBACK_DAYS || 7);
const RUN_DAY = new Date();
const TODAY = RUN_DAY.toISOString().split('T')[0];

const getSinceDate = () => {
  const since = new Date();
  since.setDate(since.getDate() - Math.max(1, LOOKBACK_DAYS));
  return since.toISOString().split('T')[0];
};

// Fetch trending repositories from GitHub
async function fetchTrending() {
  const createdAfter = getSinceDate();
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/search/repositories?q=created:%3E${createdAfter}&sort=stars&order=desc&per_page=30`,
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

// Insert projects one by one to handle duplicates
async function insertProjects(projects, featuredDate = TODAY) {
  let inserted = 0;
  let updated = 0;
  
  for (const repo of projects) {
    const category = determineCategory({
      topics: repo.topics,
      language: repo.language,
      repoName: repo.full_name,
    });
    const projectData = {
      repo_name: repo.full_name,
      repo_url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: normalizeTopics(repo.topics, category),
      category,
      featured_date: featuredDate,
      ai_summary: buildSummary({
        name: repo.full_name,
        description: repo.description,
        category,
        language: repo.language,
      }),
      why_trending: buildWhyTrending({
        name: repo.full_name,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        category,
        windowDays: LOOKBACK_DAYS,
      }),
      demo_url: resolveDemoUrl({ homepage: repo.homepage, repoUrl: repo.html_url }),
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

async function cleanupOldProjects(featuredDate = TODAY) {
  console.log(`🧹 Removing projects dated before ${featuredDate}...`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: `/rest/v1/projects?featured_date=lt.${featuredDate}`,
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const removed = data ? (() => {
            try {
              const parsed = JSON.parse(data);
              return Array.isArray(parsed) ? parsed.length : 0;
            } catch {
              return 0;
            }
          })() : 0;
          console.log(`🧽 Cleanup removed ${removed} stale project${removed === 1 ? '' : 's'}.`);
          resolve();
        } else {
          reject(new Error(`${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
}

async function purgeProjectsForDate(featuredDate = TODAY) {
  console.log(`🧼 Clearing existing projects for ${featuredDate} before insert...`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(SUPABASE_URL).hostname,
      path: `/rest/v1/projects?featured_date=eq.${featuredDate}`,
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const removed = data ? (() => {
            try {
              const parsed = JSON.parse(data);
              return Array.isArray(parsed) ? parsed.length : 0;
            } catch {
              return 0;
            }
          })() : 0;
          console.log(`🧾 Removed ${removed} project${removed === 1 ? '' : 's'} for ${featuredDate}.`);
          resolve();
        } else {
          reject(new Error(`${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
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
      featured_date: projectData.featured_date,
      language: projectData.language,
      topics: projectData.topics,
      category: projectData.category,
      ai_summary: projectData.ai_summary,
      why_trending: projectData.why_trending,
      demo_url: projectData.demo_url,
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
    console.log(`🚀 Fetching trending repositories created after ${getSinceDate()}...`);
    const data = await fetchTrending();
    
    if (!data.items || data.items.length === 0) {
      console.log('⚠️  No repositories found');
      return;
    }
    
    console.log(`📦 Found ${data.items.length} repositories`);
    
    await purgeProjectsForDate(TODAY);
    // Insert into Supabase
    await insertProjects(data.items, TODAY);
    await cleanupOldProjects(TODAY);
    
    console.log('✅ Daily fetch completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
