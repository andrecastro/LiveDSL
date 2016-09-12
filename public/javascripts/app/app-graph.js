define(["joint"], function (joint) {

    var AdminGraph = joint.dia.Graph.extend({

        initialize: function (attrs, opt) {
            joint.dia.Graph.prototype.initialize.call(this, attrs, opt);


            this.on('change:source', function (link) {
                var source = this.getCell(link.get('source').id);
                if (source) {
                    link.prop('sourceElement', source.attributes.component.id);
                } else {
                    link.prop('sourceElement', null);
                }
            });

            this.on('change:target', function (link) {
                var target = this.getCell(link.get('target').id);
                if (target) {
                    link.prop('targetElement', target.attributes.component.id);
                } else {
                    link.prop('targetElement', null);
                }
            });
        },

        addCell: function (cell, options) {
            if (!cell.isLink() && this.hasExceededPermittedNumberOfComponents(cell)) {
                return; // TODO ask if user want to add more than the permitted
            }

            return joint.dia.Graph.prototype.addCell.call(this, cell, options);
        },

        hasExceededPermittedNumberOfComponents: function (element) {
            return this.getElements().filter(function (e) {
                    return e.attributes.component.id == element.attributes.component.id
                }).length + 1 > element.attributes.restrictions.quantityOnGraph;
        },

        getQuantityOfConnectedLinksBetweenNodes: function (linkId, source, target) {
            var links = this.getConnectedLinks(source, {outbound: true});
            var currentLinks = links.filter(function (link) {
                return link.attributes.component.id == linkId &&
                    link.get('targetElement') == target.attributes.component.id;
            });

            return currentLinks.length;
        }

    });

    return AdminGraph;
});