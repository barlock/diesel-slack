"use strict";

const axios = require("axios");
const _ = require('lodash');

const flatPack = array => _(array).compact().flatten().value();


module.exports = (templates) => {

  const getMessageJSON = (templateName, action, context) => {
    const templateFn = templates[templateName];

    if (!templateFn) {
      throw new Error(`Unable to process template ${templateName}. Doesn't exist.`)
    }

    return templateFn(action, context);
  };

  const getSlackClient = action => {
    const { bot, app } = action.slack;

    return bot || app;
  };

  return ({
    async postMessage (actionSpec, action, context) {
      const slack = getSlackClient(action);

      const {
        channel, channels = []
      } = actionSpec.to || {};

      const channelList = flatPack([channel, ...channels]);
      const messageJSON = await getMessageJSON(actionSpec.template, action, context);

      if (channelList.length === 0 && action.responseUrl) {
        await axios.post(action.responseUrl, messageJSON);

        return;
      }

      console.log(Object.assign({ channel }, messageJSON));
      await Promise.all(channelList.map(channel =>
        slack.chat.postMessage(Object.assign({ channel }, messageJSON))));
    },

    async directMessage (actionSpec, action, context) {
      const slack = getSlackClient(action);

      const {
        user, users = []
      } = actionSpec.to || {};

      const userList = flatPack([user, ...users]);
      const messageJSON = await getMessageJSON(actionSpec.template, action, context);

      await Promise.all(userList.map(async user => {
        const openResponse = await slack.conversations.open({users: user});

        if (!openResponse.ok) {
          throw new Error(openResponse.message);
        }

        await slack.chat.postMessage(Object.assign({
          channel: openResponse.channel.id
        }, messageJSON));

        // NEXT:
        // 1. Save messages that need to be updated into the context
        // 2. Save the context in storage
        // 3. Handle buttons
        // 4. If context has a saved message, update it
        // X. ephemral messages, dialogs, etc
      }));
    }
  });
};
