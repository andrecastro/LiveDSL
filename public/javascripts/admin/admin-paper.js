define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "views/factory/attributes-view-factory", "controller/components"],
    function (_, joint, Transform, componentFactory, attributesViewFactory, Components) {

        var Paper = joint.dia.Paper.extend({
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 15,
                drawGrid: {color: '#BBBBBB', thickness: 1},
                markAvailable: true,
                snapLinks: { radius: 75 },

                validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                    //console.log(cellViewS);
                    //console.log(magnetS);
                    //console.log(cellViewT);
                    //console.log(magnetT);
                    //console.log(end);
                    //console.log(linkView);
                    //cellViewS.model.attributes.component.id == "basic-node";
                    return true;
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