// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarSidebar();
});

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