const path = require('path');

module.exports = {
    mode: 'development',
    entry: './assets/js/main.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
    },
};
