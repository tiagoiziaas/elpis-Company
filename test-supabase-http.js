import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vntukgoskrqmmoatxmbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudHVrZ29za3JxbW1vYXR4bWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjQ0OTcsImV4cCI6MjA4OTYwMDQ5N30.o-Nh3lSYNhvw9zl9nfoXlAl25N4oRY4F4eRmZy-QnFA'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase HTTP connection...')
    
    // Test 1: Check if we can reach the API
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, slug')
      .limit(3)
    
    if (catError) {
      console.error('❌ Error fetching categories:', catError.message)
      console.error('Full error:', catError)
      return
    }
    
    console.log('✅ Connection successful!')
    console.log('Categories found:', categories?.length)
    console.log('Data:', categories)
    
    // Test 2: Check users table
    const { count, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (userError) {
      console.error('⚠️ Users table error:', userError.message)
    } else {
      console.log(`✅ Users table accessible (${count} records)`)
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnection()
