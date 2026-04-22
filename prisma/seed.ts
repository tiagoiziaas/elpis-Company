import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'nutricao' },
      update: {},
      create: {
        name: 'Nutrição',
        slug: 'nutricao',
        description: 'Nutricionistas especializados em saúde e bem-estar',
        icon: 'apple',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'psicologia' },
      update: {},
      create: {
        name: 'Psicologia',
        slug: 'psicologia',
        description: 'Psicólogos e terapeutas para saúde mental',
        icon: 'brain',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'educacao-fisica' },
      update: {},
      create: {
        name: 'Educação Física',
        slug: 'educacao-fisica',
        description: 'Personal trainers e profissionais de atividade física',
        icon: 'dumbbell',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fisioterapia' },
      update: {},
      create: {
        name: 'Fisioterapia',
        slug: 'fisioterapia',
        description: 'Fisioterapeutas para reabilitação e movimento',
        icon: 'activity',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'medicina' },
      update: {},
      create: {
        name: 'Medicina',
        slug: 'medicina',
        description: 'Médicos de diversas especialidades',
        icon: 'stethoscope',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'enfermagem' },
      update: {},
      create: {
        name: 'Enfermagem',
        slug: 'enfermagem',
        description: 'Enfermeiros e cuidados de saúde',
        icon: 'heart',
      },
    }),
  ])

  console.log('✅ Categories created')

  // Create password hash
  const passwordHash = await bcrypt.hash('123456', 10)

  // Create professionals
  const professionals = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dra. Ana Silva',
        email: 'ana@elpis.com',
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug: 'ana-silva',
            fullName: 'Dra. Ana Silva',
            title: 'Nutricionista',
            specialty: 'Nutrição Clínica e Esportiva',
            city: 'São Paulo',
            state: 'SP',
            bio: 'Nutricionista com mais de 10 anos de experiência em nutrição clínica e esportiva. Especialista em emagrecimento saudável e performance atlética.',
            approach: 'Abordagem comportamental com foco em reeducação alimentar sustentável.',
            headline: 'Transforme sua saúde através da alimentação',
            whatsapp: '11999999999',
            instagram: '@dra.anasilva',
            isPublic: true,
            categoryId: categories[0].id,
            services: {
              create: [
                {
                  title: 'Consulta de Nutrição',
                  description: 'Avaliação completa e plano alimentar personalizado',
                  price: 250,
                  duration: 60,
                },
                {
                  title: 'Acompanhamento Mensal',
                  description: '4 consultas mensais com suporte via WhatsApp',
                  price: 800,
                  duration: 60,
                },
              ],
            },
            availabilityRules: {
              create: [
                { weekDay: 1, startTime: '09:00', endTime: '18:00', active: true },
                { weekDay: 2, startTime: '09:00', endTime: '18:00', active: true },
                { weekDay: 3, startTime: '09:00', endTime: '18:00', active: true },
                { weekDay: 4, startTime: '09:00', endTime: '18:00', active: true },
                { weekDay: 5, startTime: '09:00', endTime: '17:00', active: true },
              ],
            },
          },
        },
      },
      include: { professionalProfile: true },
    }),

    prisma.user.create({
      data: {
        name: 'Dr. Pedro Santos',
        email: 'pedro@elpis.com',
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug: 'pedro-santos',
            fullName: 'Dr. Pedro Santos',
            title: 'Psicólogo',
            specialty: 'Psicoterapia Cognitivo-Comportamental',
            city: 'Rio de Janeiro',
            state: 'RJ',
            bio: 'Psicólogo clínico especializado em TCC, com foco em tratamento de ansiedade, depressão e desenvolvimento pessoal.',
            approach: 'Terapia baseada em evidências com abordagem prática e acolhedora.',
            headline: 'Cuide da sua saúde mental',
            whatsapp: '21999999999',
            instagram: '@dr.pedrosantos',
            isPublic: true,
            categoryId: categories[1].id,
            services: {
              create: [
                {
                  title: 'Sessão Individual',
                  description: 'Sessão de psicoterapia de 50 minutos',
                  price: 200,
                  duration: 50,
                },
                {
                  title: 'Pacote 4 Sessões',
                  description: '4 sessões mensais',
                  price: 720,
                  duration: 50,
                },
              ],
            },
            availabilityRules: {
              create: [
                { weekDay: 1, startTime: '10:00', endTime: '19:00', active: true },
                { weekDay: 3, startTime: '10:00', endTime: '19:00', active: true },
                { weekDay: 5, startTime: '10:00', endTime: '19:00', active: true },
              ],
            },
          },
        },
      },
      include: { professionalProfile: true },
    }),

    prisma.user.create({
      data: {
        name: 'Carla Oliveira',
        email: 'carla@elpis.com',
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug: 'carla-oliveira',
            fullName: 'Carla Oliveira',
            title: 'Personal Trainer',
            specialty: 'Treinamento Funcional e Hipertrofia',
            city: 'Belo Horizonte',
            state: 'MG',
            bio: 'Personal trainer certificada, especializada em treinamento funcional, hipertrofia e emagrecimento.',
            approach: 'Treinos personalizados e motivadores para alcançar seus objetivos.',
            headline: 'Transforme seu corpo e sua mente',
            whatsapp: '31999999999',
            instagram: '@carlaoliveira.pt',
            isPublic: true,
            categoryId: categories[2].id,
            services: {
              create: [
                {
                  title: 'Consultoria Online',
                  description: 'Treino personalizado com acompanhamento mensal',
                  price: 150,
                  duration: 30,
                },
                {
                  title: 'Personal Presencial',
                  description: 'Sessão individual de treinamento',
                  price: 120,
                  duration: 60,
                },
              ],
            },
            availabilityRules: {
              create: [
                { weekDay: 1, startTime: '06:00', endTime: '20:00', active: true },
                { weekDay: 2, startTime: '06:00', endTime: '20:00', active: true },
                { weekDay: 3, startTime: '06:00', endTime: '20:00', active: true },
                { weekDay: 4, startTime: '06:00', endTime: '20:00', active: true },
                { weekDay: 5, startTime: '06:00', endTime: '20:00', active: true },
                { weekDay: 6, startTime: '08:00', endTime: '14:00', active: true },
              ],
            },
          },
        },
      },
      include: { professionalProfile: true },
    }),

    prisma.user.create({
      data: {
        name: 'Dr. Lucas Mendes',
        email: 'lucas@elpis.com',
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug: 'lucas-mendes',
            fullName: 'Dr. Lucas Mendes',
            title: 'Fisioterapeuta',
            specialty: 'Fisioterapia Ortopédica e Esportiva',
            city: 'Curitiba',
            state: 'PR',
            bio: 'Fisioterapeuta especializado em reabilitação ortopédica e esportiva. Mestre em ciências da reabilitação.',
            approach: 'Tratamento baseado em evidências com técnicas modernas de reabilitação.',
            headline: 'Recupere seu movimento, recupere sua vida',
            whatsapp: '41999999999',
            instagram: '@dr.lucasmendes',
            isPublic: true,
            categoryId: categories[3].id,
            services: {
              create: [
                {
                  title: 'Avaliação Fisioterapêutica',
                  description: 'Avaliação completa e plano de tratamento',
                  price: 220,
                  duration: 60,
                },
                {
                  title: 'Sessão de Fisioterapia',
                  description: 'Sessão individual de tratamento',
                  price: 180,
                  duration: 50,
                },
              ],
            },
            availabilityRules: {
              create: [
                { weekDay: 1, startTime: '08:00', endTime: '18:00', active: true },
                { weekDay: 2, startTime: '08:00', endTime: '18:00', active: true },
                { weekDay: 4, startTime: '08:00', endTime: '18:00', active: true },
                { weekDay: 5, startTime: '08:00', endTime: '18:00', active: true },
              ],
            },
          },
        },
      },
      include: { professionalProfile: true },
    }),

    prisma.user.create({
      data: {
        name: 'Dra. Juliana Costa',
        email: 'juliana@elpis.com',
        passwordHash,
        role: 'PROFESSIONAL',
        professionalProfile: {
          create: {
            slug: 'juliana-costa',
            fullName: 'Dra. Juliana Costa',
            title: 'Médica',
            specialty: 'Medicina Integrativa',
            city: 'Florianópolis',
            state: 'SC',
            bio: 'Médica com abordagem integrativa, unindo medicina convencional e práticas complementares para um cuidado completo.',
            approach: 'Visão holística da saúde, tratando o paciente como um todo.',
            headline: 'Saúde integral para uma vida plena',
            whatsapp: '48999999999',
            instagram: '@dra.julianacosta',
            isPublic: true,
            categoryId: categories[4].id,
            services: {
              create: [
                {
                  title: 'Consulta Médica',
                  description: 'Consulta completa com avaliação integrativa',
                  price: 400,
                  duration: 60,
                },
                {
                  title: 'Retorno',
                  description: 'Consulta de acompanhamento',
                  price: 300,
                  duration: 45,
                },
              ],
            },
            availabilityRules: {
              create: [
                { weekDay: 2, startTime: '09:00', endTime: '17:00', active: true },
                { weekDay: 4, startTime: '09:00', endTime: '17:00', active: true },
              ],
            },
          },
        },
      },
      include: { professionalProfile: true },
    }),
  ])

  console.log('✅ Professionals created')

  // Create content posts for some professionals
  await prisma.contentPost.create({
    data: {
      professionalProfileId: professionals[0].professionalProfile!.id,
      title: '5 Dicas para uma Alimentação Mais Saudável',
      slug: '5-dicas-alimentacao-saudavel',
      excerpt: 'Descubra como transformar sua relação com a comida de forma simples e prática.',
      content: `
# 5 Dicas para uma Alimentação Mais Saudável

Mudar seus hábitos alimentares não precisa ser complicado. Aqui estão 5 dicas práticas para começar hoje mesmo:

## 1. Comece o dia com um café da manhã nutritivo

O café da manhã é a refeição mais importante do dia. Inclua proteínas, fibras e gorduras boas para manter a energia estável.

## 2. Beba água ao longo do dia

A hidratação é fundamental para o funcionamento do organismo. Mantenha uma garrafa de água sempre por perto.

## 3. Inclua vegetais em todas as refeições

Vegetais são ricos em nutrientes e fibras. Tente preencher metade do seu prato com vegetais coloridos.

## 4. Faça escolhas conscientes

Preste atenção ao que você está comendo. Evite distrações durante as refeições e saboreie cada garfada.

## 5. Planeje suas refeições

O planejamento é a chave para manter uma alimentação saudável. Prepare suas refeições com antecedência quando possível.

---

*Lembre-se: pequenas mudanças geram grandes resultados a longo prazo.*
      `,
      type: 'ARTICLE',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  await prisma.contentPost.create({
    data: {
      professionalProfileId: professionals[1].professionalProfile!.id,
      title: 'Como Lidar com a Ansiedade no Dia a Dia',
      slug: 'como-lidar-ansiedade-dia-a-dia',
      excerpt: 'Estratégias práticas para gerenciar a ansiedade e melhorar sua qualidade de vida.',
      content: `
# Como Lidar com a Ansiedade no Dia a Dia

A ansiedade é uma resposta natural do organismo, mas quando em excesso pode prejudicar nossa qualidade de vida.

## Técnicas de Respiração

A respiração diafragmática é uma ferramenta poderosa para acalmar o sistema nervoso. Pratique:

1. Inspire lentamente pelo nariz contando até 4
2. Segure a respiração contando até 4
3. Expire lentamente pela boca contando até 6
4. Repita por 5 minutos

## Mindfulness e Atenção Plena

Estar presente no momento atual reduz a ansiedade relacionada ao futuro. Pratique atividades com atenção plena.

## Atividade Física Regular

O exercício libera endorfinas e reduz os hormônios do estresse. Encontre uma atividade que você goste.

## Busque Apoio Profissional

Um psicólogo pode ajudar você a desenvolver estratégias personalizadas para lidar com a ansiedade.

---

*Cuide da sua saúde mental. Você merece.*
      `,
      type: 'ARTICLE',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  console.log('✅ Content posts created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
