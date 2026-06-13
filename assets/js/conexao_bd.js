/**
 * conexao_bd.js — Camada de persistência centralizada
 *
 * TODA leitura e gravação de dados deve passar por este arquivo.
 * Nenhum módulo deve acessar localStorage diretamente.
 */

const CHAVE_BD = 'bd_arca';
const CHAVE_SESSAO = 'sessao_arca';
const CAMINHO_BD_JSON = './assets/js/bd_fake.json';

// ============================================================
// FUNÇÕES INTERNAS (helpers)
// ============================================================

/**
 * Carrega o bd_fake.json via fetch e salva no localStorage.
 * Chamado apenas quando o banco não existe no localStorage.
 */
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

/**
 * Gera um ID único baseado no timestamp + aleatório.
 */
function _gerarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// ============================================================
// FUNÇÕES PÚBLICAS DE PERSISTÊNCIA
// ============================================================

/**
 * Retorna o banco completo (objeto com todas as coleções).
 * Se não existir no localStorage, carrega do bd_fake.json primeiro.
 * @returns {Promise<Object>}
 */
function getBanco() {
    var dados = localStorage.getItem(CHAVE_BD);

    if (dados !== null) {
        return Promise.resolve(JSON.parse(dados));
    }

    return _carregarBancoInicial();
}

/**
 * Salva o objeto do banco completo no localStorage.
 * @param {Object} bd_obj - Objeto com todas as coleções
 */
function salvarBanco(bd_obj) {
    localStorage.setItem(CHAVE_BD, JSON.stringify(bd_obj));
}

/**
 * Atualiza o banco (alias para salvarBanco — compatibilidade).
 * @param {Object} bd_obj
 */
function atualizarBanco(bd_obj) {
    salvarBanco(bd_obj);
}

// ============================================================
// FUNÇÕES DE CONTAS (CRUD)
// ============================================================

/**
 * Busca todos os usuários.
 * @returns {Promise<Array>}
 */
function buscarTodosUsuarios() {
    return getBanco().then(function (bd) {
        return bd.contas || [];
    });
}

/**
 * Busca um usuário pelo email.
 * @param {string} email
 * @returns {Promise<Object|undefined>}
 */
function buscarUsuarioPorEmail(email) {
    return getBanco().then(function (bd) {
        return bd.contas.find(function (conta) {
            return conta.email === email;
        });
    });
}

/**
 * Busca um usuário pelo ID.
 * @param {number} id
 * @returns {Promise<Object|undefined>}
 */
function buscarUsuarioPorId(id) {
    return getBanco().then(function (bd) {
        return bd.contas.find(function (conta) {
            return conta.id === id;
        });
    });
}

/**
 * Cria um novo usuário no banco.
 * @param {Object} dados - { email, senha (plain text), tipo, ... }
 * @returns {Promise<Object>} - O usuário criado (com id)
 */
function criarUsuario(dados) {
    return getBanco().then(function (bd) {
        var novoUsuario = {
            id: _gerarId(),
            email: dados.email,
            senha: MD5(dados.senha),
            tipo: dados.tipo || 'cidadao'
        };

        bd.contas.push(novoUsuario);
        salvarBanco(bd);

        return novoUsuario;
    });
}

/**
 * Atualiza um usuário existente.
 * @param {number} id
 * @param {Object} dadosNovos - Campos a atualizar
 * @returns {Promise<Object>} - O usuário atualizado
 */
function atualizarUsuario(id, dadosNovos) {
    return getBanco().then(function (bd) {
        var index = bd.contas.findIndex(function (conta) {
            return conta.id === id;
        });

        if (index === -1) {
            throw new Error('Usuário não encontrado.');
        }

        // Atualiza apenas os campos informados
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

/**
 * Remove um usuário pelo ID.
 * @param {number} id
 * @returns {Promise<boolean>}
 */
function removerUsuario(id) {
    return getBanco().then(function (bd) {
        var index = bd.contas.findIndex(function (conta) {
            return conta.id === id;
        });

        if (index === -1) {
            throw new Error('Usuário não encontrado.');
        }

        bd.contas.splice(index, 1);
        salvarBanco(bd);

        return true;
    });
}

// ============================================================
// FUNÇÕES DE SESSÃO
// ============================================================

/**
 * Salva a sessão do usuário logado.
 * @param {Object} usuario - { id, email, tipo }
 */
function salvarSessao(usuario) {
    var sessao = {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo || 'cidadao',
        logado: true
    };
    localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

/**
 * Retorna a sessão atual (ou null se não logado).
 * @returns {Object|null}
 */
function getSessao() {
    var dados = localStorage.getItem(CHAVE_SESSAO);
    if (dados !== null) {
        return JSON.parse(dados);
    }
    return null;
}

/**
 * Encerra a sessão (logout).
 */
function encerrarSessao() {
    localStorage.removeItem(CHAVE_SESSAO);
}

/**
 * Verifica se o usuário está logado.
 * @returns {boolean}
 */
function estaLogado() {
    var sessao = getSessao();
    return sessao !== null && sessao.logado === true;
}

// ============================================================
// FUNÇÕES DE FAVORITOS E INTERESSES
// ============================================================

/**
 * Busca os IDs dos animais favoritados por um usuário.
 * @param {number} usuarioId
 * @returns {Promise<Array<number>>}
 */
function buscarFavoritos(usuarioId) {
    return getBanco().then(function (bd) {
        if (!bd.favoritos) bd.favoritos = [];
        var registro = bd.favoritos.find(function (f) {
            return f.usuarioId === usuarioId;
        });
        return registro ? registro.animais : [];
    });
}

/**
 * Salva os IDs dos animais favoritados de um usuário.
 * @param {number} usuarioId
 * @param {Array<number>} animaisIds
 * @returns {Promise<void>}
 */
function salvarFavoritos(usuarioId, animaisIds) {
    return getBanco().then(function (bd) {
        if (!bd.favoritos) bd.favoritos = [];
        var index = bd.favoritos.findIndex(function (f) {
            return f.usuarioId === usuarioId;
        });
        if (index >= 0) {
            bd.favoritos[index].animais = animaisIds;
        } else {
            bd.favoritos.push({ usuarioId: usuarioId, animais: animaisIds });
        }
        salvarBanco(bd);
    });
}

/**
 * Busca os IDs dos animais com interesse de um usuário.
 * @param {number} usuarioId
 * @returns {Promise<Array<number>>}
 */
function buscarInteresses(usuarioId) {
    return getBanco().then(function (bd) {
        if (!bd.interesses) bd.interesses = [];
        var registro = bd.interesses.find(function (i) {
            return i.usuarioId === usuarioId;
        });
        return registro ? registro.animais : [];
    });
}

/**
 * Salva os IDs dos animais com interesse de um usuário.
 * @param {number} usuarioId
 * @param {Array<number>} animaisIds
 * @returns {Promise<void>}
 */
function salvarInteresses(usuarioId, animaisIds) {
    return getBanco().then(function (bd) {
        if (!bd.interesses) bd.interesses = [];
        var index = bd.interesses.findIndex(function (i) {
            return i.usuarioId === usuarioId;
        });
        if (index >= 0) {
            bd.interesses[index].animais = animaisIds;
        } else {
            bd.interesses.push({ usuarioId: usuarioId, animais: animaisIds });
        }
        salvarBanco(bd);
    });
}

// ============================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================

// Garante que o banco existe no localStorage ao carregar o script
$(function () {
    getBanco().catch(function (err) {
        console.error('Falha ao inicializar banco:', err);
    });
});
