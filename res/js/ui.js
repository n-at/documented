(function() {

    var ICON_OPENED = 'glyphicon-menu-down';
    var ICON_CLOSED = 'glyphicon-menu-right';

    $(function() {
        styleTables();
        responsiveImages();
        setupMenu();

        sidebarCollapserBinding();
    });

    function styleTables() {
        $('.documented-content table').addClass('table');
    }

    function responsiveImages() {
        $('.documented-content img').addClass('img-responsive');
    }

    function setupMenu() {
        var $menuWrapper = $('.documented-menu-wrapper');
        var $subMenuTitles = $menuWrapper.find('.sub-menu-title');

        var setIcon = function(marker) {
            marker.addClass('glyphicon ' + ICON_CLOSED);
        };

        var toggleIcon = function(marker) {
            marker.toggleClass(ICON_CLOSED + ' ' + ICON_OPENED);
        };

        var $subMenuMarkers = $subMenuTitles.find('span.menu-marker');

        //hide sub menus
        $subMenuMarkers.each(function() {
            var $this = $(this);
            setIcon($this);
            $this.parent().siblings('.documented-sub-menu').hide();
        });

        //show current menu items
        $('.documented-sub-menu .sub-menu-title.menu-item-current')
            .children('.menu-marker')
            .each(function() {
                var $this = $(this);
                toggleIcon($this);
                $this.parent().siblings('.documented-sub-menu').show();
            });

        //marker click handler
        $subMenuMarkers.click(function() {
            var $this = $(this);
            toggleIcon($this);
            $this.parent().siblings('.documented-sub-menu').slideToggle();
        });

        $menuWrapper.show();
    }

    function sidebarCollapserBinding() {
        $('.documented-sidebar-collapser').click(function() {
            $('.documented-sidebar-collapsible').toggleClass('sidebar-collapsed');
        });
    }

})();
