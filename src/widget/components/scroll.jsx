require("fixed-data-table/dist/fixed-data-table.min.css");

require( "fixed-data-table/dist/fixed-data-table.min.css" );

import React from "react";
import Table from "./table";


import "../../components/gsap/src/uncompressed/TweenLite"
import "../../components/gsap/src/uncompressed/plugins/CSSPlugin";
import "../../components/gsap/src/uncompressed/utils/Draggable";
import "../../components/gsap/src/uncompressed/plugins/ScrollToPlugin";

import "../../components/auto-scroll/jquery.auto-scroll";

const Scroll = React.createClass( {

  scroll: "",
  height: 0,

  componentWillMount: function () {
    this.height = this.props.height;
  },

  componentWillUpdate: function(nextProps, nextState) {
    this.height = (nextProps.data.length * nextProps.rowHeight) + ((nextProps.hasHeader) ? nextProps.rowHeight : 0)
    $(this.refs.page).height(this.height);

    this.scroll.data("plugin_autoScroll").destroy();
    this.scroll.autoScroll(nextProps.scroll).on("done", () => {
      nextProps.onDone();
    });
  },

  componentDidUpdate: function() {
    if (this.canScroll()) {
      this.play();
    }
  },

  componentDidMount: function() {
    this.scroll = $( this.refs.scroll );
    this.height = ( this.props.data.length * this.props.rowHeight ) + (( this.props.hasHeader ) ? this.props.rowHeight : 0 )

    $( this.refs.page ).height( this.height );

    this.scroll.autoScroll( this.props.scroll ).on( "done", () => {
      this.props.onDone();
    } );
  },

  canScroll: function() {
    return this.props.scroll.by !== "none" && this.scroll && this.scroll.data( "plugin_autoScroll" ) &&
      this.scroll.data( "plugin_autoScroll" ).canScroll();
  },

  play: function() {
    if ( this.scroll && this.scroll.data( "plugin_autoScroll" ) ) {
      this.scroll.data( "plugin_autoScroll" ).play();
    }
  },

  pause: function() {
    if ( this.scroll && this.scroll.data( "plugin_autoScroll" ) ) {
      this.scroll.data( "plugin_autoScroll" ).pause();
    }
  },

  render: function() {

    return (
      <div id="scroll" ref="scroll">
        <section className="page" ref="page">
            <Table
              data={this.props.data}
              align={this.props.align}
              class={this.props.class}
              totalCols={this.props.totalCols}
              rowHeight={this.props.rowHeight}
              width={this.props.width}
              height={this.height}
              columnFormats={this.props.columnFormats} />
        </section>
      </div>
    );
  }
} );

export default Scroll;
