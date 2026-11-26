// Tela do representante: pessoas que demonstraram interesse nos animais da organização

var sessao = null;
var interessados = [];

if (protegerRota(['representante'])) {
    sessao = getSessao();
    montarMenu('notificacoes');
    iniciar();
}

function iniciar() {
    carregarNotificacoes();

    qs('#notif-list').addEventListener('click', function (e) {
        var botao = e.target.closest('[data-lida]');
        if (!botao) return;
        marcarNotificacaoLida(Number(botao.dataset.lida)).then(carregarNotificacoes);
    });

    qs('#btn-marcar-todas').addEventListener('click', function () {
        var pendentes = interessados.filter(function (n) { return !n.lida; });
        Promise.all(pendentes.map(function (n) { return marcarNotificacaoLida(n.id); })).then(function () {
            toast('Tudo marcado como lido.', 'sucesso');
            carregarNotificacoes();
        });
    });
}

function carregarNotificacoes() {
    listarNotificacoesPorInstituicao(sessao.id_empresa).then(function (notificacoes) {
        // Junta cada notificação com os dados do animal e mostra as mais recentes primeiro
        return listarAnimais().then(function (animais) {
            return notificacoes.map(function (n) {
                var animal = animais.find(function (a) { return a.id === n.id_animal; });
                return {
                    id: n.id,
                    nome_pessoa: n.nome_pessoa,
                    email_pessoa: n.email_pessoa,
                    nome_animal: animal ? animal.nome : 'Desconhecido',
                    imagem: animal ? animal.imagem : '',
                    data: n.data,
                    lida: n.lida
                };
            }).sort(function (a, b) {
                return b.id - a.id;
            });
        });
    }).then(function (lista) {
        interessados = lista;
        renderizarNotificacoes();
    });
}

function renderizarNotificacoes() {
    var area = qs('#notif-list');
    var naoLidas = interessados.filter(function (n) { return !n.lida; }).length;
    qs('#btn-marcar-todas').hidden = naoLidas === 0;

    if (interessados.length === 0) {
        area.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhum interessado ainda</h3>' +
                '<p>Quando alguém demonstrar interesse em um dos seus animais, o contato aparece aqui.</p>' +
                '<a class="botao" href="./listagem_animais.html">Ver meus animais ' + icone('seta-direita', 'icone--seta') + '</a>' +
            '</div>';
        return;
    }

    var html = '<p class="contagem">' + naoLidas + (naoLidas === 1 ? ' nova' : ' novas') + ' · ' + interessados.length + ' no total</p>';
    html += '<div class="interessados">';
    interessados.forEach(function (n) {
        html +=
        '<article class="interessado' + (n.lida ? ' interessado--lida' : '') + '">' +
            '<div class="tabela__foto"><img src="' + esc(n.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
            '<div>' +
                '<h2 class="interessado__titulo">' + (n.lida ? '' : '<span class="ponto-novo" title="Nova"></span><span class="sr-only">Nova: </span>') +
                    esc(n.nome_pessoa) + ' quer adotar ' + esc(n.nome_animal) + '</h2>' +
                '<p class="interessado__meta">' +
                    '<span>' + esc(formatarDataISO(n.data)) + '</span>' +
                    '<a href="mailto:' + esc(n.email_pessoa) + '">' + icone('email') + esc(n.email_pessoa) + '</a>' +
                '</p>' +
            '</div>' +
            '<div class="interessado__acao">' +
                (n.lida ? '<span class="etiqueta etiqueta--neutra">Lida</span>'
                        : '<button type="button" class="botao botao--contorno botao--pequeno" data-lida="' + n.id + '">' + icone('check') + 'Marcar como lida</button>') +
            '</div>' +
        '</article>';
    });
    html += '</div>';
    area.innerHTML = html;
}
