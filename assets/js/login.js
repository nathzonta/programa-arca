/**
 * login.js — Autenticação de usuários
 *
 * Dependências: jQuery, funcoes.js (MD5, getValoresInput),
 *               conexao_bd.js (buscarUsuarioPorEmail, salvarSessao)
 */

$(function () {

    // ---- Seletores (compatíveis com login.html) ----
    var K_FORM = '.login-form';
    var K_SUBMIT = '.login-form button[type="submit"]';

    // ---- Evento de clique no botão de login ----
    $(K_SUBMIT).on('click', function (e) {
        e.preventDefault();

        var dados = getValoresInput(K_FORM);

        if (!dados) {
            window.alert('Preencha os campos de login.');
            return;
        }

        // Validação individual
        if (!dados.email || dados.email.trim() === '') {
            window.alert('Preencha o campo de email.');
            return;
        }

        if (!dados.senha || dados.senha.trim() === '') {
            window.alert('Preencha o campo de senha.');
            return;
        }

        login(dados.email.trim(), dados.senha);
    });

    // ---- Envio do form com Enter ----
    $(K_FORM).on('submit', function (e) {
        e.preventDefault();
        $(K_SUBMIT).trigger('click');
    });

});

/**
 * Tenta autenticar o usuário no banco fake.
 * @param {string} email
 * @param {string} password - Senha em texto plano
 */
function login(email, password) {
    buscarUsuarioPorEmail(email)
        .then(function (usuario) {
            console.log(usuario);
            if (!usuario) {
                window.alert('Usuário não encontrado.');
                return;
            }

            if (usuario.senha !== MD5(password)) {
                window.alert('Senha incorreta.');
                return;
            }

            // Login bem-sucedido
            salvarSessao(usuario);
            window.alert('Login realizado com sucesso!');

            // Redireciona para a página inicial
            window.location.href = './index.html';
        })
        .catch(function (erro) {
            window.alert('Erro ao realizar login: ' + erro.message);
        });
}
