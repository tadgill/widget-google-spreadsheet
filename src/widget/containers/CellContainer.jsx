import React from "react";
import { Cell } from "fixed-data-table";

const CellContainer = React.createClass( {

  numericValueChange: "none",

  componentWillUpdate: function( nextProps ) {
    const { columnFormats, columnKey } = this.props;

    let columnFormat = columnFormats[ columnKey ],
      currentVal,
      nextVal;

    if ( nextProps.data !== this.props.data ) {
      if ( columnFormat.numeric ) {
        if ( columnFormat.colorCondition === "change-up" || columnFormat.colorCondition === "change-down" ) {
          nextVal = parseFloat( nextProps.data );
          currentVal = parseFloat( this.props.data );

          if ( !isNaN( nextVal ) && !isNaN( currentVal ) ) {
            // value went up or down
            this.numericValueChange = ( nextVal > currentVal ) ? "up" : "down";
          }
        }
      }
    } else {
      // no numeric value change
      this.numericValueChange = "none";
    }

  },

  createMarkup: function( html ) {
    return {
      __html: html
    }
  },

  getColorConditionClass: function( value, colorCondition ) {
    const positiveValue = "value-positive",
      changeUp = "change-up",
      negativeValue = "value-negative",
      changeDown = "change-down";

    value = parseFloat( value );

    if ( !isNaN( value ) ) {
      // Check if value is positive or negative.
      if ( ( colorCondition === positiveValue ) || ( colorCondition === negativeValue ) ) {
        if ( value > 0 ) {
          return colorCondition === positiveValue ? " green" : " red";
        } else if ( value < 0 ) {
          return colorCondition === positiveValue ? " red" : " green";
        }
      }

      // apply change conditions if value changed
      if ( colorCondition === changeUp && this.numericValueChange !== "none" ) {
        return this.numericValueChange === "up" ? " green" : " red";
      }

      if ( colorCondition === changeDown && this.numericValueChange !== "none" ) {
        return this.numericValueChange === "up" ? " red" : " green";
      }
    }

    return "";
  },

  getClassName: function() {
    const { columnFormats, columnKey, mainClass } = this.props;

    let classes = "",
      columnFormat = columnFormats[ columnKey ];

    // Column formatting overrides header formatting.
    if ( columnFormat.id !== undefined ) {
      classes = "_" + columnFormat.id;
    } else {
      classes = mainClass;
    }

    // Color conditions
    if ( columnFormat.numeric && ( columnFormat.colorCondition !== "none" ) ) {
      classes += this.getColorConditionClass( this.props.data, columnFormat.colorCondition );
    }

    return classes;
  },

  render: function() {
    return (
      <Cell
        width={this.props.width}
        height={this.props.height}
        className={this.getClassName()}
        columnKey={this.props.columnKey}>
        <span dangerouslySetInnerHTML={this.createMarkup( this.props.data )}></span>
      </Cell>
    );
  }
} );

export default CellContainer
