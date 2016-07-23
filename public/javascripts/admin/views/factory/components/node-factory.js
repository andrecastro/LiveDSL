define(["joint"], function(joint) {

    return function(element, position) {

        switch (element) {
            case "BASIC":
                return new joint.shapes.basic.Rect({
                    position: { x: position.x, y: position.y },
                    size: { width: 100, height: 30 },
                    attrs: { rect: { fill: 'blue' }, text: { text: "Basic node", fill: 'white' }}
                });
            case "ELLIPSE":
                return new joint.shapes.basic.Ellipse({
                    position: { x: position.x, y: position.y },
                    size: { width: 100, height: 30 },
                    attrs: { text: { text: 'Ellipse', fill: 'white' }, ellipse: { fill: 'red' } }
                });
            case "HTML":
                return new joint.shapes.basic.Rect({
                    position: { x: position.x, y: position.y },
                    size: { width: 100, height: 30 },
                    attrs: { rect: { fill: 'green' }, text: { text: "HTML node", fill: 'white' }}
                });
            case "IMAGE":
                return new joint.shapes.basic.Image({
                    position: { x: position.x, y: position.y },
                    size: { width: 100, height: 30 },
                    attrs : {
                        image : {
                            "xlink:href" : "http://crisciber162.pbworks.com/f/losango.gif",
                            width: 1, height: 1
                        }
                    }
                });
        }
    }
});