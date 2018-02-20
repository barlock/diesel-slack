'use strict';

module.exports = async ({ action, context }, next) => {
  context.train = Object.assign({}, context.train, {
    conductor: action.userId,
    channel: action.channelId,
    passengers: [],
    place: "Super Duper",
    time: "11am"
  });

  await next();
};
