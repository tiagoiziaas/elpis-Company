// Check professional_profiles structure
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

async function checkProfileStructure() {
  console.log('📋 Checking professional_profiles structure...\n');
  
  // Try to insert a test record to see what columns exist
  const { data, error } = await supabase
    .from('professional_profiles')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    if (data && data.length > 0) {
      console.log('✅ Found', data.length, 'records');
      console.log('\nColumns:', Object.keys(data[0]).join(', '));
      console.log('\nSample record:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️  Table is empty. Checking columns via error...');
      
      // Try inserting with wrong column to get schema info
      const { error: testError } = await supabase
        .from('professional_profiles')
        .insert({ test_column: 'test' });
      
      if (testError) {
        console.log('Error message:', testError.message);
      }
    }
  }
}

checkProfileStructure();
