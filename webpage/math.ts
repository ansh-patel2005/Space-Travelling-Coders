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

function degToRad(deg: number) {
    return deg/180 * Math.PI
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

function apparentSize(radiusStar: number, distanceFromPlanet: number): number{
    return 2*Math.atan(radiusStar/distanceFromPlanet)
}

/**
 * 
 * @param FOVSize // Note FOVSize must be > 0 (precondition).
 * @param apparentSize 
 * @param screenSize 
 * @returns 
 */
function starSizeOnScreen(FOVSize: number, apparentSize: number, screenSize: number){
    return (apparentSize/FOVSize * screenSize)/2
}

/**
 * Return value is in terms of solar brightness so brightness of Sun from Earth = 1
 * @param stellarRadius // In solar radiuses
 * @param stellarTemperature // In degrees Kelvin
 * @param distancefromPlanet // In Astronomical Units (AU)
 */
function celestialObjectBrightness(stellarRadius: number, stellarTemperature: number, distancefromPlanet: number){
    return (stellarTemperature/5772 * stellarRadius)/distancefromPlanet**2
}