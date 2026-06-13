/**
 * cadastro_representante.js — Cadastro de representante institucional
 *
 * Dependências: jQuery, funcoes.js (MD5, getValoresInput),
 *               conexao_bd.js (buscarUsuarioPorEmail, criarUsuario)
 */

$(function () {

    var K_FORM = '.cadastro-form';
    var K_SUBMIT = '.cadastro-form button[type="submit"]';

    $(K_SUBMIT).on('click', function (e) {
        e.preventDefault();

        var dados = getValoresInput(K_FORM);

        if (!dados) {
            window.alert('Preencha os campos de cadastro.');
            return;
        }

        var camposObrigatorios = {
            'nome': 'Nome completo',
            'email': 'E-mail',
            'senha': 'Senha'
        };

        for (var campo in camposObrigatorios) {
            if (!dados[campo] || dados[campo].trim() === '') {
                window.alert('Preencha o campo: ' + camposObrigatorios[campo]);
                return;
            }
        }

        if (!dados.senha || dados.senha.trim().length < 6) {
            window.alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        buscarUsuarioPorEmail(dados.email.trim())
            .then(function (existente) {
                if (existente) {
                    window.alert('Este e-mail ja esta cadastrado no sistema.');
                    return;
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
                window.alert('Erro ao cadastrar: ' + erro.message);
            });
    });

    $(K_FORM).on('submit', function (e) {
        e.preventDefault();
        $(K_SUBMIT).trigger('click');
    });

});
