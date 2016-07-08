require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import Table from "./table";

var $ = require("jquery");
import "../../components/gsap/src/uncompressed/TweenLite"
import "../../components/gsap/src/uncompressed/plugins/CSSPlugin";
import "../../components/gsap/src/uncompressed/utils/Draggable";
import "../../components/gsap/src/uncompressed/plugins/ScrollToPlugin";

import "../../components/auto-scroll/jquery.auto-scroll";

const Vertical = React.createClass({

  scroller: "",

  componentDidMount: function() {
    this.scroller = $(this.refs.scroller);
    $(this.refs.page).height(this.props.data.length * this.props.rowHeight);
  },

  play: function() {
    if (this.scroller) {
      if (this.scroller.data("plugin_autoScroll") === undefined) {
        var self = this;
        this.scroller.autoScroll(this.props.scroll).on("done", function () {
          self.props.onDone();
        });
        this.scroller.data("plugin_autoScroll").play();
      } else {
        this.scroller.data("plugin_autoScroll").play();
      }
    }
  },

  pause: function() {
    if (this.scroller && this.scroller.data("plugin_autoScroll")) {
      this.scroller.data("plugin_autoScroll").pause();
    }
  },

  render: function() {

    return(
      <div id="scroller" ref="scroller">
        <section className="page" ref="page">
          <Table
            data={this.props.data}
            align={this.props.align}
            class={this.props.class}
            totalCols={this.props.totalCols}
            rowHeight={this.props.rowHeight}
            width={this.props.width}
            height={this.props.height}
            columnFormats={this.props.columnFormats} />
        </section>
      </div>
    );
  }
});

export default Vertical;
