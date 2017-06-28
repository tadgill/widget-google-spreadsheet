import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Scroll from "../../../src/widget/components/scroll";
import Table from "../../../src/widget/components/table";

describe( "<Scroll />", function() {
  let server;
  const onDone = function() {},
    scroll = {},
    align = "center",
    className = "body_font-style",
    width = 600,
    height = 50,
    totalCols = 3,
    rowHeight = 50,
    data = [ [ "I am the walrus!", "1", "3" ],
      [ "John is dead!", "500", "32" ] ],
    columnFormats = [ { "width": 100 }, { "width": 200 }, { "width": 300 } ];

  var wrapper;

  before( function() {
    server = sinon.fakeServer.create();
    server.respondImmediately = true;
    server.respondWith( "POST", "https://www.googleapis.com/oauth2/v3/token", [ 200, { "Content-Type": "text/html" }, "OK" ] );
  } );

  beforeEach( function() {
    var component =
      <Scroll
        onDone={onDone}
        scroll={scroll}
        data={data}
        align={align}
        class={className}
        totalCols={totalCols}
        rowHeight={rowHeight}
        width={width}
        height={height}
        columnFormats={columnFormats} />;

    wrapper = mount( component );
  });

  describe( "Page", function() {
    it( "Should set the page class to the section element", function() {
      expect( wrapper.find( "section" ).props().className ).to.equal( "page" );
    } );
  } );


  describe( "<Table />", function() {
    it( "Should contain a Table component", function() {
      expect( wrapper.find( Table ) ).to.have.length( 1 );
    } );

    it( "Should have data prop", function() {
      var expected = [ [ "I am the walrus!", "1", "3" ],
                           [ "John is dead!", "500", "32" ] ];

      expect( wrapper.find( Table ).props().data ).to.deep.equal( expected );
    } );

    it( "Should have columnFormats prop", function() {
      expect( wrapper.find( Table ).props().columnFormats ).to.deep.equal( columnFormats );
    } );

    it( "Should have width prop", function() {
      expect( wrapper.find( Table ).props().width ).to.equal( width );
    } );

    it( "Should have height prop", function() {
      expect( wrapper.find( Table ).props().height ).to.equal( height );
    } );

    it( "Should have totalCols prop", function() {
      expect( wrapper.find( Table ).props().totalCols ).to.equal( totalCols );
    } );
  } );
  
  describe("<Table /> Update data", function() {
    it("Should update height when updating data", function() {

      let updatedData = [["I am the walrus!", "1", "3"],
                              ["John is dead!", "500", "32"],
                              ["John is dead!", "500", "32"],
                              ["John is dead!", "500", "32"]];

      wrapper.setProps({ data: updatedData });

      expect(wrapper.find(Table).props().height).to.equal(200);

    });
  
  });
} );
