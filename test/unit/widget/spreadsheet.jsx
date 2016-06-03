import React from "react";
import { mount } from "enzyme";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import Spreadsheet from "../../../src/widget/components/spreadsheet";
import Scroll from "../../../src/widget/components/scroll";
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

  var propHandlers = {
    initSize: function(width, height) {},
    showMessage: function(text) {},
    hideMessage: function() {}
  };

  beforeEach(function () {
    wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                 showMessage={propHandlers.showMessage}
                                 hideMessage={propHandlers.hideMessage} />);
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
      wrapper = mount(<Spreadsheet initSize={propHandlers.initSize}
                                   showMessage={propHandlers.showMessage}
                                   hideMessage={propHandlers.hideMessage} />);
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



  describe("Refreshing", function() {
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

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
    beforeEach(function () {
      wrapper.setState({ data: cells });
    });

    it("should revert state back to initial value", function () {
      var event = document.createEvent("Event"),
        sheet = document.getElementById("rise-google-sheet");

      event.initEvent("rise-google-sheet-error", true, true);
      event.detail = {};

      sheet.dispatchEvent(event);

      expect(wrapper.state().data).to.be.null;
    });

  });

  describe("Logging", function() {
    var stub,
      table = "spreadsheet_events",
      params = {
        "event": "play",
        "url": window.gadget.settings.additionalParams.spreadsheet.url
      };

    beforeEach(function() {
      stub = sinon.stub(LoggerUtils, "logEvent");

    });

    afterEach(function() {
      LoggerUtils.logEvent.restore();
    });

    it("should log the play event", function() {
      var event = document.createEvent("Event"),
        sheet = document.getElementById("rise-google-sheet");

      event.initEvent("rise-google-sheet-response", true, true);
      event.detail = {
        cells: cells
      };

      sheet.dispatchEvent(event);
      
      expect(stub.withArgs(table,params).called).to.equal(true);
    });

    xit("should log the done event", function() {
      // TODO: Needs auto-scroll first.
    });

    it("should log the error event", function() {
      var event = document.createEvent("Event"),
          sheet = document.getElementById("rise-google-sheet"),

      params = {
        "event": "error",
        "event_details": "spreadsheet not published",
        "error_details": "error",
        "url": window.gadget.settings.additionalParams.spreadsheet.url
      };

      event.initEvent("rise-google-sheet-error", true, true);
      event.detail = "error";
      sheet.dispatchEvent(event);

      expect(stub.withArgs(table,params).called).to.equal(true);
    });
  });
});

