module.exports = () => ({
  command (action, spec) {
    return spec.command === action.command;
  },
  event (action, spec) {
    return spec.type === action.event.type
  }
});
