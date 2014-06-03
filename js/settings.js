var RiseVision = RiseVision || {};
RiseVision.GoogleSpreadsheet = {};

RiseVision.GoogleSpreadsheet.Settings = (function($,gadgets, i18n, google) {
  "use strict";

  // private variables
  var _prefs = null, _headerRows = 0, _range="", _el, _docID = null;

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
      window.open("http://www.risevision.com/help/users/what-are-gadgets/" +
        "free-gadgets/rise-vision-google-spreadsheet/", "_blank");
    });

    $("#google-drive").click(function() {
      RiseVision.Common.GooglePicker.openPicker($(this).data("for"),
        google.picker.ViewId.SPREADSHEETS);
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

  function _getAdditionalParams(){
    var additionalParams = {};

    additionalParams["url"] = encodeURI($.trim(_el.urlInp.val()));

    return additionalParams;
  }

  function _getSheets(docID, callbackFn){
    var option, href, sheets = [];

    $.getJSON(encodeURI("https://spreadsheets.google.com/feeds/worksheets/" +
      docID + "/public/basic?alt=json&dummy=" +
      Math.ceil(Math.random() * 100)))
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

        if(typeof callbackFn === 'function'){callbackFn(sheets);}

      })
      .fail(function(jqxhr) {
        _el.alertCtn.empty().append(i18n.t("google-picker-fail")).show();
        _el.urlOptionsCtn.hide();
        _el.wrapperCtn.scrollTop(0);

        //console.log(jqxhr.status + " - " + jqxhr.statusText);
        //console.log(jqxhr.responseText);

        callbackFn(null);

      });
  }

  function _getParams(){
    var params = "";

    /* Only save spreadsheet metadata settings if file has been selected
    using Google Picker(i.e. if docID has a value).
     */
    if (_docID !== null) {
      params += "&up_docID=" + _docID;

      // If Range is chosen
      if($("#cells-range").is(":checked")){
        params += "&up_cells=" + $("#cells-range").val() +
          "&up_range=" + $.trim(_el.rangeInp.val());
      } else {
        params += "&up_cells=" + $("#cells-sheet").val();
      }

      params += "&up_sheet=" + encodeURI(_el.sheetSel.val()) +
        "&up_headerRows=" + _el.headerRowsSel.val();
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

  function _onGooglePickerSelect(id, doc){
    _el.urlInp.val("");

    _getSheets(doc.id, function(sheets) {
        if (sheets !== null) {
          _docID = doc.id;
          _configureSheets(sheets);
          _configureURL();
          _el.alertCtn.empty().hide();
          _el.urlOptionsCtn.show();
        }
    });
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
    init: function () {
      _cache();
      _bind();

      _el.alertCtn.hide();
      _el.urlOptionsCtn.hide();

      // register a callback function for the Google Picker
      gadgets.rpc.register("rscmd_googlePickerCallback", _onGooglePickerSelect);

      //Request additional parameters from the Viewer.
      gadgets.rpc.call("", "rscmd_getAdditionalParams", function(result) {

        _prefs = new gadgets.Prefs();

        if (result) {
          result = JSON.parse(result);

          /* Get metadata from the spreadsheet if docID exists. It will only
           exist if the spreadsheet has been selected using Google Picker.
            */
          if (_prefs.getString("docID") !== "") {
            _docID = _prefs.getString("docID");

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

            _getSheets(_prefs.getString("docID"), function(sheets) {
              if (sheets !== null) {
                _configureSheets(sheets);
                _el.sheetSel.val(encodeURI(_prefs.getString("sheet")));
                _el.urlOptionsCtn.show();
              }
            });

            // Header Rows
            _el.headerRowsSel.val(_prefs.getString("headerRows"));
            _headerRows = _prefs.getInt("headerRows");
          }

          //Additional params
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

})($, gadgets, i18n, google);

google.setOnLoadCallback(function() {
  $(function() {
    RiseVision.GoogleSpreadsheet.Settings.init();
  });
});

google.load('picker', '1');

