class Receiver {
    command (action, spec) {
        return spec.command === action.command;
    }
}

module.exports = Receiver;
