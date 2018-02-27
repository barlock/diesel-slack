const Slack = require('slack');

module.exports = ({ appToken, botToken }) => {
  if (!appToken || !botToken) {
    throw new Error("Either appToken or botToken is required for diesel-slack botMiddleware");
  }

  return async ({ action, context }, next) => {
    action.slack = Object.assign({}, action.slack, {
      bot: botToken ? new Slack({token: botToken}) : null,
      app: appToken ? new Slack({token: appToken}) : null
    });

    await next();
  }
};
