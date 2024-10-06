import assert from "node:assert"

export const ASSERT_TOLERANCE = 1e-6

/**
 * Asserts that a floating point value is close enough to expected.
 * @param actual output of fn
 * @param expected what the output should be
 * @param tolerance how close the values need to be. Must be positive. Defaults to `ASSERT_THRESHOLD`
 */
export function assertIsCloseEnough(actual: number, expected: number, tolerance: number = ASSERT_TOLERANCE, message?: string) {
    assert.ok(Math.abs(actual - expected) < tolerance, message ?? `Expected ${actual} to be within ${tolerance} of ${expected}.`)
}

export function assertCoordinateEquality(actual: number[], expected: number[]) {
    const errMessage = `Got: [${actual.join(", ")}]. Expected: [${expected.join(", ")}]`

    assert.equal(actual.length, expected.length, errMessage)

    for (let i = 0; i < actual.length; i++) {
        assertIsCloseEnough(actual[i], expected[i], undefined, errMessage)
    }
}
