define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "app-views/factory/attributes-view-factory", "controllers/pallet"],
    function (_, joint, Transform, componentFactory, attributesViewFactory, Pallet) {

        var Paper = joint.dia.Paper.extend({
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 1,
                markAvailable: true,

                validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

                    if (end == 'source') {
                        var sources = linkView.model.get('restrictions').sources;

                        return _.contains(sources, cellViewS.model.get('component').id) || _.contains(sources, null);

                    } else if (linkView.model.get('source').id) {

                        var source = this.model.getCell(linkView.model.get('source').id);
                        var linkComponentId = linkView.model.get('component').id;
                        var linkRestriction = source.attributes.restrictions.links[linkComponentId];

                        // permit connection if there is no restriction
                        if (linkRestriction == null) {
                            return true;
                        }

                        var targetRestriction = linkRestriction.targets.filter(function (target) {
                            return target.id == cellViewT.model.get('component').id;
                        })[0];

                        var quantityOfLinksAlreadyConnected =
                            this.model.getQuantityOfConnectedLinksBetweenNodes(linkComponentId, source, cellViewT.model);

                        return targetRestriction && quantityOfLinksAlreadyConnected < targetRestriction.quantity;
                    }

                    return false;
                }
            }),
            render: function () {
                var self = this;

                this.on('cell:pointerdown add:cell', function (cellView) {
                    self.renderTransform(cellView);
                    self.renderAttributes(cellView);
                });

                this.$el.droppable({
                    accept: ".component-item",
                    drop: function (event, ui) {
                        self.drop(event, ui);
                    }
                });

                return this;
            },

            renderView: function (cell) {
                var renderedView = joint.dia.Paper.prototype.renderView.call(this, cell);
                renderedView.$el.addClass(cell.attributes.component.id);
                this.trigger('add:cell', renderedView);
                return renderedView;
            },

            renderTransform: function (cellView) {
                if (cellView.model instanceof joint.dia.Link) {
                    this.trigger('freetransform:create');
                    return;
                }

                var freeTransform = new Transform({cellView: cellView});
                freeTransform.render();
            },

            renderAttributes: function (cellView) {
                var attributesView = attributesViewFactory(cellView);
                window.east.renderAttributes(attributesView);
            },

            drop: function (event, ui) {
                var position = this.clientToLocalPoint({x: ui.position.left, y: ui.position.top});
                var componentId = $(ui.helper).data("component-id");
                var cellMetamodel = Pallet.getCellMetamodelByComponentId(componentId);

                var cell = componentFactory(cellMetamodel, position);
                this.model.addCell(cell);
            }
        });

        return Paper;
    });