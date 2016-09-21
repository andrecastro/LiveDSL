define(["backbone", "underscore", "app-views/layout/solicitation-form", "controllers/projects",
        "custom/pnotify-bootstrap", "text!app-templates/solicitation-template.html"],
    function (Backbone, _, SolicitationForm, Projects, notify, solicitationTemplate) {

        var SolicitationWarning = Backbone.View.extend({
            template: _.template(solicitationTemplate),

            events: {
                "click .solicitation": "createSolicitation",
                "click .rollback": "rollback"
            },

            render: function () {
                this.$el.html(this.template());
                return this;
            },

            createSolicitation: function () {
                if (Projects.isRemoteMetamodelDifferent()) {
                    notify("error", 'You need to save the current metamodel before create a solicitation.');
                } else {
                    new SolicitationForm().render();
                }
            },

            rollback: function () {
                notify("confirmation", 'Doing this you will lose all invalid components on your model and will rollback ' +
                    'to the dsl metamodel, but will not stop the solicitations already sent to the admin. Do you confirm?').get()
                    .on('pnotify.confirm', function() {
                        Projects.rollbackToDslMetamodel(function() {
                            notify("success", 'Rollback with success.');
                            window.pallet = JSON.parse(JSON.stringify(window.dslMetamodel));
                            window.center.renderSolicitationView();
                        }, function () {
                            notify("error", 'Something went wrong.');
                        });
                    });
            }
        });

        return SolicitationWarning;
    });
