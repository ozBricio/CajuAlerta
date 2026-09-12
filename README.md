# Caju Alerta

Portal gratuito de consulta e educação contra golpes digitais.

## Arquitetura

- `frontend/`: interface publicada pela Vercel.
- `backend/`: API Node/Express executada como função serverless pela Vercel, com acesso seguro ao Supabase.
- Supabase: Auth, PostgreSQL e Storage.
- `.env`: somente no backend local ou nas variáveis do serviço que hospedar a API.

O `vercel.json` direciona `/` para o frontend e `/api/*` para a função serverless. O frontend usa a própria origem para chamar a API.

## API de números denunciados

Não existe uma API pública oficial e confiável da Anatel que forneça uma lista completa de números de golpes pronta para consulta. A plataforma usa os registros próprios e pode importar fontes externas somente quando houver autorização, formato documentado e fonte verificável.

O schema possui `fontes_externas` e `ocorrencias_externas` para guardar nome da fonte, URL, identificador original, data e tipo. O sistema não deve raspar páginas públicas nem copiar dados sem origem e sem atualização controlada.

## Backend

Execute localmente:

```powershell
Push-Location backend
npm install
npm start
```

Configure `SUPABASE_URL`, `SUPABASE_KEY` e `ADMIN_EMAILS` em `backend/.env`. Nunca publique esse arquivo.

O Supabase fornece banco, Auth, Storage e Edge Functions. A API Express é executada pela Vercel como função serverless e usa o Supabase como backend de dados e autenticação.