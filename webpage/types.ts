export type Coordinate = [number, number, number]

export interface FOV {
    latitude: number
    longitude: number
    fovReg: number
}

export interface Exoplanet {
    position: Coordinate
}

export class StarData {
    position: Coordinate
    screenX: number
    screenY: number
    screenRadius: number

    constructor(position: Coordinate) {
        this.position = position
        this.screenX = 0
        this.screenY = 0
        this.screenRadius = 0
    }

    setScreenPosition(x: number, y: number, radius: number) {
        this.screenX = x
        this.screenY = y
        this.screenRadius = radius
    }
}