import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  // Test basic connection
  const { data, error } = await supabase
    .from('projects')
    .select('count')
    .limit(1);
    
  if (error) {
    console.error('Connection failed:', error);
    return;
  }
  
  console.log('✅ Connection successful');
  
  // Check if projects table exists and has data
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .limit(5);
    
  if (projectsError) {
    console.error('Projects query failed:', projectsError);
  } else {
    console.log(`Found ${projects.length} projects in database`);
    if (projects.length > 0) {
      console.log('Sample project:', projects[0]);
    }
  }
}

testConnection();