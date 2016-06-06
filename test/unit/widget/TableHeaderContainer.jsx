import React from "react";
import { shallow, mount } from "enzyme";
import TestUtils from "react-addons-test-utils";
import TableHeaderContainer from "../../../src/widget/containers/TableHeaderContainer"
import TableHeader from "../../../src/widget/components/TableHeader";
import { expect } from "chai";
import { Table, Column, Cell } from "fixed-data-table";

describe("<TableHeaderContainer />", function() {
  const align = "center",
    data = ["Column 1", "Column 2", "Column 3"],
    width = 600,
    height = 50;

  var wrapper;

  describe("<TableHeader />", function() {
    beforeEach(function () {
      wrapper = shallow(<TableHeaderContainer align={align} data={data} height={height} width={width} />);
    });

    it("Should have height prop", function() {
      expect(wrapper.props().height).to.equal(height);
    });

    it("Should have width prop", function() {
      expect(wrapper.props().width).to.equal(width);
    });

    it("Should have correct number of columns as children", function() {
      expect(wrapper.props().children.length).to.equal(3);
    });
  });

  describe("<Column />", function() {
    beforeEach(function () {
      wrapper = shallow(<TableHeaderContainer align={align} data={data} height={height} width={width} />);
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
      expect(wrapper.props().children[0].props.align).to.equal(align);
    });
  });

  describe("<Cell />", function() {
    beforeEach(function () {
      wrapper = mount(<TableHeaderContainer align={align} data={data} height={height} width={width} />);
    });

    it("Should have correct number of cells", function() {
      expect(wrapper.find(Cell).length).to.equal(3);
    });

    it("Should have className prop", function() {
     expect(wrapper.find(Cell).first().props().className).to.equal("header_font-style");
    });

    it("Should set cell text", function() {
      expect(wrapper.find(Cell).first().text()).to.equal("Column 1");;
    })
  });
});
