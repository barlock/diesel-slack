'use strict';
const path = require('path');
const Engine = require("diesel-engine").Engine;
const engine = new Engine({});
const dieselSlack = require("../../");
const port = process.env.PORT || 8080;

(async () => {
  await engine.addFlows({
    flowDir: path.join(__dirname, "flows"),
    middleware: require("./middleware")
  });

  engine.plugin("slack", dieselSlack.plugin({
    templates: require("./messages")
  }));

  engine.use(dieselSlack.botMiddleware({
    appToken: process.env.SLACK_APP_TOKEN,
    botToken: process.env.SLACK_BOT_TOKEN
  }));

  dieselSlack
    .attachToExpress(require("express")(), engine)
    .listen(port, () => console.log(`Server started on port ${port}`));
})().catch(e => {
  console.error(e);
  process.exit(1);
});
