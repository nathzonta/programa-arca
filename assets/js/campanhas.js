let sessao = null;
let campanhasFiltradas = [];

$(document).ready(function () {
    if (!protegerRota(['cidadao', 'representante'])) {
        return;
    }
    sessao = getSessao();

    carregarDadosSidebar();
    inicializarFiltros();
    carregarCampanhas();
});

function carregarCampanhas() {
    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas;
        renderizarCampanhas(campanhasFiltradas);
    });
}

function renderizarCampanhas(lista) {
    let $grid = $('#campanhas-grid');
    if (!$grid.length) return;

    console.log(lista);

    if (lista.length === 0) {
        $grid.html('<p style="empty">Nenhuma campanha encontrada.</p>');
        return;
    }

    const tipos = {
        "Castração": "sucesso",
        "Feira de Adoção": "aviso",
        "Vacinação": "info"
    }

    let html = '';
    $.each(lista, function (i, campanha) {
        html +=
        '<div class="col-12 col-md-3 card card-campanha p-1" data-id="' + campanha.id + '">' +
            '<div class="card-body d-flex flex-column justify-content-between gap-4">' +
                '<img class="col-12" style="border-radius: 15px;" src="' + (campanha.imagem || './assets/imgs/placeholder.png') + '" alt="' + (campanha.titulo || '') + '">' +
                '<div class="card-campanha-text mx-4">' +
                    '<h4>' + (campanha.titulo || '') + '</h4>' +
                    '<span class="badge-arca badge-arca-' + (tipos[campanha.tipo]) + ' mb-2 me-1">' + (campanha.tipo) + '</span>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' + (campanha.descricao || '') + '</p>' +
                '</div>' +
                '<div class="card-campanha-infos mx-4">' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.data || '') + '</p>' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.local || '') + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

function inicializarFiltros() {
    $('#filtro-tipo').on('change', aplicarFiltros);

    let observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    let tipo = $('#filtro-tipo').val() || '';

    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas.filter(function (c) {
            return !tipo || c.tipo === tipo;
        });
        renderizarCampanhas(campanhasFiltradas);
    });
}
