"use strict";

const bodyParser = require("body-parser");

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

module.exports = () => ({
    attachToExpress: (app, engine) => {
        app.post("/slack/command",
            bodyParser.urlencoded({extended: true}),
            verifyToken,
            async (req, res) => {
                try {
                    await engine.dispatch(Object.assign({
                        type: "slack.command"
                    }, req.body));
                } catch (e) {
                    console.error(e);
                }

                res.send();
            });
        return app;
    }
});
