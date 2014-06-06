var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function($,gadgets, i18n, gapi) {
  "use strict";

  // private constants
  var HELP_URL = "http://www.risevision.com/help/users/what-are-gadgets/" +
    "free-gadgets/rise-vision-google-spreadsheet/",

      PICKER_ORIGIN = "http://rdn-test.appspot.com/",

      SPREADSHEET_API = "https://spreadsheets.google.com/feeds/worksheets/" +
    "{key}/public/basic";


  // private variables
  var _prefs = null, _pickerApiLoaded = false, _authScope,
      _headerRows = 0, _range="", _el, _fileID = null;

  // private functions
  function _bind() {
    // Add event handlers
    $("#save").on("click", function() {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function() {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function() {
      window.open(HELP_URL, "_blank");
    });

    $("#google-drive").click(function() {
        if(_pickerApiLoaded && RiseVision.Authorization.getAuthToken()){
          _createPicker();
          return;
        }

        if(!RiseVision.Authorization.getAuthToken()){
          // Initiate the authorization this time with UI (immediate = false)
          RiseVision.Authorization.authorize(false, _authScope, function(oauthToken){
            if (oauthToken) {
              // Load the Picker API
              gapi.load('picker', {'callback': _onPickerApiLoaded });
            }
          });
          return;
        }

        if(!_pickerApiLoaded){
          // Load the Picker API
          gapi.load('picker', {'callback': _onPickerApiLoaded });
          return;
        }

    });

    $("input[name='cells']").change(function() {
      var val = $(this).val();

      if ($(this).is(":checked")) {
        if (val === "range") {
          _range = _el.rangeInp.val();
          _el.rangeInp.prop('disabled', false);
          $("label[for='range']").removeClass('label-disabled');
        }
        else {
          _range = "";
          _el.rangeInp.val("");
          _el.rangeInp.prop('disabled', true);
          $("label[for='range']").addClass('label-disabled');
        }
      }

      if(_el.urlOptionsCtn.is(":visible")){ _configureURL(); }

    });

    _el.sheetSel.change(function() {
      _configureURL();
    });

    _el.headerRowsSel.change(function() {
      _headerRows = Number($(this).val());
      _configureURL();
    });

    _el.rangeInp.blur(function() {
      _range = $(this).val();
      _configureURL();
    });
  }

  function _cache() {
    _el = {
      wrapperCtn:           $(".widget-wrapper"),
      alertCtn:             $("#settings-alert"),
      urlInp:               $("#url"),
      urlOptionsCtn:        $("div.url-options"),
      sheetSel:             $("#sheet"),
      rangeInp:             $("#range"),
      headerRowsSel:        $("#headerRows")
    };
  }

  function _configureSheets(sheets){
    _el.sheetSel.empty();

    $.each(sheets,function(i, item){
      _el.sheetSel.append(item);
    });
  }

  function _configureURL(){
    // configure URL with value from sheets select element
    var url = _el.sheetSel.val();
    // add header rows to URL
    url += "&headers=" + _headerRows;
    // add range to URL if applicable
    if (_range != "") {
      url += "&range=" + _range;
    }

    _el.urlInp.val(url);
  }

  function _createPicker(){
    if(_pickerApiLoaded && RiseVision.Authorization.getAuthToken()){
          var picker = new google.picker.PickerBuilder().
              setOrigin(PICKER_ORIGIN).
              addView(google.picker.ViewId.SPREADSHEETS).
              setOAuthToken(RiseVision.Authorization.getAuthToken()).
              setCallback(_onPickerAction).
              build();

      picker.setVisible(true);
    }
  }

  function _getAdditionalParams(){
    var additionalParams = {};

    additionalParams["url"] = encodeURI($.trim(_el.urlInp.val()));
    additionalParams["sheet"] = encodeURI(_el.sheetSel.val());

    return additionalParams;
  }

  function _getSheets(fileID, callbackFn){
    var option, href, sheets = [],
        api = SPREADSHEET_API.replace("{key}",fileID),
        dummy = Math.ceil(Math.random() * 100);

    $.getJSON(encodeURI(api + "?alt=json&dummy=" + dummy))
      .done(function(data) {
        $.each(data.feed.entry, function(i, item){
          option = document.createElement("option");
          //Sheet name
          option.text = item.title.$t;
          /* Visualization API doesn't refresh properly if 'pub' parameter is
           present, so remove it.
           */
          href = item.link[2].href;
          // Visualization URL
          href = href.replace("&pub=1", "");
          /* Use docs.google.com domain when using new Google Sheets due to
           this bug - http://goo.gl/4Zf8LQ.
           If /gviz/ is in the URL path, then use this as an indicator that the
           new Google Sheets is being used.
           */
          option.value = (href.indexOf("/gviz/") == -1) ? option.value = href :
            href.replace("spreadsheets.google.com", "docs.google.com");

          sheets.push(option);
        });

        callbackFn.call(null, sheets);

      })
      .fail(function(jqxhr) {
        _el.alertCtn.empty().append(i18n.t("google-picker-fail")).show();
        _el.urlOptionsCtn.hide();
        _el.wrapperCtn.scrollTop(0);

        //console.log(jqxhr.status + " - " + jqxhr.statusText);
        //console.log(jqxhr.responseText);

        callbackFn.call(null, sheets);

      });
  }

  function _getParams(){
    var params = "";

    /* Only save spreadsheet metadata settings if file has been selected
    using Google Picker(i.e. if fileID has a value).
     */
    if (_fileID !== null) {
      // If Range is chosen
      if($("#cells-range").is(":checked")){
        params += "&up_cells=" + $("#cells-range").val() +
          "&up_range=" + $.trim(_el.rangeInp.val());
      } else {
        params += "&up_cells=" + $("#cells-sheet").val();
      }

      params += "&up_headerRows=" + _el.headerRowsSel.val() +
        "&up_fileID=" + _fileID;
    }

    return params;
  }

  function _getValidationsMap(){
    return {
      "required": {
        fn: RiseVision.Common.Validation.isValidRequired,
        localize: "validation.required",
        conditional: null
      },
      "url": {
        fn: RiseVision.Common.Validation.isValidURL,
        localize: "validation.valid_url",
        conditional: null
      }
    }
  }

  function _onPickerApiLoaded() {
    _pickerApiLoaded = true;
    _createPicker();
  }

  function _onPickerAction(data){
    //console.dir(data);
    var doc;

    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      _el.urlInp.val("");

      doc = data[google.picker.Response.DOCUMENTS][0];

      _getSheets(doc.id, function(sheets) {
        if (sheets.length > 0) {
          _fileID = doc.id;
          _configureSheets(sheets);
          _configureURL();
          _el.alertCtn.empty().hide();
          _el.urlOptionsCtn.show();
        }
      });
    }
  }

  function _saveSettings(){
    var settings = null;

    // validate
    if(!_validate()){
      _el.alertCtn.show();
      _el.wrapperCtn.scrollTop(0);
    } else {
      //construct settings object
      settings = {
        "params" : _getParams(),
        "additionalParams" : JSON.stringify(_getAdditionalParams())
      }

      gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
    }
  }

  function _validate(){
    var itemsToValidate = [
        { el: document.getElementById("url"),
          rules: "required|url",
          fieldName: "URL"
        }
      ],
      passed = true;

    _el.alertCtn.empty().hide();

    for(var i = 0; i < itemsToValidate.length; i++){
      if(!_validateItem(itemsToValidate[i])){
        passed = false;
        break;
      }
    }

    return passed;
  }

  function _validateItem(item){
    var rules = item.rules.split('|'),
      validationsMap = _getValidationsMap(),
      alerts = document.getElementById("settings-alert"),
      passed = true;

    for (var i = 0, ruleLength = rules.length; i < ruleLength; i++) {
      var rule = rules[i];

      if (validationsMap[rule].fn.apply(null,
        [item.el,validationsMap[rule].conditional]) === false) {
        passed = false;
        alerts.innerHTML = i18n.t(validationsMap[rule].localize,
          { fieldName: item.fieldName });
        break;
      }
    }

    return passed;
  }

  // public space
  return {
    init: function (authScope) {
      _authScope = authScope;

      _cache();
      _bind();

      _el.alertCtn.hide();
      _el.urlOptionsCtn.hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          /* Get metadata from the spreadsheet if fileID exists. It will only
           exist if the spreadsheet has been selected using Google Picker.
            */
          if (_prefs.getString("fileID") !== "") {
            _fileID = _prefs.getString("fileID");

            // Cells
            $("input[type='radio'][name='cells']").each(function() {
              if ($(this).val() === _prefs.getString("cells")) {
                $(this).attr("checked", "checked");
              }
            });

            // Range
            if(_prefs.getString("range") && _prefs.getString("range") !== ""){
              _el.rangeInp.val(_prefs.getString("range"));
              _range = _prefs.getString("range");
            }

            // Worksheets
            _getSheets(_prefs.getString("fileID"), function(sheets) {
              if (sheets.length > 0) {
                _configureSheets(sheets);
                _el.sheetSel.val(decodeURI(result["sheet"]));
                _el.urlOptionsCtn.show();
              }
            });

            // Header Rows
            _el.headerRowsSel.val(_prefs.getString("headerRows"));
            _headerRows = _prefs.getInt("headerRows");
          }

          // URL Data
          _el.urlInp.val(decodeURI(result["url"]));

        } else {
          // Set default radio button selected to be Entire Sheet
          $("input[type='radio'][name='cells']").each(function() {
            if ($(this).val() === "sheet") {
              $(this).attr("checked", "checked");
            }
          });
        }

        /* Manually trigger event handlers so that the visibility of fields
         can be set. */
        $("input[name='cells']").trigger("change");

        i18n.init({ fallbackLng: "en" }, function(t) {
          _el.wrapperCtn.i18n().show();

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
            container : _el.wrapperCtn,
            topSpacing : 41,	//top margin + border of wrapper
            getWidthFrom : _el.wrapperCtn
          });
        });
      });
    }
  };

})($, gadgets, i18n, gapi);

var authScope = "https://www.googleapis.com/auth/drive";

RiseVision.Authorization.loadApi(function(){
  // Initiate the authorization without UI (immediate = true)
  RiseVision.Authorization.authorize(true, authScope, function() {
    RiseVision.GoogleSpreadsheet.Settings.init(authScope);
  });

});




