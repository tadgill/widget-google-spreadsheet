import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import TableHeaderContainer from "../../../src/widget/containers/TableHeaderContainer";
import Table from "../../../src/widget/components/table";
import "../../data/spreadsheet-range";

describe("<Spreadsheet />", function() {

  var wrapper;
  const cols = [
    {
      "content": {
        "$t": "Cell B2"
      },
      "gs$cell": {
        "col": "2",
        "row": "2"
      },
      "title": {
        "$t": "B2"
      }
    },
    {
      "content": {
        "$t": "Cell C2"
      },
      "gs$cell": {
        "col": "3",
        "row": "2"
      },
      "title": {
        "$t": "C2"
      }
    }],
    data = [
      {
        "content": {
          "$t": "Cell B3"
        },
        "gs$cell": {
          "col": "2",
          "row": "3"
        }
      },
      {
        "content": {
          "$t": "Cell C3"
        },
        "gs$cell": {
          "col": "3",
          "row": "3"
        }
      }],
    cells = cols.concat(data);

  var propHandlers = {
    initSize: function(width, height) {},
    showMessage: function(text) {},
    hideMessage: function() {}
  };

  beforeEach(function () {
    wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                 showMessage={propHandlers.showMessage}
                                 hideMessage={propHandlers.hideMessage} />);
  });

  describe("<TableHeaderContainer />", function() {
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("Should contain a TableHeaderContainer component", function() {
      expect(wrapper.find(TableHeaderContainer)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [ "Cell B2", "Cell C2" ];
      expect(wrapper.find(TableHeaderContainer).props().data).to.deep.equal(expected);
    });

  });

  describe("<Table />", function() {
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("Should contain a Table component", function() {
      expect(wrapper.find(Table)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [["Cell B3", "Cell C3"]];
      expect(wrapper.find(Table).props().data).to.deep.equal(expected);
    });

    it("Should have totalCols prop", function() {
      expect(wrapper.find(Table).props().totalCols).to.equal(2);
    });
  });

  describe("Don't Use First Row As Header", function() {
    beforeEach(function () {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = false;
      wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} />);
      wrapper.setState({ data: cells });
    });

    afterEach(function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = true;
    });

    it("Should not contain a TableHeaderContainer component", function() {
      expect(wrapper.find(TableHeaderContainer)).to.have.length(0);
    });

    it("Should have data prop", function() {
      var expected = [["Cell B2", "Cell C2"], ["Cell B3", "Cell C3"]];
      expect(wrapper.find(Table).props().data).to.deep.equal(expected);
    });
  });

  describe("Single cell range", function() {

    beforeEach(function () {
      wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} />);
      wrapper.setState({ data: [{
          "content": {
            "$t": "Cell B3"
          },
          "gs$cell": {
            "col": "2",
            "row": "3"
          },
          "title": {
            "$t": "B3"
          }
        }]
      });
    });

    it("Should contain a TableHeaderContainer component", function() {
      expect(wrapper.find(TableHeaderContainer)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [ "Cell B3" ];
      expect(wrapper.find(TableHeaderContainer).props().data).to.deep.equal(expected);
    });

    it("Should not contain a Table component", function() {
      expect(wrapper.find(Table)).to.have.length(0);
    });
  });

  describe("Single cell range without first row as header", function () {

    beforeEach(function () {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = false;
      wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} />);
      wrapper.setState({ data: [{
        "content": {
          "$t": "Cell B3"
        },
        "gs$cell": {
          "col": "2",
          "row": "3"
        },
        "title": {
          "$t": "B3"
        }
      }]
      });
    });

    afterEach(function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = true;
    });

    it("Should not contain a TableHeaderContainer component", function() {
      expect(wrapper.find(TableHeaderContainer)).to.have.length(0);
    });

    it("Should contain a Table component", function() {
      expect(wrapper.find(Table)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [ ["Cell B3"] ];
      expect(wrapper.find(Table).props().data).to.deep.equal(expected);
    });

  });

});
