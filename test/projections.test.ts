import { describe, it } from "node:test"
import { assertCoordinateEquality } from "./helper"
import { FOV, StarData } from "../webpage/types"
import { changeToCartesian, changeToLongAndLat, earthRadius } from "../webpage/math"
import { computeStarProjections, Plane } from "../webpage/projections"

describe("Plane", () => {
    describe("project", () => {
        it("xy axis plane", () => {
            const plane = new Plane([0, 0, 5], [0, 0, 0])
            
            assertCoordinateEquality(
                plane.project([3, 4, 7]),
                [3, 4, 0]
            )
        })
    })
})

describe("computeStarProjections", () => {
    it("general case at the north pole", () => {
        // This one's easy to verify using the change to cartesian fn and then dropping the z value.

        const fov: FOV = {
            latitude: 0,
            longitude: 0,
            angle: Math.PI/2
        }
        const planetRadius = earthRadius
        const stars = [
            new StarData(changeToCartesian(
                6153.89*9.461e12,
                ...changeToLongAndLat(
                    "13h20m48.34s",
                    "-55d55m02.4s"
                )
            ), 5e-8)
        ]

        computeStarProjections(fov, planetRadius, stars)

        const expectedPosition = [...changeToCartesian(
            earthRadius,
            ...changeToLongAndLat(
                "13h20m48.34s",
                "-55d55m02.4s"
            )
        )]
        expectedPosition[2] = 0 // drop z-component

        // Check it's the same as dropping the z-component of the star.
        assertCoordinateEquality(
            [stars[0].screenX, stars[0].screenY, 0],
            expectedPosition
        )
        
    })
})