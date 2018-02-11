"use strict";

const context = require("./lib/context");

module.exports = {
    attachToExpress: require("./lib/express")().attachToExpress,
    plugin: require("./lib/plugin"),
    singleBotContext: context.singleBotContext
};
