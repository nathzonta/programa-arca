let sessao = null;

$(document).ready(function () {
    if (!protegerRota(['representante'])) {
        return;
    }
    sessao = getSessao();
    carregarDadosSidebar();
    carregarNotificacoes();
});

function carregarNotificacoes() {
    if (!sessao || !sessao.id_empresa) return;

    listarNotificacoesPorInstituicao(sessao.id_empresa).then(function (notificacoes) {
        let listaComAnimal = [];
        let pendentes = notificacoes.length;

        if (pendentes === 0) {
            renderizarNotificacoes([]);
            return;
        }

        notificacoes.forEach(function (notif) {
            buscarAnimalPorId(notif.id_animal).then(function (animal) {
                listaComAnimal.push({
                    id: notif.id,
                    nome_pessoa: notif.nome_pessoa,
                    email_pessoa: notif.email_pessoa,
                    nome_animal: animal ? animal.nome : 'Desconhecido',
                    imagem: animal ? animal.imagem : '',
                    data: notif.data,
                    lida: notif.lida
                });
                pendentes--;
                if (pendentes === 0) {
                    renderizarNotificacoes(listaComAnimal);
                }
            });
        });
    });
}

function renderizarNotificacoes(lista) {
    let $container = $('#notif-list');
    if (!$container.length) return;

    if (lista.length === 0) {
        $container.html('<p class="notif-empty">Nenhuma notificacao no momento.</p>');
        return;
    }

    let html = '';
    $.each(lista, function (i, notif) {
        let classeLida = notif.lida ? ' notif-lida' : '';
        html +=
        '<div class="notif-card' + classeLida + '" data-id="' + notif.id + '">' +
            '<div class="notif-card-img">' +
                '<img src="' + (notif.imagem || './assets/imgs/placeholder.png') + '" alt="' + notif.nome_animal + '">' +
            '</div>' +
            '<div class="notif-card-body">' +
                '<h2 class="notif-card-title">' + notif.nome_pessoa + ' quer adotar ' + notif.nome_animal + '!</h2>' +
                '<p class="notif-card-desc">Data: ' + notif.data + '</p>' +
                '<div class="notif-card-contato">' +
                    '<a href="mailto:' + notif.email_pessoa + '" class="notif-contato-pill">' +
                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<rect x="2" y="4" width="20" height="16" rx="2"/>' +
                            '<path d="M22 4L12 13L2 4"/>' +
                        '</svg>' +
                        notif.email_pessoa +
                    '</a>' +
                    (notif.lida ? '' :
                    '<button class="notif-btn-marcar-lida" data-id="' + notif.id + '" style="border:1px solid #6C3FC5; background:transparent; color:#6C3FC5; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:12px;">Marcar como lida</button>') +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $container.html(html);
}

$(document).on('click', '.notif-btn-marcar-lida', function () {
    let id = $(this).data('id');
    marcarNotificacaoLida(id).then(function () {
        let $card = $('.notif-card[data-id="' + id + '"]');
        $card.addClass('notif-lida');
        $card.find('.notif-btn-marcar-lida').remove();
    });
});
