requirejs.config({
    baseUrl: "/vendor/",
    packages: [
        {
            name: 'jquery',
            location: 'jquery/dist',
            main: 'jquery.min'
        }
    ],
    paths: {
        "bootstrap" : "bootstrap/dist/js/bootstrap.min",
        "bootstrap-ui" : "bootstrap.ui/dist/js/bootstrap-ui.min",
        "moment": "moment/min/moment-with-locales.min",
        "bootstrap-datepicker": "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
        "select2": "select2/select2.min",
        "jquery-ui": "jquery-ui/jquery-ui",
        "jquery-ui-touch": "jquery-ui-touch-punch/jquery.ui.touch-punch",
        "jquery-ui-layout": "jquery-ui-layout-latest/jquery.layout-latest",
        "moment-global": "../javascripts/custom/moment-global", // makes the moment library be visible in the global scope
        "scripts": "/javascripts"
    },
    shim: {
        "jquery-ui-touch": {
            deps: ["jquery", "jquery-ui"]
        },
        "jquery-ui-layout": {
            deps: ['jquery-ui-touch']
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "select2": {
            deps: ["jquery"]
        },
        "bootstrap-ui": {
            deps: ["bootstrap", "moment-global", "bootstrap-datepicker", "select2"]
        }
    }
});

require(["bootstrap-ui"],
    function () {


    });