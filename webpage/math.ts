import { Coordinate } from "./types"

export const parsecToKm = 3.086e13
export const earthRadius = 6371 / parsecToKm

export function degToRad(deg: number) {
    return deg/180 * Math.PI
}

/**
 * 
 * @param rightAsc 
 * @param declination 
 * @returns [longitude, latitude] based off the below spherical coordinates. The +x axis is the prime meridian and the +z axis is towards the north pole.
 * 
 * @note based off https://math.libretexts.org/Bookshelves/Calculus/Calculus_(OpenStax)/12%3A_Vectors_in_Space/12.07%3A_Cylindrical_and_Spherical_Coordinates 
 */
export function changeToLongAndLat(rightAsc: string, declination: string): [number, number] {
    let tokens = rightAsc.match(/[\d.+-]+/g)
    let secondTokens = declination.match(/[\d.+-]+/g)

    if (!tokens || tokens.length != 3) {
        throw new Error(`Invalid right ascension.`)
    }
    if (!secondTokens || secondTokens.length != 3) {
        throw new Error(`Invalid declination.`)
    }

    // change to longitude
    let hours = Number(tokens[0])
    let minutes = Number(tokens[1])
    hours += minutes/60
    let seconds = Number(tokens[2])
    hours += seconds/3600
    let longitude = hours*15

    // change to latitude
    let degrees = Number(secondTokens[0])
    let decMinutes = Number(secondTokens[1])
    degrees += decMinutes/60
    let decSeconds = Number(secondTokens[2])
    degrees += decSeconds/3600
    let latitude = degrees

    return [degToRad(longitude), Math.PI/2 - degToRad(latitude)]
}

/**
 * 
 * @param distanceFromEarth dist to the origin
 * @param longitude in rad
 * @param latitude in rad
 * @returns 
 */
export function changeToCartesian(distanceFromEarth: number, longitude: number, latitude: number): [number, number, number] {
    let x = distanceFromEarth*Math.sin(latitude)*Math.cos(longitude)
    let y = distanceFromEarth*Math.sin(latitude)*Math.sin(longitude)
    let z = distanceFromEarth*Math.cos(latitude)
    return [x, y, z]
}

/**
 * Converts cartesian coordinates to spherical coordinates. IN RADIANS.
 * @returns [distance, longitude, latitude]
 * @note latitude is measured from the north pole.
 * @note longitude is pi/2 when you're at the north/south pole.
 */
export function changeToSpherical(x: number, y: number, z: number): [number, number, number] {
    if (x == 0 && y == 0 && z == 0){
        return [0, 0, 0]
    }

    let distance = Math.sqrt(x**2 + y**2 + z**2)
    let latitude = Math.acos(z/Math.sqrt(x**2 + y**2 + z**2))

    let longitude

    // When x is 0, then we're on the zy plane
    if (x == 0) {
        longitude = y < 0 ? -Math.PI/2 : Math.PI/2
    } else {
        longitude = Math.atan(y/x)
    }

    return [distance, longitude, latitude]
}

/**
 * Dot product of two vectors.
 */
export function vectorDotProduct(vec1: Coordinate, vec2: Coordinate) {
    return vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]
}

/**
 * @param vec vector to normalize, must be nonzero.
 * @returns copy of the vector normalized.
 */
export function normalizeVector(vec: Coordinate) {
    const vecMag = Math.sqrt(vec[0]**2 + vec[1]**2 + vec[2]**2)
    return vec.map(item => item / vecMag) as Coordinate
}

export function vectorDistance(vec1: Coordinate, vec2: Coordinate) {
    return Math.hypot(vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2])
}

export function vectorCrossProduct(vec1: Coordinate, vec2: Coordinate): Coordinate {
    return ([vec1[1]*vec2[2] - vec1[2]*vec2[1], vec1[2]*vec2[0] - vec1[0]*vec2[2], vec1[0]*vec2[1] - vec1[1]*vec2[0]])
}