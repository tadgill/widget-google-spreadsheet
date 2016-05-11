require("fixed-data-table/dist/fixed-data-table.min.css");

const React = require("react");
const {Table, Column, Cell} = require("fixed-data-table");

const TableHeader = React.createClass({
  // getColumnWidth: function(columnKey) {
  //   var width = stylingData.defaultColumnWidth;

  //   for (var i = 0; i < stylingData.columns.length; i++) {
  //     if (stylingData.columns[i].id === columnKey) {
  //       width = stylingData.columns[i].width;
  //       break;
  //     }
  //   }

  //   return width;
  // },

  // getColumnAlignment: function(columnKey) {
  //   var alignment = stylingData.body.style.align;

  //   for (var i = 0; i < stylingData.columns.length; i++) {
  //     if (stylingData.columns[i].id === columnKey) {
  //       alignment = stylingData.columns[i].style.align;
  //       break;
  //     }
  //   }

  //   return alignment;
  // },

  getColumnHeader: function(dataValue) {
    var value = dataValue;

    // for (var i = 0; i < stylingData.columns.length; i++) {
    //   if (stylingData.columns[i].id === columnKey) {
    //     value = stylingData.columns[i].headerText;
    //     break;
    //   }
    // }

    return value;
  },

  render: function () {
    var cols = [];

    // Create the columns.
    for (var i = 0; i < this.props.data.length; i++) {
      cols.push(
        <Column
          key={i}
          header={<Cell>{this.getColumnHeader(this.props.data[i], i)}</Cell>}
          width={this.props.width / this.props.data.length}
          // align={this.getColumnAlignment(i)}
        />
      );
    }

    return(
      <Table
        rowHeight={1}
        rowsCount={0}
        width={this.props.width}
        height={this.props.height}
        headerHeight={this.props.height}
        >
        {cols}
      </Table>
    );
  }
});

module.exports = TableHeader;
