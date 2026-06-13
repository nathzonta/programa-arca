$(document).ready(function () {
    inicializarSidebar();
});

function inicializarSidebar() {
    var $sidebar = $('#sidebar');
    var $menuToggle = $('#menu-toggle');

    $menuToggle.on('click', function () {
        $sidebar.toggleClass('open');
    });

    $('.sidebar-menu-toggle').on('click', function () {
        var menu = $(this).data('menu');
        var $submenu = $('#submenu-' + menu);
        var $menuItem = $(this).closest('.sidebar-menu-item');

        $menuItem.toggleClass('active');
        $submenu.toggleClass('open');
    });

    $(document).on('click', function (e) {
        if (window.innerWidth <= 992 &&
            $sidebar.hasClass('open') &&
            !$sidebar.is(e.target) &&
            !$.contains($sidebar[0], e.target) &&
            e.target !== $menuToggle[0]) {
            $sidebar.removeClass('open');
        }
    });
}
