// Cadastro de representante (etapa 1 de 2): cria a conta e segue para a instituição

var formCadastro = qs('.cadastro-form');

ligarMostrarSenha();
ligarLimpezaDeErros(formCadastro);

formCadastro.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validarFormulario(formCadastro)) return;

    var dados = getValoresInput(formCadastro);
    var botao = qs('button[type="submit"]', formCadastro);
    ocupado(botao, true);

    buscarUsuarioPorEmail(dados.email.trim())
        .then(function (existente) {
            if (existente) {
                mostrarErroCampo(qs('#email'), 'Este e-mail já está cadastrado. Tente entrar na sua conta.');
                qs('#email').focus();
                return null;
            }

            return criarUsuario({
                nome: dados.nome.trim(),
                email: dados.email.trim(),
                senha: dados.senha,
                tipo: 'representante',
                id_empresa: null,
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
                sessionStorage.setItem('representante_id', novoUsuario.id);
                window.location.href = './cadastro_instituicao.html';
            }
        })
        .catch(function (erro) {
            toast('Erro ao cadastrar: ' + erro.message, 'erro');
        })
        .then(function () {
            ocupado(botao, false);
        });
});
