$(document).ready(function () {
    $('#hamburguer-menu').on('click', function () {
        $('#menu-mobile').toggleClass('aberto');
    });

    var $cards = $('.adoption-card');
    var $botoes = $('.adoption-botoes button');
    var cardAtual = 0;

    function mostrarCard(index) {
        $cards.hide().eq(index).show().css('opacity', 1);
    }

    function voltar() {
        cardAtual = (cardAtual - 1 + $cards.length) % $cards.length;
        mostrarCard(cardAtual);
    }

    function avancar() {
        cardAtual = (cardAtual + 1) % $cards.length;
        mostrarCard(cardAtual);
    }

    $botoes.eq(0).on('click', voltar);
    $botoes.eq(1).on('click', avancar);

    mostrarCard(cardAtual);

    if (window.innerWidth < 768) {
        setInterval(avancar, 5000);
    }

    var $badgesFiltro = $('#filtro-campanhas .badge-arca');
    var $badgesCampanhas = $('#campanhas .badge-arca');

    $badgesFiltro.on('click', function () {
        var filtro = $(this).text();

        $badgesCampanhas.each(function () {
            if ($(this).text() === filtro || filtro === 'Todos') {
                $(this).closest('.card').removeAttr('hidden');
            } else {
                $(this).closest('.card').attr('hidden', true);
            }
        });
    });
});
