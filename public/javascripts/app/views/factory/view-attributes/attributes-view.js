define(["backbone", "underscore", "views/custom/collapse-panel-view",
        "text!app-templates/attributes/geometry.html", "text!app-templates/attributes/text.html",
        "text!app-templates/attributes/component.html", "text!app-templates/attributes/restrictions-attributes.html",
        "backbone-stickit"],
    function (Backbone, _, CollapsePanelView, geometryTemplate, textTemplate, componentTemplate, restrictionsTemplate) {

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
                this.listenTo(this.model, 'change:restrictions', this.renderRestrictions);
            },

            render: function () {
                this.$el.empty();
                this.renderTextAttributes();
                this.renderAppearance();
                this.renderGeometryAttributes();
                this.stickit();
                return this;
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
                        var correctValue = this.valueByType(type, value);
                        model.prop(options.observe + "/" + nestedAttribute, correctValue);

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