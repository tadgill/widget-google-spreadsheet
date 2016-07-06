import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Scroll from "../../../src/widget/components/scroll";
import Vertical from "../../../src/widget/components/vertical";
import Horizontal from "../../../src/widget/components/horizontal";

describe("<Vertical />", function() {
  const onDone = function () {},
    scroll = {},
    align = "center",
    className = "body_font-style",
    width = 600,
    height = 50,
    totalCols = 3,
    rowHeight = 50,
    data = [["I am the walrus!", "1", "3"],
      ["John is dead!", "500", "32"]],
    columnFormats = [{ "width": 100 }, { "width": 200 }, { "width": 300 }],
    bodyFontStyle={
                   font:{
                     family:"verdana,geneva,sans-serif",
                     type:"standard",
                     url:""
                   },
                   size:"18px",
                   customSize:"",
                   align:"left",
                   verticalAlign: "bottom",
                   bold:false,
                   italic:false,
                   underline:false,
                   forecolor:"black",
                   backcolor:"transparent"
                 };

  var wrapper;

  describe("<Vertical />", function() {

    beforeEach(function () {
      scroll.direction = "up"
      var component = <Scroll onDone={onDone} scroll={scroll} data={data} align={align} class={className} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} bodyFontStyle={bodyFontStyle}/>;

      wrapper = shallow(component);
    });

    it("Should contain a Vertical component", function() {
      expect(wrapper.find(Vertical)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [["I am the walrus!", "1", "3"],
                           ["John is dead!", "500", "32"]];
      expect(wrapper.find(Vertical).props().data).to.deep.equal(expected);
    });

    it("Should have columnFormats prop", function() {
      expect(wrapper.find(Vertical).props().columnFormats).to.deep.equal(columnFormats);
    });

    it("Should have width prop", function() {
      expect(wrapper.find(Vertical).props().width).to.equal(width);
    });

    it("Should have height prop", function() {
      expect(wrapper.find(Vertical).props().height).to.equal(height);
    });

    it("Should have totalCols prop", function() {
      expect(wrapper.find(Vertical).props().totalCols).to.equal(totalCols);
    });
  });

  describe("<Horizontal />", function() {

      beforeEach(function () {
        scroll.direction = "left"
        var component = <Scroll onDone={onDone} scroll={scroll} data={data} align={align} class={className} totalCols={totalCols} rowHeight={rowHeight} width={width} height={height} columnFormats={columnFormats} bodyFontStyle={bodyFontStyle}/>;

        wrapper = shallow(component);
      });

      it("Should contain a Horizontal component", function() {
        expect(wrapper.find(Horizontal)).to.have.length(1);
      });

      it("Should have data prop", function() {
        var expected = [["I am the walrus!", "1", "3"],
                             ["John is dead!", "500", "32"]];
        expect(wrapper.find(Horizontal).props().data).to.deep.equal(expected);
      });

      it("Should have columnFormats prop", function() {
        expect(wrapper.find(Horizontal).props().bodyFontStyle).to.deep.equal(bodyFontStyle);
      });

      it("Should have width prop", function() {
        expect(wrapper.find(Horizontal).props().width).to.equal(width);
      });

      it("Should have height prop", function() {
        expect(wrapper.find(Horizontal).props().height).to.equal(height);
      });
    });
});
