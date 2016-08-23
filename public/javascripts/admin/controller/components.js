define(["jquery", "joint"], function ($, joint) {

    function Components() {}

    Components.prototype.getAll = function() {
        var response = null;
        $.ajax({
            url: "/admin/dsls/" + currentDsl + "/components",
            async: false,
            success: function (res) {
                response = res;
            }
        });

        return response;
    };

    Components.prototype.getPredefinedNodes = function() {
        var basic = new joint.shapes.basic.Rect({
            size: {width: 100, height: 30},
            attrs: {rect: {fill: 'blue'}, text: {text: "Basic node", fill: 'white'}},
            component: {
                id: "basic-node",
                friendlyName: "Basic",
                image: "http://www.stickylife.com/images/u/853a9088913244b5a86715afc626aafe-800.png",
                type: "NODE"
            }
        });

        var ellipse = new joint.shapes.basic.Ellipse({
            size: {width: 100, height: 30},
            attrs: {text: {text: 'Ellipse', fill: 'white'}, ellipse: {fill: 'red'}},
            component: {
                id: "ellipse",
                friendlyName: "Ellipse",
                image: "http://images.clipartpanda.com/ellipse-clipart-blue-ellipse-md.png",
                type: "NODE"
            }
        });

        var html = new joint.shapes.basic.Rect({
            size: {width: 100, height: 30},
            attrs: {rect: {fill: 'green'}, text: {text: "HTML node", fill: 'white'}},
            component: {
                id: "html",
                friendlyName: "HTML",
                image: "https://1.bp.blogspot.com/-hNjVYk2JVpc/V1BXy-zYIBI/AAAAAAAAAt8/yz25h6YZoQcb_hmXflCLaFhdNgjZXj5igCLcB/s1600/html1.png",
                type: "NODE"
            }
        });

        var image = new joint.shapes.basic.Image({
            size: {width: 100, height: 30},
            attrs: {
                image: {
                    "xlink:href": "http://crisciber162.pbworks.com/f/losango.gif",
                    width: 1, height: 1
                },
                text: {text: "Image node", fill: 'white'}
            },
            component: {
                id: "image-node",
                friendlyName: "Image",
                image: "https://archive.org/services/img/image",
                type: "NODE"
            }
        });

        var nodes = [];
        nodes.push(basic.toJSON());
        nodes.push(ellipse.toJSON());
        nodes.push(html.toJSON());
        nodes.push(image.toJSON());

        return nodes;
    };

    Components.prototype.getPredefinedLinks = function() {
        var basicLink = new joint.dia.Link({
            smooth: false,
            attrs: {
                '.connection': { stroke: 'blue' , 'stroke-width': 3, 'stroke-dasharray': '0'},
                '.marker-source': { stroke: 'blue', fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: 'blue', fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            component: {
                id: "basic-link",
                friendlyName: "Basic",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/ArrowCross.svg/2000px-ArrowCross.svg.png",
                type: "LINK"
            },
            labels: [
                { position: 0.5, attrs: { text: { text: 'label' } } }
            ]
        });

        var links = [];
        links.push(basicLink.toJSON());

        return links;
    };

    Components.prototype.getLocalComponentById = function(id) {
        return window.components.filter(function(component) { return component.component.id == id })[0];
    };

    return new Components();
});