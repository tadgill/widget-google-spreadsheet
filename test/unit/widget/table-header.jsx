import React from "react";
import TestUtils from "react-addons-test-utils";
import TableHeader from "../../../src/widget/components/table-header";
import { expect } from "chai";

describe("<TableHeader />", function() {
  var result = null,
    width = 600,
    height = 50;

  beforeEach(function () {
    var renderer = TestUtils.createRenderer(),
      data = ["Column 1", "Column 2", "Column 3"];

    renderer.render(<TableHeader data={data} width={width} height={height} />);
    result = renderer.getRenderOutput();
  });

  it("Should render the table header", function() {
    expect(result.props.rowHeight).to.equal(1);
    expect(result.props.rowsCount).to.equal(0);
    expect(result.props.width).to.equal(width);
    expect(result.props.height).to.equal(height);
    expect(result.props.headerHeight).to.equal(height);
  });

  it("Should render the table columns", function() {
    expect(result.props.children.length).to.equal(3);
    expect(result.props.children[0].key).to.equal("0");
    expect(result.props.children[1].key).to.equal("1");
    expect(result.props.children[2].key).to.equal("2");
    expect(result.props.children[0].props.header.props.children).to.equal("Column 1");
    expect(result.props.children[1].props.header.props.children).to.equal("Column 2");
    expect(result.props.children[2].props.header.props.children).to.equal("Column 3");
    expect(result.props.children[0].props.width).to.equal(width / 3);
  });
});
