// Check table structure
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkTables() {
  console.log('📋 Checking table structures...\n');
  
  // Check professional_profiles columns
  const { data: profilesCols, error } = await supabase.rpc('get_columns', { 
    table_name: 'professional_profiles' 
  });
  
  if (error) {
    console.log('Could not get columns via RPC. Trying alternative method...');
    
    // Try querying information_schema via REST
    const { data: tableInfo, error: tableError } = await supabase
      .from('professional_profiles')
      .select('*').limit(1);
    
    if (tableError) {
      console.log('\n❌ Error:', tableError.message);
      console.log('\n💡 The table may not exist or has different structure.');
    } else {
      console.log('\n✅ professional_profiles table exists');
      if (tableInfo && tableInfo.length > 0) {
        console.log('Columns:', Object.keys(tableInfo[0]).join(', '));
      }
    }
  } else {
    console.log('professional_profiles columns:', profilesCols);
  }
  
  // Check users table
  const { data: usersInfo, error: usersError } = await supabase
    .from('users')
    .select('*').limit(1);
  
  if (usersError) {
    console.log('\n❌ users table error:', usersError.message);
  } else {
    console.log('\n✅ users table exists');
    if (usersInfo && usersInfo.length > 0) {
      console.log('Columns:', Object.keys(usersInfo[0]).join(', '));
    }
  }
}

checkTables();
