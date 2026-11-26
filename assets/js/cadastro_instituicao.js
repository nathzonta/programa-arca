// Cadastro de instituição (etapa 2 de 2): liga a organização à conta do representante

var formCadastro = qs('.cadastro-form');
var representanteId = sessionStorage.getItem('representante_id');

// Só chega aqui quem acabou de cadastrar o representante
if (!representanteId) {
    window.location.href = './cadastro_representante.html';
} else {
    ligarLimpezaDeErros(formCadastro);

    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validarFormulario(formCadastro)) return;

        var dados = getValoresInput(formCadastro);
        var botao = qs('button[type="submit"]', formCadastro);
        ocupado(botao, true);

        criarInstituicao({
            nome: dados['nome-instituicao'].trim(),
            cnpj: dados.cnpj || '',
            email: dados.email || '',
            telefone: dados.celular || '',
            endereco: (dados.rua || '') + (dados.numero ? ', ' + dados.numero : ''),
            cidade: dados.cidade || '',
            estado: dados.estado || '',
            descricao: dados.descricao || ''
        })
        .then(function (novaInstituicao) {
            return atualizarUsuario(parseInt(representanteId, 10), {
                id_empresa: novaInstituicao.id
            });
        })
        .then(function (usuarioAtualizado) {
            sessionStorage.removeItem('representante_id');
            salvarSessao(usuarioAtualizado);
            window.location.href = './listagem_animais.html';
        })
        .catch(function (erro) {
            ocupado(botao, false);
            toast('Erro ao cadastrar a instituição: ' + erro.message, 'erro');
        });
    });
}
