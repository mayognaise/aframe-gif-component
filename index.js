import { loadGIF } from './lib/gifsparser'

if (typeof AFRAME === 'undefined') {
  throw 'Component attempted to register before AFRAME was available.'
}

/**
 * A-Frame GIF Component component for A-Frame.
 * @desc original code is by @gtk2k
 * @see https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif
 */
AFRAME.registerComponent('gif', {
  
  dependencies: [ 'material' ],

  schema: {
    src: { default: null },
    autoplay: { default: true },
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   * @protected
   */
  init(){

    console.log(this.el.getAttribute('material'))
    return

    /* get access to the draw component */
    const { draw } = this.el.components
    if (!draw) {
      console.error('draw component is required as dependencies.\n', this.el)
      return
    }
    this.__cnv = draw.canvas
    this.__ctx = draw.ctx
    this.__texture = draw.texture
    this.__width = draw.data.width
    this.__height = draw.data.width
    this.__reset()
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   * @protected
   */
  update (oldData) {
    return
    if (!oldData) {
      this.__load()
    }
    else {
      if (oldData.src !== this.data.src) {
        this.__reset()
        this.__load()
      }
    }
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   * @protected
   */
  remove () {
    this.__clearCanvas()
    this.__reset()
  },

  /**
   * Called on each scene tick.
   * @protected
   */
  tick (t) {
    if (!this.__frames || this.__paused) return
    if (Date.now() - this.__startTime >= this.__nextFrameTime) {
      this.nextFrame()
    }
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   * @protected
   */
  pause () {
    this.__paused = true
  },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   * @protected
   */
  play () {
    this.__paused = false
  },

  /*================================
  =            playback            =
  ================================*/

  /**
   * Toggle playback. play if paused and pause if played.
   * @public
   */
  
  togglePlayback () {

    if (this.paused()) { this.play() }
    else { this.pause() }

  },
  
  /**
   * Return if the playback is paused.
   * @public
   * @return {boolean}
   */  
  paused () {
    return this.__paused
  },


  /**
   * Go to next frame
   * @public
   */
  nextFrame () {

    this.__draw()

    /* update next frame time */
    while ((Date.now() - this.__startTime) >= this.__nextFrameTime) {

      this.__nextFrameTime += this.__delayTimes[this.__frameIdx++]
      if ((this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx) {
        /* go back to the first */
        this.__frameIdx = 0
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
  __clearCanvas () {
    this.__ctx.clearRect(0, 0, this.__width, this.__height)
    this.__texture.needsUpdate = true
  },

  /**
   * draw
   * @private
   */
  __draw () {

    this.__ctx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height)
    this.__texture.needsUpdate = true
  },

  /*============================
  =            load            =
  ============================*/
  
  /**
   * load GIF using gifparser
   * @private
   */  
  __load () {

    if (!this.data.src) {
      this.__clearCanvas()
      return
    }
    loadGIF(this.data.src, this.__onLoadSuccess.bind(this), this.__onLoadError.bind(this))   
  },
  
  /**
   * Called when loadGIF is succeeded
   * @private
   * @param {array} times - array of time length of each image
   * @param {number} cnt - total counts of gif images
   * @param {array} frames - array of each image
   */
  __onLoadSuccess (times, cnt, frames) {

    this.__delayTimes = times
    cnt ? this.__loopCnt = cnt : this.__infinity = true
    this.__frames = frames
    this.__frameCnt = times.length
    this.__startTime = Date.now()
    this.__width = THREE.Math.nearestPowerOfTwo(frames[0].width)
    this.__height = THREE.Math.nearestPowerOfTwo(frames[0].height)
    this.__cnv.width = this.__width
    this.__cnv.height = this.__height
    this.el.sceneEl.addBehavior(this)
    this.__draw()
    if (this.data.autoplay) {
      this.play()
    }
    else {
      this.pause()
    }
  },

  /**
   * Called when loadGIF is failed
   * @private
   * @param {string} err - error message
   */  
  __onLoadError (err) {
    console.log(err)
  },
  
  

  /*=============================
  =            reset            =
  =============================*/
  
  /**
   * @private
   */
  
  __reset () {
    this.pause()
    this.__startTime = 0
    this.__nextFrameTime = 0
    this.__frameIdx = 0
    this.__frameCnt = 0
    this.__delayTimes = null
    this.__infinity = false
    this.__loopCnt = 0
    this.__frames = null
  },
  
  


})
