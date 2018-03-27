import React from "react";
import PropTypes from "prop-types";
import { render, components} from "slack-react";
const { Message, Attachment, Button, User } = components;

const PassengerInfo = ({body, id, state }) => {
  const { conductor, place, time, passengers } = state;
  const isGetOffAction = body.actions && body.actions
    .find(action => action.name === 'getOffTrain');

  return (
    <Message>
      <Attachment
        callbackId={id}
        fallback="Tell your conductor you want off the train"
        color="#f6ba52">
        You've joined <User id={conductor.id}/>'s train to {place}. It will leave at {`<!date^${time}^{time}|${time}>`}.
        Meet { passengers.length > 0 ?
          passengers
            .map((passenger) => <User key={passenger.id} id={passenger.id}/>)
            .concat([" by the entrance."])
          : null}

        {isGetOffAction ?
          '\n\n:white_check_mark: You got off the train' :
          <Button name="getOffTrain">Get Off Train</Button>
        }
      </Attachment>
    </Message>
  );
};

PassengerInfo.propTypes = {
  state: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default (action) =>
  render(React.createElement(PassengerInfo, action));
