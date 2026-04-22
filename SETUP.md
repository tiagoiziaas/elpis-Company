# Elpis - Setup Guide

## ✅ Build Status: SUCCESS

The application has been built successfully with **21 routes** compiled without errors.

---

## 🚀 Quick Start Guide

### Step 1: Configure Supabase Database

1. **Create a Supabase account** at https://supabase.com
2. **Create a new project** (choose a strong password - you'll need it for DATABASE_URL)
3. **Get your credentials** from the Supabase dashboard:
   - Go to **Settings** → **API**
   - Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy the **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
4. **Get Database Connection String**:
   - Go to **Settings** → **Database**
   - Under **Connection string** → **URI**, copy the string
   - Replace `[YOUR-PASSWORD]` with your database password → `DATABASE_URL`

### Step 2: Generate NextAuth Secret

Open PowerShell or Command Prompt and run:

```bash
openssl rand -base64 32
```

Copy the output → `NEXTAUTH_SECRET`

### Step 3: Update .env File

Edit `elpis/.env` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
```

### Step 4: Set Up Database

Run these commands in the `elpis` folder:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### Step 5: Run Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

---

## 📊 Test Credentials

After running the seed script, you can test with these accounts:

**All passwords are: `123456`**

| Email | Professional | Specialty | Location |
|-------|-------------|-----------|----------|
| ana@elpis.com | Dra. Ana Silva | Nutrição | São Paulo, SP |
| pedro@elpis.com | Dr. Pedro Santos | Psicologia | Rio de Janeiro, RJ |
| carla@elpis.com | Carla Oliveira | Educação Física | Belo Horizonte, MG |
| lucas@elpis.com | Dr. Lucas Mendes | Fisioterapia | Curitiba, PR |
| juliana@elpis.com | Dra. Juliana Costa | Medicina | Florianópolis, SC |

---

## 📁 Project Structure

```
elpis/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── seed.ts             # Sample data script
├── src/
│   ├── app/
│   │   ├── api/            # Backend API routes
│   │   │   ├── appointments/
│   │   │   ├── auth/
│   │   │   ├── availability/
│   │   │   ├── content/
│   │   │   └── professional/
│   │   ├── buscar/         # Search professionals page
│   │   ├── cadastro/       # Registration pages
│   │   ├── dashboard/      # Professional dashboard
│   │   ├── login/          # Login page
│   │   ├── profissional/   # Public profile pages
│   │   ├── fonts/          # Surgena font files
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── layout/         # Header, Footer
│   │   └── ui/             # Reusable UI components
│   └── lib/
│       ├── authOptions.ts  # NextAuth configuration
│       ├── prisma.ts       # Prisma client
│       ├── supabase.ts     # Supabase client
│       └── utils.ts        # Helper functions
├── .env                    # Environment variables
├── .env.example            # Example .env
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠 Available Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Sync schema to database
npm run db:seed          # Populate database with sample data

# Linting
npm run lint             # Run ESLint
```

---

## 🎨 Features Implemented

### Frontend Pages
- ✅ Home page with premium landing design
- ✅ Professional search with filters (specialty, city)
- ✅ Individual professional public profiles
- ✅ Professional dashboard (6 sections)
- ✅ Login and registration flows
- ✅ Responsive design for all screen sizes

### Backend APIs
- ✅ `/api/auth/register-professional` - Professional registration
- ✅ `/api/auth/[...nextauth]` - Authentication
- ✅ `/api/professional` - Profile management
- ✅ `/api/appointments` - Appointment booking
- ✅ `/api/content` - Content post management
- ✅ `/api/availability` - Schedule availability

### Database Models
- ✅ User (authentication)
- ✅ ProfessionalProfile (public profiles)
- ✅ ProfessionalService (services offered)
- ✅ ContentPost (articles/videos)
- ✅ AvailabilityRule (weekly schedule)
- ✅ Appointment (bookings)
- ✅ Category (specialties)

### UI/UX Features
- ✅ Premium design system
- ✅ Surgena brand font
- ✅ Orange (#F97316) brand colors
- ✅ Framer Motion animations
- ✅ Dark mode support (CSS)
- ✅ Premium components (Radix UI)

---

## ⚠️ Important Notes

### Font Files
- **Surgena.ttf** is included (regular weight)
- Bold weight uses CSS `font-weight: 700`
- Fonts are located in `src/app/fonts/`

### Environment Variables
- Never commit `.env` to version control
- Use `.env.example` as a template
- Keep your Supabase keys secure

### Database Schema
- The schema uses snake_case in the database (via `@@map`)
- TypeScript models use camelCase
- Prisma handles the conversion automatically

---

## 🔧 Troubleshooting

### Build Errors
If you encounter build errors:
```bash
# Clean cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify your DATABASE_URL includes the correct password
- Check that your Supabase project is active
- Ensure you've run `npm run db:push`

### Authentication Issues
- Make sure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Check that credentials match seeded data

---

## 📈 Next Steps for Production

1. **Configure custom domain** in Supabase and Vercel/Netlify
2. **Set up email service** for password reset and notifications
3. **Configure Supabase Storage** for image uploads
4. **Add payment integration** for professional subscriptions
5. **Enable HTTPS** in production
6. **Set up monitoring** (Sentry, LogRocket, etc.)
7. **Add analytics** (Google Analytics, Mixpanel)
8. **Implement rate limiting** for API routes
9. **Add comprehensive testing** (Jest, Playwright)
10. **Set up CI/CD** pipeline

---

## 📞 Support

For issues or questions:
1. Check the `STATUS.md` file for project overview
2. Review `prisma/schema.prisma` for database structure
3. Check API routes in `src/app/api/` for backend logic

---

**Last Updated:** March 20, 2026  
**Build Status:** ✅ Successful (21 routes)  
**Server:** Running at http://localhost:3000
