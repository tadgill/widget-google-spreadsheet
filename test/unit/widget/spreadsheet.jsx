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
    it("Should contain a TableHeader component", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(TableHeader)).to.have.length(1);
    });

    it("Should have data prop", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(TableHeader).props().data).to.equal(cols);
    });

    it("Should have width prop", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(TableHeader).props().width).to.be.defined;
    });

    it("Should have height prop", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(TableHeader).props().height).to.equal(50);
    });
  });

  describe("<Table />", function() {
    it("Should contain a Table component", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(Table)).to.have.length(1);
    });

    it("Should have data prop", function() {
      wrapper.setState({ data: cells });

      expect(wrapper.find(Table).props().data).to.equal(data);
    });

    it("Should have width prop", function() {

    });

    it("Should have height prop", function() {

    });

    it("Should have totalCols prop", function() {

    });
  });
});
