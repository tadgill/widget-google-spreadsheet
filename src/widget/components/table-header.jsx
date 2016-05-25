require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import {Table, Column, Cell} from "fixed-data-table";

const TableHeader = React.createClass({
  render: function () {
    var cols = [];

    // Create the columns.
    for (var i = 0; i < this.props.data.length; i++) {
      cols.push(
        <Column
          key={i}
          header={<Cell className={this.props.class}>{this.props.data[i]}</Cell>}
          width={this.props.width / this.props.data.length}
          align={this.props.align}
        />
      );
    }

    return(
      <Table
        rowHeight={1}
        rowsCount={0}
        width={this.props.width}
        height={this.props.height}
        headerHeight={this.props.height}>
        {cols}
      </Table>
    );
  }
});

module.exports = TableHeader;
