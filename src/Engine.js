'use strict';

const axios = require('axios');
const Slack = require('slack');
const compose = require('koa-compose');
const Flow = require('./Flow');

class Engine {
  constructor (opts) {
    if (!opts.verifyToken) {
      throw new Error('Engine failure: Provide a `verifyToken` in opts');
    }

    this._middleware = [];
    this._flows = [];
    this._verifyToken = opts.verifyToken;

    const token = opts.botToken || opts.appToken;

    if (token) {
      this.use(this._singleTokenMiddleware(token))
    }
  }

  _singleTokenMiddleware (token) {
    return async (action, next) => {
      action.slack = new Slack({ token });

      action.slack.respond = message => {
        const responseUrl = action.body.response_url;

        if (!responseUrl) {
          throw new Error("Cannot `slack.respond`. Missing Slack response_url")
        }

        return axios.post(action.body.response_url, message);
      };

      await next();
    }
  }

  attachToKoa (server) {
    return require('./koa')(this, server)
  }

  use (middleware) {
    this._middleware.push(middleware);
  }

  flow (name, opts) {
    const flow = new Flow(name, opts);

    this._flows.push(flow);

    return flow;
  }

  async dispatch (action) {
    await compose(this._middleware.concat([
      async (action, next) => {
        const handler = this._flows.reduce((handler, flow) => {
          if (handler) {
            return handler;
          }

          return flow.findHandler(action);
        }, null);

        if (handler) {
          await handler();
        }

        await next();
      }
    ]))(action).catch(console.error);
  }
}

module.exports = Engine;
