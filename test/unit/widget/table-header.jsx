import React from "react";
import { shallow } from "enzyme";
import TestUtils from "react-addons-test-utils";
import TableHeader from "../../../src/widget/components/table-header";
import { expect } from "chai";

describe("<TableHeader />", function() {
  const width = 600,
    height = 50,
    data = ["Column 1", "Column 2", "Column 3"];
  var wrapper;

  beforeEach(function () {
    wrapper = shallow(<TableHeader data={data} width={width} height={height} />);
  });

  describe("<Table />", function() {
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
    it("Should have correct number of columns", function() {
      expect(wrapper.props().children.length).to.equal(3);
    });

    it("Should have key prop", function() {
      expect(wrapper.props().children[0].key).to.equal("0");
    });

    it("Should have header prop", function() {
      expect(wrapper.props().children[0].props.header.props.children).to.equal("Column 1");
    });

    it("Should have width prop", function() {
      expect(wrapper.props().children[0].props.width).to.equal(width / 3);
    });
  });
});
