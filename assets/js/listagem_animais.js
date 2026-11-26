// Tela do representante: gerenciar os animais da organização

var animalEditando = null;   // animal que está sendo editado (null = cadastrando um novo)
var animaisDaOrg = [];       // todos os animais da organização
var imagemNova = null;       // foto escolhida no formulário (já reduzida)
var sessao = null;

if (protegerRota(['representante'])) {
    sessao = getSessao();
    montarMenu('listagem_animais');
    iniciar();
}

function iniciar() {
    inicializarModal();
    inicializarFiltros();
    inicializarTabela();
    carregarAnimais();
    carregarResumoInteressados();
}

function carregarAnimais() {
    listarAnimais().then(function (todos) {
        animaisDaOrg = todos.filter(function (a) {
            return a.fk_instituicao === sessao.id_empresa;
        });
        atualizarResumo();
        aplicarFiltros();
    });
}

function atualizarResumo() {
    qs('#resumo-total').textContent = animaisDaOrg.length;
    qs('#resumo-atencao').textContent = animaisDaOrg.filter(function (a) {
        return a.saude && a.saude !== 'Saudável, vacinas em dia';
    }).length;
}

function carregarResumoInteressados() {
    listarNotificacoesPorInstituicao(sessao.id_empresa).then(function (lista) {
        qs('#resumo-interessados').textContent = lista.filter(function (n) { return !n.lida; }).length;
    });
}

// ---------- Tabela ----------

function renderizarAnimais(lista) {
    var area = qs('#animais-grid');

    if (animaisDaOrg.length === 0) {
        area.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhum animal cadastrado</h3>' +
                '<p>Cadastre o primeiro animal para ele aparecer para quem quer adotar.</p>' +
                '<button type="button" class="botao botao--dourado" data-novo>' + icone('mais') + 'Novo animal</button>' +
            '</div>';
        return;
    }

    if (lista.length === 0) {
        area.innerHTML = '<div class="vazio"><h3>Nenhum animal encontrado</h3><p>Nenhum animal combina com os filtros. Tente limpar a busca.</p></div>';
        return;
    }

    var linhas = lista.map(function (animal) {
        var saudavel = animal.saude === 'Saudável, vacinas em dia';
        return '<tr>' +
            '<td class="tabela__celula-principal">' +
                '<div class="tabela__principal">' +
                    '<div class="tabela__foto"><img src="' + esc(animal.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
                    '<div>' +
                        '<div class="tabela__nome">' + esc(animal.nome) + '</div>' +
                        '<div class="tabela__sub">' + esc(animal.especie || '') + ' · ' + esc(animal.raca || '') + ' · ' + esc(idadeEmAnos(animal.idade_aprox)) + ' · ' + esc(animal.sexo || '') + '</div>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td data-rotulo="Porte">' + esc(animal.porte || '') + '</td>' +
            '<td data-rotulo="Saúde"><span class="etiqueta ' + (saudavel ? 'etiqueta--castracao' : 'etiqueta--feira') + '">' + esc(animal.saude || '') + '</span></td>' +
            '<td data-rotulo="Custo mensal" class="tabela__numero">R$ ' + esc(animal.valor_custo || '0') + '</td>' +
            '<td><div class="tabela__acoes">' +
                '<button type="button" class="botao botao--texto botao--pequeno" data-editar="' + animal.id + '" aria-label="Editar ' + esc(animal.nome) + '">' + icone('editar') + 'Editar</button>' +
                '<button type="button" class="botao botao--texto-perigo botao--pequeno" data-excluir="' + animal.id + '" aria-label="Excluir ' + esc(animal.nome) + '">' + icone('lixeira') + 'Excluir</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');

    area.innerHTML =
        '<p class="contagem">' + lista.length + (lista.length === 1 ? ' animal' : ' animais') + '</p>' +
        '<div class="tabela-wrap"><table class="tabela">' +
            '<caption class="sr-only">Animais da organização</caption>' +
            '<thead><tr><th scope="col">Animal</th><th scope="col">Porte</th><th scope="col">Saúde</th><th scope="col">Custo mensal</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead>' +
            '<tbody>' + linhas + '</tbody>' +
        '</table></div>';
}

function inicializarTabela() {
    qs('#animais-grid').addEventListener('click', function (e) {
        var editar = e.target.closest('[data-editar]');
        var excluir = e.target.closest('[data-excluir]');

        if (e.target.closest('[data-novo]')) {
            abrirModal();
        } else if (editar) {
            buscarAnimalPorId(Number(editar.dataset.editar)).then(function (animal) {
                if (animal) abrirModal(animal);
            });
        } else if (excluir) {
            var id = Number(excluir.dataset.excluir);
            var animal = animaisDaOrg.find(function (a) { return a.id === id; });
            confirmar({
                titulo: 'Excluir ' + (animal ? animal.nome : 'animal') + '?',
                mensagem: 'O animal deixa de aparecer para quem quer adotar. Essa ação não pode ser desfeita.',
                botao: 'Excluir',
                perigo: true
            }).then(function (ok) {
                if (!ok) return;
                removerAnimal(id).then(function () {
                    toast('Animal excluído.', 'sucesso');
                    carregarAnimais();
                });
            });
        }
    });
}

// ---------- Diálogo de cadastro / edição ----------

function inicializarModal() {
    var dialogo = qs('#modal-animal');
    var form = qs('#form-animal');

    ligarDialogo(dialogo);
    ligarLimpezaDeErros(form);
    dialogo.addEventListener('close', function () {
        animalEditando = null;
        imagemNova = null;
        form.reset();
        limparErros(form);
    });

    qs('#btn-novo-animal').addEventListener('click', function () { abrirModal(); });

    // Atualiza a pré-visualização enquanto a pessoa digita
    form.addEventListener('input', atualizarPreview);
    form.addEventListener('change', atualizarPreview);

    qs('#animal-imagem').addEventListener('change', function (e) {
        var arquivo = e.target.files[0];
        if (!arquivo) {
            imagemNova = null;
            atualizarPreview();
            return;
        }
        lerImagem(arquivo, 700).then(function (url) {
            imagemNova = url;
            atualizarPreview();
        }).catch(function () {
            imagemNova = null;
            e.target.value = '';
            toast('Esse arquivo não parece ser uma imagem. Escolha outro.', 'erro');
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validarFormulario(form)) salvarAnimal();
    });
}

function abrirModal(animal) {
    animalEditando = animal || null;
    imagemNova = null;
    var form = qs('#form-animal');
    form.reset();
    limparErros(form);

    qs('#modal-title').textContent = animal ? 'Editar animal' : 'Adicionar animal';

    if (animal) {
        qs('#animal-nome').value = animal.nome || '';
        qs('#animal-porte').value = animal.porte || '';
        qs('#animal-especie').value = animal.especie || '';
        qs('#animal-raca').value = animal.raca || '';
        qs('#animal-idade').value = animal.idade_aprox || '';
        qs('#animal-custo').value = animal.valor_custo || '';
        qs('#animal-sexo').value = animal.sexo || '';
        qs('#animal-saude').value = animal.saude || '';
        qs('#animal-descricao').value = animal.descricao || '';
    }

    atualizarPreview();
    qs('#modal-animal').showModal();
}

function atualizarPreview() {
    var dados = getValoresInput('#form-animal');
    var fotoAtual = animalEditando ? animalEditando.imagem : IMG_PADRAO;

    qs('#preview-name').textContent = dados.animal_nome || 'Nome do animal';
    qs('#preview-porte').textContent = dados.animal_porte ? 'Porte ' + dados.animal_porte.toLowerCase() : 'Porte';
    qs('#preview-vacina').textContent = dados.animal_saude || 'Saúde';
    qs('#preview-custo').textContent = dados.animal_custo ? 'R$ ' + dados.animal_custo + '/mês' : 'R$ --/mês';
    qs('#preview-img').src = imagemNova || fotoAtual || IMG_PADRAO;

    var linha = [dados.animal_especie, dados.animal_raca, dados.animal_idade ? idadeEmAnos(dados.animal_idade) : '', dados.animal_sexo]
        .filter(Boolean).join(' · ');
    qs('#preview-desc').textContent = (linha ? linha + '. ' : '') + (dados.animal_descricao || (linha ? '' : 'Preencha os campos para ver como o animal aparece para quem quer adotar.'));
}

function salvarAnimal() {
    var dados = getValoresInput('#form-animal');
    var botao = qs('#btn-salvar');

    var objetoAnimal = {
        nome: dados.animal_nome.trim(),
        porte: dados.animal_porte,
        especie: dados.animal_especie,
        raca: dados.animal_raca,
        idade_aprox: dados.animal_idade.trim(),
        valor_custo: dados.animal_custo.trim(),
        sexo: dados.animal_sexo,
        saude: dados.animal_saude,
        descricao: dados.animal_descricao.trim(),
        personalidade: animalEditando ? (animalEditando.personalidade || '') : '',
        ficha_medica: animalEditando ? (animalEditando.ficha_medica || '') : '',
        imagem: imagemNova || (animalEditando ? animalEditando.imagem : IMG_PADRAO),
        fk_instituicao: sessao.id_empresa
    };

    ocupado(botao, true);
    var operacao = animalEditando ? atualizarAnimal(animalEditando.id, objetoAnimal) : criarAnimal(objetoAnimal);

    operacao.then(function () {
        toast(animalEditando ? 'Animal atualizado.' : objetoAnimal.nome + ' foi cadastrado.', 'sucesso');
        qs('#modal-animal').close();
        carregarAnimais();
    }).catch(function () {
        toast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.', 'erro');
    }).then(function () {
        ocupado(botao, false);
    });
}

// ---------- Filtros ----------

function inicializarFiltros() {
    ['#filtro-nome', '#filtro-custo'].forEach(function (id) {
        qs(id).addEventListener('input', aplicarFiltros);
    });
    ['#filtro-porte', '#filtro-sexo'].forEach(function (id) {
        qs(id).addEventListener('change', aplicarFiltros);
    });
}

function aplicarFiltros() {
    var nome = normalizar(qs('#filtro-nome').value);
    var custoMax = parseFloat(qs('#filtro-custo').value.replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    var porte = qs('#filtro-porte').value;
    var sexo = qs('#filtro-sexo').value;

    renderizarAnimais(animaisDaOrg.filter(function (animal) {
        return (!nome || normalizar(animal.nome).indexOf(nome) > -1) &&
               parseFloat(animal.valor_custo || 0) <= custoMax &&
               (!porte || normalizar(animal.porte) === porte) &&
               (!sexo || normalizar(animal.sexo) === sexo);
    }));
}
