require(["/javascripts/config.js"], function () {
    require(["custom/pnotify-bootstrap", "bootstrap-ui"],
        function (notify) {
            $('select').select2();

            $(".remove").on("click", function () {
                var formId = $(this).data("form-id");
                notify("confirmation", 'Are you sure?').get().on('pnotify.confirm', function () {
                    $(formId).submit();
                });

                return false;
            });
        });
});

