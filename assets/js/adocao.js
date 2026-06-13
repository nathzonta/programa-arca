var animaisFiltrados = [];
var indiceAtual = 0;
var transicionando = false;
var sessao = null;

$(document).ready(function () {
    if (!protegerRota(['cidadao', 'representante'])) return;
    carregarDadosSidebar();
    sessao = getSessao();
    inicializarFiltros();
    inicializarAcoes();
    inicializarModalAjuda();
    carregarAnimais();
});

function carregarAnimais() {
    listarAnimais().then(function (todosAnimais) {
        animaisFiltrados = todosAnimais;
        indiceAtual = 0;
        renderCard(0);
    });
}

function inicializarAcoes() {
    $('#swipe-card-container').on('click', '[data-acao]', function () {
        var acao = $(this).data('acao');
        if (acao === 'interesse') acaoInteresse();
        else if (acao === 'favorito') acaoFavorito();
        else if (acao === 'proximo') proximoCard();
    });
}

function renderCard(index) {
    var $container = $('#swipe-card-container');
    if (!$container.length) return;

    if (animaisFiltrados.length === 0) {
        $container.html(
            '<div class="swipe-empty">' +
                '<h3>Nenhum animal encontrado</h3>' +
                '<p class="corpo corpo-sm">Tente ajustar os filtros para encontrar mais animais.</p>' +
            '</div>'
        );
        return;
    }

    if (index >= animaisFiltrados.length) {
        indiceAtual = 0;
    }

    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;

    buscarAnimalPorId(animal.id).then(function (a) {
        if (!a) return;
        var inst = null;
        buscarInstituicaoPorId(a.fk_instituicao).then(function (i) {
            inst = i;

            var nomeInst = inst ? inst.nome : '';
            var endereco = inst ? inst.endereco : '';

            $container.html(
                '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card-animal p-3" id="swipe-card">' +
                    '<div class="card-body">' +
                        '<img class="card-animal-img" src="' + (a.imagem || './assets/imgs/placeholder.png') + '" alt="' + a.nome + '">' +
                        '<div class="card-animal-text">' +
                            '<h4>' + a.nome + '</h4>' +
                            '<div class="card-animal-badges">' +
                                '<span class="badge-arca badge-arca-sucesso">Porte ' + (a.porte || '').toLowerCase() + '</span>' +
                                '<span class="card-animal-custo">R$ ' + (a.valor_custo || '0') + '/mes</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="card-animal-info">' +
                            '<p>' + (a.especie || '') + ': ' + (a.raca || '') + ' | ' + (a.idade_aprox || '') + ' anos</p>' +
                            '<p>' + (a.descricao || '') + '</p>' +
                        '</div>' +
                        '<div class="card-animal-localizacao">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>' +
                                '<circle cx="12" cy="10" r="3"/>' +
                            '</svg>' +
                            nomeInst + (endereco ? ' - ' + endereco : '') +
                        '</div>' +
                        '<div class="card-animal-footer">' +
                            '<button class="action-btn btn-interesse" data-acao="interesse">' +
                                '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
                                '</svg>' +
                                '<span class="tooltip-text">Tenho interesse</span>' +
                            '</button>' +
                            '<button class="action-btn btn-favorito" data-acao="favorito">' +
                                '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' +
                                '</svg>' +
                                '<span class="tooltip-text">Favoritar</span>' +
                            '</button>' +
                            '<button class="action-btn btn-proximo" data-acao="proximo">' +
                                '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                    '<line x1="18" y1="6" x2="6" y2="18"/>' +
                                    '<line x1="6" y1="6" x2="18" y2="18"/>' +
                                '</svg>' +
                                '<span class="tooltip-text">Proximo</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        });
    });
}

function acaoFavorito() {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal || !sessao) return;

    buscarUsuarioPorId(sessao.id).then(function (conta) {
        if (!conta) return;
        var favs = conta.favoritos || [];
        var idx = favs.indexOf(animal.id);
        if (idx > -1) {
            removerFavorito(sessao.id, animal.id).then(function () {
                adicionarHistorico(sessao.id, animal.id, 'desfavoritado');
                $('#swipe-card-container').find('.btn-favorito').removeClass('active');
            });
        } else {
            adicionarFavorito(sessao.id, animal.id).then(function () {
                adicionarHistorico(sessao.id, animal.id, 'favorito');
                $('#swipe-card-container').find('.btn-favorito').addClass('active');
            });
        }
    });
}

function acaoInteresse() {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal || !sessao) return;

    adicionarHistorico(sessao.id, animal.id, 'interessado').then(function () {
        buscarAnimalPorId(animal.id).then(function (a) {
            if (a) {
                criarNotificacao({
                    nome_pessoa: sessao.nome || sessao.email,
                    email_pessoa: sessao.email,
                    id_conta: sessao.id,
                    id_animal: animal.id,
                    id_instituicao: a.fk_instituicao,
                    data: new Date().toISOString().split('T')[0],
                    lida: false
                }).then(function () {
                    $('#swipe-card-container').find('.btn-interesse').addClass('active');
                    $('#swipe-card-container').find('.btn-interesse').prop('disabled', true);
                });
            }
        });
    });
}

function proximoCard() {
    if (transicionando) return;
    if (animaisFiltrados.length <= 1) return;

    transicionando = true;
    var $card = $('#swipe-card');
    if ($card.length) $card.addClass('saindo');

    setTimeout(function () {
        var novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * animaisFiltrados.length);
        } while (novoIndice === indiceAtual && animaisFiltrados.length > 1);

        indiceAtual = novoIndice;
        renderCard(indiceAtual);
        transicionando = false;
    }, 300);
}

function inicializarFiltros() {
    $('#filtro-custo').on('input', aplicarFiltros);

    var observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    var custoMax = parseFloat(($('#filtro-custo').val() || '').replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    var porte = $('#filtro-porte').val() || '';
    var sexo = $('#filtro-sexo').val() || '';

    listarAnimais().then(function (todosAnimais) {
        animaisFiltrados = todosAnimais.filter(function (animal) {
            var matchCusto = parseFloat(animal.valor_custo || 0) <= custoMax;
            var matchPorte = !porte || (animal.porte || '').toLowerCase() === porte;
            var matchSexo = !sexo || (animal.sexo || '').toLowerCase() === sexo;
            return matchCusto && matchPorte && matchSexo;
        });

        indiceAtual = 0;
        renderCard(0);
    });
}

function inicializarModalAjuda() {
    var $modal = $('#modal-ajuda');

    $('#btn-ajuda').on('click', function () {
        $modal.addClass('open');
    });

    $('#modal-ajuda-close').on('click', function () {
        $modal.removeClass('open');
    });

    $modal.on('click', function (e) {
        if (e.target === this) {
            $(this).removeClass('open');
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $modal.hasClass('open')) {
            $modal.removeClass('open');
        }
    });
}
