import { Exoplanet, FOV, Coordinate, StarData} from "./types"
import { changeToCartesian, changeToSpherical, normalizeVector, parsecToKm, vectorCrossProduct, vectorDistance, vectorDotProduct } from "./math"
import { starSizeOnScreen, apparentSize } from "./starmath"
import { stars } from "./internals"

// This only works when you start on Earth
// TODO: use current position of planet (currPosition) and do star.position[i] -= (planet.position[i] - currPosition[i])
function changePlanets(planet: Exoplanet) {
    for (const star of stars) {
        for (let i = 0; i < 3; i++) {
            star.position[i] -= planet.position[i]
        }
    }
}

export class Plane {
    /**
     * Normalized normal vector of the plane.
     */
    normal: Coordinate
    /**
     * Point on the plane
     */
    point: Coordinate

    constructor(normal: Coordinate, point: Coordinate) {
        this.normal = normalizeVector(normal)
        this.point = point
    }

    /**
     * Project a vector onto a plane.
     * @param vec 
     * @returns vector on the plane.
     */
    project(vec: Coordinate): Coordinate {
        // We don't need to divide by magnitude as normal is normalized
        const coefficient = vectorDotProduct(vec, this.normal)

        return [
            vec[0] - coefficient * this.normal[0],
            vec[1] - coefficient * this.normal[1],
            vec[2] - coefficient * this.normal[2],
        ]
    }
}

export function FOVSize(fov: FOV, planetRadius: number) {
    // Latitude is never invariant like the longitude.
    const p1 = changeToCartesian(planetRadius, fov.longitude, fov.latitude + fov.angle/2)
    const p2 = changeToCartesian(planetRadius, fov.longitude, fov.latitude - fov.angle/2)

    return vectorDistance(p1, p2)
}

/**
 * Calculates the plane tangent to the surface of the planet at the current FOV.
 */
export function computeTangentFOVPlane(fov: FOV, planetRadius: number) {
    // Compute plane tangent to the sphere of the exoplanet at the center of the fov.
    const [x, y, z] = changeToCartesian(planetRadius, fov.longitude, fov.latitude)

    // rearranged formula of tangent plane on a sphere
    const denom = Math.sqrt(planetRadius**2 - x**2 - y**2)
    let plane

    // todo: check this and add some comments about the formula.
    if (z > 0) {
        plane = new Plane([
            -x/denom,
            -y/denom,
            -1
        ], [x, y, z])
    } else {
        plane = new Plane([
            x/denom,
            y/denom,
            -1
        ], [x, y, z])
    }

    return plane
}

/**
 * Finds the basis vectors of the tangent plane.
 * These will be the x and y axis for our screen. 
 * @param fov 
 * @param planetRadius 
 * @param tangentPlane 
 * @returns [xBasis, yBasis]
 * 
 * @note yBasis is the movement along the latitude parallel to the plane.
 */
export function findScreenBases(fov: FOV, planetRadius: number, tangentPlane: Plane): [Coordinate, Coordinate] {
    // For turning the plane into the screen.
    // Calculate the yBasis.
    const fovCenter = changeToCartesian(planetRadius, fov.longitude, fov.latitude)
    const yPosition = changeToCartesian(planetRadius, fov.longitude, fov.latitude + fov.angle / 2)

    // "basis for y" as projected onto the plane.
    let yBasis = tangentPlane.project([
        yPosition[0] - fovCenter[0],
        yPosition[1] - fovCenter[1],
        yPosition[2] - fovCenter[2]
    ])
    yBasis = normalizeVector(yBasis)

    let xBasis = normalizeVector(vectorCrossProduct(tangentPlane.normal, yBasis))

    return [xBasis, yBasis]
}

/**
 * Recalculates all the screen data for all the stars.
 * @param fov 
 * @param planetRadius 
 * @param stars 
 */
export function computeStarProjections(fov: FOV, planetRadius: number, stars: StarData[]) {
    const plane = computeTangentFOVPlane(fov, planetRadius)
    const [xBasis, yBasis] = findScreenBases(fov, planetRadius, plane)

    for (const star of stars) {
        // Project the star onto the surface of the planet.
        const [_, longitude, latitude] = changeToSpherical(...star.position)
        let starCoord = changeToCartesian(planetRadius, longitude, latitude)

        // star's coordinate on the plane.
        let planeCoord = plane.project(starCoord)

        // Figure out if the star is visible.
        // This means the star isn't behind our FOV, ie the perpendicular distance to the plane is less than the planet's radius.
        // Perpendicular component - point of the plane center is how close we are to the plane's center.
        // Note: starCoord - planeCoord of star = the perpendicular component of the star coord relative to the plane
        const distance = Math.hypot(
            (starCoord[0] - planeCoord[0]) - plane.point[0],
            (starCoord[1] - planeCoord[1]) - plane.point[1],
            (starCoord[2] - planeCoord[2]) - plane.point[2]
        )

        const isVisible = distance <= planetRadius

        star.isVisible = isVisible
        
        if (!isVisible) {
            continue
        }


        // Split the star x, y, z into "components"
        // project star coordinates onto the x basis and the y basis 

        // console.log("apparent size", apparentSize(star.radius, Math.hypot(...star.position)))
        star.setScreenPosition(
            vectorDotProduct(planeCoord, xBasis),
            vectorDotProduct(planeCoord, yBasis),
            starSizeOnScreen(fov.angle, apparentSize(star.radius, Math.hypot(...star.position)), 1280)
        )
    }
}