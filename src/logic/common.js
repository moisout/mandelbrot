export const Common = {
  generateColorPalette(startColorHex, endColorHex, iterations) {
    const startColor = this.hexToRgb(startColorHex)
    const endColor = this.hexToRgb(endColorHex)
    const colorPalette = []
    for (let i = 0; i <= iterations; i++) {
      const color = { r: 0, g: 0, b: 0 }
      color.r = startColor.r + ((i * (endColor.r - startColor.r)) / iterations)
      color.g = startColor.g + ((i * (endColor.g - startColor.g)) / iterations)
      color.b = startColor.b + ((i * (endColor.b - startColor.b)) / iterations)
      colorPalette.push(color)
    }
    return colorPalette
  },

  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
}
