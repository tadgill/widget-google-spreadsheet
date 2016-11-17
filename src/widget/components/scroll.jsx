require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import Table from "./table";

var $ = require("jquery");
import "../../components/gsap/src/uncompressed/TweenLite"
import "../../components/gsap/src/uncompressed/plugins/CSSPlugin";
import "../../components/gsap/src/uncompressed/utils/Draggable";
import "../../components/gsap/src/uncompressed/plugins/ScrollToPlugin";

import "../../components/auto-scroll/jquery.auto-scroll";

const Scroll = React.createClass({

  scroll: "",

  componentDidMount: function() {
    this.scroll = $(this.refs.scroll);

    $(this.refs.page).height((this.props.data.length * this.props.rowHeight) + ((this.props.hasHeader) ? this.props.rowHeight : 0));

    this.scroll.autoScroll(this.props.scroll).on("done", () => {
      this.props.onDone();
    });
  },

  canScroll: function() {
    return this.props.scroll.by !== "none" && this.scroll && this.scroll.data("plugin_autoScroll") &&
      this.scroll.data("plugin_autoScroll").canScroll();
  },

  play: function() {
    if (this.scroll && this.scroll.data("plugin_autoScroll")) {
      this.scroll.data("plugin_autoScroll").play();
    }
  },

  pause: function() {
    if (this.scroll && this.scroll.data("plugin_autoScroll")) {
      this.scroll.data("plugin_autoScroll").pause();
    }
  },

  render: function() {

    return(
      <div id="scroll" ref="scroll">
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

export default Scroll;
