import assert from "assert"
import { describe, it } from "node:test"
import { changeToCartesian, changeToLongAndLat, changeToSpherical, normalizeVector, vectorDistance, vectorDotProduct, vectorCrossProduct } from "../webpage/math"
import { assetIsCloseEnough as assertIsCloseEnough } from "./helper"

function assertCoordinateEquality(actual: number[], expected: number[]) {
    const errMessage = `Got: [${actual.join(", ")}]. Expected: [${expected.join(", ")}]`

    assert.equal(actual.length, expected.length, errMessage)

    for (let i = 0; i < actual.length; i++) {
        assertIsCloseEnough(actual[i], expected[i], undefined, errMessage)
    }
}

describe("changeToLongAndLat", () => {
    it("zero edge case", () => {
        assertCoordinateEquality(
            changeToLongAndLat("00h00m00s", "+00d00m00.00s"),
            [0, Math.PI/2]
        )
    })

    it("generic case", () => {
        assertCoordinateEquality(
            changeToLongAndLat("12h20m42.91s", "+17d47m35.71s"),
            [3.23197962, 1.260245481]
        )
    })
})

describe("changeToCartesian", () => {
    it("x=1 on x-axis", () => {
        assertCoordinateEquality(
            changeToCartesian(1, 0, Math.PI/2),
            [1, 0, 0]
        )
    })

    it("y=1 on y-axis", () => {
        assertCoordinateEquality(
            changeToCartesian(1, Math.PI/2, Math.PI/2),
            [0, 1, 0]
        )
    })

    it("z=1 on z-axis", () => {
        assertCoordinateEquality(
            changeToCartesian(1, 0, 0),
            [0, 0, 1]
        )
    })
})

describe("changeToSpherical", () => {
    it("when z=1 on the z-axis", () => {
        assertCoordinateEquality(
            changeToSpherical(0, 0, 1),
            // Math.PI/2 in the middle is based on the fn convention for north pole. 
            [1, Math.PI/2, 0]
        )
    })
    it("when y=1 on the y-axis", () => {
        assertCoordinateEquality(
            changeToSpherical(0, 1, 0),
            [1, Math.PI/2, Math.PI/2]
        )
    })
    it("when x=1 on the x-axis", () => {
        assertCoordinateEquality(
            changeToSpherical(1, 0, 0),
            [1, 0, Math.PI/2]
        )
    })
})

describe("vectorDotProduct", () => {
    it("general case", () => {
        assert.deepEqual(
            vectorDotProduct([1, 2, 3], [7, 5, 8]),
            1*7 + 2*5 + 3*8
        )
    })
})

describe("normalizeVector", () => {
    it("general case", () => {
        assertCoordinateEquality(
            normalizeVector([3, 4, 5]),
            [0.424264069, 0.565685425, 0.707106781]
        )
    })
})

describe("vectorDistance", () => {
    it("general case", () => {
        assertIsCloseEnough(
            vectorDistance([1, 2, 3], [-8, 4, 5]),
            9.433981132
        )
    })
})

describe("crossProduct", () => {
    it("general case", () => {
        assertCoordinateEquality(
            vectorCrossProduct([5, 3, 1], [1, 2, 3]),
            [7, -14, 7]
        )
    })
    it("edge case", () => {
        assertCoordinateEquality(
            vectorCrossProduct([1, 2, 3], [2, 4, 6]),
            [0, 0, 0]
        )
    })
})