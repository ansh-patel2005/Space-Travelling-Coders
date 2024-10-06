import { ServerPlanetData } from "../shared/star"
import { FOV, StarData, Exoplanet } from "./types"

export const fov: FOV = {
    longitude: 0,
    // for some reason at pi/2 nothing shows up. 
    latitude: Math.PI/2 + 0.01,
    angle: Math.PI
}

export const exoplanet: Exoplanet = {
    name: "Earth",
    position: [0, 0, 0],
    radius: 6371*3.24078e-14
}

export const stars: Map<string, StarData> = new Map()
export const exoPlanets: ServerPlanetData[] = []