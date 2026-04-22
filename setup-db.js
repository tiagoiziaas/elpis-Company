// Create tables using Supabase client with proper error handling
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

console.log('🔧 Creating tables in Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTable(table, schema) {
  try {
    // First check if table exists
    const { error: checkError } = await supabase.from(table).select('count');
    
    if (checkError && checkError.message.includes('relation')) {
      // Table doesn't exist - we need to create it via SQL
      return false;
    }
    
    console.log(`✅ Table ${table} exists`);
    return true;
  } catch (error) {
    console.log(`❌ Error checking ${table}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('\n📋 Checking existing tables...\n');
  
  const tables = ['users', 'categories', 'professional_profiles', 'professional_services', 'content_posts', 'availability_rules', 'appointments'];
  
  for (const table of tables) {
    await createTable(table);
  }
  
  console.log('\n\n💡 IMPORTANT: Tables need to be created via SQL Editor');
  console.log('\n📝 Instructions:');
  console.log('1. Go to: https://gjurkteiuwbdswumuloh.supabase.co');
  console.log('2. Click on "SQL Editor" in the left menu');
  console.log('3. Click "New Query"');
  console.log('4. Open the file: create-tables.sql');
  console.log('5. Copy ALL content and paste in the editor');
  console.log('6. Click "Run" or press Ctrl+Enter');
  console.log('\n⚠️  You MUST execute the SQL manually because:');
  console.log('   - Supabase does not allow direct DDL via REST API');
  console.log('   - Your database password may need to be verified');
  console.log('   - Firewall rules may block direct connections');
}

main();
