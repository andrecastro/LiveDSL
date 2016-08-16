define(["backbone"], function(Backbone) {

    return Backbone.Model.extend({
        defaults: {
            "name": "",
            "imageUrl": "",
            "type": "",
            element: ""
        },

        isNode: function() {
            return this.get("type") == "NODE";
        },

        isLink: function() {
            return this.get("type") == "LINK";
        },

        isRelationshipLink: function() {
            return this.get("type") == "RELATIONSHIP_LINK";
        }
    }, {

        isNode: function(componentItem) {
            return componentItem.isNode();
        },

        isLink: function (componentItem) {
            return componentItem.isLink();
        },

        isRelationshipLink: function(componentItem) {
            return componentItem.isRelationshipLink();
        }
    });
});