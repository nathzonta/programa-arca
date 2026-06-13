var sessao = null;

$(document).ready(function () {
    if (!protegerRota(['cidadao', 'representante'])) return;
    carregarDadosSidebar();
    sessao = getSessao();
    inicializarFiltro();
    carregarHistorico();
});

function carregarHistorico() {
    if (!sessao) return;

    listarHistoricoDaConta(sessao.id).then(function (historico) {
        renderizar(historico);
    });
}

function renderizar(lista) {
    var $grid = $('#historico-grid');
    if (!$grid.length) return;

    if (!lista || lista.length === 0) {
        $grid.html('<p class="historico-empty">Nenhuma acao registrada ainda.</p>');
        return;
    }

    var filtro = $('#filtro-acao').val() || '';
    var filtrados = lista.filter(function (a) {
        return !filtro || a.acao === filtro;
    });

    if (filtrados.length === 0) {
        $grid.html('<p class="historico-empty">Nenhuma acao encontrada para este filtro.</p>');
        return;
    }

    var html = '';
    $.each(filtrados, function (i, item) {
        var labelAcao = item.acao === 'favorito' ? 'Favoritado' :
                        item.acao === 'desfavoritado' ? 'Removido dos favoritos' :
                        item.acao === 'interessado' ? 'Demonstrou interesse em adotar' :
                        item.acao;

        html +=
        '<article class="historico-card" data-id="' + item.id_animal + '">' +
            '<div class="historico-card-img">' +
                '<img src="' + (item.imagem || './assets/imgs/placeholder.png') + '" alt="' + item.nome_animal + '">' +
            '</div>' +
            '<div class="historico-card-body">' +
                '<h2 class="historico-card-nome">' + item.nome_animal + '</h2>' +
                '<span class="badge-arca badge-historico-' + item.acao + '">' + labelAcao + '</span>' +
                '<p class="corpo corpo-sm text-muted mt-1">' + item.data + '</p>' +
            '</div>' +
        '</article>';
    });

    $grid.html(html);
}

function inicializarFiltro() {
    $('#filtro-acao').on('change', carregarHistorico);

    var observer = new MutationObserver(carregarHistorico);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}
