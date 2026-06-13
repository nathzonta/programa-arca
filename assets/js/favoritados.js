var sessao = null;

$(document).ready(function () {
    if (!protegerRota(['cidadao', 'representante'])) return;
    carregarDadosSidebar();
    sessao = getSessao();
    carregarFavoritos();
    inicializarFiltros();
});

function carregarFavoritos() {
    if (!sessao) return;

    listarFavoritosDaConta(sessao.id).then(function (animaisFav) {
        renderizar(animaisFav);
    });
}

function renderizar(animaisFav) {
    var $grid = $('#favoritados-grid');
    if (!$grid.length) return;

    if (!animaisFav || animaisFav.length === 0) {
        $grid.html('<p class="empty">Nenhum animal favoritado.</p>');
        return;
    }

    var nome = ($('#filtro-nome').val() || '').toLowerCase();
    var porte = $('#filtro-porte').val() || '';

    var filtrados = animaisFav.filter(function (a) {
        var matchNome = !nome || (a.nome || '').toLowerCase().indexOf(nome) > -1;
        var matchPorte = !porte || (a.porte || '').toLowerCase() === porte;
        return matchNome && matchPorte;
    });

    if (filtrados.length === 0) {
        $grid.html(('<p class="empty">Nenhum animal favoritado possui o filtro.</p>'));
        return;
    }

    var html = '';
    $.each(filtrados, function (i, animal) {
        html +=
        '<div class="col-12 col-md-4 card card-animal p-1" data-animal-id="' + animal.id + '">' +
            '<div class="card-body d-flex flex-column gap-3">' +
                '<div style="position: relative;">' +
                    '<img class="card-animal-img col-12" src="' + (animal.imagem || './assets/imgs/placeholder.png') + '" alt="' + animal.nome + '">' +
                '</div>' +
                '<div class="card-animal-text">' +
                    '<h4 class="d-flex justify-content-between">' + animal.nome + '</h4>' +
                    '<div class="card-animal-badges">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + (animal.porte || '').toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">R$ ' + (animal.valor_custo || '0') + '/mês</span>' +
                    '</div>' +
                    '<p class="corpo corpo-sm text-muted mt-2 p-2">' +
                    (animal.especie || '') + ': ' + (animal.raca || '') + ' | ' + (animal.idade_aprox || '') + ' anos<br><br>' +
                    (animal.descricao || '') +
                    '</p>' +
                '</div>' +
                '<div class="card-animal-footer">' +
                    '<button class="action-btn btn-remover-favorito" data-id="' + animal.id + '">' +
                        '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' +
                        '</svg>' +
                        '<span class="tooltip-text">Remover dos favoritos</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

$(document).on('click', '.btn-remover-favorito', function () {
    var id = $(this).data('id');
    if (!sessao) return;

    removerFavorito(sessao.id, id).then(function () {
        adicionarHistorico(sessao.id, id, 'desfavoritado');
        carregarFavoritos();
    });
});

function inicializarFiltros() {
    $('#filtro-nome').on('input', carregarFavoritos);
    $('#filtro-porte').on('change', carregarFavoritos);

    var observer = new MutationObserver(carregarFavoritos);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}
