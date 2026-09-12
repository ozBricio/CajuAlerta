const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '32kb' }));

const frontendPath = path.join(__dirname, '..', 'frontend');
const adminPath = path.join(__dirname, '..', 'admin');
app.use(express.static(frontendPath));
app.use('/admin', express.static(adminPath));
app.get('/logo.png', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'logo.png'));
});
app.get('/:page', (req, res, next) => {
    const pageName = req.params.page === 'noticias' ? 'alertas' : req.params.page;
    const pagePath = path.join(frontendPath, `${pageName}.html`);
    res.sendFile(pagePath, error => {
        if (error) next();
    });
});

// Verifica se as chaves existem
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn("⚠️ AVISO: Chaves do Supabase ausentes no arquivo .env");
}

// Inicializa a conexão com o "Cofre" (Banco de Dados) usando as chaves secretas do .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseUrl && /^https?:\/\//i.test(supabaseUrl) && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

function getCookies(req) {
    return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(cookie => {
        const separator = cookie.indexOf('=');
        return [cookie.slice(0, separator).trim(), decodeURIComponent(cookie.slice(separator + 1).trim())];
    }));
}

function setSessionCookie(res, session) {
    const attributes = [
        `caju_session=${encodeURIComponent(session.access_token)}`,
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${session.expires_in || 3600}`,
        'Path=/'
    ];
    if (process.env.NODE_ENV === 'production') attributes.push('Secure');
    res.setHeader('Set-Cookie', attributes.join('; '));
}

async function requireAuth(req, res, next) {
    if (!supabase) return res.status(503).json({ error: 'Autenticação indisponível: banco não configurado.' });

    const token = getCookies(req).caju_session;
    if (!token) return res.status(401).json({ error: 'Faça login para continuar.' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });

    req.user = data.user;
    next();
}

function requireAdmin(req, res, next) {
    const adminEmails = String(process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
    if (!adminEmails.includes(String(req.user.email || '').toLowerCase())) {
        return res.status(403).json({ error: 'Acesso restrito à administração.' });
    }
    next();
}

const allowedEmailDomains = new Set(['gmail.com', 'hotmail.com', 'outlook.com', 'outlook.com.br']);

function validateAccountInput(nome, email, senha) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const emailParts = normalizedEmail.split('@');

    if (!nameRegex.test(String(nome || '').trim())) return 'Informe nome e sobrenome válidos.';
    if (normalizedEmail.includes('+') || emailParts.length !== 2 || !allowedEmailDomains.has(emailParts[1])) {
        return 'Use um Gmail, Hotmail ou Outlook sem subendereço.';
    }
    if (!senha || senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.';
    return null;
}

app.post('/api/auth/signup', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase ainda não foi configurado no backend.' });

    const { nome, email, senha, consentimentos } = req.body;
    const validationError = validateAccountInput(nome, email, senha);
    if (validationError) return res.status(400).json({ error: validationError });
    if (!consentimentos?.aceiteTermos || !consentimentos?.aceitePrivacidade || !consentimentos?.aceiteProjeto) {
        return res.status(400).json({ error: 'Aceite os três documentos obrigatórios para criar a conta.' });
    }

    const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: { data: { nome: nome.trim() } }
    });

    if (error) return res.status(400).json({ error: error.message });
    if (data.session) setSessionCookie(res, data.session);
    res.status(201).json({
        message: data.session ? 'Conta criada com sucesso.' : 'Conta criada. Confirme seu e-mail para continuar.',
        user: data.user
    });
});

app.post('/api/auth/login', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: 'Supabase ainda não foi configurado no backend.' });

    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');
    if (!email || !senha) return res.status(400).json({ error: 'Informe e-mail e senha.' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return res.status(401).json({ error: 'E-mail, senha ou confirmação de e-mail inválidos.' });
    setSessionCookie(res, data.session);
    res.json({ user: data.user });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

app.post('/api/auth/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'caju_session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/');
    res.status(204).end();
});

app.get('/api/support/tickets', requireAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('id, subject, status, created_at, updated_at, support_messages(id, author_role, message, created_at)')
            .eq('user_id', req.user.id)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        res.json({ tickets: data || [] });
    } catch (err) {
        console.error('Erro ao carregar suporte:', err.message);
        res.status(503).json({ error: 'Área de suporte indisponível. Verifique se as tabelas do suporte foram criadas no banco.' });
    }
});

app.post('/api/support/tickets', requireAuth, async (req, res) => {
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();
    if (subject.length < 5 || subject.length > 120 || message.length < 10 || message.length > 4000) {
        return res.status(400).json({ error: 'Informe um assunto e uma mensagem válidos.' });
    }

    try {
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .insert({ user_id: req.user.id, subject, status: 'aberto' })
            .select('id, subject, status, created_at, updated_at')
            .single();
        if (ticketError) throw ticketError;

        const { error: messageError } = await supabase
            .from('support_messages')
            .insert({ ticket_id: ticket.id, user_id: req.user.id, author_role: 'usuario', message });
        if (messageError) throw messageError;
        res.status(201).json({ ticket });
    } catch (err) {
        console.error('Erro ao abrir chamado:', err.message);
        res.status(503).json({ error: 'Não foi possível abrir o chamado. Verifique a configuração do banco.' });
    }
});

app.post('/api/support/tickets/:ticketId/messages', requireAuth, async (req, res) => {
    const message = String(req.body.message || '').trim();
    if (message.length < 2 || message.length > 4000) return res.status(400).json({ error: 'Digite uma mensagem válida.' });

    try {
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .select('id, user_id, status')
            .eq('id', req.params.ticketId)
            .eq('user_id', req.user.id)
            .single();

        if (ticketError || !ticket) return res.status(404).json({ error: 'Chamado não encontrado.' });
        if (ticket.status === 'fechado') return res.status(409).json({ error: 'Este chamado já foi fechado.' });

        const { data, error } = await supabase
            .from('support_messages')
            .insert({ ticket_id: ticket.id, user_id: req.user.id, author_role: 'usuario', message })
            .select('id, author_role, message, created_at')
            .single();
        if (error) throw error;
        res.status(201).json({ message: data });
    } catch (err) {
        console.error('Erro ao responder chamado:', err.message);
        res.status(503).json({ error: 'Não foi possível enviar a mensagem.' });
    }
});

app.get('/api/admin/support/tickets', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('id, user_id, subject, status, created_at, updated_at, support_messages(id, author_role, message, created_at)')
            .order('updated_at', { ascending: false });
        if (error) throw error;
        res.json({ tickets: data || [] });
    } catch (err) {
        console.error('Erro ao carregar chamados administrativos:', err.message);
        res.status(503).json({ error: 'Não foi possível carregar os chamados.' });
    }
});

app.post('/api/admin/support/tickets/:ticketId/messages', requireAuth, requireAdmin, async (req, res) => {
    const message = String(req.body.message || '').trim();
    if (message.length < 2 || message.length > 4000) return res.status(400).json({ error: 'Digite uma resposta válida.' });

    try {
        const { data: ticket, error: ticketError } = await supabase
            .from('support_tickets')
            .select('id')
            .eq('id', req.params.ticketId)
            .single();
        if (ticketError || !ticket) return res.status(404).json({ error: 'Chamado não encontrado.' });

        const { data, error } = await supabase
            .from('support_messages')
            .insert({ ticket_id: ticket.id, user_id: req.user.id, author_role: 'admin', message })
            .select('id, author_role, message, created_at')
            .single();
        if (error) throw error;

        await supabase.from('support_tickets').update({ status: 'respondido', updated_at: new Date().toISOString() }).eq('id', ticket.id);
        res.status(201).json({ message: data });
    } catch (err) {
        console.error('Erro ao responder chamado pelo admin:', err.message);
        res.status(503).json({ error: 'Não foi possível enviar a resposta.' });
    }
});

// Rota de Teste de Segurança
app.get('/', (req, res) => {
    res.json({ message: "Cofre do Caju Alerta rodando com segurança." });
});

app.get('/api/consulta', async (req, res) => {
    const tipo = String(req.query.tipo || 'telefone');
    const valor = String(req.query.valor || '').trim().toLowerCase();

    if (!supabase) {
        return res.status(503).json({ error: 'Consulta indisponível: o banco de dados não está conectado.' });
    }

    if (!valor || !['telefone', 'e-mail', 'site'].includes(tipo)) {
        return res.status(400).json({ error: 'Informe um telefone ou e-mail válido para consultar.' });
    }

    try {
        const { data, error } = await supabase
            .from('registros')
            .select('categoria, data_ocorrencia, relato')
            .eq('numero', valor)
            .order('data_ocorrencia', { ascending: false });

        if (error) throw error;

        const registros = data || [];
        const categorias = [...new Set(registros.map(registro => registro.categoria).filter(Boolean))];
        const ultimoRegistro = registros[0]?.data_ocorrencia || null;

        res.json({
            tipo,
            valor,
            quantidade: registros.length,
            categorias,
            ultimoRegistro,
            relatos: registros.map(registro => registro.relato).filter(Boolean)
        });
    } catch (err) {
        console.error('Erro ao consultar registros:', err.message);
        res.status(500).json({ error: 'Não foi possível consultar o banco de dados.' });
    }
});

// Rota Segura para Receber Denúncias do Front-end
app.post('/api/registrar', requireAuth, async (req, res) => {
    const { numero, data_ocorrencia, categoria, plataforma, relato, geolocalizacao } = req.body;

    if (!supabase) {
        return res.status(503).json({ error: "Supabase não configurado no ambiente local." });
    }

    // 1. O servidor valida se os dados essenciais estão presentes (Hacker não consegue burlar isso)
    if (!numero || !categoria || !geolocalizacao) {
        return res.status(400).json({ error: "Dados incompletos. O servidor rejeitou a requisição." });
    }

    // 2. Tenta inserir no Supabase de forma protegida
    try {
        const { data, error } = await supabase
            .from('registros')
            .insert([
                { 
                    numero, 
                    data_ocorrencia, 
                    categoria, 
                    plataforma, 
                    relato,
                    geolocalizacao,
                    ip_origem: req.ip,
                    usuario_id: req.user.id
                }
            ]);

        if (error) throw error;
        
        res.status(201).json({ message: "Registro salvo no cofre com sucesso!", data });
    } catch (err) {
        console.error("Erro no servidor:", err.message);
        res.status(500).json({ error: "Erro interno ao salvar no cofre." });
    }
});

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Rota da API não encontrada.' });
    }
    res.status(404).sendFile(path.join(frontendPath, '404.html'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Back-end do Caju Alerta rodando na porta ${PORT}`);
    });
}

module.exports = app;
