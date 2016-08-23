requirejs.config({
    baseUrl: "/vendor/",
    packages: [
        {
            name: 'jquery',
            location: 'jquery/dist',
            main: 'jquery.min'
        },
        {
            name: 'sizzle',
            location: 'jquery/external/sizzle/dist',
            main: 'sizzle'
        },
        {
            name: 'lodash',
            location: 'lodash-amd'
        },
        {
            name: 'text',
            location: 'text',
            main: "text"
        }
    ],
    paths: {
        "bootstrap" : "bootstrap/dist/js/bootstrap.min",
        "bootstrap-ui" : "bootstrap.ui/dist/js/bootstrap-ui.min",
        "moment": "moment/min/moment-with-locales.min",
        "bootstrap-datepicker": "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
        "select2": "select2/select2.min",
        "backbone" : "backbone/backbone-min",
        "backbone-undo": "Backbone.Undo.js/Backbone.Undo",
        "backbone-stickit": "backbone.stickit/backbone.stickit",
        "joint": "jointjs/dist/joint",
        "geometry": "jointjs/dist/geometry",
        "jquery-ui": "jquery-ui/jquery-ui",
        "pnotify": "pnotify/dist/pnotify",
        "pnotify.animate": "pnotify/dist/pnotify.animate",
        "pnotify.nonblock": "pnotify/dist/pnotify.nonblock",
        "pnotify.buttons": "pnotify/dist/pnotify.buttons",
        "pnotify.confirm": "pnotify/dist/pnotify.confirm",
        "jquery-ui-touch": "jquery-ui-touch-punch/jquery.ui.touch-punch",
        "jquery-ui-layout": "jquery-ui-layout-latest/jquery.layout-latest",
        "moment-global": "../javascripts/custom/moment-global", // makes the moment library be visible in the global scope
        "models": "/javascripts/admin/models",
        "views": "/javascripts/admin/views",
        "controller": "/javascripts/admin/controller",
        "templates": "/javascripts/admin/templates",
        "custom": "/javascripts/custom",
        "scripts": "/javascripts"
    },
    map: {
        '*': {
            // Backbone requires underscore. This forces requireJS to load lodash instead:
            'underscore': 'lodash'
        }
    },
    shim: {
        "jquery-ui-touch": {
            deps: ["jquery", "jquery-ui"]
        },
        "pnotify": {
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