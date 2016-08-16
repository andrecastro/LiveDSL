define(["backbone", "underscore", "joint", "custom/transform", "views/factory/component-factory",
        "views/factory/attributes-view-factory"],
    function (Backbone, _, joint, FreeTransform, componentFactory, attributesViewFactory) {

        var Center = joint.dia.Paper.extend({
            el: $("#center"),
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 15,
                drawGrid: { color: '#BBBBBB', thickness: 1 }
            }),

            render: function() {
                var self = this;

                this.on('cell:pointerdown add:cell', function(cellView) {
                    self.renderTransform(cellView);
                    self.renderAttributes(cellView);
                });

                this.$el.droppable({
                    accept: ".component-item",
                    drop: function(event, ui) {
                        self.drop(event, ui);
                    }
                });
            },

            renderView: function(cell) {
                var renderedView = joint.dia.Paper.prototype.renderView.call(this, cell);
                this.trigger('add:cell', renderedView);
                return renderedView;
            },

            renderTransform: function(cellView) {
                if (cellView.model instanceof joint.dia.Link) return;

                var freeTransform = new FreeTransform({ cellView: cellView });
                freeTransform.render();
            },

            renderAttributes: function(cellView) {
                var attributesView = attributesViewFactory(cellView);
                $("#east-content").html(attributesView.render().el);
            },

            drop: function(event, ui) {
                var position = this.clientToLocalPoint({ x: ui.position.left, y: ui.position.top });
                var type = $(ui.helper).data("type");
                var element = $(ui.helper).data("element");

                var component = componentFactory(type, element, position);
                this.model.addCell(component);
            }
        });

        return Center;
    });
