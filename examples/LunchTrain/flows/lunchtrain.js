'use strict';

const messages = require("../messages");

const initialState = {
  conductor: {},
  place: 'Super Duper',
  time: Date.now(),
  passengers: []
};

async function sendAndUpdateTrainStatus (slack, event, state) {
  console.log(await messages.boardRequest(event, state));
  await slack.respond(await messages.boardRequest(event, state))
}

module.exports = engine => {
  const flow = engine.flow("/lunchtrain", initialState);

  flow.command("/lunchtrain", async (action) => {
    const { body, state, slack } = action;

    state.conductor = {
      id: body.user_id
    };

    slack.respond(await messages.boardRequest(action));
  });

  flow.button("passengerBoard", async ({ slack, event, state }) => {
    state.passengers.push({
      user: event.user.id,
      messageTs: null,
      messageChannel: null
    });

    await sendAndUpdateTrainStatus(slack, event, state);
  });

  flow.button("delayTrain", async ({ slack, event, state}) => {
    state.time = time + new Date("30 min");

    await sendAndUpdateTrainStatus(slack, event, state);
  });

  flow.button("cancelTrain", async ({ event, state, slack }) => {
    state.isCanceled = true;

    await sendAndUpdateTrainStatus(slack, event, state);
  });
};


