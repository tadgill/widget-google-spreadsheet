require( "fixed-data-table/dist/fixed-data-table.min.css" );

import React from "react";
import { Table } from "fixed-data-table";

const TableHeader = React.createClass( {
  render: function() {
    return (
      <Table
        rowHeight={1}
        rowsCount={0}
        width={this.props.width}
        height={this.props.height}
        headerHeight={this.props.height}
        overflowY="hidden"
        overflowX="hidden">
        {this.props.children}
      </Table>
    );
  }
} );

export default TableHeader
