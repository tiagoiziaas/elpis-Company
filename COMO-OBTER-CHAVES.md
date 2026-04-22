# 📋 COMO OBTER AS CHVES DO SUPABASE

## Passo 1: Acesse o Dashboard do Supabase

1. Acesse: **https://supabase.com**
2. Faça login na sua conta
3. Clique no projeto: **gjurkteiuwbdswumuloh**

## Passo 2: Obter as Chaves de API

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá as seguintes chaves:

### Project URL
```
https://gjurkteiuwbdswumuloh.supabase.co
```

### Publishable key (anon key)
```
Copie esta chave → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### service_role key (SECRET key)
```
Copie esta chave → SUPABASE_SERVICE_ROLE_KEY
```
⚠️ **Atenção:** Esta chave é secreta! Não compartilhe.

## Passo 3: Obter a Senha do Banco

1. No menu lateral, clique em **"Settings"** → **"Database"**
2. Em **"Connection string"**, veja a senha entre colchetes:
   ```
   postgresql://postgres:[SUA_SENHA]@db.gjurkteiuwbdswumuloh.supabase.co:5432/postgres
   ```
3. A senha é o que está entre `[` e `]`

## Passo 4: Atualizar o Arquivo .env

Edite o arquivo `.env` com as chaves corretas:

```env
# URL do projeto
NEXT_PUBLIC_SUPABASE_URL=https://gjurkteiuwbdswumuloh.supabase.co

# Chave ANON (Publishable key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=COPIE_AQUI_SUA_CHAVE_ANON

# Chave SERVICE_ROLE (Secret key)
SUPABASE_SERVICE_ROLE_KEY=COPIE_AQUI_SUA_CHAVE_SECRET

# Database
DATABASE_URL=postgresql://postgres:SUA_SENHA_AQUI@db.gjurkteiuwbdswumuloh.supabase.co:5432/postgres?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Elpis2026SecretKeyForNextAuthSuperSecure123
```

## Passo 5: Testar a Conexão

```bash
cd elpis
node test-connection.js
```

Se aparecer "✅ Connection successful!", as chaves estão corretas!

## Passo 6: Criar Tabelas

1. Acesse: https://supabase.com/dashboard/project/gjurkteiuwbdswumuloh/sql/new
2. Copie o arquivo `create-tables.sql`
3. Cole no SQL Editor
4. Clique em "Run"

## Passo 7: Popular com Dados

```bash
node seed-db.js
```

---

**Dúvidas?** Consulte `INSTRUCOES-SUPABASE.md`
