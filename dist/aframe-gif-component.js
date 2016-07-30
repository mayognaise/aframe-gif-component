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
/***/ function(module, exports) {

	'use strict';

	if (typeof AFRAME === 'undefined') {
	  throw 'Component attempted to register before AFRAME was available.';
	}

	/**
	 * A-Frame GIF Component component for A-Frame.
	 * @desc original code is by @gtk2k
	 * @see https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
	 */
	AFRAME.registerComponent('gif', {

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   * @protected
	   */

	  init: function init() {

	    if (this.el.getAttribute('material').shader !== 'gif') {
	      throw 'Use aframe-gif-shader for shader for aframe-gif-component';
	    }

	    /* set shader */
	    this.shader = this.el.components.material.shader;
	  },


	  /**
	   * Called when component is attached and when component data changes.
	   * Generally modifies the entity based on the data.
	   * @protected
	   */
	  update: function update(oldData) {},


	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   * @protected
	   */
	  remove: function remove() {},


	  /**
	   * Called on each scene tick.
	   * @protected
	   */
	  tick: function tick(t) {},


	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   * @protected
	   */
	  pause: function pause() {

	    this.shader.pause && this.shader.pause();
	  },


	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   * @protected
	   */
	  play: function play() {

	    this.shader.play && this.shader.play();
	  },


	  /*================================
	  =            playback            =
	  ================================*/

	  /**
	   * Toggle playback. play if paused and pause if played.
	   * @public
	   */

	  togglePlayback: function togglePlayback() {

	    this.shader.togglePlayback && this.shader.togglePlayback();
	  },


	  /**
	   * Return if the playback is paused.
	   * @public
	   * @return {boolean}
	   */
	  paused: function paused() {

	    this.shader.paused && this.shader.paused();
	  },


	  /**
	   * Go to next frame
	   * @public
	   */
	  nextFrame: function nextFrame() {

	    this.shader.nextFrame && this.shader.nextFrame();
	  }
	});

/***/ }
/******/ ]);