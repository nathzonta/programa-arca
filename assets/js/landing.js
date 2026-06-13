$(document).ready(function () {
    alert('Há duas contas de teste para login: \nEmail: cidadao@arca.br | Senha: 123 \nEmail: admin@arca.br | Senha: 123');

    $('#hamburguer-menu').on('click', function () {
        $('#menu-mobile').toggleClass('aberto');
    });

    let $cards = $('.adoption-card');
    let $botoes = $('.adoption-botoes button');
    let cardAtual = 0;

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

    let $badgesFiltro = $('#filtro-campanhas .badge-arca');
    let $badgesCampanhas = $('#campanhas .badge-arca');

    $badgesFiltro.on('click', function () {
        let filtro = $(this).text();

        $badgesCampanhas.each(function () {
            if ($(this).text() === filtro || filtro === 'Todos') {
                $(this).closest('.card').removeAttr('hidden');
            } else {
                $(this).closest('.card').attr('hidden', true);
            }
        });
    });
});
