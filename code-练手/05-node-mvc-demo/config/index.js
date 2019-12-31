const _ = require("lodash");
const path = require("path");

let config = {
  viewDir: path.resolve(__dirname, "../views"),
  staticDir: path.resolve(__dirname, "../assets"),
  logDir: path.resolve(__dirname, "../middleware/logs/project.log"),
  mockDir: path.resolve(__dirname, "../mock")
};

if (process.env.NODE_ENV === "dev") {
  const portConfig = {
    port: 3003,
    baseUrl: 'http://localhost:3003'
  };
  config = _.extend(config, portConfig);
}

if (process.env.NODE_ENV === "prod") {
  const portConfig = {
    port: 80,
    baseUrl: "http://localhost:3000"
  };
  config = _.extend(config, portConfig);
}

module.exports = config;
