import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Horizontal from "../../../src/widget/components/horizontal";


describe("<Horizontal />", function() {
  const onDone = function () {},
    scroll = {},
    width = 600,
    height = 50,
    data = [["I am the walrus!", "1", "3"],
      ["John is dead!", "500", "32"]],
    bodyFontStyle= {
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

  var renderedComponent;

  beforeEach(function () {
    document.getElementById = function () {
     var dummyElement = document.createElement('canvas');
      return dummyElement;
    };
    var component = <Horizontal onDone={onDone} scroll={scroll} data={data} width={width} height={height} bodyFontStyle={bodyFontStyle} />;

    renderedComponent = TestUtils.renderIntoDocument(component);

  });

  describe("Canvas", function() {
    xit("Should set the canvas width", function() {
      expect(renderedComponent.refs.scroller).to.exist;
    });
  });
});
