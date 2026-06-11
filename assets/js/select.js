
// Função pra iniciar os selects customizados (+/- gambiarra)
function iniciarSelects() {
    document.querySelectorAll('.select-arca').forEach(listaSelects => {
        const selectNativo = document.getElementById(listaSelects.dataset.select);
        const textoSelectSelecionado = selectNativo.options[selectNativo.selectedIndex].text;

        // Pega o texto do label que faz referência ao select pelo id dele no for e seta como header
        // na lista de options fakes
        const headerTexto = document.querySelectorAll('label[for="' + listaSelects.dataset.select + '"]')[0].innerText;
        let optionsHtml = headerTexto ? `<div class="select-arca-header">${headerTexto}</div>` : '';

        // Criando o HTML dos options nativos na lista de options customizada e setando o data-value como o value
        // do option nativo
        Array.from(selectNativo.options).forEach(opt => {
            const isSelected = opt.selected ? ' selected' : '';
            optionsHtml += `
                <div class="select-arca-option${isSelected}" data-value="${opt.value}">
                    ${opt.text}
                    <img class="select-arca-option-check" width="12" height="8" src="./assets/imgs/icons/select-check.svg">
                </div>`;
        });

        // Renderizando a lista de options customizada + o input fake
        listaSelects.innerHTML = `
            <div class="select-arca-trigger">
                <span class="select-arca-selected">${textoSelectSelecionado}</span>
                <img width="12" height="8" src="./assets/imgs/icons/select-icon.svg">
            </div>
            <div class="select-arca-options">${optionsHtml}</div>`;

        // Setando eventos de click pros options fakes da lista renderizada
        const trigger = listaSelects.querySelector('.select-arca-trigger');
        const optionsLista = listaSelects.querySelectorAll('.select-arca-option');

        trigger.addEventListener('click', e => {
            e.stopPropagation();

            document.querySelectorAll('.select-arca.aberto').forEach(s => {
                if (s !== listaSelects) {
                    s.classList.remove('aberto');
                }
            });

            listaSelects.classList.toggle('aberto');
        });

        // Pegando o data-value do option fake, setando como value do select nativo e fechando a lista
        optionsLista.forEach(option => {
            option.addEventListener('click', e => {
                e.stopPropagation();

                const valor = option.dataset.value;

                optionsLista.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');

                trigger.querySelector('.select-arca-selected').textContent = option.textContent.trim();
                selectNativo.value = valor;

                listaSelects.classList.remove('aberto');
            });
        });
    });
}

// Inicia os inputs de select assim que o DOM estiver preparado
document.addEventListener('DOMContentLoaded', iniciarSelects);
