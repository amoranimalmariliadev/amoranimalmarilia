/* ============================================================
   PWA — ONG Amor Animal Marília
   Responsável por:
   1. Injetar as tags PWA no <head> (manifest, theme-color, apple-touch-icon);
   2. Registrar o Service Worker (sw.js);
   3. Exibir o botão "Instalar aplicativo" e orientar no iOS.

   Detecta automaticamente a raiz do site, funcionando em:
   - domínio próprio na raiz .......... https://www.amoranimal.ong.br/
   - subpasta ......................... https://.../projetosdinamicos/
   - GitHub Pages (caminho de projeto)  https://.../amoranimalmarilia/
   ============================================================ */
(function () {
  'use strict';

  if (window.__amoranimalPwaLoaded) return;
  window.__amoranimalPwaLoaded = true;

  /* ---------- Descobre a raiz do site ---------- */
  function getSiteRoot() {
    try {
      var cs = document.currentScript;
      if (cs && cs.src) {
        // .../<raiz>/static/js/pwa.js  ->  /<raiz>
        return new URL(cs.src).pathname.replace(/\/static\/js\/pwa\.js.*$/, '');
      }
    } catch (e) { /* fallback abaixo */ }

    try {
      var root = window.ROOT || '.';
      var dir = location.origin + location.pathname.replace(/[^/]*$/, '');
      return new URL(root + '/', dir).pathname.replace(/\/$/, '');
    } catch (e) {
      return '';
    }
  }

  var SITE_ROOT = getSiteRoot();
  function absolute(path) {
    return location.origin + SITE_ROOT + path;
  }

  /* ---------- 1. Tags no <head> ---------- */
  function injectHeadTags() {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    function add(tagName, attrs) {
      var el = document.createElement(tagName);
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
      }
      head.appendChild(el);
      return el;
    }

    if (!document.querySelector('link[rel="manifest"]')) {
      add('link', { rel: 'manifest', href: absolute('/manifest.json') });
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      add('meta', { name: 'theme-color', content: '#0d9488' });
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      add('link', { rel: 'apple-touch-icon', sizes: '180x180', href: absolute('/static/css/favicon/apple-touch-icon.png') });
    }
    if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
      add('meta', { name: 'mobile-web-app-capable', content: 'yes' });
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
      add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' });
    }
    if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
      add('meta', { name: 'apple-mobile-web-app-title', content: 'Amor Animal' });
    }
  }

  /* ---------- 2. Service Worker ---------- */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(absolute('/sw.js'))
        .catch(function (err) {
          // Falha silenciosa: a aplicação continua funcionando sem offline.
          if (window.console && console.warn) {
            console.warn('[PWA] Falha ao registrar o service worker:', err);
          }
        });
    });
  }

  /* ---------- 3. Botão de instalação ---------- */
  var isStandalone = function () {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  };

  var isIOS = function () {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  function showToast(message) {
    var old = document.getElementById('pwa-toast');
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var toast = document.createElement('div');
    toast.id = 'pwa-toast';
    toast.className = 'pwa-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = message;
    document.body.appendChild(toast);
    // pequeno atraso para permitir a transição CSS
    setTimeout(function () { toast.classList.add('show'); }, 20);
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 6000);
  }

  function iosInstructions() {
    return 'Para instalar no iPhone/iPad: toque em <strong>Compartilhar</strong> ' +
           '<span style="white-space:nowrap">(o ícone <strong>⬆️</strong>)</span> ' +
           'e depois em <strong>“Adicionar à Tela de Início”</strong>.';
  }

  function initInstallButton() {
    var btn = document.getElementById('pwa-install-btn');
    if (!btn) return;

    if (isStandalone()) { btn.style.display = 'none'; return; }

    var deferredPrompt = null;

    btn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          if (choice && choice.outcome === 'accepted') {
            btn.style.display = 'none';
          }
          deferredPrompt = null;
        });
      } else if (isIOS()) {
        showToast(iosInstructions());
      } else {
        showToast('Para instalar, use o menu do navegador e escolha <strong>“Instalar aplicativo”</strong> ou <strong>“Adicionar à tela inicial”</strong>.');
      }
    });

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      btn.style.display = 'inline-flex';
    });

    window.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      btn.style.display = 'none';
      showToast('✅ Aplicativo instalado! Obrigado por apoiar a Amor Animal.');
    });

    // iOS não dispara "beforeinstallprompt": mostra o botão com instruções manuais.
    if (isIOS() && !window.navigator.standalone) {
      btn.style.display = 'inline-flex';
      btn.setAttribute('title', 'Como instalar no iPhone/iPad');
    }
  }

  /* ---------- Inicialização ---------- */
  function init() {
    injectHeadTags();
    registerServiceWorker();
    initInstallButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();