"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Slack = require('slack');

module.exports = function (_ref) {
  var appToken = _ref.appToken,
      botToken = _ref.botToken;

  if (!(appToken || botToken)) {
    throw new Error("Either appToken or botToken is required for diesel-slack botMiddleware");
  }

  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2, next) {
      var action = _ref2.action,
          context = _ref2.context;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              action.slack = (0, _assign2.default)({}, action.slack, {
                bot: botToken ? new Slack({ token: botToken }) : null,
                app: appToken ? new Slack({ token: appToken }) : null
              });

              _context.next = 3;
              return next();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
};