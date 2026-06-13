let animalEditando = null;
let animaisFiltrados = [];
let sessao = null;

$(document).ready(function () {
    if (!protegerRota(['representante'])) {
        return;
    }
    sessao = getSessao();

    carregarDadosSidebar();
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
    $('#btn-novo-animal').on('click', function () { 
        abrirModal(); 
    });

    $('#modal-close').on('click', fecharModal);
    $('#btn-cancelar').on('click', fecharModal);

    $('#modal-animal').on('click', function (e) {
        if (e.target === this) {
            fecharModal();
        }
    });

    $('#form-animal').on('submit', function (e) {
        e.preventDefault();
        if (validarFormulario('#form-animal')) {
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
    $('#animal-saude').val(animal.saude || '');
    $('#animal-descricao').val(animal.descricao || '');
    $('#preview-img').attr('src', animal.imagem || '');

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
    const dados = getValoresInput('#form-animal');

    $('#preview-name').text(dados['animal_nome']);
    $('#preview-porte').text(dados['animal_porte'] !== 'Porte' ? 'Porte ' + dados['animal_porte'].toLowerCase() : 'Porte --');
    $('#preview-custo').text(dados['animal_custo'] !== '--' ? 'Custo mensal medio de R$ ' + dados['animal_custo'] : 'Custo mensal medio de R$ --');
    $('#preview-vacina').text(dados['animal_saude'] || 'Saúde');

    const textoInfo = (dados['animal_especie'] || 'Espécie') + ': ' + (dados['animal_raca'] || 'Raça') + ' | ' + (dados['animal_idade'] || 'Idade') + ' anos | ' + (dados['animal_sexo'] || 'Sexo');
    $('#preview-desc').html(textoInfo + '<br><br>' + (dados['animal_descricao'] || 'Preencha os campos ao lado'));

    let fileInput = document.getElementById('animal-imagem');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#preview-img').attr('src', e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function salvarAnimal() {
    let dados = getValoresInput('#form-animal');

    let objetoAnimal = {
        nome: dados['animal_nome'],
        porte: dados['animal_porte'],
        especie: dados['animal_especie'],
        raca: dados['animal_raca'],
        idade_aprox: dados['animal_idade'],
        valor_custo: dados['animal_custo'],
        sexo: dados['animal_sexo'],
        saude: dados['animal_saude'],
        descricao: dados['animal_descricao'],
        personalidade: '',
        ficha_medica: '',
        imagem: dados['animal_imagem'] || './assets/imgs/placeholder.png',
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
    let $grid = $('#animais-grid');
    if (!$grid.length) return;

    if (lista.length === 0) {
        $grid.html('<p style="text-align: center; color: #737373; grid-column: 1 / -1;">Nenhum animal encontrado.</p>');
        return;
    }

    let html = '';
    $.each(lista, function (i, animal) {
        html +=
        '<div class="col-12 col-md-4 card card-animal p-1" data-id="' + animal.id + '">' +
            '<div class="card-body">' +
                '<img class="card-animal-img" src="' + (animal.imagem || './assets/imgs/placeholder.png') + '" alt="' + animal.nome + '">' +
                '<div class="card-animal-text mt-4">' +
                    '<h4 class="d-flex justify-content-between">' + animal.nome +
                        '<span class="card-animal-edit btn-editar-animal" data-id="' + animal.id + '">' +
                            '<img src="./assets/imgs/icons/editar.svg">' +
                        '</span>' +
                    '</h4>' +
                    '<div class="card-animal-badges">' +
                        '<span class="badge-arca badge-arca-sucesso">Porte ' + (animal.porte || '').toLowerCase() + '</span>' +
                        '<span class="badge-arca badge-arca-info">' + (animal.saude || '') + '</span>' +
                        '<span class="badge-arca badge-arca-rosa">R$ ' + (animal.valor_custo || '0') + '/mês</span>' +
                    '</div>' +
                    '<div class="card-animal-info d-grid g-2 mt-2">' +
                        '<p class="corpo corpo-sm text-muted mt-2" style="font-size: clamp(0.9rem, 0.9vw, 0.9rem)">' +
                        (animal.especie || '') + ': ' + (animal.raca || '') + ' | ' + (animal.idade_aprox || '') + ' anos | ' + (animal.sexo) +
                        '</p>' +
                        '<p class="corpo corpo-sm text-muted mt-2" style="font-size: clamp(0.9rem, 0.9vw, 0.9rem)">' +
                        (animal.descricao || '') +
                        '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="card-animal-footer mt-auto">' +
                    '<button class="btn-excluir-animal" data-id="' + animal.id + '" style="border:none; background:none; color:#e74c3c; cursor:pointer; font-size:13px;">Excluir</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    });

    $grid.html(html);
}

$(document).on('click', '.btn-editar-animal', function () {
    let id = $(this).data('id');
    buscarAnimalPorId(id).then(function (animal) {
        if (animal) abrirModal(animal);
    });
});

$(document).on('click', '.btn-excluir-animal', function () {
    let id = $(this).data('id');
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        removerAnimal(id).then(function () {
            carregarAnimais();
        });
    }
});

function inicializarFiltros() {
    $('#filtro-nome').on('input', aplicarFiltros);
    $('#filtro-custo').on('input', aplicarFiltros);

    let observer = new MutationObserver(aplicarFiltros);
    $('.sidebar-filtros .select-arca').each(function () {
        observer.observe(this, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    let nome = ($('#filtro-nome').val() || '').toLowerCase();
    let custoMax = parseFloat(($('#filtro-custo').val() || '').replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    let porte = $('#filtro-porte').val() || '';

    listarAnimais().then(function (todosAnimais) {
        let daInstituicao = todosAnimais.filter(function (a) {
            return a.fk_instituicao === sessao.id_empresa;
        });

        animaisFiltrados = daInstituicao.filter(function (animal) {
            let matchNome = (animal.nome || '').toLowerCase().indexOf(nome) > -1;
            let matchCusto = parseFloat(animal.valor_custo || 0) <= custoMax;
            let matchPorte = !porte || (animal.porte || '').toLowerCase() === porte;
            return matchNome && matchCusto && matchPorte;
        });

        renderizarAnimais(animaisFiltrados);
    });
}
