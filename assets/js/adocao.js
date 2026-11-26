// Tela de adoção: mostra um animal por vez e permite favoritar / demonstrar interesse

var animaisFiltrados = [];
var indiceAtual = 0;
var transicionando = false;
var sessao = null;

if (protegerRota(['cidadao', 'representante'])) {
    sessao = getSessao();
    montarMenu('adocao');
    iniciar();
}

function iniciar() {
    inicializarFiltros();
    inicializarAcoes();
    inicializarModalAjuda();
    carregarAnimais();
}

function carregarAnimais() {
    listarAnimais().then(function (todosAnimais) {
        animaisFiltrados = todosAnimais;
        indiceAtual = 0;
        renderCard();
    });
}

// ---------- Cartão do animal ----------

function renderCard() {
    var container = qs('#swipe-card-container');

    if (animaisFiltrados.length === 0) {
        container.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhum animal encontrado</h3>' +
                '<p>Tente ajustar os filtros para ver mais animais.</p>' +
            '</div>';
        return;
    }

    if (indiceAtual >= animaisFiltrados.length) indiceAtual = 0;
    var animal = animaisFiltrados[indiceAtual];

    // Busca tudo que o cartão precisa: instituição e a conta (favoritos e histórico)
    Promise.all([
        buscarInstituicaoPorId(animal.fk_instituicao),
        buscarUsuarioPorId(sessao.id)
    ]).then(function (resultado) {
        var inst = resultado[0];
        var conta = resultado[1] || {};
        var ehFavorito = (conta.favoritos || []).indexOf(animal.id) > -1;
        var jaInteressado = (conta.historico || []).some(function (h) {
            return h.id_animal === animal.id && h.acao === 'interessado';
        });
        var local = inst ? inst.nome + (inst.endereco ? ' · ' + inst.endereco : '') : '';

        container.innerHTML =
            '<article class="adocao" id="swipe-card" aria-label="' + esc(animal.nome) + '">' +
                '<div class="adocao__foto arco">' +
                    '<img src="' + esc(animal.imagem || IMG_PADRAO) + '" alt="Foto de ' + esc(animal.nome) + '">' +
                '</div>' +
                '<div class="adocao__info">' +
                    '<h2 class="adocao__nome">' + esc(animal.nome) + '</h2>' +
                    '<div class="adocao__dados">' +
                        '<span class="etiqueta etiqueta--castracao">Porte ' + esc((animal.porte || '').toLowerCase()) + '</span>' +
                        '<span class="etiqueta etiqueta--vacina">' + esc(animal.saude || '') + '</span>' +
                        '<span class="etiqueta etiqueta--feira">R$ ' + esc(animal.valor_custo || '0') + '/mês</span>' +
                    '</div>' +
                    '<p class="adocao__descricao">' + esc(animal.descricao || '') + '</p>' +
                    '<dl class="adocao__ficha">' +
                        '<div><dt>Espécie</dt><dd>' + esc(animal.especie || '-') + '</dd></div>' +
                        '<div><dt>Raça</dt><dd>' + esc(animal.raca || '-') + '</dd></div>' +
                        '<div><dt>Idade</dt><dd>' + esc(idadeEmAnos(animal.idade_aprox)) + '</dd></div>' +
                        '<div><dt>Sexo</dt><dd>' + esc(animal.sexo || '-') + '</dd></div>' +
                    '</dl>' +
                    (local ? '<p class="adocao__local">' + icone('mapa') + '<span>' + esc(local) + '</span></p>' : '') +
                    '<div class="adocao__acoes">' +
                        '<button type="button" class="botao-acao botao-acao--interesse" data-acao="interesse"' + (jaInteressado ? ' disabled' : '') + '>' +
                            icone('coracao') + (jaInteressado ? 'Interesse enviado' : 'Tenho interesse') +
                        '</button>' +
                        '<button type="button" class="botao-acao" data-acao="favorito" aria-pressed="' + ehFavorito + '">' +
                            icone('estrela') + '<span>' + (ehFavorito ? 'Favoritado' : 'Favoritar') + '</span>' +
                        '</button>' +
                        '<button type="button" class="botao-acao" data-acao="proximo"' + (animaisFiltrados.length <= 1 ? ' disabled' : '') + '>' +
                            'Ver outro' + icone('seta-direita') +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</article>';
    });
}

// ---------- Ações ----------

function inicializarAcoes() {
    qs('#swipe-card-container').addEventListener('click', function (e) {
        var botao = e.target.closest('[data-acao]');
        if (!botao || botao.disabled) return;

        var acao = botao.dataset.acao;
        if (acao === 'interesse') acaoInteresse(botao);
        else if (acao === 'favorito') acaoFavorito(botao);
        else if (acao === 'proximo') proximoCard();
    });
}

function acaoFavorito(botao) {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;

    var ativo = botao.getAttribute('aria-pressed') === 'true';
    var operacao = ativo ? removerFavorito(sessao.id, animal.id) : adicionarFavorito(sessao.id, animal.id);

    operacao.then(function () {
        return adicionarHistorico(sessao.id, animal.id, ativo ? 'desfavoritado' : 'favorito');
    }).then(function () {
        botao.setAttribute('aria-pressed', String(!ativo));
        qs('span', botao).textContent = ativo ? 'Favoritar' : 'Favoritado';
        toast(ativo ? animal.nome + ' saiu dos favoritos.' : animal.nome + ' foi para os favoritos.', 'info');
    });
}

function acaoInteresse(botao) {
    var animal = animaisFiltrados[indiceAtual];
    if (!animal) return;

    ocupado(botao, true);
    adicionarHistorico(sessao.id, animal.id, 'interessado').then(function () {
        return criarNotificacao({
            nome_pessoa: sessao.nome || sessao.email,
            email_pessoa: sessao.email,
            id_conta: sessao.id,
            id_animal: animal.id,
            id_instituicao: animal.fk_instituicao,
            data: new Date().toISOString().split('T')[0],
            lida: false
        });
    }).then(function () {
        ocupado(botao, false);
        botao.disabled = true;
        botao.innerHTML = icone('coracao') + 'Interesse enviado';
        toast('Pronto! A organização recebeu seu interesse em ' + animal.nome + '.', 'sucesso');
    }).catch(function () {
        ocupado(botao, false);
        toast('Não foi possível enviar seu interesse. Tente novamente.', 'erro');
    });
}

function proximoCard() {
    if (transicionando || animaisFiltrados.length <= 1) return;
    transicionando = true;

    var card = qs('#swipe-card');
    if (card) card.classList.add('adocao__saindo');

    setTimeout(function () {
        var novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * animaisFiltrados.length);
        } while (novoIndice === indiceAtual);

        indiceAtual = novoIndice;
        renderCard();
        transicionando = false;
    }, 200);
}

// ---------- Filtros ----------

function inicializarFiltros() {
    qs('#filtro-custo').addEventListener('input', aplicarFiltros);
    qs('#filtro-porte').addEventListener('change', aplicarFiltros);
    qs('#filtro-sexo').addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    var custoMax = parseFloat(qs('#filtro-custo').value.replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    var porte = qs('#filtro-porte').value;
    var sexo = qs('#filtro-sexo').value;

    listarAnimais().then(function (todosAnimais) {
        animaisFiltrados = todosAnimais.filter(function (animal) {
            var okCusto = parseFloat(animal.valor_custo || 0) <= custoMax;
            var okPorte = !porte || normalizar(animal.porte) === porte;
            var okSexo = !sexo || normalizar(animal.sexo) === sexo;
            return okCusto && okPorte && okSexo;
        });
        indiceAtual = 0;
        renderCard();
    });
}

// ---------- Ajuda ----------

function inicializarModalAjuda() {
    var dialogo = qs('#modal-ajuda');
    ligarDialogo(dialogo);
    qs('#btn-ajuda').addEventListener('click', function () { dialogo.showModal(); });
}
