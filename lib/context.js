const singleBotContext = ({ appToken, botToken, botUserId }) =>
    async function ({action, state}, next) {
        action.slack = Object.assign({}, action.slack, {
            appToken, botToken, botUserId
        });

        await next();
    };

module.exports = {
    singleBotContext
};
