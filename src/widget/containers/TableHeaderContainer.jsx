import React from "react";
import { Column, Cell } from "fixed-data-table";
import TableHeader from "../components/TableHeader";

const TableHeaderContainer = React.createClass({
  getColumns: function() {
    var cols = [];

    for (var i = 0; i < this.props.data.length; i++) {
      cols.push(
        <Column
          key={i}
          header={<Cell className="header_font-style">{this.props.data[i]}</Cell>}
          width={this.props.width / this.props.data.length}
          align={this.getColumnAlignment()}
        />
      );
    }

    return cols;
  },

  getColumnAlignment: function() {
    var alignment = this.props.align;

    if (!alignment) {
      alignment = "left";
    }

    return alignment;
  },

  render: function () {
    const { height, width } = this.props;

    return(
      <TableHeader
        height={height}
        width={width}>
        {this.getColumns()}
      </TableHeader>
    );
  }
});

export default TableHeaderContainer
