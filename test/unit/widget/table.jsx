import React from "react";
import { shallow } from "enzyme";
import TestUtils from "react-addons-test-utils";
import Table from "../../../src/widget/components/table";
import { expect } from "chai";

describe("<Table />", function() {
  const width = 600,
    height = 50,
    totalCols = 3,
    data = [["I am the walrus!", "1", "3"],
      ["John is dead!", "500", "32"]];
  var wrapper;

  beforeEach(function () {
    wrapper = shallow(<Table data={data} width={width} height={height} totalCols={totalCols} />);
  });

  describe("<ResponsiveFixedDataTable />", function() {
    it("Should have rowHeight prop", function() {
      expect(wrapper.props().rowHeight).to.be.equal(50);
    });

    it("Should have rowsCount prop", function() {
      expect(wrapper.props().rowsCount).to.equal(2);
    });

    it("Should have width prop", function() {
      expect(wrapper.props().width).to.equal(width);
    });

    it("Should have height prop", function() {
      expect(wrapper.props().height).to.equal(height);
    });

    it("Should have headerHeight prop", function() {
      expect(wrapper.props().headerHeight).to.equal(0);
    });

    it("Should have overflowY prop", function() {
      expect(wrapper.props().overflowY).to.equal("hidden");
    });
  });

  describe("<Column />", function() {
    it("Should have correct number of columns", function() {
      expect(wrapper.props().children.length).to.equal(3);
    });

    it("Should have key prop", function() {
      expect(wrapper.props().children[0].key).to.equal("0");
    });

    it("Should have width prop", function() {
      expect(wrapper.props().children[0].props.width).to.equal(200);
    });

    it("Should have cell prop", function() {
      expect(wrapper.props().children[0].props.cell).to.be.a("function");
    });
  });
});
