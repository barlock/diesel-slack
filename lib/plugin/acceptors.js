module.exports = () => ({
  command (action, spec) {
    return spec.command === action.command;
  },
  event (action, spec) {
    return spec.type === action.event.type
  },
  interactiveMessage (action, spec) {
    return spec.callbackId === action.callbackId &&
      action.actions.find(action => action.name === spec.name)
  }
});
