if (typeof AFRAME === 'undefined') {
  throw 'Component attempted to register before AFRAME was available.'
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
  init(){

    if (this.el.getAttribute('material').shader !== 'gif') {
      throw 'Use aframe-gif-shader for shader for aframe-gif-component'
    }

    /* set shader */
    this.shader = this.el.components.material.shader

  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   * @protected
   */
  update (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   * @protected
   */
  remove () { },

  /**
   * Called on each scene tick.
   * @protected
   */
  tick (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   * @protected
   */
  pause () {

    this.shader.pause && this.shader.pause()

  },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   * @protected
   */
  play () {

    this.shader.play && this.shader.play()

  },


  /*================================
  =            playback            =
  ================================*/

  /**
   * Toggle playback. play if paused and pause if played.
   * @public
   */
  
  togglePlayback () {

    this.shader.togglePlayback && this.shader.togglePlayback()

  },
  
  /**
   * Return if the playback is paused.
   * @public
   * @return {boolean}
   */  
  paused () {

    this.shader.paused && this.shader.paused()

  },


  /**
   * Go to next frame
   * @public
   */
  nextFrame () {

    this.shader.nextFrame && this.shader.nextFrame()

  },  


})
