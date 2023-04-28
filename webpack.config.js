const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "Form.jsx"),
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(css)/,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  output: {
    publicPath: "/",
    filename: "form.js",
    path: path.resolve(__dirname, "kubespawner_dynamic_building_ui/static/"),
  },
  resolve: {
    extensions: [".css", ".js", ".jsx"],
  }
};
