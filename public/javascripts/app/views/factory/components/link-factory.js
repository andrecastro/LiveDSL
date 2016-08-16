define(["joint"], function (joint) {

    return function (element, position) {

        return new joint.dia.Link({
            source: { x: position.x, y: position.y },
            target: { x: position.x + 100, y: position.y },
            smooth: false,
            attrs: {
                '.connection': { stroke: 'blue' , 'stroke-width': 3, 'stroke-dasharray': '0'},
                '.marker-source': { stroke: 'blue', fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-target': { stroke: 'blue', fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
            },
            labels: [
                { position: 0.5, attrs: { text: { text: 'label' } } }
            ]
        });
    }
});