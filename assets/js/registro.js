/**
 * registro.js — Registro de novos usuários
 *
 * Dependências: jQuery, funcoes.js (MD5, getValoresInput),
 *               conexao_bd.js (buscarUsuarioPorEmail, criarUsuario)
 */

$(function () {

    // ---- Seletores (compatíveis com cadastro.html) ----
    var K_FORM = '.cadastro-form';
    var K_SUBMIT = '.cadastro-form button[type="submit"]';

    // ---- Evento de clique no botão de cadastro ----
    $(K_SUBMIT).on('click', function (e) {
        e.preventDefault();

        var dados = getValoresInput(K_FORM);

        if (!dados) {
            window.alert('Preencha os campos de cadastro.');
            return;
        }

        // Validação individual de cada campo obrigatório
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

        // Validação de email duplicado antes de criar
        buscarUsuarioPorEmail(dados.email.trim())
            .then(function (existente) {
                if (existente) {
                    window.alert('Este e-mail já está cadastrado no sistema.');
                    return;
                }

                // Criar usuário
                return criarUsuario({
                    email: dados.email.trim(),
                    senha: dados.senha,
                    tipo: 'cidadao',
                    nome: dados.nome.trim(),
                    cpf: dados['cpf'] || '',
                    'data-nascimento': dados['data-nascimento'] || '',
                    cep: dados.cep || '',
                    rua: dados.rua || '',
                    numero: dados.numero || '',
                    bairro: dados.bairro || ''
                });
            })
            .then(function (novoUsuario) {
                if (novoUsuario) {
                    window.alert('Usuário cadastrado com sucesso!');
                    window.location.href = './login.html';
                }
            })
            .catch(function (erro) {
                window.alert('Erro ao cadastrar: ' + erro.message);
            });
    });

    // ---- Envio do form com Enter ----
    $(K_FORM).on('submit', function (e) {
        e.preventDefault();
        $(K_SUBMIT).trigger('click');
    });

});
