# 🚨 CAJU ALERTA - Registro e Arquitetura do Projeto (TCC)

## 📌 1. Visão Geral
*   **Nome do Projeto:** Caju Alerta
*   **Objetivo:** Plataforma de conscientização e verificação de números associados a golpes e spam (estilo "Reclame Aqui" para telefones).
*   **Regras Rigorosas:** Conformidade total com LGPD (Lei Geral de Proteção de Dados) e Marco Civil da Internet.
*   **Stack Tecnológico (Arquitetura):**
    *   **Frontend (Interface):** HTML5, CSS3, JavaScript Vanilla (Sem frameworks pesados para garantir velocidade).
    *   **Backend & Banco de Dados:** **Supabase** (Backend as a Service - PostgreSQL).
    *   **Hospedagem (Deploy):** **Vercel** para frontend e funções do backend.

---

## ✅ 2. O Que Já Foi Feito (Progresso)
*   [x] **Estruturação de Páginas:** Todas as rotas base criadas (`index`, `consulta`, `registrar`, `central-seguranca`, `alertas`, `aprenda`, `sobre`, `contato`, `cadastro`, `login`).
*   [x] **Adequação Legal (LGPD):** 
    *   Substituição do termo criminal "Denúncia" para "Registro de Ocorrência".
    *   Máscara de privacidade para telefones consultados publicamente (Ex: `(85) 9****-**99`).
*   [x] **Engenharia de Segurança (Front-end):**
    *   Obrigatoriedade de Geolocalização (Lat/Lon) para registrar um número.
    *   Validações rigorosas de E-mail (Somente Gmail/Hotmail/Outlook, sem "subaddressing" com `+`).
    *   Validação de Nome (Sem números/símbolos).
    *   Bloqueio visual para usuários não autenticados na tela de registro.
    *   Defesa de Console (Aviso anti-XSS ao apertar F12).
*   [x] **Identidade Visual Sincronizada:** Extração de cores neon (Verde Lime e Laranja) do arquivo `logo.png` aplicadas globalmente através de variáveis CSS no `common.css`. Todas as logos SVGs/Texto trocadas pela imagem oficial.
*   [x] **Limpeza de Rotas:** Remoção extensiva do sufixo `.html` de todas as âncoras (href) para permitir URLs limpas na hospedagem do Firebase.
*   [x] **Nova Feature (Vazamentos):** Criação da aba `vazamentos`, operando de forma similar ao "Have I Been Pwned", voltada para alertas de e-mails vazados.
*   [x] **Separação de Camadas:** Todo o código do site movido para a pasta `frontend/`.

---

## ⏸️ 3. Onde Paramos (O Ponto de Retorno)
O projeto está na etapa de preparação para deploy. O Supabase é o sistema principal de autenticação, banco e Storage; a Vercel hospeda a interface e a entrada serverless do Express.

**Status de Ação:** O Fabrício está criando o projeto no [Supabase](https://supabase.com).

### 🔑 Configuração necessária no ambiente:
1. **Vercel:** configurar `SUPABASE_URL`, `SUPABASE_KEY` e `ADMIN_EMAILS` nas Environment Variables.
2. **Supabase:** executar `backend/schema.sql` no SQL Editor.
3. **Segurança:** nunca versionar `backend/.env` ou chaves secretas.

---

## 🚀 4. O Que Faremos Quando Voltarmos (Próximos Passos)
Preparação realizada e próximos passos:

1. **Banco:** executar o schema e configurar as políticas RLS restantes para suporte e notícias.
2. **Vercel:** conectar o repositório e cadastrar as variáveis de ambiente.
3. **Teste:** validar login, consulta, registro, suporte e publicação de notícias.
4. **Fontes externas:** importar dados somente por jobs controlados, com fonte e data registradas; não puxar dados diretamente no navegador.

---
*Fim do documento. Sistema pronto para ser hibernado. Aguardando ativação e chaves do Supabase na próxima sessão.*
