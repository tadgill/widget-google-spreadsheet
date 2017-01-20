/* global describe, before, beforeEach, after, afterEach, it, sinon  */

import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import TableHeaderContainer from "../../../src/widget/containers/TableHeaderContainer";
import Table from "../../../src/widget/components/table";
import "../../data/spreadsheet-range";

describe( "Spreadsheet Range", function() {

  let server,
    wrapper;
  const data = [ [ "Column 1", "Column 2", "Column 3" ], [ "A2", "B2", "C2" ] ];

  var propHandlers = {
    initSize: function() {},
    showMessage: function() {},
    hideMessage: function() {}
  };

  before( function() {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
    server.respondWith( "GET", "https://sheets.googleapis.com/v4/spreadsheets/xxxxxxxxxx?key=abc123",
      [ 200, { "Content-Type": "application/json" },
        "{ \"sheets\": [{ \"properties\": { \"title\": \"Sheet1\" } }] }" ] );
  } );

  beforeEach( function() {
    wrapper = mount( <Spreadsheet initSize={propHandlers.initSize}
                                 showMessage={propHandlers.showMessage}
                                 hideMessage={propHandlers.hideMessage} /> );
  } );

  after( function() {
    server.restore();
  } );

  describe( "<TableHeaderContainer />", function() {
    beforeEach( function() {
      wrapper.setState( { data: data } );
    } );

    it( "Should contain a TableHeaderContainer component", function() {
      expect( wrapper.find( TableHeaderContainer ) ).to.have.length( 1 );
    } );

    it( "Should have data prop", function() {
      var expected = [ "Custom Header", "Column 2", "Column 3" ];

      expect( wrapper.find( TableHeaderContainer ).props().data ).to.deep.equal( expected );
    } );

  } );

  describe( "<Table />", function() {
    beforeEach( function() {
      wrapper.setState( { data: data } );
    } );

    it( "Should contain a Table component", function() {
      expect( wrapper.find( Table ) ).to.have.length( 1 );
    } );

    it( "Should have data prop", function() {
      expect( wrapper.find( Table ).props().data ).to.deep.equal( [ data[ 1 ] ] );
    } );

    it( "Should have totalCols prop", function() {
      expect( wrapper.find( Table ).props().totalCols ).to.equal( 3 );
    } );
  } );

  describe( "Don't Use First Row As Header", function() {
    beforeEach( function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = false;
      wrapper = mount( <Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} /> );
      wrapper.setState( { data: data } );
    } );

    afterEach( function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = true;
    } );

    it( "Should not contain a TableHeaderContainer component", function() {
      expect( wrapper.find( TableHeaderContainer ) ).to.have.length( 0 );
    } );

    it( "Should have data prop", function() {
      expect( wrapper.find( Table ).props().data ).to.deep.equal( data );
    } );
  } );

  describe( "Single cell range", function() {

    beforeEach( function() {
      wrapper = mount( <Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} /> );
      wrapper.setState( { data: [ [ "Cell B3" ] ] } );
    } );

    it( "Should contain a TableHeaderContainer component", function() {
      expect( wrapper.find( TableHeaderContainer ) ).to.have.length( 1 );
    } );

    it( "Should have data prop", function() {
      expect( wrapper.find( TableHeaderContainer ).props().data ).to.deep.equal( [ "Custom Header" ] );
    } );

    it( "Should not contain a Table component", function() {
      expect( wrapper.find( Table ) ).to.have.length( 0 );
    } );
  } );

  describe( "Single cell range without first row as header", function() {

    beforeEach( function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = false;
      wrapper = mount( <Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} /> );
      wrapper.setState( { data: [ [ "B3" ] ] } );
    } );

    afterEach( function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = true;
    } );

    it( "Should not contain a TableHeaderContainer component", function() {
      expect( wrapper.find( TableHeaderContainer ) ).to.have.length( 0 );
    } );

    it( "Should contain a Table component", function() {
      expect( wrapper.find( Table ) ).to.have.length( 1 );
    } );

    it( "Should have data prop", function() {
      expect( wrapper.find( Table ).props().data ).to.deep.equal( [ [ "B3" ] ] );
    } );

  } );

} );
