define(["underscore", "backbone", "joint", "geometry", "text!admin-templates/cardinality-template.html"],
    function (_, Backbone, joint, g, template) {

    var CardinalityView = Backbone.View.extend({

        className: 'cardinality',
        template: _.template(template),

        initialize: function (options) {
            this.options = options;
            this.cell = this.options.cellView.model;
            this.cellView = this.options.cellView;
            this.paper = this.options.cellView.paper;
            this.graph = this.options.cellView.paper.model;

            this.listenTo(this.cell, 'remove', this.remove);
            this.listenTo(this.cell, 'change', this.render);


            if (!this.cell.isLink()) {
                this.paper.$el.append(this.el);
            }
        },

        render: function () {
            if (this.cell.isLink()) {
                this.addLabelsToLink();
            } else {
                this.renderElementView();
            }
        },

        addLabelsToLink: function () {
            if (this.cell.get("source").id && this.cell.get("target").id) {

                this.source = this.graph.getCell(this.cell.get("source").id);
                this.target = this.graph.getCell(this.cell.get("target").id);

                this.listenToOnce(this.source, "change:restrictions", this.render);

                var quantity = this.getLinkRestrictionsQuantity();
                var color = 'black';

                if (this.options.compareWithDsl && this.isTargetDifferent(quantity)) {
                    color = 'red';
                }

                this.cell.label(1, {
                    position: 0.95,
                    cardinality: true,
                    attrs: {
                        text: { fill: color,text: quantity }
                    }
                });

            } else {
                if (this.cell.prop("labels/1")) {
                    this.cell.prop("labels").splice(1, 1);
                    this.cellView.$el.find('.label[label-idx="1"]').remove();
                    this.stopListening(this.source);
                }
            }
        },

        renderElementView: function () {
            var quantity = this.cell.get("restrictions").quantityOnGraph;
            this.$el.html(this.template({value: quantity }));

            var boundingBox = this.cellView.getBBox();
            var angle = g.normalizeAngle(this.cell.get('angle') || 0);
            var rotateFunction = 'rotate(' + angle + 'deg)';

            this.$el.css({
                'width': boundingBox.width,
                'height': boundingBox.height,
                'left': boundingBox.x,
                'top': boundingBox.y,
                'transform': rotateFunction,
                '-webkit-transform': rotateFunction,
                '-ms-transform': rotateFunction,
                'color': 'black'
            });

            if (this.options.compareWithDsl && this.isQuantityDifferent()) {
                this.$el.css("color", "red");
            }
        },

        getLinkRestrictionsQuantity: function () {
            var source = this.graph.getCell(this.cell.get("source").id);
            var linkRestriction = source.get("restrictions").links[this.cell.get("component").id];

            var link = this.cell;

            var targetRestriction = linkRestriction.targets.find(function (target) {
               return target.id == link.get("targetElement");
            });

            return targetRestriction.quantity;
        },

        isQuantityDifferent: function () {
            var quantity = this.cell.get("restrictions").quantityOnGraph;
            var metamodelFromDsl = this.getMetamodelFromDsl(this.cell.get("component").id);

            if (metamodelFromDsl)
                return quantity != metamodelFromDsl.restrictions.quantityOnGraph;

            return true;
        },

        isTargetDifferent: function (quantity) {
            var source = this.graph.getCell(this.cell.get("source").id);
            var sourceMetamodel = this.getMetamodelFromDsl(source.get("component").id);

            if (!sourceMetamodel) {
                return true;
            }

            var linkRestriction = sourceMetamodel.restrictions.links[this.cell.get("component").id];
            var link = this.cell;

            if (!linkRestriction) {
                return true;
            }

            var targetRestriction = linkRestriction.targets.find(function (target) {
                return target.id == link.get("targetElement");
            });

            if (!targetRestriction) {
                return true;
            }

            return targetRestriction.quantity != quantity;
        },

        getMetamodelFromDsl: function (componentId) {
            return window.dslMetamodel.filter(function (cell) {
                return cell.component.id == componentId
            })[0];
        }
    });

    return CardinalityView;
});