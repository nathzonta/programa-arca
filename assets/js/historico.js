// Tela de histórico: linha do tempo das ações da pessoa

var sessao = null;
var historico = [];
var filtroAtual = '';

// Textos de cada tipo de ação
var ACOES = {
    interessado: { texto: 'Demonstrou interesse em adotar', classe: 'feira' },
    favorito: { texto: 'Favoritado', classe: 'coral' },
    desfavoritado: { texto: 'Removido dos favoritos', classe: 'neutra' }
};

if (protegerRota(['cidadao', 'representante'])) {
    sessao = getSessao();
    montarMenu('historico');
    iniciar();
}

function iniciar() {
    listarHistoricoDaConta(sessao.id).then(function (lista) {
        historico = lista;
        renderizar();
    });

    // Chips de filtro: só um fica marcado por vez
    qs('#filtro-acao').addEventListener('click', function (e) {
        var chip = e.target.closest('.chip');
        if (!chip) return;
        qsa('.chip', qs('#filtro-acao')).forEach(function (c) {
            c.setAttribute('aria-pressed', String(c === chip));
        });
        filtroAtual = chip.dataset.acao;
        renderizar();
    });
}

function renderizar() {
    var area = qs('#historico-grid');

    if (historico.length === 0) {
        area.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhuma ação registrada</h3>' +
                '<p>Suas visitas e interesses aparecem aqui assim que você começar a conhecer os animais.</p>' +
                '<a class="botao" href="./adocao.html">Conhecer animais ' + icone('seta-direita', 'icone--seta') + '</a>' +
            '</div>';
        return;
    }

    var filtrados = historico.filter(function (item) {
        return !filtroAtual || item.acao === filtroAtual;
    });

    if (filtrados.length === 0) {
        area.innerHTML = '<div class="vazio"><h3>Nada para este filtro</h3><p>Nenhuma ação deste tipo foi registrada ainda.</p></div>';
        return;
    }

    var html = '<ol class="linha-tempo">';
    filtrados.forEach(function (item, i) {
        var info = ACOES[item.acao] || { texto: item.acao, classe: 'neutra' };
        html +=
        '<li class="evento evento--' + esc(item.acao) + ' entrada" style="--i:' + Math.min(i, 8) + '">' +
            '<div class="evento__foto"><img src="' + esc(item.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
            '<div>' +
                '<h2 class="evento__nome">' + esc(item.nome_animal) + '</h2>' +
                '<p class="evento__meta">' +
                    '<span class="etiqueta etiqueta--' + info.classe + '">' + esc(info.texto) + '</span>' +
                    '<time datetime="' + esc(item.data) + '">' + esc(formatarDataISO(item.data)) + '</time>' +
                '</p>' +
            '</div>' +
        '</li>';
    });
    html += '</ol>';
    area.innerHTML = html;
}
