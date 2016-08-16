define(["backbone", "underscore", "views/custom/collapse-panel-view",
        "text!templates/attributes/geometry.html", "text!templates/attributes/text.html",
        "text!templates/attributes/component.html", "backbone-stickit"],
    function (Backbone, _, CollapsePanelView, geometryTemplate, textTemplate, componentTemplate) {

        return Backbone.View.extend({
            className: "panel-group accordion-caret",

            initialize: function (options) {
                this.cellView = options.cellView;
                this.model = options.cellView.model;
                this.paper = options.cellView.paper;
                this.graph = options.cellView.paper.model;

                // this will remove other attributes
                this.paper.trigger("attributes:remove_others");

                this.listenTo(this.paper, 'blank:pointerdown attributes:remove_others', this.remove);
                this.listenTo(this.model, 'remove', this.remove);
            },

            render: function () {
                this.$el.empty();
                this.renderComponentAttributes();
                this.renderTextAttributes();
                this.renderAppearance();
                this.renderGeometryAttributes();
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

                this.bindInputToNestedField("#component-id", "component", "id", "STRING");
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

                this.bindInputToNestedField("#x", "position", "x", "NUMBER");
                this.bindInputToNestedField("#y", "position", "y", "NUMBER");
                this.bindInputToNestedField("#width", "size", "width", "NUMBER");
                this.bindInputToNestedField("#height", "size", "height", "NUMBER");
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
                        model.prop(options.observe + "/" + nestedAttribute, this.valueByType(type, value));
                        return model.get(options.observe);

                    }
                }
            },

            valueByType: function(type, value) {
                switch (type) {
                    case "NUMBER":
                        return Number(value);
                    default:
                        return value;
                }
            }

        });
    });