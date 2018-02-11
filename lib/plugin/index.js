"use strict";

const Node = require("./Node"),
    Receiver = require("./Receiver");

module.exports = templates => ({
    node: new Node(templates),
    receiver: new Receiver(),
    middleware: [
        require("./middleware")
    ]
});
