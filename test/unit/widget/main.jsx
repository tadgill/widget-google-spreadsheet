import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Main from "../../../src/widget/components/main";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import Message from "../../../src/widget/components/message";

describe("<Main />", function() {

  var wrapper;

  beforeEach(function () {
    wrapper = shallow(<Main />);
  });

  it("Should have an initial data state", function () {
    expect(wrapper.state()).to.deep.equal({
      showMessage: false,
      messageText: ""
    });
  });

  describe("<Spreadsheet />", function() {
    it("Should contain a Spreadsheet component", function() {
      expect(wrapper.find(Spreadsheet)).to.have.length(1);
    });

    it("Should have initSize handler prop", function() {
      expect(wrapper.find(Spreadsheet).props().initSize).to.exist;
      expect(wrapper.find(Spreadsheet).props().initSize).to.be.a("function");
    });

    it("Should have showMessage handler prop", function() {
      expect(wrapper.find(Spreadsheet).props().showMessage).to.exist;
      expect(wrapper.find(Spreadsheet).props().showMessage).to.be.a("function");
    });

    it("Should have hideMessage handler prop", function() {
      expect(wrapper.find(Spreadsheet).props().hideMessage).to.exist;
      expect(wrapper.find(Spreadsheet).props().hideMessage).to.be.a("function");
    });
  });

  describe("<Message />", function() {
    it("Should contain a Message component", function() {
      expect(wrapper.find(Message)).to.have.length(1);
    });

    it("Should have text prop", function() {
      expect(wrapper.find(Message).props().text).to.equal("");
    });
    
    it("Should bind text prop to state 'message'", function () {
      wrapper.setState({ 
        showMessage: true,
        messageText: "Testing message"
      });
      
      expect(wrapper.find(Message).props().text).to.equal("Testing message");
    });
  });

});
