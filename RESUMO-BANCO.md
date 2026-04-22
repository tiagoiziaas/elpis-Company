# 🎉 Banco de Dados Configurado - Resumo

## ✅ O Que Foi Feito

1. **Arquivo .env configurado** com as credenciais do Supabase
2. **Schema Prisma** pronto com todos os modelos
3. **Scripts SQL** criados para criar as tabelas

## 📋 Próximos Passos (IMPORTANTE)

### Opção 1: Usando o Painel do Supabase (Recomendado)

1. **Acesse o SQL Editor do Supabase:**
   ```
   https://supabase.com/dashboard/project/gjurkteiuwbdswumuloh/sql/new
   ```

2. **Copie o arquivo `create-tables.sql`** (todo o conteúdo)

3. **Cole no SQL Editor** e clique em **"Run"**

4. **Execute o seed:**
   ```bash
   cd elpis
   node seed-db.js
   ```

5. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

### Opção 2: Usando psql (Se tiver instalado)

```bash
psql postgresql://postgres:Planet17566@!@db.gjurkteiuwbdswumuloh.supabase.co:5432/postgres -f create-tables.sql
```

Depois execute:
```bash
node seed-db.js
```

## 🔑 Credenciais de Teste

Após rodar o seed, use:

| Email | Senha | Profissional |
|-------|-------|-------------|
| ana@elpis.com | 123456 | Dra. Ana Silva (Nutricionista) |
| pedro@elpis.com | 123456 | Dr. Pedro Santos (Psicólogo) |
| carla@elpis.com | 123456 | Carla Oliveira (Personal) |
| lucas@elpis.com | 123456 | Dr. Lucas Mendes (Fisioterapeuta) |
| juliana@elpis.com | 123456 | Dra. Juliana Costa (Médica) |

## 📁 Arquivos Importantes

- `create-tables.sql` - Script SQL para criar as tabelas
- `seed-db.js` - Script para popular o banco
- `.env` - Configurações do banco
- `INSTRUCOES-SUPABASE.md` - Guia detalhado

## 🚀 Servidor

O servidor já está rodando em: **http://localhost:3000**

---

**Precisa de ajuda?** Execute os passos acima na ordem indicada.
