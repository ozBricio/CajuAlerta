# Caju Alerta

Portal gratuito de consulta e educação contra golpes digitais.

## Arquitetura

- `frontend/`: site estático publicado pelo GitHub Pages.
- `backend/`: API Node/Express, autenticação e acesso seguro ao Supabase.
- Supabase: Auth, PostgreSQL e Storage.
- `.env`: somente no backend local ou nas variáveis do serviço que hospedar a API.

GitHub Pages não executa Node.js. Antes de publicar, substitua `https://SEU-BACKEND.example.com` em `frontend/assets/js/common.js` pela URL pública do backend. O backend não deve ser colocado no GitHub Pages.

## API de números denunciados

Não existe uma API pública oficial e confiável da Anatel que forneça uma lista completa de números de golpes pronta para consulta. A plataforma usa os registros próprios e pode importar fontes externas somente quando houver autorização, formato documentado e fonte verificável.

O schema possui `fontes_externas` e `ocorrencias_externas` para guardar nome da fonte, URL, identificador original, data e tipo. O sistema não deve raspar páginas públicas nem copiar dados sem origem e sem atualização controlada.

## GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` publica somente `frontend/`. Ative Pages usando GitHub Actions nas configurações do repositório.

## Backend

Execute localmente:

```powershell
Push-Location backend
npm install
npm start
```

Configure `SUPABASE_URL`, `SUPABASE_KEY` e `ADMIN_EMAILS` em `backend/.env`. Nunca publique esse arquivo.

O Supabase fornece banco, Auth, Storage e Edge Functions. Ele não executa diretamente este `server.js`; para manter esta API Express, hospede o backend em um serviço Node separado ou migre as rotas para Edge Functions do Supabase.