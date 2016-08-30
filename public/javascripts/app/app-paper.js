define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "app-views/factory/attributes-view-factory", "controllers/components"],
    function (_, joint, Transform, componentFactory, attributesViewFactory, Components) {

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

                        return linkRestriction == null || _.contains(linkRestriction.targets, cellViewT.model.get('component').id);
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
                var model = Components.getLocalComponentById(componentId);

                var component = componentFactory(model, position);
                this.model.addCell(component);
            }
        });

        return Paper;
    });