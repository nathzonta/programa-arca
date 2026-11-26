// ============================================================
// FUNÇÕES ÚTEIS DO ARCA
// Scripts comuns (sem módulos): as funções abaixo ficam disponíveis
// em todas as páginas que carregam este arquivo.
// ============================================================

// ---------- Encriptar em MD5 (implementação original do projeto) ----------
var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],6,-1530992060),f,r,d[n+4],10,1272893353),m,f,d[n+7],14,-155497632),i,m,d[n+10],20,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],5,681279174),f,r,d[n+0],9,-358537222),m,f,d[n+3],14,-722521979),i,m,d[n+6],20,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],6,-640364487),f,r,d[n+12],10,-421815835),m,f,d[n+15],14,530742520),i,m,d[n+2],20,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],14,-1416354905),i,m,d[n+5],20,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],9,-1894986606),m,f,d[n+10],14,-1051523),i,m,d[n+1],20,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],9,-30611744),m,f,d[n+6],14,-1560198380),i,m,d[n+13],20,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],9,-1120210379),m,f,d[n+2],14,718787259),i,m,d[n+9],20,-343485551);m=safe_add(m,h);f=safe_add(f,t);r=safe_add(r,g);i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(_,m,d,f,r,i){return safe_add(bit_rol(safe_add(safe_add(m,_),safe_add(f,i)),r),d)}function md5_ff(_,m,d,f,r,i,n){return md5_cmn((m&d)|((~m)&f),_,m,r,i,n)}function md5_gg(_,m,d,f,r,i,n){return md5_cmn((m&f)|(d&(~f)),_,m,r,i,n)}function md5_hh(_,m,d,f,r,i,n){return md5_cmn(m^d^f,_,m,r,i,n)}function md5_ii(_,m,d,f,r,i,n){return md5_cmn(d^(m|(~f)),_,m,r,i,n)}function md5_1(_,m,d,f,r,i,n){return md5_cmn((m&d)|((~m)&f),_,m,r,i,n)}function md5_2(_,m,d,f,r,i,n){return md5_cmn((m&f)|(d&(~f)),_,m,r,i,n)}function md5_3(_,m,d,f,r,i,n){return md5_cmn(m^d^f,_,m,r,i,n)}function md5_4(_,m,d,f,r,i,n){return md5_cmn(d^(m|(~f)),_,m,r,i,n)}function safe_add(_,m){var d=(_&65535)+(m&65535);return(_>>16)+(m>>16)+(d>>16)<<16|d&65535}function bit_rol(_,m){return _<<m|_>>>32-m}

// ---------- Atalhos de DOM ----------
function qs(seletor, raiz) {
    return (raiz || document).querySelector(seletor);
}

function qsa(seletor, raiz) {
    return Array.from((raiz || document).querySelectorAll(seletor));
}

// ---------- Segurança: escapar texto antes de colocar em HTML ----------
function esc(valor) {
    var mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(valor == null ? '' : valor).replace(/[&<>"']/g, function (c) {
        return mapa[c];
    });
}

// Descrições de campanha podem ter <b>...</b> (ex.: "Levar CPF!"). Só ele é liberado.
function textoComNegrito(texto) {
    return esc(texto).replace(/&lt;(\/?)b&gt;/gi, '<$1b>');
}

// Ícones ficam em assets/imgs/icons/sprite.svg
function icone(nome, classe) {
    return '<svg class="icone ' + (classe || '') + '" aria-hidden="true" focusable="false">' +
        '<use href="./assets/imgs/icons/sprite.svg#' + nome + '"></use></svg>';
}

// ---------- Textos e datas ----------
// Tira acentos e maiúsculas para comparar ("Médio" e "medio" ficam iguais)
function normalizar(texto) {
    return String(texto == null ? '' : texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// Lê "11/07/2026 às 12h até 16h" e devolve { dia: '11', mes: 'jul' }
function extrairData(texto) {
    var meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(texto || '');
    if (!m || m[2] < 1 || m[2] > 12) return null;
    return { dia: ('0' + m[1]).slice(-2), mes: meses[m[2] - 1], ano: m[3] };
}

function formatarDataISO(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? m[3] + '/' + m[2] + '/' + m[1] : (iso || '');
}

// 1 -> '1 ano', 4 -> '4 anos'
function idadeEmAnos(idade) {
    var n = String(idade == null ? '' : idade).trim();
    if (n === '') return '-';
    return n === '1' ? '1 ano' : n + ' anos';
}

function iniciais(nome) {
    var partes = String(nome || '?').trim().split(/\s+/);
    var primeira = partes[0].charAt(0);
    var ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : '';
    return (primeira + ultima).toUpperCase();
}

var IMG_PADRAO = './assets/imgs/placeholder.png';

// Tipos de campanha e a cor da etiqueta de cada um
var TIPOS_CAMPANHA = {
    'Castração': 'castracao',
    'Feira de Adoção': 'feira',
    'Vacinação': 'vacina'
};

function etiquetaCampanha(tipo) {
    var classe = TIPOS_CAMPANHA[tipo] || 'neutra';
    return '<span class="etiqueta etiqueta--' + classe + '">' + esc(tipo || 'Campanha') + '</span>';
}

// ---------- Formulários ----------
// Pega o value de cada campo com name e devolve um objeto { name: valor }
function getValoresInput(elemento) {
    var container = typeof elemento === 'string' ? qs(elemento) : elemento;
    if (!container) {
        console.error('O elemento não existe:', elemento);
        return null;
    }

    var retorno = {};
    qsa('input[name], textarea[name], select[name]', container).forEach(function (campo) {
        var tipo = (campo.type || 'text').toLowerCase();
        if (tipo === 'checkbox') {
            retorno[campo.name] = campo.checked;
        } else if (tipo === 'radio') {
            if (campo.checked) retorno[campo.name] = campo.value;
        } else if (tipo === 'file') {
            retorno[campo.name] = campo.files && campo.files.length ? campo.files[0].name : '';
        } else {
            retorno[campo.name] = campo.value;
        }
    });
    return retorno;
}

function mostrarErroCampo(campo, mensagem) {
    var grupo = campo.closest('.campo');
    if (!grupo) return;
    grupo.classList.add('campo--erro');
    campo.setAttribute('aria-invalid', 'true');

    var aviso = qs('.campo__erro', grupo);
    if (!aviso) {
        aviso = document.createElement('p');
        aviso.className = 'campo__erro';
        aviso.id = (campo.id || campo.name) + '-erro';
        grupo.appendChild(aviso);
    }
    aviso.innerHTML = icone('alerta') + '<span>' + esc(mensagem) + '</span>';
    campo.setAttribute('aria-describedby', aviso.id);
    if (campo._selecaoBotao) {
        campo._selecaoBotao.setAttribute('aria-invalid', 'true');
        campo._selecaoBotao.setAttribute('aria-describedby', aviso.id);
    }
}

function limparErroCampo(campo) {
    var grupo = campo.closest('.campo');
    if (!grupo) return;
    grupo.classList.remove('campo--erro');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
    if (campo._selecaoBotao) {
        campo._selecaoBotao.removeAttribute('aria-invalid');
        campo._selecaoBotao.removeAttribute('aria-describedby');
    }
    var aviso = qs('.campo__erro', grupo);
    if (aviso) aviso.remove();
}

function limparErros(formulario) {
    var form = typeof formulario === 'string' ? qs(formulario) : formulario;
    qsa('.campo--erro input, .campo--erro select, .campo--erro textarea', form).forEach(limparErroCampo);
    var resumo = qs('[data-resumo]', form.closest('dialog') || form);
    if (resumo) resumo.hidden = true;
}

// Valida campos required, e-mail e minlength. Retorna true se estiver tudo certo.
function validarFormulario(formulario) {
    var form = typeof formulario === 'string' ? qs(formulario) : formulario;
    limparErros(form);

    var invalidos = [];
    qsa('input, select, textarea', form).forEach(function (campo) {
        if (campo.disabled || campo.type === 'hidden' || campo.type === 'file') return;
        var valor = campo.value.trim();

        if (campo.required && valor === '') {
            mostrarErroCampo(campo, campo.dataset.erro || 'Preencha este campo.');
            invalidos.push(campo);
        } else if (valor && campo.type === 'email' && mensagemEmail(valor)) {
            mostrarErroCampo(campo, mensagemEmail(valor));
            invalidos.push(campo);
        } else if (valor && campo.dataset.mascara && mensagemMascara(campo.dataset.mascara, valor)) {
            mostrarErroCampo(campo, mensagemMascara(campo.dataset.mascara, valor));
            invalidos.push(campo);
        } else if (valor && campo.minLength > 0 && valor.length < campo.minLength) {
            mostrarErroCampo(campo, 'Use pelo menos ' + campo.minLength + ' caracteres.');
            invalidos.push(campo);
        }
    });

    if (invalidos.length > 0) {
        var resumo = qs('[data-resumo]', form.closest('dialog') || form);
        if (resumo) {
            qs('[data-resumo-texto]', resumo).textContent = invalidos.length === 1
                ? 'Revise o campo destacado para continuar.'
                : 'Revise os ' + invalidos.length + ' campos destacados para continuar.';
            resumo.hidden = false;
        }
        (invalidos[0]._selecaoBotao || invalidos[0]).focus();
        return false;
    }
    return true;
}

// Quando a pessoa volta a digitar num campo com erro, o erro some
function ligarLimpezaDeErros(formulario) {
    var form = typeof formulario === 'string' ? qs(formulario) : formulario;
    function aoEditar(e) {
        if (!e.target.closest('.campo--erro')) return;
        limparErroCampo(e.target);
        // Quando o último erro é corrigido, o aviso geral some também
        if (!qs('.campo--erro', form)) {
            var resumo = qs('[data-resumo]', form.closest('dialog') || form);
            if (resumo) resumo.hidden = true;
        }
    }
    form.addEventListener('input', aoEditar);
    form.addEventListener('change', aoEditar);
}

// Botão de mostrar/ocultar senha: <button data-mostrar-senha="#senha">
function ligarMostrarSenha() {
    qsa('[data-mostrar-senha]').forEach(function (botao) {
        var campo = qs(botao.dataset.mostrarSenha);
        botao.addEventListener('click', function () {
            var mostrar = campo.type === 'password';
            campo.type = mostrar ? 'text' : 'password';
            botao.setAttribute('aria-pressed', String(mostrar));
            botao.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
            botao.innerHTML = icone(mostrar ? 'olho-fechado' : 'olho');
        });
    });
}

// ---------- Avisos (toast) ----------
// toast('Salvo!', 'sucesso')  |  tipos: 'sucesso', 'erro', 'info'
function toast(mensagem, tipo) {
    var regiao = qs('#toasts');
    if (!regiao) {
        regiao = document.createElement('div');
        regiao.id = 'toasts';
        regiao.className = 'toasts';
        regiao.setAttribute('role', 'status');
        regiao.setAttribute('aria-live', 'polite');
        document.body.appendChild(regiao);
    }

    var nomeIcone = tipo === 'sucesso' ? 'check' : tipo === 'erro' ? 'alerta' : 'info';
    var el = document.createElement('div');
    el.className = 'toast toast--' + (tipo || 'info');
    el.innerHTML = icone(nomeIcone) + '<p>' + esc(mensagem) + '</p>' +
        '<button type="button" class="toast__fechar" aria-label="Fechar aviso">' + icone('x') + '</button>';

    function remover() {
        el.classList.add('toast--saindo');
        setTimeout(function () { el.remove(); }, 250);
    }
    qs('.toast__fechar', el).addEventListener('click', remover);
    regiao.appendChild(el);
    setTimeout(remover, 5000);
}

// ---------- Confirmação (no lugar do confirm() do navegador) ----------
// confirmar({ titulo, mensagem, botao, perigo }).then(function (ok) { ... })
function confirmar(opcoes) {
    return new Promise(function (resolver) {
        var dialogo = document.createElement('dialog');
        dialogo.className = 'dialogo dialogo--pequeno';
        dialogo.setAttribute('aria-labelledby', 'confirmar-titulo');
        dialogo.innerHTML =
            '<form method="dialog" class="dialogo__painel">' +
                '<h2 id="confirmar-titulo" class="dialogo__titulo">' + esc(opcoes.titulo) + '</h2>' +
                '<p>' + esc(opcoes.mensagem) + '</p>' +
                '<div class="dialogo__acoes">' +
                    '<button value="cancelar" class="botao botao--contorno" autofocus>Cancelar</button>' +
                    '<button value="ok" class="botao ' + (opcoes.perigo ? 'botao--perigo' : '') + '">' + esc(opcoes.botao || 'Confirmar') + '</button>' +
                '</div>' +
            '</form>';
        document.body.appendChild(dialogo);

        dialogo.addEventListener('click', function (e) {
            if (e.target === dialogo) dialogo.close('cancelar');
        });
        dialogo.addEventListener('close', function () {
            resolver(dialogo.returnValue === 'ok');
            dialogo.remove();
        });
        dialogo.showModal();
    });
}

// Liga um <dialog> existente: fecha clicando fora ou em [data-fechar]
function ligarDialogo(dialogo) {
    dialogo.addEventListener('click', function (e) {
        if (e.target === dialogo || e.target.closest('[data-fechar]')) dialogo.close();
    });
}

// Deixa o botão "ocupado" enquanto algo carrega
function ocupado(botao, estado) {
    if (!botao) return;
    botao.disabled = estado;
    botao.classList.toggle('carregando', estado);
    botao.setAttribute('aria-busy', String(estado));
}
// ---------- Imagens enviadas pelo usuário ----------
// Lê o arquivo, reduz para no máximo "maxLado" pixels e devolve um texto (data URL)
// que cabe no localStorage. Uso: lerImagem(arquivo, 700).then(function (url) { ... })
function lerImagem(arquivo, maxLado) {
    return new Promise(function (resolver, rejeitar) {
        var leitor = new FileReader();
        leitor.onerror = function () { rejeitar(new Error('Não foi possível ler a imagem.')); };
        leitor.onload = function () {
            var img = new Image();
            img.onerror = function () { rejeitar(new Error('Arquivo de imagem inválido.')); };
            img.onload = function () {
                var escala = Math.min(1, maxLado / Math.max(img.width, img.height));
                var canvas = document.createElement('canvas');
                canvas.width = Math.round(img.width * escala);
                canvas.height = Math.round(img.height * escala);
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolver(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = leitor.result;
        };
        leitor.readAsDataURL(arquivo);
    });
}

// ============================================================
// MÁSCARAS E VALIDAÇÕES DE CAMPOS
// Para usar, basta colocar data-mascara="..." no <input>:
//   cpf | cnpj | cep | telefone | data | numero
// ============================================================

// Padrões: cada "0" é um dígito, o resto é texto fixo
var PADROES = {
    cpf: '000.000.000-00',
    cnpj: '00.000.000/0000-00',
    cep: '00000-000',
    data: '00/00/0000'
};

function aplicarPadrao(digitos, padrao) {
    var saida = '';
    var k = 0;
    for (var i = 0; i < padrao.length && k < digitos.length; i++) {
        saida += padrao.charAt(i) === '0' ? digitos.charAt(k++) : padrao.charAt(i);
    }
    return saida;
}

function formatarMascara(tipo, texto) {
    var d = String(texto).replace(/\D/g, '');
    if (tipo === 'telefone') {
        d = d.slice(0, 11);
        return aplicarPadrao(d, d.length > 10 ? '(00) 00000-0000' : '(00) 0000-0000');
    }
    if (tipo === 'numero') return d;
    var padrao = PADROES[tipo];
    if (!padrao) return texto;
    var max = (padrao.match(/0/g) || []).length;
    return aplicarPadrao(d.slice(0, max), padrao);
}

// Liga as máscaras: o campo é formatado enquanto a pessoa digita ou cola
function ligarMascaras() {
    qsa('[data-mascara]').forEach(function (campo) {
        var tipo = campo.dataset.mascara;
        campo.addEventListener('input', function () {
            // guarda quantos dígitos havia antes do cursor, para ele não "pular" ao reformatar
            var pos = campo.selectionStart;
            var antes = pos == null ? null : campo.value.slice(0, pos).replace(/\D/g, '').length;
            var novo = formatarMascara(tipo, campo.value);
            if (novo === campo.value) return;
            campo.value = novo;
            if (antes !== null && document.activeElement === campo) {
                var cont = 0;
                var i = 0;
                while (i < novo.length && cont < antes) {
                    if (/\d/.test(novo.charAt(i))) cont++;
                    i++;
                }
                campo.setSelectionRange(i, i);
            }
        });
    });
}

// ---------- E-mail ----------
// Devolve '' se estiver certo, ou a mensagem explicando o que falta
function mensagemEmail(valor) {
    var v = String(valor).trim();
    if (/\s/.test(v)) return 'O e-mail não pode ter espaços.';
    if (v.indexOf('@') === -1) return 'Falta o @ no e-mail. Exemplo: nome@exemplo.com.';
    if (v.split('@').length > 2) return 'O e-mail deve ter um único @.';

    var partes = v.split('@');
    var local = partes[0];
    var dominio = partes[1];
    if (!local) return 'Escreva alguma coisa antes do @. Exemplo: nome@exemplo.com.';
    if (!dominio) return 'Escreva o domínio depois do @. Exemplo: nome@exemplo.com.';
    if (dominio.indexOf('.') === -1) return 'Falta o final do domínio, como .com ou .com.br.';
    if (/\.\./.test(v) || /^\./.test(local) || /\.$/.test(local) || /^[.-]|[.-]$/.test(dominio)) {
        return 'Esse e-mail tem pontos ou hífens em lugar errado. Confira e tente de novo.';
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(v)) {
        return 'Esse e-mail parece inválido. Use só letras, números e . _ - e termine com .com, .org etc.';
    }
    return '';
}

// ---------- CPF e CNPJ (com dígitos verificadores) ----------
function cpfValido(texto) {
    var d = String(texto).replace(/\D/g, '');
    if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
    for (var t = 9; t < 11; t++) {
        var soma = 0;
        for (var i = 0; i < t; i++) soma += Number(d.charAt(i)) * (t + 1 - i);
        var digito = ((soma * 10) % 11) % 10;
        if (digito !== Number(d.charAt(t))) return false;
    }
    return true;
}

function cnpjValido(texto) {
    var d = String(texto).replace(/\D/g, '');
    if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
    for (var t = 12; t < 14; t++) {
        var soma = 0;
        var peso = t - 7;
        for (var i = 0; i < t; i++) {
            soma += Number(d.charAt(i)) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }
        var digito = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (digito !== Number(d.charAt(t))) return false;
    }
    return true;
}

// ---------- Data (dd/mm/aaaa) ----------
function dataValida(texto) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (!m) return 'incompleta';
    var dia = Number(m[1]);
    var mes = Number(m[2]);
    var ano = Number(m[3]);
    var data = new Date(ano, mes - 1, dia);
    if (ano < 1900 || data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return 'invalida';
    if (data > new Date()) return 'futura';
    return '';
}

// Mensagem de erro de um campo com máscara ('' = tudo certo)
function mensagemMascara(tipo, valor) {
    var d = String(valor).replace(/\D/g, '');
    if (tipo === 'cpf') {
        if (d.length < 11) return 'O CPF tem 11 números. Faltam ' + (11 - d.length) + '.';
        return cpfValido(valor) ? '' : 'Esse CPF não é válido. Confira os números.';
    }
    if (tipo === 'cnpj') {
        if (d.length < 14) return 'O CNPJ tem 14 números. Faltam ' + (14 - d.length) + '.';
        return cnpjValido(valor) ? '' : 'Esse CNPJ não é válido. Confira os números.';
    }
    if (tipo === 'cep') {
        return d.length === 8 ? '' : 'O CEP tem 8 números, como 29160-000.';
    }
    if (tipo === 'telefone') {
        if (d.length < 10) return 'Informe o DDD e o número, como (27) 99999-9999.';
        if (Number(d.slice(0, 2)) < 11) return 'O DDD informado não existe.';
        if (d.length === 11 && d.charAt(2) !== '9') return 'Celular com 11 números começa com 9 depois do DDD.';
        return '';
    }
    if (tipo === 'data') {
        var erro = dataValida(valor);
        if (erro === 'incompleta') return 'Informe a data completa, como 25/12/1990.';
        if (erro === 'invalida') return 'Essa data não existe. Confira dia, mês e ano.';
        if (erro === 'futura') return 'A data não pode ser no futuro.';
    }
    return '';
}

ligarMascaras();