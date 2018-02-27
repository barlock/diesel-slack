'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pluralize = require('pluralize');

module.exports = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref, next) {
    var action = _ref.action,
        context = _ref.context;

    var _action$type$split, _action$type$split2, plugin, type, group, actionData;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _action$type$split = action.type.split("."), _action$type$split2 = (0, _slicedToArray3.default)(_action$type$split, 2), plugin = _action$type$split2[0], type = _action$type$split2[1];

            if (!(plugin !== "slack")) {
              _context.next = 3;
              break;
            }

            return _context.abrupt('return');

          case 3:
            group = pluralize.plural(type);
            actionData = JSON.parse((0, _stringify2.default)(action));


            context.slack = context.slack || {};

            context.slack[group] = context.slack[group] || [];
            context.slack[group].push(actionData);

            console.log('Received ' + action.type + ': ' + (0, _stringify2.default)(actionData));

            _context.next = 11;
            return next();

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();