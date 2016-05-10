/* global RiseVision, gadgets */

var _prefs = new gadgets.Prefs(),
  _additionalParams = null;

function _ready() {
  gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"), true, true, true, true, true);
}

// function _done() {
//   gadgets.rpc.call("", "rsevent_done", null, _prefs.getString("id"));
// }

function _init() {
  // var _message = new RiseVision.Common.Message(document.getElementById("container"),
  //   document.getElementById("messageContainer"));

  _ready();
}

function getTableName() {
  return "spreadsheet_events";
}

function logEvent(params) {
  RiseVision.Common.LoggerUtils.logEvent(getTableName(), params);
}

function pause() {
  console.log("pause");
}

function play() {
  console.log("play");
}

function setAdditionalParams(additionalParams) {
  _prefs = new gadgets.Prefs();

  _additionalParams = JSON.parse(JSON.stringify(additionalParams));

  _additionalParams.width = _prefs.getInt("rsW");
  _additionalParams.height = _prefs.getInt("rsH");

  document.getElementById("container").style.width = _additionalParams.width + "px";
  document.getElementById("container").style.height = _additionalParams.height + "px";

  _init();
}

function stop() {
  pause();
}

exports.getTableName = getTableName;
exports.logEvent = logEvent;
exports.setAdditionalParams = setAdditionalParams;
exports.pause  = pause;
exports.play = play;
exports.stop = stop;
