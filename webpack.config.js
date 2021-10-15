module.exports = (env, options) => {
    return {
        entry: {
            'echarts-graph-modularity': __dirname + '/index.js'
        },
        output: {
            libraryTarget: 'umd',
            library: ['echarts-graph-modularity'],
            path: __dirname + '/dist',
            filename: options.mode === 'production' ? '[name].min.js' : '[name].js'
        },
        optimization: {
            concatenateModules: true
        },
        devtool: 'source-map',
        externals: {
            'echarts/core': 'echarts'
        }
    };
};