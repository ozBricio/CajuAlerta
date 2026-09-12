document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('supportForm');
  const errorBox = document.getElementById('supportError');
  const ticketsList = document.getElementById('ticketsList');

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function renderTickets(tickets) {
    if (!tickets.length) {
      ticketsList.innerHTML = '<p class="empty-state">Você ainda não abriu uma solicitação.</p>';
      return;
    }
    ticketsList.innerHTML = tickets.map(ticket => `<article class="ticket"><div class="ticket-header"><h3>${escapeHtml(ticket.subject)}</h3><span class="ticket-status">${escapeHtml(ticket.status)}</span></div><div class="ticket-messages">${(ticket.support_messages || []).map(message => `<div class="ticket-message ${message.author_role === 'admin' ? 'from-support' : ''}"><strong>${message.author_role === 'admin' ? 'Suporte' : 'Você'}</strong><p>${escapeHtml(message.message)}</p><time>${new Date(message.created_at).toLocaleString('pt-BR')}</time></div>`).join('')}</div>${ticket.status !== 'fechado' ? `<form class="reply-form" data-ticket-id="${ticket.id}"><input name="message" required maxlength="4000" placeholder="Responder neste chamado"><button class="text-button" type="submit">Enviar</button></form>` : ''}</article>`).join('');
    document.querySelectorAll('.reply-form').forEach(replyForm => replyForm.addEventListener('submit', sendReply));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  async function loadTickets() {
    try {
      const response = await fetch(window.apiUrl('/api/support/tickets'), { credentials: 'include' });
      const result = await response.json();
      if (response.status === 401) return window.location.replace(`/login?returnTo=${encodeURIComponent('/suporte')}`);
      if (!response.ok) throw new Error(result.error || 'Não foi possível carregar o suporte.');
      renderTickets(result.tickets);
    } catch (error) { showError(error.message); }
  }

  async function sendReply(event) {
    event.preventDefault();
    const replyForm = event.currentTarget;
    const message = new FormData(replyForm).get('message');
    const response = await fetch(window.apiUrl(`/api/support/tickets/${replyForm.dataset.ticketId}/messages`), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
    const result = await response.json();
    if (!response.ok) return showError(result.error || 'Não foi possível enviar a resposta.');
    replyForm.reset();
    loadTickets();
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const response = await fetch(window.apiUrl('/api/support/tickets'), { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: document.getElementById('supportSubject').value, message: document.getElementById('supportMessage').value }) });
    const result = await response.json();
    if (!response.ok) return showError(result.error || 'Não foi possível abrir a solicitação.');
    form.reset();
    loadTickets();
  });
  document.getElementById('refreshSupport').addEventListener('click', loadTickets);
  // globalLogoutBtn is managed by common.js
  loadTickets();
});