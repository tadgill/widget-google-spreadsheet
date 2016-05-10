// const React = require("react");
// const {Table, Column, Cell} = require("fixed-data-table");
// const sheet = document.querySelector("rise-google-sheet");

// const SpreadsheetHeader = React.createClass({
//   getInitialState: function() {
//     return {
//       data: null
//     };
//   },

//   componentDidMount: function() {
//     sheet.addEventListener("rise-google-sheet-response", function(e) {
//       if (e.detail && e.detail.cells) {
//         this.setState({data: e.detail.cells});
//       }
//     }.bind(this));

//     sheet.go();
//   },

//   componentWillUnmount: function() {
//     sheet.removeEventListener("rise-google-sheet-response");
//   },

//   getColumnWidth: function(columnKey) {
//     var width = stylingData.defaultColumnWidth;

//     for (var i = 0; i < stylingData.columns.length; i++) {
//       if (stylingData.columns[i].id === columnKey) {
//         width = stylingData.columns[i].width;
//         break;
//       }
//     }

//     return width;
//   },

//   getColumnAlignment: function(columnKey) {
//     var alignment = stylingData.body.style.align;

//     for (var i = 0; i < stylingData.columns.length; i++) {
//       if (stylingData.columns[i].id === columnKey) {
//         alignment = stylingData.columns[i].style.align;
//         break;
//       }
//     }

//     return alignment;
//   },

//   getColumnHeaders: function(totalCols) {
//     var headers = [],
//       startingCell = 1; // account for empty first row of cells except for last cell with current time

//     for (var i = startingCell; i < (startingCell + totalCols); i += 1) {
//       headers.push(this.state.data[i].content.$t);
//     }

//     return headers;
//   },

//   getColumnHeader: function(dataValue, columnKey) {
//     var value = dataValue;

//     for (var i = 0; i < stylingData.columns.length; i++) {
//       if (stylingData.columns[i].id === columnKey) {
//         value = stylingData.columns[i].headerText;
//         break;
//       }
//     }

//     return value;
//   },

//   render: function () {
//     var totalCols = 6,
//       columnHeaders = null,
//       cols = [];

//     if (this.state.data) {
//       columnHeaders = this.getColumnHeaders(totalCols);

//       // Create the columns.
//       for (var i = 0; i < totalCols; i++) {
//         cols.push(
//           <Column
//             columnKey={i}
//             header={<Cell className={stylingData.headers.className}>{this.getColumnHeader(columnHeaders[i], i)}</Cell>}
//             width={this.getColumnWidth(i)}
//             align={this.getColumnAlignment(i)}
//           />
//         );
//       }

//       return(
//         <Table
//           rowHeight={1}
//           rowsCount={0}
//           width={1400}
//           height={stylingData.rows.height}
//           headerHeight={stylingData.rows.height}>
//           {cols}
//         </Table>
//       );
//     }
//     else {
//       return null;
//     }
//   }
// });
