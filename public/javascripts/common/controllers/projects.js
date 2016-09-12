define(["jquery"], function ($) {

    function Projects() {
    }

    Projects.prototype.get = function () {
        var response = null;
        $.ajax({
            url: "/projects/" + currentProject + "/modeling",
            async: false,
            success: function (res) {
                response = res;
            }
        });

        return response;
    };

    Projects.prototype.saveModel = function (model, successCallback, errorCallback) {

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "/projects/" + currentProject + "/save-model",
            data: JSON.stringify({model: JSON.stringify(model)}),
            success: function () {
                if (successCallback) {
                    successCallback.call();
                }
            },
            statusCode: {
                400: function (res) {
                    if (errorCallback) {
                        errorCallback.call(this, res);
                    }
                }
            }
        });
    };


    return new Projects();
});