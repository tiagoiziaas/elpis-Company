# 🚀 SETUP DO BANCO DE DADOS - Elpis

## ⚠️ IMPORTANTE - Leia Primeiro

O Supabase **não permite** criar tabelas via API/programaticamente por motivos de segurança.
Você precisa executar o SQL manualmente no painel do Supabase.

---

## 📋 Passo a Passo

### Passo 1: Acesse o SQL Editor do Supabase

1. Abra o link: **https://gjurkteiuwbdswumuloh.supabase.co**
2. Faça login na sua conta
3. No menu lateral esquerdo, clique em **"SQL Editor"**
4. Clique em **"New Query"**

### Passo 2: Execute o Script SQL

1. Abra o arquivo `create-tables.sql` (está na pasta deste projeto)
2. **Copie TODO o conteúdo** do arquivo
3. **Cole** no editor SQL do Supabase
4. Clique em **"Run"** ou pressione `Ctrl+Enter`

### Passo 3: Verifique as Tabelas

Após executar, você deve ver a mensagem "Success. No rows returned" e no menu **"Table Editor"** aparecerão:

- ✅ categories
- ✅ users  
- ✅ professional_profiles
- ✅ professional_services
- ✅ content_posts
- ✅ availability_rules
- ✅ appointments

### Passo 4: Rode o Seed

No terminal, na pasta `elpis`:

```bash
node seed-db.js
```

Isso vai popular o banco com dados de teste.

### Passo 5: Teste o Login

Acesse http://localhost:3000 e use:

- **Email:** ana@elpis.com
- **Senha:** 123456

---

## 🔧 Problemas Comuns

### Erro: "Tenant or user not found"

Isso ocorre quando o Prisma tenta conectar direto no banco. **Solução:** Use a API do Supabase (seed-db.js já faz isso).

### Erro: "relation does not exist"

As tabelas não foram criadas. **Solução:** Execute o Passo 2 acima.

### Erro: "permission denied"

Seu usuário não tem permissão. **Solução:** Use a chave `service_role` no `.env`.

---

## 📞 Precisa de Ajuda?

1. Verifique se executou o SQL no editor do Supabase
2. Confira se o `.env` está correto
3. Execute `node test-db-connection.js` para testar

---

**Última atualização:** 20 de Março de 2026
