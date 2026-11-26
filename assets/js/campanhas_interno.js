// Tela do representante: gerenciar as campanhas da organização

var campanhaEditando = null;
var campanhasDaOrg = [];
var imagemNova = null;
var sessao = null;

if (protegerRota(['representante'])) {
    sessao = getSessao();
    montarMenu('campanhas_interno');
    iniciar();
}

function iniciar() {
    inicializarModal();
    inicializarFiltros();
    inicializarTabela();
    carregarCampanhas();
}

function carregarCampanhas() {
    listarCampanhas().then(function (todas) {
        campanhasDaOrg = todas.filter(function (c) {
            return c.fk_instituicao === sessao.id_empresa;
        });
        aplicarFiltros();
    });
}

// ---------- Data: o banco guarda "11/07/2026 às 12h até 16h" ----------

function montarTextoData(dia, inicio, fim) {
    function hora(h) {
        var p = h.split(':');
        return Number(p[0]) + 'h' + (p[1] !== '00' ? p[1] : '');
    }
    var d = dia.split('-');
    return d[2] + '/' + d[1] + '/' + d[0] + ' às ' + hora(inicio) + ' até ' + hora(fim);
}

// Faz o caminho contrário, para preencher os campos ao editar
function lerTextoData(texto) {
    var m = /(\d{2})\/(\d{2})\/(\d{4})\D+(\d{1,2})h(\d{2})?\D+(\d{1,2})h(\d{2})?/.exec(texto || '');
    if (!m) return null;
    function dois(n) { return ('0' + n).slice(-2); }
    return {
        dia: m[3] + '-' + m[2] + '-' + m[1],
        inicio: dois(m[4]) + ':' + (m[5] || '00'),
        fim: dois(m[6]) + ':' + (m[7] || '00')
    };
}

// ---------- Tabela ----------

function renderizarCampanhas(lista) {
    var area = qs('#campanhas-grid');

    if (campanhasDaOrg.length === 0) {
        area.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhuma campanha cadastrada</h3>' +
                '<p>Crie a primeira campanha para divulgar sua ação para a cidade.</p>' +
                '<button type="button" class="botao botao--dourado" data-novo>' + icone('mais') + 'Nova campanha</button>' +
            '</div>';
        return;
    }

    if (lista.length === 0) {
        area.innerHTML = '<div class="vazio"><h3>Nenhuma campanha encontrada</h3><p>Nenhuma campanha combina com os filtros. Tente limpar a busca.</p></div>';
        return;
    }

    var linhas = lista.map(function (c) {
        return '<tr>' +
            '<td class="tabela__celula-principal">' +
                '<div class="tabela__principal">' +
                    '<div class="tabela__foto tabela__foto--paisagem"><img src="' + esc(c.imagem || IMG_PADRAO) + '" alt="" loading="lazy"></div>' +
                    '<div><div class="tabela__nome">' + esc(c.titulo) + '</div>' + etiquetaCampanha(c.tipo) + '</div>' +
                '</div>' +
            '</td>' +
            '<td data-rotulo="Quando">' + esc(c.data || '') + '</td>' +
            '<td data-rotulo="Onde">' + esc(c.local || '') + '</td>' +
            '<td><div class="tabela__acoes">' +
                '<button type="button" class="botao botao--texto botao--pequeno" data-editar="' + c.id + '" aria-label="Editar ' + esc(c.titulo) + '">' + icone('editar') + 'Editar</button>' +
                '<button type="button" class="botao botao--texto-perigo botao--pequeno" data-excluir="' + c.id + '" aria-label="Excluir ' + esc(c.titulo) + '">' + icone('lixeira') + 'Excluir</button>' +
            '</div></td>' +
        '</tr>';
    }).join('');

    area.innerHTML =
        '<p class="contagem">' + lista.length + (lista.length === 1 ? ' campanha' : ' campanhas') + '</p>' +
        '<div class="tabela-wrap"><table class="tabela tabela--campanhas">' +
            '<caption class="sr-only">Campanhas da organização</caption>' +
            '<thead><tr><th scope="col">Campanha</th><th scope="col">Quando</th><th scope="col">Onde</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead>' +
            '<tbody>' + linhas + '</tbody>' +
        '</table></div>';
}

function inicializarTabela() {
    qs('#campanhas-grid').addEventListener('click', function (e) {
        var editar = e.target.closest('[data-editar]');
        var excluir = e.target.closest('[data-excluir]');

        if (e.target.closest('[data-novo]')) {
            abrirModal();
        } else if (editar) {
            buscarCampanhaPorId(Number(editar.dataset.editar)).then(function (c) {
                if (c) abrirModal(c);
            });
        } else if (excluir) {
            var id = Number(excluir.dataset.excluir);
            var campanha = campanhasDaOrg.find(function (c) { return c.id === id; });
            confirmar({
                titulo: 'Excluir esta campanha?',
                mensagem: (campanha ? '"' + campanha.titulo + '" ' : 'A campanha ') + 'deixa de aparecer para a cidade. Essa ação não pode ser desfeita.',
                botao: 'Excluir',
                perigo: true
            }).then(function (ok) {
                if (!ok) return;
                removerCampanha(id).then(function () {
                    toast('Campanha excluída.', 'sucesso');
                    carregarCampanhas();
                });
            });
        }
    });
}

// ---------- Diálogo ----------

function inicializarModal() {
    var dialogo = qs('#modal-campanha');
    var form = qs('#form-campanha');

    ligarDialogo(dialogo);
    ligarLimpezaDeErros(form);
    dialogo.addEventListener('close', function () {
        campanhaEditando = null;
        imagemNova = null;
        form.reset();
        limparErros(form);
    });

    qs('#btn-nova-campanha').addEventListener('click', function () { abrirModal(); });

    form.addEventListener('input', atualizarPreview);
    form.addEventListener('change', atualizarPreview);

    qs('#campanha-imagem').addEventListener('change', function (e) {
        var arquivo = e.target.files[0];
        if (!arquivo) {
            imagemNova = null;
            atualizarPreview();
            return;
        }
        lerImagem(arquivo, 900).then(function (url) {
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
        if (!validarFormulario(form)) return;

        var dados = getValoresInput(form);
        if (dados.campanha_fim <= dados.campanha_inicio) {
            mostrarErroCampo(qs('#campanha-fim'), 'O horário de término deve ser depois do início.');
            qs('#campanha-fim').focus();
            return;
        }
        salvarCampanha();
    });
}

function abrirModal(campanha) {
    campanhaEditando = campanha || null;
    imagemNova = null;
    var form = qs('#form-campanha');
    form.reset();
    limparErros(form);

    qs('#modal-title').textContent = campanha ? 'Editar campanha' : 'Nova campanha';

    if (campanha) {
        qs('#campanha-nome').value = campanha.titulo || '';
        qs('#campanha-tipo').value = campanha.tipo || '';
        qs('#campanha-descricao').value = campanha.descricao || '';
        qs('#campanha-local').value = campanha.local || '';
        var data = lerTextoData(campanha.data);
        if (data) {
            qs('#campanha-dia').value = data.dia;
            qs('#campanha-inicio').value = data.inicio;
            qs('#campanha-fim').value = data.fim;
        }
    }

    atualizarPreview();
    qs('#modal-campanha').showModal();
}

function atualizarPreview() {
    var d = getValoresInput('#form-campanha');
    var fotoAtual = campanhaEditando ? campanhaEditando.imagem : IMG_PADRAO;

    qs('#preview-nome').textContent = d.campanha_nome || 'Título da campanha';
    qs('#preview-descricao').innerHTML = textoComNegrito(d.campanha_descricao || 'Descrição da campanha...');
    qs('#preview-tipo').innerHTML = etiquetaCampanha(d.campanha_tipo || 'Tipo de campanha');
    qs('#preview-local').textContent = d.campanha_local || 'Local do evento';
    qs('#preview-img').src = imagemNova || fotoAtual || IMG_PADRAO;
    qs('#preview-data').textContent = (d.campanha_dia && d.campanha_inicio && d.campanha_fim)
        ? montarTextoData(d.campanha_dia, d.campanha_inicio, d.campanha_fim)
        : 'Data do evento';
}

function salvarCampanha() {
    var dados = getValoresInput('#form-campanha');
    var botao = qs('#btn-salvar');

    var objeto = {
        titulo: dados.campanha_nome.trim(),
        descricao: dados.campanha_descricao.trim(),
        imagem: imagemNova || (campanhaEditando ? campanhaEditando.imagem : IMG_PADRAO),
        tipo: dados.campanha_tipo,
        data: montarTextoData(dados.campanha_dia, dados.campanha_inicio, dados.campanha_fim),
        local: dados.campanha_local.trim(),
        fk_instituicao: sessao.id_empresa
    };

    ocupado(botao, true);
    var operacao = campanhaEditando ? atualizarCampanha(campanhaEditando.id, objeto) : criarCampanha(objeto);

    operacao.then(function () {
        toast(campanhaEditando ? 'Campanha atualizada.' : 'Campanha publicada.', 'sucesso');
        qs('#modal-campanha').close();
        carregarCampanhas();
    }).catch(function () {
        toast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.', 'erro');
    }).then(function () {
        ocupado(botao, false);
    });
}

// ---------- Filtros ----------

function inicializarFiltros() {
    qs('#filtro-nome').addEventListener('input', aplicarFiltros);
    qs('#filtro-local').addEventListener('input', aplicarFiltros);
    qs('#filtro-tipo').addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    var nome = normalizar(qs('#filtro-nome').value);
    var local = normalizar(qs('#filtro-local').value);
    var tipo = qs('#filtro-tipo').value;

    renderizarCampanhas(campanhasDaOrg.filter(function (c) {
        return (!nome || normalizar(c.titulo).indexOf(nome) > -1) &&
               (!local || normalizar(c.local).indexOf(local) > -1) &&
               (!tipo || c.tipo === tipo);
    }));
}
