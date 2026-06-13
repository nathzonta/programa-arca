var campanhas = [
    {
        id: 1,
        nome: "Patinhas da Serra",
        tipo: "Castração",
        descricao: "A Patinhas da Serra realizará uma campanha de castração para cães e gatos, com vagas limitadas. A ação promove a saúde e o bem-estar animal, além de contribuir para o controle populacional e a redução do abandono. Levar CPF!",
        data: "11/07/2026 às 12h até 16h",
        local: "Shopping Montserrat",
        imagem: "./assets/imgs/campanha-1.jpg"
    },
    {
        id: 2,
        nome: "ONG Amor de Pet",
        tipo: "Feira de Adoção",
        descricao: "A ONG Amor de Pet convida você para uma feira de adoção repleta de animais à procura de um lar cheio de carinho. Venha conhecer cães e gatos resgatados e encontre um novo melhor amigo para a vida toda.",
        data: "08/07/2026 às 07h até 13h",
        local: "Shopping Mestre Álvaro",
        imagem: "./assets/imgs/campanha-2.jpg"
    },
    {
        id: 3,
        nome: "Instituto Vida Animal",
        tipo: "Vacinação",
        descricao: "O Instituto Vida Animal ES promoverá uma ação de vacinação gratuita para cães e gatos. A iniciativa visa reforçar a prevenção de doenças e incentivar os cuidados essenciais com a saúde dos pets da comunidade.",
        data: "28/07/2026 às 08h até 12h",
        local: "Pracinha de Cidade Continental",
        imagem: "./assets/imgs/campanha-3.jpg"
    }
];

var tipoBadgeClass = {
    "Castração": "badge-arca-sucesso",
    "Feira de Adoção": "badge-arca-aviso",
    "Vacinação": "badge-arca-info"
};

var campanhaEditando = null;
var campanhasFiltradas = campanhas.slice();

$(document).ready(function () {
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    renderizarCampanhas(campanhas);
});

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
    $('#campanha-nome').val(campanha.nome || '');
    $('#campanha-tipo').val(campanha.tipo || '');
    $('#campanha-descricao').val(campanha.descricao || '');
    $('#campanha-data').val(campanha.data || '');
    $('#campanha-local').val(campanha.local || '');

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

    $('#preview-nome').text('Nome da organização');
    $('#preview-tipo').text('Tipo de campanha').attr('class', 'badge-arca mb-2 me-1');
    $('#preview-descricao').text('Descrição da campanha...');
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

    var observer = new MutationObserver(atualizarPreview);
    $('.select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function atualizarPreview() {
    var nome = $('#campanha-nome').val() || 'Nome da organização';
    var tipo = $('#campanha-tipo').val() || '';
    var descricao = $('#campanha-descricao').val() || 'Descrição da campanha...';
    var data = $('#campanha-data').val() || 'Data do evento';
    var local = $('#campanha-local').val() || 'Local do evento';

    $('#preview-nome').text(nome);

    var $badge = $('#preview-tipo');
    if (tipo) {
        $badge.text(tipo).attr('class', 'badge-arca ' + (tipoBadgeClass[tipo] || '') + ' mb-2 me-1');
    } else {
        $badge.text('Tipo de campanha').attr('class', 'badge-arca mb-2 me-1');
    }

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
        { id: 'campanha-tipo', label: 'Tipo' },
        { id: 'campanha-descricao', label: 'Descrição' },
        { id: 'campanha-data', label: 'Data' },
        { id: 'campanha-local', label: 'Local' }
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

    if (!valido) {
        $('#modal-alert').addClass('visible');
    }

    return valido;
}

function limparErros() {
    $('.form-group-arca.error').removeClass('error');
    $('#modal-alert').removeClass('visible');
}

function salvarCampanha() {
    var fileInput = document.getElementById('campanha-imagem');
    var imagemSrc = (fileInput && fileInput.files && fileInput.files[0])
        ? URL.createObjectURL(fileInput.files[0])
        : (campanhaEditando ? campanhaEditando.imagem : '');

    var novaCampanha = {
        id: campanhaEditando ? campanhaEditando.id : Date.now(),
        nome: $('#campanha-nome').val(),
        tipo: $('#campanha-tipo').val(),
        descricao: $('#campanha-descricao').val(),
        data: $('#campanha-data').val(),
        local: $('#campanha-local').val(),
        imagem: imagemSrc
    };

    if (campanhaEditando) {
        var index = campanhas.findIndex(function (c) { return c.id === campanhaEditando.id; });
        if (index !== -1) {
            campanhas[index] = $.extend({}, campanhas[index], novaCampanha);
        }
    } else {
        campanhas.push(novaCampanha);
    }

    campanhasFiltradas = campanhas.slice();
    renderizarCampanhas(campanhasFiltradas);
    fecharModal();
}

function renderizarCampanhas(lista) {
    var $grid = $('#campanhas-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; width: 100%;">Nenhuma campanha encontrada.</p>');
        return;
    }

    var html = lista.map(function (campanha) {
        var badgeClasse = tipoBadgeClass[campanha.tipo] || '';
        return '' +
        '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-campanha p-1" data-id="' + campanha.id + '">' +
            '<div class="card-body d-flex flex-column justify-content-between gap-4">' +
                '<img class="col-12" style="border-radius: 15px; height: 220px; object-fit: cover;" src="' + campanha.imagem + '" alt="' + campanha.nome + '">' +
                '<div class="card-campanha-text mx-4">' +
                    '<h4 class="d-flex justify-content-between">' + campanha.nome +
                        '<span class="card-campanha-edit" onclick="abrirModal(campanhas.find(function(c){return c.id===' + campanha.id + '}))">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<span class="badge-arca ' + badgeClasse + ' mb-2 me-1">' + campanha.tipo + '</span>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' + campanha.descricao + '</p>' +
                '</div>' +
                '<div class="card-campanha-infos mx-4">' +
                    '<p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">' + campanha.data + '</p>' +
                    '<p class="corpo corpo-micro mb-0"><img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">' + campanha.local + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    $grid.html(html);
}

function inicializarFiltros() {
    $('#filtro-nome').on('input', aplicarFiltros);
    $('#filtro-local').on('input', aplicarFiltros);

    var observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    var nome = ($('#filtro-nome').val() || '').toLowerCase();
    var tipo = $('#filtro-tipo').val() || '';
    var local = ($('#filtro-local').val() || '').toLowerCase();

    campanhasFiltradas = campanhas.filter(function (campanha) {
        var matchNome = campanha.nome.toLowerCase().includes(nome);
        var matchTipo = !tipo || campanha.tipo === tipo;
        var matchLocal = campanha.local.toLowerCase().includes(local);
        return matchNome && matchTipo && matchLocal;
    });

    renderizarCampanhas(campanhasFiltradas);
}
