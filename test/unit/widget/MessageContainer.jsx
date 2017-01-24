/* global describe, beforeEach, it  */

import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import MessageContainer from "../../../src/widget/containers/MessageContainer"
import Message from "../../../src/widget/components/message";

describe( "<MessageContainer />", function() {
  const text = "This is my message";

  var wrapper;

  beforeEach( function() {
    wrapper = shallow( <MessageContainer show={true} text={text} /> );
  } );

  it( "Should contain a div with an id of messageContainer", function() {
    expect( wrapper.find( "div#messageContainer" ) ).to.exist;
  } );

  it( "Should show messageContainer", function() {
    expect( wrapper.find( "#messageContainer" ).props().className ).to.equal( "show" );
  } );

  it( "Should contain a Message component", function() {
    expect( wrapper.find( Message ) ).to.exist;
  } );

  it( "Should set text prop of Message component", function() {
    expect( wrapper.find( Message ).props().text ).to.equal( text );
  } );
} );
