import React from "react";
import { Column, Cell } from "fixed-data-table";
import TableHeader from "../components/TableHeader";

const TableHeaderContainer = React.createClass({
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
      return "header_font-style";
    }
  },

  getColumns: function() {
    var cols = [];

    for (var i = 0; i < this.props.data.length; i++) {
      cols.push(
        <Column
          key={i}
          header={<Cell className={this.getClassName(i)}>{this.props.data[i]}</Cell>}
          width={this.props.columnFormats[i].width}
          align={this.getAlignment(i)}
        />
      );
    }

    return cols;
  },

  render: function () {
    const { height, width } = this.props;

    return(
      <TableHeader
        width={width}
        height={height}>
        {this.getColumns()}
      </TableHeader>
    );
  }
});

export default TableHeaderContainer
