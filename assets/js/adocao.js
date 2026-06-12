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

const interesses = new Set();
const favoritos = new Set();

let animaisFiltrados = [...animais];
let indiceAtual = 0;
let transicionando = false;

document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltros();
    inicializarAcoes();
    renderCard(0);
});

function inicializarAcoes() {
    const container = document.getElementById('swipe-card-container');
    container?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-acao]');
        if (!btn) return;
        if (btn.dataset.acao === 'interesse') toggleInteresse();
        else if (btn.dataset.acao === 'favorito') toggleFavorito();
        else if (btn.dataset.acao === 'proximo') proximoCard();
    });
}

function renderCard(index) {
    const container = document.getElementById('swipe-card-container');
    if (!container) return;

    if (animaisFiltrados.length === 0) {
        container.innerHTML = `
            <div class="swipe-empty">
                <h3>Nenhum animal encontrado</h3>
                <p class="corpo corpo-sm">Tente ajustar os filtros para encontrar mais animais.</p>
            </div>`;
        return;
    }

    if (index >= animaisFiltrados.length) {
        indiceAtual = 0;
    }

    const animal = animaisFiltrados[indiceAtual];
    if (!animal) return;

    const temInteresse = interesses.has(animal.id);
    const temFavorito = favoritos.has(animal.id);

    container.innerHTML = `
        <div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-animal p-3" id="swipe-card">
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
                    <button class="action-btn btn-favorito ${temFavorito ? 'active' : ''}" data-acao="favorito">
                        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <span class="tooltip-text">Favoritar</span>
                    </button>
                    <button class="action-btn btn-proximo" data-acao="proximo">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                        <span class="tooltip-text">Próximo</span>
                    </button>
                </div>
            </div>
        </div>`;
}

function atualizarBotoesEstado() {
    const animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    const container = document.getElementById('swipe-card-container');
    if (!container) return;

    const btnInteresse = container.querySelector('[data-acao="interesse"]');
    const btnFavorito = container.querySelector('[data-acao="favorito"]');
    if (btnInteresse) btnInteresse.classList.toggle('active', interesses.has(animal.id));
    if (btnFavorito) btnFavorito.classList.toggle('active', favoritos.has(animal.id));
}

function toggleInteresse() {
    const animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    if (interesses.has(animal.id)) interesses.delete(animal.id);
    else interesses.add(animal.id);
    atualizarBotoesEstado();
}

function toggleFavorito() {
    const animal = animaisFiltrados[indiceAtual];
    if (!animal) return;
    if (favoritos.has(animal.id)) favoritos.delete(animal.id);
    else favoritos.add(animal.id);
    atualizarBotoesEstado();
}

function proximoCard() {
    if (transicionando) return;
    if (animaisFiltrados.length <= 1) return;

    transicionando = true;

    const card = document.getElementById('swipe-card');
    if (card) card.classList.add('saindo');

    setTimeout(() => {
        let novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * animaisFiltrados.length);
        } while (novoIndice === indiceAtual && animaisFiltrados.length > 1);

        indiceAtual = novoIndice;
        renderCard(indiceAtual);
        transicionando = false;
    }, 300);
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
    const nome = document.getElementById('filtro-nome')?.value.toLowerCase() || '';
    const porte = document.getElementById('filtro-porte')?.value || '';
    const sexo = document.getElementById('filtro-sexo')?.value || '';

    animaisFiltrados = animais.filter(animal => {
        const matchNome = animal.nome.toLowerCase().includes(nome);
        const matchPorte = !porte || animal.porte.toLowerCase() === porte;
        const matchSexo = !sexo || animal.sexo.toLowerCase() === sexo;
        return matchNome && matchPorte && matchSexo;
    });

    indiceAtual = 0;
    renderCard(0);
}
