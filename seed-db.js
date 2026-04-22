// Seed database using Supabase API
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
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

console.log('🌱 Starting seed via Supabase API...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seedDatabase() {
  try {
    // First check if tables have the correct structure
    const { data: testProfile, error: profileError } = await supabase
      .from('professional_profiles')
      .select('id, slug, full_name')
      .limit(1);
    
    if (profileError && profileError.message.includes('relation')) {
      console.log('\n❌ ERROR: Tables do not exist!');
      console.log('\n📋 You need to create the tables first:');
      console.log('1. Go to: https://gjurkteiuwbdswumuloh.supabase.co');
      console.log('2. Click SQL Editor → New Query');
      console.log('3. Copy content from create-tables.sql');
      console.log('4. Paste and click Run');
      console.log('\n📖 See SETUP-BANCO.md for detailed instructions.');
      return;
    }
    
    console.log('✅ Tables exist. Seeding data...\n');
    
    const passwordHash = await bcrypt.hash('123456', 10);
    
    // Seed categories
    console.log('📁 Seeding categories...');
    const categories = [
      { name: 'Nutrição', slug: 'nutricao', description: 'Nutricionistas especializados em saúde e bem-estar', icon: 'apple' },
      { name: 'Psicologia', slug: 'psicologia', description: 'Psicólogos e terapeutas para saúde mental', icon: 'brain' },
      { name: 'Educação Física', slug: 'educacao-fisica', description: 'Personal trainers e profissionais de atividade física', icon: 'dumbbell' },
      { name: 'Fisioterapia', slug: 'fisioterapia', description: 'Fisioterapeutas para reabilitação e movimento', icon: 'activity' },
      { name: 'Medicina', slug: 'medicina', description: 'Médicos de diversas especialidades', icon: 'stethoscope' },
      { name: 'Enfermagem', slug: 'enfermagem', description: 'Enfermeiros e cuidados de saúde', icon: 'heart' }
    ];
    
    for (const cat of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(cat, { onConflict: 'slug' });
      
      if (error) {
        console.log(`  ❌ Category ${cat.name}: ${error.message}`);
      } else {
        console.log(`  ✅ ${cat.name}`);
      }
    }
    
    // Get category IDs
    const { data: catData } = await supabase.from('categories').select('id, slug');
    const categoryMap = {};
    catData.forEach(c => categoryMap[c.slug] = c.id);
    
    // Seed users
    console.log('\n👤 Seeding users...');
    const users = [
      { name: 'Dra. Ana Silva', email: 'ana@elpis.com', role: 'PROFESSIONAL' },
      { name: 'Dr. Pedro Santos', email: 'pedro@elpis.com', role: 'PROFESSIONAL' },
      { name: 'Carla Oliveira', email: 'carla@elpis.com', role: 'PROFESSIONAL' },
      { name: 'Dr. Lucas Mendes', email: 'lucas@elpis.com', role: 'PROFESSIONAL' },
      { name: 'Dra. Juliana Costa', email: 'juliana@elpis.com', role: 'PROFESSIONAL' }
    ];
    
    const userIds = {};
    
    for (const user of users) {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          name: user.name,
          email: user.email,
          password_hash: passwordHash,
          role: user.role
        }, { onConflict: 'email' })
        .select()
        .single();
      
      if (error) {
        console.log(`  ❌ User ${user.email}: ${error.message}`);
      } else {
        userIds[user.email] = data.id;
        console.log(`  ✅ ${user.name} (${user.email})`);
      }
    }
    
    console.log('\n📋 Seeding professional profiles...');
    // Seed profiles using snake_case column names
    const profiles = [
      { user_id: userIds['ana@elpis.com'], full_name: 'Dra. Ana Silva', slug: 'ana-silva', title: 'Especialista', specialty: 'Nutrição', city: 'São Paulo', state: 'SP', bio: 'Nutricionista especializada em emagrecimento saudável.', category_id: categoryMap['nutricao'] },
      { user_id: userIds['pedro@elpis.com'], full_name: 'Dr. Pedro Santos', slug: 'pedro-santos', title: 'Especialista', specialty: 'Psicologia', city: 'Rio de Janeiro', state: 'RJ', bio: 'Psicólogo clínico com foco em terapia cognitivo-comportamental.', category_id: categoryMap['psicologia'] },
      { user_id: userIds['carla@elpis.com'], full_name: 'Carla Oliveira', slug: 'carla-oliveira', title: 'Especialista', specialty: 'Educação Física', city: 'Belo Horizonte', state: 'MG', bio: 'Personal trainer especializada em condicionamento físico.', category_id: categoryMap['educacao-fisica'] },
      { user_id: userIds['lucas@elpis.com'], full_name: 'Dr. Lucas Mendes', slug: 'lucas-mendes', title: 'Especialista', specialty: 'Fisioterapia', city: 'Curitiba', state: 'PR', bio: 'Fisioterapeuta especializado em reabilitação esportiva.', category_id: categoryMap['fisioterapia'] },
      { user_id: userIds['juliana@elpis.com'], full_name: 'Dra. Juliana Costa', slug: 'juliana-costa', title: 'Especialista', specialty: 'Medicina', city: 'Florianópolis', state: 'SC', bio: 'Médica clínica geral com foco em medicina preventiva.', category_id: categoryMap['medicina'] }
    ];
    
    for (const profile of profiles) {
      const { error } = await supabase
        .from('professional_profiles')
        .upsert(profile, { onConflict: 'slug' });
      
      if (error) {
        console.log(`  ❌ Profile ${profile.full_name}: ${error.message}`);
      } else {
        console.log(`  ✅ ${profile.full_name}`);
      }
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log('\n💡 You can now login with:');
    console.log('   Email: ana@elpis.com');
    console.log('   Password: 123456');
    
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.log('\n💡 Make sure you have executed create-tables.sql first.');
    console.log('📖 See SETUP-BANCO.md for instructions.');
  }
}

seedDatabase();
