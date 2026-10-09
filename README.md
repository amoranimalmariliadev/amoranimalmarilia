Aplicação Web para gerenciamento da ONG em formato de site

## PWA (Progressive Web App)

O site pode ser instalado no celular/desktop e funciona parcialmente offline.

**Arquivos:**
- `manifest.json` — metadados de instalação (nome, ícones, cores).
- `sw.js` — Service Worker com as estratégias de cache.
- `offline.html` — página exibida sem conexão.
- `static/js/pwa.js` — registra o Service Worker, injeta as tags no `<head>` e
  controla o botão "Instalar aplicativo".
- `static/pwa/` — ícones (192, 512 e maskable).

**Integração:**
- `components/header.js` inclui o `pwa.js` em todas as páginas que usam o cabeçalho.
- `login/index.html` e `relatorio/*.html` carregam o `pwa.js` diretamente.
- `index.html` possui as tags PWA no `<head>`.

**Estratégias de cache (`sw.js`):**
| Tipo | Estratégia |
|------|------------|
| Navegação (HTML) | network-first, fallback `offline.html` |
| API (`api.projetosdinamicos.com.br`) | network-first, fallback do último cache (apenas GETs sem token) |
| Assets do site (CSS/JS/imagens) | stale-while-revalidate |

**Como testar:** publique em HTTPS e acesse pelo Chrome/Edge/Safari. Use
DevTools → Application → Manifest / Service Workers. O botão de instalação
aparece no cabeçalho quando o navegador permite.

> Para publicar uma atualização de cache, incremente `CACHE_VERSION` em `sw.js`.
