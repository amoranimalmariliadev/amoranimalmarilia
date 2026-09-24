(function(){
  var s = document.currentScript;
  if (!s) return;
  var ROOT = window.ROOT || '.';
  var _path = (window.location.pathname || '/').replace(/\/+$/, '');
  var _file = _path.split('/').pop();
  var isLanding = _file === '' || _file === 'index.html';

  s.insertAdjacentHTML('afterend',
/* --- Hidden toggles (CSS-only) --- */
    '<input type="checkbox" id="contrast-toggle" class="css-toggle-checkbox">' +
    (isLanding ? '' : '<input type="checkbox" id="mobile-menu-toggle" class="css-toggle-checkbox">') +

    /* --- Site Header --- */
    '<header class="site-header" id="site-header">' +
    '  <div class="header-inner">' +

    /* Logo (centralizada) */
    '    <a href="' + ROOT + '/index.html" class="header-logo" title="ONG Amor Animal Marilia">' +
    '      <img src="' + ROOT + '/static/css/imagem/ong.jpg" alt="ONG Amor Animal Marilia">' +
    '    </a>' +

    /* Actions */
    '    <div class="header-actions">' +

    /* Contrast toggle */
    '      <label for="contrast-toggle" class="header-icon-btn" title="Alto contraste" aria-label="Alternar alto contraste"><i class="bi bi-eye"></i></label>' +

    /* Help toggle */
    '      <button type="button" class="header-icon-btn header-help-btn" id="help-toggle-btn" title="Ajuda" aria-label="Ajuda"><i class="bi bi-info-circle"></i></button>' +

    /* Admin area */
    '      <span id="admin-access-area">' +
    '        <a href="' + ROOT + '/login/index.html" id="admin-login-link" class="header-icon-btn" title="Acesso administrativo"><i class="bi bi-lock"></i></a>' +
    '        <span id="admin-logged-in" style="display:none">' +
    '          <span id="admin-label" class="header-admin-badge">ADMIN</span>' +
    '          <a href="#" id="admin-logout-link" class="header-icon-btn header-logout-btn" title="Sair" onclick="event.preventDefault();adminLogout()"><i class="bi bi-box-arrow-right"></i></a>' +
    '        </span>' +
    '      </span>' +

    /* Hamburger (mobile) */
    '      <label for="mobile-menu-toggle" class="header-hamburger" aria-label="Menu">' +
    '        <span></span><span></span><span></span>' +
    '      </label>' +

    '    </div>' +
    '  </div>' +
    '</header>' +

    /* --- Help Section (fixed on page) --- */
    '<section class="help-section" id="help-section">' +
    '  <div class="help-section-inner">' +
    '    <div class="help-section-header">' +
    '      <h3><i class="bi bi-info-circle"></i> Ajuda</h3>' +
    '      <button type="button" class="help-close-btn" id="help-close-btn" aria-label="Fechar"><i class="bi bi-x-lg"></i></button>' +
    '    </div>' +
    '    <div class="help-section-body">' +
      '      <p>Em caso de erros, dúvidas ou sugestões entre em contato conosco.</p>' +
      '      <hr>' +
      '      <h5>Erros comuns:</h5>' +
      '      <ul>' +
      '        <li><strong>Pet não adicionado:</strong> Preencha Nome, Espécie e Sexo do pet.</li>' +
      '        <li><strong>Inscrição não enviada:</strong> Verifique se todos os campos obrigatórios estão preenchidos.</li>' +
      '        <li><strong>Vagas esgotadas:</strong> O mutirão atingiu o limite de vagas.</li>' +
      '        <li><strong>Mutirão encerrado:</strong> As inscrições foram encerradas após a data do evento.</li>' +
      '      </ul>' +
    '      <p>E deixe o seu melhor contato.</p>' +
    '      <p><strong>Email:</strong> <a href="mailto:amoranimalmariliadev@gmail.com">amoranimalmariliadev@gmail.com</a></p>' +
    '    </div>' +
    '  </div>' +
    '</section>' +

    /* --- Mobile Menu Overlay --- */
    '<div class="mobile-menu-overlay">' +
    '  <div class="mobile-menu">' +
    '    <ul class="mobile-menu-list">' +
      '      <li><a href="' + ROOT + '/index.html"><i class="bi bi-house-door"></i> Início</a></li>' +
      '      <li><a href="' + ROOT + '/pages/adocao.html"><i class="bi bi-paw"></i> Adoção</a></li>' +
      '      <li><a href="' + ROOT + '/pages/castracao.html"><i class="bi bi-person-heart"></i> Castração</a></li>' +
      '      <li><a href="' + ROOT + '/pages/castracao_mutirao.html"><i class="bi bi-people"></i> Mutirão</a></li>' +
      '      <li><a href="' + ROOT + '/pages/procura_se.html"><i class="bi bi-search"></i> Procura-se</a></li>' +
      '      <li><a href="' + ROOT + '/pages/doacao.html"><i class="bi bi-gift"></i> Doação</a></li>' +
      '      <li><a href="' + ROOT + '/pages/voluntario.html"><i class="bi bi-people-fill"></i> Voluntário</a></li>' +
      '      <li><a href="' + ROOT + '/pages/parceria.html"><i class="bi bi-handshake"></i> Parceria</a></li>' +
      '      <li><a href="' + ROOT + '/pages/eventos.html"><i class="bi bi-calendar-event"></i> Eventos</a></li>' +
      '      <li><a href="' + ROOT + '/pages/transparencia.html"><i class="bi bi-file-text"></i> Transparência</a></li>' +
      '      <li><a href="' + ROOT + '/pages/sobre.html"><i class="bi bi-info-circle"></i> Sobre</a></li>' +
    '    </ul>' +
    '  </div>' +
    '</div>'
  );

  if (isLanding) {
    var _mmenu = document.getElementById('mobile-menu-toggle');
    if (_mmenu && _mmenu.parentNode) _mmenu.parentNode.removeChild(_mmenu);
    var _mburger = document.querySelector('.header-hamburger');
    if (_mburger && _mburger.parentNode) _mburger.parentNode.removeChild(_mburger);
    var _moverlay = document.querySelector('.mobile-menu-overlay');
    if (_moverlay && _moverlay.parentNode) _moverlay.parentNode.removeChild(_moverlay);
  }

  /* --- Search Logic --- */
  var PAGES = [
    { t:"Início", d:"Página inicial da ONG Amor Animal", k:"inicio home principal ong amor animal marilia site entrada", i:"bi bi-house-door", c:"#14b8a6", u:"index.html" },
    { t:"Adoção", d:"Animais disponíveis para adoção responsável", k:"adocao adotar adote adocao-responsavel pet cachorro gato cao caes felino filhote lar familia quero-adotar", i:"bi bi-paw", c:"#f59e0b", u:"pages/adocao.html" },
    { t:"Castração", d:"Central de agendamento de castração", k:"castracao castrar castracao-central cirurgia veterinario veterinaria animal animais esterilizar", i:"bi bi-person-heart", c:"#10b981", u:"pages/castracao.html" },
    { t:"Castração Baixo Custo", d:"Castração com valor social reduzido", k:"castracao castrar baixo-custo valor-social barato economico precos preco cirurgia veterinario castracao-preco", i:"bi bi-cash", c:"#059669", u:"pages/castracao_baixo_custo.html" },
    { t:"Mutirão de Castração", d:"Mutirões gratuitos de castração", k:"castracao mutirao mutirao-castracao gratuito gratis castracao-gratuita evento castrar cirurgia coletivo inscricao", i:"bi bi-people", c:"#047857", u:"pages/castracao_mutirao.html" },
    { t:"Inscrição Mutirão", d:"Formulário de inscrição para mutirão de castração", k:"castracao mutirao inscricao inscrever formulario cadastro vagas castracao-gratuita", i:"bi bi-pencil-square", c:"#065f46", u:"pages/castracao_mutirao_form.html" },
    { t:"Pets de Rua", d:"Castração para animais de rua", k:"castracao pets-rua rua animal-anonimo comunidade cuidado veterinario", i:"bi bi-heart", c:"#dc2626", u:"pages/castracao_pets_rua.html" },
    { t:"Castração Sucesso", d:"Confirmação de inscrição de castração", k:"castracao sucesso confirmacao inscricao realizada comprovante ticket protocolo", i:"bi bi-check-circle", c:"#16a34a", u:"pages/castracao_sucesso.html" },
    { t:"Procura-se", d:"Animais desaparecidos divulgação", k:"procura-se perdido desaparecido busca sumido cachorro gato cao animal localizar encontrar", i:"bi bi-search", c:"#f97316", u:"pages/procura_se.html" },
    { t:"Anunciar Desaparecimento", d:"Cadastro de animal desaparecido", k:"procura-se cadastro anunciar desaparecimento perdido sumido divulgar busca animal cachorro gato", i:"bi bi-megaphone", c:"#ea580c", u:"pages/cadastro_procura_se.html" },
    { t:"Doação", d:"Contribua com doações via PIX ou cartão", k:"doacao doar contribuir pix dinheiro ajuda financeira doe contribuicao cartao credito debito ajuda", i:"bi bi-gift", c:"#8b5cf6", u:"pages/doacao.html" },
    { t:"Parceria", d:"Seja um parceiro apoiador da ONG", k:"parceria parceiro empresa apoiar patrocinio apoio corporativo responsabilidade-social", i:"bi bi-handshake", c:"#14b8a6", u:"pages/parceria.html" },
    { t:"Voluntário", d:"Cadastro de voluntários para ajudar a ONG", k:"voluntario voluntariado ajudar trabalho voluntario contribuir tempo doar", i:"bi bi-people-fill", c:"#ec4899", u:"pages/voluntario.html" },
    { t:"Sobre", d:"Conheça a história e missão da ONG", k:"sobre nos historia missao quem-somos equipe fundacao resgate animais", i:"bi bi-info-circle", c:"#3b82f6", u:"pages/sobre.html" },
    { t:"Transparência", d:"Prestação de contas e documentos oficiais", k:"transparencia prestacao-contas contas documentos relatorio financeiro receitas despesas", i:"bi bi-file-text", c:"#6366f1", u:"pages/transparencia.html" },
    { t:"Eventos", d:"Eventos feiras e mutirões da ONG", k:"eventos feira adocao mutirao castracao agenda calendario bazar beneficente", i:"bi bi-calendar-event", c:"#a855f7", u:"pages/eventos.html" },
    { t:"Política de Privacidade", d:"Termos e política de privacidade do site", k:"politica privacidade termos dados LGPD protecao informacao", i:"bi bi-shield-lock", c:"#6b7280", u:"pages/policy.html" },
    { t:"Admin", d:"Painel administrativo e login do sistema", k:"admin administrador login acesso gestao painel sistema entrar", i:"bi bi-lock", c:"#64748b", u:"login/index.html" }
  ];

  var API_SECTIONS = [
    { t:"Eventos na Landing", d:"Eventos cadastrados na página inicial", k:"evento agenda calendario programacao", i:"bi bi-calendar-event", c:"#a855f7", e:"eventos", f:"titulo" },
    { t:"Castracoes", d:"Agendamentos de castração realizados", k:"castracao cirurgia castrar agendamento veterinario", i:"bi bi-person-heart", c:"#10b981", e:"castracao", f:"nome_pet" },
    { t:"Pets para Adoção", d:"Animais disponíveis para adoção", k:"pet cachorro gato cao felino adocao animal", i:"bi bi-paw", c:"#f59e0b", e:"adocao", f:"nome" },
    { t:"Voluntários", d:"Voluntários cadastrados no sistema", k:"voluntario voluntariado ajuda contribuir", i:"bi bi-people-fill", c:"#ec4899", e:"voluntario", f:"nome" },
    { t:"Parcerias", d:"Empresas parceiras da ONG", k:"parceria empresa patrocinio apoio parceiro", i:"bi bi-handshake", c:"#14b8a6", e:"parceria", f:"empresa" },
    { t:"Animais Perdidos", d:"Animais desaparecidos divulgação", k:"procura-se perdido desaparecido sumido busca", i:"bi bi-search", c:"#f97316", e:"procura_se", f:"nome" }
  ];

  function highlightText(text, query) {
    if (!query) return text;
    var words = query.toLowerCase().split(/[\s,;\-]+/).filter(function(w){ return w.length > 0; });
    var result = text;
    for (var i = 0; i < words.length; i++) {
      var re = new RegExp('(' + words[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      result = result.replace(re, '<mark style="background:#fef08a;color:#333;padding:0 2px;border-radius:2px">$1</mark>');
    }
    return result;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  var API_SEARCH_MAP = {
    eventos: { i: 'bi bi-calendar-event', c: '#a855f7' },
    castracao: { i: 'bi bi-person-heart', c: '#10b981' },
    adocao: { i: 'bi bi-paw', c: '#f59e0b' },
    voluntario: { i: 'bi bi-people-fill', c: '#ec4899' },
    parceria: { i: 'bi bi-handshake', c: '#14b8a6' },
    procura_se: { i: 'bi bi-search', c: '#f97316' }
  };

  function apiSearch(q, callback) {
    var BASE = window.API_BASE || 'https://api.projetosdinamicos.com.br/amoranimal';
    fetch(BASE + '/search?q=' + encodeURIComponent(q))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var items = [];
        if (data.results) {
          for (var i = 0; i < data.results.length; i++) {
            var r = data.results[i];
            var m = API_SEARCH_MAP[r.tabela];
            if (m) {
              items.push({
                page: { t: r.titulo || '', d: r.descricao || '', i: m.i, c: m.c, e: r.tabela },
                score: 5, api: true, apiData: true
              });
            }
          }
        }
        callback(items);
      })
      .catch(function() { callback([]); });
  }

  var searchCache = {};

  function searchPages(q) {
    var results = document.getElementById('search-results');
    var section = document.getElementById('search-results-section');
    var clearBtn = document.getElementById('search-clear');
    if (!results || !section) return;

    if (clearBtn) clearBtn.style.display = (q && q.length > 0) ? 'flex' : 'none';

    if (!q || q.length < 2) {
      section.style.display = 'none';
      results.innerHTML = '';
      return;
    }

    var words = q.toLowerCase().split(/[\s,;\-]+/).filter(function(w){ return w.length > 0; });
    var found = [];

    for (var i = 0; i < PAGES.length; i++) {
      var p = PAGES[i];
      var text = (p.t + ' ' + p.d + ' ' + p.k).toLowerCase();
      var score = 0;
      for (var w = 0; w < words.length; w++) {
        if (text.indexOf(words[w]) !== -1) { score += 1; if (p.t.toLowerCase().indexOf(words[w]) !== -1) score += 2; }
      }
      if (score > 0) found.push({ page: p, score: score, api: false });
    }

    for (var i = 0; i < API_SECTIONS.length; i++) {
      var s = API_SECTIONS[i];
      var text = (s.t + ' ' + s.d + ' ' + s.k).toLowerCase();
      var score = 0;
      for (var w = 0; w < words.length; w++) {
        if (text.indexOf(words[w]) !== -1) { score += 1; if (s.t.toLowerCase().indexOf(words[w]) !== -1) score += 2; }
      }
      if (score > 0) found.push({ page: s, score: score, api: true });
    }

    found.sort(function(a, b) { return b.score - a.score; });
    renderDropdown(found, q);

    apiSearch(q, function(apiItems) {
      if (!apiItems.length) return;
      var seen = {};
      for (var i = 0; i < found.length; i++) seen[found[i].page.t + '|' + found[i].page.d + '|' + (found[i].page.e || '')] = true;
      for (var i = 0; i < apiItems.length; i++) {
        var key = apiItems[i].page.t + '|' + apiItems[i].page.d + '|' + apiItems[i].page.e;
        if (!seen[key]) { found.push(apiItems[i]); seen[key] = true; }
      }
      found.sort(function(a, b) { return b.score - a.score; });
      renderDropdown(found, q);
    });
  }

  function sectionUrl(s) {
    var map = { eventos:'pages/eventos.html', castracao:'pages/castracao.html', adocao:'pages/adocao.html', voluntario:'pages/voluntario.html', parceria:'pages/parceria.html', procura_se:'pages/procura_se.html' };
    return map[s.e] || 'index.html';
  }

  function renderDropdown(found, q) {
    var results = document.getElementById('search-results');
    var section = document.getElementById('search-results-section');
    var count = document.getElementById('search-results-count');
    if (!results || !section) return;

    if (found.length === 0) {
      results.innerHTML = '<div class="sr-none">Nenhum resultado para <strong>' + escapeHtml(q) + '</strong></div>';
      section.style.display = 'block';
      if (count) count.innerHTML = 'Nenhum resultado para <strong>' + escapeHtml(q) + '</strong>';
    } else {
      var html = '';
      for (var i = 0; i < found.length; i++) {
        var p = found[i].page;
        var url = found[i].api ? sectionUrl(p) : p.u;
        html += '<a href="' + ROOT + '/' + url + '" data-search-link="1" role="option">';
        html += '<span class="sr-icon" style="background:' + p.c + '"><i class="' + p.i + '"></i></span>';
        html += '<div><div class="sr-title">' + highlightText(p.t, q) + '</div><div class="sr-desc">' + highlightText(p.d, q) + '</div></div>';
        html += '</a>';
      }
      results.innerHTML = html;
      section.style.display = 'block';
      if (count) count.innerHTML = '<strong>' + found.length + '</strong> resultado(s) para <strong>' + escapeHtml(q) + '</strong>';
    }
  }

  function hideSearchResults() {
    var section = document.getElementById('search-results-section');
    var input = document.getElementById('site-search');
    if (section) section.style.display = 'none';
    if (input) { input.value = ''; input.blur(); }
    var results = document.getElementById('search-results');
    if (results) results.innerHTML = '';
  }

  function trackPageVisit() {
    var page = location.pathname.replace('/projetosdinamicos/', '').replace(/^\//, '') || 'index.html';
    try {
      var visits = JSON.parse(localStorage.getItem('page_visits') || '{}');
      visits[page] = (visits[page] || 0) + 1;
      localStorage.setItem('page_visits', JSON.stringify(visits));
    } catch(e) {}
  }

  function updateSearchPlaceholder() {
    var input = document.getElementById('site-search');
    if (!input) return;
    try {
      var visits = JSON.parse(localStorage.getItem('page_visits') || '{}');
      var entries = Object.keys(visits).map(function(k) { return { page: k, count: visits[k] }; });
      entries.sort(function(a, b) { return b.count - a.count; });
      var top4 = entries.slice(0, 4);
      var pageMap = {};
      PAGES.forEach(function(p) { pageMap[p.u.replace(/^\//, '')] = p.t; });
      var names = [];
      top4.forEach(function(e) { var t = pageMap[e.page]; if (t) names.push(t); });
      if (names.length > 0) { input.placeholder = 'Pesquisar: ' + names.join(', '); return; }
    } catch(e) {}
    input.placeholder = 'Pesquisar...';
  }

  function initSearch() {
    var input = document.getElementById('site-search');
    var results = document.getElementById('search-results');
    var clearBtn = document.getElementById('search-clear');
    var closeBtn = document.getElementById('search-results-close');
    if (!input || !results) return;

    updateSearchPlaceholder();

    function onResultClick(e) {
      var link = e.target.closest('a[data-search-link]');
      if (link) {
        hideSearchResults();
      }
    }
    results.addEventListener('click', onResultClick);

    var panelResults = document.getElementById('search-panel-results');
    if (panelResults) panelResults.addEventListener('click', onResultClick);

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        hideSearchResults();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        hideSearchResults();
      });
    }

    var debounceTimer;
    input.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() { searchPages(input.value); }, 200);
    });

    input.addEventListener('focus', function() {
      if (input.value.length >= 2) searchPages(input.value);
    });

    var selectedIndex = -1;
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { input.blur(); return; }
      var links = results.querySelectorAll('a[data-search-link]');
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIndex = Math.min(selectedIndex + 1, links.length - 1); updateSelection(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIndex = Math.max(selectedIndex - 1, -1); updateSelection(); }
      else if (e.key === 'Enter') { if (selectedIndex >= 0 && links[selectedIndex]) { e.preventDefault(); window.location.href = links[selectedIndex].href; } }
      else { selectedIndex = -1; }
      function updateSelection() {
        links.forEach(function(link, i) {
          link.classList.toggle('selected', i === selectedIndex);
          link.setAttribute('aria-selected', i === selectedIndex ? 'true' : 'false');
          link.style.background = i === selectedIndex ? 'var(--bg-alt)' : '';
        });
      }
    });
  }

  function initAdminUI() {
    var token = localStorage.getItem('amoranimal_token');
    var expiry = parseInt(localStorage.getItem('amoranimal_session_expiry') || '0', 10);
    if (token && Date.now() > expiry) {
      localStorage.removeItem('amoranimal_token');
      localStorage.removeItem('amoranimal_usuario');
      localStorage.removeItem('amoranimal_session_expiry');
      token = null;
    }
    var loginLink = document.getElementById('admin-login-link');
    var loggedIn = document.getElementById('admin-logged-in');
    if (loginLink && loggedIn) {
      loginLink.style.display = token ? 'none' : 'inline-flex';
      loggedIn.style.display = token ? 'inline-flex' : 'none';
    }
    document.body.classList.toggle('admin-mode', !!token);
  }

  window.adminLogout = function() {
    localStorage.removeItem('amoranimal_token');
    localStorage.removeItem('amoranimal_usuario');
    localStorage.removeItem('amoranimal_session_expiry');
    window.location.href = window.location.origin + '/index.html';
  };

  function initContrast() {
    var t = document.getElementById('contrast-toggle');
    if (!t) return;
    if (localStorage.getItem('highContrast') === 'true') {
      document.body.classList.add('high-contrast');
      t.checked = true;
    }
    t.addEventListener('change', function() {
      if (t.checked) {
        document.body.classList.add('high-contrast');
        localStorage.setItem('highContrast', 'true');
      } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem('highContrast', 'false');
      }
    });
  }

  function initHelpSection() {
    var helpBtn = document.getElementById('help-toggle-btn');
    var helpSection = document.getElementById('help-section');
    var helpClose = document.getElementById('help-close-btn');
    if (!helpBtn || !helpSection) return;

    helpBtn.addEventListener('click', function() {
      helpSection.classList.toggle('open');
      if (helpSection.classList.contains('open')) {
        helpSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    if (helpClose) {
      helpClose.addEventListener('click', function() {
        helpSection.classList.remove('open');
      });
    }
  }

  function initSearchToggle() {
    var wrap = document.getElementById('header-search-wrap');
    var input = document.getElementById('site-search');
    if (!wrap || !input) return;

    wrap.addEventListener('click', function(e) {
      if (e.target === wrap || e.target.closest('.header-search-bar') === document.getElementById('header-search-bar')) {
        input.focus();
      }
    });
  }

  function initScrollHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else if (currentScroll < 20) {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      trackPageVisit();
      initAdminUI();
      initSearch();
      initContrast();
      initSearchToggle();
      initScrollHeader();
      initHelpSection();
    });
  } else {
    trackPageVisit();
    initAdminUI();
    initSearch();
    initContrast();
    initSearchToggle();
    initScrollHeader();
    initHelpSection();
  }
})();
