// Página inicial: menu no celular, números, animais e campanhas (dados vindos do "banco")

var campanhasLanding = [];
var tipoLanding = '';

// ---------- Menu no celular ----------

var botaoMenu = qs('#topo-menu');
var painelMenu = qs('#topo-painel');

botaoMenu.addEventListener('click', function () {
    var abrir = !painelMenu.classList.contains('aberto');
    painelMenu.classList.toggle('aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', String(abrir));
    botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
});

// Clicar num link do menu fecha o menu
painelMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
        painelMenu.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && painelMenu.classList.contains('aberto')) {
        painelMenu.classList.remove('aberto');
        botaoMenu.setAttribute('aria-expanded', 'false');
        botaoMenu.focus();
    }
});

// ---------- Dados ----------

getBanco().then(function (bd) {
    var animais = bd.animais || [];
    var campanhas = bd.campanhas || [];

    qs('#num-animais').textContent = animais.length;
    qs('#num-campanhas').textContent = campanhas.length;
    qs('#num-orgs').textContent = (bd.instituicoes || []).length;
    qs('#numeros').hidden = false;

    mostrarAnimais(animais);

    campanhasLanding = campanhas;
    mostrarCampanhas();
}).catch(function () {
    qs('#espera').innerHTML = '<p class="aviso aviso--atencao">Não foi possível carregar os animais agora. Abra o site por um servidor local (por exemplo, a extensão Live Server do VS Code).</p>';
    qs('#campanhas-lista').innerHTML = '';
});

// Quantos itens aparecem na página inicial; o restante fica atrás do login
var LIMITE_ANIMAIS = 4;
var LIMITE_CAMPANHAS = 4;

function mostrarAnimais(animais) {
    var area = qs('#espera');
    var mais = qs('#espera-mais');
    var destaque = animais.slice(0, LIMITE_ANIMAIS);

    if (destaque.length === 0) {
        area.innerHTML = '<div class="vazio" style="grid-column: 1 / -1"><img src="./assets/imgs/illus-cat.svg" alt=""><h3>Ainda não há animais cadastrados</h3><p>As organizações parceiras estão preparando os cadastros. Volte em breve.</p></div>';
        return;
    }

    area.innerHTML = destaque.map(function (animal) {
        return '<article class="espera__item">' +
            '<div class="espera__foto arco"><img src="' + esc(animal.imagem || IMG_PADRAO) + '" alt="Foto de ' + esc(animal.nome) + '" loading="lazy"></div>' +
            '<h3 class="espera__nome">' + esc(animal.nome) + '</h3>' +
            '<div class="espera__tags">' +
                '<span class="etiqueta etiqueta--castracao">' + esc(animal.especie || '') + (animal.idade_aprox ? ' · ' + esc(idadeEmAnos(animal.idade_aprox)) : '') + '</span>' +
                '<span class="etiqueta etiqueta--vacina">' + esc(animal.saude || '') + '</span>' +
            '</div>' +
            '<p class="espera__texto">' + esc(animal.descricao || '') + '</p>' +
            '<div><a class="link-seta" href="./adocao.html">Quero adotar ' + esc(animal.nome) + icone('seta-direita') + '</a></div>' +
        '</article>';
    }).join('');

    if (animais.length > LIMITE_ANIMAIS) {
        mais.innerHTML = '<a class="botao botao--contorno" href="./adocao.html">Ver todos os ' + animais.length + ' animais' + icone('seta-direita', 'icone--seta') + '</a>';
        mais.hidden = false;
    }
}
// ---------- Campanhas ----------

function mostrarCampanhas() {
    var area = qs('#campanhas-lista');
    var filtradas = campanhasLanding.filter(function (c) { return !tipoLanding || c.tipo === tipoLanding; });
    var lista = filtradas.slice(0, LIMITE_CAMPANHAS);
    var mais = qs('#campanhas-mais');
    mais.hidden = filtradas.length <= LIMITE_CAMPANHAS;
    mais.innerHTML = '<a class="link-seta" href="./campanhas.html">Ver as ' + filtradas.length + ' campanhas' + icone('seta-direita') + '</a>';

    if (lista.length === 0) {
        area.innerHTML = '<div class="vazio"><h3>Nenhuma campanha encontrada</h3><p>Não há campanhas deste tipo por enquanto. Volte em breve.</p></div>';
        return;
    }

    area.innerHTML = '<div class="agenda">' + lista.map(function (c) {
        var data = extrairData(c.data);
        return '<article class="agenda__item">' +
            '<div class="agenda__data" aria-hidden="true">' +
                (data ? '<span class="agenda__dia">' + data.dia + '</span><span class="agenda__mes">' + data.mes + '</span>' : icone('calendario', 'icone--grande')) +
            '</div>' +
            '<div class="agenda__corpo">' +
                '<div>' + etiquetaCampanha(c.tipo) + '</div>' +
                '<h3 class="agenda__titulo">' + esc(c.titulo) + '</h3>' +
                '<p class="agenda__texto">' + textoComNegrito(c.descricao || '') + '</p>' +
            '</div>' +
            '<div class="agenda__lado">' +
                '<div class="agenda__foto"><img src="' + esc(c.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
                '<div class="agenda__info">' +
                    '<span>' + icone('calendario') + esc(c.data || '') + '</span>' +
                    '<span>' + icone('mapa') + esc(c.local || '') + '</span>' +
                '</div>' +
            '</div>' +
        '</article>';
    }).join('') + '</div>';
}

qs('#filtro-campanhas').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (!chip) return;
    qsa('.chip', qs('#filtro-campanhas')).forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
    });
    tipoLanding = chip.dataset.tipo;
    mostrarCampanhas();
});
