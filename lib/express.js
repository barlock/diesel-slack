"use strict";

const bodyParser = require("body-parser");
const camelizer = require('camelcase-keys');
const _ = require("lodash");

const verifyToken = (req, res, next) => {
    //TO-DO: pass token here
    const token = process.env.SLACK_VERIFY_TOKEN;

    if (!token) {
        return next();
    }

    if (token !== req.body.token) {
        return res.status(403).send("Invalid verify token");
    }

    next();
};

const dataToCamelCase = (data) => {
  return _.reduce(data, (data, value, key) => {
      data[_.camelCase(key)] = value;

      return data;
    }, {});
};

module.exports = () => ({
  attachToExpress: (app, engine) => {
    app.get("/", (req, res) => res.sendStatus(200));

    app.post("/slack/command",
        bodyParser.urlencoded({extended: true}),
        verifyToken,
        async (req, res) => {
            engine
              .dispatch(Object.assign({
                type: "slack.command"
              }, camelizer(req.body, { deep: true })))
              .catch(console.error);

            res.send();
        });

      app.post("/slack/event",
        bodyParser.json(),
        verifyToken,
        async (req, res) => {
          const action = Object.assign({},
            camelizer(req.body, { deep: true }),{
              type: "slack.event"
            });

          if (action.event.type === "url_verification") {
            return res.json({ challenge: action.challenge });
          }

          engine
            .dispatch(action)
            .catch(console.error);

          res.send();
        });

        return app;
    }
});
