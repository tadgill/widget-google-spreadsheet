require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import Table from "./table";
import Horizontal from "./horizontal";
import Vertical from "./vertical";

const Scroll = React.createClass({

  play: function() {
    if (this.isScrollingLeft()) {
      this.refs.horizontal.play();
    } else {
      this.refs.vertical.play();
    }
  },

  pause: function() {
    if (this.isScrollingLeft()) {
      this.refs.horizontal.pause();
    } else {
      this.refs.vertical.pause();
    }
  },

  isScrollingLeft: function() {
    return this.props.scroll.direction == "left";
  },

  render: function() {

    return(
      <div id="scroll" ref="scroll">
        {this.isScrollingLeft() ?
          <Horizontal ref="horizontal"
            onDone={this.props.onDone}
            data={this.props.data}
            bodyFontStyle={this.props.bodyFontStyle}
            scroll={this.props.scroll}
            width={this.props.width}
            height={this.props.height}
          />
        :
          <Vertical ref="vertical"
            onDone={this.props.onDone}
            scroll={this.props.scroll}
            data={this.props.data}
            align={this.props.align}
            class={this.props.class}
            totalCols={this.props.totalCols}
            rowHeight={this.props.rowHeight}
            width={this.props.width}
            height={this.props.height}
            columnFormats={this.props.columnFormats} />
        }
      </div>
    );
  }
});

export default Scroll;
