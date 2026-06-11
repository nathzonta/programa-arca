/* Dropdown menu do mobile */
document
    .getElementById('hamburguer-menu')
    .addEventListener('click', function () {
        document
            .getElementById('menu-mobile')
            .classList.toggle('aberto');
    });

/* Carrosel */

const cards = document.querySelectorAll('.adoption-card');
const botoes = document.querySelectorAll('.adoption-botoes button');

let cardAtual = 0;

function mostrarCard(index) {
    cards.forEach(card => {
        card.style.display = 'none'
    });

    cards[index].style.display = 'block';
    cards[index].style.opacity = 1;
}

function voltar() {
    cardAtual = (cardAtual - 1 + cards.length) % cards.length;
    mostrarCard(cardAtual);
}

function avancar() {
    cardAtual = (cardAtual + 1) % cards.length;
    mostrarCard(cardAtual);
}

botoes[0].addEventListener('click', voltar);
botoes[1].addEventListener('click', avancar);

mostrarCard(cardAtual);

/* Filtro de campanhas */

const badgesFiltro = document.getElementById('filtro-campanhas').querySelectorAll('.badge-arca');
const badgesCampanhas = document.getElementById('campanhas').querySelectorAll('.badge-arca');

badgesFiltro.forEach(badge => {
    badge.addEventListener('click', function () {
        const filtro = this.innerText;

        badgesCampanhas.forEach(badgeCampanha => {
            if ((badgeCampanha.innerText == filtro) || filtro == 'Todos') {
                badgeCampanha.closest('.card').hidden = false;
            } else {
                badgeCampanha.closest('.card').hidden = true;
            }
        })
    });
});