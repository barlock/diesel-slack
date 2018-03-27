'use strict';

const messages = require("../messages");

const initialState = {
  conductor: {},
  place: 'Super Duper',
  passengers: []
};

module.exports = engine => {
  const flow = engine.flow("/lunchtrain", initialState);

  flow.command("/lunchtrain", async (action) => {
    const { body, state } = action;

    state.time = Math.floor(Date.now() / 1000);

    state.conductor = {
      id: body.user_id,
    };

    state.boardRequest = {
      channel: body.channel_id
    };

    await sendAndUpdateTrainStatus(action);
  });

  flow.button("passengerBoard", async (action) => {
    const { body, state } = action;

    state.passengers.push({
      id: body.user.id
    });

    await sendAndUpdateTrainStatus(action);
  });

  flow.button("delayTrain", async (action) => {
    const { state } = action;

    state.time = time + new Date("10 min");

    await sendAndUpdateTrainStatus(action);
  });

  flow.button("cancelTrain", async (action) => {
    const { state } = action;

    state.isCanceled = true;

    await sendAndUpdateTrainStatus(action);
  });

  flow.button("getOffTrain", async (action) => {
    const { body, state, slack } = action;

    state.passengers = state.passengers
      .filter(passenger => passenger.id !== body.user.id );

    // Update the removed passenger
    await sendOrUpdateMessage(
      slack,
      await messages.passengerInfo(action),
      await getUserDmChannel(slack, body.user.id),
      body.message_ts
    );

    await sendAndUpdateTrainStatus(action);
  });
};

async function sendOrUpdateMessage (slack, msg, channel, ts) {
  if (ts) {
    await slack.chat.update(Object.assign({
      parse: 'client',
      channel,
      ts
    }, msg));

    return ts;
  } else {
    const sent = await slack.chat.postMessage(Object.assign({
      channel
    }, msg));

    return sent.ts;
  }
}

async function getUserDmChannel (slack, id) {
  const open = await slack.conversations.open({ users: id});

  if (!open.ok) {
    throw new Error(open.message);
  }

  return open.channel.id;
}

async function sendAndUpdateTrainStatus (action) {
  const { state, slack } = action;
  const actions = [];

  actions.push(async () => {
    state.boardRequest.ts = await sendOrUpdateMessage(
      slack,
      await messages.boardRequest(action),
      state.boardRequest.channel,
      state.boardRequest.ts
    );
  });

  actions.push(async () => {
    state.conductor.ts = await sendOrUpdateMessage(
      slack,
      await messages.conductorControls(action),
      await getUserDmChannel(slack, state.conductor.id),
      state.conductor.ts
    );
  });

  actions.concat(state.passengers.map(async (passenger) => {
    passenger.ts = await sendOrUpdateMessage(
      slack,
      await messages.passengerInfo(action),
      await getUserDmChannel(slack, passenger.id),
      passenger.ts
    )
  }));

  await Promise.all(actions.map(fn => fn()));
}
