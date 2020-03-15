const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common,{
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
});
