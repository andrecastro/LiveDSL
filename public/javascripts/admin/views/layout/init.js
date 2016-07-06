define(["views/layout/center", "views/layout/west", "jquery-ui-layout", "bootstrap-ui"], function(Center, West) {

    $('#main').layout({
        resizable: true,
        applyDefaultStyles: true,
        west: { size: 250 },
        east: { size: 250 },
        south: { size: 150, initClosed: true }
    });

    new Center().render();
    new West().render();

});