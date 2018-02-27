"use strict";

module.exports = function () {
  return {
    command: function command(action, spec) {
      return spec.command === action.command;
    },
    event: function event(action, spec) {
      return spec.type === action.event.type;
    }
  };
};