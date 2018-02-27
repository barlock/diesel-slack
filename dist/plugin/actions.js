"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var axios = require("axios");
var _ = require('lodash');

var flatPack = function flatPack(array) {
  return _(array).compact().flatten().value();
};

module.exports = function (templates) {

  var getMessageJSON = function getMessageJSON(templateName, action, context) {
    var templateFn = templates[templateName];

    if (!templateFn) {
      throw new Error("Unable to process template " + templateName + ". Doesn't exist.");
    }

    return templateFn(action, context);
  };

  var getSlackClient = function getSlackClient(action) {
    var _action$slack = action.slack,
        bot = _action$slack.bot,
        app = _action$slack.app;


    return bot || app;
  };

  return {
    postMessage: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(actionSpec, action, context) {
        var slack, _ref2, channel, _ref2$channels, channels, channelList, messageJSON;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                slack = getSlackClient(action);
                _ref2 = actionSpec.to || {}, channel = _ref2.channel, _ref2$channels = _ref2.channels, channels = _ref2$channels === undefined ? [] : _ref2$channels;
                channelList = flatPack([channel].concat((0, _toConsumableArray3.default)(channels)));
                _context.next = 5;
                return getMessageJSON(actionSpec.template, action, context);

              case 5:
                messageJSON = _context.sent;

                if (!(channelList.length === 0 && action.responseUrl)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 9;
                return axios.post(action.responseUrl, messageJSON);

              case 9:
                return _context.abrupt("return");

              case 10:
                _context.next = 12;
                return _promise2.default.all(channelList.map(function (channel) {
                  return slack.chat.postMessage((0, _assign2.default)({ channel: channel }, messageJSON));
                }));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function postMessage(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return postMessage;
    }(),
    directMessage: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(actionSpec, action, context) {
        var _this = this;

        var slack, _ref4, user, _ref4$users, users, userList, messageJSON;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                slack = getSlackClient(action);
                _ref4 = actionSpec.to || {}, user = _ref4.user, _ref4$users = _ref4.users, users = _ref4$users === undefined ? [] : _ref4$users;
                userList = flatPack([user].concat((0, _toConsumableArray3.default)(users)));
                _context3.next = 5;
                return getMessageJSON(actionSpec.template, action, context);

              case 5:
                messageJSON = _context3.sent;
                _context3.next = 8;
                return _promise2.default.all(userList.map(function () {
                  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(user) {
                    var openResponse;
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return slack.conversations.open({ users: user });

                          case 2:
                            openResponse = _context2.sent;

                            if (openResponse.ok) {
                              _context2.next = 5;
                              break;
                            }

                            throw new Error(openResponse.message);

                          case 5:
                            _context2.next = 7;
                            return slack.chat.postMessage((0, _assign2.default)({
                              channel: openResponse.channel.id
                            }, messageJSON));

                          case 7:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, _this);
                  }));

                  return function (_x7) {
                    return _ref5.apply(this, arguments);
                  };
                }()

                // NEXT:
                // 1. Save messages that need to be updated into the context
                // 2. Save the context in storage
                // 3. Handle buttons
                // 4. If context has a saved message, update it
                // X. ephemral messages, dialogs, etc
                ));

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function directMessage(_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return directMessage;
    }()
  };
};