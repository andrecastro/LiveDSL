define(["underscore", "joint", "controllers/pallet"], function (_, joint, Pallet) {

    var AdminGraph = joint.dia.Graph.extend({
        initialize: function (attrs, opt) {
            joint.dia.Graph.prototype.initialize.call(this, attrs, opt);

            this.on('remove', function (cell, paper, options) {
                if (cell.isLink()) {
                    this.handleLinkDeletion(cell);
                } else {
                    this.handleElementDeletion(cell);
                }
            });

            this.on('change', function (cell, options) {
                if (!options.translateBy && options.trigger) {
                    // Update metamodel of cell changed
                    Pallet.updateMetamodel(cell.toJSON());
                }
            });

            this.on('change:source', function (link) {
                var source = this.getSourceOf(link);

                if (source) {
                    link.prop('sourceElement', source.attributes.component.id);
                    link.prop('oldSource', source);

                    this.updateTargets(source, link);
                } else {
                    var oldSource = link.prop('oldSource');

                    if (oldSource) {
                        this.updateTargets(oldSource, link);
                    }

                    link.prop('sourceElement', null);
                    link.prop('oldSource', null);
                }

                this.updateSources(link);
            });

            this.on('change:target', function (link) {
                var source = this.getSourceOf(link);
                var target = this.getTargetOf(link);

                if (target) {
                    link.prop('targetElement', target.attributes.component.id);
                } else {
                    link.prop('targetElement', null);
                }

                if (source) {
                    this.updateTargets(source, link);
                }
            });

            this.on('add', function(cell) {
                // Always add null to the sources of the link when it is added to the graph
                // because when we drop the link in the paper it is attached to no source
                if (cell.isLink()) {
                    this.updateSources(cell);
                }
            });
        },

        addCell: function (cell, options) {
            if (!cell.isLink() && this.hasOtherCellOfSameTypeOf(cell)) {
                return; // do not add more than one element of same type in this graph, unless is link
            }

            return joint.dia.Graph.prototype.addCell.call(this, cell, options);
        },

        toJSON: function() {
            var json = joint.dia.Graph.prototype.toJSON.call(this);

            _.each(json.cells, function(cell) {
               delete cell.oldSource;
            });

            return json;
        },

        updateTargets: function(node, link) {
            var linkComponentId = link.attributes.component.id;
            var nodesWithTheSameType = this.getNodesWithTheSameTypeOf(node);
            var targets = new Set(this.getTargetsOfElementForLink(node, linkComponentId));
            this.updateTargetsOfNodes(targets, nodesWithTheSameType, linkComponentId);

            // Update metamodel of node
            Pallet.updateMetamodel(node.toJSON());
        },

        updateTargetsOfNodes: function (targets, nodes, linkId) {
            nodes.forEach(function (node) {
                delete node.attributes.restrictions.links[linkId];

                if (targets.size != 0) {
                    node.prop("restrictions/links/" + linkId + "/targets", Array.from(targets), { updateView: true });
                }
            });
        },

        updateSources: function(link) {
            var linksWithTheSameType = this.getLinksWithTheSameTypeOf(link);
            var sources = new Set(this.getSourcesElementOf(linksWithTheSameType));
            this.updateSourcesOfLinks(sources, linksWithTheSameType);

            // Update metamodel of source
            Pallet.updateMetamodel(link.toJSON());
        },

        updateSourcesOfLinks: function (sources, links) {
            links.forEach(function (l) {
                delete l.attributes.restrictions.sources;
                l.prop("restrictions/sources", Array.from(sources), { updateView: true });
            });
        },

        getSourceOf: function (link) {
            return this.getCell(link.get('source').id);
        },

        getTargetOf: function (link) {
            return this.getCell(link.get('target').id);
        },

        getLinksWithTheSameTypeOf: function (link) {
            return this.getLinks().filter(function (l) {
                return l.attributes.component.id == link.attributes.component.id;
            });
        },

        getNodesWithTheSameTypeOf: function (node) {
            return this.getElements().filter(function (n) {
                return n.attributes.component.id == node.attributes.component.id;
            });
        },

        getSourcesElementOf: function (links) {
            return links.map(function (l) {
                return l.get('sourceElement');
            })
        },

        // filter all links from the graph with the same component.id of 'link' and that has the
        // same link.source of component
        getTargetsOfElementForLink: function (element, linkComponentId) {
            var currentTargetsIds = this.getLinks()
                .filter(function (link) {
                    return link.attributes.component.id == linkComponentId
                        && link.get('sourceElement') == element.attributes.component.id;
                })
                .map(function (link) {
                    return link.get('targetElement');
                })
                .filter(function (targetElement) {
                    return targetElement != null
                });

            var oldLinkRestriction = element.attributes.restrictions.links[linkComponentId];
            var newTargets = [];

            if (oldLinkRestriction) {
                var oldTargets = oldLinkRestriction.targets;

                currentTargetsIds.forEach(function (currentTargetId) {
                    var oldTarget = oldTargets.filter(function (oldTarget) {
                        return oldTarget.id == currentTargetId;
                    })[0];

                    if (oldTarget) {
                        newTargets.push(oldTarget);
                    } else {
                        newTargets.push({id: currentTargetId, quantity: 1});
                    }
                });
            } else {
                currentTargetsIds.forEach(function (currentTargetId) {
                    newTargets.push({id: currentTargetId, quantity: 1});
                });
            }

            return newTargets;
        },

        handleLinkDeletion: function (link) {
            // update sources of link
            var linksWithTheSameType = this.getLinksWithTheSameTypeOf(link);

            if (linksWithTheSameType.length != 0) {
                var sources = new Set(this.getSourcesElementOf(linksWithTheSameType));
                this.updateSourcesOfLinks(sources, linksWithTheSameType);

                // update metamodel of link
                Pallet.updateMetamodel(linksWithTheSameType[0].toJSON());
            } else {
                delete link.attributes.restrictions.sources;
                link.prop("restrictions/sources", [null], { updateView: true });
                Pallet.updateMetamodel(link.toJSON());
            }

            var source = this.getSourceOf(link);

            // update targets of source
            if (source) {
                this.updateTargets(source, link);
            }
        },

        handleElementDeletion: function (element) {
            var graph = this;
            var nodesSameType = graph.getNodesWithTheSameTypeOf(element);

            if (nodesSameType.length != 0) {
                Object.keys(element.attributes.restrictions.links).forEach(function (linkComponentId) {
                    var newTargetsForLink = new Set(graph.getTargetsOfElementForLink(element, linkComponentId));
                    graph.updateTargetsOfNodes(newTargetsForLink, nodesSameType, linkComponentId);
                });

                // update metamodel of element
                Pallet.updateMetamodel(nodesSameType[0].toJSON());
            } else {
                delete element.attributes.restrictions.links;
                element.prop("restrictions/links", {}, { updateView: true });
                Pallet.updateMetamodel(element.toJSON());
            }
        },

        hasOtherCellOfSameTypeOf: function (element) {
            return this.getElements().filter(function (e) {
                    return e.attributes.component.id == element.attributes.component.id
                }).length != 0;
        }
    });

    return AdminGraph;
});