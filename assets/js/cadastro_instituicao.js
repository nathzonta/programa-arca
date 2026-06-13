$(function () {

    var K_FORM = '.cadastro-form';
    var K_SUBMIT = '.cadastro-form button[type="submit"]';

    var representanteId = sessionStorage.getItem('representante_id');

    if (!representanteId) {
        window.alert('Acesso invalido. Faca o cadastro de representante primeiro.');
        window.location.href = './cadastro_representante.html';
        return;
    }

    $(K_SUBMIT).on('click', function (e) {
        e.preventDefault();

        var dados = getValoresInput(K_FORM);

        if (!dados) {
            window.alert('Preencha os campos da instituicao.');
            return;
        }

        var camposObrigatorios = {
            'nome-instituicao': 'Nome da Instituicao',
            'cnpj': 'CNPJ',
            'email': 'E-mail de contato'
        };

        for (var campo in camposObrigatorios) {
            if (!dados[campo] || dados[campo].trim() === '') {
                window.alert('Preencha o campo: ' + camposObrigatorios[campo]);
                return;
            }
        }

        criarInstituicao({
            nome: dados['nome-instituicao'] || '',
            cnpj: dados.cnpj || '',
            email: dados.email || '',
            telefone: dados.celular || '',
            endereco: (dados.rua || '') + (dados.numero ? ', ' + dados.numero : ''),
            cidade: dados.cidade || '',
            estado: dados.estado || '',
            descricao: dados.descricao || ''
        })
        .then(function (novaInstituicao) {
            return atualizarUsuario(parseInt(representanteId), {
                id_empresa: novaInstituicao.id
            }).then(function (usuarioAtualizado) {
                return { instituicao: novaInstituicao, usuario: usuarioAtualizado };
            });
        })
        .then(function (resultado) {
            sessionStorage.removeItem('representante_id');
            salvarSessao(resultado.usuario);

            window.alert('Instituicao cadastrada com sucesso!');
            window.location.href = './listagem_animais.html';
        })
        .catch(function (erro) {
            window.alert('Erro ao cadastrar instituicao: ' + erro.message);
        });
    });

    $(K_FORM).on('submit', function (e) {
        e.preventDefault();
        $(K_SUBMIT).trigger('click');
    });

});
