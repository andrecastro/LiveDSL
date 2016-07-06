define(["backbone", "underscore", "joint"],
    function (Backbone, _, joint) {

        // Maybe this graph I will need to get it dynamically
        // probably from the server
        var graph = new joint.dia.Graph;

        var Center = joint.dia.Paper.extend({
            el: $("#center"),
            model: graph,
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                model: graph,
                gridSize: 15,
                drawGrid: { color: '#BBBBBB', thickness: 1 }
            }),

            render: function() {
                var self = this;
                this.$el.droppable({
                    accept: ".component-item",
                    drop: function(event, ui) {
                        self.drop(event, ui);
                    }
                });
            },

            drop: function(event, ui) {
                var localPoint = this.clientToLocalPoint({ x: ui.position.left, y: ui.position.top });
                var rect = new joint.shapes.basic.Rect({
                    position: { x: localPoint.x, y: localPoint.y },
                    size: { width: 100, height: 30 },
                    attrs: { rect: { fill: 'blue' }, text: { text: $(ui.helper).data('title'), fill: 'white' }}
                });

                this.model.addCells([rect]);
            }
        });


        return Center;
    });
