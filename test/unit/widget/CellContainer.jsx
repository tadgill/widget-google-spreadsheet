/* global describe, beforeEach, it  */

import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import CellContainer from "../../../src/widget/containers/CellContainer";
import { Cell } from "fixed-data-table";

describe( "<CellContainer />", function() {

  const mainClassName = "body_font-style";

  var columnFormats = [ { "width": 100 }, { "width": 200 }, { "width": 300 } ],
    wrapper;

  describe( "<Cell />", function() {

    beforeEach( function() {
      wrapper = mount( <CellContainer data={"I am the walrus!"} mainClass={mainClassName} columnKey={2}
                             width={100} height={50} columnFormats={columnFormats} /> );
    } );

    it( "Should set cell text", function() {
      expect( wrapper.find( "span" ).at( 0 ).text() ).to.equal( "I am the walrus!" );
    } );

    it( "Should use className from mainClass prop", function() {
      expect( wrapper.find( Cell ).props().className ).to.equal( mainClassName );
    } );

    it( "Should use className from columnFormats prop", function() {
      columnFormats = [
        { "width": 100 },
        { "width": 200 },
        { "id": "2", "width": 300 }
      ];

      wrapper = mount( <CellContainer data={"I am the walrus!"} mainClass={mainClassName} columnKey={2}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 2 ].id );
    } );

    it( "Should add 'green' class for a positive number when condition is 'value-positive'", function() {
      columnFormats = [
        { width: 100 },
        { id: "1", width: 200, numeric: true, colorCondition: "value-positive" },
        { width: 300 }
      ];

      wrapper = mount( <CellContainer data={"5"} mainClass={mainClassName} columnKey={1}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 1 ].id + " green" );
    } );

    it( "Should add 'red' class for a negative number when condition is 'value-positive'", function() {
      columnFormats = [
        { width: 100 },
        { width: 200 },
        { id: "2", width: 300, numeric: true, colorCondition: "value-positive" }
      ];

      wrapper = mount( <CellContainer data={"-5"} mainClass={mainClassName} columnKey={2}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 2 ].id + " red" );
    } );


    it( "Should add 'red' class for a positive number when condition is 'value-negative'", function() {
      columnFormats = [
        { width: 100 },
        { id: "1", width: 200, numeric: true, colorCondition: "value-negative" },
        { width: 300 }
      ];

      wrapper = mount( <CellContainer data={"5"} mainClass={mainClassName} columnKey={1}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 1 ].id + " red" );
    } );

    it( "Should add 'green' class for a negative number when condition is 'value-negative'", function() {
      columnFormats = [
        { width: 100 },
        { width: 200 },
        { id: "2", width: 300, numeric: true, colorCondition: "value-negative" }
      ];

      wrapper = mount( <CellContainer data={"-5"} mainClass={mainClassName} columnKey={2}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 2 ].id + " green" );
    } );

    it( "Should not add color condition class if value is not a number", function() {
      columnFormats = [
        { id: "0", width: 100, numeric: true, colorCondition: "value-positive" },
        { width: 200 },
        { width: 300 }
      ];

      wrapper = mount( <CellContainer data={"Not a number"} mainClass={mainClassName} columnKey={0}
                                     width={100} height={50} columnFormats={columnFormats} /> );

      expect( wrapper.find( Cell ).props().className ).to.equal( "_" + columnFormats[ 0 ].id );
    } );

  } );

} );
