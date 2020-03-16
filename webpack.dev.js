const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
  devServer: {
    contentPath: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
  mode: "development"
});
