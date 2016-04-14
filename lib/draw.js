
if (typeof AFRAME === 'undefined') {
  throw 'Component attempted to register before AFRAME was available.'
}


AFRAME.registerShader('draw', {

  schema: {
    width: { default: 256 },
    height: { default: 256 },
  },

  /**
   * `init` used to initialize material. Called once.
   */
  init (data) {
    console.log(this.el)
    this.__canvas = document.createElement('canvas')
    this.__ctx = this.__canvas.getContext('2d')
    this.__texture = new THREE.Texture(this.__canvas) //renders straight from a canvas
    this.update(data)
    this.material = new THREE.MeshBasicMaterial({ map: this.__texture })
    console.log(this.material)

  },

  /**
   * `update` used to update the material. Called on initialization and when data updates.
   */
  update (data) {

    this.__canvas.width = data.width
    this.__canvas.height = data.height

  }
})
