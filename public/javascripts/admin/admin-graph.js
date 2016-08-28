define(["underscore", "joint", "controller/components"], function (_, joint, Components) {

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
                    // Update metadata of element changed
                    Components.update(cell.toJSON());
                }
            });

            this.on('change:source', function (link) {
                var source = this.getSourceOf(link);

                if (source) {
                    link.prop('source/element', source.attributes.component.id);
                } else {
                    link.prop('source/element', null);
                }

                var linksWithTheSameType = this.getLinksWithTheSameTypeOf(link);
                var sources = new Set(this.getSourcesElementOf(linksWithTheSameType));
                this.updateSourcesOfLinks(sources, linksWithTheSameType);

                // Update metadata of source
                Components.update(link.toJSON());
            });

            this.on('change:target', function (link) {
                var source = this.getSourceOf(link);
                var target = this.getTargetOf(link);

                if (source) {
                    var linkComponentId = link.attributes.component.id;
                    var restrictionsOfSourceForLink = source.attributes.restrictions.links[linkComponentId];
                    var nodesWithTheSameType = this.getNodesWithTheSameTypeOf(source);
                    var targets = new Set();

                    if (restrictionsOfSourceForLink) {
                        targets = new Set(restrictionsOfSourceForLink.targets);
                    }

                    if (target) {
                        link.prop('target/element', target.attributes.component.id);
                        targets.add(target.attributes.component.id);
                        this.updateTargetsOfNodes(targets, nodesWithTheSameType, linkComponentId);
                    } else {
                        link.prop('target/element', null);
                        targets = new Set(this.getTargetsOfElementForLink(source, linkComponentId));
                        this.updateTargetsOfNodes(targets, nodesWithTheSameType, linkComponentId);
                    }

                    // Update metadata of source
                    Components.update(source.toJSON());
                }
            });
        },

        addCell: function (cell, options) {

            if (!cell.isLink() && this.hasOtherComponentOfSameTypeOf(cell)) {
                return; // do not add more than one element of same type in this graph, unless is link
            }

            // Always add null to the sources of the link when it is added to the graph
            // because when we drop the link in the paper it is attached to no source
            if (cell.isLink()) {
                var sources = new Set(cell.attributes.restrictions.sources);
                sources.add(null);
                cell.prop("restrictions/sources", Array.from(sources), {trigger: true});

                var linksOfSameType = this.getLinksWithTheSameTypeOf(cell);
                this.updateSourcesOfLinks(sources, linksOfSameType);
            }

            return joint.dia.Graph.prototype.addCell.call(this, cell, options);
        },

        updateTargetsOfNodes: function (targets, nodes, linkId) {
            nodes.forEach(function (node) {
                delete node.attributes.restrictions.links[linkId];

                if (targets.size != 0) {
                    node.prop("restrictions/links/" + linkId + "/targets", Array.from(targets));
                }
            });
        },

        updateSourcesOfLinks: function (sources, links) {
            links.forEach(function (l) {
                delete l.attributes.restrictions.sources;
                l.prop("restrictions/sources", Array.from(sources));
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
                return l.get('source').element
            })
        },

        // filter all links from the graph with the same component.id of 'link' and that has the
        // same link.source of component
        getTargetsOfElementForLink: function (element, linkComponentId) {
            return this.getLinks()
                .filter(function (link) {
                    return link.attributes.component.id == linkComponentId
                        && link.get('source').element == element.attributes.component.id;
                })
                .map(function (link) {
                    return link.attributes.target.element;
                })
                .filter(function (targetElement) {
                    return targetElement != null
                });
        },

        handleLinkDeletion: function (link) {
            // update sources of link
            var linksWithTheSameType = this.getLinksWithTheSameTypeOf(link);

            if (linksWithTheSameType.length != 0) {
                var sources = new Set(this.getSourcesElementOf(linksWithTheSameType));
                this.updateSourcesOfLinks(sources, linksWithTheSameType);

                // update metadata of link
                Components.update(linksWithTheSameType[0].toJSON());
            } else {
                delete link.attributes.restrictions.sources;
                link.prop("restrictions/sources", [null]);
                Components.update(link.toJSON());
            }

            var source = this.getSourceOf(link);

            // update targets of source
            if (source) {
                var linkComponentId = link.attributes.component.id;
                var nodesWithTheSameType = this.getNodesWithTheSameTypeOf(source);
                var targets = new Set(this.getTargetsOfElementForLink(source, linkComponentId));
                this.updateTargetsOfNodes(targets, nodesWithTheSameType, linkComponentId);

                // Update metadata of source
                Components.update(source.toJSON());
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

                // update metadata of element
                Components.update(nodesSameType[0].toJSON());
            } else {
                delete element.attributes.restrictions.links;
                element.prop("restrictions/links", {});
                Components.update(element.toJSON());
            }
        },

        hasOtherComponentOfSameTypeOf: function(element) {
            return this.getElements().filter(function (e) {
                    return e.attributes.component.id == element.attributes.component.id
                }).length != 0;
        }
    });

    return AdminGraph;
});