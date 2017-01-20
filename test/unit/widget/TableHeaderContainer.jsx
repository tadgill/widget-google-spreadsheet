/* global describe, beforeEach, it  */

import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import { Cell } from "fixed-data-table";
import TableHeaderContainer from "../../../src/widget/containers/TableHeaderContainer"
import TableHeader from "../../../src/widget/components/TableHeader";

describe( "<TableHeaderContainer />", function() {
  const align = "center",
    width = 600,
    height = 50,
    data = [ "Column 1", "Column 2", "Column 3" ];

  var wrapper,
    columnFormats = [ { "width": 100 }, { "width": 200 }, { "width": 300 } ];

  describe( "<TableHeader />", function() {
    beforeEach( function() {
      wrapper = shallow( <TableHeaderContainer align={align} data={data} width={width} height={height}
        columnFormats={columnFormats} /> );
    } );

    it( "Should contain a TableHeader component", function() {
      expect( wrapper.find( TableHeader ) ).to.exist;
    } );

    it( "Should have width prop", function() {
      expect( wrapper.props().width ).to.equal( width );
    } );

    it( "Should have height prop", function() {
      expect( wrapper.props().height ).to.equal( height );
    } );

    it( "Should have correct number of columns as children", function() {
      expect( wrapper.props().children.length ).to.equal( 3 );
    } );
  } );

  describe( "<Column />", function() {
    beforeEach( function() {
      wrapper = shallow( <TableHeaderContainer align={align} data={data} width={width} height={height}
        columnFormats={columnFormats} /> );
    } );

    it( "Should have key prop", function() {
      expect( wrapper.props().children[ 0 ].key ).to.equal( "0" );
    } );

    it( "Should have header prop", function() {
      expect( wrapper.props().children[ 0 ].props.header ).to.exist;
    } );

    it( "Should have width prop", function() {
      expect( wrapper.props().children[ 0 ].props.width ).to.equal( columnFormats[ 0 ].width );
    } );

    describe( "Alignment", function() {
      it( "Should use alignment from align prop", function() {
        expect( wrapper.props().children[ 0 ].props.align ).to.equal( align );
      } );

      it( "Should use default alignment if align props doesn't exist", function() {
        wrapper = shallow( <TableHeaderContainer data={data} width={width} height={height}
          columnFormats={columnFormats} /> );

        expect( wrapper.props().children[ 0 ].props.align ).to.equal( "left" );
      } );

    } );
  } );

  describe( "<Cell />", function() {

    beforeEach( function() {
      wrapper = mount( <TableHeaderContainer align={align} data={data} width={width} height={height}
        columnFormats={columnFormats} /> );
    } );

    it( "Should have correct number of cells", function() {
      expect( wrapper.find( Cell ).length ).to.equal( 3 );
    } );

    it( "Should set cell text", function() {
      expect( wrapper.find( Cell ).first().text() ).to.equal( data[ 0 ] );
    } );

    it( "Should have className prop", function() {
      expect( wrapper.find( Cell ).first().props().className ).to.equal( "header_font-style" );
    } );

  } );
} );
