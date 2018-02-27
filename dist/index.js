"use strict";

module.exports = {
  attachToExpress: require("./express")().attachToExpress,
  plugin: require("./plugin"),
  botMiddleware: require("./botMiddleware")
};