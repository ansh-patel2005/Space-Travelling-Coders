import { Coordinate } from "./types"

export interface FOV {
    latitude: number
    longitude: number
    fovReg: number
}

export interface Exoplanet {
    position: Coordinate
}

export const fov: FOV = {
    latitude: 0,
    longitude: 0,
    fovReg: 10
}

export interface StarData {
    position: Coordinate
}


export const stars: StarData[] = []