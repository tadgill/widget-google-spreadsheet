require("fixed-data-table/dist/fixed-data-table.min.css");

import React from "react";
import { Column } from "fixed-data-table";
import CellContainer from "../containers/CellContainer";
import ResponsiveFixedDataTable from "../../components/responsive-fixed-data-table/lib/responsive-fixed-data-table";

const Table = React.createClass({

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
          align={this.getAlignment(i)}
          width={this.props.columnFormats[i].width}
          cell={ props => (
            <CellContainer
              width={props.width}
              height={props.height}
              data={this.props.data[props.rowIndex][props.columnKey]}
              mainClass={this.props.class}
              columnKey={props.columnKey}
              columnFormats={this.props.columnFormats}>
            </CellContainer>
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
        overflowY="hidden"
        overflowX="hidden">
        {cols}
      </ResponsiveFixedDataTable>
    );
  }
});

export default Table;
