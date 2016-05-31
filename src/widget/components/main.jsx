import React from "react";

const Spreadsheet = require("./spreadsheet");
const Message = require("./message");

const Main = React.createClass({

  getInitialState: function() {
    return {
      showMessage: false,
      messageText: ""
    }
  },

  initSize: function(width, height) {
    document.getElementById("mainContainer").style.width = width + "px";
    document.getElementById("mainContainer").style.height = height + "px";
  },

  showMessage: function(messageText) {
    this.setState({
      showMessage: true,
      messageText: messageText
    });
  },

  hideMessage: function() {
    this.setState({
      showMessage: false,
      messageText: ""
    });
  },

  render: function () {
    return (
      <div id="main">
        <div id="spreadsheetContainer" className={!this.state.showMessage ? "show" : "hide"}>
          <Spreadsheet
            initSize={this.initSize}
            showMessage={this.showMessage}
            hideMessage={this.hideMessage} />
        </div>
        <div id="messageContainer" className={this.state.showMessage ? "show" : "hide"}>
          <Message text={this.state.messageText} />
        </div>
      </div>
      )
  }

});

module.exports = Main;
