var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function($,gadgets, i18n, gapi) {
  "use strict";

  // private constants
  var HELP_URL = "http://www.risevision.com/help/users/what-are-gadgets/" +
    "free-gadgets/rise-vision-google-spreadsheet/",

      SPREADSHEET_API = "https://spreadsheets.google.com/feeds/worksheets/" +
    "{key}/public/basic",

      DEFAULT_HEADER_ROWS         = 0,
      DEFAULT_REFRESH             = 60,
      DEFAULT_SCROLL_RESUME       = 5;

  var DEFAULT_FONT_STYLING = {
    "font": "Verdana",
    "font-style": "Verdana, Geneva, sans-serif",
    "font-url": "",
    "font-size": "18",
    "color": "#000",
    "bold": false,
    "italic": false
  }

  // private variables
  var _prefs = null, _pickerApiLoaded = false, _authScope,
      _el, _fileID = null, _origin;

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
          _el.$rangeInp.prop('disabled', false);
          $("label[for='range']").removeClass('label-disabled');
        }
        else {
          _el.$rangeInp.val("");
          _el.$rangeInp.prop('disabled', true);
          $("label[for='range']").addClass('label-disabled');
        }
      }

      if(_el.$urlOptionsCtn.is(":visible")){ _configureURL(); }

    });

    _el.$sheetSel.change(function() {
      _configureURL();
    });

    _el.$headerRowsSel.change(function() {
      _configureURL();
    });

    _el.$rangeInp.blur(function() {
      _configureURL();
    });

    $("input[name='scroll-direction']").change(function() {
      if ($(this).is(":checked")) {
        if ($(this).val() === "none") {
          _el.$scrollOptionsCtn.hide();
        }
        else {
          _el.$scrollOptionsCtn.show();
        }
      }

    });
  }

  function _cache() {
    _el = {
      $wrapperCtn:                   $(".widget-wrapper"),
      $alertCtn:                     $("#settings-alert"),
      $urlInp:                       $("#url"),
      $urlOptionsCtn:                $("div.url-options"),
      $sheetSel:                     $("#sheet"),
      $rangeInp:                     $("#range"),
      $headerRowsSel:                $("#headerRows"),
      $refreshInp:                   $("#refresh"),
      $scrollOptionsCtn:             $("#scroll-options"),
      $scrollBySel:                  $("#scroll-by"),
      $scrollSpeedSel:               $("#scroll-speed"),
      $scrollResumesInp:             $("#scroll-resumes"),
      $rowPaddingInp:                $("#row-padding"),
      $columnPaddingInp:             $("#column-padding")
    };
  }

  function _configureFontStyling(config){
    var $fontPicker = $("." + config["prefix"] + "-font-picker"),
        $fontSizePicker = $("." + config["prefix"] + "-font-size-picker"),
        $bold = $("#" + config["prefix"] + "-bold"),
        $italic = $("#" + config["prefix"] + "-italic"),
        $colorPicker = $("#" + config["prefix"] + "-color-picker"),
        $sampleText = $("#column-" + config["prefix"] + "-font .font-picker-text");

    // Instantiate the font picker
    $fontPicker.fontPicker({
      "font": config.styling["font"],
      "font-url": config.styling["font-url"],
      "load": onFontsLoaded
    });

    // Handler for font picker instantiation complete (fonts loaded)
    function onFontsLoaded(){
      var $textTemplate = $('<span class="font-text">' +
        i18n.t(config["prefix"] + ".text") + '</span>');

      // Apply the template to the sample text
      $sampleText.append($textTemplate);

      // Apply font family style
      //TODO: possibly make this conditional based on font-style being "Google"
      if(String(config.styling["font-style"]).indexOf(",") !== -1){
        // It is a standard font so font family is accessible
        $textTemplate.css("font-family",config.styling["font-style"]);
      } else {
        // It is a google or custom font, use just the font name
        $textTemplate.css("font-family",config.styling["font"]);
      }

      // Apply font size
      $textTemplate.css("font-size",
          config.styling["font-size"] + "px");

      // Apply bold (or not)
      if(config.styling.bold){
        $textTemplate.css("font-weight", "bold");
      } else {
        $textTemplate.css("font-weight", "normal");
      }

      // Apply italic (or not)
      if(config.styling.italic){
        $textTemplate.css("font-style", "italic");
      } else {
        $textTemplate.css("font-style", "normal");
      }

      // Apply color
      $textTemplate.css("color", config.styling.color);
    }

    // Instantiate the font size picker
    $fontSizePicker.fontSizePicker({
      "font-size":config.styling["font-size"]
    });

    // Set the bold checkbox
    $bold.attr("checked", config.styling.bold);
    // Set the italic checkbox
    $italic.attr("checked", config.styling.italic);

    // Instantiate the color picker along with its change handler
    $colorPicker.spectrum({
      type: "background",
      color: config.styling.color,
      showInput: true,
      chooseText: i18n.t("common.buttons.apply"),
      cancelText: i18n.t("common.buttons.cancel"),
      change: function(value) {
        $sampleText.find(".font-text").css("color", value.toHexString());
      }
    });

    // Font picker change
    $fontPicker
      .on("standardFontSelected", function(e, font, fontFamily) {
        $sampleText.find(".font-text").css("font-family",fontFamily);
      })
      .on("googleFontSelected", function(e, font) {
        $sampleText.find(".font-text").css("font-family",font);
      })
      .on("customFontSelected", function(e, font, fontURL) {
        console.log("customFontSelected");
        console.log(font, fontURL);
        // TODO: sort out dealing with a custom font
      });

    // Font Size Picker change
    $fontSizePicker
      .on("sizeChanged", function(e, value){
        $sampleText.find(".font-text").css("font-size", value + "px");
      });

    // Bold change
    $bold.on("click", function(event) {
      if ($(this).is(":checked")) {
        $sampleText.find(".font-text").css("font-weight", "bold");
      }
      else {
        $sampleText.find(".font-text").css("font-weight", "normal");
      }
    });

    // Italic change
    $italic.on("click", function(event) {
      if ($(this).is(":checked")) {
        $sampleText.find(".font-text").css("font-style", "italic");
      }
      else {
        $sampleText.find(".font-text").css("font-style", "normal");
      }
    });
  }

  function _configureSheets(sheets){
    _el.$sheetSel.empty();

    $.each(sheets,function(i, item){
      _el.$sheetSel.append(item);
    });

    _el.$sheetSel.selectpicker('refresh');
  }

  function _configureURL(){
    // configure URL with value from sheets select element
    var url = _el.$sheetSel.val();
    // add header rows to URL
    url += "&headers=" + _el.$headerRowsSel.val();
    // add range to URL if applicable
    if ($.trim(_el.$rangeInp.val()) != "") {
      url += "&range=" + $.trim(_el.$rangeInp.val());
    }

    _el.$urlInp.val(url);
  }

  function _createPicker(){
    if(_pickerApiLoaded && RiseVision.Authorization.getAuthToken()){
          var picker = new google.picker.PickerBuilder().
              setOrigin(_origin).
              addView(google.picker.ViewId.SPREADSHEETS).
              setOAuthToken(RiseVision.Authorization.getAuthToken()).
              setCallback(_onPickerAction).
              build();

      picker.setVisible(true);
    }
  }

  function _getAdditionalParams(){
    var additionalParams = {},
        headerStylingData = _getFontStylingData("header");

    additionalParams["url"] = encodeURI($.trim(_el.$urlInp.val()));
    additionalParams["sheet"] = encodeURI(_el.$sheetSel.val());

    $.extend(additionalParams, headerStylingData.additional);

    return additionalParams;
  }

  function _getFontStylingData(prefix){
    var data = {},
      $fontPicker = $("." + prefix + "-font-picker"),
      $fontSizePicker = $("." + prefix + "-font-size-picker"),
      $bold = $("#" + prefix + "-bold"),
      $italic = $("#" + prefix + "-italic"),
      $colorPicker = $("#" + prefix + "-color-picker");

    data["additional"] = {};
    data["additional"][prefix + "-font"] =
      $fontPicker.data("plugin_fontPicker").getFont();
    data["additional"][prefix + "-font-style"] =
      $fontPicker.data("plugin_fontPicker").getFontStyle();
    data["additional"][prefix + "-font-url"] =
      $fontPicker.data("plugin_fontPicker").getFontURL();
    data["additional"][prefix + "-color"] =
      $colorPicker.spectrum("get").toHexString();

    data.params = "&up_" + prefix + "-font-size=" +
      $fontSizePicker.data("plugin_fontSizePicker").getFontSize() +
      "&up_" + prefix + "-bold=" + $bold.is(":checked").toString() +
      "&up_" + prefix + "-italic=" + $italic.is(":checked").toString();

    return data;
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
        _el.$alertCtn.empty().append(i18n.t("google-picker-fail")).show();
        _el.$urlOptionsCtn.hide();
        _el.$wrapperCtn.scrollTop(0);

        //console.log(jqxhr.status + " - " + jqxhr.statusText);
        //console.log(jqxhr.responseText);

        callbackFn.call(null, sheets);

      });
  }

  function _getParams(){
    var params = "",
        headerStylingData = _getFontStylingData("header");

    /* Only save spreadsheet metadata settings if file has been selected
    using Google Picker(i.e. if fileID has a value).
     */
    if (_fileID !== null) {
      // If Range is chosen
      if($("#cells-range").is(":checked")){
        params += "&up_cells=" + $("#cells-range").val() +
          "&up_range=" + $.trim(_el.$rangeInp.val());
      } else {
        params += "&up_cells=" + $("#cells-sheet").val();
      }

      params += "&up_headerRows=" + _el.$headerRowsSel.val() +
        "&up_fileID=" + _fileID;
    }

    params += "&up_refresh=" + ($.trim(_el.$refreshInp.val()) * 1000);

    if($("#scroll-up").is(":checked")){
      params += "&up_scroll-direction=" + $("#scroll-up").val() +
        "&up_scroll-by=" + _el.$scrollBySel.val() +
        "&up_scroll-speed=" + _el.$scrollSpeedSel.val() +
        "&up_scroll-resumes=" + ($.trim(_el.$scrollResumesInp.val()) * 1000);
    } else {
      params += "&up_scroll-direction=" + $("#scroll-none").val();
    }

    if(_el.$rowPaddingInp.val() !== ""){
      params += "&up_row-padding=" + $.trim(_el.$rowPaddingInp.val());
    }

    if(_el.$columnPaddingInp.val() !== ""){
      params += "&up_column-padding=" + $.trim(_el.$columnPaddingInp.val());
    }

    params += headerStylingData.params;

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
      },
      "numeric": {
        fn: RiseVision.Common.Validation.isValidNumber,
        localize: "validation.numeric",
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
      _el.$urlInp.val("");

      doc = data[google.picker.Response.DOCUMENTS][0];

      _getSheets(doc.id, function(sheets) {
        if (sheets.length > 0) {
          _fileID = doc.id;
          _configureSheets(sheets);
          _configureURL();
          _el.$headerRowsSel.val(DEFAULT_HEADER_ROWS);
          _el.$alertCtn.empty().hide();
          _el.$urlOptionsCtn.show();
        }
      });
    }
  }

  function _saveSettings(){
    var settings = null;

    // validate
    if(!_validate()){
      _el.$alertCtn.show();
      _el.$wrapperCtn.scrollTop(0);
    } else {
      //construct settings object
      settings = {
        "params" : _getParams(),
        "additionalParams" : JSON.stringify(_getAdditionalParams())
      };

      gadgets.rpc.call("", "rscmd_saveSettings", null, settings);
    }
  }

  function _validate(){
    var itemsToValidate = [
        { el: document.getElementById("url"),
          rules: "required|url",
          fieldName: i18n.t("url")
        },
        {
          el: document.getElementById("refresh"),
          rules: "required|numeric",
          fieldName: i18n.t("refresh.label")
        }
      ],
      passed = true;

    if(_el.$scrollOptionsCtn.is(":visible")){
      itemsToValidate.push({
        el: document.getElementById("scroll-resumes"),
        rules: "required|numeric",
        fieldName: i18n.t("scroll-resumes")
      });
    }

    if(_el.$rowPaddingInp.val() !== ""){
      itemsToValidate.push({
        el: document.getElementById("row-padding"),
        rules: "numeric",
        fieldName: i18n.t("row-padding")
      });
    }

    if(_el.$columnPaddingInp.val() !== ""){
      itemsToValidate.push({
        el: document.getElementById("column-padding"),
        rules: "numeric",
        fieldName: i18n.t("column-padding")
      });
    }

    _el.$alertCtn.empty().hide();

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
      if(typeof authScope !== "string" || authScope === ""){
        throw new Error("GoogleSpreadsheet Widget Settings: " +
          " authorization scope value required");
        return;
      }
      _authScope = authScope;
      _origin = document.referrer.split("/").slice(0,3).join("/") + "/";

      _cache();
      _bind();

      _el.$alertCtn.hide();
      _el.$urlOptionsCtn.hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {
        var headerStyling = {};

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
                return false;
              }
            });

            // Range
            if(_prefs.getString("range") && _prefs.getString("range") !== ""){
              _el.$rangeInp.val(_prefs.getString("range"));
            }

            // Worksheets
            _getSheets(_prefs.getString("fileID"), function(sheets) {
              if (sheets.length > 0) {
                _configureSheets(sheets);
                _el.$sheetSel.val(decodeURI(result["sheet"]));
                _el.$urlOptionsCtn.show();
              }
            });

            // Header Rows
            _el.$headerRowsSel.val(_prefs.getString("headerRows"));
          }

          _el.$urlInp.val(decodeURI(result["url"]));
          _el.$refreshInp.val(_prefs.getInt("refresh") / 1000);

          $("input[type='radio'][name='scroll-direction']").each(function() {
            if ($(this).val() === _prefs.getString("scroll-direction")) {
              $(this).attr("checked", "checked");
              return false;
            }
          });

          if(_prefs.getString("scroll-direction") !== "none"){
            _el.$scrollBySel.val(_prefs.getString("scroll-by"));
            _el.$scrollSpeedSel.val(_prefs.getString("scroll-speed"));
            _el.$scrollResumesInp.val(_prefs.getInt("scroll-resumes") / 1000);
          } else {
            // Set default scroll resume
            _el.$scrollResumesInp.val(DEFAULT_SCROLL_RESUME);
          }

          if(_prefs.getInt("row-padding")){
            _el.$rowPaddingInp.val(_prefs.getInt("row-padding"));
          }

          if(_prefs.getInt("column-padding")){
            _el.$columnPaddingInp.val(_prefs.getInt("column-padding"));
          }

          headerStyling["font"] = result["header-font"];
          headerStyling["font-style"] = result["header-font-style"];
          headerStyling["font-url"] = result["header-font-url"];
          headerStyling["font-size"] =  _prefs.getString("header-font-size");
          headerStyling["bold"] = _prefs.getBool("header-bold");
          headerStyling["italic"] = _prefs.getBool("header-italic");
          headerStyling["color"] = result["header-color"];
        } else {
          // Set default radio button selected to be Entire Sheet
          $("input[type='radio'][name='cells']").each(function() {
            if ($(this).val() === "sheet") {
              $(this).attr("checked", "checked");
              return false;
            }
          });

          // Set default header rows
          _el.$headerRowsSel.val(DEFAULT_HEADER_ROWS);

          // Set default data refresh
          _el.$refreshInp.val(DEFAULT_REFRESH);

          // Set default radio button for scroll direction
          $("input[type='radio'][name='scroll-direction']").each(function() {
            if ($(this).val() === "none") {
              $(this).attr("checked", "checked");
              return false;
            }
          });

          // Set default scroll resume
          _el.$scrollResumesInp.val(DEFAULT_SCROLL_RESUME);

          $.extend(headerStyling, DEFAULT_FONT_STYLING);
        }

        /* Manually trigger event handlers so that the visibility of fields
         can be set. */
        $("input[name='cells']").trigger("change");

        $("input[name='scroll-direction']").trigger("change");

        i18n.init({ fallbackLng: "en" }, function(t) {
          /* Configure font styling UI, has to be after i18n has initialized
           because color picker button labels rely on translations
           */
          _configureFontStyling({
            prefix: "header",
            styling: headerStyling
          });

          _el.$wrapperCtn.i18n().show();
          $(".form-control").selectpicker();

          // Set tooltips only after i18n has shown
          $("label[for='refresh'] + button").popover({trigger:'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
            container : _el.$wrapperCtn,
            topSpacing : 41,	//top margin + border of wrapper
            getWidthFrom : _el.$wrapperCtn
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




