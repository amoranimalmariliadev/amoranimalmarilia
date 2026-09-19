var BASE = window.API_BASE;

document.addEventListener('DOMContentLoaded', function () {
  apiFetch('/eventos')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (data && Array.isArray(data)) renderEvents(data); })
    .catch(function () {});
  apiFetch('/castracao')
    .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
    .catch(function () { return []; })
    .then(function (data) { renderCastracoes(mergeCastracoes(data || [])); });
  apiFetch('/calendario_mutirao')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (data && Array.isArray(data)) renderMutiroes(data); })
    .catch(function () {});
  apiFetch('/adocao')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (data && Array.isArray(data)) renderAnimais(data); })
    .catch(function () {});
  apiFetch('/voluntario')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (data) { if (data && Array.isArray(data)) renderVoluntarios(data); })
    .catch(function () {});
});

function renderEvents(events) {
  var container = document.querySelector('.events-grid');
  if (!container) return;
  container.innerHTML = '';
  var INSTAGRAM_URL = 'https://www.instagram.com/grupoamoranimal/';
  if (!events.length) {
    container.innerHTML =
      '<div class="section-empty-cta" style="width:100%;">' +
        '<i class="bi bi-calendar-heart" style="font-size:2.5rem;color:var(--brand-purple);"></i>' +
        '<h3>Eventos em breve</h3>' +
        '<p>Damos a largada de novos eventos em breve: feiras de ado\u00e7\u00e3o, bazares e mutir\u00f5es de castra\u00e7\u00e3o. Enquanto isso, acompanhe nosso Instagram e fique por dentro!</p>' +
        '<div class="cta-botoes">' +
          '<a class="btn btn-primary" href="pages/eventos.html"><i class="bi bi-calendar-event me-1"></i> Ver agenda de eventos</a>' +
          '<a class="btn-evento-insta" href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener noreferrer"><i class="bi bi-instagram"></i> Seguir no Instagram</a>' +
        '</div>' +
      '</div>';
    return;
  }
  var criadoEm = function (ev) {
    var t = ev.origem ? new Date(ev.origem).getTime() : NaN;
    if (isNaN(t)) t = ev.created_at ? new Date(ev.created_at).getTime() : NaN;
    return isNaN(t) ? (parseInt(ev.id, 10) || 0) : t;
  };
  events.slice().sort(function (a, b) { return criadoEm(b) - criadoEm(a); }).forEach(function (ev) {
    var card = document.createElement('div');
    card.className = 'event-card-hover';
    var instaUrl = ev.link || ev.url_instagram || INSTAGRAM_URL;
    card.innerHTML =
      '<button class="btn-delete-evento admin-only" data-id="' + ev.id + '" title="Excluir evento"><i class="bi bi-x-lg"></i></button>' +
      '<div class="event-info">' +
        '<h3 class="event-titulo" style="margin-bottom:10px;">' + esc(ev.titulo) + '</h3>' +
        '<div class="event-meta">' +
          '<span><i class="bi bi-calendar-event"></i> ' + fmtDate(ev.data_evento) + '</span>' +
          '<span><i class="bi bi-geo-alt"></i> ' + esc(ev.local || ev.endereco || '') + '</span>' +
        '</div>' +
        '<p class="event-descricao">' + esc(ev.descricao) + '</p>' +
        '<a class="btn-evento-insta" href="' + instaUrl + '" target="_blank" rel="noopener noreferrer" title="Ver no Instagram"><i class="bi bi-instagram"></i> Ver no Instagram</a>' +
      '</div>' +
      '<div class="event-fotos-area" style="display:flex;align-items:center;justify-content:center;background:var(--bg-alt);color:#94a3b8;font-size:3rem;overflow:hidden;">' +
        (ev.fotos || ev.arquivo ? '<img src="' + imgUrl(ev.fotos || ev.arquivo, 'eventos') + '" alt="' + esc(ev.titulo) + '">' : '<i class="bi bi-calendar-event"></i>') +
      '</div>';
    container.appendChild(card);
  });
}

function mergeCastracoes(castracoes) {
  var all = [];
  if (Array.isArray(castracoes)) castracoes.forEach(function (c) {
    var tipo = (c.tipo || '').toLowerCase();
    var data = (tipo === 'mutirao') ? (c.agenda || c.origem || c.created_at) : (c.origem || c.created_at);
    all.push({ _origem: 'castracao', _raw: c, id: c.id,
      ticket: c.ticket, pet_nome: c.nome_pet || c.pet_nome, tutor_nome: c.nome || c.tutor_nome,
      especie: c.especie || c.pet_especie, sexo: c.sexo || c.pet_sexo, porte: c.porte || c.pet_porte,
      idade: c.idade || c.pet_idade, clinica: c.clinica, data: data,
      status: c.status, contato: c.contato || c.tutor_telefone, tipo: c.tipo || '',
      cpf: c.tutor_cpf || c.cpf || '', endereco: c.tutor_endereco || c.endereco || '', numero: c.tutor_numero || c.numero || '',
      bairro: c.tutor_bairro || c.bairro || '', cidade: c.tutor_cidade || c.cidade || '', estado: c.tutor_estado || c.estado || '',
      cep: c.tutor_cep || c.cep || '', agenda: c.dia_semana || c.agenda || '' });
  });
  all.sort(function (a, b) { return (b.data || '') > (a.data || '') ? 1 : -1; });
  return all;
}

function renderCastracoes(castracoes) {
  var tbody = document.querySelector('.castracao-table table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  var secCastracao = document.getElementById('section-castracao');
  if (secCastracao) secCastracao.style.display = 'block';
  if (!castracoes.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">' +
      '<i class="bi bi-info-circle me-1"></i>Nenhum agendamento no momento. ' +
      '<a href="pages/castracao.html" class="btn btn-primary btn-sm" style="margin-left:6px;"><i class="bi bi-plus-circle me-1"></i>Fazer agendamento</a></td></tr>';
    return;
  }
  castracoes.forEach(function (c) {
    var ticketNum = c.ticket || '';
    var isAtendido = (c.status || '').toLowerCase() === 'atendido';
    var tr = document.createElement('tr');
    if (isAtendido) { tr.className = 'status-atendido'; tr.style.display = 'none'; }
    tr.setAttribute('data-ticket', ticketNum);
    tr.setAttribute('data-pet', c.pet_nome || '');
    tr.setAttribute('data-responsavel', c.tutor_nome || '');
    tr.setAttribute('data-especie', c.especie || '');
    tr.setAttribute('data-sexo', c.sexo || '');
    tr.setAttribute('data-porte', c.porte || '');
    tr.setAttribute('data-idade', c.idade || '');
    tr.setAttribute('data-clinica', c.clinica || '');
    tr.setAttribute('data-data', fmtDate(c.data));
    tr.setAttribute('data-status', c.status || 'Pendente');
    tr.setAttribute('data-contato', c.contato || '');
    tr.setAttribute('data-tipo', c.tipo || '');
    tr.setAttribute('data-dia', c.agenda || '');
    tr.setAttribute('data-cpf', c.cpf || '');
    tr.setAttribute('data-endereco', c.endereco || '');
    tr.setAttribute('data-numero', c.numero || '');
    tr.setAttribute('data-bairro', c.bairro || '');
    tr.setAttribute('data-cidade', c.cidade || '');
    tr.setAttribute('data-estado', c.estado || '');
    tr.setAttribute('data-cep', c.cep || '');
    var badgeCor = (c.especie || '').toLowerCase() === 'gato'
      ? '<span class="badge" style="background:#8b5cf6;color:#fff;">Gato</span>'
      : '<span class="badge badge-info">' + esc(c.especie) + '</span>';
    var statusHtml = isAtendido
      ? '<button class="btn-status-atendido" disabled><i class="bi bi-check-circle-fill"></i> Atendido</button>'
      : (c._origem === 'castracao'
        ? '<button class="btn-status-atender" onclick="atenderCastracao(this)" data-id="' + c.id + '"><i class="bi bi-check-lg"></i> Atender</button>'
        : '<button class="btn-status-atendido" disabled style="opacity:0.5;"><i class="bi bi-check-circle-fill"></i> ' + esc(c.status) + '</button>');
    var tipoLabel = '';
    var tipoNorm = (c.tipo || '').toLowerCase();
    if (tipoNorm === 'mutirao') tipoLabel = '<span class="badge" style="background:#10b981;color:#fff;"><i class="bi bi-people me-1"></i>Mutir\u00e3o</span>';
    else if (tipoNorm === 'baixo_custo') tipoLabel = '<span class="badge" style="background:#0ea5e9;color:#fff;"><i class="bi bi-tag me-1"></i>Baixo Custo</span>';
    else if (tipoNorm === 'pets_rua') tipoLabel = '<span class="badge" style="background:#f59e0b;color:#fff;"><i class="bi bi-paw me-1"></i>Pet de Rua</span>';
    tr.innerHTML =
      '<td data-label="Ticket"><strong>' + esc(ticketNum) + '</strong>' + (tipoLabel ? '<br>' + tipoLabel : '') + '</td>' +
      '<td data-label="Pet">' + esc(c.pet_nome) + '</td>' +
      '<td data-label="Respons\u00e1vel">' + esc(c.tutor_nome) + '</td>' +
      '<td data-label="Esp\u00e9cie">' + badgeCor + '</td>' +
      '<td data-label="Cl\u00ednica">' + esc(c.clinica) + '</td>' +
      '<td data-label="Data">' + fmtDate(c.data) + '</td>' +
      '<td data-label="Status">' + statusHtml + '</td>' +
      '<td data-label="A\u00e7\u00f5es">' +
        '<button class="btn-comprovante" onclick="gerarComprovante(this)"><i class="bi bi-file-earmark-text"></i> Comprovante</button> ' +
        (c._origem === 'castracao'
          ? '<button class="btn-excluir-castracao admin-only" onclick="excluirCastracao(this)" data-id="' + c.id + '" title="Excluir"><i class="bi bi-trash"></i> Excluir</button>'
          : '') +
      '</td>';
    tbody.appendChild(tr);
  });
}

function renderMutiroes(eventos) {
  var container = document.getElementById('mutiroesGrid');
  if (!container) return;
  container.innerHTML = '';

  var diasSemana = ['Domingo', 'Segunda-feira', 'Ter\u00e7a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S\u00e1bado'];

  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  var hojeISO = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');

  var ativos = eventos.filter(function (ev) {
    if (ev.arquivado) return false;
    var dataISO = (ev.data_evento || ev.data || '').split('T')[0];
    if (!dataISO) return false;
    return dataISO >= hojeISO;
  }).sort(function (a, b) {
    return (a.data_evento || a.data || '') > (b.data_evento || b.data || '') ? 1 : -1;
  });

  var sec = document.getElementById('section-castracao');
  if (ativos.length > 0 && sec) sec.style.display = 'block';

  if (ativos.length === 0) {
    container.innerHTML =
      '<div class="section-empty-cta" style="width:100%;">' +
        '<i class="bi bi-calendar-heart" style="font-size:2.5rem;color:var(--brand-green);"></i>' +
        '<h3>Novas datas em breve</h3>' +
        '<p>Nenhum mutir\u00e3o ativo no momento. Acompanhe nosso calend\u00e1rio \u2014 novas datas de castra\u00e7\u00e3o gratuita chegam em breve!</p>' +
        '<div class="cta-botoes">' +
          '<a class="btn btn-primary" href="pages/castracao_mutirao.html"><i class="bi bi-calendar-event me-1"></i> Ver calend\u00e1rio de mutir\u00f5es</a>' +
          '<a class="button button-highlight" href="pages/castracao.html"><i class="bi bi-plus-circle me-1"></i> Novo Agendamento</a>' +
        '</div>' +
      '</div>';
    return;
  }

  ativos.forEach(function (ev) {
    var dataISO = (ev.data_evento || ev.data || '').split('T')[0];
    var dataBR = fmtDate(dataISO);
    var diaSem = '';
    var partes = dataISO.split('-');
    if (partes.length === 3) diaSem = diasSemana[new Date(+partes[0], +partes[1] - 1, +partes[2]).getDay()] || '+';
    var limiteBR = ev.data_limite ? fmtDate(ev.data_limite) : '';
    var local = ev.clinica || ev.local || '';
    var endereco = ev.endereco || '';
    var especie = (ev.especie_padrao || '');
    var sexo = (ev.sexo_padrao || 'Ambos');
    var periodo = (ev.periodo || '');

    var badgeHtml = '';
    if (especie.toLowerCase() === 'gato') badgeHtml += '<span class="badge" style="background:#a855f7;color:#fff;">Gatos</span>';
    else if (especie.toLowerCase() === 'cachorro') badgeHtml += '<span class="badge" style="background:#f59e0b;color:#fff;">Cachorros</span>';
    else badgeHtml += '<span class="badge" style="background:#10b981;color:#fff;">Gatos e Cachorros</span>';
    if (sexo.toLowerCase() === 'macho' || sexo.toLowerCase() === 'f\u00eamea') badgeHtml += '<span class="badge" style="background:#0ea5e9;color:#fff;">' + esc(sexo) + '</span>';
    if (periodo) badgeHtml += '<span class="badge" style="background:#f43f5e;color:#fff;">' + esc(periodo.charAt(0).toUpperCase() + periodo.slice(1).toLowerCase()) + '</span>';

    var eventoData = {
      id: ev.id || '',
      data: dataBR,
      local: local,
      endereco: endereco,
      vagas: ev.vagas || 0,
      dataLimite: limiteBR,
      especiePadrao: especie,
      sexoPadrao: sexo,
      periodo: periodo || 'Manh\u00e3'
    };

    var d = document.createElement('div');
    d.className = 'mutirao-card';
    d.innerHTML =
      '<div class="mutirao-card-header">' +
        '<div class="mutirao-data"><i class="bi bi-calendar-event"></i> ' + dataBR + '</div>' +
        (diaSem ? '<div class="mutirao-dia-semana">' + diaSem + '</div>' : '') +
      '</div>' +
      '<div class="mutirao-card-body">' +
        '<div class="mutirao-local"><i class="bi bi-geo-alt"></i> ' + esc(local) + '</div>' +
        (endereco ? '<div class="mutirao-meta">' + esc(endereco) + '</div>' : '') +
        '<div class="mutirao-meta"><i class="bi bi-people"></i> ' + (ev.vagas || 0) + ' vagas</div>' +
        (limiteBR
          ? '<div class="mutirao-meta"><i class="bi bi-clock"></i> Inscri\u00e7\u00f5es at\u00e9: <strong>' + limiteBR + '</strong></div>'
          : '<div class="mutirao-meta"><i class="bi bi-info-circle"></i> Aguardando confirma\u00e7\u00e3o</div>') +
        '<div class="mutirao-card-badges">' + badgeHtml + '</div>' +
      '</div>';

    var footer = document.createElement('div');
    footer.className = 'mutirao-card-footer';
    var link = document.createElement('a');
    link.className = 'btn btn-primary';
    link.href = 'pages/castracao_mutirao_form.html';
    link.innerHTML = '<i class="bi bi-pencil-square"></i> Inscrever-se';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.setItem('mutirao_evento', JSON.stringify(eventoData));
      location.href = 'pages/castracao_mutirao_form.html';
    });
    footer.appendChild(link);
    d.appendChild(footer);
    container.appendChild(d);
  });
}

function renderAnimais(animais) {
  var container = document.getElementById('petsGrid');
  if (!container) return;
  container.innerHTML = '';
  if (!animais.length) {
    var cta = document.createElement('div');
    cta.className = 'section-empty-cta';
    cta.style.width = '100%';
    cta.innerHTML =
      '<i class="bi bi-paw" style="font-size:2.5rem;color:#dc2626;"></i>' +
      '<h3>Nossos peludos te esperam</h3>' +
      '<p>Nenhum pet dispon\u00edvel para ado\u00e7\u00e3o no momento. Se voc\u00ea tem um pet para doar, cadastre-o; e se quer adotar, fique de olho aqui!</p>' +
      '<div class="cta-botoes">' +
        '<a class="btn btn-primary" href="pages/adocao.html"><i class="bi bi-house-heart me-1"></i> Quero Adotar</a>' +
        '<a class="btn btn-outline" href="pages/adocao.html#cadastro-pet"><i class="bi bi-plus-circle me-1"></i> Cadastrar Pet</a>' +
      '</div>';
    var wrapper = container.parentNode;
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.replaceChild(cta, wrapper);
    } else {
      container.appendChild(cta);
    }
    return;
  }
  function item(pet) {
    var d = document.createElement('div');
    d.className = 'pet-carousel-item';
    var sp = ({'canino':'Cachorro','felino':'Gato'})[pet.especie] || pet.especie;
    var nm = pet.nome || (pet.caracteristicas ? pet.caracteristicas.split(',')[0].replace(/^Atende pelo nome\s*/i,'').trim() : '');
    d.setAttribute('data-nome', nm);
    d.setAttribute('data-especie', sp);
    d.setAttribute('data-porte', pet.porte || '');
    d.setAttribute('data-idade', pet.idade || '');
    d.setAttribute('data-caracteristicas', pet.caracteristicas || '');
    d.setAttribute('onclick', 'abrirTermo(this)');
    d.innerHTML =
      '<div class="carousel-img-wrap" style="position:relative;width:100%;height:220px;overflow:hidden;">' +
        '<button class="btn-delete-pet admin-only" data-id="' + pet.id + '" title="Excluir pet"><i class="bi bi-x-lg"></i></button>' +
        '<img src="' + imgUrl(pet.foto_url || pet.arquivo, 'adocao') + '" alt="' + esc(nm) + '" style="width:100%;height:100%;object-fit:cover;">' +
        '<span class="carousel-badge badge badge-success" style="position:absolute;top:10px;left:10px;border-radius:20px;">' + esc(pet.status || 'Dispon\u00edvel') + '</span>' +
      '</div>' +
      '<div class="carousel-info" style="padding:1rem;">' +
        '<div class="carousel-name" style="font-size:1.1rem;font-weight:700;color:var(--heading-color);margin-bottom:0.5rem;">' + esc(nm) + '</div>' +
        '<div class="carousel-detail" style="font-size:0.85rem;color:var(--text-color);margin-bottom:0.25rem;"><span style="font-weight:600;">Idade:</span> ' + esc(pet.idade) + '</div>' +
        '<div class="carousel-detail" style="font-size:0.85rem;color:var(--text-color);margin-bottom:0.25rem;"><span style="font-weight:600;">Porte:</span> ' + esc(pet.porte) + '</div>' +
        '<div class="carousel-detail" style="font-size:0.85rem;color:var(--text-color);"><span style="font-weight:600;">Caracter\u00edsticas:</span> ' + esc(pet.caracteristicas) + '</div>' +
      '</div>';
    var delBtn = d.querySelector('.btn-delete-pet');
    if (delBtn) {
      delBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var id = delBtn.dataset.id;
        if (!confirm('Tem certeza que deseja excluir este pet?')) return;
        delBtn.disabled = true;
        delBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
        apiFetch('/adocao/' + encodeURIComponent(id), { method: 'DELETE' })
          .then(function(r) {
            if (!r.ok) throw new Error('Erro ao excluir');
            d.remove();
          })
          .catch(function(err) {
            alert('Erro ao excluir pet: ' + err.message);
            delBtn.disabled = false;
            delBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
          });
      });
    }
    return d;
  }
  animais.forEach(function (p) { container.appendChild(item(p)); });
}

function renderVoluntarios(voluntarios) {
  var container = document.querySelector('.voluntarios-carrossel');
  if (!container) return;
  container.innerHTML = '';
  if (!voluntarios.length) {
    container.innerHTML =
      '<div class="section-empty-cta" style="width:100%;">' +
        '<i class="bi bi-people" style="font-size:2.5rem;color:var(--brand-teal);"></i>' +
        '<h3>Fa\u00e7a parte do nosso time</h3>' +
        '<p>Nosso time de volunt\u00e1rios est\u00e1 crescendo! Junte-se a n\u00f3s resgatando, cuidando e dando visibilidade aos animais \u2014 ou seja um parceiro da causa.</p>' +
        '<div class="cta-botoes">' +
          '<a class="btn btn-primary" href="pages/voluntario.html"><i class="bi bi-people-fill me-1"></i> Seja Volunt\u00e1rio</a>' +
          '<a class="button btn" style="background:var(--brand-coral);" href="pages/parceria.html"><i class="bi bi-hand-thumbs-up me-1"></i> Seja um Parceiro</a>' +
        '</div>' +
      '</div>';
    return;
  }
  var cores = ['var(--brand-teal)', 'var(--brand-coral)', 'var(--brand-purple)', 'var(--brand-blue)', 'var(--brand-green)', 'var(--brand-yellow)'];
  voluntarios.forEach(function (v, i) {
    var card = document.createElement('div');
    card.className = 'voluntario-card';
    card.style.cssText = 'flex:0 0 280px;width:280px;';
    var inicial = (v.nome || '?').charAt(0).toUpperCase();
    card.innerHTML =
      '<button class="btn-delete-voluntario admin-only" data-id="' + v.id + '" title="Excluir volunt\u00e1rio"><i class="bi bi-x-lg"></i></button>' +
      '<div style="padding:1.25rem;text-align:center;">' +
        '<div style="width:60px;height:60px;border-radius:50%;background:' + cores[i % cores.length] + ';color:white;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:bold;margin:0 auto 10px;">' + inicial + '</div>' +
        '<div style="font-weight:bold;">' + esc(v.nome) + '</div>' +
        '<div style="font-size:0.85rem;color:var(--muted-color);">' + esc(v.localidade || v.habilidade || '') + '</div>' +
        '<div style="font-size:0.8rem;font-style:italic;margin-top:8px;">"' + esc(v.mensagem) + '"</div>' +
      '</div>';
    container.appendChild(card);
  });
}

function imgUrl(f, pasta) {
  if (!f) return '/static/css/imagem/1.jpg';
  if (f.indexOf('://') !== -1 || f.indexOf('data:') === 0) return f;
  return BASE + '/uploads/' + pasta + '/' + f;
}

function fmtDate(d) {
  if (!d) return '';
  if (d.match(/^\d{2}\/\d{2}\/\d{4}$/)) return d;
  var partes = d.split('T')[0].split('-');
  if (partes.length === 3 && partes[0].length === 4) return partes[2] + '/' + partes[1] + '/' + partes[0];
  var dt = new Date(d);
  if (!isNaN(dt.getTime())) {
    return String(dt.getUTCDate()).padStart(2,'0') + '/' + String(dt.getUTCMonth()+1).padStart(2,'0') + '/' + dt.getUTCFullYear();
  }
  return d;
}

function esc(s) {
  if (!s) return '';
  var e = document.createElement('div');
  e.appendChild(document.createTextNode(s));
  return e.innerHTML;
}
