// ============================================================
// SISTEMA INTERNO: proteção de rotas, menu lateral e menu mobile
// Uso em cada página interna:
//   if (protegerRota(['representante'])) { montarMenu('listagem_animais'); iniciar(); }
// ============================================================

// Protege a rota: impede que um cidadão abra telas de representante e vice-versa
function protegerRota(tiposPermitidos) {
    var sessao = getSessao();
    if (!sessao || !sessao.logado) {
        window.location.href = './login.html';
        return false;
    }
    if (tiposPermitidos && tiposPermitidos.length > 0 && tiposPermitidos.indexOf(sessao.tipo) === -1) {
        window.location.href = sessao.tipo === 'representante' ? './listagem_animais.html' : './adocao.html';
        return false;
    }
    return true;
}

// Itens do menu de cada perfil. O "id" é o mesmo que a página passa em montarMenu().
var MENU = {
    cidadao: [
        {
            grupo: 'Adoção',
            itens: [
                { id: 'adocao', href: './adocao.html', texto: 'Encontre seu companheiro', icone: 'pata' },
                { id: 'favoritados', href: './favoritados.html', texto: 'Favoritados', icone: 'estrela' },
                { id: 'historico', href: './historico.html', texto: 'Histórico de ações', icone: 'relogio' }
            ]
        },
        {
            grupo: 'Campanhas',
            itens: [
                { id: 'campanhas', href: './campanhas.html', texto: 'Ver campanhas', icone: 'megafone' }
            ]
        }
    ],
    representante: [
        {
            grupo: 'Adoção',
            itens: [
                { id: 'listagem_animais', href: './listagem_animais.html', texto: 'Animais da organização', icone: 'pata' },
                { id: 'notificacoes', href: './notificacoes.html', texto: 'Interessados', icone: 'sino', contador: true }
            ]
        },
        {
            grupo: 'Campanhas',
            itens: [
                { id: 'campanhas_interno', href: './campanhas_interno.html', texto: 'Gerenciar campanhas', icone: 'megafone' }
            ]
        }
    ]
};

// Desenha o menu lateral e a barra do mobile. "paginaAtual" marca o item ativo.
function montarMenu(paginaAtual) {
    var sessao = getSessao();
    var menu = qs('#menu');
    if (!sessao || !menu) return;

    var grupos = (MENU[sessao.tipo] || MENU.cidadao).slice();

    var html = '';
    html += '<div class="menu__topo">' +
        '<a class="marca marca--clara" href="./index.html" aria-label="Programa Arca, página inicial">' +
            '<img src="./assets/imgs/Logo.svg" alt="" width="40" height="40">' +
            '<span class="marca__texto"><strong>Arca</strong><small>Prefeitura da Serra</small></span>' +
        '</a>' +
        '<button type="button" class="botao botao--icone botao--sobre-escuro menu__fechar" data-fechar-menu aria-label="Fechar menu">' + icone('x') + '</button>' +
    '</div>';

    html += '<nav class="menu__nav" aria-label="Navegação principal">';
    grupos.forEach(function (grupo) {
        html += '<div class="menu__grupo"><p class="menu__titulo">' + esc(grupo.grupo) + '</p><ul>';
        grupo.itens.forEach(function (item) {
            var atual = item.id === paginaAtual ? ' aria-current="page"' : '';
            html += '<li><a class="menu__link" href="' + item.href + '"' + atual + '>' +
                icone(item.icone) + '<span>' + esc(item.texto) + '</span>' +
                (item.contador ? '<span class="menu__contador" id="contador-notificacoes" hidden></span>' : '') +
            '</a></li>';
        });
        html += '</ul></div>';
    });
    html += '</nav>';

    html += '<div class="menu__rodape">' +
        '<div class="usuario">' +
            '<span class="usuario__avatar" aria-hidden="true">' + esc(iniciais(sessao.nome || sessao.email)) + '</span>' +
            '<span class="usuario__dados">' +
                '<strong id="side-user-name">' + esc(sessao.nome || sessao.email) + '</strong>' +
                '<small id="side-user-email">' + esc(sessao.email) + '</small>' +
            '</span>' +
        '</div>' +
        '<button type="button" class="botao botao--sobre-escuro botao--bloco" id="btn-sair">' + icone('sair') + 'Sair</button>' +
    '</div>';

    menu.innerHTML = html;

    var barra = qs('#barra-mobile');
    if (barra) {
        barra.innerHTML =
            '<button type="button" class="botao botao--icone botao--contorno" id="menu-toggle" aria-controls="menu" aria-expanded="false" aria-label="Abrir menu">' + icone('menu') + '</button>' +
            '<a class="marca" href="./index.html" aria-label="Programa Arca, página inicial">' +
                '<img src="./assets/imgs/Logo.svg" alt="" width="32" height="32"><span class="marca__texto"><strong>Arca</strong></span>' +
            '</a>';
    }

    ligarMenuMobile();

    qs('#btn-sair').addEventListener('click', function () {
        encerrarSessao();
        window.location.href = './login.html';
    });

    // Representante: mostra quantas notificações ainda não foram lidas
    if (sessao.tipo === 'representante' && sessao.id_empresa) {
        listarNotificacoesPorInstituicao(sessao.id_empresa).then(function (lista) {
            var naoLidas = lista.filter(function (n) { return !n.lida; }).length;
            var contador = qs('#contador-notificacoes');
            if (contador && naoLidas > 0) {
                contador.textContent = naoLidas;
                contador.setAttribute('aria-label', naoLidas + ' não lidas');
                contador.hidden = false;
            }
        });
    }
}

// Abrir / fechar o menu no celular e no tablet
function ligarMenuMobile() {
    var menu = qs('#menu');
    var botao = qs('#menu-toggle');
    var veu = qs('#veu');
    var telaPequena = window.matchMedia('(max-width: 62rem)');

    function estaAberto() {
        return menu.classList.contains('aberto');
    }

    // Menu fechado no celular não deve receber foco do teclado
    function atualizarFoco() {
        menu.inert = telaPequena.matches && !estaAberto();
    }

    function definir(abrir) {
        menu.classList.toggle('aberto', abrir);
        if (veu) veu.hidden = !abrir;
        if (botao) botao.setAttribute('aria-expanded', String(abrir));
        document.body.classList.toggle('menu-aberto', abrir);
        atualizarFoco();
        if (abrir) {
            qs('.menu__link', menu).focus();
        } else if (telaPequena.matches && botao) {
            botao.focus();
        }
    }

    if (botao) botao.addEventListener('click', function () { definir(!estaAberto()); });
    if (veu) veu.addEventListener('click', function () { definir(false); });
    qsa('[data-fechar-menu]', menu).forEach(function (b) {
        b.addEventListener('click', function () { definir(false); });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && estaAberto() && telaPequena.matches) definir(false);
    });
    telaPequena.addEventListener('change', function () {
        if (!telaPequena.matches) definir(false);
        atualizarFoco();
    });
    atualizarFoco();
}
