define(["jquery"], function ($) {

    function Solicitations() {
    }

    Solicitations.prototype.get = function () {
        var response = null;
        $.ajax({
            url: "/admin/solicitations/" + currentSolicitation,
            async: false,
            success: function (res) {
                response = res;
            }
        });

        return response;
    };

    Solicitations.prototype.saveModel = function (model, successCallback, errorCallback) {
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "/projects/" + currentProject + "/modelling",
            data: JSON.stringify({metamodel: window.pallet, model: JSON.stringify(model)}),
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

    return new Solicitations();
});