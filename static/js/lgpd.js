window.LGPD = {
  VERSAO: 'v1.0',
  DATA: '15/09/2026',

  validar: function(id) {
    var cb = id ? document.getElementById(id) : document.querySelector('.lgpd-consent-input');
    if (!cb) return true;
    if (!cb.checked) {
      if (window.alert) alert('Para continuar, é necessário aceitar a Política de Privacidade da ONG Amor Animal Marília (LGPD).');
      cb.focus();
      return false;
    }
    return true;
  },

  dados: function() {
    return {
      consentimento: true,
      consentimento_data: new Date().toISOString(),
      consentimento_versao: window.LGPD.VERSAO
    };
  }
};