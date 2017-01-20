import React from "react";
import { Column, Cell } from "fixed-data-table";
import TableHeader from "../components/TableHeader";

const TableHeaderContainer = React.createClass( {
  getAlignment: function() {
    var { align } = this.props;

    if ( align ) {
      return align;
    } else {
      return "left";
    }
  },

  getColumns: function() {
    var cols = [],
      i;

    for ( i = 0; i < this.props.data.length; i++ ) {
      cols.push(
        <Column
          key={i}
          header={<Cell className={"header_font-style"}>{this.props.data[ i ]}</Cell>}
          width={this.props.columnFormats[ i ].width}
          align={this.getAlignment( i )}
        />
      );
    }

    return cols;
  },

  render: function() {
    const { height, width } = this.props;

    return (
      <TableHeader
        width={width}
        height={height}>
        {this.getColumns()}
      </TableHeader>
    );
  }
} );

export default TableHeaderContainer
