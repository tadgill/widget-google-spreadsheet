var RiseVision = RiseVision || {};
RiseVision.Spreadsheet = RiseVision.Spreadsheet || {};
RiseVision.Spreadsheet.Images = {};

RiseVision.Spreadsheet.Images = (function () {

  "use strict";

  var _images = [],
    _imageCount = 0,
    _loaded = false,
    _callback = null;

  function _onImageLoaded() {
    _imageCount += 1;

    if (_imageCount === _images.length && _callback && typeof _callback === "function") {
      _loaded = true;
      _callback();
    }
  }

  function _loadImage(image) {
    var img = new Image();

    img.onload = function () {
      image.$cell.append(this);
      _onImageLoaded();
    };

    img.onerror = function () {
      _onImageLoaded();
    };

    img.src = image.url;
  }

  function _loadImages() {
    var i;

    for (i = 0; i < _images.length; i += 1) {
      _loadImage(_images[i]);
    }
  }

  function load(images, callback) {
    if (!_loaded && images.length > 0) {
      _images = images;
      _loadImages();

      if (callback) {
        _callback = callback;
      }
    } else if (callback) {
      callback();
    }
  }

  return {
    load: load
  };

})();
