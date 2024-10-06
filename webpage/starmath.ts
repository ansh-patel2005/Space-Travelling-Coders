
export function apparentSize(radiusStar: number, distanceFromPlanet: number): number{
    return 2*Math.atan(radiusStar/distanceFromPlanet)
}

/**
 * 
 * @param FOVSize // Note FOVSize must be > 0 (precondition).
 * @param apparentSize 
 * @param screenSize 
 * @returns 
 */
export function starSizeOnScreen(FOVSize: number, apparentSize: number, screenSize: number){
    return (apparentSize/FOVSize * screenSize)/2
}

const sunTemperature = 5772

/**
 * Return value is in terms of solar brightness so brightness of Sun from Earth = 1
 * @param stellarRadius // In solar radiuses
 * @param stellarTemperature // In degrees Kelvin
 * @param distanceFromPlanet // In Astronomical Units (AU)
 */
function celestialObjectBrightness(stellarRadius: number, stellarTemperature: number, distanceFromPlanet: number){
    return (stellarTemperature/sunTemperature * stellarRadius)/distanceFromPlanet**2
}