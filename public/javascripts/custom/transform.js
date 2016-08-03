define(["backbone", "underscore", "joint", "geometry", "text!templates/transform-template.html"],
    function (Backbone, _, joint, g, transform_template) {
        var FreeTransform = Backbone.View.extend({

            className: 'free-transform',
            template: _.template(transform_template),

            events: {
                'mousedown .resize': 'startResizing',
                'touchstart .resize': 'startResizing',
                'click .close': 'removeCell'
            },

            options: {
                directions: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
            },

            initialize: function (options) {
                this.options = _.extend({}, _.result(this, 'options'), options || {});
                this.cell = this.options.cellView.model;
                this.paper = this.options.cellView.paper;
                this.graph = this.options.cellView.paper.model;

                _.bindAll(this, 'update', 'remove', 'pointerup', 'pointermove');

                // remove a previous instance
                FreeTransform.clear(this.paper);

                // Register mouse events.
                $(document.body).on('mousemove touchmove', this.pointermove);
                $(document).on('mouseup touchend', this.pointerup);

                // Update the freeTransform when the graph is changed.
                this.listenTo(this.graph, 'all', this.update);

                // Remove the freeTransform when the model is removed.
                this.listenTo(this.graph, 'reset', this.remove);
                this.listenTo(this.cell, 'remove', this.remove);

                // Hide the freeTransform when the user clicks anywhere in the paper or a new freeTransform is created.
                this.listenTo(this.paper, 'blank:pointerdown freetransform:create', this.remove);
                this.listenTo(this.paper, 'scale translate', this.update);

                this.paper.$el.append(this.el);
            },

            render: function () {

                this.$el.html(this.template());

                // We have to use `attr` as jQuery `data` doesn't update DOM
                this.$el.attr('data-type', this.cell.get('type'));
                this.update();
            },

            removeCell: function() {
                this.cell.remove();
            },

            update: function () {
                var boundingBox = this.cell.getBBox();
                var angle = g.normalizeAngle(this.cell.get('angle') || 0);
                var rotateFunction = 'rotate(' + angle + 'deg)';

                this.$el.css({
                    'width': boundingBox.width + 20,
                    'height': boundingBox.height + 20,
                    'left': boundingBox.x,
                    'top': boundingBox.y,
                    'transform': rotateFunction,
                    '-webkit-transform': rotateFunction,
                    '-ms-transform': rotateFunction
                });
            },

            startResizing: function (evt) {

                evt.stopPropagation();

                this.graph.trigger('batch:start', { batchName: 'resizing' });
                this.graph.trigger('change:resizing');

                // Target's data attribute can contain one of 8 positions. Each position defines the way how to
                // resize an element. Whether to change the size on x-axis, on y-axis or on both.

                var direction = $(evt.target).data('position');

                var rx = 0, ry = 0;

                _.each(direction.split('-'), function (singleDirection) {

                    rx = {'left': -1, 'right': 1}[singleDirection] || rx;
                    ry = {'top': -1, 'bottom': 1}[singleDirection] || ry;
                });

                // The direction has to be one of the 4 directions the element's resize method would accept (TL,BR,BL,TR).
                direction = {
                        'top': 'top-left',
                        'bottom': 'bottom-right',
                        'left': 'bottom-left',
                        'right': 'top-right'
                    }[direction] || direction;

                // The selector holds a function name to pick a corner point on a rectangle.
                // See object `rect` in `src/geometry.js`.
                var selector = {
                    'top-right': 'bottomLeft',
                    'top-left': 'corner',
                    'bottom-left': 'topRight',
                    'bottom-right': 'origin'
                }[direction];

                // Expose the initial setup, so `pointermove` method can access it.
                this._initial = {
                    angle: g.normalizeAngle(this.cell.get('angle') || 0),
                    resizeX: rx, // to resize, not to resize or flip coordinates on x-axis (1,0,-1)
                    resizeY: ry, // to resize, not to resize or flip coordinates on y-axis (1,0,-1)
                    selector: selector,
                    direction: direction
                };

                this._action = 'resize';

                this.startOp(evt.target);
            },

            pointermove: function (evt) {

                if (!this._action) return;

                evt = joint.util.normalizeEvent(evt);

                var clientCoords = this.paper.snapToGrid({x: evt.clientX, y: evt.clientY});
                var gridSize = this.paper.options.gridSize;

                var model = this.cell, i = this._initial;

                switch (this._action) {

                    case 'resize':

                        var currentRect = model.getBBox();

                        // The requested element's size has to be find on the unrotated element. Therefore we
                        // are rotating a mouse coordinates back (coimageCoords) by an angle the element is rotated by and
                        // with the center of rotation equals to the center of the unrotated element.
                        var coimageCoords = g.point(clientCoords).rotate(currentRect.center(), i.angle);

                        // The requested size is the difference between the fixed point and coimaged coordinates.
                        var requestedSize = coimageCoords.difference(currentRect[i.selector]());

                        // Calculate the new dimensions. `resizeX`/`resizeY` can hold a zero value if the resizing
                        // on x-axis/y-axis is not allowed.
                        var width = i.resizeX ? requestedSize.x * i.resizeX : currentRect.width;
                        var height = i.resizeY ? requestedSize.y * i.resizeY : currentRect.height;


                        // Constraint the dimensions.
                        width = width < gridSize ? gridSize : g.snapToGrid(width, gridSize);
                        height = height < gridSize ? gridSize : g.snapToGrid(height, gridSize);

                        // Resize the element only if the dimensions are changed.
                        if (currentRect.width != width || currentRect.height != height) {
                            //var position = model.get("position");
                            model.resize(width, height, {direction: i.direction});
                            //model.set("position", position);
                        }

                        break;
                }
            },

            pointerup: function (evt) {

                if (!this._action) return;

                this.stopOp();

                this.graph.trigger('batch:stop', { batchName: 'resizing' });

                delete this._action;
                delete this._initial;
            },

            remove: function (evt) {

                Backbone.View.prototype.remove.apply(this, arguments);

                $('body').off('mousemove touchmove', this.pointermove);
                $(document).off('mouseup touchend', this.pointerup);
            },

            startOp: function (el) {

                if (el) {
                    // Add a class to the element we are operating with
                    $(el).addClass('in-operation');
                    this._elementOp = el;
                }

                this.$el.addClass('in-operation');
            },

            stopOp: function () {

                if (this._elementOp) {
                    // Remove a class from the element we were operating with
                    $(this._elementOp).removeClass('in-operation');
                    delete this._elementOp;
                }

                this.$el.removeClass('in-operation');
            }
        }, {

            // removes a freetransform from a paper
            clear: function (paper) {

                paper.trigger('freetransform:create');
            }
        });

        return FreeTransform;
    });

