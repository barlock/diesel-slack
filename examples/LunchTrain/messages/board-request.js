import React from "react";
import PropTypes from "prop-types";
import { render, components} from "slack-react";
const { Message, Attachment, Button, User } = components;

const BoardReqest = ({ id, state }) => {
  const { conductor, place, time, passengers = [] } = state;
  return (
    <Message>
      <Attachment
        callbackId={id}
        fallback="To board the train, DM the conductor"
        color="#f6ba52">
        Choo choo! <User id={conductor.id}/> started a train to {place} at {time}.
        { passengers.length > 0 ? passengers
          .map((passenger) => <User key={passenger.id} id={passenger.id}/>)
          : null} Will you join?

        <Button name="board">Board the Train</Button>
      </Attachment>
    </Message>
  );
};

BoardReqest.propTypes = {
  id: PropTypes.string,
  state: PropTypes.object
};

export default (action) =>
  render(React.createElement(BoardReqest, action));
