# Robô de Notícias (Auto-Publish)

## O que é?
Um sistema construído dentro da pasta `api/robo-noticias.js` que funciona como um "backend serverless" utilizando os recursos gratuitos do Vercel e Vercel Cron.

Ele lê feeds RSS de portais de tecnologia (como G1 e Tecnoblog) a cada 4 horas, filtra notícias contendo palavras-chave sobre segurança digital e golpes, e salva as matérias diretamente no Banco de Dados Firestore do Caju Alerta.

## Como configurar (Vercel)

Para que o script funcione no Vercel, você deve configurar duas Variáveis de Ambiente no painel (Settings > Environment Variables):

### 1. FIREBASE_SERVICE_ACCOUNT
Esta é a chave que dá permissão para o Vercel escrever no seu banco de dados Firebase.
- Vá no [Console do Firebase](https://console.firebase.google.com).
- Configurações do Projeto > Contas de Serviço (Service Accounts).
- Clique em "Gerar nova chave privada" (SDK Admin Node.js).
- Abra o arquivo `.json` que foi baixado no Bloco de Notas, copie TODO o texto de dentro dele.
- Crie a variável `FIREBASE_SERVICE_ACCOUNT` no Vercel e cole o texto lá dentro.

### 2. CRON_SECRET
Uma senha de segurança inventada por você para garantir que pessoas não autorizadas não consigam ficar ativando o robô acessando a URL da API diretamente.
- Exemplo: `CajuAlertaAdmin123!`
- No Vercel, crie a variável `CRON_SECRET` e cole a sua senha lá.

## Como funciona o Agendamento (Cron)?
O arquivo `vercel.json` na raiz do projeto diz ao Vercel para rodar essa API automaticamente baseada numa expressão cron.
Atualmente está configurado para: `"schedule": "0 */4 * * *"` (Rodar a cada 4 horas).

## Palavras-Chave de Filtro
Atualmente o robô busca notícias que contenham pelo menos um destes termos: 
`'golpe', 'fraude', 'hacker', 'vazamento', 'cpf', 'clonado', 'phishing', 'pix', 'segurança', 'cibernética', 'ataque', 'vírus', 'malware'`
