var PROD = process.argv.indexOf('-p') >= 0;

module.exports = {
    entry: {
        'echarts-graph-modularity': __dirname + '/index.js'
    },
    output: {
        libraryTarget: 'umd',
        library: ['echarts-graph-modularity'],
        path: __dirname + '/dist',
        filename: PROD ? '[name].min.js' : '[name].js'
    },
    externals: {
        'echarts': 'echarts'
    }
};