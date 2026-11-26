// ============================================================
// "BANCO DE DADOS" DO ARCA
// O projeto ainda não tem servidor: os dados ficam no localStorage e começam
// a partir do arquivo bd_fake.json. As funções abaixo são as mesmas de antes
// (mesmos nomes e mesmas chaves), apenas escritas com JavaScript puro.
// Todas retornam Promise, então use .then(...) ou await.
// ============================================================

var CHAVE_BD = 'bd_arca';
var CHAVE_SESSAO = 'sessao_arca';
var CAMINHO_BD_JSON = './assets/js/bd_fake.json';

// Versão dos dados de exemplo. Quando o bd_fake.json ganha dados novos, aumente este número
// e o campo "versao" do JSON: o navegador descarta a cópia antiga do localStorage e recarrega.
// (Contas e cadastros feitos durante testes são apagados nessa troca.)
var VERSAO_BD = 2;

// ---------- FUNÇÕES ÚTEIS ----------

// Na primeira visita, busca o bd_fake.json e guarda no localStorage
function _carregarBancoInicial() {
    return fetch(CAMINHO_BD_JSON)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error('Erro ao carregar banco inicial: ' + resposta.status);
            }
            return resposta.json();
        })
        .then(function (dados) {
            localStorage.setItem(CHAVE_BD, JSON.stringify(dados));
            return dados;
        })
        .catch(function (erro) {
            console.error('Erro ao carregar JSON:', erro);
            throw erro;
        });
}

function gerarId(colecao) {
    if (!colecao || colecao.length === 0) return 1;
    return Math.max.apply(null, colecao.map(function (item) { return item.id; })) + 1;
}

// ---------- BANCO ----------

function getBanco() {
    var dados = localStorage.getItem(CHAVE_BD);
    if (dados !== null) {
        var bd = JSON.parse(dados);
        if (bd.versao === VERSAO_BD) {
            return Promise.resolve(bd);
        }
    }
    // Sem banco salvo, ou com uma versão antiga dos dados de exemplo
    return _carregarBancoInicial();
}

function salvarBanco(bd_obj) {
    localStorage.setItem(CHAVE_BD, JSON.stringify(bd_obj));
}

function atualizarBanco(bd_obj) {
    salvarBanco(bd_obj);
}

// Funções genéricas usadas pelas coleções (animais, campanhas etc.)
function _inserir(colecao, obj) {
    return getBanco().then(function (bd) {
        if (!bd[colecao]) bd[colecao] = [];
        var novo = Object.assign({}, obj, { id: gerarId(bd[colecao]) });
        bd[colecao].push(novo);
        salvarBanco(bd);
        return novo;
    });
}

function _alterar(colecao, id, dadosNovos, nome) {
    return getBanco().then(function (bd) {
        var index = (bd[colecao] || []).findIndex(function (item) { return item.id === id; });
        if (index === -1) throw new Error(nome + ' nao encontrado.');
        bd[colecao][index] = Object.assign({}, bd[colecao][index], dadosNovos);
        salvarBanco(bd);
        return bd[colecao][index];
    });
}

function _excluir(colecao, id, nome) {
    return getBanco().then(function (bd) {
        var index = (bd[colecao] || []).findIndex(function (item) { return item.id === id; });
        if (index === -1) throw new Error(nome + ' nao encontrado.');
        bd[colecao].splice(index, 1);
        salvarBanco(bd);
        return true;
    });
}

// ---------- CONTAS ----------

function buscarTodosUsuarios() {
    return getBanco().then(function (bd) {
        return bd.contas || [];
    });
}

function buscarUsuarioPorEmail(email) {
    return getBanco().then(function (bd) {
        return (bd.contas || []).find(function (conta) {
            return conta.email === email;
        });
    });
}

function buscarUsuarioPorId(id) {
    return getBanco().then(function (bd) {
        return (bd.contas || []).find(function (conta) {
            return conta.id === id;
        });
    });
}

function criarUsuario(dados) {
    return getBanco().then(function (bd) {
        if (!bd.contas) bd.contas = [];
        var novoUsuario = {
            id: gerarId(bd.contas),
            nome: dados.nome || '',
            email: dados.email,
            senha: MD5(dados.senha),
            tipo: dados.tipo || 'cidadao',
            id_empresa: dados.id_empresa || null,
            favoritos: [],
            historico: []
        };
        bd.contas.push(novoUsuario);
        salvarBanco(bd);
        return novoUsuario;
    });
}

function atualizarUsuario(id, dadosNovos) {
    return getBanco().then(function (bd) {
        var index = bd.contas.findIndex(function (conta) { return conta.id === id; });
        if (index === -1) throw new Error('Usuario nao encontrado.');
        Object.keys(dadosNovos).forEach(function (chave) {
            bd.contas[index][chave] = chave === 'senha' ? MD5(dadosNovos[chave]) : dadosNovos[chave];
        });
        salvarBanco(bd);
        return bd.contas[index];
    });
}

function removerUsuario(id) {
    return getBanco().then(function (bd) {
        var index = bd.contas.findIndex(function (conta) { return conta.id === id; });
        if (index === -1) throw new Error('Usuario nao encontrado.');
        bd.contas.splice(index, 1);
        salvarBanco(bd);
        return true;
    });
}

// ---------- SESSÃO ----------

function salvarSessao(usuario) {
    var sessao = {
        id: usuario.id,
        nome: usuario.nome || usuario.email,
        email: usuario.email,
        tipo: usuario.tipo || 'cidadao',
        id_empresa: usuario.id_empresa || null,
        logado: true
    };
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

function getSessao() {
    var dados = localStorage.getItem(CHAVE_SESSAO);
    if (dados === null) return null;
    try {
        return JSON.parse(dados);
    } catch (erro) {
        return null;
    }
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
}

function estaLogado() {
    var sessao = getSessao();
    return sessao !== null && sessao.logado === true;
}

// ---------- ANIMAIS ----------

function listarAnimais() {
    return getBanco().then(function (bd) {
        return bd.animais || [];
    });
}

function buscarAnimalPorId(id) {
    return listarAnimais().then(function (animais) {
        return animais.find(function (a) { return a.id === id; });
    });
}

function criarAnimal(obj) {
    return _inserir('animais', obj);
}

function atualizarAnimal(id, dadosNovos) {
    return _alterar('animais', id, dadosNovos, 'Animal');
}

function removerAnimal(id) {
    return _excluir('animais', id, 'Animal');
}

// ---------- CAMPANHAS ----------

function listarCampanhas() {
    return getBanco().then(function (bd) {
        return bd.campanhas || [];
    });
}

function buscarCampanhaPorId(id) {
    return listarCampanhas().then(function (campanhas) {
        return campanhas.find(function (c) { return c.id === id; });
    });
}

function criarCampanha(obj) {
    return _inserir('campanhas', obj);
}

function atualizarCampanha(id, dadosNovos) {
    return _alterar('campanhas', id, dadosNovos, 'Campanha');
}

function removerCampanha(id) {
    return _excluir('campanhas', id, 'Campanha');
}

// ---------- INSTITUIÇÕES ----------

function listarInstituicoes() {
    return getBanco().then(function (bd) {
        return bd.instituicoes || [];
    });
}

function criarInstituicao(obj) {
    return _inserir('instituicoes', obj);
}

function buscarInstituicaoPorId(id) {
    return listarInstituicoes().then(function (lista) {
        return lista.find(function (i) { return i.id === id; });
    });
}

// ---------- NOTIFICAÇÕES ----------

function listarNotificacoesPorInstituicao(idInstituicao) {
    return getBanco().then(function (bd) {
        return (bd.notificacoes || []).filter(function (n) {
            return n.id_instituicao === idInstituicao;
        });
    });
}

function criarNotificacao(obj) {
    return _inserir('notificacoes', obj);
}

function marcarNotificacaoLida(id) {
    return getBanco().then(function (bd) {
        var notif = (bd.notificacoes || []).find(function (n) { return n.id === id; });
        if (!notif) throw new Error('Notificacao nao encontrada.');
        notif.lida = true;
        salvarBanco(bd);
        return notif;
    });
}

// ---------- FAVORITOS E HISTÓRICO ----------

function _acharConta(bd, idConta) {
    var conta = (bd.contas || []).find(function (c) { return c.id === idConta; });
    if (!conta) throw new Error('Conta nao encontrada.');
    return conta;
}

function adicionarFavorito(idConta, idAnimal) {
    return getBanco().then(function (bd) {
        var conta = _acharConta(bd, idConta);
        if (!conta.favoritos) conta.favoritos = [];
        if (conta.favoritos.indexOf(idAnimal) === -1) {
            conta.favoritos.push(idAnimal);
        }
        salvarBanco(bd);
        return conta.favoritos;
    });
}

function removerFavorito(idConta, idAnimal) {
    return getBanco().then(function (bd) {
        var conta = _acharConta(bd, idConta);
        if (!conta.favoritos) conta.favoritos = [];
        var idx = conta.favoritos.indexOf(idAnimal);
        if (idx > -1) conta.favoritos.splice(idx, 1);
        salvarBanco(bd);
        return conta.favoritos;
    });
}

function adicionarHistorico(idConta, idAnimal, acao) {
    return getBanco().then(function (bd) {
        var conta = _acharConta(bd, idConta);
        if (!conta.historico) conta.historico = [];
        var hoje = new Date();
        var dataStr = hoje.getFullYear() + '-' +
            String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
            String(hoje.getDate()).padStart(2, '0');
        conta.historico.unshift({
            id_animal: idAnimal,
            acao: acao,
            data: dataStr
        });
        salvarBanco(bd);
        return conta.historico;
    });
}

function listarFavoritosDaConta(idConta) {
    return getBanco().then(function (bd) {
        var conta = (bd.contas || []).find(function (c) { return c.id === idConta; });
        if (!conta || !conta.favoritos || conta.favoritos.length === 0) return [];
        return (bd.animais || []).filter(function (a) {
            return conta.favoritos.indexOf(a.id) > -1;
        });
    });
}

function listarHistoricoDaConta(idConta) {
    return getBanco().then(function (bd) {
        var conta = (bd.contas || []).find(function (c) { return c.id === idConta; });
        if (!conta || !conta.historico || conta.historico.length === 0) return [];
        var animais = bd.animais || [];
        return conta.historico.map(function (h) {
            var animal = animais.find(function (a) { return a.id === h.id_animal; });
            return {
                id_animal: h.id_animal,
                acao: h.acao,
                data: h.data,
                nome_animal: animal ? animal.nome : 'Desconhecido',
                imagem: animal ? animal.imagem : '',
                porte: animal ? animal.porte : '',
                especie: animal ? animal.especie : ''
            };
        });
    });
}

// ---------- INICIALIZAÇÃO AUTOMÁTICA ----------
// Garante que o banco exista no localStorage assim que a página abre
getBanco().catch(function (erro) {
    console.error('Falha ao inicializar banco:', erro);
});
