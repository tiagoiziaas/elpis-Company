const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

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
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Setting up database...')
console.log('URL:', SUPABASE_URL)

async function runSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SQL Error: ${error}`)
  }
  
  return response.json()
}

async function createTables() {
  const sql = fs.readFileSync(path.resolve(__dirname, 'create-tables.sql'), 'utf-8')
  
  try {
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(s => s.trim().length > 0)
    
    for (const stmt of statements) {
      if (stmt.trim().startsWith('--')) continue
      
      try {
        await runSQL(stmt)
        console.log('✅ Executed:', stmt.substring(0, 50).replace(/\n/g, ' ') + '...')
      } catch (err) {
        // Ignore already exists errors
        if (!err.message.includes('already exists')) {
          console.log('⚠️  Warning:', err.message.substring(0, 100))
        }
      }
    }
    
    console.log('\n✅ Tables created successfully!')
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

createTables()
