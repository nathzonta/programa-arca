// ============================================================
// SELEÇÃO PERSONALIZADA
// Troca a lista feia do navegador por uma lista do visual do ARCA.
// O <select> original continua na página (escondido): é ele que guarda o valor,
// o name e os eventos "change". Por isso formulários, filtros e validações
// continuam funcionando sem mudar nada.
//
// Para NÃO personalizar algum select, coloque class="sem-selecao" nele.
// Teclado: setas, Home/End, Enter/Espaço escolhem, Esc fecha, letras buscam.
// ============================================================

var selecaoAberta = null;   // só uma lista fica aberta por vez

function ligarSelecoes(raiz) {
    qsa('select:not(.sem-selecao)', raiz).forEach(function (select) {
        if (!select._selecaoBotao) criarSelecao(select);
    });
}

function criarSelecao(select) {
    var id = select.id || ('selecao-' + Math.random().toString(36).slice(2, 7));
    var rotulo = select.id ? qs('label[for="' + select.id + '"]') : null;
    if (rotulo && !rotulo.id) rotulo.id = id + '-rotulo';

    // ---------- estrutura ----------
    var caixa = document.createElement('div');
    caixa.className = 'selecao';

    var botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'selecao__botao';
    botao.id = id + '-botao';
    botao.setAttribute('role', 'combobox');
    botao.setAttribute('aria-haspopup', 'listbox');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-controls', id + '-lista');
    botao.setAttribute('aria-labelledby', (rotulo ? rotulo.id + ' ' : '') + botao.id);
    botao.innerHTML = '<span class="selecao__texto"></span>' + icone('seta-baixo', 'selecao__seta');

    var lista = document.createElement('ul');
    lista.className = 'selecao__lista';
    lista.id = id + '-lista';
    lista.setAttribute('role', 'listbox');
    if (rotulo) lista.setAttribute('aria-labelledby', rotulo.id);
    lista.hidden = true;

    select.parentNode.insertBefore(caixa, select);
    caixa.appendChild(select);
    caixa.appendChild(botao);
    caixa.appendChild(lista);
    select.classList.add('selecao__nativo');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');
    select._selecaoBotao = botao;

    var ativo = -1;          // posição da opção em destaque (teclado ou mouse)
    var busca = '';          // letras digitadas para buscar
    var tempoBusca = null;

    function opcoes() {
        return Array.prototype.slice.call(select.options);
    }

    // Mostra no botão o texto da opção escolhida
    function atualizarBotao() {
        var escolhida = select.options[select.selectedIndex];
        var texto = escolhida ? escolhida.text : '';
        qs('.selecao__texto', botao).textContent = texto;
        // em campos obrigatórios, "Selecione" aparece como texto de apoio
        botao.classList.toggle('selecao__botao--vazio', select.required && select.value === '');
        botao.disabled = select.disabled;
    }

    function desenharLista() {
        lista.innerHTML = '';
        opcoes().forEach(function (op, i) {
            var li = document.createElement('li');
            li.id = id + '-op-' + i;
            li.className = 'selecao__opcao' + (op.value === '' && select.required ? ' selecao__opcao--vazia' : '');
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', String(i === select.selectedIndex));
            li.dataset.indice = i;
            li.innerHTML = '<span>' + esc(op.text) + '</span>' + icone('check', 'selecao__check');
            if (op.disabled) li.setAttribute('aria-disabled', 'true');
            lista.appendChild(li);
        });
    }

    function destacar(indice) {
        var itens = qsa('.selecao__opcao', lista);
        if (!itens.length) return;
        ativo = Math.max(0, Math.min(indice, itens.length - 1));
        itens.forEach(function (li, i) { li.classList.toggle('selecao__opcao--ativa', i === ativo); });
        botao.setAttribute('aria-activedescendant', itens[ativo].id);
        itens[ativo].scrollIntoView({ block: 'nearest' });
    }

    // Posiciona a lista logo abaixo do botão (ou acima, se faltar espaço)
    function posicionar() {
        var r = botao.getBoundingClientRect();
        var abaixo = window.innerHeight - r.bottom - 12;
        var acima = r.top - 12;
        var altura = Math.min(lista.scrollHeight, 320);
        var paraCima = abaixo < altura && acima > abaixo;
        lista.style.left = r.left + 'px';
        lista.style.width = r.width + 'px';
        lista.style.maxHeight = Math.max(120, Math.min(320, paraCima ? acima : abaixo)) + 'px';
        if (paraCima) {
            lista.style.top = 'auto';
            lista.style.bottom = (window.innerHeight - r.top + 6) + 'px';
        } else {
            lista.style.bottom = 'auto';
            lista.style.top = (r.bottom + 6) + 'px';
        }
        lista.classList.toggle('selecao__lista--acima', paraCima);
    }

    function abrir() {
        if (select.disabled) return;
        if (selecaoAberta && selecaoAberta !== fechar) selecaoAberta();
        desenharLista();
        // A lista sai de dentro do formulário: assim nenhum bloco com animação ou
        // rolagem corta ou desloca a lista. Dentro de um <dialog> ela fica no próprio
        // diálogo, senão ficaria atrás dele.
        (botao.closest('dialog') || document.body).appendChild(lista);
        lista.hidden = false;
        botao.setAttribute('aria-expanded', 'true');
        caixa.classList.add('selecao--aberta');
        posicionar();
        destacar(Math.max(0, select.selectedIndex));
        selecaoAberta = fechar;
        window.addEventListener('resize', posicionar);
        window.addEventListener('scroll', posicionar, true);
    }

    function fechar() {
        lista.hidden = true;
        caixa.appendChild(lista);
        botao.setAttribute('aria-expanded', 'false');
        botao.removeAttribute('aria-activedescendant');
        caixa.classList.remove('selecao--aberta');
        window.removeEventListener('resize', posicionar);
        window.removeEventListener('scroll', posicionar, true);
        if (selecaoAberta === fechar) selecaoAberta = null;
    }

    function escolher(indice) {
        var op = select.options[indice];
        if (!op || op.disabled) return;
        var mudou = select.selectedIndex !== indice;
        select.selectedIndex = indice;
        atualizarBotao();
        fechar();
        botao.focus();
        if (mudou) {
            // os mesmos eventos que o select nativo dispara
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ---------- mouse ----------
    botao.addEventListener('click', function () {
        if (lista.hidden) abrir(); else fechar();
    });
    // mousedown não tira o foco do botão
    lista.addEventListener('mousedown', function (e) { e.preventDefault(); });
    lista.addEventListener('click', function (e) {
        var li = e.target.closest('.selecao__opcao');
        if (li) escolher(Number(li.dataset.indice));
    });
    lista.addEventListener('mousemove', function (e) {
        var li = e.target.closest('.selecao__opcao');
        if (li && Number(li.dataset.indice) !== ativo) destacar(Number(li.dataset.indice));
    });
    document.addEventListener('mousedown', function (e) {
        if (!lista.hidden && !caixa.contains(e.target) && !lista.contains(e.target)) fechar();
    });

    // clicar no rótulo foca o botão (o select nativo está escondido)
    if (rotulo) rotulo.addEventListener('click', function (e) { e.preventDefault(); botao.focus(); });

    // ---------- teclado ----------
    botao.addEventListener('keydown', function (e) {
        var aberta = !lista.hidden;
        var total = select.options.length;

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!aberta) { abrir(); return; }
            destacar(ativo + (e.key === 'ArrowDown' ? 1 : -1));
        } else if (e.key === 'Home' && aberta) {
            e.preventDefault(); destacar(0);
        } else if (e.key === 'End' && aberta) {
            e.preventDefault(); destacar(total - 1);
        } else if (e.key === 'Enter' || e.key === ' ') {
            // sem a busca em andamento, Enter/Espaço abrem ou escolhem
            if (e.key === ' ' && busca) { e.preventDefault(); return; }
            e.preventDefault();
            if (aberta) escolher(ativo); else abrir();
        } else if (e.key === 'Escape' && aberta) {
            e.preventDefault(); e.stopPropagation(); fechar();
        } else if (e.key === 'Tab') {
            if (aberta) fechar();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // busca por letras: "m" vai para "Médio"
            busca += normalizar(e.key);
            clearTimeout(tempoBusca);
            tempoBusca = setTimeout(function () { busca = ''; }, 600);
            var achou = opcoes().findIndex(function (op) { return normalizar(op.text).indexOf(busca) === 0; });
            if (achou > -1) {
                if (!aberta) abrir();
                destacar(achou);
            }
        }
    });

    // ---------- manter tudo sincronizado ----------
    // 1) código que muda select.value (ex.: preencher o formulário para editar)
    var original = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(select, 'value', {
        configurable: true,
        get: function () { return original.get.call(this); },
        set: function (v) { original.set.call(this, v); atualizarBotao(); }
    });
    // 2) form.reset()
    if (select.form) select.form.addEventListener('reset', function () { setTimeout(atualizarBotao, 0); });
    // 3) alguém escolheu pelo próprio select
    select.addEventListener('change', atualizarBotao);

    atualizarBotao();
}

ligarSelecoes(document);
