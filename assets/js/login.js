let usuarioLogado = null;

$(function () {

    var K_FORM = '.login-form';
    var K_SUBMIT = '.login-form button[type="submit"]';

    $(K_SUBMIT).on('click', function (e) {
        e.preventDefault();
        var dados = getValoresInput(K_FORM);
        if (!dados) {
            window.alert('Preencha os campos de login.');
            return;
        }
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

    $(K_FORM).on('submit', function (e) {
        e.preventDefault();
        $(K_SUBMIT).trigger('click');
    });

    $('#modal-perfil-representante').on('click', function () {
        loginComo('representante');
    });

    $('#modal-perfil-cidadao').on('click', function () {
        loginComo('cidadao');
    });

    $('#modal-perfil-close').on('click', function () {
        $('#modal-perfil').toggleClass('escondido');
    });
});

function login(email, password) {
    buscarUsuarioPorEmail(email)
        .then(function (usuario) {
            if (!usuario) {
                window.alert('Usuario nao encontrado.');
                return;
            }
            if (usuario.senha !== MD5(password)) {
                window.alert('Senha incorreta.');
                return;
            }

            usuarioLogado = usuario;

            if (usuario.id_empresa !== null && usuario.id_empresa !== undefined) {
                $('#modal-perfil').toggleClass('escondido');
            } else {
                loginComo('cidadao');
            }
        })
        .catch(function (erro) {
            window.alert('Erro ao realizar login: ' + erro.message);
        });
}

function loginComo(tipo) {
    if (!usuarioLogado) return;

    usuarioLogado.tipo = tipo;
    if (tipo === 'cidadao') {
        usuarioLogado.id_empresa = null;
    }

    salvarSessao(usuarioLogado);
    $('#modal-perfil').removeClass('escondido');

    if (tipo === 'representante') {
        window.location.href = './listagem_animais.html';
    } else {
        window.location.href = './adocao.html';
    }
}
