function iniciarSelects() {
    $('.select-arca').each(function () {
        var $container = $(this);
        var selectId = $container.data('select');
        var $selectNativo = $('#' + selectId);
        var textoSelecionado = $selectNativo.find('option:selected').text();

        var labelTexto = $('label[for="' + selectId + '"]').first().text();
        var optionsHtml = labelTexto ? '<div class="select-arca-header">' + labelTexto + '</div>' : '';

        $selectNativo.find('option').each(function () {
            var $opt = $(this);
            var isSelected = $opt.prop('selected') ? ' selected' : '';
            optionsHtml += '<div class="select-arca-option' + isSelected + '" data-value="' + $opt.val() + '">' +
                $opt.text() +
                '<img class="select-arca-option-check" width="12" height="8" src="./assets/imgs/icons/select-check.svg">' +
                '</div>';
        });

        $container.html(
            '<div class="select-arca-trigger">' +
                '<span class="select-arca-selected">' + textoSelecionado + '</span>' +
                '<img width="12" height="8" src="./assets/imgs/icons/select-icon.svg">' +
            '</div>' +
            '<div class="select-arca-options">' + optionsHtml + '</div>'
        );

        var $trigger = $container.find('.select-arca-trigger');
        var $options = $container.find('.select-arca-option');

        $trigger.on('click', function (e) {
            e.stopPropagation();
            $('.select-arca.aberto').not($container).removeClass('aberto');
            $container.toggleClass('aberto');
        });

        $options.on('click', function (e) {
            e.stopPropagation();
            var valor = $(this).data('value');
            $options.removeClass('selected');
            $(this).addClass('selected');
            $trigger.find('.select-arca-selected').text($(this).text().trim());
            $selectNativo.val(valor);
            $container.removeClass('aberto');
        });
    });
}

$(document).ready(iniciarSelects);
