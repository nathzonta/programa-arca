const acoesHistorico = [
    {
        id: 1,
        animal: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        tipo: "favoritado",
        label: "Favoritado"
    },
    {
        id: 2,
        animal: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        tipo: "interesse",
        label: "Demonstrou interesse em adotar"
    },
    {
        id: 3,
        animal: "Luna",
        imagem: "./assets/imgs/luna.png",
        tipo: "interesse",
        label: "Demonstrou interesse em adotar"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltro();
    renderizar();
});

function inicializarFiltro() {
    const select = document.getElementById('filtro-acao');
    select?.addEventListener('change', renderizar);

    const observer = new MutationObserver(renderizar);
    document.querySelectorAll('.sidebar-filtros .select-arca').forEach(el => {
        observer.observe(el, { childList: true, subtree: true, attributes: true });
    });
}

function renderizar() {
    const grid = document.getElementById('historico-grid');
    if (!grid) return;

    const filtro = document.getElementById('filtro-acao')?.value || '';
    const lista = acoesHistorico.filter(a => !filtro || a.tipo === filtro);

    if (lista.length === 0) {
        grid.innerHTML = '<p class="historico-empty">Nenhuma ação encontrada.</p>';
        return;
    }

    grid.innerHTML = lista.map(acao => `
        <article class="historico-card" data-id="${acao.id}">
            <div class="historico-card-img">
                <img src="${acao.imagem}" alt="${acao.animal}">
            </div>
            <div class="historico-card-body">
                <h2 class="historico-card-nome">${acao.animal}</h2>
                <span class="badge-arca badge-historico-${acao.tipo}">${acao.label}</span>
            </div>
        </article>
    `).join('');
}
