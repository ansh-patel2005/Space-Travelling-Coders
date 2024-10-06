import { changeToLongAndLat, degToRad } from "./math"
import { FOV, StarData, Exoplanet } from "./types"

export const fov: FOV = {
    latitude: degToRad(90-43),
    longitude: degToRad(-79),
    fovReg: Math.PI
}

export const exoplanet: Exoplanet = {
    position: [0, 0, 0],
    radius: 6371*3.24078e-14
}

// export const fov: FOV = {
//     latitude: Math.PI,
//     longitude: 0,
//     fovReg: Math.PI/1.1
// }

export const stars: StarData[] = []