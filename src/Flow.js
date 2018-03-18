'use strict';

const compose = require('koa-compose');

class Flow {
  constructor (name, initialState) {
    this._matches = [];
    this._middleware = [];
    this._initialState = initialState;

    this.use(this._stateMiddleware);
  }

  command (command, criteria, callback) {
    if (typeof criteria === 'function') {
      callback = criteria;
      criteria = /.*/
    }

    if (typeof criteria === 'string') {
      criteria = new RegExp(criteria, 'i')
    }

    if (typeof command === 'string') {
      command = new RegExp(`^${command}$`, 'i')
    }


    const fn = action => {
      const { type, body } = action;

      if (type === "command" && body.command &&
        body.command.match(command)) {
        const text = body.text || '';
        const textMatch = text.match(criteria);

        if (textMatch) {
          action.state = action.state ||
            JSON.parse(JSON.stringify(this._initialState));

          return callback.bind(null, action, ...textMatch);
        }
      }
    };

    this.match(fn);

    return this;
  }

  button () {}

  match (fn) {
    this._matches.push(fn);

    return this;
  }

  _stateMiddleware (action, next) {
    action.state = action.state ||
      JSON.parse(JSON.stringify(this._initialState));

    next();
  }

  use (middleware) {
    this._middleware.push(middleware)
  }

  findHandler (action) {
    const handler = this._matches.reduce((handler, matcher) => {
      if (handler) {
        return handler;
      }

      return matcher(action);
    }, null)

    if (handler) {
      return compose(this._middleware.concat([
        async (action, next) => {
          await handler();
          await next();
        }
      ])).bind(null, action);
    }
  }
}

module.exports = Flow;
