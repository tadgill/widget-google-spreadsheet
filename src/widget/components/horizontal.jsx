require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import Scroller from "../../components/widget-common/dist/scroller";


const Horizontal = React.createClass({

  scroller: null,
  scrollerReady: false,
  waitingForUpdate: false,
  waitingToStart: false,


  componentDidMount: function() {
    this.initScroller();
  },

  componentDidUpdate: function() {
    this.waitingForUpdate = true;
  },

  initScroller: function() {
    var scrollerElem = this.refs.scroller;

    this.scroller = new Scroller(this.getParams());

    scrollerElem.addEventListener("ready", this.onScrollerReady);
    scrollerElem.addEventListener("done", this.onScrollerDone);

    this.scroller.init(this.getItems());
  },

  getParams: function() {
    var params = {};
    params.width = this.props.width;
    params.height = this.props.height;
    params.transition = {};
    params.transition.speed = this.props.scroll.speed;

    return params;
  },

  onScrollerReady: function() {
    this.scrollerReady = true;
    this.start();
  },

  onScrollerDone: function() {
    if (this.waitingForUpdate) {
      this.waitingForUpdate = false;

      // Refresh scroller.
      this.scroller.refresh(this.getItems());
    }
    this.props.onDone();
  },

  getItems: function() {
    var items = [];
    var item = {};
    item.text = "";
    for (var i = 0; i < this.props.data.length; i++) {

      for (var j = 0; j < this.props.data[i].length; j++) {
        item.text += this.props.data[i][j] + " ";
      }

    }
    item.fontStyle = this.props.bodyFontStyle;
    items.push(item);

    return items;
  },

  start: function() {
    if (this.scroller && this.scrollerReady && (this.props.data.length > 0)) {
      this.scroller.play();
    }
    else {
      this.waitingToStart = true;
    }
  },

  stop: function() {
    this.waitingToStart = false;

    if (this.scroller) {
      this.scroller.pause();
    }
  },

  play: function() {
    this.start();
  },

  pause: function() {
    this.stop();
  },

  render: function() {

    return(
      <canvas id="scroller" ref="scroller">
        Canvas is not supported.
      </canvas>
    );
  }
});

export default Horizontal;