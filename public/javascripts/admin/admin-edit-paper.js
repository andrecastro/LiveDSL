define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "views/factory/attributes-view-factory"],
    function (_, joint, Transform, componentFactory, attributesViewFactory) {

        var Paper = joint.dia.Paper.extend({
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 15,
                drawGrid: {color: '#BBBBBB', thickness: 1}
            }),

            render: function () {
                var self = this;

                this.on('cell:pointerdown add:cell', function (cellView) {
                    self.renderTransform(cellView);
                    self.renderAttributes(cellView);
                });
            },

            renderView: function (cell) {
                var renderedView = joint.dia.Paper.prototype.renderView.call(this, cell);
                this.trigger('add:cell', renderedView);
                return renderedView;
            },

            renderTransform: function (cellView) {
                if (cellView.model instanceof joint.dia.Link) return;

                var freeTransform = new Transform({ cellView: cellView, closable: false });
                freeTransform.render();
            },

            renderAttributes: function (cellView) {
                var attributesView = attributesViewFactory(cellView);
                window.east.renderAttributes(attributesView);
            }
        });

        return Paper;
    });