import re

with open('frontend/perfil.html', 'r', encoding='utf-8') as f:
    html = f.read()

# JS removal and externalization
script_block = '''<script>
    function showTab(tabId, btnElement) {
      document.querySelectorAll('.dash-tab').forEach(el => el.classList.add('d-none'));
      document.getElementById(tabId).classList.remove('d-none');
      
      document.querySelectorAll('.btn-tab').forEach(el => {
        el.classList.remove('active');
      });
      
      btnElement.classList.add('active');
    }
  </script>'''

html = html.replace(script_block, '')

# Event listeners replace
html = html.replace('onclick="showTab(\'tab-inicio\', this)"', 'id="btnTabInicio"')
html = html.replace('onclick="showTab(\'tab-registrar\', this)"', 'id="btnTabRegistrar"')
html = html.replace('onclick="showTab(\'tab-registros\', this)"', 'id="btnTabRegistros"')

html = html.replace('class="btn-tab d-none" id="btnAdminDash" onclick="window.location.href=\'admin-dashboard.html\'" style="color:#3b82f6;"', 'class="btn-tab d-none btn-tab-admin" id="btnAdminDash"')

# CSS Classes replacing inline styles
html = html.replace('body style="background: #f9fafb;"', 'body class="perfil-body"')
html = html.replace('class="page-main animate-hidden" style="padding-top: 120px;"', 'class="page-main animate-hidden perfil-page-main"')
html = html.replace('class="container dashboard-grid d-none" id="protectedContent" style="margin-top: 20px; margin-bottom: 60px;"', 'class="container dashboard-grid d-none perfil-dashboard-container" id="protectedContent"')

html = html.replace('style="color: #6b7280; margin-bottom: 25px;"', 'class="perfil-subtitle"')

html = html.replace('style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.3); padding: 20px; border-radius: 8px; margin-top: 30px; margin-bottom: 20px;"', 'class="legal-box"')
html = html.replace('style="color: #ef4444; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem;"', 'class="legal-box-title"')
html = html.replace('style="font-size: 0.95rem; color: #000000; font-weight: 600; line-height: 1.6; height: 200px; overflow-y: auto; padding-right: 10px; border-right: 2px solid rgba(0,0,0,0.1);"', 'class="legal-box-content"')

html = html.replace('style="color: #ef4444; font-weight: 800; font-size: 1.05rem;"', 'class="legal-warning-text"')
html = html.replace('style="color: #000000; font-weight: 700; font-size: 1rem;"', 'class="legal-normal-text"')
html = html.replace('style="color: #ff9900; font-weight: bold;"', 'class="legal-orange-text"')
html = html.replace('style="background: #fff3e0; color: #000; padding: 10px; border-left: 3px solid #ff9900; margin: 10px 0;"', 'class="legal-example-box"')
html = html.replace('style="color: #ef4444; font-weight: bold;"', 'class="legal-danger-text"')
html = html.replace('style="margin-top: 20px; border-top: 1px solid rgba(239, 68, 68, 0.2); padding-top: 15px;"', 'class="legal-checkbox-wrapper"')
html = html.replace('style="font-weight: 700; color: #000000; font-size: 0.95rem;"', 'class="legal-checkbox-text"')

html = html.replace('style="margin-top: 15px;"', 'class="mt-15"')
html = html.replace('style="color: #6b7280; font-size: 1rem; margin-bottom: 20px;"', 'class="perfil-description"')
html = html.replace('style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;"', 'class="perfil-filter-bar"')
html = html.replace('style="flex: 1; padding: 10px 15px; border-radius: 8px; border: 1px solid #d1d5db; outline: none; font-family: inherit;"', 'class="perfil-search-input"')
html = html.replace('style="padding: 10px 15px; border-radius: 8px; border: 1px solid #d1d5db; outline: none; font-family: inherit; background: #fff;"', 'class="perfil-select-input"')
html = html.replace('style="color: #9ca3af;"', 'class="text-gray-400"')

html = html.replace('style="background:#fff; color:#111827;"', 'class="modal-box modal-light"')
html = html.replace('style="color:#ef4444;"', 'class="text-red-500"')
html = html.replace('style="color:#4b5563;"', 'class="text-gray-600"')
html = html.replace('style="background:#f3f4f6; color:#111827;"', 'class="btn btn-modal-cancel"')

html = html.replace('style="display: flex; flex-direction: column; align-items: center; justify-content: center;"', 'class="loading-flex-center"')
html = html.replace('style="color: #ffffff; margin-bottom: 10px;"', 'class="success-title"')


with open('frontend/perfil.html', 'w', encoding='utf-8') as f:
    f.write(html)
