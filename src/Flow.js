'use strict';

const compose = require('koa-compose');
const uid = require('uid-safe');

function hasButtonAction (actions) {
  return !!actions.find(action => action.type === "button")
}

class Flow {
  constructor (name, { initialState, store }) {
    this._matches = [];
    this._middleware = [];
    this._initialState = initialState;
    this._store = store;

    this.use(this._stateMiddleware.bind(this));
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

  button (name, value, callback) {
    if (typeof value === 'function') {
      callback = value;
      value = /.*/;
    }

    if (typeof name === 'string') {
      name = new RegExp(`^${name}$`, 'i')
    }

    if (typeof value === 'string') {
      value = new RegExp(`^${value}$`, 'i')
    }

    const fn = action => {
      const { type, body } = action;
      const bodyActions = body.actions;

      if (type === "action" &&
        body.type === "interactive_message" &&
        hasButtonAction(bodyActions)) {

        // If it matches the name, value, then go forth!
      }
    }
  }

  match (fn) {
    this._matches.push(fn);

    return this;
  }

  async _stateMiddleware (action, next) {
    if (action.body.callback_id) {
      action.id = action.body.callback_id;

      action.state = await this._store.get(action.id);
    } else {
      action.id = await uid(18);

      action.state = action.state || JSON.parse(JSON.stringify(this._initialState));
    }

    await next();

    if (!action.done) {
      await this._store.put(action.id, action.state);
    } else {
      await this._store.delete(action.id);
    }
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
    }, null);

    if (handler) {
      return compose(this._middleware.concat([
        async (action, next) => {
          await handler();
          await next();
        }
      ]))
    }
  }
}

module.exports = Flow;
