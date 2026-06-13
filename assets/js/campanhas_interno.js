let campanhaEditando = null;
let campanhasFiltradas = [];
let sessao = null;

// Quando o DOM iniciar, inicializamos tudo e verificamos se a pessoa pode ver a tela sempre
$(document).ready(function () {
    if (!protegerRota(['representante'])) {
        return;
    }
    sessao = getSessao();

    carregarDadosSidebar();
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
    $('#btn-nova-campanha').on('click', function() { 
        abrirModal(); // Tem que chamar assim se não a bomba da arrow function manda this
    });
    
    $('#modal-close').on('click', fecharModal); // Xzinho em cima
    $('#btn-cancelar').on('click', fecharModal); // Pelo botão mesmo

    // Fecha clicando fora do modal, na parte escura atrás
    $('#modal-campanha').on('click', function (e) {
        if (e.target === this) {
            fecharModal();
        }
    });

    $('#form-campanha').on('submit', function (e) {
        e.preventDefault();

        if (validarFormulario('#form-campanha')) {
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
    $('#campanha-tipo').val(campanha.tipo || '');
    $('#campanha-descricao').val(campanha.descricao || '');
    $('#campanha-data').val(campanha.data || '');
    $('#campanha-local').val(campanha.local || '');
    $('#preview-img').attr('src', campanha.imagem || './assets/imgs/placeholder.png');

    setTimeout(function () {
        if (typeof iniciarSelects === 'function') {
            iniciarSelects();
        }
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
        if (typeof iniciarSelects === 'function') {
            iniciarSelects();
        }
    }, 100);
}

function inicializarPreview() {
    $('[data-preview]').on('input change', atualizarPreview);
    
    let observer = new MutationObserver(atualizarPreview);
    $('.select-arca').each(function () {
        observer.observe(this, { 
            childList: true, 
            subtree: true, 
            attributes: true 
        });
    });
}

function atualizarPreview() {
    const dados = getValoresInput('#form-campanha');

    const tipos = {
        "Castração": "sucesso",
        "Feira de Adoção": "aviso",
        "Vacinação": "info"
    }

    $('#preview-nome').text(dados['campanha_nome'] || 'Nome da organizacao');
    $('#preview-descricao').text(dados['campanha_descricao'] || 'Descrição da campanha...');
    $('#preview-tipo').text(dados['campanha_tipo'] || 'Tipo de campanha').attr('class', `badge-arca badge-arca-${tipos[dados['campanha_tipo']]} mb-2 me-1`)
    $('#preview-data').html('<img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + (dados['campanha_data'] || 'Data do evento') );
    $('#preview-local').html('<img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">' + (dados['campanha_local'] || 'Local do evento'));

    let fileInput = document.getElementById('campanha-imagem');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#preview-img').attr('src', e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function salvarCampanha() {
    const dados = getValoresInput('#form-campanha');

    let objetoCampanha = {
        titulo: dados['campanha_nome'],
        descricao: dados['campanha_descricao'],
        imagem: './assets/imgs/placeholder.png',
        tipo: dados['campanha_tipo'],
        data: dados['campanha_data'],
        local: dados['campanha_local'],
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
    let $grid = $('#campanhas-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; width: 100%;">Nenhuma campanha encontrada.</p>');
        return;
    }

    const tipos = {
        "Castração": "sucesso",
        "Feira de Adoção": "aviso",
        "Vacinação": "info"
    }

    let html = '';
    $.each(lista, function (i, campanha) {
        html +=
        '<div class="col-12 col-md card card-campanha p-1" data-id="' + campanha.id + '">' +
            '<div class="card-body d-flex flex-column justify-content-between gap-4">' +
                '<img class="col-12" style="border-radius: 15px;" src="' + (campanha.imagem || './assets/imgs/placeholder.png') + '" alt="' + (campanha.titulo || '') + '">' +
                '<div class="card-campanha-text mx-4">' +
                    '<h4 class="d-flex justify-content-between">' + (campanha.titulo || '') +
                        '<span class="card-campanha-edit btn-editar-campanha" data-id="' + campanha.id + '">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<span class="badge-arca badge-arca-' + (tipos[campanha.tipo]) + ' mb-2 me-1">' + (campanha.tipo) + '</span>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' + (campanha.descricao || '') + '</p>' +
                '</div>' +
                '<div class="card-campanha-infos mx-4">' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.data || '') + '</p>' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">' + (campanha.local || '') + '</p>' +
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
    let id = $(this).data('id');
    buscarCampanhaPorId(id).then(function (campanha) {
        if (campanha) abrirModal(campanha);
    });
});

$(document).on('click', '.btn-excluir-campanha', function () {
    let id = $(this).data('id');
    if (confirm('Tem certeza que deseja excluir esta campanha?')) {
        removerCampanha(id).then(function () {
            carregarCampanhas();
        });
    }
});

function inicializarFiltros() {
    $('#filtro-nome').on('input', aplicarFiltros);

    let observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    let nome = ($('#filtro-nome').val() || '').toLowerCase();

    listarCampanhas().then(function (todasCampanhas) {
        campanhasFiltradas = todasCampanhas.filter(function (c) {
            return c.fk_instituicao === sessao.id_empresa &&
                (!nome || (c.titulo || '').toLowerCase().indexOf(nome) > -1);
        });
        renderizarCampanhas(campanhasFiltradas);
    });
}
