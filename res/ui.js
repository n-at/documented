
$(function() {
    styleTables();
    setupMenu();
});

function styleTables() {
    $('.documented-content table').addClass('table');
}

function setupMenu() {
    var $menuWrapper = $('.documented-menu-wrapper');
    var $subMenuTitles = $menuWrapper.find('.sub-menu-title');

    var toggleIcon = function(marker) {
        marker.toggleClass('glyphicon-chevron-right glyphicon-chevron-down')
    };

    var $subMenuMarkers = $subMenuTitles.find('span.menu-marker');

    //hide sub menus
    $subMenuMarkers.each(function(index, element) {
        toggleIcon(element);
        element.parent().siblings('.documented-sub-menu').hide();
    });

    //marker click handler
    $subMenuMarkers.click(function() {
        var $this = $(this);
        toggleIcon($this);

        var $subMenu = $this.parent().siblings('.documented-sub-menu');
        $subMenu.slideToggle();
    });

    //show current menu item
    //TODO

    $menuWrapper.show();
}
