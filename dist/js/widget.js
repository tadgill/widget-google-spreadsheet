/* exported WIDGET_COMMON_CONFIG */
var WIDGET_COMMON_CONFIG = {
  AUTH_PATH_URL: "v1/widget/auth",
  LOGGER_CLIENT_ID: "1088527147109-6q1o2vtihn34292pjt4ckhmhck0rk0o7.apps.googleusercontent.com",
  LOGGER_CLIENT_SECRET: "nlZyrcPLg6oEwO9f9Wfn29Wh",
  LOGGER_REFRESH_TOKEN: "1/xzt4kwzE1H7W9VnKB8cAaCx6zb4Es4nKEoqaYHdTD15IgOrJDtdun6zK6XiATCKT",
  STORAGE_ENV: "prod",
  STORE_URL: "https://store-dot-rvaserver2.appspot.com/"
};
/* global WIDGET_COMMON_CONFIG */

var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.LoggerUtils = (function() {
  "use strict";

   var displayId = "",
    companyId = "";

  /*
   *  Private Methods
   */

  /* Retrieve parameters to pass to the event logger. */
  function getEventParams(params, cb) {
    var json = null;

    // event is required.
    if (params.event) {
      json = params;

      if (json.file_url) {
        json.file_format = getFileFormat(json.file_url);
      }

      json.company_id = companyId;
      json.display_id = displayId;

      cb(json);
    }
    else {
      cb(json);
    }
  }

  // Get suffix for BQ table name.
  function getSuffix() {
    var date = new Date(),
      year = date.getUTCFullYear(),
      month = date.getUTCMonth() + 1,
      day = date.getUTCDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return year + month + day;
  }

  /*
   *  Public Methods
   */
  function getFileFormat(url) {
    var hasParams = /[?#&]/,
      str;

    if (!url || typeof url !== "string") {
      return null;
    }

    str = url.substr(url.lastIndexOf(".") + 1);

    // don't include any params after the filename
    if (hasParams.test(str)) {
      str = str.substr(0 ,(str.indexOf("?") !== -1) ? str.indexOf("?") : str.length);

      str = str.substr(0, (str.indexOf("#") !== -1) ? str.indexOf("#") : str.length);

      str = str.substr(0, (str.indexOf("&") !== -1) ? str.indexOf("&") : str.length);
    }

    return str.toLowerCase();
  }

  function getInsertData(params) {
    var BASE_INSERT_SCHEMA = {
      "kind": "bigquery#tableDataInsertAllRequest",
      "skipInvalidRows": false,
      "ignoreUnknownValues": false,
      "templateSuffix": getSuffix(),
      "rows": [{
        "insertId": ""
      }]
    },
    data = JSON.parse(JSON.stringify(BASE_INSERT_SCHEMA));

    data.rows[0].insertId = Math.random().toString(36).substr(2).toUpperCase();
    data.rows[0].json = JSON.parse(JSON.stringify(params));
    data.rows[0].json.ts = new Date().toISOString();

    return data;
  }

  function logEvent(table, params) {
    getEventParams(params, function(json) {
      if (json !== null) {
        RiseVision.Common.Logger.log(table, json);
      }
    });
  }

  /* Set the Company and Display IDs. */
  function setIds(company, display) {
    companyId = company;
    displayId = display;
  }

  return {
    "getInsertData": getInsertData,
    "getFileFormat": getFileFormat,
    "logEvent": logEvent,
    "setIds": setIds
  };
})();

RiseVision.Common.Logger = (function(utils) {
  "use strict";

  var REFRESH_URL = "https://www.googleapis.com/oauth2/v3/token?client_id=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_ID +
      "&client_secret=" + WIDGET_COMMON_CONFIG.LOGGER_CLIENT_SECRET +
      "&refresh_token=" + WIDGET_COMMON_CONFIG.LOGGER_REFRESH_TOKEN +
      "&grant_type=refresh_token";

  var serviceUrl = "https://www.googleapis.com/bigquery/v2/projects/client-side-events/datasets/Widget_Events/tables/TABLE_ID/insertAll",
    throttle = false,
    throttleDelay = 1000,
    lastEvent = "",
    refreshDate = 0,
    token = "";

  /*
   *  Private Methods
   */
  function refreshToken(cb) {
    var xhr = new XMLHttpRequest();

    if (new Date() - refreshDate < 3580000) {
      return cb({});
    }

    xhr.open("POST", REFRESH_URL, true);
    xhr.onloadend = function() {
      var resp = JSON.parse(xhr.response);

      cb({ token: resp.access_token, refreshedAt: new Date() });
    };

    xhr.send();
  }

  function isThrottled(event) {
    return throttle && (lastEvent === event);
  }

  /*
   *  Public Methods
   */
  function log(tableName, params) {
    if (!tableName || !params || (params.hasOwnProperty("event") && !params.event) ||
      (params.hasOwnProperty("event") && isThrottled(params.event))) {
      return;
    }

    throttle = true;
    lastEvent = params.event;

    setTimeout(function () {
      throttle = false;
    }, throttleDelay);

    function insertWithToken(refreshData) {
      var xhr = new XMLHttpRequest(),
        insertData, url;

      url = serviceUrl.replace("TABLE_ID", tableName);
      refreshDate = refreshData.refreshedAt || refreshDate;
      token = refreshData.token || token;
      insertData = utils.getInsertData(params);

      // Insert the data.
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + token);

      if (params.cb && typeof params.cb === "function") {
        xhr.onloadend = function() {
          params.cb(xhr.response);
        };
      }

      xhr.send(JSON.stringify(insertData));
    }

    return refreshToken(insertWithToken);
  }

  return {
    "log": log
  };
})(RiseVision.Common.LoggerUtils);
/* global WebFont */

var RiseVision = RiseVision || {};

RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Utilities = (function() {

  function getFontCssStyle(className, fontObj) {
    var family = "font-family: " + decodeURIComponent(fontObj.font.family).replace(/'/g, "") + "; ";
    var color = "color: " + (fontObj.color ? fontObj.color : fontObj.forecolor) + "; ";
    var size = "font-size: " + (fontObj.size.indexOf("px") === -1 ? fontObj.size + "px; " : fontObj.size + "; ");
    var weight = "font-weight: " + (fontObj.bold ? "bold" : "normal") + "; ";
    var italic = "font-style: " + (fontObj.italic ? "italic" : "normal") + "; ";
    var underline = "text-decoration: " + (fontObj.underline ? "underline" : "none") + "; ";
    var highlight = "background-color: " + (fontObj.highlightColor ? fontObj.highlightColor : fontObj.backcolor) + ";";

    return "." + className + " {" + family + color + size + weight + italic + underline + highlight + "}";
  }

  function addCSSRules(rules) {
    var style = document.createElement("style");

    for (var i = 0, length = rules.length; i < length; i++) {
      style.appendChild(document.createTextNode(rules[i]));
    }

    document.head.appendChild(style);
  }

  /*
   * Loads Google or custom fonts, if applicable, and injects CSS styles
   * into the head of the document.
   *
   * @param    array    settings    Array of objects with the following form:
 *                                   [{
 *                                     "class": "date",
 *                                     "fontSetting": {
 *                                         bold: true,
 *                                         color: "black",
 *                                         font: {
 *                                           family: "Akronim",
 *                                           font: "Akronim",
 *                                           name: "Verdana",
 *                                           type: "google",
 *                                           url: "http://custom-font-url"
 *                                         },
 *                                         highlightColor: "transparent",
 *                                         italic: false,
 *                                         size: "20",
 *                                         underline: false
 *                                     }
 *                                   }]
   *
   *           object   contentDoc    Document object into which to inject styles
   *                                  and load fonts (optional).
   */
  function loadFonts(settings, cb) {
    var families = null,
      googleFamilies = [],
      customFamilies = [],
      customUrls = [];

    function callback() {
      if (cb && typeof cb === "function") {
        cb();
      }
    }

    function onGoogleFontsLoaded() {
      callback();
    }

    if (!settings || settings.length === 0) {
      callback();
      return;
    }

    // Check for custom css class names and add rules if so
    settings.forEach(function(item) {
      if (item.class && item.fontStyle) {
        addCSSRules([ getFontCssStyle(item.class, item.fontStyle) ]);
      }
    });

    // Google fonts
    for (var i = 0; i < settings.length; i++) {
      if (settings[i].fontStyle && settings[i].fontStyle.font.type &&
        (settings[i].fontStyle.font.type === "google")) {
        // Remove fallback font.
        families = settings[i].fontStyle.font.family.split(",")[0];

        // strip possible single quotes
        families = families.replace(/'/g, "");

        googleFamilies.push(families);
      }
    }

    // Custom fonts
    for (i = 0; i < settings.length; i++) {
      if (settings[i].fontStyle && settings[i].fontStyle.font.type &&
        (settings[i].fontStyle.font.type === "custom")) {
        // decode value and strip single quotes
        customFamilies.push(decodeURIComponent(settings[i].fontStyle.font.family).replace(/'/g, ""));
        // strip single quotes
        customUrls.push(settings[i].fontStyle.font.url.replace(/'/g, "\\'"));
      }
    }

    if (googleFamilies.length === 0 && customFamilies.length === 0) {
      callback();
    }
    else {
      // Load the fonts
      for (var j = 0; j < customFamilies.length; j += 1) {
        loadCustomFont(customFamilies[j], customUrls[j]);
      }

      if (googleFamilies.length > 0) {
        loadGoogleFonts(googleFamilies, onGoogleFontsLoaded);
      }
      else {
        callback();
      }
    }
  }

  function loadCustomFont(family, url, contentDoc) {
    var sheet = null;
    var rule = "font-family: " + family + "; " + "src: url('" + url + "');";

    contentDoc = contentDoc || document;

    sheet = contentDoc.styleSheets[0];

    if (sheet !== null) {
      sheet.addRule("@font-face", rule);
    }
  }

  function loadGoogleFonts(families, cb) {
    WebFont.load({
      google: {
        families: families
      },
      active: function() {
        if (cb && typeof cb === "function") {
          cb();
        }
      },
      inactive: function() {
        if (cb && typeof cb === "function") {
          cb();
        }
      },
      timeout: 2000
    });
  }

  function preloadImages(urls) {
    var length = urls.length,
      images = [];

    for (var i = 0; i < length; i++) {
      images[i] = new Image();
      images[i].src = urls[i];
    }
  }

  function getQueryParameter(param) {
    var query = window.location.search.substring(1),
      vars = query.split("&"),
      pair;

    for (var i = 0; i < vars.length; i++) {
      pair = vars[i].split("=");

      if (pair[0] == param) { // jshint ignore:line
        return decodeURIComponent(pair[1]);
      }
    }

    return "";
  }

  function getRiseCacheErrorMessage(statusCode) {
    var errorMessage = "";
    switch (statusCode) {
      case 404:
        errorMessage = "The file does not exist or cannot be accessed.";
        break;
      case 507:
        errorMessage = "There is not enough disk space to save the file on Rise Cache.";
        break;
      default:
        errorMessage = "There was a problem retrieving the file from Rise Cache.";
    }

    return errorMessage;
  }

  function unescapeHTML(html) {
    var div = document.createElement("div");

    div.innerHTML = html;

    return div.textContent;
  }

  function hasInternetConnection(filePath, callback) {
    var xhr = new XMLHttpRequest();

    if (!filePath || !callback || typeof callback !== "function") {
      return;
    }

    xhr.open("HEAD", filePath + "?cb=" + new Date().getTime(), false);

    try {
      xhr.send();

      callback((xhr.status >= 200 && xhr.status < 304));

    } catch (e) {
      callback(false);
    }
  }

  return {
    getQueryParameter: getQueryParameter,
    getFontCssStyle:  getFontCssStyle,
    addCSSRules:      addCSSRules,
    loadFonts:        loadFonts,
    loadCustomFont:   loadCustomFont,
    loadGoogleFonts:   loadGoogleFonts,
    preloadImages:    preloadImages,
    getRiseCacheErrorMessage: getRiseCacheErrorMessage,
    unescapeHTML: unescapeHTML,
    hasInternetConnection: hasInternetConnection
  };
})();

/* exported config */
if (typeof angular !== "undefined") {
  angular.module("risevision.common.i18n.config", [])
    .constant("LOCALES_PREFIX", "locales/translation_")
    .constant("LOCALES_SUFIX", ".json");
}

/* global gadgets */

var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = {};

RiseVision.Spreadsheet = (function (document, gadgets) {

  "use strict";

  // private variables
  var _prefs = new gadgets.Prefs(),
    _additionalParams = null;

  var _message = null;

  /*
   *  Private Methods
   */
  function _ready() {
    gadgets.rpc.call("", "rsevent_ready", null, _prefs.getString("id"), true, true, true, true, true);
  }

  /*function _done() {
    gadgets.rpc.call("", "rsevent_done", null, _prefs.getString("id"));
  }*/

  function _init() {
    _message = new RiseVision.Common.Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    _ready();
  }

  /*
   *  Public Methods
   */
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

  return {
    "getTableName": getTableName,
    "logEvent": logEvent,
    "setAdditionalParams": setAdditionalParams,
    "pause": pause,
    "play": play,
    "stop": stop
  };

})(document, gadgets);



var RiseVision = RiseVision || {};
RiseVision.Common = RiseVision.Common || {};

RiseVision.Common.Message = function (mainContainer, messageContainer) {
  "use strict";

  var _active = false;

  function _init() {
    try {
      messageContainer.style.height = mainContainer.style.height;
    } catch (e) {
      console.warn("Can't initialize Message - ", e.message);
    }
  }

  /*
   *  Public Methods
   */
  function hide() {
    if (_active) {
      // clear content of message container
      while (messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
      }

      // hide message container
      messageContainer.style.display = "none";

      // show main container
      mainContainer.style.visibility = "visible";

      _active = false;
    }
  }

  function show(message) {
    var fragment = document.createDocumentFragment(),
      p;

    if (!_active) {
      // hide main container
      mainContainer.style.visibility = "hidden";

      messageContainer.style.display = "block";

      // create message element
      p = document.createElement("p");
      p.innerHTML = message;
      p.setAttribute("class", "message");

      fragment.appendChild(p);
      messageContainer.appendChild(fragment);

      _active = true;
    } else {
      // message already being shown, update message text
      p = messageContainer.querySelector(".message");
      p.innerHTML = message;
    }
  }

  _init();

  return {
    "hide": hide,
    "show": show
  };
};

/* global RiseVision, gadgets */

(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  // Disable context menu (right click menu)
  window.oncontextmenu = function () {
    return false;
  };

  function configure(names, values) {
    var additionalParams,
      companyId = "",
      displayId = "";

    if (Array.isArray(names) && names.length > 0 && Array.isArray(values) && values.length > 0) {
      // company id
      if (names[0] === "companyId") {
        companyId = values[0];
      }

      // display id
      if (names[1] === "displayId") {
        if (values[1]) {
          displayId = values[1];
        }
        else {
          displayId = "preview";
        }
      }

      // provide LoggerUtils the ids to use
      RiseVision.Common.LoggerUtils.setIds(companyId, displayId);

      // additional params
      if (names[2] === "additionalParams") {
        additionalParams = JSON.parse(values[2]);

        RiseVision.Spreadsheet.setAdditionalParams(additionalParams);
      }
    }
  }

  function play() {
    RiseVision.Spreadsheet.play();
  }

  function pause() {
    RiseVision.Spreadsheet.pause();
  }

  function stop() {
    RiseVision.Spreadsheet.stop();
  }

  if (id && id !== "") {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);
    gadgets.rpc.register("rsparam_set_" + id, configure);
    gadgets.rpc.call("", "rsparam_get", null, id, ["companyId", "displayId", "additionalParams"]);
  }

})(window, document, gadgets);

/* jshint ignore:start */
var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-57092159-11']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/* jshint ignore:end */
