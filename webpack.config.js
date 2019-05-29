var path = require("path");

module.exports = {
    entry: "./assets/js/main.js",
    output: {
        filename: "./app.js"
    },
    devServer: {
        // contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 1337
    }
};
