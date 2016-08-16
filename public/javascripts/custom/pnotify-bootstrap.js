define(["pnotify", "pnotify.buttons"], function(PNotify) {
    PNotify.prototype.options.styling = "bootstrap3";
    return function(type, text) {
        switch (type) {
            case 'success':
                return new PNotify({
                    title: 'Success',
                    text: text,
                    type: 'success',
                    addclass: "stack-bar-top",
                    width: "90%",
                    delay: 1000
                });
            case 'error':
                return new PNotify({
                    title: 'Oh No!',
                    text: text,
                    type: 'error',
                    addclass: "stack-bar-top",
                    width: "90%",
                    delay: 3000
                });
        }
    };
});