// ─── Shared Professionals Data ───────────────────────────────────────────────
// Single source of truth for all professional mock data.
// In production this would be fetched from the database via Prisma.

export interface ProfessionalService {
  id: string
  title: string
  description: string
  price: number
  duration: number
}

export interface ProfessionalContent {
  id: string
  title: string
  excerpt: string
  type: 'ARTICLE' | 'VIDEO'
  date: string
}

export interface ProfessionalData {
  name: string
  title: string
  specialty: string
  city: string
  state: string
  bio: string
  approach: string
  headline: string
  whatsapp?: string
  instagram?: string
  website?: string
  image: string | null
  rating: number
  reviews: number
  /** Tailwind gradient e.g. "from-orange-500 via-amber-400 to-orange-600" */
  gradient: string
  services: ProfessionalService[]
  availability: { day: string; hours: string }[]
  content: ProfessionalContent[]
}

export const professionalsDB: Record<string, ProfessionalData> = {
  'ana-silva-public': {
    name: 'Dra. Ana Silva',
    title: 'Nutricionista',
    specialty: 'Nutrição Clínica e Esportiva',
    city: 'São Paulo',
    state: 'SP',
    bio: `Nutricionista com mais de 10 anos de experiência em nutrição clínica e esportiva.\nEspecialista em emagrecimento saudável e performance atlética. Minha missão é ajudar\nvocê a alcançar seus objetivos de saúde através de uma alimentação equilibrada e sustentável.`,
    approach: 'Abordagem comportamental com foco em reeducação alimentar sustentável, sem restrições excessivas.',
    headline: 'Transforme sua saúde através da alimentação',
    whatsapp: '11999999999',
    instagram: '@dra.anasilva',
    website: 'www.draanasilva.com.br',
    image: null,
    rating: 4.9,
    reviews: 127,
    gradient: 'from-orange-500 via-amber-400 to-orange-600',
    services: [
      { id: '1', title: 'Consulta de Nutrição', description: 'Avaliação completa e plano alimentar personalizado', price: 250, duration: 60 },
      { id: '2', title: 'Acompanhamento Mensal', description: '4 consultas mensais com suporte via WhatsApp', price: 800, duration: 60 },
    ],
    availability: [
      { day: 'Segunda', hours: '09:00 - 18:00' },
      { day: 'Terça',   hours: '09:00 - 18:00' },
      { day: 'Quarta',  hours: '09:00 - 18:00' },
      { day: 'Quinta',  hours: '09:00 - 18:00' },
      { day: 'Sexta',   hours: '09:00 - 17:00' },
    ],
    content: [
      { id: '1', title: '5 Dicas para uma Alimentação Mais Saudável', excerpt: 'Descubra como transformar sua relação com a comida de forma simples e prática.', type: 'ARTICLE', date: '2024-03-15' },
      { id: '2', title: 'Como montar um prato saudável', excerpt: 'O método do prato saudável simplificado para o dia a dia.', type: 'VIDEO', date: '2024-02-20' },
    ],
  },

  'carlos-mendes-public': {
    name: 'Dr. Carlos Mendes',
    title: 'Psicólogo',
    specialty: 'Terapia Cognitivo-Comportamental',
    city: 'Rio de Janeiro',
    state: 'RJ',
    bio: `Psicólogo clínico especializado em Terapia Cognitivo-Comportamental (TCC) com 8 anos de experiência.\nAtendo adultos com ansiedade, depressão, fobias e questões de autoestima.\nMeu objetivo é oferecer um espaço seguro e empático para o seu crescimento pessoal.`,
    approach: 'TCC com abordagem humanista, focada no presente e em soluções práticas para o cotidiano.',
    headline: 'Sua mente merece cuidado e atenção',
    whatsapp: '21988888888',
    instagram: '@dr.carlosmendes',
    website: 'www.drcarlosmendes.com.br',
    image: null,
    rating: 4.8,
    reviews: 89,
    gradient: 'from-violet-600 via-purple-500 to-blue-600',
    services: [
      { id: '1', title: 'Sessão de Psicoterapia', description: 'Sessão individual de 50 minutos de terapia', price: 200, duration: 50 },
      { id: '2', title: 'Pacote Mensal (4 sessões)', description: '4 sessões mensais com desconto especial', price: 700, duration: 50 },
    ],
    availability: [
      { day: 'Segunda', hours: '10:00 - 19:00' },
      { day: 'Quarta',  hours: '10:00 - 19:00' },
      { day: 'Sexta',   hours: '10:00 - 17:00' },
      { day: 'Sábado',  hours: '09:00 - 13:00' },
    ],
    content: [
      { id: '1', title: 'Ansiedade: como identificar e lidar', excerpt: 'Entenda os sinais de ansiedade e aprenda técnicas de manejo eficazes.', type: 'ARTICLE', date: '2024-03-10' },
    ],
  },

  'juliana-costa-public': {
    name: 'Dra. Juliana Costa',
    title: 'Nutricionista',
    specialty: 'Nutrição Funcional e Vegana',
    city: 'Curitiba',
    state: 'PR',
    bio: `Nutricionista especializada em alimentação funcional e dietas plant-based. Há 6 anos ajudo pessoas\na adotar estilos de vida mais sustentáveis e saudáveis através da nutrição vegana e vegetariana.`,
    approach: 'Nutrição integrativa com ênfase em alimentos funcionais, super-alimentos e bem-estar global.',
    headline: 'Alimente-se bem, viva melhor',
    whatsapp: undefined,
    instagram: '@dra.julianacosta',
    website: 'www.drajulianacosta.com.br',
    image: null,
    rating: 4.7,
    reviews: 64,
    gradient: 'from-emerald-500 via-teal-400 to-cyan-600',
    services: [
      { id: '1', title: 'Consulta Nutricional', description: 'Avaliação e cardápio plant-based personalizado', price: 220, duration: 60 },
      { id: '2', title: 'Transição Vegana', description: 'Programa de 3 meses de transição para dieta vegana', price: 600, duration: 60 },
    ],
    availability: [
      { day: 'Terça',  hours: '08:00 - 17:00' },
      { day: 'Quarta', hours: '08:00 - 17:00' },
      { day: 'Quinta', hours: '08:00 - 17:00' },
    ],
    content: [
      { id: '1', title: 'Proteínas vegetais: guia completo', excerpt: 'Tudo que você precisa saber sobre proteínas de origem vegetal.', type: 'ARTICLE', date: '2024-02-28' },
    ],
  },

  'rafael-borges-public': {
    name: 'Dr. Rafael Borges',
    title: 'Psicólogo',
    specialty: 'Análise do Comportamento Aplicada',
    city: 'Belo Horizonte',
    state: 'MG',
    bio: `Psicólogo com doutorado em Análise do Comportamento Aplicada (ABA) e 12 anos de experiência clínica.\nEspecialista no atendimento de crianças e adolescentes com TEA e outros transtornos do neurodesenvolvimento.`,
    approach: 'ABA com foco em intervenções comportamentais baseadas em evidências, sempre com abordagem humanizada.',
    headline: 'Cada comportamento conta uma história',
    whatsapp: '31977777777',
    instagram: '@dr.rafaelborges',
    website: undefined,
    image: null,
    rating: 4.9,
    reviews: 203,
    gradient: 'from-rose-500 via-pink-500 to-purple-600',
    services: [
      { id: '1', title: 'Avaliação Comportamental', description: 'Avaliação completa ABA com relatório', price: 450, duration: 90 },
      { id: '2', title: 'Sessão de Intervenção', description: 'Sessão individual de intervenção comportamental', price: 250, duration: 60 },
    ],
    availability: [
      { day: 'Segunda', hours: '08:00 - 18:00' },
      { day: 'Terça',   hours: '08:00 - 18:00' },
      { day: 'Quarta',  hours: '08:00 - 18:00' },
      { day: 'Quinta',  hours: '08:00 - 18:00' },
    ],
    content: [
      { id: '1', title: 'ABA: mitos e verdades', excerpt: 'Desmistificando a Análise do Comportamento Aplicada para famílias.', type: 'ARTICLE', date: '2024-01-15' },
    ],
  },

  'fernanda-lima-public': {
    name: 'Dra. Fernanda Lima',
    title: 'Nutricionista',
    specialty: 'Nutrição Materno-Infantil',
    city: 'Salvador',
    state: 'BA',
    bio: `Nutricionista especializada em nutrição materno-infantil com 7 anos de experiência.\nAcompanho gestantes, puérperas e crianças de 0 a 12 anos.`,
    approach: 'Cuidado integral da dupla mãe-filho com nutrição baseada em evidências e suporte emocional.',
    headline: 'Nutrição com amor para cada fase da vida',
    whatsapp: undefined,
    instagram: '@dra.fernandalima',
    website: 'www.drafernandalima.com.br',
    image: null,
    rating: 4.6,
    reviews: 41,
    gradient: 'from-yellow-500 via-orange-400 to-red-500',
    services: [
      { id: '1', title: 'Consulta Gestacional', description: 'Acompanhamento nutricional durante a gestação', price: 230, duration: 60 },
      { id: '2', title: 'Nutrição Infantil', description: 'Orientação nutricional para crianças e introdução alimentar', price: 210, duration: 60 },
    ],
    availability: [
      { day: 'Segunda', hours: '09:00 - 17:00' },
      { day: 'Quarta',  hours: '09:00 - 17:00' },
      { day: 'Sexta',   hours: '09:00 - 15:00' },
    ],
    content: [
      { id: '1', title: 'Introdução alimentar: por onde começar', excerpt: 'Um guia completo para a primeira papinha do seu bebê.', type: 'VIDEO', date: '2024-03-05' },
    ],
  },

  'patricia-rocha-public': {
    name: 'Dra. Patrícia Rocha',
    title: 'Psicóloga',
    specialty: 'Psicoterapia Humanista e Gestalt',
    city: 'Porto Alegre',
    state: 'RS',
    bio: `Psicóloga com 9 anos de experiência em psicoterapia humanista e abordagem gestáltica.\nTrabalho com adultos em processos de autoconhecimento, superação de traumas e desenvolvimento pessoal.`,
    approach: 'Psicoterapia gestáltica com foco no aqui e agora, na experiência corporal e no autoconhecimento profundo.',
    headline: 'Você tem o poder de se transformar',
    whatsapp: '51966666666',
    instagram: '@dra.patriciarocha',
    website: 'www.drapatricia.com.br',
    image: null,
    rating: 4.8,
    reviews: 76,
    gradient: 'from-sky-500 via-blue-400 to-indigo-600',
    services: [
      { id: '1', title: 'Sessão de Psicoterapia', description: 'Sessão de psicoterapia humanista individual', price: 180, duration: 50 },
      { id: '2', title: 'Pacote Trimestral', description: '12 sessões com acompanhamento estruturado', price: 1800, duration: 50 },
    ],
    availability: [
      { day: 'Terça',  hours: '09:00 - 18:00' },
      { day: 'Quinta', hours: '09:00 - 18:00' },
      { day: 'Sexta',  hours: '09:00 - 18:00' },
      { day: 'Sábado', hours: '09:00 - 12:00' },
    ],
    content: [
      { id: '1', title: 'Gestalt: a terapia do presente', excerpt: 'Entenda como a abordagem gestáltica pode transformar sua vida.', type: 'ARTICLE', date: '2024-02-10' },
    ],
  },
}
