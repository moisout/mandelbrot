export const Mandelbrot = {
  calculatePointColor(c1, c2, iterations, colorPalette) {
    let zX = 0
    let zY = 0

    const duplicationArray = []

    let hasDuplication = false
    let duplicationStopIndex = 0

    for (
      let index = 0;
      index < iterations && Math.abs(zX) <= 2 && Math.abs(zY) <= 2;
      index++
    ) {
      const oldZX = zX
      zX = zX * zX - zY * zY + c1
      zY = 2 * oldZX * zY + c2

      duplicationStopIndex = index
      if (
        duplicationArray.length > 0 &&
        duplicationArray.find(e => e.zX === zX && e.zY === zY)
      ) {
        hasDuplication = true
        break
      }
      duplicationArray.push({ zX: zX, zY: zY })
    }

    if (hasDuplication || (Math.abs(zX) <= 2 && Math.abs(zY) <= 2)) {
      return 'rgba(0,0,0,1)'
    }
    const clrP = colorPalette
    const dupI = duplicationStopIndex
    return `rgba(${clrP[dupI].r},${clrP[dupI].g},${clrP[dupI].b},1)`
  },

  getPointsFromCoordinates({ coordX, coordY }, { canvasWidth, canvasHeight }, { maxX, minX, maxY, minY }) {
    const xCoordsWidth = maxX - minX

    const yCoordsHeight = maxY - minY

    const pointX =
      (canvasWidth / xCoordsWidth) * Math.abs(minX - coordX)

    const pointY =
      (canvasHeight / yCoordsHeight) * Math.abs(maxY - coordY)

    return { pointX, pointY }
  },

  getCoordinatesFromPoints({ pointX, pointY }, { canvasWidth, canvasHeight }, { maxX, minX, maxY, minY }) {
    const xCoordsWidth = maxX - minX

    const yCoordsHeight = maxY - minY

    const coordX = (xCoordsWidth / canvasWidth) * pointX + minX

    const coordY = maxY - ((yCoordsHeight / canvasHeight) * pointY)

    // debugger
    return { coordX, coordY }
  }
}
