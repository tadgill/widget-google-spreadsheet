require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import {Column, Cell} from "fixed-data-table";
import ResponsiveFixedDataTable from "responsive-fixed-data-table";

const Table = React.createClass({
  getRowClassName: function(index) {
    // add 1 to index value so the first row is considered odd
    return ((index + 1) % 2) ? "odd" : "even";
  },

  render: function() {
    var cols = [];

    // Create the columns.
    for (var i = 0; i < this.props.totalCols; i++) {
      cols.push(
        <Column
          key={i}
          columnKey={i}
          width={this.props.width / this.props.totalCols}
          align={this.props.align}
          cell={ props => (
            <Cell
              width={props.width}
              height={props.height}
              className={this.props.class}
              columnKey={props.columnKey}>
              {this.props.data[props.rowIndex][props.columnKey]}
            </Cell>
          )}
        />
      );
    }

    return(
      <ResponsiveFixedDataTable
        ref={(ref) => this.table = ref}
        rowHeight={50}
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

module.exports = Table;
