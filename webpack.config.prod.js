const path = require("path");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/game.ts",
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
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin({dry: true})
    ]
};