const animais = [
    {
        id: 1,
        nome: "Luna",
        imagem: "./assets/imgs/luna.png",
        porte: "Pequeno",
        vacina: "Vacinação completa",
        custo: 115,
        especie: "Gato",
        raca: "Indefinida",
        idade: "1 ano",
        sexo: "Fêmea",
        descricao: "Luna é uma gatinha tranquila e observadora que adora encontrar um cantinho confortável para descansar perto das pessoas."
    },
    {
        id: 2,
        nome: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        porte: "Médio",
        vacina: "Vacinação incompleta",
        custo: 180,
        especie: "Cachorro",
        raca: "Labrador",
        idade: "4 anos",
        sexo: "Macho",
        descricao: "Tobias é um cãozinho alegre e companheiro, sempre pronto para um passeio ou alguns minutos de brincadeira."
    }
];

const STORAGE_KEY_FAV = 'arca_favoritos';
const STORAGE_KEY_INT = 'arca_interesses';

function carregarIds(chave) {
    try {
        const data = localStorage.getItem(chave);
        return data ? new Set(JSON.parse(data)) : new Set();
    } catch {
        return new Set();
    }
}

function salvarIds(chave, set) {
    localStorage.setItem(chave, JSON.stringify([...set]));
}

let favoritos = carregarIds(STORAGE_KEY_FAV);
let interesses = carregarIds(STORAGE_KEY_INT);

if (favoritos.size === 0) {
    favoritos = new Set([1, 2]);
    salvarIds(STORAGE_KEY_FAV, favoritos);
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('favoritados-grid');
    grid?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-acao]');
        if (!btn) return;

        const card = btn.closest('[data-animal-id]');
        const id = parseInt(card?.dataset.animalId);
        if (!id) return;

        if (btn.dataset.acao === 'interesse') toggleInteresse(id);
        else if (btn.dataset.acao === 'favorito') toggleFavorito(id, card);
    });

    inicializarFiltros();
    renderizar();
});

function toggleInteresse(id) {
    if (interesses.has(id)) interesses.delete(id);
    else interesses.add(id);
    salvarIds(STORAGE_KEY_INT, interesses);
    atualizarBotoes(id);
}

function toggleFavorito(id, card) {
    favoritos.delete(id);
    salvarIds(STORAGE_KEY_FAV, favoritos);

    card.classList.add('removendo');
    setTimeout(() => {
        renderizar();
    }, 300);
}

function atualizarBotoes(id) {
    const card = document.querySelector(`[data-animal-id="${id}"]`);
    if (!card) return;

    const btnInteresse = card.querySelector('[data-acao="interesse"]');
    const btnFavorito = card.querySelector('[data-acao="favorito"]');

    if (btnInteresse) btnInteresse.classList.toggle('active', interesses.has(id));
    if (btnFavorito) btnFavorito.classList.toggle('active', favoritos.has(id));
}

function renderizar() {
    const grid = document.getElementById('favoritados-grid');
    if (!grid) return;

    const nome = document.getElementById('filtro-nome')?.value.toLowerCase() || '';
    const porte = document.getElementById('filtro-porte')?.value || '';
    const sexo = document.getElementById('filtro-sexo')?.value || '';

    const animaisFav = animais.filter(a => {
        if (!favoritos.has(a.id)) return false;
        const matchNome = a.nome.toLowerCase().includes(nome);
        const matchPorte = !porte || a.porte.toLowerCase() === porte;
        const matchSexo = !sexo || a.sexo.toLowerCase() === sexo;
        return matchNome && matchPorte && matchSexo;
    });

    if (animaisFav.length === 0) {
        grid.innerHTML = `
            <div class="favoritados-empty">
                <h3>Nenhum animal encontrado</h3>
                <p class="corpo corpo-sm">Nenhum dos seus favoritos corresponde aos filtros selecionados.</p>
                <a href="./adocao.html" class="corpo corpo-sm">Ir para Encontre seu companheiro</a>
            </div>`;
        return;
    }

    grid.innerHTML = animaisFav.map(animal => {
        const temInteresse = interesses.has(animal.id);
        const temFavorito = true;

        return `
        <div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-animal p-3" data-animal-id="${animal.id}">
            <div class="card-body d-flex flex-column gap-3">
                <div style="position: relative;">
                    <img class="card-animal-img col-12" src="${animal.imagem}" alt="${animal.nome}">
                </div>
                <div class="card-animal-text">
                    <h4 class="d-flex justify-content-between">${animal.nome}</h4>
                    <div class="card-animal-badges">
                        <span class="badge-arca badge-arca-sucesso">Porte ${animal.porte.toLowerCase()}</span>
                        <span class="badge-arca badge-arca-info">${animal.vacina}</span>
                        <span class="badge-arca badge-arca-rosa">Custo mensal médio de R$ ${animal.custo}</span>
                    </div>
                    <p class="corpo corpo-sm text-muted mt-2">
                    ${animal.especie}: ${animal.raca} | ${animal.idade} | ${animal.sexo}<br><br>
                    ${animal.descricao}
                    </p>
                </div>
                <div class="card-animal-footer">
                    <button class="action-btn btn-interesse ${temInteresse ? 'active' : ''}" data-acao="interesse">
                        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span class="tooltip-text">Tenho interesse</span>
                    </button>
                    <button class="action-btn btn-favorito active" data-acao="favorito">
                        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span class="tooltip-text">Remover dos favoritos</span>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function inicializarFiltros() {
    const filtroNome = document.getElementById('filtro-nome');
    const filtroPorte = document.getElementById('filtro-porte');
    const filtroSexo = document.getElementById('filtro-sexo');

    filtroNome?.addEventListener('input', aplicarFiltros);
    filtroSexo?.addEventListener('input', aplicarFiltros);

    const observer = new MutationObserver(aplicarFiltros);
    document.querySelectorAll('.sidebar-filtros .select-arca').forEach(select => {
        observer.observe(select, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    renderizar();
}
