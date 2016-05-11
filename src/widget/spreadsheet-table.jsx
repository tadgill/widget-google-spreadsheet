// const React = require("react");
// const ResponsiveFixedDataTable = require("responsive-fixed-data-table");
// const {Table, Column, Cell} = require("fixed-data-table");

// const SpreadsheetTable = React.createClass({
//   getInitialState: function() {
//     return {
//       data: null
//     };
//   },

//   componentDidMount: function() {
//     var $app = $("#app");

//     sheet.addEventListener("rise-google-sheet-response", function(e) {
//       if (e.detail && e.detail.cells) {
//         this.setState({ data: e.detail.cells });
//       }

//       // Must execute after data is rendered.
//       $(".page").height(this.table.props.rowsCount * this.table.props.rowHeight);

//       if ($app.data("plugin_autoScroll") === undefined) {
//         $app.autoScroll({
//           "by": "continuous",
//           "speed": "fastest"
//         }).on("done", function () {
//           $app.data("plugin_autoScroll").play();
//         });

//         $app.data("plugin_autoScroll").play();
//       }
//     }.bind(this));

//     sheet.go();
//   },

//   componentWillUnmount: function() {
//     sheet.removeEventListener("rise-google-sheet-response");
//   },

//   // Convert data to a two-dimensional array of rows.
//   getRows: function(totalCols) {
//     var rows = [],
//       row = null,
//       startingCell = totalCols + 1; // account for empty first row of cells and column header cells

//     for (var i = startingCell; i < this.state.data.length; i++) {

//       if (this.state.data[i].gs$cell.col === '1') {
//         if (row !== null) {
//           rows.push(row);
//         }

//         row = [];
//       }

//       row.push(this.state.data[i].content.$t);
//     }

//     rows.push(row);

//     return rows;
//   },

//   getRowClassName: function(index) {
//     // add 1 to index value so the first row is considered odd
//     return ((index + 1) % 2) ? "odd" : "even";
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

//   getCellClassName: function(columnKey) {
//     var className = stylingData.body.className;

//     for (var i = 0; i < stylingData.columns.length; i++) {
//       if (stylingData.columns[i].id === columnKey) {
//         className = "custom_font-style-" + columnKey;

//         break;
//       }
//     }

//     return className;
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

//   render: function() {
//     var totalCols = 6,
//       rows = null,
//       cols = [];

//     if (this.state.data) {
//       rows = this.getRows(totalCols);

//       // Create the columns.
//       for (var i = 0; i < totalCols; i++) {
//         cols.push(
//           <Column columnKey={i}
//             width={this.getColumnWidth(i)}
//             align={this.getColumnAlignment(i)}
//             cell={ props => (
//               <Cell
//                 width={props.width}
//                 height={props.height}
//                 className={this.getCellClassName(props.columnKey)}
//                 columnKey={props.columnKey}>
//                 {rows[props.rowIndex][props.columnKey]}
//               </Cell>
//             )}
//           />
//         );
//       }

//       return(
//         <ResponsiveFixedDataTable
//           ref={(ref) => this.table = ref}
//           rowHeight={stylingData.rows.height}
//           rowsCount={rows.length}
//           rowClassNameGetter={this.getRowClassName}
//           width={1400}    // rsW
//           height={700}   // rsH
//           headerHeight={0}
//           overflowY="hidden">
//           {cols}
//         </ResponsiveFixedDataTable>
//       );
//     }
//     else {
//       return null;
//     }
//   }
// });
