/* global describe, beforeEach, it  */

import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import Message from "../../../src/widget/components/message";

describe( "<Message />", function() {

  var wrapper,
    messageText = "Test message";

  beforeEach( function() {
    wrapper = shallow( <Message text={messageText} /> );
  } );

  it( "Should have className prop", function() {
    expect( wrapper.props().className ).to.be.equal( "message" );
  } );

  it( "Should apply text prop value", function() {
    expect( wrapper.text() ).to.be.equal( "Test message" );
  } );

} );
