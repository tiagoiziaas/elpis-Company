const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env
const envPath = path.resolve(__dirname, '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    process.env[key.trim()] = value.trim()
  }
})

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', SUPABASE_URL)
console.log('Anon Key:', SUPABASE_ANON_KEY.substring(0, 30) + '...')
console.log('Service Key:', SUPABASE_SERVICE_KEY.substring(0, 30) + '...\n')

// Test with service key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function testConnection() {
  try {
    // Try to list tables
    const { data, error } = await supabase
      .from('categories')
      .select('*')
    
    if (error) {
      console.log('❌ Error:', error.message)
      console.log('\n⚠️  Tables may not exist yet!')
      console.log('\n📋 Please execute the SQL script first:')
      console.log('1. Acesse: https://supabase.com/dashboard/project/gjurkteiuwbdswumuloh/sql/new')
      console.log('2. Copie o arquivo: create-tables.sql')
      console.log('3. Cole no SQL Editor e clique em "Run"')
    } else {
      console.log('✅ Connection successful!')
      console.log('✅ Categories found:', data?.length || 0)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testConnection()
