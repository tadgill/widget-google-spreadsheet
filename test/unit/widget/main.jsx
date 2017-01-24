/* global describe, before, beforeEach, after, it, sinon  */

import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import Main from "../../../src/widget/components/main";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import MessageContainer from "../../../src/widget/containers/MessageContainer";
import "widget-tester/mocks/gadget-mocks";
import "../../data/spreadsheet";


describe( "<Main />", function() {

  let wrapper,
    server;

  before( function() {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
    server.respondWith( "POST", "https://www.googleapis.com/oauth2/v3/token", [ 200, { "Content-Type": "text/html" }, "OK" ] );
  } );

  describe( "Initialization", function() {
    beforeEach( function() {
      wrapper = shallow( <Main /> );
    } );

    it( "Should have an initial data state", function() {
      expect( wrapper.state() ).to.deep.equal( {
        showMessage: false,
        messageText: ""
      } );
    } );

    it( "Should contain a Spreadsheet component", function() {
      expect( wrapper.find( Spreadsheet ) ).to.have.length( 1 );
    } );

    it( "Should contain a MessageContainer component", function() {
      expect( wrapper.find( MessageContainer ) ).to.have.length( 1 );
    } );

    it( "Should show spreadsheet", function() {
      expect( wrapper.find( "#spreadsheetContainer" ).props().className ).to.equal( "show" );
    } );

    it( "Should not show message", function() {
      expect( wrapper.find( MessageContainer ).props().show ).to.equal( false );
    } );
  } );

  describe( "<Spreadsheet />", function() {
    beforeEach( function() {
      wrapper = shallow( <Main /> );
    } );

    it( "Should have initSize handler prop", function() {
      expect( wrapper.find( Spreadsheet ).props().initSize ).to.exist;
      expect( wrapper.find( Spreadsheet ).props().initSize ).to.be.a( "function" );
    } );

    it( "Should have showMessage handler prop", function() {
      expect( wrapper.find( Spreadsheet ).props().showMessage ).to.exist;
      expect( wrapper.find( Spreadsheet ).props().showMessage ).to.be.a( "function" );
    } );

    it( "Should have hideMessage handler prop", function() {
      expect( wrapper.find( Spreadsheet ).props().hideMessage ).to.exist;
      expect( wrapper.find( Spreadsheet ).props().hideMessage ).to.be.a( "function" );
    } );
  } );

  describe( "<MessageContainer />", function() {
    beforeEach( function() {
      wrapper = shallow( <Main /> );

      wrapper.setState( {
        showMessage: true,
        messageText: "Testing message"
      } );
    } );

    it( "Should have show prop", function() {
      expect( wrapper.find( MessageContainer ).props().show ).to.equal( true );
    } );

    it( "Should have text prop", function() {
      expect( wrapper.find( MessageContainer ).props().text ).to.equal( "Testing message" );
    } );

    it( "Should not show spreadsheet", function() {
      expect( wrapper.find( "#spreadsheetContainer" ).props().className ).to.equal( "hide" );
    } );
  } );

  describe( "Messaging", function() {
    let server;
    const event = document.createEvent( "Event" ),
      sheet = document.getElementById( "rise-google-sheet" );

    before( function() {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
      server.respondWith( "GET", "https://sheets.googleapis.com/v4/spreadsheets/xxxxxxxxxx?key=abc123",
        [ 200, { "Content-Type": "application/json" },
          "{ \"sheets\": [{ \"properties\": { \"title\": \"Sheet1\" } }] }" ] );
    } );

    beforeEach( function() {
      wrapper = mount( <Main /> );
    } );

    after( function() {
      server.restore();
    } );

    it( "Should show waiting message", function() {
      expect( wrapper.find( ".message" ).text() ).to.equal( "Please wait while your google sheet is loaded." );
    } );

    it( "Should show google sheet error message when spreadsheet is not public", function() {

      event.initEvent( "rise-google-sheet-error", true, true );
      event.detail = {
        "error": {
          "message": "The request failed with status code: 403"
        }
      };
      sheet.dispatchEvent( event );

      expect( wrapper.find( ".message" ).text() ).to.equal( "To use this Google Spreadsheet it must be publicly accessible. To do this, open the Google Spreadsheet and select File > Share > Advanced, then select On - Anyone with the link." );
    } );

    it( "Should show google sheet error message when spreadsheet is not found", function() {

      event.initEvent( "rise-google-sheet-error", true, true );
      event.detail = {
        "error": {
          "message": "The request failed with status code: 404"
        }
      };
      sheet.dispatchEvent( event );

      expect( wrapper.find( ".message" ).text() ).to.equal( "Spreadsheet does not exist." );
    } );

    it( "Should show google sheet error message when spreadsheet is not reachable", function() {

      event.initEvent( "rise-google-sheet-error", true, true );
      event.detail = {
        "error": {
          "message": "The request failed with status code: 400"
        }
      };
      sheet.dispatchEvent( event );

      expect( wrapper.find( ".message" ).text() ).to.equal( "Error when accessing Spreadsheet." );
    } );

    it( "Should show google sheet api quota exceeded message", function() {
      const event = document.createEvent( "Event" ),
        sheet = document.getElementById( "rise-google-sheet" );

      event.details = {};
      event.initEvent( "rise-google-sheet-quota", true, true );
      sheet.dispatchEvent( event );

      expect( wrapper.find( ".message" ).text() ).to.equal( "The API Key used to retrieve data from the Spreadsheet has exceeded the daily quota. Please use a different API Key." );
    } );
  } );

} );
