var Modularity = require('ngraph.modularity/Modularity');
var echarts = require('echarts/lib/echarts');
var createNGraph = require('ngraph.graph');

function createModularityVisual(chartType) {
    return function (ecModel, api) {
        var paletteScope = {};
        ecModel.eachSeriesByType(chartType, function (seriesModel) {
            var modularityOpt = seriesModel.get('modularity');
            if (modularityOpt) {
                var graph = seriesModel.getGraph();
                var idIndexMap = {};
                var ng = createNGraph();
                graph.data.each(function (idx) {
                    var node = graph.getNodeByIndex(idx);
                    idIndexMap[node.id] = idx;
                    ng.addNode(node.id);
                    return node.id;
                });
                graph.edgeData.each('value', function (val, idx) {
                    var edge = graph.getEdgeByIndex(idx);
                    ng.addLink(edge.node1.id, edge.node2.id);
                    return {
                        source: edge.node1.id,
                        target: edge.node2.id,
                        value: val
                    };
                });

                var modularity = new Modularity(seriesModel.get('modularity.resolution') || 1);
                var result = modularity.execute(ng);

                var communities = {};
                for (var id in result) {
                    var comm = result[id];
                    communities[comm] = communities[comm] || 0;
                    communities[comm]++;
                }
                var communitiesList = Object.keys(communities);
                if (seriesModel.get('modularity.sort')) {
                    communitiesList.sort(function (a, b) {
                        return b - a;
                    });
                }
                var colors = {};
                communitiesList.forEach(function (comm) {
                    colors[comm] = seriesModel.getColorFromPalette(comm, paletteScope);
                });

                for (var id in result) {
                    var comm = result[id];
                    graph.data.setItemVisual(idIndexMap[id], 'color', colors[comm]);
                }

                graph.edgeData.each(function (idx) {
                    var itemModel = graph.edgeData.getItemModel(idx);
                    var edge = graph.getEdgeByIndex(idx);
                    var color = itemModel.get('lineStyle.normal.color');

                    switch (color) {
                        case 'source':
                            color = edge.node1.getVisual('color');
                            break;
                        case 'target':
                            color = edge.node2.getVisual('color');
                            break;
                    }

                    if (color != null) {
                        edge.setVisual('color', color);
                    }
                });
            }
        });
    };
}

echarts.registerVisual(echarts.PRIORITY.VISUAL.CHART + 1, createModularityVisual('graph'));
echarts.registerVisual(echarts.PRIORITY.VISUAL.CHART + 1, createModularityVisual('graphGL'));