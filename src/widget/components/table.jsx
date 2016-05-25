require("fixed-data-table/dist/fixed-data-table.min.css");

const React = require("react");
const ResponsiveFixedDataTable = require("responsive-fixed-data-table");
const {Column, Cell} = require("fixed-data-table");

const Table = React.createClass({
  getRowClassName: function(index) {
    // add 1 to index value so the first row is considered odd
    return ((index + 1) % 2) ? "odd" : "even";
  },

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

  // getCellClassName: function(columnKey) {
  //   var className = stylingData.body.className;

  //   for (var i = 0; i < stylingData.columns.length; i++) {
  //     if (stylingData.columns[i].id === columnKey) {
  //       className = "custom_font-style-" + columnKey;

  //       break;
  //     }
  //   }

  //   return className;
  // },

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

  render: function() {
    var cols = [];

    // Create the columns.
    for (var i = 0; i < this.props.totalCols; i++) {
      cols.push(
        <Column key={i} columnKey={i}
           width={this.props.width / this.props.totalCols}
          // align={this.getColumnAlignment(i)}
          cell={ props => (
            <Cell
              width={props.width}
              height={props.height}
              // className={this.getCellClassName(props.key)}
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
