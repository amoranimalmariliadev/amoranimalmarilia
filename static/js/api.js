window.API_BASE = 'https://api.projetosdinamicos.com.br/amoranimal';

(function() {
  // Descobre a URL de login a partir do próprio src deste script, para funcionar
  // tanto na raiz do site quanto em /pages/ (ou sob um subdiretório).
  var loginUrl = (function() {
    try {
      var s = document.currentScript;
      if (s && s.src) return new URL('../../login/index.html', s.src).href;
    } catch (_) {}
    return window.location.origin + '/login/index.html';
  })();

  window.getApiToken = function() {
    if (window.API_TOKEN) return window.API_TOKEN;
    var token = localStorage.getItem('amoranimal_token');
    var expiry = parseInt(localStorage.getItem('amoranimal_session_expiry') || '0', 10);
    if (token && Date.now() > expiry) {
      window.limparSessaoAdmin();
      return null;
    }
    return token || null;
  };

  window.limparSessaoAdmin = function() {
    localStorage.removeItem('amoranimal_token');
    localStorage.removeItem('amoranimal_usuario');
    localStorage.removeItem('amoranimal_session_expiry');
  };

  window.apiFetch = function(url, options) {
    options = options || {};
    options.headers = options.headers || {};
    var token = window.getApiToken();
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }
    var enviouToken = !!token;
    var rotaLogin = String(url).indexOf('/auth/login') !== -1;

    return fetch(window.API_BASE + url, options).then(function(resp) {
      // Token enviado mas recusado pela API (expirado/inválido): encerra a
      // sessão e manda o usuário logar de novo, em vez de deixar o botão
      // falhar com um "HTTP 401" sem explicação.
      if (resp.status === 401 && enviouToken && !rotaLogin) {
        window.limparSessaoAdmin();
        if (!window.__sessaoExpiradaAvisada) {
          window.__sessaoExpiradaAvisada = true;
          alert('Sua sessão expirou ou é inválida. Faça login novamente para continuar.');
          window.location.href = loginUrl;
        }
      }
      return resp;
    });
  };
})();
