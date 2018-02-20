"use strict";

const axios = require("axios");

module.exports = (templates) => ({
  async message (actionSpec, action, context) {
    const messageJSON = await templates[actionSpec.template](action, context);

    // NEXT work here to send messages to places in the `spec`

    if (action.responseUrl) {
      await axios.post(action.responseUrl, messageJSON);
    }
  }
});
