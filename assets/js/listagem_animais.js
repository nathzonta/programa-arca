// Dados mockados dos animais
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

// Estado da aplicação
let animalEditando = null;
let animaisFiltrados = [...animais];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarSidebar();
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    renderizarAnimais(animais);
});

// ===== SIDEBAR =====
function inicializarSidebar() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Toggle dos submenus
    document.querySelectorAll('.sidebar-menu-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const menu = btn.dataset.menu;
            const submenu = document.getElementById(`submenu-${menu}`);
            const menuItem = btn.closest('.sidebar-menu-item');

            menuItem.classList.toggle('active');
            submenu.classList.toggle('open');
        });
    });

    // Fechar sidebar ao clicar fora (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });
}

// ===== MODAL =====
function inicializarModal() {
    const modal = document.getElementById('modal-animal');
    const btnNovo = document.getElementById('btn-novo-animal');
    const btnClose = document.getElementById('modal-close');
    const btnCancelar = document.getElementById('btn-cancelar');
    const form = document.getElementById('form-animal');

    btnNovo?.addEventListener('click', () => abrirModal());
    btnClose?.addEventListener('click', () => fecharModal());
    btnCancelar?.addEventListener('click', () => fecharModal());

    // Fechar ao clicar no overlay
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) {
            fecharModal();
        }
    });

    // Submit do formulário
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            salvarAnimal();
        }
    });
}

function abrirModal(animal = null) {
    const modal = document.getElementById('modal-animal');
    const title = document.getElementById('modal-title');
    const alert = document.getElementById('modal-alert');

    animalEditando = animal;
    title.textContent = animal ? 'Editar animal' : 'Adicionar animal';
    alert.classList.remove('visible');

    if (animal) {
        preencherFormulario(animal);
    } else {
        limparFormulario();
    }

    modal.classList.add('open');
    atualizarPreview();
}

function fecharModal() {
    const modal = document.getElementById('modal-animal');
    modal.classList.remove('open');
    animalEditando = null;
    limparFormulario();
    limparErros();
}

function preencherFormulario(animal) {
    document.getElementById('animal-nome').value = animal.nome || '';
    document.getElementById('animal-porte').value = animal.porte || '';
    document.getElementById('animal-especie').value = animal.especie || '';
    document.getElementById('animal-raca').value = animal.raca || '';
    document.getElementById('animal-idade').value = animal.idade || '';
    document.getElementById('animal-custo').value = animal.custo ? `R$ ${animal.custo.toFixed(2)}` : '';
    document.getElementById('animal-sexo').value = animal.sexo || '';
    document.getElementById('animal-descricao').value = animal.descricao || '';

    // Reiniciar selects customizados
    setTimeout(() => {
        if (typeof initSelects === 'function') {
            initSelects();
        }
        atualizarPreview();
    }, 100);
}

function limparFormulario() {
    const form = document.getElementById('form-animal');
    form?.reset();
    document.getElementById('animal-imagem').value = '';

    // Resetar preview
    document.getElementById('preview-name').textContent = 'Nome do pet';
    document.getElementById('preview-porte').textContent = 'Porte';
    document.getElementById('preview-vacina').textContent = 'Vacinação';
    document.getElementById('preview-custo').textContent = 'Custo mensal médio de R$ --';
    document.getElementById('preview-info').textContent = 'Espécie: Raça | Idade | Sexo';
    document.getElementById('preview-desc').textContent = 'Preencha os campos para ver a pré-visualização do animal.';
    document.getElementById('preview-img').src = '';

    // Reiniciar selects
    setTimeout(() => {
        if (typeof initSelects === 'function') {
            initSelects();
        }
    }, 100);
}

// ===== PREVIEW EM TEMPO REAL =====
function inicializarPreview() {
    const inputs = document.querySelectorAll('[data-preview]');
    inputs.forEach(input => {
        input.addEventListener('input', atualizarPreview);
        input.addEventListener('change', atualizarPreview);
    });

    // Observar mudanças nos selects customizados
    const observer = new MutationObserver(atualizarPreview);
    document.querySelectorAll('.select-arca').forEach(select => {
        observer.observe(select, { childList: true, subtree: true, attributes: true });
    });
}

function atualizarPreview() {
    const nome = document.getElementById('animal-nome')?.value || 'Nome do pet';
    const porte = document.getElementById('animal-porte')?.value || 'Porte';
    const especie = document.getElementById('animal-especie')?.value || 'Espécie';
    const raca = document.getElementById('animal-raca')?.value || 'Raça';
    const idade = document.getElementById('animal-idade')?.value || 'Idade';
    const sexo = document.getElementById('animal-sexo')?.value || 'Sexo';
    const custo = document.getElementById('animal-custo')?.value || '--';
    const descricao = document.getElementById('animal-descricao')?.value || 'Preencha os campos para ver a pré-visualização do animal.';

    document.getElementById('preview-name').textContent = nome;
    document.getElementById('preview-porte').textContent = `Porte ${porte.toLowerCase()}`;
    document.getElementById('preview-custo').textContent = custo !== '--' ? `Custo mensal médio de ${custo}` : 'Custo mensal médio de R$ --';
    document.getElementById('preview-info').textContent = `${especie}: ${raca} | ${idade} | ${sexo}`;
    document.getElementById('preview-desc').textContent = descricao;

    // Atualizar imagem se houver
    const fileInput = document.getElementById('animal-imagem');
    if (fileInput?.files?.[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-img').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// ===== VALIDAÇÃO =====
function validarFormulario() {
    const campos = [
        { id: 'animal-nome', label: 'Nome' },
        { id: 'animal-porte', label: 'Porte' },
        { id: 'animal-especie', label: 'Espécie' },
        { id: 'animal-raca', label: 'Raça' },
        { id: 'animal-idade', label: 'Idade' },
        { id: 'animal-custo', label: 'Custo' },
        { id: 'animal-sexo', label: 'Sexo' },
        { id: 'animal-descricao', label: 'Descrição' }
    ];

    let valido = true;
    limparErros();

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const formGroup = input?.closest('.form-group-arca');

        if (!input?.value?.trim()) {
            formGroup?.classList.add('error');
            valido = false;
        }
    });

    if (!valido) {
        document.getElementById('modal-alert').classList.add('visible');
    }

    return valido;
}

function limparErros() {
    document.querySelectorAll('.form-group-arca.error').forEach(el => {
        el.classList.remove('error');
    });
    document.getElementById('modal-alert')?.classList.remove('visible');
}

// ===== SALVAR ANIMAL =====
function salvarAnimal() {
    const novoAnimal = {
        id: animalEditando ? animalEditando.id : Date.now(),
        nome: document.getElementById('animal-nome').value,
        porte: document.getElementById('animal-porte').value,
        especie: document.getElementById('animal-especie').value,
        raca: document.getElementById('animal-raca').value,
        idade: document.getElementById('animal-idade').value,
        custo: parseFloat(document.getElementById('animal-custo').value.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0,
        sexo: document.getElementById('animal-sexo').value,
        descricao: document.getElementById('animal-descricao').value,
        vacina: 'Vacinação completa',
        imagem: './assets/imgs/gato-lg.png'
    };

    if (animalEditando) {
        const index = animais.findIndex(a => a.id === animalEditando.id);
        if (index !== -1) {
            animais[index] = { ...animais[index], ...novoAnimal };
        }
    } else {
        animais.push(novoAnimal);
    }

    animaisFiltrados = [...animais];
    renderizarAnimais(animaisFiltrados);
    fecharModal();
}

// ===== RENDERIZAR ANIMAIS =====
function renderizarAnimais(lista) {
    const grid = document.getElementById('animais-grid');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #737373; grid-column: 1 / -1;">Nenhum animal encontrado.</p>';
        return;
    }

    grid.innerHTML = lista.map(animal => `
        <div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-animal p-3" data-id="${animal.id}">
            <div class="card-body d-flex flex-column gap-3">
                <div style="position: relative;">
                    <img class="card-animal-img col-12" src="${animal.imagem}" alt="${animal.nome}">
                    <button class="card-animal-edit" onclick="abrirModal(animais.find(a => a.id === ${animal.id}))">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
                <div class="card-animal-text">
                    <h4>${animal.nome}</h4>
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
            </div>
        </div>
    `).join('');
}

// ===== FILTROS =====
function inicializarFiltros() {
    const filtroNome = document.getElementById('filtro-nome');
    const filtroCusto = document.getElementById('filtro-custo');
    const filtroPorte = document.getElementById('filtro-porte');
    const filtroSexo = document.getElementById('filtro-sexo');

    filtroNome?.addEventListener('input', aplicarFiltros);
    filtroCusto?.addEventListener('input', aplicarFiltros);

    // Observar mudanças nos selects de filtro
    const observer = new MutationObserver(aplicarFiltros);
    document.querySelectorAll('.sidebar-filtros .select-arca').forEach(select => {
        observer.observe(select, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    const nome = document.getElementById('filtro-nome')?.value.toLowerCase() || '';
    const custoMax = parseFloat(document.getElementById('filtro-custo')?.value.replace(/[^0-9.,]/g, '').replace(',', '.')) || Infinity;
    const porte = document.getElementById('filtro-porte')?.value || '';
    const sexo = document.getElementById('filtro-sexo')?.value || '';

    animaisFiltrados = animais.filter(animal => {
        const matchNome = animal.nome.toLowerCase().includes(nome);
        const matchCusto = animal.custo <= custoMax;
        const matchPorte = !porte || animal.porte.toLowerCase() === porte;
        const matchSexo = !sexo || animal.sexo.toLowerCase() === sexo;

        return matchNome && matchCusto && matchPorte && matchSexo;
    });

    renderizarAnimais(animaisFiltrados);
}
