import React from "react";
import PropTypes from "prop-types";
import { render, components} from "slack-react";
const { Message, Attachment, Button, User } = components;

const ConductorControls = ({ train }) => {
    const { place, time, passengers } = train;

    return (
        <Message>
            <Attachment fallback="Let your passengers know it's time to leave" color="#f6ba52">
                You started a train to {place} at {time}.
                { passengers.length > 0 ? passengers
                    .map(passenger => <User key={passenger.id} id={passenger.id}/>) : null} are on board.

                <Button name="delay">Delay 10 min</Button>
                <Button name="cancel">Cancel Train</Button>
            </Attachment>
        </Message>
    );
};

ConductorControls.propTypes = {
    train: PropTypes.object.isRequired
};

export default (action, { train }) =>
    render(<ConductorControls train={train}/>);
