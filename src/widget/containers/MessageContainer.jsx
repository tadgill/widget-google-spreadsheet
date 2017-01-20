import React from "react";
import Message from "../components/message";

const MessageContainer = React.createClass( {

  propTypes: {
    show: React.PropTypes.bool.isRequired,
    text: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div id="messageContainer" className={this.props.show ? "show" : "hide"}>
        <Message text={this.props.text} />
      </div>
    );
  }
} );

export default MessageContainer
