define(["backbone", "underscore", "views/custom/collapse-panel-view",
        "text!admin-templates/attributes/geometry.html", "text!admin-templates/attributes/text.html",
        "text!admin-templates/attributes/component.html", "text!admin-templates/attributes/restrictions-attributes.html",
        "backbone-stickit"],
    function (Backbone, _, CollapsePanelView, geometryTemplate, textTemplate, componentTemplate, restrictionsTemplate) {

        return Backbone.View.extend({
            className: "panel-group accordion-caret",

            initialize: function (options) {
                this.options = options;
                this.cellView = options.cellView;
                this.model = options.cellView.model;
                this.paper = options.cellView.paper;
                this.graph = options.cellView.paper.model;

                // this will remove other attributes
                this.paper.trigger("attributes:remove_others");

                this.listenTo(this.paper, 'blank:pointerdown attributes:remove_others', this.remove);
                this.listenTo(this.model, 'remove', this.remove);
                this.listenTo(this.model, 'change:restrictions', function(a, b, options) {
                    if (options.updateView) {
                        this.renderRestrictions();
                    }
                });
            },

            render: function () {
                this.$el.empty();
                this.renderComponentAttributes();
                this.renderTextAttributes();
                this.renderAppearance();
                this.renderGeometryAttributes();
                this.renderRestrictions();
                this.stickit();
                return this;
            },

            renderComponentAttributes: function() {
                var contentPanel = _.template(componentTemplate);
                var componentAttr = new CollapsePanelView({
                    title: "COMPONENT",
                    id: "component",
                    contentPanel: contentPanel()
                });

                this.$el.append(componentAttr.render().el);

                if (this.options.changeComponentId) {
                    this.bindInputToNestedField("#component-id", "component", "id", "STRING");
                } else {
                    this.$("#component-id").val(this.model.get("component").id);
                    this.$("#component-id").disable();
                }

                this.bindInputToNestedField("#component-friendly-name", "component", "friendlyName", "STRING");
                this.bindInputToNestedField("#component-image", "component", "image", "STRING");
                this.bindInputToNestedField("#component-description", "component", "description", "STRING");
            },

            renderTextAttributes: function() {
                var textContentPanel = _.template(textTemplate);
                var textAttr = new CollapsePanelView({
                    title: "TEXT",
                    id: "text",
                    contentPanel: textContentPanel()
                });

                this.$el.append(textAttr.render().el);

                this.bindInputToNestedField("#title", "attrs", "text/text", "STRING");
                this.bindInputToNestedField("#font-size", "attrs", "text/font-size", "STRING");
                this.bindInputToNestedField("#font-color", "attrs", "text/fill", "STRING");
            },

            renderAppearance: function() {
                // this method needs to be overwritten
            },

            renderGeometryAttributes: function () {
                var geometryContentPanel = _.template(geometryTemplate);
                var geometryAttr = new CollapsePanelView({
                    title: "GEOMETRY",
                    id: "geometry",
                    contentPanel: geometryContentPanel()
                });

                this.$el.append(geometryAttr.render().el);

                this.bindInputToNestedField("#width", "size", "width", "NUMBER");
                this.bindInputToNestedField("#height", "size", "height", "NUMBER");
            },

            renderRestrictions: function() {
                this.$("#restrictions").remove();

                var contentPanel = _.template(restrictionsTemplate);
                var restrictionsAttr = new CollapsePanelView({
                    title: "RESTRICTIONS",
                    id: "restrictions",
                    contentPanel: contentPanel(this.model.attributes.restrictions)
                });

                this.$el.append(restrictionsAttr.render().el);

                this.bindInputToNestedField("#quantity-on-graph", "restrictions", "quantityOnGraph", "POSITIVE_NUMBER");

                var links = this.model.attributes.restrictions.links;
                var attributesView = this;

                Object.keys(links).forEach(function(link) {
                    var targets = links[link].targets;
                    _.each(targets, function(target, index) {
                        attributesView.bindInputToNestedField("#" + link + "-" + target.id + "-qty", "restrictions",
                            "links/" + link + "/targets/" + index + "/quantity", "POSITIVE_NUMBER");
                    });
                });
            },

            bindInputToNestedField: function (input, filed, nestedAttribute, type) {
                this.addBinding(this.model, input, this.bindNested(filed, nestedAttribute, type));
            },

            bindNested: function (field, nestedAttribute, type) {
                return {
                    observe: field,
                    onGet: function (value, options) {
                        var model = options.view.model;
                        return model.prop(options.observe + "/" + nestedAttribute);
                    },
                    onSet: function (value, options) {
                        var model = options.view.model;
                        var correctValue = this.valueByType(type, value);
                        model.prop(options.observe + "/" + nestedAttribute, correctValue, { trigger: true });

                        this.graph.getCells()
                            .filter(function(c) { return c.attributes.component.id == model.attributes.component.id; })
                            .forEach(function(c) { c.prop(options.observe + "/" + nestedAttribute, correctValue); });

                        return model.get(options.observe);

                    }
                }
            },

            valueByType: function(type, value) {
                switch (type) {
                    case "NUMBER":
                        return Number(value);
                    case "POSITIVE_NUMBER": {
                        var num = Number(value);

                        if (num <= 1)
                            return 1;

                        return num;
                    }
                    default:
                        return value;
                }
            }

        });
    });