define(["backbone", "underscore", "controllers/projects", "custom/pnotify-bootstrap",
        "text!app-templates/solicitation-form.html", "jquery-ui"],
    function (Backbone, _, Projects, notify, solicitationTemplate) {

        var SolicitationForm = Backbone.View.extend({
            template: _.template(solicitationTemplate),

            initialize: function () {
                _.bindAll(this, "render");
            },

            render: function () {
                var formString = this.template();
                var self = this;
                this.$el = $(formString).dialog({
                    autoOpen: true,
                    height: 380,
                    width: 500,
                    title: "Solicitation",
                    modal: true,
                    buttons: [
                        {
                            text: "Create",
                            click: function () {
                                self.save();
                            }
                        },
                        {
                            text: "Cancel",
                            click: function () {
                                self.close();
                            }
                        }
                    ],
                    close: function (event, ui) {
                        self.close();
                    }
                });

                return this;
            },

            isFormValid: function () {
                var isValid = true;

                var title = this.$("#solicitation-title").val();
                var description = this.$("#solicitation-description").val();

                if (!title) {
                    this.$(".solicitation-title-group").addClass("has-error has-danger");
                    this.$(".solicitation-title-error-message").show();
                    isValid = false;
                } else {
                    this.$(".solicitation-title-group").removeClass("has-error has-danger");
                    this.$(".solicitation-title-error-message").hide();
                }

                if (!description) {
                    this.$(".solicitation-description-group").addClass("has-error has-danger");
                    this.$(".solicitation-description-error-message").show();
                    isValid = false;
                } else {
                    this.$(".solicitation-description-group").removeClass("has-error has-danger");
                    this.$(".solicitation-description-error-message").hide();
                }

                return isValid;
            },

            save: function () {
                if (this.isFormValid()) {
                    var title = this.$("#solicitation-title").val();
                    var description = this.$("#solicitation-description").val();

                    var self = this;
                    Projects.createSolicitation(title, description, function () {
                        self.close();
                        notify("success", "Solicitation created");
                    }, function () {
                        self.close();
                        notify("error", "Something went wrong");
                    });
                }
            },

            close: function () {
                this.$el.dialog("destroy");
                this.remove();
            }
        });

        return SolicitationForm;
    });
