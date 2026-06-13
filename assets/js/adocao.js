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
        descricao: "Luna é uma gatinha tranquila e observadora que adora encontrar um cantinho confortável para descansar perto das pessoas.",
        localizacao: "Colina de Laranjeiras"
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
        descricao: "Tobias é um cãozinho alegre e companheiro, sempre pronto para um passeio ou alguns minutos de brincadeira.",
        localizacao: "Centro"
    }
];

var interesses = new Set();
var favoritos = new Set();

var animaisFiltrados = animais.slice();
var indiceAtual = 0;
var transicionando = false;

$(document).ready(function () {
    inicializarFiltros();
    inicializarAcoes();
    inicializarModalAjuda();
    renderCard(0);
});

function inicializarAcoes() {
    $('#swipe-card-container').on('click', '[data-acao]', function () {
        var acao = $(this).data('acao');
        if (acao === 'interesse') toggleInteresse();
        else if (acao === 'favorito') toggleFavorito();
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

    var temInteresse = interesses.has(animal.id);
    var temFavorito = favoritos.has(animal.id);

    $container.html(
        '<div class="col-12 col-md-4 card card-animal p-1" id="swipe-card">' +
            '<div class="card-body">' +
                '<img class="card-animal-img" src="' + animal.imagem + '" alt="' + animal.nome + '">' +
                '<div class="card-animal-text mt-4">' +
                    '<h4>' + animal.nome + '</h4>' +
                    '<div class="card-animal-badges m-0">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + animal.porte.toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-info">' + animal.vacina + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">Custo mensal médio de R$ ' + animal.custo + '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="card-animal-info d-grid g-2 mt-2">' +
                    '<p class="corpo corpo-sm text-muted mt-2" style="font-size: clamp(0.9rem, 0.9vw, 0.9rem)">' + animal.especie + ': ' + animal.raca + ' | ' + animal.idade + ' | ' + animal.sexo + '</p>' +
                    '<p class="corpo corpo-sm text-muted mt-2" style="font-size: clamp(0.9rem, 0.9vw, 0.9rem)">' + animal.descricao + '</p>' +
                '</div>' +
                '<div class="card-animal-localizacao mt-2">' +
                    '<img src="./assets/imgs/icons/mapa.svg"></img>' + 
                    '<p class="corpo corpo-sm text-muted mt-3" style="font-size: clamp(0.9rem, 0.9vw, 0.9rem)">' + animal.localizacao + '</p>' +
                '</div>' +
                '<div class="card-animal-footer">' +
                    '<button class="action-btn btn-interesse ' + (temInteresse ? 'active' : '') + '" data-acao="interesse">' +
                        '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
                        '</svg>' +
                        '<span class="tooltip-text">Tenho interesse</span>' +
                    '</button>' +
                    '<button class="action-btn btn-favorito ' + (temFavorito ? 'active' : '') + '" data-acao="favorito">' +
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
                        '<span class="tooltip-text">Próximo</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function atualizarBotoesEstado() {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    var $container = $('#swipe-card-container');

    $container.find('[data-acao="interesse"]').toggleClass('active', interesses.has(animal.id));
    $container.find('[data-acao="favorito"]').toggleClass('active', favoritos.has(animal.id));
}

function toggleInteresse() {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    if (interesses.has(animal.id)) interesses.delete(animal.id);
    else interesses.add(animal.id);
    atualizarBotoesEstado();
}

function toggleFavorito() {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    if (favoritos.has(animal.id)) favoritos.delete(animal.id);
    else favoritos.add(animal.id);
    atualizarBotoesEstado();
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
    var localizacao = $('#filtro-localizacao').val() || '';

    animaisFiltrados = animais.filter(function (animal) {
        var matchCusto = animal.custo <= custoMax;
        var matchPorte = !porte || animal.porte.toLowerCase() === porte;
        var matchSexo = !sexo || animal.sexo.toLowerCase() === sexo;
        var matchLocalizacao = !localizacao || animal.localizacao.toLowerCase().replace(/\s+/g, '-') === localizacao;
        return matchCusto && matchPorte && matchSexo && matchLocalizacao;
    });

    indiceAtual = 0;
    renderCard(0);
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
