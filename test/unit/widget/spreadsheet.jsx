import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import TableHeader from "../../../src/widget/components/table-header";
import Table from "../../../src/widget/components/table";
import LoggerUtils from "../../../src/components/widget-common/dist/logger";
import "../../data/spreadsheet";

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
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("Should contain a TableHeader component", function() {
      expect(wrapper.find(TableHeader)).to.have.length(1);
    });

    it("Should have class prop", function() {
      expect(wrapper.find(TableHeader).props().class).to.equal("header_font-style");
    });

    it("Should have data prop", function() {
      var expected = [ "Column 1", "Column 2", "Column 3" ];
      expect(wrapper.find(TableHeader).props().data).to.deep.equal(expected);
    });

    it("Should have align prop", function() {
      expect(wrapper.find(TableHeader).props().align).to.equal("left");
    });

    it("Should have width prop", function() {
      expect(wrapper.find(TableHeader).props().width).to.equal(window.innerWidth);
    });

    it("Should have height prop", function() {
      expect(wrapper.find(TableHeader).props().height).to.equal(50);
    });
  });

  describe("No <TableHeader />", function() {
    beforeEach(function () {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = false;
      wrapper = mount(<Spreadsheet />);
      wrapper.setState({ data: cells });
    });

    afterEach(function() {
      window.gadget.settings.additionalParams.spreadsheet.hasHeader = true;
    });

    it("Should not contain a TableHeader component", function() {
      expect(wrapper.find(TableHeader)).to.have.length(0);
    });

    it("Should pass the correct height prop for the Table component", function() {
      expect(wrapper.find(Table).props().height).to.equal(window.innerHeight);
    });
  });

  describe("<Table />", function() {
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("Should contain a Table component", function() {
      expect(wrapper.find(Table)).to.have.length(1);
    });

    it("Should have data prop", function() {
      var expected = [["I am the walrus!", "1", "3"]];
      expect(wrapper.find(Table).props().data).to.deep.equal(expected);
    });

    it("Should have width prop", function() {
      expect(wrapper.find(Table).props().width).to.equal(window.innerWidth);
    });

    it("Should have height prop", function() {
      expect(wrapper.find(Table).props().height).to.equal(350);
    });

    it("Should have totalCols prop", function() {
      expect(wrapper.find(Table).props().totalCols).to.equal(3);
    });
  });

  describe("Refreshing", function() {
    it("should update the state", function() {
      const event = document.createEvent("Event"),
        sheet = document.getElementById("rise-google-sheet"),
        newData = [
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
              "$t": "Test data"
            },
            "gs$cell": {
              "col": "1",
              "row": "2"
            }
          }
        ];

      event.initEvent("rise-google-sheet-response", true, true);
      event.detail = {};
      event.detail.cells = newData;

      sheet.dispatchEvent(event);

      expect(wrapper.state().data).to.deep.equal(newData);
    });
  });

  describe("Handling error", function () {

    it("should revert state back to initial value", function () {
      var event = document.createEvent("Event"),
        sheet = document.getElementById("rise-google-sheet");

      event.initEvent("rise-google-sheet-error", true, true);
      event.detail = {};

      sheet.dispatchEvent(event);

      expect(wrapper.state().data).to.be.null;
    });

  });
});

describe("Logging", function() {
  var spy, wrapper,
    table = "spreadsheet_events",
    params = {
      "url": window.gadget.settings.additionalParams.spreadsheet.url,
      "company_id": '"companyId"',
      "display_id": '"displayId"'
    };

  beforeEach(function() {
    spy = sinon.spy(LoggerUtils, "logEvent");
    wrapper = mount(<Spreadsheet />);
  });

  afterEach(function() {
    LoggerUtils.logEvent.restore();
  });

  it("should log the play event", function() {
    params.event = "play";

    expect(spy.calledOnce).to.equal(true);
    expect(spy.calledWith(table, params)).to.equal(true);
  });

  it("should log the done event", function() {
    // TODO: Needs auto-scroll first.
  });
});
