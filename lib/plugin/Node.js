"use strict";

const axios = require("axios");

class Node {
    constructor (templates) {
        this._templates = templates;
    }

    async message (node, spec, action, state) {
        console.log(this._templates);
        const messageJSON = await this._templates[spec.template](action, {
            command: {
                user_id: "userid",
            },
            train: {
                place: "Super Duper",
                time: "11:00am",
                passengers: [
                    { id:"pass1" },
                    { id:"pass2" },
                    { id:"pass3" }
                ]
            }
        });

        // action
        // Message needs some kind of state specifically toward `updating` existing messages
        // how do you dynamically add a collection from the real `state` to be messaged?

        console.log(action);

        if (action.response_url) {
            await axios.post(action.response_url, messageJSON);
        }
    }

}

module.exports = Node;
