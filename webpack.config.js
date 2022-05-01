const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/game.ts",
    devtool: "source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".ts", "tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};