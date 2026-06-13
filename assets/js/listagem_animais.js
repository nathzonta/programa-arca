var animalEditando = null;
var animaisFiltrados = [];
var sessao = null;

$(document).ready(function () {
    if (!protegerRota(['representante'])) return;
    carregarDadosSidebar();
    sessao = getSessao();
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    carregarAnimais();
});

function carregarAnimais() {
    listarAnimais().then(function (todosAnimais) {
        animaisFiltrados = todosAnimais.filter(function (a) {
            return a.fk_instituicao === sessao.id_empresa;
        });
        renderizarAnimais(animaisFiltrados);
    });
}

function inicializarModal() {
    $('#btn-novo-animal').on('click', function () { abrirModal(); });
    $('#modal-close').on('click', function () { fecharModal(); });
    $('#btn-cancelar').on('click', function () { fecharModal(); });

    $('#modal-animal').on('click', function (e) {
        if (e.target === this) fecharModal();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $('#modal-animal').hasClass('open')) {
            fecharModal();
        }
    });

    $('#form-animal').on('submit', function (e) {
        e.preventDefault();
        if (validarFormulario()) {
            salvarAnimal();
        }
    });
}

function abrirModal(animal) {
    animalEditando = animal || null;
    $('#modal-title').text(animal ? 'Editar animal' : 'Adicionar animal');
    $('#modal-alert').removeClass('visible');

    if (animal) {
        preencherFormulario(animal);
    } else {
        limparFormulario();
    }

    $('#modal-animal').addClass('open');
    atualizarPreview();
}

function fecharModal() {
    $('#modal-animal').removeClass('open');
    animalEditando = null;
    limparFormulario();
    limparErros();
}

function preencherFormulario(animal) {
    $('#animal-nome').val(animal.nome || '');
    $('#animal-porte').val(animal.porte || '');
    $('#animal-especie').val(animal.especie || '');
    $('#animal-raca').val(animal.raca || '');
    $('#animal-idade').val(animal.idade_aprox || '');
    $('#animal-custo').val(animal.valor_custo || '');
    $('#animal-sexo').val(animal.sexo || '');
    $('#animal-descricao').val(animal.descricao || '');

    setTimeout(function () {
        if (typeof iniciarSelects === 'function') {
            iniciarSelects();
        }
        atualizarPreview();
    }, 100);
}

function limparFormulario() {
    $('#form-animal')[0].reset();
    $('#animal-imagem').val('');

    $('#preview-name').text('Nome do pet');
    $('#preview-porte').text('Porte');
    $('#preview-vacina').text('Saude');
    $('#preview-custo').text('Custo mensal medio de R$ --');
    $('#preview-desc').html('Especie: Raca | Idade | Sexo<br><br>Preencha os campos para ver a pre-visualizacao do animal.');
    $('#preview-img').attr('src', '');

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
    var nome = $('#animal-nome').val() || 'Nome do pet';
    var porte = $('#animal-porte').val() || 'Porte';
    var especie = $('#animal-especie').val() || 'Especie';
    var raca = $('#animal-raca').val() || 'Raca';
    var idade = $('#animal-idade').val() || 'Idade';
    var custo = $('#animal-custo').val() || '--';
    var descricao = $('#animal-descricao').val() || 'Preencha os campos para ver a pre-visualizacao do animal.';
    var saude = $('#animal-saude').val() || '';

    $('#preview-name').text(nome);
    $('#preview-porte').text(porte !== 'Porte' ? 'Porte ' + porte.toLowerCase() : 'Porte');
    $('#preview-custo').text(custo !== '--' ? 'Custo mensal medio de R$ ' + custo : 'Custo mensal medio de R$ --');
    $('#preview-vacina').text(saude || 'Saude');

    var infoText = especie + ': ' + raca + ' | ' + idade;
    $('#preview-desc').html(infoText + '<br><br>' + descricao);

    var fileInput = document.getElementById('animal-imagem');
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
        { id: 'animal-nome', label: 'Nome' },
        { id: 'animal-porte', label: 'Porte' },
        { id: 'animal-especie', label: 'Especie' }
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

function salvarAnimal() {
    var dados = getValoresInput('#form-animal');

    var objetoAnimal = {
        nome: dados['animal-nome'] || $('#animal-nome').val(),
        porte: dados['animal-porte'] || $('#animal-porte').val(),
        especie: dados['animal-especie'] || $('#animal-especie').val(),
        raca: dados['animal-raca'] || $('#animal-raca').val(),
        idade_aprox: dados['animal-idade'] || $('#animal-idade').val(),
        valor_custo: dados['animal-custo'] || $('#animal-custo').val(),
        sexo: dados['animal-sexo'] || $('#animal-sexo').val(),
        descricao: dados['animal-descricao'] || $('#animal-descricao').val(),
        personalidade: '',
        ficha_medica: '',
        imagem: './assets/imgs/placeholder.png',
        fk_instituicao: sessao.id_empresa
    };

    if (animalEditando) {
        atualizarAnimal(animalEditando.id, objetoAnimal).then(function () {
            carregarAnimais();
            fecharModal();
        });
    } else {
        criarAnimal(objetoAnimal).then(function () {
            carregarAnimais();
            fecharModal();
        });
    }
}

function renderizarAnimais(lista) {
    var $grid = $('#animais-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; grid-column: 1 / -1;">Nenhum animal encontrado.</p>');
        return;
    }

    var html = '';
    $.each(lista, function (i, animal) {
        html +=
        '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-animal p-3" data-id="' + animal.id + '">' +
            '<div class="card-body d-flex flex-column gap-3">' +
                '<div style="position: relative;">' +
                    '<img class="card-animal-img col-12" src="' + (animal.imagem || './assets/imgs/placeholder.png') + '" alt="' + animal.nome + '">' +
                '</div>' +
                '<div class="card-animal-text">' +
                    '<h4 class="d-flex justify-content-between">' + animal.nome +
                        '<span class="card-animal-edit btn-editar-animal" data-id="' + animal.id + '">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<div class="card-animal-badges">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + (animal.porte || '').toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">R$ ' + (animal.valor_custo || '0') + '/mes</span>' +
                    '</div>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' +
                    (animal.especie || '') + ': ' + (animal.raca || '') + ' | ' + (animal.idade_aprox || '') + ' anos<br><br>' +
                    (animal.descricao || '') +
                    '</p>' +
                '</div>' +
                '<div class="card-animal-footer">' +
                    '<button class="btn-excluir-animal" data-id="' + animal.id + '" style="border:none; background:none; color:#e74c3c; cursor:pointer; font-size:13px;">Excluir</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

$(document).on('click', '.btn-editar-animal', function () {
    var id = $(this).data('id');
    buscarAnimalPorId(id).then(function (animal) {
        if (animal) abrirModal(animal);
    });
});

$(document).on('click', '.btn-excluir-animal', function () {
    var id = $(this).data('id');
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        removerAnimal(id).then(function () {
            carregarAnimais();
        });
    }
});

function inicializarFiltros() {
    $('#filtro-nome').on('input', aplicarFiltros);
    $('#filtro-custo').on('input', aplicarFiltros);

    var observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    var nome = ($('#filtro-nome').val() || '').toLowerCase();
    var custoMax = parseFloat(($('#filtro-custo').val() || '').replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    var porte = $('#filtro-porte').val() || '';

    listarAnimais().then(function (todosAnimais) {
        var daInstituicao = todosAnimais.filter(function (a) {
            return a.fk_instituicao === sessao.id_empresa;
        });

        animaisFiltrados = daInstituicao.filter(function (animal) {
            var matchNome = (animal.nome || '').toLowerCase().indexOf(nome) > -1;
            var matchCusto = parseFloat(animal.valor_custo || 0) <= custoMax;
            var matchPorte = !porte || (animal.porte || '').toLowerCase() === porte;
            return matchNome && matchCusto && matchPorte;
        });

        renderizarAnimais(animaisFiltrados);
    });
}
