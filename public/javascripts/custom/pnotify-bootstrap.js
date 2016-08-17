define(["pnotify", "pnotify.buttons", "pnotify.confirm"], function (PNotify) {
    PNotify.prototype.options.styling = "bootstrap3";
    return function (type, text) {
        switch (type) {
            case 'success':
                return new PNotify({
                    title: 'Success',
                    text: text,
                    type: 'success',
                    addclass: "stack-topleft",
                    delay: 1000
                });
            case 'error':
                return new PNotify({
                    title: 'Oh No!',
                    text: text,
                    type: 'error',
                    addclass: "stack-topleft",
                    delay: 3000
                });
            case 'confirmation':
                return (new PNotify({
                    title: 'Confirmation',
                    text: text,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true,
                        buttons: [{
                            text: "Yes", addClass: "", promptTrigger: true, click: function (notice, value) {
                                notice.remove();
                                $(".ui-pnotify-modal-overlay").remove();
                                notice.get().trigger("pnotify.confirm", [notice, value]);
                            }
                        }, {
                            text: "No", addClass: "", click: function (notice) {
                                notice.remove();
                                $(".ui-pnotify-modal-overlay").remove();
                                notice.get().trigger("pnotify.cancel", notice);
                            }
                        }]
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    },
                    addclass: 'stack-modal',
                    stack: {'dir1': 'down', 'dir2': 'right', 'modal': true}
                }));
        }
    };
});