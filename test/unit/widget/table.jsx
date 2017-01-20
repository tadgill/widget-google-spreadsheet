/* global describe, beforeEach, it  */

import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import {} from "fixed-data-table";
import Table from "../../../src/widget/components/table";
import CellContainer from "../../../src/widget/containers/CellContainer";

describe( "<Table />", function() {
  const align = "center",
    width = 600,
    height = 50,
    totalCols = 3,
    rowHeight = 50,
    cellClassName = "body_font-style";

  var data = [ [ "I am the<br> walrus!", "1", "-3" ],
      [ "John is dead!", "500", "-32" ] ],
    columnFormats = [ { "width": 100 }, { "width": 200 }, { "width": 300 } ],
    wrapper;

  describe( "<ResponsiveFixedDataTable />", function() {
    beforeEach( function() {
      wrapper = shallow( <Table data={data} align={align} class={cellClassName} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} /> );
    } );

    it( "Should have rowHeight prop", function() {
      expect( wrapper.props().rowHeight ).to.be.equal( 50 );
    } );

    it( "Should have rowsCount prop", function() {
      expect( wrapper.props().rowsCount ).to.equal( 2 );
    } );

    it( "Should have width prop", function() {
      expect( wrapper.props().width ).to.equal( width );
    } );

    it( "Should have height prop", function() {
      expect( wrapper.props().height ).to.equal( height );
    } );

    it( "Should have headerHeight prop", function() {
      expect( wrapper.props().headerHeight ).to.equal( 0 );
    } );

    it( "Should have overflowY prop", function() {
      expect( wrapper.props().overflowY ).to.equal( "hidden" );
    } );

    it( "Should have overflowX prop", function() {
      expect( wrapper.props().overflowX ).to.equal( "hidden" );
    } );

    it( "Should have correct number of columns", function() {
      expect( wrapper.props().children.length ).to.equal( 3 );
    } );
  } );

  describe( "<Column />", function() {
    beforeEach( function() {
      wrapper = shallow( <Table data={data} align={align} class={cellClassName} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} /> );
    } );

    it( "Should have key prop", function() {
      expect( wrapper.props().children[ 0 ].key ).to.equal( "0" );
    } );

    it( "Should have width prop", function() {
      expect( wrapper.props().children[ 0 ].props.width ).to.equal( columnFormats[ 0 ].width );
    } );

    it( "Should have cell prop", function() {
      expect( wrapper.props().children[ 0 ].props.cell ).to.be.a( "function" );
    } );

    describe( "Alignment", function() {
      it( "Should use alignment from align prop", function() {
        expect( wrapper.props().children[ 0 ].props.align ).to.equal( align );
      } );

      it( "Should use default alignment if neither align nor columnFormats.alignment props exist", function() {
        wrapper = shallow( <Table data={data} class={cellClassName} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} /> );

        expect( wrapper.props().children[ 0 ].props.align ).to.equal( "left" );
      } );

      it( "Should use alignment from columnFormats prop", function() {
        columnFormats = [
          { "alignment": "right", "width": 100 },
          { "width": 200 },
          { "width": 300 }
        ];

        wrapper = shallow( <Table data={data} align={align} class={cellClassName} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} /> );

        expect( wrapper.props().children[ 0 ].props.align ).to.equal( columnFormats[ 0 ].alignment );
      } );
    } );

    describe( "<CellContainer />", function() {

      beforeEach( function() {
        wrapper = mount( <Table data={data} align={align} class={cellClassName} totalCols={totalCols}
                               rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} /> );
      } );

      it( "Should have data prop", function() {
        expect( wrapper.find( CellContainer ).last().props().data ).to.equal( "-3" );
      } );

      it( "Should have mainClass prop", function() {
        expect( wrapper.find( CellContainer ).last().props().mainClass ).to.equal( cellClassName );
      } );

      it( "Should have columnFormats prop", function() {
        expect( wrapper.find( CellContainer ).last().props().columnFormats ).to.deep.equal( columnFormats );
      } );

      it( "Should have columnKey prop", function() {
        expect( wrapper.find( CellContainer ).last().props().columnKey ).to.equal( 2 );
      } );

    } );
  } );
} );
