"use strict";

const actions = require("./actions"),
    acceptors = require("./acceptors");

module.exports = (opts) => ({
    actions: actions(opts.templates),
    acceptors: acceptors(),
    middleware: [
      require("./saveActionMiddleware")
    ]
});
