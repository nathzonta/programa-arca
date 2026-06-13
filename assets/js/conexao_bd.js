let CHAVE_BD = 'bd_arca';
let CHAVE_SESSAO = 'sessao_arca';
let CAMINHO_BD_JSON = './assets/js/bd_fake.json';

// FUNÇÕES ÚTEIS

function _carregarBancoInicial() {
    return fetch(CAMINHO_BD_JSON)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Erro ao carregar banco inicial: ' + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem(CHAVE_BD, JSON.stringify(data));
            return data;
        })
        .catch(function (error) {
            console.error('Erro ao carregar JSON:', error);
            throw error;
        });
}

function gerarId(colecao) {
    if (!colecao || colecao.length === 0) return 1;
    return Math.max.apply(null, colecao.map(function (i) { return i.id; })) + 1;
}


// FUNÇÕES DE BANCO

function getBanco() {
    let dados = localStorage.getItem(CHAVE_BD);
    if (dados !== null) {
        return Promise.resolve(JSON.parse(dados));
    }
    return _carregarBancoInicial();
}

function salvarBanco(bd_obj) {
    localStorage.setItem(CHAVE_BD, JSON.stringify(bd_obj));
}

function atualizarBanco(bd_obj) {
    salvarBanco(bd_obj);
}

// FUNÇÕES DE CONTAS

function buscarTodosUsuarios() {
    return getBanco().then(function (bd) {
        return bd.contas || [];
    });
}

function buscarUsuarioPorEmail(email) {
    return getBanco().then(function (bd) {
        return bd.contas.find(function (conta) {
            return conta.email === email;
        });
    });
}

function buscarUsuarioPorId(id) {
    return getBanco().then(function (bd) {
        return bd.contas.find(function (conta) {
            return conta.id === id;
        });
    });
}

function criarUsuario(dados) {
    return getBanco().then(function (bd) {
        if (!bd.contas) bd.contas = [];
        let novoUsuario = {
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
        let index = bd.contas.findIndex(function (conta) {
            return conta.id === id;
        });
        if (index === -1) {
            throw new Error('Usuario nao encontrado.');
        }
        Object.keys(dadosNovos).forEach(function (chave) {
            if (chave === 'senha') {
                bd.contas[index][chave] = MD5(dadosNovos[chave]);
            } else {
                bd.contas[index][chave] = dadosNovos[chave];
            }
        });
        salvarBanco(bd);
        return bd.contas[index];
    });
}

function removerUsuario(id) {
    return getBanco().then(function (bd) {
        let index = bd.contas.findIndex(function (conta) {
            return conta.id === id;
        });
        if (index === -1) {
            throw new Error('Usuario nao encontrado.');
        }
        bd.contas.splice(index, 1);
        salvarBanco(bd);
        return true;
    });
}

// FUNÇÕES DE SESSÃO

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
    let dados = localStorage.getItem(CHAVE_SESSAO);
    if (dados !== null) {
        return JSON.parse(dados);
    }
    return null;
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
}

function estaLogado() {
    let sessao = getSessao();
    return sessao !== null && sessao.logado === true;
}


// FUNÇÕES DE ANIMAIS

function listarAnimais() {
    return getBanco().then(function (bd) {
        return bd.animais || [];
    });
}

function buscarAnimalPorId(id) {
    return getBanco().then(function (bd) {
        return (bd.animais || []).find(function (a) {
            return a.id === id;
        });
    });
}

function criarAnimal(obj) {
    return getBanco().then(function (bd) {
        if (!bd.animais) bd.animais = [];
        let novo = $.extend({}, obj, { id: gerarId(bd.animais) });
        bd.animais.push(novo);
        salvarBanco(bd);
        return novo;
    });
}

function atualizarAnimal(id, dadosNovos) {
    return getBanco().then(function (bd) {
        let index = (bd.animais || []).findIndex(function (a) { return a.id === id; });
        if (index === -1) throw new Error('Animal nao encontrado.');
        bd.animais[index] = $.extend({}, bd.animais[index], dadosNovos);
        salvarBanco(bd);
        return bd.animais[index];
    });
}

function removerAnimal(id) {
    return getBanco().then(function (bd) {
        let index = (bd.animais || []).findIndex(function (a) { return a.id === id; });
        if (index === -1) throw new Error('Animal nao encontrado.');
        bd.animais.splice(index, 1);
        salvarBanco(bd);
        return true;
    });
}

// FUNÇÕES DE CAMPANHAS

function listarCampanhas() {
    return getBanco().then(function (bd) {
        return bd.campanhas || [];
    });
}

function buscarCampanhaPorId(id) {
    return getBanco().then(function (bd) {
        return (bd.campanhas || []).find(function (c) {
            return c.id === id;
        });
    });
}

function criarCampanha(obj) {
    return getBanco().then(function (bd) {
        if (!bd.campanhas) bd.campanhas = [];
        let novo = $.extend({}, obj, { id: gerarId(bd.campanhas) });
        bd.campanhas.push(novo);
        salvarBanco(bd);
        return novo;
    });
}

function atualizarCampanha(id, dadosNovos) {
    return getBanco().then(function (bd) {
        let index = (bd.campanhas || []).findIndex(function (c) { return c.id === id; });
        if (index === -1) throw new Error('Campanha nao encontrada.');
        bd.campanhas[index] = $.extend({}, bd.campanhas[index], dadosNovos);
        salvarBanco(bd);
        return bd.campanhas[index];
    });
}

function removerCampanha(id) {
    return getBanco().then(function (bd) {
        let index = (bd.campanhas || []).findIndex(function (c) { return c.id === id; });
        if (index === -1) throw new Error('Campanha nao encontrada.');
        bd.campanhas.splice(index, 1);
        salvarBanco(bd);
        return true;
    });
}

// FUNÇÕES DE INSTITUIÇÕES

function criarInstituicao(obj) {
    return getBanco().then(function (bd) {
        if (!bd.instituicoes) bd.instituicoes = [];
        var novo = $.extend({}, obj, { id: gerarId(bd.instituicoes) });
        bd.instituicoes.push(novo);
        salvarBanco(bd);
        return novo;
    });
}

function buscarInstituicaoPorId(id) {
    return getBanco().then(function (bd) {
        return (bd.instituicoes || []).find(function (i) {
            return i.id === id;
        });
    });
}


// FUNÇÕES DE NOTIFICAÇÕES

function listarNotificacoesPorInstituicao(idInstituicao) {
    return getBanco().then(function (bd) {
        return (bd.notificacoes || []).filter(function (n) {
            return n.id_instituicao === idInstituicao;
        });
    });
}

function criarNotificacao(obj) {
    return getBanco().then(function (bd) {
        if (!bd.notificacoes) bd.notificacoes = [];
        var novo = $.extend({}, obj, { id: gerarId(bd.notificacoes) });
        bd.notificacoes.push(novo);
        salvarBanco(bd);
        return novo;
    });
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

// FUNÇÕES DE FAVORITOS E HISTÓRICO

function adicionarFavorito(idConta, idAnimal) {
    return getBanco().then(function (bd) {
        var conta = bd.contas.find(function (c) { return c.id === idConta; });
        if (!conta) throw new Error('Conta nao encontrada.');
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
        var conta = bd.contas.find(function (c) { return c.id === idConta; });
        if (!conta) throw new Error('Conta nao encontrada.');
        if (!conta.favoritos) conta.favoritos = [];
        var idx = conta.favoritos.indexOf(idAnimal);
        if (idx > -1) conta.favoritos.splice(idx, 1);
        salvarBanco(bd);
        return conta.favoritos;
    });
}

function adicionarHistorico(idConta, idAnimal, acao) {
    return getBanco().then(function (bd) {
        var conta = bd.contas.find(function (c) { return c.id === idConta; });
        if (!conta) throw new Error('Conta nao encontrada.');
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
        var conta = bd.contas.find(function (c) { return c.id === idConta; });
        if (!conta || !conta.favoritos || conta.favoritos.length === 0) return [];
        return (bd.animais || []).filter(function (a) {
            return conta.favoritos.indexOf(a.id) > -1;
        });
    });
}

function listarHistoricoDaConta(idConta) {
    return getBanco().then(function (bd) {
        var conta = bd.contas.find(function (c) { return c.id === idConta; });
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

// INICIALIZAÇÃO AUTOMÁTICA

$(function () {
    getBanco().catch(function (err) {
        console.error('Falha ao inicializar banco:', err);
    });
});
