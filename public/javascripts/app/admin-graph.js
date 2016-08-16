define(["underscore", "joint"], function(_, joint) {
    var AdminGraph = joint.dia.Graph.extend({

        addCell: function(cell, options) {
            if (this.getCells().length > 0) {
                return this;
            }

            return joint.dia.Graph.prototype.addCell.call(this, cell, options);
        }

    });

    return AdminGraph;
});