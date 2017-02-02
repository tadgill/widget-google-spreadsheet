/* global describe, beforeEach, it  */

import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Column } from "fixed-data-table";
import TableHeader from "../../../src/widget/components/TableHeader";

describe( "<TableHeader />", function() {
  const width = 600,
    height = 50;

  var wrapper;

  describe( "<Table />", function() {
    beforeEach( function() {
      wrapper = shallow(
        <TableHeader width={width} height={height}>
          <Column />
        </TableHeader>
      );
    } );

    it( "Should have rowHeight prop", function() {
      expect( wrapper.props().rowHeight ).to.equal( 1 );
    } );

    it( "Should have rowsCount prop", function() {
      expect( wrapper.props().rowsCount ).to.equal( 0 );
    } );

    it( "Should have width prop", function() {
      expect( wrapper.props().width ).to.equal( width );
    } );

    it( "Should have height prop", function() {
      expect( wrapper.props().height ).to.equal( height );
    } );

    it( "Should have headerHeight prop", function() {
      expect( wrapper.props().headerHeight ).to.equal( height );
    } );

    it("Should have overflowX prop", function() {
      expect(wrapper.props().overflowX).to.equal("hidden");
    });

    it("Should have overflowY prop", function() {
      expect(wrapper.props().overflowY).to.equal("hidden");
    });

    it( "Should render children", function() {
      expect( wrapper.contains( <Column /> ) ).to.equal( true );
    } );
  } );
} );
