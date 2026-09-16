# Ideias de Melhorias — Caju Alerta

## O que ja funciona bem

- Consulta de numeros, emails e sites suspeitos
- Cadastro de denuncias
- Portal de noticias com robot RSS
- Painel admin de jornalismo
- Dashboard de ocorrencias

---

## Melhorias Propostas

### 1. Denuncia Anonima
**Prioridade:** Alta | **Esforco:** Medio

Hoje so cadastra denuncia quem esta logado. Permitir denuncia sem login aumenta drasticamente o volume de dados do sistema.

**Como implementar:**
- Criar formulario de denuncia publico (sem necessidade de login)
- Validar campos obrigatorios (tipo, alvo, motivo)
- Salvar com `relator_uid: null` para indicar anonimo
- Na tela de consulta, mostrar "Denuncia Anonima" no lugar do nome do relator

---

### 2. Notificacao de Consultas
**Prioridade:** Media | **Esforco:** Alto

Se alguem consultar o numero/email/site que eu denunciei, eu deveria receber um aviso dizendo "sua denuncia foi consultada 15 vezes hoje". Isso da valor ao usuario e motiva a manter o cadastro atualizado.

**Como implementar:**
- Incrementar contador `totalConsultas` no documento da denuncia a cada consulta
- Na aba "Minhas Ocorrencias" do perfil, mostrar quantas vezes cada denuncia foi consultada
- Criar dashboard com grafico de consultas por dia

---

### 3. Ranking de Ameacas
**Prioridade:** Alta | **Esforco:** Medio

Mostrar os top 10 numeros mais denunciados, os sites mais reportados. Gera engajamento e curiosidade. Funciona como prova social.

**Como implementar:**
- Criar pagina `/ranking` publica
- Consultar Firestore ordenando por `totalDenuncias` ou contando ocorrências
- Exibir em cards com numero, motivo mais comum e quantidade de denuncias
- Atualizar automaticamente a cada nova denuncia

---

### 4. Verificacao WHOIS de Dominios
**Prioridade:** Media | **Esforco:** Alto

Quando alguem consulta um site, puxar automaticamente quem registrou, quando registrou e se esta ativo. Da credibilidade ao sistema.

**Como implementar:**
- Integrar com API publica de WHOIS (ex: whoisxmlapi.com tem plano gratuito)
- Na tela de consulta de sites, mostrar dados do dominio
- Alertar se o dominio foi registrado ha menos de 30 dias (possivel golpe)

---

### 5. Mapa de Golpes por Regiao
**Prioridade:** Baixa | **Esforco:** Alto

Se a denuncia tiver localizacao, mostrar um mapa com "mais golpes em Campinas", "mais golpes em SP". Visual e impactante para o TCC.

**Como implementar:**
- Adicionar campo `localizacao` (cidade/estado) no formulario de denuncia
- Integrar com Leaflet.js (gratuito) ou Google Maps
- Criar heatmap com as localizacoes das denuncias
- Mostrar ranking por estado/cidade

---

### 6. Botao "Ja Fui Vitima"
**Prioridade:** Alta | **Esforco:** Baixo

Na pagina de consulta, alem de ver a denuncia, o visitante poderia clicar "eu tambem fui vitima" sem precisar cadastrar denuncia nova. Contabiliza o impacto real.

**como implementar:**
- Adicionar botao "Eu tambem fui vitima" na pagina `noticia-completa.html` (ou na tela de consulta)
- Incrementar campo `totalVitimas` no documento da denuncia
- Criar campo `vitimas` no Firestore para registrar (por IP ou sessao) para evitar fraude
- Mostrar badge "X pessoas foram vitimas deste golpe"

---

### 7. Exportar Relatorio em PDF
**Prioridade:** Media | **Esforco:** Medio

O dashboard admin tem filtros, mas nao tem como gerar um relatorio para apresentar a autoridades ou para o TCC.

**Como implementar:**
- Usar biblioteca jsPDF (gratuita, roda no navegador)
- Na tela de consulta, adicionar botao "Exportar PDF"
- Gerar PDF com titulo, data, filtros aplicados e lista de ocorrencias
- Incluir logo do Caju Alerta no cabecalho

---

### 8. Autenticacao por Email no Cadastro
**Prioridade:** Media | **Esforco:** Baixo

O cadastro nao verifica email. Qualquer email falso cria conta. Isso enfraquece a credibilidade das denuncias.

**como implementar:**
- Reativar o `sendEmailVerification()` que ja esta comentado no codigo
- Bloquear denuncias de usuarios com email nao verificado
- Adicionar banner no perfil "Verifique seu email para poder denunciar"

---

### 9. Rate Limiting no Frontend
**Prioridade:** Baixa | **Esforco:** Medio

Hoje nao tem limite de consultas. Alguem pode abusar a API do Firestore e gerar custos.

**como implementar:**
- Limitar a 10 consultas por minuto por navegador (usando localStorage + timestamp)
- Se exceder, mostrar mensagem "Aguarde X segundos antes de consultar novamente"
- Considerar Cloud Functions com rate limit no backend tambem

---

### 10. Pagina "Sobre o Projeto"
**Prioridade:** Alta | **Esforco:** Baixo

Para o TCC, uma pagina explicando o problema, a solucao e os numeros do sistema faz toda diferenca na apresentacao.

**como implementar:**
- Criar pagina `/sobre` com:
  - Qual o problema (golpes digitais no Brasil)
  - Como o Caju Alerta resolve
  - Arquitetura do sistema
  - Estatisticas em tempo real (X denuncias, Y consultas, Z usuarios)
  - Tecnologias utilizadas
  - Printscreen do sistema funcionando

---

## Priorizacao (Maior Impacto x Menor Esforco)

| # | Ideia | Impacto | Esforco | Prioridade |
|---|-------|---------|---------|------------|
| 6 | Botao "Ja Fui Vitima" | Alto | Baixo | 1 |
| 1 | Denuncia Anonima | Alto | Medio | 2 |
| 3 | Ranking de Ameacas | Alto | Medio | 2 |
| 10 | Pagina "Sobre o Projeto" | Alto | Baixo | 1 |
| 8 | Autenticacao por Email | Medio | Baixo | 3 |
| 7 | Exportar PDF | Medio | Medio | 3 |
| 2 | Notificacao de Consultas | Medio | Alto | 4 |
| 4 | Verificacao WHOIS | Medio | Alto | 4 |
| 9 | Rate Limiting | Baixo | Medio | 5 |
| 5 | Mapa de Golpes | Baixo | Alto | 5 |

---

## Ideias para o TCC (Apresentacao)

- Mostrar evolucao de denuncias ao longo do tempo
- Demonstrar o sistema funcionando em tempo real
- Explicar a arquitetura (Firebase + Vercel + Firestore)
- Comparar com solucoes existentes (Reclame Aqui, etc.)
- Mostrar metricas de uso (consultas por dia, usuarios ativos)
