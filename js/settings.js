var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function ($, window, gadgets, i18n, gapi) {
  "use strict";

  // private constants
  var HELP_URL = "http://www.risevision.com/help/users/what-are-gadgets/" +
    "free-gadgets/rise-vision-google-spreadsheet/",

    SPREADSHEET_API = "https://spreadsheets.google.com/feeds/worksheets/" +
    "{key}/public/basic",

    DEFAULT_HEADER_ROWS         = 0,
    DEFAULT_REFRESH             = 60,
    DEFAULT_SCROLL_RESUME       = 5,

    DEFAULT_FONT_STYLING = {
      "font": "Verdana",
      "font-style": "Verdana, Geneva, sans-serif",
      "font-url": "",
      "font-size": "18",
      "color": "#000",
      "bold": false,
      "italic": false
    },

    // private variables
    _prefs = null, _pickerApiLoaded = false, _authScope,
    _el, _fileID = null, _origin;

  function _cache() {
    _el = {
      $wrapperCtn:                   $(".wrapper"),
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

  function _configureColorPicker(config) {
    var options = {
      preferredFormat: "hex",
      showInput: true,
      type: "background",
      chooseText: i18n.t("common.buttons.apply"),
      cancelText: i18n.t("common.buttons.cancel")
    };

    $.extend(true, options, config.options);

    config.$elem.spectrum(options);
  }

  function _configureSheets(sheets) {
    _el.$sheetSel.empty();

    $.each(sheets, function (i, item) {
      _el.$sheetSel.append(item);
    });

    _el.$sheetSel.selectpicker('refresh');
  }

  function _configureURL() {
    // configure URL with value from sheets select element
    var url = _el.$sheetSel.val();
    // add header rows to URL
    url += "&headers=" + _el.$headerRowsSel.val();
    // add range to URL if applicable
    if ($.trim(_el.$rangeInp.val()) !== "") {
      url += "&range=" + $.trim(_el.$rangeInp.val());
    }

    _el.$urlInp.val(url);
  }

  function _getFontStylingData(prefix) {
    var data = {},
      $fontPicker = $("#" + prefix + "-font .font-picker"),
      $fontSizePicker = $("#" + prefix + "-font .font-size-picker"),
      $bold = $("#" + prefix + "-bold"),
      $italic = $("#" + prefix + "-italic"),
      $colorPicker = $("#" + prefix + "-color-picker");

    data.additional = {};
    data.additional[prefix + "-font"] =
      $fontPicker.data("plugin_fontPicker").getFont();
    data.additional[prefix + "-font-style"] =
      $fontPicker.data("plugin_fontPicker").getFontStyle();
    data.additional[prefix + "-font-url"] =
      $fontPicker.data("plugin_fontPicker").getFontURL();
    data.additional[prefix + "-color"] =
      $colorPicker.spectrum("get").toHexString();

    data.params = "&up_" + prefix + "-font-size=" +
      $fontSizePicker.data("plugin_fontSizePicker").getFontSize() +
      "&up_" + prefix + "-bold=" + $bold.is(":checked").toString() +
      "&up_" + prefix + "-italic=" + $italic.is(":checked").toString();

    return data;
  }

  function _getSheets(fileID, callbackFn) {
    var option, href, sheets = [],
      api = SPREADSHEET_API.replace("{key}", fileID),
      dummy = Math.ceil(Math.random() * 100);

    $.getJSON(encodeURI(api + "?alt=json&dummy=" + dummy))
      .done(function (data) {
        $.each(data.feed.entry, function (i, item) {
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
          option.value = (href.indexOf("/gviz/") === -1) ? href :
              href.replace("spreadsheets.google.com", "docs.google.com");

          sheets.push(option);
        });

        callbackFn.call(null, sheets);

      })
      .fail(function () {
        _el.$alertCtn.empty().append(i18n.t("google-picker-fail")).show();
        _el.$urlOptionsCtn.hide();
        _el.$wrapperCtn.scrollTop(0);

        callbackFn.call(null, sheets);

      });
  }

  function _getValidationsMap() {
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
    };
  }

  function _getAdditionalParams() {
    var additionalParams = {},
      headerStylingData = _getFontStylingData("header"),
      dataStylingData = _getFontStylingData("data"),
      $rowColor = $("#row-color-picker"),
      $altRowColor = $("#alt-row-color-picker"),
      $backgroundColor = $("#background-color-picker");

    additionalParams.url = encodeURI($.trim(_el.$urlInp.val()));
    additionalParams.sheet = encodeURI(_el.$sheetSel.val());

    $.extend(additionalParams, headerStylingData.additional);
    $.extend(additionalParams, dataStylingData.additional);

    if ($rowColor.spectrum("get")) {
      additionalParams["row-color"] =
        $rowColor.spectrum("get").toHexString();
    }

    if ($altRowColor.spectrum("get")) {
      additionalParams["alt-row-color"] =
        $altRowColor.spectrum("get").toHexString();
    }

    if ($backgroundColor.spectrum("get")) {
      additionalParams["background-color"] =
        $backgroundColor.spectrum("get").toHexString();
    }

    return additionalParams;
  }

  function _getParams() {
    var params = "",
      headerStylingData = _getFontStylingData("header"),
      dataStylingData = _getFontStylingData("data"),
      $cellsRange = $("#cells-range"),
      $scrollUp = $("#scroll-up");


    /* Only save spreadsheet metadata settings if file has been selected
     using Google Picker(i.e. if fileID has a value).
     */
    if (_fileID !== null) {
      // If Range is chosen
      if ($cellsRange.is(":checked")) {
        params += "&up_cells=" + $cellsRange.val() +
          "&up_range=" + $.trim(_el.$rangeInp.val());
      } else {
        params += "&up_cells=" + $("#cells-sheet").val();
      }

      params += "&up_headerRows=" + _el.$headerRowsSel.val() +
        "&up_fileID=" + _fileID;
    }

    params += "&up_refresh=" + ($.trim(_el.$refreshInp.val()) * 1000);

    if ($scrollUp.is(":checked")) {
      params += "&up_scroll-direction=" + $scrollUp.val() +
        "&up_scroll-by=" + _el.$scrollBySel.val() +
        "&up_scroll-speed=" + _el.$scrollSpeedSel.val() +
        "&up_scroll-resumes=" + ($.trim(_el.$scrollResumesInp.val()) * 1000);
    } else {
      params += "&up_scroll-direction=" + $("#scroll-none").val();
    }

    if (_el.$rowPaddingInp.val() !== "") {
      params += "&up_row-padding=" + $.trim(_el.$rowPaddingInp.val());
    }

    if (_el.$columnPaddingInp.val() !== "") {
      params += "&up_column-padding=" + $.trim(_el.$columnPaddingInp.val());
    }

    params += headerStylingData.params;
    params += dataStylingData.params;

    return params;
  }

  function _configureFontStyling(config) {
    var $fontPicker = $("#" + config.prefix + "-font .font-picker"),
      $fontSizePicker = $("#" + config.prefix + "-font .font-size-picker"),
      $bold = $("#" + config.prefix + "-bold"),
      $italic = $("#" + config.prefix + "-italic"),
      $sampleText = $("#" + config.prefix + "-font .font-picker-text");

    // Handler for font picker instantiation complete (fonts loaded)
    function onFontsLoaded() {
      var $textTemplate = $('<span class="font-text">' +
          i18n.t(config.prefix + ".text") + '</span>'),
        fontStyle = config.styling["font-style"];

      // Apply the template to the sample text
      $sampleText.append($textTemplate);

      // Apply font family style
      if (fontStyle.toLowerCase().indexOf("google") !== -1) {
        // It is a google font, use just the font name
        $textTemplate.css("font-family", config.styling.font);
      } else if (fontStyle.toLowerCase().indexOf("custom") !== -1) {
        /* TODO: Font picker needs fixing to provide public API on
         retrieving the custom font name, temporarily using font which doesn't
         work right
         */
        $textTemplate.css("font-family", config.styling.font);
      } else {
        // It is a standard font so font family is accessible
        $textTemplate.css("font-family", fontStyle);
      }

      // Apply font size
      $textTemplate.css("font-size",
          config.styling["font-size"] + "px");

      // Apply bold (or not)
      if (config.styling.bold) {
        $textTemplate.css("font-weight", "bold");
      } else {
        $textTemplate.css("font-weight", "normal");
      }

      // Apply italic (or not)
      if (config.styling.italic) {
        $textTemplate.css("font-style", "italic");
      } else {
        $textTemplate.css("font-style", "normal");
      }

      // Apply color
      $textTemplate.css("color", config.styling.color);
    }

    // Instantiate the font picker
    $fontPicker.fontPicker({
      "font": config.styling.font,
      "font-url": config.styling["font-url"],
      "load": onFontsLoaded
    });

    // Instantiate the font size picker
    $fontSizePicker.fontSizePicker({
      "font-size": config.styling["font-size"]
    });

    // Set the bold checkbox
    $bold.attr("checked", config.styling.bold);
    // Set the italic checkbox
    $italic.attr("checked", config.styling.italic);

    // Instantiate the color picker along with its change handler
    _configureColorPicker({
      "$elem": $("#" + config.prefix + "-color-picker"),
      "options": {
        "color": config.styling.color,
        "change": function (value) {
          $sampleText.find(".font-text").css("color", value.toHexString());
        }
      }
    });

    // Font picker change
    $fontPicker
      .on("standardFontSelected", function (e, font, fontFamily) {
        $sampleText.find(".font-text").css("font-family", fontFamily);
      })
      .on("googleFontSelected", function (e, font) {
        $sampleText.find(".font-text").css("font-family", font);
      })
      .on("customFontSelected", function (e, font, fontURL) {
        $sampleText.find(".font-text").css("font-family", font);
      });

    // Font Size Picker change
    $fontSizePicker
      .on("sizeChanged", function (e, value) {
        $sampleText.find(".font-text").css("font-size", value + "px");
      });

    // Bold change
    $bold.on("click", function () {
      if ($(this).is(":checked")) {
        $sampleText.find(".font-text").css("font-weight", "bold");
      } else {
        $sampleText.find(".font-text").css("font-weight", "normal");
      }
    });

    // Italic change
    $italic.on("click", function () {
      if ($(this).is(":checked")) {
        $sampleText.find(".font-text").css("font-style", "italic");
      } else {
        $sampleText.find(".font-text").css("font-style", "normal");
      }
    });
  }

  function _onPickerAction(data) {
    //console.dir(data);
    var doc;

    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      _el.$urlInp.val("");

      doc = data[google.picker.Response.DOCUMENTS][0];

      _getSheets(doc.id, function (sheets) {
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

  function _createPicker() {
    if (_pickerApiLoaded && RiseVision.Authorization.getAuthToken()) {
      var picker = new google.picker.PickerBuilder().
          setOrigin(_origin).
          addView(google.picker.ViewId.SPREADSHEETS).
          setOAuthToken(RiseVision.Authorization.getAuthToken()).
          setCallback(_onPickerAction).
          build();

      picker.setVisible(true);
    }
  }

  function _onPickerApiLoaded() {
    _pickerApiLoaded = true;
    _createPicker();
  }

  function _validateItem(item) {
    var rules = item.rules.split('|'),
      validationsMap = _getValidationsMap(),
      alerts = document.getElementById("settings-alert"),
      passed = true,
      ruleLength = rules.length,
      i, rule;

    for (i = 0; i < ruleLength; i += 1) {
      rule = rules[i];

      if (validationsMap[rule].fn.apply(null,
          [item.el, validationsMap[rule].conditional]) === false) {
        passed = false;
        alerts.innerHTML = i18n.t(validationsMap[rule].localize,
          { fieldName: item.fieldName });
        break;
      }
    }

    return passed;
  }

  function _validate() {
    var itemsToValidate = [
        { el: document.getElementById("url"),
          rules: "required|url",
          fieldName: i18n.t("url") },
        {
          el: document.getElementById("refresh"),
          rules: "required|numeric",
          fieldName: i18n.t("refresh.label")
        }
      ],
      passed = true, i;

    if (_el.$scrollOptionsCtn.is(":visible")) {
      itemsToValidate.push({
        el: document.getElementById("scroll-resumes"),
        rules: "required|numeric",
        fieldName: i18n.t("scroll-resumes")
      });
    }

    if (_el.$rowPaddingInp.val() !== "") {
      itemsToValidate.push({
        el: document.getElementById("row-padding"),
        rules: "numeric",
        fieldName: i18n.t("row-padding")
      });
    }

    if (_el.$columnPaddingInp.val() !== "") {
      itemsToValidate.push({
        el: document.getElementById("column-padding"),
        rules: "numeric",
        fieldName: i18n.t("column-padding")
      });
    }

    _el.$alertCtn.empty().hide();

    for (i = 0; i < itemsToValidate.length; i += 1) {
      if (!_validateItem(itemsToValidate[i])) {
        passed = false;
        break;
      }
    }

    return passed;
  }

  function _saveSettings() {
    var settings = null;

    // validate
    if (!_validate()) {
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

  function _bind() {
    // Add event handlers
    $("#save").on("click", function () {
      _saveSettings();
    });

    $("#cancel, #settings-close").on("click", function () {
      gadgets.rpc.call("", "rscmd_closeSettings", null);
    });

    $("#help").on("click", function () {
      window.open(HELP_URL, "_blank");
    });

    $("#google-drive").click(function () {
      if (_pickerApiLoaded && RiseVision.Authorization.getAuthToken()) {
        _createPicker();
        return;
      }

      if (!RiseVision.Authorization.getAuthToken()) {
        // Initiate the authorization this time with UI (immediate = false)
        RiseVision.Authorization.authorize(false, _authScope, function (oauthToken) {
          if (oauthToken) {
            // Load the Picker API
            gapi.load('picker', {'callback': _onPickerApiLoaded });
          }
        });
        return;
      }

      if (!_pickerApiLoaded) {
        // Load the Picker API
        gapi.load('picker', {'callback': _onPickerApiLoaded });
      }

    });

    $("input[name='cells']").change(function () {
      var val = $(this).val();

      if ($(this).is(":checked")) {
        if (val === "range") {
          _el.$rangeInp.prop('disabled', false);
          $("label[for='range']").removeClass('label-disabled');
        } else {
          _el.$rangeInp.val("");
          _el.$rangeInp.prop('disabled', true);
          $("label[for='range']").addClass('label-disabled');
        }
      }

      if (_el.$urlOptionsCtn.is(":visible")) { _configureURL(); }

    });

    _el.$sheetSel.change(function () {
      _configureURL();
    });

    _el.$headerRowsSel.change(function () {
      _configureURL();
    });

    _el.$rangeInp.blur(function () {
      _configureURL();
    });

    $("input[name='scroll-direction']").change(function () {
      if ($(this).is(":checked")) {
        if ($(this).val() === "none") {
          _el.$scrollOptionsCtn.hide();
        } else {
          _el.$scrollOptionsCtn.show();
        }
      }
    });
  }

  // public space
  return {
    init: function (authScope) {
      if (typeof authScope !== "string" || authScope === "") {
        throw new Error("GoogleSpreadsheet Widget Settings: " +
          " authorization scope value required");
      }
      _authScope = authScope;
      _origin = document.referrer.split("/").slice(0, 3).join("/") + "/";

      _cache();
      _bind();

      _el.$alertCtn.hide();
      _el.$urlOptionsCtn.hide();

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function (result) {
        var fontStyling = [{"prefix": "header"}, {"prefix": "data"}],
          colorStyling = [{"prefix": "row"}, {"prefix": "alt-row"},
              {"prefix": "background"}];

        // Apply the default color styling data  of non font color pickers
        $.each(colorStyling, function (index, item) {
          item.$elem = $("#" + item.prefix + "-color-picker");
          item.options = {};
          item.options.allowEmpty = true;
          item.options.color = '';
        });

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          /* Get metadata from the spreadsheet if fileID exists. It will only
           exist if the spreadsheet has been selected using Google Picker.
            */
          if (_prefs.getString("fileID") !== "") {
            _fileID = _prefs.getString("fileID");

            // Cells
            $("input[type='radio'][name='cells']").each(function () {
              if ($(this).val() === _prefs.getString("cells")) {
                $(this).attr("checked", "checked");
                return false;
              }
            });

            // Range
            if (_prefs.getString("range") && _prefs.getString("range") !== "") {
              _el.$rangeInp.val(_prefs.getString("range"));
            }

            // Worksheets
            _getSheets(_prefs.getString("fileID"), function (sheets) {
              if (sheets.length > 0) {
                _configureSheets(sheets);
                _el.$sheetSel.val(decodeURI(result.sheet));
                _el.$urlOptionsCtn.show();
              }
            });

            // Header Rows
            _el.$headerRowsSel.val(_prefs.getString("headerRows"));
          }

          _el.$urlInp.val(decodeURI(result.url));
          _el.$refreshInp.val(_prefs.getInt("refresh") / 1000);

          $("input[type='radio'][name='scroll-direction']").each(function () {
            if ($(this).val() === _prefs.getString("scroll-direction")) {
              $(this).attr("checked", "checked");
              return false;
            }
          });

          if (_prefs.getString("scroll-direction") !== "none") {
            _el.$scrollBySel.val(_prefs.getString("scroll-by"));
            _el.$scrollSpeedSel.val(_prefs.getString("scroll-speed"));
            _el.$scrollResumesInp.val(_prefs.getInt("scroll-resumes") / 1000);
          } else {
            // Set default scroll resume
            _el.$scrollResumesInp.val(DEFAULT_SCROLL_RESUME);
          }

          if (_prefs.getInt("row-padding")) {
            _el.$rowPaddingInp.val(_prefs.getInt("row-padding"));
          }

          if (_prefs.getInt("column-padding")) {
            _el.$columnPaddingInp.val(_prefs.getInt("column-padding"));
          }

          // Apply the font styling data
          $.each(fontStyling, function (index, item) {
            item.options = {};
            item.options.font = result[item.prefix + "-font"];
            item.options["font-style"] = result[item.prefix + "-font-style"];
            item.options["font-url"] = result[item.prefix + "-font-url"];
            item.options["font-size"] = _prefs.getString(item.prefix + "-font-size");
            item.options.bold = _prefs.getBool(item.prefix + "-bold");
            item.options.italic = _prefs.getBool(item.prefix + "-italic");
            item.options.color = result[item.prefix + "-color"];
          });

          // Apply the saved colors (non font color pickers)
          $.each(colorStyling, function (index, item) {
            item.options.color = result[item.prefix + "-color"];
          });

        } else {
          // Set default radio button selected to be Entire Sheet
          $("input[type='radio'][name='cells']").each(function () {
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
          $("input[type='radio'][name='scroll-direction']").each(function () {
            if ($(this).val() === "none") {
              $(this).attr("checked", "checked");
              return false;
            }
          });

          // Set default scroll resume
          _el.$scrollResumesInp.val(DEFAULT_SCROLL_RESUME);

          // Apply the default font styling data
          $.each(fontStyling, function (index, item) {
            item.options = $.extend({}, DEFAULT_FONT_STYLING);
          });
        }

        /* Manually trigger event handlers so that the visibility of fields
         can be set. */
        $("input[name='cells']").trigger("change");

        $("input[name='scroll-direction']").trigger("change");

        i18n.init({ fallbackLng: "en" }, function (t) {
          /* Configure font styling and color picking UI.
          It has to be after i18n has initialized because color picker
          button labels rely on translations
           */
          $.each(fontStyling, function (index, item) {
            _configureFontStyling({
              prefix: item.prefix,
              styling: item.options
            });
          });

          $.each(colorStyling, function (index, item) {
            _configureColorPicker({
              $elem: item.$elem,
              options: item.options
            });
          });

          _el.$wrapperCtn.i18n().show();
          $(".form-control").selectpicker();

          // Set tooltips only after i18n has shown
          $("label[for='refresh'] + button").popover({trigger: 'click'});

          //Set buttons to be sticky only after wrapper is visible.
          $(".sticky-buttons").sticky({
            container : _el.$wrapperCtn,
            //top margin + border of wrapper
            topSpacing : 55,
            getWidthFrom : _el.$wrapperCtn
          });
        });
      });
    }
  };

})(jQuery, window, gadgets, i18n, gapi);

var authScope = "https://www.googleapis.com/auth/drive";

RiseVision.Authorization.loadApi(function () {
  // Initiate the authorization without UI (immediate = true)
  RiseVision.Authorization.authorize(true, authScope, function () {
    RiseVision.GoogleSpreadsheet.Settings.init(authScope);
  });

});




