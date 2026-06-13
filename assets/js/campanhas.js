var campanhasFiltradas = [];

$(document).ready(function () {
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
    var $grid = $('#campanhas-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; width: 100%;">Nenhuma campanha encontrada.</p>');
        return;
    }

    var html = '';
    $.each(lista, function (i, campanha) {
        var meta = parseFloat(campanha.meta || 0);
        var arrecadado = parseFloat(campanha.arrecadado || 0);
        var porcentagem = meta > 0 ? Math.min(100, Math.round((arrecadado / meta) * 100)) : 0;

        html +=
        '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-campanha p-1" data-id="' + campanha.id + '">' +
            '<div class="card-body d-flex flex-column justify-content-between gap-4">' +
                '<img class="col-12" style="border-radius: 15px; height: 220px; object-fit: cover;" src="' + (campanha.imagem || './assets/imgs/placeholder.png') + '" alt="' + (campanha.titulo || '') + '">' +
                '<div class="card-campanha-text mx-4">' +
                    '<h4>' + (campanha.titulo || '') + '</h4>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' + (campanha.descricao || '') + '</p>' +
                '</div>' +
                '<div class="card-campanha-infos mx-4">' +
                    '<p class="corpo corpo-micro mb-2"><strong>Meta:</strong> R$ ' + meta.toFixed(2) + '</p>' +
                    '<p class="corpo corpo-micro mb-2"><strong>Arrecadado:</strong> R$ ' + arrecadado.toFixed(2) + ' (' + porcentagem + '%)</p>' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.data_inicio || '') + ' a ' + (campanha.data_fim || '') + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

function inicializarFiltros() {
    $('#filtro-tipo').on('change', aplicarFiltros);

    var observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    var tipo = $('#filtro-tipo').val() || '';

    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas.filter(function (c) {
            return !tipo || c.titulo === tipo;
        });
        renderizarCampanhas(campanhasFiltradas);
    });
}
