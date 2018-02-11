const Engine = require("diesel-engine").Engine;
const engine = new Engine({});
const dieselSlack = require("../../");

engine.addFlows(__dirname + "/flows");

engine.plugin("slack", dieselSlack.plugin({
    boardRequest: require("./messages/board-request").default,
    conductorControls: require("./messages/conductor-controls").default
}));

engine.use(dieselSlack.singleBotContext({
    appToken: process.env.SLACK_APP_TOKEN,
    botToken: process.env.SLACK_BOT_TOKEN,
    botUserId: process.env.SLACK_BOT_ID
}));

dieselSlack.attachToExpress(require("express")(), engine)
    .listen(8080, () => console.log("Server started"));

