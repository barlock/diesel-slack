import React from "react";
import PropTypes from "prop-types";
import { render, components} from "slack-react";
const { Message, Attachment, Button, User } = components;

const BoardReqest = ({ train }) => {
  const { conductor, place, time, passengers = [] } = train;

  return (
    <Message>
      <Attachment fallback="To board the train, DM the conductor" color="#f6ba52">
        Choo choo! <User id={conductor}/> started a train to {place} at {time}.
        { passengers.length > 0 ? passengers
          .map((passenger) => <User key={passenger.id} id={passenger.id}/>)
          : null} Will you join?

        <Button name="board">Board the Train</Button>
      </Attachment>
    </Message>
  );
};

BoardReqest.propTypes = {
  train: PropTypes.object.isRequired,
};

export default (action, context) =>
  render(React.createElement(BoardReqest, context));
