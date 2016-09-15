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
            url: "/projects/" + currentProject + "/modelling",
            data: JSON.stringify({ metamodel:  window.pallet,  model: JSON.stringify(model) }),
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

    Projects.prototype.getCellMetamodelFromDslMetamodel = function (componentId) {
        return window.dslMetamodel.filter(function(cell) { return cell.component.id == componentId })[0];
    };


    return new Projects();
});