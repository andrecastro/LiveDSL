define(["backbone", "underscore", "text!admin-templates/toolbars/new-toolbar-template.html",
        "custom/pnotify-bootstrap", "controllers/dsl_client"],
    function (Backbone, _, toolbarTemplate, notify, Dsl) {

        return Backbone.View.extend({
            template: _.template(toolbarTemplate),
            className: "toolbar",

            events: {
                "click #save": "save"
            },

            initialize: function(options) {
                this.options = options;
            },

            render: function() {
                this.$el.html(this.template());
                this.$('[data-toggle="tooltip"]').tooltip();
                return this;
            },

            save: function(e) {
                e.stopImmediatePropagation();

                var cellMetamodel = this.getCellMetamodel();
                Dsl.saveCellMetamodel(cellMetamodel, function() {
                    notify("success", 'Successfully saved!');
                    window.router.navigate("/", { trigger: true });
                }, function (res) {
                    var errorMessage = res.responseJSON.map(function(error) { return "- " + error; }).join("\n");
                    notify("error", errorMessage);
                });
            },

            getCellMetamodel: function() {
                var cell = graph.toJSON().cells[0];

                if (cell) {
                    delete cell.id;
                    delete cell.position;
                }

                return cell;
            }
        });
    });
