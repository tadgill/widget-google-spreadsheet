import React from "react";

var PropTypes = React.PropTypes;

function Message( props ) {
  return (
    <p className="message">{props.text}</p>
  )
}

Message.propTypes = {
  text: PropTypes.string.isRequired
};

export default Message;
