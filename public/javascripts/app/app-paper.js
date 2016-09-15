define(["underscore", "joint", "custom/transform", "views/factory/component-factory",
        "app-views/factory/attributes-view-factory", "controllers/pallet", "custom/pnotify-bootstrap"],
    function (_, joint, Transform, componentFactory, attributesViewFactory, Pallet, notify) {

        var Paper = joint.dia.Paper.extend({
            options: _.extend(joint.dia.Paper.prototype.options, {
                height: 2000,
                width: 2000,
                gridSize: 1,
                markAvailable: true,

                validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                    if (end == 'source') {
                        return this.model.isSourceConnectionValid(linkView.model, cellViewS.model);
                    } else if (linkView.model.get('source').id) {
                        return this.model.isTargetConnectionValid(linkView.model, cellViewT.model);
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

                this.on('cell:pointerup', function (cellView) {
                    if (cellView.model.isLink()) {
                        if (cellView._arrowhead == "source") {
                            this.updateSources(cellView.model);
                        } else {
                            this.updateTargets(cellView.model);
                        }
                    }
                });

                this.$el.droppable({
                    accept: ".component-item",
                    drop: function (event, ui) {
                        self.drop(event, ui);
                    }
                });

                return this;
            },

            updateSources: function (link) {
                var point = {x: link.get("source").x, y: link.get("source").y};
                var elementBelow = this.model.getElements().find(function (cell) {
                    return cell.getBBox().containsPoint(point);
                });

                if (elementBelow) {
                    notify("confirmation", 'This operation is not permitted.' +
                        ' Do you want to change the metamodel to permit?').get()
                        .on('pnotify.confirm', function () {
                            link.prop("source", {id: elementBelow.id});

                            var linkComponentId = link.attributes.component.id;
                            var linkMetamodel = Pallet.getCellMetamodelByComponentId(linkComponentId);
                            var sources = new Set(linkMetamodel.restrictions.sources);
                            sources.add(elementBelow.attributes.component.id);

                            // update metamodel
                            linkMetamodel.restrictions.sources = Array.from(sources);
                            Pallet.updateMetamodel(linkMetamodel);
                        });
                }
            },

            updateTargets: function (link) {
                var source = this.model.getCell(link.get('source').id);

                if (source) {
                    var point = {x: link.get("target").x, y: link.get("target").y};
                    var elementBelow = this.model.getElements().find(function (cell) {
                        return cell.getBBox().containsPoint(point);
                    });

                    if (elementBelow) {
                        notify("confirmation", 'This operation is not permitted.' +
                            ' Do you want to change the metamodel to permit?').get()
                            .on('pnotify.confirm', function () {

                                link.prop("target", {id: elementBelow.id});

                                // Update metamodel
                                var linkId = link.attributes.component.id;
                                var sourceMetamodel = Pallet.getCellMetamodelByComponentId(source.attributes.component.id);
                                var linkRestriction = sourceMetamodel.restrictions.links[linkId];

                                // Update only if there is a restriction
                                if (linkRestriction) {
                                    var targetRestrictionIndex = linkRestriction.targets.findIndex(function (target) {
                                        return target.id == elementBelow.get('component').id;
                                    });

                                    // If there is a restrictions already, just increment the quantity
                                    // else create a target with a quantity of 1
                                    if (targetRestrictionIndex != -1) {
                                        var targetRestriction = linkRestriction.targets[targetRestrictionIndex];
                                        targetRestriction.quantity = targetRestriction.quantity + 1;
                                        linkRestriction.targets[targetRestrictionIndex] = targetRestriction;
                                        sourceMetamodel.restrictions.links[linkId] = linkRestriction;
                                    } else {
                                        var targets = new Set(linkRestriction.targets);
                                        targets.add({id: elementBelow.attributes.component.id, quantity: 1});

                                        sourceMetamodel.restrictions.links[linkId] = {targets: Array.from(targets)};
                                    }

                                    Pallet.updateMetamodel(sourceMetamodel);
                                }
                            });
                    }
                }
            },

            renderView: function (cell) {
                var renderedView = joint.dia.Paper.prototype.renderView.call(this, cell);
                renderedView.$el.addClass(cell.attributes.component.id);

                this.model.validateBasedOnDslMetamodel(cell);

                if (cell.prop("invalid")) {
                    renderedView.$el.css("opacity", "0.2");
                }

                cell.on("change:invalid", function (model, invalid, options) {
                    if (invalid) {
                        renderedView.$el.css("opacity", "0.2");
                    } else {
                        renderedView.$el.css("opacity", "1");
                    }
                });

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