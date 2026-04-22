# 📋 Instruções para Configurar o Banco de Dados no Supabase

## Passo 1: Acesse o Painel do Supabase

1. Acesse: https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto: **gjurkteiuwbdswumuloh**

## Passo 2: Abra o SQL Editor

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New Query"**

## Passo 3: Execute o Script SQL

Copie **TODO** o conteúdo do arquivo `create-tables.sql` e cole no editor SQL do Supabase.

Em seguida, clique em **"Run"** ou pressione `Ctrl+Enter`.

## Passo 4: Verifique as Tabelas

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver as seguintes tabelas:
   - ✅ categories
   - ✅ users
   - ✅ professional_profiles
   - ✅ professional_services
   - ✅ content_posts
   - ✅ availability_rules
   - ✅ appointments

## Passo 5: Popule com Dados de Teste (Opcional)

Após criar as tabelas, você pode executar o script `seed-db.js`:

```bash
cd elpis
node seed-db.js
```

## Passo 6: Teste a Conexão

```bash
cd elpis
npm run db:generate
npm run db:push  # Se necessário
npm run dev
```

Acesse http://localhost:3000 e faça login com:
- **Email:** ana@elpis.com
- **Senha:** 123456

---

## 📝 Script SQL para Copiar

O arquivo `create-tables.sql` contém todo o SQL necessário. Certifique-se de executar **TODO** o script de uma vez.

## 🔗 Links Úteis

- **Dashboard:** https://gjurkteiuwbdswumuloh.supabase.co
- **SQL Editor:** https://gjurkteiuwbdswumuloh.supabase.co/project/sql
- **Table Editor:** https://gjurkteiuwbdswumuloh.supabase.co/project/editor

---

**Dúvidas?** Consulte o arquivo `SETUP.md` para mais detalhes.
