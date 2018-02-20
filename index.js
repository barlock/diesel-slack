"use strict";

module.exports = {
    attachToExpress: require("./lib/express")().attachToExpress,
    plugin: require("./lib/plugin"),
    botMiddleware: require("./lib/botMiddleware")
};
