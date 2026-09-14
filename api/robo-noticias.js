const admin = require('firebase-admin');
const Parser = require('rss-parser');
const parser = new Parser();

// Inicializar Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Erro ao inicializar o Firebase Admin. Verifique a variável FIREBASE_SERVICE_ACCOUNT.');
  }
}

const db = admin.firestore();

// Fontes de RSS (Exemplo: G1 Segurança, TecMundo)
const RSS_FEEDS = [
  { url: 'https://g1.globo.com/rss/g1/tecnologia/', fonte: 'G1 Tecnologia' },
  { url: 'https://tecnoblog.net/feed/', fonte: 'Tecnoblog' }
];

// Termos para filtrar apenas notícias relevantes sobre golpes e segurança
const PALAVRAS_CHAVE = ['golpe', 'fraude', 'hacker', 'vazamento', 'cpf', 'clonado', 'phishing', 'pix', 'segurança', 'cibernética', 'ataque', 'vírus', 'malware'];

export default async function handler(req, res) {
  // Apenas rodar via requisições autorizadas ou via cron (Vercel Cron manda um Header específico)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}` && !req.headers['x-vercel-cron']) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    let noticiasAdicionadas = 0;

    for (const feed of RSS_FEEDS) {
      const feedData = await parser.parseURL(feed.url);
      
      for (const item of feedData.items) {
        // Verificar se a notícia contém palavras-chave
        const textToSearch = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        const hasKeyword = PALAVRAS_CHAVE.some(keyword => textToSearch.includes(keyword));

        if (hasKeyword) {
          // Checar se já existe no banco
          const exists = await db.collection('noticias').where('titulo', '==', item.title).get();
          
          if (exists.empty) {
            // Extrair imagem se houver no conteúdo
            let img = '';
            if (item.content && item.content.includes('<img')) {
              const match = item.content.match(/src="([^"]+)"/);
              if (match) img = match[1];
            }

            await db.collection('noticias').add({
              titulo: item.title,
              resumo: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : '',
              conteudo: item.contentSnippet || item.content || 'Para ler a matéria completa, acesse a fonte original.',
              dataPublicacao: admin.firestore.FieldValue.serverTimestamp(),
              autorNome: feed.fonte,
              fonte: feed.fonte,
              fonteOficial: false, // Por vir de fora, não é do Caju Alerta
              urlOriginal: item.link,
              imagemCapa: img || null,
              imagens: img ? [img] : []
            });
            noticiasAdicionadas++;
          }
        }
      }
    }

    res.status(200).json({ success: true, message: `${noticiasAdicionadas} notícias publicadas.` });
  } catch (error) {
    console.error('Erro no robô:', error);
    res.status(500).json({ error: 'Erro interno ao processar notícias.' });
  }
}
