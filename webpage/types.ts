export type Coordinate = [number, number, number]

export interface FOV {
    longitude: number
    latitude: number
    angle: number
}

export interface Exoplanet {
    position: Coordinate
    radius: number
    name: string
}

export class StarData {
    position: Coordinate
    radius: number

    // Properties for drawing the star onto the display.
    screenX: number
    screenY: number
    screenRadius: number
    isVisible: boolean

    constructor(position: Coordinate, radius: number) {
        this.position = position
        this.radius = radius

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