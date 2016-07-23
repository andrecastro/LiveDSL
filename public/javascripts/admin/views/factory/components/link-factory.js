define(["joint"], function (joint) {

    return function (element, position) {

        return new joint.dia.Link({
            source: {x: position.x, y: position.y},
            target: {x: position.x + 100, y: position.y},
            attrs: {
                '.connection': {stroke: 'blue'},
                '.marker-source': {fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z'},
                '.marker-target': {fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z'}
            }
        });
    }
});