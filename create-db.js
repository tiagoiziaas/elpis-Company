// Create tables in Supabase database using direct PostgreSQL connection
const { Pool } = require('pg');
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

// Use DIRECT_URL for schema operations
const directUrl = env.DIRECT_URL || env.DATABASE_URL;

console.log('🔧 Connecting to PostgreSQL...');
console.log('Connection:', directUrl.replace(/:[^:]+@/, ':***@'));

const pool = new Pool({
  connectionString: directUrl,
  ssl: { rejectUnauthorized: false }
});

// Override SSL check for self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function createTables() {
  console.log('\n📋 Reading create-tables.sql...');
  const sqlPath = path.resolve(__dirname, 'create-tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to database!');
    
    console.log('\n📊 Executing SQL script...\n');
    
    await client.query(sql);
    
    console.log('✅ All tables created successfully!\n');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables in database:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    console.log('\n💡 Next steps:');
    console.log('1. Run: npm run db:generate');
    console.log('2. Run: npm run dev');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check if your IP is allowed in Supabase firewall');
    console.log('2. Go to Supabase Dashboard -> Settings -> Database -> Connection string');
    console.log('3. Add your IP to the allow list');
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

createTables().catch(console.error);
