var animais = [
    {
        id: 1,
        nome: "Luna",
        imagem: "./assets/imgs/luna.png",
        porte: "Pequeno",
        vacina: "Vacinação completa",
        custo: 115,
        especie: "Gato",
        raca: "Indefinida",
        idade: "1 ano",
        sexo: "Fêmea",
        descricao: "Luna é uma gatinha tranquila e observadora que adora encontrar um cantinho confortável para descansar perto das pessoas."
    },
    {
        id: 2,
        nome: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        porte: "Médio",
        vacina: "Vacinação incompleta",
        custo: 180,
        especie: "Cachorro",
        raca: "Labrador",
        idade: "4 anos",
        sexo: "Macho",
        descricao: "Tobias é um cãozinho alegre e companheiro, sempre pronto para um passeio ou alguns minutos de brincadeira."
    }
];

var animalEditando = null;
var animaisFiltrados = animais.slice();

$(document).ready(function () {
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    renderizarAnimais(animais);
});

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
    $('#animal-idade').val(animal.idade || '');
    $('#animal-custo').val(animal.custo ? 'R$ ' + animal.custo.toFixed(2) : '');
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
    $('#preview-vacina').text('Vacinação');
    $('#preview-custo').text('Custo mensal médio de R$ --');
    $('#preview-desc').html('Espécie: Raça | Idade | Sexo<br><br>Preencha os campos para ver a pré-visualização do animal.');
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
    var especie = $('#animal-especie').val() || 'Espécie';
    var raca = $('#animal-raca').val() || 'Raça';
    var idade = $('#animal-idade').val() || 'Idade';
    var sexo = $('#animal-sexo').val() || 'Sexo';
    var custo = $('#animal-custo').val() || '--';
    var descricao = $('#animal-descricao').val() || 'Preencha os campos para ver a pré-visualização do animal.';
    var saude = $('#animal-saude').val() || '';

    $('#preview-name').text(nome);
    $('#preview-porte').text(porte !== 'Porte' ? 'Porte ' + porte.toLowerCase() : 'Porte');
    $('#preview-custo').text(custo !== '--' ? 'Custo mensal médio de ' + custo : 'Custo mensal médio de R$ --');
    $('#preview-vacina').text(saude || 'Vacinação');

    var infoText = especie + ': ' + raca + ' | ' + idade + ' | ' + sexo;
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
        { id: 'animal-especie', label: 'Espécie' },
        { id: 'animal-raca', label: 'Raça' },
        { id: 'animal-idade', label: 'Idade' },
        { id: 'animal-custo', label: 'Custo' },
        { id: 'animal-sexo', label: 'Sexo' },
        { id: 'animal-descricao', label: 'Descrição' }
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
    var novoAnimal = {
        id: animalEditando ? animalEditando.id : Date.now(),
        nome: $('#animal-nome').val(),
        porte: $('#animal-porte').val(),
        especie: $('#animal-especie').val(),
        raca: $('#animal-raca').val(),
        idade: $('#animal-idade').val(),
        custo: parseFloat($('#animal-custo').val().replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
        sexo: $('#animal-sexo').val(),
        descricao: $('#animal-descricao').val(),
        vacina: 'Vacinação completa',
        imagem: './assets/imgs/gato-lg.png'
    };

    if (animalEditando) {
        var index = animais.findIndex(function (a) { return a.id === animalEditando.id; });
        if (index !== -1) {
            animais[index] = $.extend({}, animais[index], novoAnimal);
        }
    } else {
        animais.push(novoAnimal);
    }

    animaisFiltrados = animais.slice();
    renderizarAnimais(animaisFiltrados);
    fecharModal();
}

function renderizarAnimais(lista) {
    var $grid = $('#animais-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; grid-column: 1 / -1;">Nenhum animal encontrado.</p>');
        return;
    }

    var html = lista.map(function (animal) {
        return '' +
        '<div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-animal p-3" data-id="' + animal.id + '">' +
            '<div class="card-body d-flex flex-column gap-3">' +
                '<div style="position: relative;">' +
                    '<img class="card-animal-img col-12" src="' + animal.imagem + '" alt="' + animal.nome + '">' +
                '</div>' +
                '<div class="card-animal-text">' +
                    '<h4 class="d-flex justify-content-between">' + animal.nome +
                        '<span class="card-animal-edit" onclick="abrirModal(animais.find(function(a){return a.id===' + animal.id + '}))">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<div class="card-animal-badges">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + animal.porte.toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-info">' + animal.vacina + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">Custo mensal médio de R$ ' + animal.custo + '</span>' +
                    '</div>' +
                    '<p class="corpo corpo-sm text-muted mt-2">' +
                    animal.especie + ': ' + animal.raca + ' | ' + animal.idade + ' | ' + animal.sexo + '<br><br>' +
                    animal.descricao +
                    '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    $grid.html(html);
}

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
    var sexo = $('#filtro-sexo').val() || '';

    animaisFiltrados = animais.filter(function (animal) {
        var matchNome = animal.nome.toLowerCase().includes(nome);
        var matchCusto = animal.custo <= custoMax;
        var matchPorte = !porte || animal.porte.toLowerCase() === porte;
        var matchSexo = !sexo || animal.sexo.toLowerCase() === sexo;
        return matchNome && matchCusto && matchPorte && matchSexo;
    });

    renderizarAnimais(animaisFiltrados);
}
