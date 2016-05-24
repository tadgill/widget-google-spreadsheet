require("../../data/spreadsheet");

import React from "react";
import { mount } from "enzyme";
import TestUtils from "react-addons-test-utils";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import TableHeader from "../../../src/widget/components/table-header";
import Table from "../../../src/widget/components/table";
import { expect } from "chai";

describe("<Spreadsheet />", function() {
  var wrapper;
  const cols = [
    {
      "content": {
        "$t": "Column 1"
      },
      "gs$cell": {
        "col": "1",
        "row": "1"
      }
    },
    {
      "content": {
        "$t": "Column 2"
      },
      "gs$cell": {
        "col": "2",
        "row": "1"
      }
    },
    {
      "content": {
        "$t": "Column 3"
      },
      "gs$cell": {
        "col": "3",
        "row": "1"
      }
    }],
    data = [
    {
      "content": {
          "$t": "I am the walrus!"
      },
      "gs$cell": {
        "col": "1",
        "row": "2"
      }
    },
    {
      "content": {
        "$t": "1"
      },
      "gs$cell": {
        "col": "2",
        "row": "2"
      }
    },
    {
      "content": {
        "$t": "3"
      },
      "gs$cell": {
        "col": "3",
        "row": "2"
      }
    }],
    cells = cols.concat(data);

  beforeEach(function () {
    wrapper = mount(<Spreadsheet />);
  });

  it("Should have an initial data state", function () {
    expect(wrapper.state().data).to.be.null;
  });

  describe("<TableHeader />", function() {

    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("Should contain a TableHeader component", function() {
      expect(wrapper.find(TableHeader)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [ 'Column 1', 'Column 2', 'Column 3' ];
      expect(wrapper.find(TableHeader).props().data).to.deep.equal(expected);
    });

    it("Should have width prop", function() {
      expect(wrapper.find(TableHeader).props().width).to.be.defined;
    });

    it("Should have height prop", function() {
      expect(wrapper.find(TableHeader).props().height).to.equal(50);
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
      var expected = [['I am the walrus!', '1', '3']];
      expect(wrapper.find(Table).props().data).to.deep.equal(expected);
    });

    it("Should have width prop", function() {
      expect(wrapper.find(Table).props().width).to.equal(600);
    });

    it("Should have height prop", function() {
      expect(wrapper.find(Table).props().height).to.equal(350);
    });

    it("Should have totalCols prop", function() {
      expect(wrapper.find(Table).props().totalCols).to.equal(3);
    });
  });
});
