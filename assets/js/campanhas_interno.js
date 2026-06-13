var campanhaEditando = null;
var campanhasFiltradas = [];
var sessao = null;

$(document).ready(function () {
    if (!protegerRota(['representante'])) return;
    carregarDadosSidebar();
    sessao = getSessao();
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    carregarCampanhas();
});

function carregarCampanhas() {
    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas.filter(function (c) {
            return c.fk_instituicao === sessao.id_empresa;
        });
        renderizarCampanhas(campanhasFiltradas);
    });
}

function inicializarModal() {
    $('#btn-nova-campanha').on('click', function () { abrirModal(); });
    $('#modal-close').on('click', function () { fecharModal(); });
    $('#btn-cancelar').on('click', function () { fecharModal(); });

    $('#modal-campanha').on('click', function (e) {
        if (e.target === this) fecharModal();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#modal-campanha').hasClass('open')) {
            fecharModal();
        }
    });

    $('#form-campanha').on('submit', function (e) {
        e.preventDefault();
        if (validarFormulario()) {
            salvarCampanha();
        }
    });
}

function abrirModal(campanha) {
    campanhaEditando = campanha || null;
    $('#modal-title').text(campanha ? 'Editar campanha' : 'Nova campanha');
    $('#modal-alert').removeClass('visible');

    if (campanha) {
        preencherFormulario(campanha);
    } else {
        limparFormulario();
    }

    $('#modal-campanha').addClass('open');
    atualizarPreview();
}

function fecharModal() {
    $('#modal-campanha').removeClass('open');
    campanhaEditando = null;
    limparFormulario();
    limparErros();
}

function preencherFormulario(campanha) {
    $('#campanha-nome').val(campanha.titulo || '');
    $('#campanha-tipo').val(campanha.titulo || '');
    $('#campanha-descricao').val(campanha.descricao || '');
    $('#campanha-data').val(campanha.data_inicio || '');
    $('#campanha-local').val(campanha.data_fim || '');

    setTimeout(function () {
        if (typeof iniciarSelects === 'function') iniciarSelects();
        atualizarPreview();
    }, 100);
}

function limparFormulario() {
    $('#form-campanha')[0].reset();
    $('#campanha-imagem').val('');
    $('#preview-nome').text('Nome da organizacao');
    $('#preview-tipo').text('Tipo de campanha').attr('class', 'badge-arca mb-2 me-1');
    $('#preview-descricao').text('Descricao da campanha...');
    $('#preview-data').html('<img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">Data do evento');
    $('#preview-local').html('<img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">Local do evento');
    $('#preview-img').attr('src', './assets/imgs/placeholder.png');

    setTimeout(function () {
        if (typeof iniciarSelects === 'function') iniciarSelects();
    }, 100);
}

function inicializarPreview() {
    $('[data-preview]').on('input change', atualizarPreview);
    var observer = new MutationObserver(atualizarPreview);
    $('.select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function atualizarPreview() {
    var nome = $('#campanha-nome').val() || 'Nome da organizacao';
    var tipo = $('#campanha-tipo').val() || '';
    var descricao = $('#campanha-descricao').val() || 'Descricao da campanha...';
    var data = $('#campanha-data').val() || 'Data do evento';
    var local = $('#campanha-local').val() || 'Local do evento';

    $('#preview-nome').text(nome);
    $('#preview-descricao').text(descricao);
    $('#preview-data').html('<img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + data);
    $('#preview-local').html('<img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">' + local);

    var fileInput = document.getElementById('campanha-imagem');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview-img').attr('src', e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function validarFormulario() {
    var campos = [
        { id: 'campanha-nome', label: 'Nome' },
        { id: 'campanha-descricao', label: 'Descricao' }
    ];

    var valido = true;
    limparErros();

    campos.forEach(function (campo) {
        var $input = $('#' + campo.id);
        var $formGroup = $input.closest('.form-group-arca');
        if (!$input.val() || !$input.val().trim()) {
            $formGroup.addClass('error');
            valido = false;
        }
    });

    if (!valido) $('#modal-alert').addClass('visible');
    return valido;
}

function limparErros() {
    $('.form-group-arca.error').removeClass('error');
    $('#modal-alert').removeClass('visible');
}

function salvarCampanha() {
    var dados = getValoresInput('#form-campanha');

    var objetoCampanha = {
        titulo: dados['campanha-nome'] || $('#campanha-nome').val(),
        descricao: dados['campanha-descricao'] || $('#campanha-descricao').val(),
        meta: dados['campanha-meta'] || '0',
        arrecadado: '0',
        imagem: './assets/imgs/placeholder.png',
        data_inicio: dados['campanha-data'] || $('#campanha-data').val(),
        data_fim: dados['campanha-local'] || $('#campanha-local').val(),
        fk_instituicao: sessao.id_empresa
    };

    if (campanhaEditando) {
        atualizarCampanha(campanhaEditando.id, objetoCampanha).then(function () {
            carregarCampanhas();
            fecharModal();
        });
    } else {
        criarCampanha(objetoCampanha).then(function () {
            carregarCampanhas();
            fecharModal();
        });
    }
}

function renderizarCampanhas(lista) {
    var $grid = $('#campanhas-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; width: 100%;">Nenhuma campanha encontrada.</p>');
        return;
    }

    var html = '';
    $.each(lista, function (i, campanha) {
        html +=
        '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-campanha p-1" data-id="' + campanha.id + '">' +
            '<div class="card-body d-flex flex-column justify-content-between gap-4">' +
                '<img class="col-12" style="border-radius: 15px; height: 220px; object-fit: cover;" src="' + (campanha.imagem || './assets/imgs/placeholder.png') + '" alt="' + (campanha.titulo || '') + '">' +
                '<div class="card-campanha-text mx-4">' +
                    '<h4 class="d-flex justify-content-between">' + (campanha.titulo || '') +
                        '<span class="card-campanha-edit btn-editar-campanha" data-id="' + campanha.id + '">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' + (campanha.descricao || '') + '</p>' +
                '</div>' +
                '<div class="card-campanha-infos mx-4">' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.data_inicio || '') + ' a ' + (campanha.data_fim || '') + '</p>' +
                '</div>' +
                '<div class="mx-4 mb-2">' +
                    '<button class="btn-excluir-campanha" data-id="' + campanha.id + '" style="border:none; background:none; color:#e74c3c; cursor:pointer; font-size:12px;">Excluir</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

$(document).on('click', '.btn-editar-campanha', function () {
    var id = $(this).data('id');
    buscarCampanhaPorId(id).then(function (campanha) {
        if (campanha) abrirModal(campanha);
    });
});

$(document).on('click', '.btn-excluir-campanha', function () {
    var id = $(this).data('id');
    if (confirm('Tem certeza que deseja excluir esta campanha?')) {
        removerCampanha(id).then(function () {
            carregarCampanhas();
        });
    }
});

function inicializarFiltros() {
    $('#filtro-nome').on('input', aplicarFiltros);

    var observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    var nome = ($('#filtro-nome').val() || '').toLowerCase();

    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas.filter(function (c) {
            return c.fk_instituicao === sessao.id_empresa &&
                (!nome || (c.titulo || '').toLowerCase().indexOf(nome) > -1);
        });
        renderizarCampanhas(campanhasFiltradas);
    });
}
