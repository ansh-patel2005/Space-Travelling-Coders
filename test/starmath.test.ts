import { describe, it } from "node:test"
import { assertCoordinateEquality, assertIsCloseEnough } from "./helper"
import { FOV, StarData } from "../webpage/types"
import { changeToCartesian, changeToLongAndLat, earthRadius } from "../webpage/math"
import { apparentSize } from "../webpage/starmath"

describe("apparent size", () => {
    it("Alpha Centauri from Earth", () => {
        assertIsCloseEnough(apparentSize(2.75829207e-8, 1.3389283), 0.000000041, 1e-9)
    })
})