export type Coordinate = [number, number, number]

export interface FOV {
    latitude: number
    longitude: number
    fovReg: number
}

export interface Exoplanet {
    position: Coordinate
    radius: number
}

export class StarData {
    position: Coordinate

    // Properties for drawing the star onto the display.
    screenX: number
    screenY: number
    screenRadius: number
    isVisible: boolean

    constructor(position: Coordinate) {
        this.position = position

        // These properties will be filled later when the setScreenPosition is called.
        this.screenX = 0
        this.screenY = 0
        this.screenRadius = 0
        this.isVisible = false
    }

    setScreenPosition(x: number, y: number, radius: number) {
        this.screenX = x
        this.screenY = y
        this.screenRadius = radius
    }
}