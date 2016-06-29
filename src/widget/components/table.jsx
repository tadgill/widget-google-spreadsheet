require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import {Column, Cell} from "fixed-data-table";
import ResponsiveFixedDataTable from "responsive-fixed-data-table";

const Table = React.createClass({

  createMarkup: function(html) {
    return {
      __html: html
    }
  },

  getRowClassName: function(index) {
    // add 1 to index value so the first row is considered odd
    return ((index + 1) % 2) ? "odd" : "even";
  },

  getAlignment: function(index) {
    var { align, columnFormats } = this.props;

    // Column formatting overrides header formatting.
    if (columnFormats[index].alignment) {
      return columnFormats[index].alignment;
    }
    else if (align) {
      return align;
    }
    else {
      return "left";
    }
  },

  getClassName: function(index) {
    var { columnFormats } = this.props;

    // Column formatting overrides header formatting.
    if (columnFormats[index].id) {
      return columnFormats[index].id;
    }
    else {
      return this.props.class;
    }
  },

  render: function() {
    var cols = [];

    // Create the columns.
    for (var i = 0; i < this.props.totalCols; i++) {
      cols.push(
        <Column
          key={i}
          columnKey={i}
          align={this.getAlignment(i)}
          width={this.props.columnFormats[i].width}
          cell={ props => (
            <Cell
              width={props.width}
              height={props.height}
              className={this.getClassName(props.columnKey)}
              columnKey={props.columnKey}>
              <span dangerouslySetInnerHTML={this.createMarkup(this.props.data[props.rowIndex][props.columnKey])}></span>
            </Cell>
          )}
        />
      );
    }

    return(
      <ResponsiveFixedDataTable
        rowHeight={this.props.rowHeight}
        rowsCount={this.props.data.length}
        rowClassNameGetter={this.getRowClassName}
        width={this.props.width}
        height={this.props.height}
        headerHeight={0}
        overflowY="hidden">
        {cols}
      </ResponsiveFixedDataTable>
    );
  }
});

export default Table;
