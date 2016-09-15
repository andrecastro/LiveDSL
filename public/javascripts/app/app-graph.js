define(["joint", "underscore", "custom/pnotify-bootstrap", "controllers/pallet", "controllers/projects"],
    function (joint, _, notify, Pallet, Projects) {

        var AdminGraph = joint.dia.Graph.extend({

            initialize: function (attrs, opt) {
                joint.dia.Graph.prototype.initialize.call(this, attrs, opt);

                this.on('change:source', function (link) {
                    var source = this.getCell(link.attributes.source.id);

                    if (source) {
                        link.prop('sourceElement', source.attributes.component.id);
                    } else {
                        link.prop('sourceElement', null);
                    }

                    this.validateBasedOnDslMetamodel(link);
                });

                this.on('change:target', function (link) {
                    var target = this.getCell(link.attributes.target.id);

                    if (target) {
                        link.prop('targetElement', target.attributes.component.id);
                    } else {
                        this.makeOtherLinkWithSameTypeBeValid(link);
                        link.prop('targetElement', null);
                    }

                    this.validateBasedOnDslMetamodel(link);
                });

                this.on('remove', function (cell, paper, options) {
                    if (cell.isLink()) {
                        this.makeOtherLinkWithSameTypeBeValid(cell);
                    }
                });
            },

            addCell: function (cell, options) {

                if (!(cell instanceof Backbone.Model)) {
                    cell.attributes = cell;
                }

                if (!this.isLink(cell) && this.hasExceededPermittedNumberOfComponents(cell)) {
                    var graph = this;

                    notify("confirmation", 'You have exceeded the number of permitted components with this type.' +
                        ' Do you want to change the metamodel to permit one more?').get()
                        .on('pnotify.confirm', function () {
                            var cellMetamodel = Pallet.getCellMetamodelByComponentId(cell.attributes.component.id);
                            cellMetamodel.restrictions.quantityOnGraph = cellMetamodel.restrictions.quantityOnGraph + 1;

                            Pallet.updateMetamodel(cellMetamodel);
                            graph.addCell(cell, options);
                        });

                    return;
                }

                if (this.isLink(cell)) {
                    this.setCellAsInvalid(cell);
                }

                if (!(cell instanceof Backbone.Model)) {
                    delete cell.attributes;
                }

                return joint.dia.Graph.prototype.addCell.call(this, cell, options);
            },

            hasExceededPermittedNumberOfComponents: function (element) {
                var componentId = element.attributes.component.id;
                var elementMetamodel = Pallet.getCellMetamodelByComponentId(componentId);
                return this.getQuantityOfElementsWithSameId(componentId) + 1 > elementMetamodel.restrictions.quantityOnGraph;
            },

            getQuantityOfElementsWithSameId: function (componentId) {
                return this.getElements().filter(function (e) {
                    return e.attributes.component.id == componentId;
                }).length;
            },

            getQuantityOfConnectedLinksBetweenNodes: function (linkId, source, target) {
                var links = this.getConnectedLinks(source, {outbound: true});
                var currentLinks = links.filter(function (link) {
                    return link.attributes.component.id == linkId &&
                        link.attributes.targetElement == target.attributes.component.id;
                });

                return currentLinks.length;
            },

            validateBasedOnDslMetamodel: function (cell) {
                var componentId = cell.attributes.component.id;
                var cellMetamodel = Projects.getCellMetamodelFromDslMetamodel(componentId);

                if (!this.isLink(cell)) {
                    var permittedQuantity = cellMetamodel.restrictions.quantityOnGraph;
                    var quantitySameElementOnGraph = this.getQuantityOfElementsWithSameId(componentId);

                    this.removeInvalidAttribute(cell);

                    if (quantitySameElementOnGraph > permittedQuantity) {
                        this.setCellAsInvalid(cell);
                    }
                } else {
                    var sourceId = cell.attributes.source.id;
                    var targetId = cell.attributes.target.id;

                    if (sourceId) {
                        var source = this.getCell(sourceId);
                        var target = this.getCell(targetId);

                        this.removeInvalidAttribute(cell);

                        if (!this.isSourceConnectionValidOnDsl(cell, source) || !targetId
                            || !this.isTargetConnectionValidOnDsl(cell, target, true)) {
                            this.setCellAsInvalid(cell);
                        }
                    } else {
                        this.setCellAsInvalid(cell);
                    }
                }
            },

            isSourceConnectionValid: function (link, source) {
                var linkMetamodel = Pallet.getCellMetamodelByComponentId(link.attributes.component.id);
                return this._isSourceConnectionValid(linkMetamodel, source);
            },

            isSourceConnectionValidOnDsl: function (link, source) {
                var linkMetamodel = Projects.getCellMetamodelFromDslMetamodel(link.attributes.component.id);
                return this._isSourceConnectionValid(linkMetamodel, source);
            },

            _isSourceConnectionValid: function (linkMetamodel, source) {
                var sources = linkMetamodel.restrictions.sources;
                return _.contains(sources, source.attributes.component.id) || _.contains(sources, null);
            },

            isTargetConnectionValid: function (link, target) {
                var source = this.getCell(link.attributes.source.id);
                var sourceMetamodel = Pallet.getCellMetamodelByComponentId(source.attributes.component.id);
                return this._isTargetConnectionValid(link, sourceMetamodel, target);
            },

            isTargetConnectionValidOnDsl: function (link, target, quantityReduced) {
                var source = this.getCell(link.attributes.source.id);
                var sourceMetamodel = Projects.getCellMetamodelFromDslMetamodel(source.attributes.component.id);
                return this._isTargetConnectionValid(link, sourceMetamodel, target, quantityReduced);
            },

            _isTargetConnectionValid: function (link, sourceMetamodel, target, quantityReduced) {
                var source = this.getCell(link.attributes.source.id);
                var linkComponentId = link.attributes.component.id;
                var linkRestriction = sourceMetamodel.restrictions.links[linkComponentId];

                // permit connection if there is no restriction
                if (linkRestriction == null) {
                    return true;
                }

                var targetRestriction = linkRestriction.targets.find(function (targetRestriction) {
                    return targetRestriction.id == target.attributes.component.id;
                });

                var quantityOfLinksAlreadyConnected =
                    this.getQuantityOfConnectedLinksBetweenNodes(linkComponentId, source, target);

                if (quantityReduced) {
                    return targetRestriction && quantityOfLinksAlreadyConnected - 1 < targetRestriction.quantity;
                } else {
                    return targetRestriction && quantityOfLinksAlreadyConnected < targetRestriction.quantity;
                }
            },

            makeOtherLinkWithSameTypeBeValid: function (link) {
                var source = this.getCell(link.attributes.source.id);
                var oldTargetElement = link.prop('targetElement');

                if (source && oldTargetElement && !link.prop("invalid")) {
                    var links = this.getConnectedLinks(source, {outbound: true});

                    var invalidLinkSameType = links.find(function (connectedLink) {
                        return connectedLink.attributes.component.id == link.attributes.component.id
                            && connectedLink.attributes.targetElement == oldTargetElement
                            && connectedLink.attributes.invalid;
                    });

                    if (invalidLinkSameType) {
                        this.removeInvalidAttribute(invalidLinkSameType);
                    }
                }
            },

            isLink: function (cell) {
                if (cell instanceof Backbone.Model) {
                    return cell.isLink();
                } else {
                    return cell.type == "link";
                }
            },

            setCellAsInvalid: function (cell) {
                if (cell instanceof Backbone.Model) {
                    cell.prop("invalid", true);
                } else {
                    cell.attributes.invalid = true;
                }
            },

            removeInvalidAttribute: function (cell) {
                if (cell instanceof Backbone.Model) {
                    cell.unset("invalid");
                } else {
                    delete cell.attributes.invalid;
                }
            }

        });

        return AdminGraph;
    });