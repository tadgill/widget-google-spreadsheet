import React from "react";
import { shallow, mount } from "enzyme";
import TestUtils from "react-addons-test-utils";
import TableHeader from "../../../src/widget/components/table-header";
import { expect } from "chai";
import {Table, Column, Cell} from "fixed-data-table";

describe("<TableHeader />", function() {
  const width = 600,
    height = 50,
    data = ["Column 1", "Column 2", "Column 3"],
    className = "header_font-style";

  var wrapper;

  describe("<Table />", function() {
    beforeEach(function () {
      wrapper = shallow(<TableHeader class={className} data={data} align="center"
        width={width} height={height} />);
    });

    it("Should have rowHeight prop", function() {
      expect(wrapper.props().rowHeight).to.equal(1);
    });

    it("Should have rowsCount prop", function() {
      expect(wrapper.props().rowsCount).to.equal(0);
    });

    it("Should have width prop", function() {
      expect(wrapper.props().width).to.equal(width);
    });

    it("Should have height prop", function() {
      expect(wrapper.props().height).to.equal(height);
    });

    it("Should have headerHeight prop", function() {
      expect(wrapper.props().headerHeight).to.equal(height);
    });
  });

  describe("<Column />", function() {
    beforeEach(function () {
      wrapper = shallow(<TableHeader class={className} data={data} align="center"
        width={width} height={height} />);
    });

    it("Should have correct number of columns", function() {
      expect(wrapper.props().children.length).to.equal(3);
    });

    it("Should have key prop", function() {
      expect(wrapper.props().children[0].key).to.equal("0");
    });

    it("Should have header prop", function() {
      expect(wrapper.props().children[0].props.header).to.exist;
    });

    it("Should have width prop", function() {
      expect(wrapper.props().children[0].props.width).to.equal(width / 3);
    });

    it("Should have align prop", function() {
      expect(wrapper.props().children[0].props.align).to.equal("center");
    });
  });

  describe("<Cell />", function() {
    beforeEach(function () {
      wrapper = mount(<TableHeader class={className} data={data} align="center"
        width={width} height={height} />);
    });

    it("Should have correct number of cells", function() {
      expect(wrapper.find(Cell).length).to.equal(3);
    });

    it("Should have className prop", function() {
     expect(wrapper.find(Cell).first().props().className).to.equal(className);
    });

    it("Should set cell text", function() {
      expect(wrapper.find(Cell).first().text()).to.equal("Column 1");;
    })
  });
});
