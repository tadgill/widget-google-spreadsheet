import React from "react";
import { shallow, mount } from "enzyme";
import { expect } from "chai";
import { Column, Cell } from "fixed-data-table";
import Table from "../../../src/widget/components/table";

describe("<Table />", function() {
  const width = 600,
    height = 50,
    totalCols = 3,
    data = [["I am the walrus!", "1", "3"],
      ["John is dead!", "500", "32"]],
    columnWidths = [100, 200, 300],
    cellClassName = "body_font-style",
    rowHeight = 50;

  var wrapper;

  beforeEach(function () {
    wrapper = shallow(<Table data={data} columnWidths={columnWidths} class={cellClassName} align="center"
                             width={width} height={height} rowHeight={rowHeight} totalCols={totalCols} />);
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

    it("Should have correct number of columns", function() {
      expect(wrapper.props().children.length).to.equal(3);
    });
  });

  describe("<Column />", function() {
    it("Should have key prop", function() {
      expect(wrapper.props().children[0].key).to.equal("0");
    });

    it("Should have width prop", function() {
      expect(wrapper.props().children[0].props.width).to.equal(columnWidths[0]);
    });

    it("Should have align prop", function() {
      expect(wrapper.props().children[0].props.align).to.equal("center");
    });

    it("Should have cell prop", function() {
      expect(wrapper.props().children[0].props.cell).to.be.a("function");
    });
  });
});
