/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _gifsparser = __webpack_require__(1);

	if (typeof AFRAME === 'undefined') {
	  throw 'Component attempted to register before AFRAME was available.';
	}

	/**
	 * A-Frame GIF Component component for A-Frame.
	 * @desc original code is by @gtk2k
	 * @see https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
	 */
	AFRAME.registerComponent('gif', {

	  dependencies: ['draw'],

	  schema: {
	    src: { default: null },
	    autoplay: { default: true }
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   * @protected
	   */
	  init: function init() {

	    /* get access to the draw component */
	    var draw = this.el.components.draw;

	    if (!draw) {
	      console.error('draw component is required as dependencies.\n', this.el);
	      return;
	    }
	    this.__cnv = draw.canvas;
	    this.__ctx = draw.ctx;
	    this.__texture = draw.texture;
	    this.__width = draw.data.width;
	    this.__height = draw.data.width;
	    this.__reset();
	  },


	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   * @protected
	   */
	  update: function update(oldData) {
	    if (!oldData) {
	      this.__load();
	    } else {
	      if (oldData.src !== this.data.src) {
	        this.__reset();
	        this.__load();
	      }
	    }
	  },


	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   * @protected
	   */
	  remove: function remove() {
	    this.__clearCanvas();
	    this.__reset();
	  },


	  /**
	   * Called on each scene tick.
	   * @protected
	   */
	  tick: function tick(t) {
	    if (!this.__frames || this.__paused) return;
	    if (Date.now() - this.__startTime >= this.__nextFrameTime) {
	      this.nextFrame();
	    }
	  },


	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   * @protected
	   */
	  pause: function pause() {
	    this.__paused = true;
	  },


	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   * @protected
	   */
	  play: function play() {
	    this.__paused = false;
	  },


	  /*================================
	  =            playback            =
	  ================================*/

	  /**
	   * Toggle playback. play if paused and pause if played.
	   * @public
	   */

	  togglePlayback: function togglePlayback() {

	    if (this.paused()) {
	      this.play();
	    } else {
	      this.pause();
	    }
	  },


	  /**
	   * Return if the playback is paused.
	   * @public
	   * @return {boolean}
	   */
	  paused: function paused() {
	    return this.__paused;
	  },


	  /**
	   * Go to next frame
	   * @public
	   */
	  nextFrame: function nextFrame() {

	    this.__draw();

	    /* update next frame time */
	    while (Date.now() - this.__startTime >= this.__nextFrameTime) {

	      this.__nextFrameTime += this.__delayTimes[this.__frameIdx++];
	      if ((this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx) {
	        /* go back to the first */
	        this.__frameIdx = 0;
	      }
	    }
	  },


	  /*==============================
	   =            canvas            =
	   ==============================*/

	  /**
	   * clear canvas
	   * @private
	   */
	  __clearCanvas: function __clearCanvas() {
	    this.__ctx.clearRect(0, 0, this.__width, this.__height);
	    this.__texture.needsUpdate = true;
	  },


	  /**
	   * draw
	   * @private
	   */
	  __draw: function __draw() {

	    this.__ctx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height);
	    this.__texture.needsUpdate = true;
	  },


	  /*============================
	  =            load            =
	  ============================*/

	  /**
	   * load GIF using gifparser
	   * @private
	   */
	  __load: function __load() {

	    if (!this.data.src) {
	      this.__clearCanvas();
	      return;
	    }
	    (0, _gifsparser.loadGIF)(this.data.src, this.__onLoadSuccess.bind(this), this.__onLoadError.bind(this));
	  },


	  /**
	   * Called when loadGIF is succeeded
	   * @private
	   * @param {array} times - array of time length of each image
	   * @param {number} cnt - total counts of gif images
	   * @param {array} frames - array of each image
	   */
	  __onLoadSuccess: function __onLoadSuccess(times, cnt, frames) {

	    this.__delayTimes = times;
	    cnt ? this.__loopCnt = cnt : this.__infinity = true;
	    this.__frames = frames;
	    this.__frameCnt = times.length;
	    this.__startTime = Date.now();
	    this.__width = THREE.Math.nearestPowerOfTwo(frames[0].width);
	    this.__height = THREE.Math.nearestPowerOfTwo(frames[0].height);
	    this.__cnv.width = this.__width;
	    this.__cnv.height = this.__height;
	    this.el.sceneEl.addBehavior(this);
	    this.__draw();
	    if (this.data.autoplay) {
	      this.play();
	    } else {
	      this.pause();
	    }
	  },


	  /**
	   * Called when loadGIF is failed
	   * @private
	   * @param {string} err - error message
	   */
	  __onLoadError: function __onLoadError(err) {
	    console.log(err);
	  },


	  /*=============================
	  =            reset            =
	  =============================*/

	  /**
	   * @private
	   */

	  __reset: function __reset() {
	    this.pause();
	    this.__startTime = 0;
	    this.__nextFrameTime = 0;
	    this.__frameIdx = 0;
	    this.__frameCnt = 0;
	    this.__delayTimes = null;
	    this.__infinity = false;
	    this.__loopCnt = 0;
	    this.__frames = null;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * 
	 * Gif parser by @gtk2k
	 * https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
	 *
	 */

	function loadGIF(url, successCB, errorCB) {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url);
	  xhr.responseType = 'arraybuffer';
	  xhr.onload = function (e) {

	    parseGIF(new Uint8Array(e.target.response), successCB, errorCB);
	  };
	  xhr.onerror = function () {
	    errorCB && errorCB('loadGIF: load error');
	  };
	  xhr.send();
	}

	function parseGIF(gif, successCB, errorCB) {

	  var pos = 0;
	  var delayTimes = [];
	  var loadCnt = 0;
	  var graphicControl = null;
	  var imageData = null;
	  var frames = [];
	  var loopCnt = 0;
	  if (gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
	  gif[3] === 0x38 && gif[4] === 0x39 && gif[5] === 0x61) {
	    // '89a'
	    pos += 13 + +!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3;
	    var gifHeader = gif.subarray(0, pos);
	    while (gif[pos] && gif[pos] !== 0x3b) {
	      var offset = pos,
	          blockId = gif[pos];
	      if (blockId === 0x21) {
	        var label = gif[++pos];
	        if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
	          label === 0xf9 && delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10);
	          label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
	          while (gif[++pos]) {
	            pos += gif[pos];
	          }label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
	        } else {
	          errorCB && errorCB('parseGIF: unknown label');break;
	        }
	      } else if (blockId === 0x2c) {
	        pos += 9;
	        pos += 1 + +!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3);
	        while (gif[++pos]) {
	          pos += gif[pos];
	        }var imageData = gif.subarray(offset, pos + 1);
	        frames.push(URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData])));
	      } else {
	        errorCB && errorCB('parseGIF: unknown blockId');break;
	      }
	      pos++;
	    }
	  } else {
	    errorCB && errorCB('parseGIF: no GIF89a');
	  }
	  if (frames.length) {

	    var cnv = document.createElement('canvas');
	    var loadImg = function loadImg() {
	      frames.forEach(function (src, i) {
	        var img = new Image();
	        img.onload = function (e, i) {
	          if (i === 0) {
	            cnv.width = img.width;
	            cnv.height = img.height;
	          }
	          loadCnt++;
	          frames[i] = this;
	          if (loadCnt === frames.length) {
	            loadCnt = 0;
	            imageFix(1);
	          }
	        }.bind(img, null, i);
	        img.src = src;
	      });
	    };
	    var imageFix = function imageFix(i) {
	      var img = new Image();
	      img.onload = function (e, i) {
	        loadCnt++;
	        frames[i] = this;
	        if (loadCnt === frames.length) {
	          cnv = null;
	          successCB && successCB(delayTimes, loopCnt, frames);
	        } else {
	          imageFix(++i);
	        }
	      }.bind(img);
	      img.src = cnv.toDataURL('image/gif');
	    };
	    loadImg();
	  }
	}

	exports.loadGIF = loadGIF;

/***/ }
/******/ ]);