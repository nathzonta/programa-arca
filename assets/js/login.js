// Tela de login

var usuarioLogado = null;

var formLogin = qs('.login-form');
var dialogoPerfil = qs('#modal-perfil');

ligarMostrarSenha();
ligarLimpezaDeErros(formLogin);
ligarDialogo(dialogoPerfil);

// Vindo do cadastro: mostra a mensagem de sucesso
if (new URLSearchParams(window.location.search).get('cadastro') === 'ok') {
    qs('#login-sucesso').hidden = false;
}

formLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    qs('#login-erro').hidden = true;

    if (!validarFormulario(formLogin)) return;

    var dados = getValoresInput(formLogin);
    login(dados.email.trim(), dados.senha);
});

qs('#modal-perfil-representante').addEventListener('click', function () { loginComo('representante'); });
qs('#modal-perfil-cidadao').addEventListener('click', function () { loginComo('cidadao'); });
qs('#modal-perfil-close').addEventListener('click', function () { dialogoPerfil.close(); });

function mostrarErroLogin(mensagem) {
    qs('#login-erro-texto').textContent = mensagem;
    qs('#login-erro').hidden = false;
}

function login(email, password) {
    var botao = qs('#btn-login');
    ocupado(botao, true);

    buscarUsuarioPorEmail(email)
        .then(function (usuario) {
            // A mesma mensagem para e-mail e senha errados: não revela quais e-mails existem
            if (!usuario || usuario.senha !== MD5(password)) {
                mostrarErroLogin('E-mail ou senha incorretos. Confira os dados e tente de novo.');
                return;
            }

            usuarioLogado = usuario;

            if (usuario.id_empresa !== null && usuario.id_empresa !== undefined) {
                dialogoPerfil.showModal();
            } else {
                loginComo('cidadao');
            }
        })
        .catch(function (erro) {
            mostrarErroLogin('Algo deu errado ao entrar (' + erro.message + '). Tente novamente.');
        })
        .then(function () {
            ocupado(botao, false);
        });
}

function loginComo(tipo) {
    if (!usuarioLogado) return;

    usuarioLogado.tipo = tipo;
    if (tipo === 'cidadao') {
        usuarioLogado.id_empresa = null;
    }

    salvarSessao(usuarioLogado);

    window.location.href = tipo === 'representante' ? './listagem_animais.html' : './adocao.html';
}
