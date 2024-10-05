import { Coordinate } from "./types"

export interface FOV {
    latitude: number
    longitude: number
    fovDeg: number
}

export interface Exoplanet {
    position: Coordinate
}