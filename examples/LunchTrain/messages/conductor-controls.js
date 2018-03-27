import React from "react";
import PropTypes from "prop-types";
import { render, components} from "slack-react";
const { Message, Attachment, Button, User } = components;

const ConductorControls = ({ id, state }) => {
  const { place, time, passengers } = state;

  return (
    <Message>
      <Attachment
        callbackId={id}
        fallback="Let your passengers know it's time to leave"
        color="#f6ba52">
        You started a train to {place} at {`<!date^${time}^{time}|${time}>`}.
        { passengers.length > 0 ?
          passengers
            .map((passenger) => <User key={passenger.id} id={passenger.id}/>)
            .concat([" are on board."])
          : null}

        <Button name="delayTrain">Delay 10 min</Button>
        <Button name="cancelTrain">Cancel Train</Button>
      </Attachment>
    </Message>
  );
};

ConductorControls.propTypes = {
  state: PropTypes.object.isRequired
};

export default (action) =>
  render(React.createElement(ConductorControls, action));
