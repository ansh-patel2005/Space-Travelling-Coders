import { Exoplanet, FOV, stars } from "./internals"
import { changeToCartesian, changeToSpherical } from "./math"
import { CelestialScreenObject, Coordinate } from "./types"

// This only works when you start on Earth
function changePlanets(planet: Exoplanet) {
    for (const star of stars) {
        for (let i = 0; i < 3; i++) {
            star.position[i] -= planet.position[i]
        }
    }
}


const displayStars: CelestialScreenObject[] = []

class Plane {
    /**
     * Normalized normal vector of the plane.
     */
    normal: Coordinate

    constructor(normal: Coordinate) {
        this.normal = Plane.normalizeVector(normal)
    }

    /**
     * Project a point onto this plane.
     * @param point 
     */
    project(point: Coordinate): Coordinate {
        // We don't need to divide by magnitude as normal is normalized
        const coefficient = Plane.vectorDotProduct(point, this.normal)

        return [
            point[0] - coefficient * this.normal[0],
            point[1] - coefficient * this.normal[1],
            point[2] - coefficient * this.normal[2],
        ]
    }

    /**
     * Dot product of two vectors.
     */
    static vectorDotProduct(vec1: Coordinate, vec2: Coordinate) {
        return vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]
    }

    /**
     * @returns copy of the vector normalized.
     */
    static normalizeVector(vec: Coordinate) {
        const vecMag = Math.sqrt(vec[0]**2 + vec[1]**2 + vec[2]**2)
        return vec.map(item => item / vecMag) as Coordinate
    }
}

function a(fov: FOV, planetRadius: number, starX: number, starY: number) {
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
    
    xBasis = Plane.normalizeVector(xBasis)
    yBasis = Plane.normalizeVector(yBasis)

    // Clear the stars being displayed
    displayStars.splice(0, displayStars.length)

    // Project all the stars on the screen.
    for (const star of stars) {
        // Project the star onto the surface of the planet.
        const [_, longitude, latitude] = changeToSpherical(...star.position)
        let starCoord = changeToCartesian(planetRadius, longitude, latitude)

        // star's coordinate on the plane.
        let planeCoord = plane.project(starCoord)

        // Split the star x, y, z into "components"
        // project star coordinates onto the x basis and the y basis 

        displayStars.push({
            x: Plane.vectorDotProduct(planeCoord, xBasis),
            y: Plane.vectorDotProduct(planeCoord, yBasis),
            // radius: starRadiusOnScreen(fov.fovReg, star.size / )
            radius: 20
        })
    }
}