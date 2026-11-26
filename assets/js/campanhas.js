// Tela de campanhas para o cidadão: agenda com filtro por tipo

var sessao = null;
var campanhas = [];
var tipoAtual = '';

if (protegerRota(['cidadao', 'representante'])) {
    sessao = getSessao();
    montarMenu('campanhas');
    iniciar();
}

function iniciar() {
    listarCampanhas().then(function (lista) {
        campanhas = lista;
        renderizarCampanhas();
    });

    qs('#filtro-tipo').addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        qsa('.chip', qs('#filtro-tipo')).forEach(function (c) {
            c.setAttribute('aria-pressed', String(c === chip));
        });
        tipoAtual = chip.dataset.tipo;
        renderizarCampanhas();
    });
}

// Monta uma linha da agenda (também usada pela página inicial)
function linhaAgenda(campanha, indice) {
    var data = extrairData(campanha.data);
    return '<article class="agenda__item entrada" style="--i:' + Math.min(indice, 8) + '">' +
        '<div class="agenda__data" aria-hidden="true">' +
            (data ? '<span class="agenda__dia">' + data.dia + '</span><span class="agenda__mes">' + data.mes + '</span>' : icone('calendario', 'icone--grande')) +
        '</div>' +
        '<div class="agenda__corpo">' +
            '<div>' + etiquetaCampanha(campanha.tipo) + '</div>' +
            '<h2 class="agenda__titulo">' + esc(campanha.titulo) + '</h2>' +
            '<p class="agenda__texto">' + textoComNegrito(campanha.descricao || '') + '</p>' +
        '</div>' +
        '<div class="agenda__lado">' +
            '<div class="agenda__foto"><img src="' + esc(campanha.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
            '<div class="agenda__info">' +
                '<span>' + icone('calendario') + esc(campanha.data || '') + '</span>' +
                '<span>' + icone('mapa') + esc(campanha.local || '') + '</span>' +
            '</div>' +
        '</div>' +
    '</article>';
}

function renderizarCampanhas() {
    var area = qs('#campanhas-grid');
    var lista = campanhas.filter(function (c) { return !tipoAtual || c.tipo === tipoAtual; });

    if (lista.length === 0) {
        area.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhuma campanha encontrada</h3>' +
                '<p>' + (tipoAtual ? 'Não há campanhas deste tipo por enquanto. Volte em breve.' : 'Ainda não há campanhas cadastradas. Volte em breve.') + '</p>' +
            '</div>';
        return;
    }

    area.innerHTML = '<p class="contagem">' + lista.length + (lista.length === 1 ? ' campanha' : ' campanhas') + '</p>' +
        '<div class="agenda">' + lista.map(linhaAgenda).join('') + '</div>';
}
