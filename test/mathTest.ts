import assert from "assert"
import { describe, it } from "node:test"
import { changeToLongAndLat } from "../webpage/math"

describe("changeToLongAndLat", () => {
    describe("edgeCase", () => {
        it("should return [0, 0]", () => {
            assert.deepEqual(changeToLongAndLat("00h00m00s", "+00d00m00.00s"), [0, 0])
        })
    })
})

// console.log(changeToLongAndLat("12h20m42.91s", "+17d47m35.71s"))