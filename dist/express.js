"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyParser = require("body-parser");
var camelizer = require('camelcase-keys');
var _ = require("lodash");

var verifyToken = function verifyToken(req, res, next) {
  //TO-DO: pass token here
  var token = process.env.SLACK_VERIFY_TOKEN;

  if (!token) {
    return next();
  }

  if (token !== req.body.token) {
    return res.status(403).send("Invalid verify token");
  }

  next();
};

var dataToCamelCase = function dataToCamelCase(data) {
  return _.reduce(data, function (data, value, key) {
    data[_.camelCase(key)] = value;

    return data;
  }, {});
};

module.exports = function () {
  return {
    attachToExpress: function attachToExpress(app, engine) {
      app.get("/", function (req, res) {
        return res.sendStatus(200);
      });

      app.post("/slack/command", bodyParser.urlencoded({ extended: true }), verifyToken, function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  engine.dispatch((0, _assign2.default)({
                    type: "slack.command"
                  }, camelizer(req.body, { deep: true }))).catch(console.error);

                  res.send();

                case 2:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());

      app.post("/slack/event", bodyParser.json(), verifyToken, function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
          var action;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  action = (0, _assign2.default)({}, camelizer(req.body, { deep: true }), {
                    type: "slack.event"
                  });

                  if (!(action.event.type === "url_verification")) {
                    _context2.next = 3;
                    break;
                  }

                  return _context2.abrupt("return", res.json({ challenge: action.challenge }));

                case 3:

                  engine.dispatch(action).catch(console.error);

                  res.send();

                case 5:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, undefined);
        }));

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());

      return app;
    }
  };
};