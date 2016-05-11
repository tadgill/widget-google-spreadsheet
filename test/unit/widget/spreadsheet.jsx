require("../../data/spreadsheet");

const React = require("react"),
  Enzyme = require("enzyme")
  expect = require("chai").expect,
  Spreadsheet = require("../../../src/widget/components/spreadsheet");

// describe("<Spreadsheet />", function() {
//   var cols =
//     {
//       "content": {
//         "$t": "Column 1"
//       },
//       "gs$cell": {
//         "col": "1",
//         "row": "1"
//       }
//     },
//     {
//       "content": {
//         "$t": "Column 2"
//       },
//       "gs$cell": {
//         "col": "2",
//         "row": "1"
//       }
//     },
//     {
//       "content": {
//         "$t": "Column 3"
//       },
//       "gs$cell": {
//         "col": "3",
//         "row": "1"
//       }
//     },
//     data = {
//       "content": {
//           "$t": "I am the walrus!"
//       },
//       "gs$cell": {
//         "col": "1",
//         "row": "2"
//       }
//     },
//     {
//       "content": {
//         "$t": "1"
//       },
//       "gs$cell": {
//         "col": "2",
//         "row": "2"
//       }
//     },
//     {
//       "content": {
//         "$t": "3"
//       },
//       "gs$cell": {
//         "col": "3",
//         "row": "2"
//       }
//     },
//     cells = [cols, data];

//   it("Should have an initial data state", function () {
//     const wrapper = mount(<Spreadsheet />);

//     expect(wrapper.state().data).to.be.null;
//   });

//   it("Should contain a <TableHeader /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(TableHeader)).to.have.length(1);
//   });

//   it("Should set data prop of <TableHeader /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(TableHeader).props().data).to.equal(cols);
//   });

//   it("Should set width prop of <TableHeader /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(TableHeader).props().width).to.be.defined;
//   });

//   it("Should set height prop of <TableHeader /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(TableHeader).props().height).to.equal(50);
//   });

//   it("Should contain a <Table /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(Table)).to.have.length(1);
//   });

//   it("Should set data prop of <Table /> component", function() {
//     const wrapper = mount(<Spreadsheet />);
//     wrapper.setState({ data: cells });

//     expect(wrapper.find(Table).props().data).to.equal(data);
//   });
// });
