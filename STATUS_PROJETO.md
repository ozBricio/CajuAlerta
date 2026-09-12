# 🧠 CAJU ALERTA - Memória e Arquitetura do Projeto

Este documento serve como a **memória central e diretório lógico** do projeto. Ele descreve a visão geral, o que já foi construído (e suas regras lógicas inflexíveis), onde paramos e os próximos passos planejados.

---

## 🎯 1. A Ideia do Projeto
* **Nome:** Caju Alerta
* **Propósito:** Um portal acadêmico colaborativo focado na proteção contra golpes, spam e fraudes (estilo "Reclame Aqui" para telefones, e-mails e sites).
* **Fundamento Legal:** O sistema exige conformidade estrita com a **LGPD** (Lei Geral de Proteção de Dados) e o **Marco Civil da Internet**. Não somos uma delegacia (não usamos o termo "crime" ou "denúncia", apenas "registro" e "responsabilidade civil").

---

## ✅ 2. O Que Já Fizemos (Regras e Lógica Implementada)

### 🏗️ Arquitetura Front-end (Design System Rigoroso)
* **Componentização Nativa (Estilo React):** O `<header>` (menu) e o `<footer>` (rodapé com links legais) são **100% idênticos** em todas as 14 páginas do site. 
* **Botão "Acessar":** É um botão laranja sólido nativo no HTML de todas as páginas para carregamento instantâneo. Se o usuário estiver logado, o JS (`common.js`) altera o texto silenciosamente para "Minha conta" e adiciona o botão "Sair".
* **Comportamento do Menu:**
  * O fundo do menu é **Sólido (`var(--bg-color)`)** e possui `z-index: 9999` (Camada mais alta estilo Photoshop). Ele age como o "teto" da aplicação. Quando o usuário rola a página, os textos passam *por baixo* dele e nunca vazam.
  * O pulo da tela causado pela barra de rolagem do Windows foi corrigido fixando a estrutura global.

### 🛡️ Lógica de Telas e Restrições
* **A Tela de Consulta (`consulta.html`):**
  * **Lógica:** Ninguém acessa ela pelo menu. Se alguém digitar a URL direta (`/consulta`), o sistema recusa e chuta a pessoa para a Home (`/`).
  * **Como funciona:** O usuário é obrigado a usar a barra gigante da Home (`index.html`). O sistema identifica se é telefone, e-mail ou site, e projeta a página de consulta como um recibo/resultado temporário.
  * **Número Limpo:** Se o banco retornar zero relatos, o sistema exibe a frase exata: *"Este telefone está limpo. Ele não tem nenhum registro de golpista."*
* **A Tela de Registrar (`registrar.html`):**
  * **Lógica:** Apenas usuários logados acessam. Se não tiver sessão, é expulso para o Login.
  * **Legal:** O formulário só funciona se preencher tudo e aceitar geolocalização. O botão do Google reCAPTCHA é mandatório.
* **A Tela de Cadastro (`cadastro.html`):**
  * **Legal:** O usuário é fisicamente obrigado a marcar as 3 caixas de aceite (Termos de Uso, Política de Privacidade e Entendimento do Projeto Acadêmico). Sem isso, não há cadastro.

### 🚀 Deploy e Roteamento
* **Vercel Engine:** O site está configurado no `vercel.json` para ignorar o `.html` na URL (`cleanUrls: true`) de forma invisível. Ex: `cajualerta.com/noticias` abre o arquivo `frontend/noticias.html` sem erros de rota 404.

---

## ⏸️ 3. Onde Paramos (Estado Atual)

* O **Painel do Administrador** (`admin/dashboard.html`) teve seu menu esquerdo ajustado: a Logo está no topo com a saudação "Olá, Administrador", e os links para gerenciar o Portal de Notícias ("Postar no Portal" e "Minhas Postagens") foram criados.
* A lógica inicial do **Portal de Notícias** (`noticias.html`) e seu script (`noticias.js`) foi arquitetada para consumir dados via API.
* **A grande decisão atual:** O cliente/arquiteto (Fabrício) levantou a questão da **mudança do Backend**.

---

## 🚧 4. O Que Pretendemos Fazer (Próximos Passos)

1. **A Cirurgia de Banco de Dados (Supabase ➔ Firebase):**
   * Vamos excluir toda a infraestrutura baseada no Supabase (PostgreSQL).
   * O sistema será reescrito para usar o **Firebase** (Firestore + Auth) integrado diretamente na estrutura da Vercel.
   * *Objetivo:* Simplificar o acesso, gerenciar autenticação nativa do Google e trabalhar com a estrutura de documentos NoSQL.

2. **O Sistema do Jornal (Portal de Notícias Real):**
   * O Portal hoje é uma vitrine (que cai perfeitamente num Fallback de "Nenhuma notícia" se o banco estiver vazio).
   * **Próximo passo:** Desenvolver o funcionamento completo de "Jornal".
   * Criar a página para ler a reportagem completa (ex: `noticia-completa.html` ou `materia.html`).
   * Finalizar a integração onde o Administrador posta no Firebase, e a aba de Notícias puxa as matérias em tempo real.
