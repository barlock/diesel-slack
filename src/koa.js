'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = (engine, app = new Koa()) => {
  const router = new Router();

  const verifyToken = async (ctx, next) => {
    const token = engine._verifyToken;
    const body = ctx.request.body;

    if (!token) {
      throw new Error("No verify token provided, can't verify request");
    }

    if (token !== body.token) {
      ctx.throw(403, "Invalid verify token");
    }

    console.log('Slack Event ', JSON.stringify(body))

    await next();
  };

  router.use(bodyParser());

  router.post('/slack/command',
    verifyToken,
    async (ctx, next) => {
      const action = {
        type: 'command',
        body: ctx.request.body
      };

      await engine.dispatch(action);

      ctx.body = action.response;

      await next();
    });

  router.post('/slack/event',
    verifyToken,
    async (ctx, next) => {
      const action = Object.assign({
        type: 'event',
        body: ctx.request.body
      });

      if (action.body.type === 'url_verification') {
        ctx.body = { challenge: action.body.challenge }
      } else {
        engine.dispatch(action);

        ctx.response.status = 202;
      }

      await next();
    });

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;
};

