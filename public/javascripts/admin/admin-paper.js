define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "admin-views/factory/attributes-view-factory", "controllers/pallet"],
    function (_, joint, Transform, componentFactory, attributesViewFactory, Pallet) {

        var Paper = joint.dia.Paper.extend({
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 1,
                markAvailable: true
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
                var attributesView = attributesViewFactory(cellView, {changeComponentId: this.options.changeComponentId});
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