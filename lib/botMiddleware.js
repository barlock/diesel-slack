module.exports = ({ appToken, botToken }) =>
  async function ({action, state}, next) {
    action.slack = Object.assign({}, action.slack, {
        appToken, botToken
    });

    await next();
  };
