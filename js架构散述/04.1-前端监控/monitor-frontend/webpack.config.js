const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../website-test/client/script/monitor"),
    filename: "[name]-monitor.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: "/\.js/",
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ['@babel/transform-runtime']
          },
        },
      },
    ],
  },
  plugins: [],
};
