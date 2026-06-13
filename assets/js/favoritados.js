var animais = [
    {
        id: 1,
        nome: "Luna",
        imagem: "./assets/imgs/luna-card.jpg",
        porte: "Pequeno",
        vacina: "Vacinação completa",
        custo: 115,
        especie: "Gato",
        raca: "Indefinida",
        idade: "1 ano",
        sexo: "Fêmea",
        descricao: "Luna é uma gatinha tranquila e observadora que adora encontrar um cantinho confortável para descansar perto das pessoas."
    },
    {
        id: 2,
        nome: "Tobias",
        imagem: "./assets/imgs/tobias-card.jpg",
        porte: "Médio",
        vacina: "Vacinação incompleta",
        custo: 180,
        especie: "Cachorro",
        raca: "Labrador",
        idade: "4 anos",
        sexo: "Macho",
        descricao: "Tobias é um cãozinho alegre e companheiro, sempre pronto para um passeio ou alguns minutos de brincadeira."
    }
];

var favoritos = new Set();
var interesses = new Set();
var usuarioAtual = null;

$(document).ready(function () {
    var sessao = getSessao();
    if (sessao) {
        usuarioAtual = sessao.id;
        Promise.all([
            buscarFavoritos(usuarioAtual),
            buscarInteresses(usuarioAtual)
        ]).then(function (resultado) {
            favoritos = new Set(resultado[0]);
            interesses = new Set(resultado[1]);
            if (favoritos.size === 0) {
                favoritos = new Set([1, 2]);
                salvarFavoritos(usuarioAtual, Array.from(favoritos));
            }
            renderizar();
        });
    } else {
        favoritos = new Set([1, 2]);
        renderizar();
    }

    $('#favoritados-grid').on('click', '[data-acao]', function () {
        var $btn = $(this);
        var $card = $btn.closest('[data-animal-id]');
        var id = parseInt($card.data('animal-id'));
        if (!id) return;

        if ($btn.data('acao') === 'interesse') toggleInteresse(id);
        else if ($btn.data('acao') === 'favorito') toggleFavorito(id, $card);
    });

    inicializarFiltros();
});

function toggleInteresse(id) {
    if (interesses.has(id)) interesses.delete(id);
    else interesses.add(id);
    if (usuarioAtual) salvarInteresses(usuarioAtual, Array.from(interesses));
    atualizarBotoes(id);
}

function toggleFavorito(id, $card) {
    favoritos.delete(id);
    if (usuarioAtual) salvarFavoritos(usuarioAtual, Array.from(favoritos));

    $card.addClass('removendo');
    setTimeout(function () {
        renderizar();
    }, 300);
}

function atualizarBotoes(id) {
    var $card = $('[data-animal-id="' + id + '"]');
    if (!$card.length) return;

    $card.find('[data-acao="interesse"]').toggleClass('active', interesses.has(id));
    $card.find('[data-acao="favorito"]').toggleClass('active', favoritos.has(id));
}

function renderizar() {
    var $grid = $('#favoritados-grid');
    if (!$grid.length) return;

    var nome = ($('#filtro-nome').val() || '').toLowerCase();
    var porte = $('#filtro-porte').val() || '';
    var sexo = $('#filtro-sexo').val() || '';

    var animaisFav = animais.filter(function (a) {
        if (!favoritos.has(a.id)) return false;
        var matchNome = a.nome.toLowerCase().includes(nome);
        var matchPorte = !porte || a.porte.toLowerCase() === porte;
        var matchSexo = !sexo || a.sexo.toLowerCase() === sexo;
        return matchNome && matchPorte && matchSexo;
    });

    if (animaisFav.length === 0) {
        $grid.html(
            '<div class="favoritados-empty">' +
                '<h3>Nenhum animal encontrado</h3>' +
                '<p class="corpo corpo-sm">Nenhum dos seus favoritos corresponde aos filtros selecionados.</p>' +
                '<a href="./adocao.html" class="corpo corpo-sm">Ir para Encontre seu companheiro</a>' +
            '</div>'
        );
        return;
    }

    var html = animaisFav.map(function (animal) {
        var temInteresse = interesses.has(animal.id);
        return '' +
        '<div class="col-12 col-md-4 card card-animal p-1" data-animal-id="' + animal.id + '">' +
            '<div class="card-body d-flex flex-column gap-3">' +
                '<div style="position: relative;">' +
                    '<img class="card-animal-img col-12" src="' + animal.imagem + '" alt="' + animal.nome + '">' +
                '</div>' +
                '<div class="card-animal-text">' +
                    '<h4 class="d-flex justify-content-between">' + animal.nome + '</h4>' +
                    '<div class="card-animal-badges">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + animal.porte.toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-info">' + animal.vacina + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">Custo mensal médio de R$ ' + animal.custo + '</span>' +
                    '</div>' +
                    '<p class="corpo corpo-sm text-muted mt-2 p-2">' +
                    animal.especie + ': ' + animal.raca + ' | ' + animal.idade + ' | ' + animal.sexo + '<br><br>' +
                    animal.descricao +
                    '</p>' +
                '</div>' +
                '<div class="card-animal-footer">' +
                    '<button class="action-btn btn-interesse ' + (temInteresse ? 'active' : '') + '" data-acao="interesse">' +
                        '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
                        '</svg>' +
                        '<span class="tooltip-text">Tenho interesse</span>' +
                    '</button>' +
                    '<button class="action-btn btn-favorito active" data-acao="favorito">' +
                        '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' +
                        '</svg>' +
                        '<span class="tooltip-text">Remover dos favoritos</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    $grid.html(html);
}

function inicializarFiltros() {
    $('#filtro-nome').on('input', renderizar);
    $('#filtro-sexo').on('input', renderizar);

    var observer = new MutationObserver(renderizar);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}
