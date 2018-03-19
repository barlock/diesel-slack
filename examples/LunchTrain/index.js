'use strict';

const path = require('path');
const { Engine, simpleFileStore } = require('../../src');
const port = process.env.PORT || 8080;

(async () => {
  const engine = new Engine({
    verifyToken: process.env.SLACK_VERIFY_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    botToken: process.env.SLACK_BOT_TOKEN,
    store: simpleFileStore()
  });

  require("./flows/lunchtrain")(engine);

  engine
    .attachToKoa()
    .listen(port, () => console.log(`Server started on port ${port}`));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
