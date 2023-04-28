const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "Form.js"),
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(css)/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  output: {
    publicPath: "/",
    filename: "form.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".css", ".js"],
  }
};
