const campanhas = [
    {
        id: 1,
        nome: "Patinhas da Serra",
        tipo: "Castração",
        descricao: "A Patinhas da Serra realizará uma campanha de castração para cães e gatos, com vagas limitadas. A ação promove a saúde e o bem-estar animal, além de contribuir para o controle populacional e a redução do abandono. Levar CPF!",
        data: "11/07/2026 às 12h até 16h",
        local: "Shopping Montserrat",
        imagem: "./assets/imgs/campanha-1.jpg"
    },
    {
        id: 2,
        nome: "ONG Amor de Pet",
        tipo: "Feira de Adoção",
        descricao: "A ONG Amor de Pet convida você para uma feira de adoção repleta de animais à procura de um lar cheio de carinho. Venha conhecer cães e gatos resgatados e encontre um novo melhor amigo para a vida toda.",
        data: "08/07/2026 às 07h até 13h",
        local: "Shopping Mestre Álvaro",
        imagem: "./assets/imgs/campanha-2.jpg"
    },
    {
        id: 3,
        nome: "Instituto Vida Animal",
        tipo: "Vacinação",
        descricao: "O Instituto Vida Animal ES promoverá uma ação de vacinação gratuita para cães e gatos. A iniciativa visa reforçar a prevenção de doenças e incentivar os cuidados essenciais com a saúde dos pets da comunidade.",
        data: "28/07/2026 às 08h até 12h",
        local: "Pracinha de Cidade Continental",
        imagem: "./assets/imgs/campanha-3.jpg"
    }
];

const tipoBadgeClass = {
    "Castração": "badge-arca-sucesso",
    "Feira de Adoção": "badge-arca-aviso",
    "Vacinação": "badge-arca-info"
};

let campanhaEditando = null;
let campanhasFiltradas = [...campanhas];

document.addEventListener('DOMContentLoaded', () => {
    inicializarModal();
    inicializarFiltros();
    inicializarPreview();
    renderizarCampanhas(campanhas);
});

function inicializarModal() {
    const modal = document.getElementById('modal-campanha');
    const btnNovo = document.getElementById('btn-nova-campanha');
    const btnClose = document.getElementById('modal-close');
    const btnCancelar = document.getElementById('btn-cancelar');
    const form = document.getElementById('form-campanha');

    btnNovo?.addEventListener('click', () => abrirModal());
    btnClose?.addEventListener('click', () => fecharModal());
    btnCancelar?.addEventListener('click', () => fecharModal());

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) {
            fecharModal();
        }
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validarFormulario()) {
            salvarCampanha();
        }
    });
}

function abrirModal(campanha = null) {
    const modal = document.getElementById('modal-campanha');
    const title = document.getElementById('modal-title');
    const alert = document.getElementById('modal-alert');

    campanhaEditando = campanha;
    title.textContent = campanha ? 'Editar campanha' : 'Nova campanha';
    alert.classList.remove('visible');

    if (campanha) {
        preencherFormulario(campanha);
    } else {
        limparFormulario();
    }

    modal.classList.add('open');
    atualizarPreview();
}

function fecharModal() {
    const modal = document.getElementById('modal-campanha');
    modal.classList.remove('open');
    campanhaEditando = null;
    limparFormulario();
    limparErros();
}

function preencherFormulario(campanha) {
    document.getElementById('campanha-nome').value = campanha.nome || '';
    document.getElementById('campanha-tipo').value = campanha.tipo || '';
    document.getElementById('campanha-descricao').value = campanha.descricao || '';
    document.getElementById('campanha-data').value = campanha.data || '';
    document.getElementById('campanha-local').value = campanha.local || '';

    setTimeout(() => {
        if (typeof iniciarSelects === 'function') {
            iniciarSelects();
        }
        atualizarPreview();
    }, 100);
}

function limparFormulario() {
    const form = document.getElementById('form-campanha');
    form?.reset();
    document.getElementById('campanha-imagem').value = '';

    document.getElementById('preview-nome').textContent = 'Nome da organização';
    document.getElementById('preview-tipo').textContent = 'Tipo de campanha';
    document.getElementById('preview-tipo').className = 'badge-arca mb-2 me-1';
    document.getElementById('preview-descricao').textContent = 'Descrição da campanha...';
    document.getElementById('preview-data').innerHTML = '<img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">Data do evento';
    document.getElementById('preview-local').innerHTML = '<img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">Local do evento';
    document.getElementById('preview-img').src = './assets/imgs/placeholder.png';

    setTimeout(() => {
        if (typeof iniciarSelects === 'function') {
            iniciarSelects();
        }
    }, 100);
}

function inicializarPreview() {
    const inputs = document.querySelectorAll('[data-preview]');
    inputs.forEach(input => {
        input.addEventListener('input', atualizarPreview);
        input.addEventListener('change', atualizarPreview);
    });

    const observer = new MutationObserver(atualizarPreview);
    document.querySelectorAll('.select-arca').forEach(select => {
        observer.observe(select, { childList: true, subtree: true, attributes: true });
    });
}

function atualizarPreview() {
    const nome = document.getElementById('campanha-nome')?.value || 'Nome da organização';
    const tipo = document.getElementById('campanha-tipo')?.value || '';
    const descricao = document.getElementById('campanha-descricao')?.value || 'Descrição da campanha...';
    const data = document.getElementById('campanha-data')?.value || 'Data do evento';
    const local = document.getElementById('campanha-local')?.value || 'Local do evento';

    document.getElementById('preview-nome').textContent = nome;

    const badge = document.getElementById('preview-tipo');
    if (tipo) {
        badge.textContent = tipo;
        badge.className = `badge-arca ${tipoBadgeClass[tipo] || ''} mb-2 me-1`;
    } else {
        badge.textContent = 'Tipo de campanha';
        badge.className = 'badge-arca mb-2 me-1';
    }

    document.getElementById('preview-descricao').textContent = descricao;
    document.getElementById('preview-data').innerHTML = `<img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">${data}`;
    document.getElementById('preview-local').innerHTML = `<img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">${local}`;

    const fileInput = document.getElementById('campanha-imagem');
    if (fileInput?.files?.[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-img').src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function validarFormulario() {
    const campos = [
        { id: 'campanha-nome', label: 'Nome' },
        { id: 'campanha-tipo', label: 'Tipo' },
        { id: 'campanha-descricao', label: 'Descrição' },
        { id: 'campanha-data', label: 'Data' },
        { id: 'campanha-local', label: 'Local' }
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

function salvarCampanha() {
    const fileInput = document.getElementById('campanha-imagem');
    const imagemSrc = fileInput?.files?.[0]
        ? URL.createObjectURL(fileInput.files[0])
        : (campanhaEditando?.imagem || '');

    const novaCampanha = {
        id: campanhaEditando ? campanhaEditando.id : Date.now(),
        nome: document.getElementById('campanha-nome').value,
        tipo: document.getElementById('campanha-tipo').value,
        descricao: document.getElementById('campanha-descricao').value,
        data: document.getElementById('campanha-data').value,
        local: document.getElementById('campanha-local').value,
        imagem: imagemSrc
    };

    if (campanhaEditando) {
        const index = campanhas.findIndex(c => c.id === campanhaEditando.id);
        if (index !== -1) {
            campanhas[index] = { ...campanhas[index], ...novaCampanha };
        }
    } else {
        campanhas.push(novaCampanha);
    }

    campanhasFiltradas = [...campanhas];
    renderizarCampanhas(campanhasFiltradas);
    fecharModal();
}

function renderizarCampanhas(lista) {
    const grid = document.getElementById('campanhas-grid');
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #737373; width: 100%;">Nenhuma campanha encontrada.</p>';
        return;
    }

    grid.innerHTML = lista.map(campanha => {
        const badgeClasse = tipoBadgeClass[campanha.tipo] || '';
        return `
        <div class="col-xl-3 col-lg-5 col-md-6 col-sm-8 col-12 card card-campanha p-1" data-id="${campanha.id}">
            <div class="card-body d-flex flex-column justify-content-between gap-4">
                <img class="col-12" style="border-radius: 15px; height: 220px; object-fit: cover;" src="${campanha.imagem}" alt="${campanha.nome}">
                <div class="card-campanha-text mx-4">
                    <h4  class="d-flex justify-content-between">${campanha.nome}
                        <span class="card-campanha-edit" onclick="abrirModal(campanhas.find(c => c.id === ${campanha.id}))">
                            <img src="./assets/imgs/icons/editar.svg">
                        </span>
                    </h4>
                    <span class="badge-arca ${badgeClasse} mb-2 me-1">${campanha.tipo}</span>
                    <p class="corpo corpo-sm text-muted mt-2">${campanha.descricao}</p>
                </div>
                <div class="card-campanha-infos mx-4">
                    <p class="corpo corpo-micro mb-2"><img src="./assets/imgs/icons/calendario.svg" class="me-2" style="width: 16px; height: 16px;">${campanha.data}</p>
                    <p class="corpo corpo-micro mb-0"><img src="./assets/imgs/icons/mapa.svg" class="me-2" style="width: 16px; height: 16px;">${campanha.local}</p>
                </div>
            </div>
        </div>`;
    }).join('');
}

function inicializarFiltros() {
    const filtroNome = document.getElementById('filtro-nome');
    const filtroTipo = document.getElementById('filtro-tipo');
    const filtroLocal = document.getElementById('filtro-local');

    filtroNome?.addEventListener('input', aplicarFiltros);
    filtroLocal?.addEventListener('input', aplicarFiltros);

    const observer = new MutationObserver(aplicarFiltros);
    document.querySelectorAll('.sidebar-filtros .select-arca').forEach(select => {
        observer.observe(select, { childList: true, subtree: true, attributes: true });
    });
}

function aplicarFiltros() {
    const nome = document.getElementById('filtro-nome')?.value.toLowerCase() || '';
    const tipo = document.getElementById('filtro-tipo')?.value || '';
    const local = document.getElementById('filtro-local')?.value.toLowerCase() || '';

    campanhasFiltradas = campanhas.filter(campanha => {
        const matchNome = campanha.nome.toLowerCase().includes(nome);
        const matchTipo = !tipo || campanha.tipo === tipo;
        const matchLocal = campanha.local.toLowerCase().includes(local);
        return matchNome && matchTipo && matchLocal;
    });

    renderizarCampanhas(campanhasFiltradas);
}
