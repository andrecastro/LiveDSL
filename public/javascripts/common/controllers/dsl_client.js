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

    DslClient.prototype.updateInfo = function(pallet, modelExample, successCallback, errorCallback) {
        var url = "/admin/dsls/" + currentDsl + "/update-info";

        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: url,
            data: JSON.stringify({ pallet:  pallet,  modelExample: JSON.stringify(modelExample) }),
            success: function() {
                if (successCallback) {
                    successCallback.call();
                }
            },
            statusCode: {
                400: function(res) {
                    if (errorCallback) {
                        errorCallback.call(this, res);
                    }
                }
            }
        });
    };

    DslClient.prototype.saveCellMetamodel = function (cellMetamodel, successCallback, errorCallback) {
        var url = "/admin/dsls/" + currentDsl + "/cell-metamodel";

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: url,
            data: JSON.stringify({ metamodel:  cellMetamodel }),
            success: function() {
                if (successCallback) {
                    successCallback.call();
                }
            },
            statusCode: {
                400: function(res) {
                    if (errorCallback) {
                        errorCallback.call(this, res);
                    }
                }
            }
        });
    };

    return new DslClient();
});