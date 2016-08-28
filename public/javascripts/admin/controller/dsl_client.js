define(["jquery", "joint"], function ($, joint) {

    function DslClient() {}

    DslClient.prototype.get = function() {
        var response = null;
        $.ajax({
            url: "/admin/dsls/" + currentDsl + "/try",
            async: false,
            success: function (res) {
                response = res;
            }
        });

        return response;
    };

    return new DslClient();
});