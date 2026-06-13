var acoesHistorico = [
    {
        id: 1,
        animal: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        tipo: "favoritado",
        label: "Favoritado"
    },
    {
        id: 2,
        animal: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        tipo: "interesse",
        label: "Demonstrou interesse em adotar"
    },
    {
        id: 3,
        animal: "Luna",
        imagem: "./assets/imgs/luna.png",
        tipo: "interesse",
        label: "Demonstrou interesse em adotar"
    }
];

$(document).ready(function () {
    inicializarFiltro();
    renderizar();
});

function inicializarFiltro() {
    $('#filtro-acao').on('change', renderizar);

    var observer = new MutationObserver(renderizar);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function renderizar() {
    var $grid = $('#historico-grid');
    if (!$grid.length) return;

    var filtro = $('#filtro-acao').val() || '';
    var lista = acoesHistorico.filter(function (a) { return !filtro || a.tipo === filtro; });

    if (lista.length === 0) {
        $grid.html('<p class="historico-empty">Nenhuma ação encontrada.</p>');
        return;
    }

    var html = lista.map(function (acao) {
        return '' +
        '<article class="historico-card" data-id="' + acao.id + '">' +
            '<div class="historico-card-img">' +
                '<img src="' + acao.imagem + '" alt="' + acao.animal + '">' +
            '</div>' +
            '<div class="historico-card-body">' +
                '<h2 class="historico-card-nome">' + acao.animal + '</h2>' +
                '<span class="badge-arca badge-historico-' + acao.tipo + '">' + acao.label + '</span>' +
            '</div>' +
        '</article>';
    }).join('');

    $grid.html(html);
}
