module.exports = () => ({
  command (action, spec) {
    return spec.command === action.command;
  }
});
