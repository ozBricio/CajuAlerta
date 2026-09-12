document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('ticketsList');
  const errorBox = document.getElementById('supportError');
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  async function loadTickets() {
    const response = await fetch('/api/admin/support/tickets');
    const result = await response.json();
    if (response.status === 401) return window.location.href = 'index.html';
    if (!response.ok) { errorBox.textContent = result.error || 'Não foi possível carregar os chamados.'; errorBox.hidden = false; return; }
    list.innerHTML = result.tickets.length ? result.tickets.map(ticket => `<article class="ticket"><h2>${escapeHtml(ticket.subject)}</h2><p class="ticket-meta">Usuário: ${escapeHtml(ticket.user_id)} | Status: ${escapeHtml(ticket.status)}</p>${(ticket.support_messages || []).map(message => `<div class="message ${message.author_role === 'admin' ? 'admin' : ''}"><strong>${message.author_role === 'admin' ? 'Suporte' : 'Usuário'}</strong><p>${escapeHtml(message.message)}</p></div>`).join('')}<form class="reply-form" data-ticket-id="${ticket.id}"><input name="message" maxlength="4000" required placeholder="Responder ao usuário"><button>Enviar resposta</button></form></article>`).join('') : '<p>Nenhuma solicitação encontrada.</p>';
    document.querySelectorAll('.reply-form').forEach(form => form.addEventListener('submit', reply));
  }

  async function reply(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(`/api/admin/support/tickets/${form.dataset.ticketId}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: new FormData(form).get('message') }) });
    const result = await response.json();
    if (!response.ok) { errorBox.textContent = result.error || 'Não foi possível enviar a resposta.'; errorBox.hidden = false; return; }
    loadTickets();
  }

  document.getElementById('logoutButton').addEventListener('click', async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = 'index.html'; });
  loadTickets();
});