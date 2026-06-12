// Dados mockados das notificações
const notificacoes = [
    {
        id: 1,
        animal: "Luna",
        imagem: "./assets/imgs/luna.png",
        cidadao: "Mariana",
        telefone: "(27) 99999-9999",
        email: "mariana@exemplo.com",
        mensagem: "Entre em contato para obter mais informações com o cidadão interessado."
    },
    {
        id: 2,
        animal: "Tobias",
        imagem: "./assets/imgs/tobias.png",
        cidadao: "Carlos",
        telefone: "(27) 98888-8888",
        email: "carlos@exemplo.com",
        mensagem: "O cidadão gostaria de agendar uma visita para conhecer o animal pessoalmente."
    },
    {
        id: 3,
        animal: "Luna",
        imagem: "./assets/imgs/luna.png",
        cidadao: "Ana",
        telefone: "(27) 97777-7777",
        email: "ana@exemplo.com",
        mensagem: "Interessada em adotar. Por favor, entre em contato para alinhar os próximos passos."
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarSidebar();
    renderizarNotificacoes(notificacoes);
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

// ===== RENDERIZAR NOTIFICAÇÕES =====
function renderizarNotificacoes(lista) {
    const container = document.getElementById('notif-list');
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #737373;">Nenhuma notificação no momento.</p>';
        return;
    }

    container.innerHTML = lista.map(notif => `
        <div class="notif-card" data-id="${notif.id}">
            <div class="notif-card-img">
                <img src="${notif.imagem}" alt="${notif.animal}">
            </div>
            <div class="notif-card-body">
                <h2 class="notif-card-title">${notif.cidadao} quer adotar ${notif.animal}!</h2>
                <p class="notif-card-desc">${notif.mensagem}</p>
                <div class="notif-card-contato">
                    <a href="tel:${notif.telefone}" class="notif-contato-pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        ${notif.telefone}
                    </a>
                    <a href="mailto:${notif.email}" class="notif-contato-pill">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                            <path d="M22 4L12 13L2 4"/>
                        </svg>
                        ${notif.email}
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}
