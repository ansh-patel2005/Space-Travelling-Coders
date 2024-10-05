import { Exoplanet, FOV, Coordinate } from "./types"
import { changeToCartesian, changeToSpherical, normalizeVector, vectorDistance, vectorDotProduct } from "./math"
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

class Plane {
    /**
     * Normalized normal vector of the plane.
     */
    normal: Coordinate

    constructor(normal: Coordinate) {
        this.normal = normalizeVector(normal)
    }

    /**
     * Project a point onto this plane.
     * @param point 
     */
    project(point: Coordinate): Coordinate {
        // We don't need to divide by magnitude as normal is normalized
        const coefficient = vectorDotProduct(point, this.normal)

        return [
            point[0] - coefficient * this.normal[0],
            point[1] - coefficient * this.normal[1],
            point[2] - coefficient * this.normal[2],
        ]
    }
}

export function FOVSize(fov: FOV, planetRadius: number) {
    // Latitude is never invariant like the longitude.
    const p1 = changeToCartesian(planetRadius, fov.longitude, fov.latitude + fov.fovReg/2)
    const p2 = changeToCartesian(planetRadius, fov.longitude, fov.latitude - fov.fovReg/2)

    return vectorDistance(p1, p2)
}

export function computeDisplayStars(fov: FOV, planetRadius: number) {
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
        ])
    } else {
        plane = new Plane([
            x/denom,
            y/denom,
            -1
        ])
    }

    // For turning the plane into the screen.
    let xBasis = changeToCartesian(planetRadius, fov.longitude + fov.fovReg / 2, fov.latitude)
    let yBasis = changeToCartesian(planetRadius, fov.longitude, fov.latitude + fov.fovReg / 2)
    
    xBasis = normalizeVector(xBasis)
    yBasis = normalizeVector(yBasis)

    // Project all the stars on the screen.
    for (const star of stars) {
        // Project the star onto the surface of the planet.
        const [_, longitude, latitude] = changeToSpherical(...star.position)
        let starCoord = changeToCartesian(planetRadius, longitude, latitude)

        // star's coordinate on the plane.
        let planeCoord = plane.project(starCoord)

        // Split the star x, y, z into "components"
        // project star coordinates onto the x basis and the y basis 

        star.setScreenPosition(
            vectorDotProduct(planeCoord, xBasis),
            vectorDotProduct(planeCoord, yBasis),
            20
        )
    }
}