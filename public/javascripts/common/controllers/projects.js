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

    Projects.prototype.isRemoteMetamodelDifferent = function () {
        var response = null;
        $.ajax({
            type: "POST",
            data: JSON.stringify({metamodel: window.pallet}),
            contentType: "application/json",
            async: false,
            url: "/projects/" + currentProject + "/is-metamodel-different",
            success: function (res) {
                response = res;
            }
        });

        return response;
    };

    Projects.prototype.rollbackToDslMetamodel = function (successCallback, errorCallback) {
        var graphBefore = window.graph.toJSON();
        window.graph.getCells().filter(function (cell) {
            return cell.get("invalid");
        }).forEach(function (cell) {
            cell.remove();
        });

        var newModel = window.graph.toJSON();

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/projects/" + currentProject + "/metamodel-rollback",
            data: JSON.stringify({ model: JSON.stringify(newModel) }),
            success: function () {
                if (successCallback) {
                    successCallback.call();
                }
            },
            error: function (res) {
                if (errorCallback) {
                    errorCallback.call(this, res);
                }
                window.graph.addCells(graphBefore.cells);
            }
        });
    };

    Projects.prototype.createSolicitation = function (title, description, successCallback, errorCallback) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/projects/" + currentProject + "/solicitation",
            data: JSON.stringify({title: title, description: description}),
            success: function () {
                if (successCallback) {
                    successCallback.call();
                }
            },
            error: function (res) {
                if (errorCallback) {
                    errorCallback.call(this, res);
                }
            }
        });
    };

    Projects.prototype.getCellMetamodelFromDslMetamodel = function (componentId) {
        return window.dslMetamodel.filter(function (cell) {
            return cell.component.id == componentId
        })[0];
    };

    return new Projects();
});