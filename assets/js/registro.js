// Cadastro de cidadão

var formCadastro = qs('.cadastro-form');

ligarMostrarSenha();
ligarLimpezaDeErros(formCadastro);

formCadastro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validarFormulario(formCadastro)) return;

    var dados = getValoresInput(formCadastro);
    var botao = qs('button[type="submit"]', formCadastro);
    ocupado(botao, true);

    // Não deixa criar duas contas com o mesmo e-mail
    buscarUsuarioPorEmail(dados.email.trim())
        .then(function (existente) {
            if (existente) {
                mostrarErroCampo(qs('#email'), 'Este e-mail já está cadastrado. Tente entrar na sua conta.');
                qs('#email').focus();
                return null;
            }

            return criarUsuario({
                email: dados.email.trim(),
                senha: dados.senha,
                tipo: 'cidadao',
                nome: dados.nome.trim(),
                cpf: dados.cpf || '',
                'data-nascimento': dados['data-nascimento'] || '',
                cep: dados.cep || '',
                rua: dados.rua || '',
                numero: dados.numero || '',
                bairro: dados.bairro || ''
            });
        })
        .then(function (novoUsuario) {
            if (novoUsuario) {
                window.location.href = './login.html?cadastro=ok';
            }
        })
        .catch(function (erro) {
            toast('Erro ao cadastrar: ' + erro.message, 'erro');
        })
        .then(function () {
            ocupado(botao, false);
        });
});
