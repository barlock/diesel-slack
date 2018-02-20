"use strict";

const bodyParser = require("body-parser");
const camelizer = require('./camelizer');
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
                  }, camelizer(req.body)))
                  .catch(console.error);

                res.send();
            });
        return app;
    }
});
