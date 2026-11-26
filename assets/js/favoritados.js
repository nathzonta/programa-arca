// Tela de favoritados: lista os animais que a pessoa marcou com a estrela

var sessao = null;
var favoritos = [];

if (protegerRota(['cidadao', 'representante'])) {
    sessao = getSessao();
    montarMenu('favoritados');
    iniciar();
}

function iniciar() {
    carregarFavoritos();

    qs('#filtro-nome').addEventListener('input', renderizar);
    qs('#filtro-porte').addEventListener('change', renderizar);
    qs('#filtro-sexo').addEventListener('change', renderizar);

    // Clique na estrela de um animal remove dos favoritos
    qs('#favoritados-grid').addEventListener('click', function (e) {
        var botao = e.target.closest('[data-remover]');
        if (!botao) return;
        var id = Number(botao.dataset.remover);
        var animal = favoritos.find(function (a) { return a.id === id; });

        removerFavorito(sessao.id, id).then(function () {
            adicionarHistorico(sessao.id, id, 'desfavoritado');
            toast((animal ? animal.nome : 'O animal') + ' saiu dos favoritos.', 'info');
            carregarFavoritos();
        });
    });
}

function carregarFavoritos() {
    listarFavoritosDaConta(sessao.id).then(function (lista) {
        favoritos = lista;
        renderizar();
    });
}

function renderizar() {
    var grade = qs('#favoritados-grid');

    if (favoritos.length === 0) {
        grade.innerHTML =
            '<div class="vazio">' +
                '<img src="./assets/imgs/illus-cat.svg" alt="">' +
                '<h3>Nenhum favorito ainda</h3>' +
                '<p>Quando um animal chamar sua atenção, toque na estrela para guardá-lo aqui.</p>' +
                '<a class="botao" href="./adocao.html">Conhecer animais ' + icone('seta-direita', 'icone--seta') + '</a>' +
            '</div>';
        return;
    }

    var nome = normalizar(qs('#filtro-nome').value);
    var porte = qs('#filtro-porte').value;
    var sexo = qs('#filtro-sexo').value;

    var filtrados = favoritos.filter(function (a) {
        return (!nome || normalizar(a.nome).indexOf(nome) > -1) &&
               (!porte || normalizar(a.porte) === porte) &&
               (!sexo || normalizar(a.sexo) === sexo);
    });

    if (filtrados.length === 0) {
        grade.innerHTML =
            '<div class="vazio"><h3>Nada com esses filtros</h3><p>Nenhum favorito combina com a busca. Tente limpar os filtros.</p></div>';
        return;
    }

    var html = '<p class="contagem">' + filtrados.length + (filtrados.length === 1 ? ' animal favoritado' : ' animais favoritados') + '</p>';
    html += '<div class="galeria">';
    filtrados.forEach(function (animal, i) {
        html +=
        '<article class="bicho entrada" style="--i:' + i + '">' +
            '<div class="bicho__foto arco"><img src="' + esc(animal.imagem || IMG_PADRAO) + '" alt="Foto de ' + esc(animal.nome) + '" loading="lazy"></div>' +
            '<div class="bicho__topo">' +
                '<h2 class="bicho__nome">' + esc(animal.nome) + '</h2>' +
                '<button type="button" class="botao-acao" data-remover="' + animal.id + '" aria-pressed="true" aria-label="Remover ' + esc(animal.nome) + ' dos favoritos">' + icone('estrela') + '</button>' +
            '</div>' +
            '<div class="bicho__meta">' +
                '<span class="etiqueta etiqueta--castracao">Porte ' + esc((animal.porte || '').toLowerCase()) + '</span>' +
                '<span class="etiqueta etiqueta--feira">R$ ' + esc(animal.valor_custo || '0') + '/mês</span>' +
            '</div>' +
            '<p class="bicho__texto">' + esc(animal.especie || '') + ' · ' + esc(animal.raca || '') + ' · ' + esc(idadeEmAnos(animal.idade_aprox)) + '<br>' + esc(animal.descricao || '') + '</p>' +
        '</article>';
    });
    html += '</div>';
    grade.innerHTML = html;
}
