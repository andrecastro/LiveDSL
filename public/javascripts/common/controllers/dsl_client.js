define(["jquery"], function ($) {

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

    DslClient.prototype.updateInfo = function(components, metadata, successCallback, errorCallback) {
        var url = "/admin/dsls/" + currentDsl + "/update-info";

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url,
            data: JSON.stringify({ components:  components,  metadata: JSON.stringify(metadata) }),
            success: function() {
                if (successCallback) {
                    successCallback.call();
                }
            },
            statusCode: {
                400: function(res) {
                    if (errorCallback) {
                        errorCallback.call(res);
                    }
                }
            }
        });
    };

    return new DslClient();
});