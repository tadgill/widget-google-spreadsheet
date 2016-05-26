import React from "react";
import { shallow } from "enzyme";
import TestUtils from "react-addons-test-utils";
import Scroll from "../../../src/widget/components/scroll";
import Table from "../../../src/widget/components/table";
import { expect } from "chai";

describe("<Scroll />", function() {
  const onDone = function () {},
    scroll = {},
    width = 600,
    height = 50,
    totalCols = 3,
    data = [["I am the walrus!", "1", "3"],
      ["John is dead!", "500", "32"]];
  var wrapper, renderedComponent;

  beforeEach(function () {
    var component =  <Scroll onDone={onDone} scroll={scroll} data={data} width={width} height={height} totalCols={totalCols} />;
    wrapper = shallow(component);
    renderedComponent = TestUtils.renderIntoDocument(component);

  });

  describe("Page", function() {
    it("Should set the page class to the section element", function() {
      expect(renderedComponent.refs.page.className).to.equal("page");
    });
  });


  describe("<Table />", function() {
      it("Should contain a Table component", function() {
        expect(wrapper.find(Table)).to.have.length(1);
      });

      it("Should have data prop", function() {
        var expected = [["I am the walrus!", "1", "3"],
                             ["John is dead!", "500", "32"]];
        expect(wrapper.find(Table).props().data).to.deep.equal(expected);
      });

      it("Should have width prop", function() {
        expect(wrapper.find(Table).props().width).to.equal(600);
      });

      it("Should have height prop", function() {
        expect(wrapper.find(Table).props().height).to.equal(50);
      });

      it("Should have totalCols prop", function() {
        expect(wrapper.find(Table).props().totalCols).to.equal(3);
      });
    });
});
