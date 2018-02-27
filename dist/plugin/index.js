"use strict";

var actions = require("./actions"),
    acceptors = require("./acceptors");

module.exports = function (opts) {
    return {
        actions: actions(opts.templates),
        acceptors: acceptors(),
        middleware: [require("./saveActionMiddleware")]
    };
};