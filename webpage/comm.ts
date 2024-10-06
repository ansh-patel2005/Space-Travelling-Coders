// For communicating with the server.

import { ServerStarData } from "../shared/star"
import { exoplanet, stars } from "./internals"
import { changeToCartesian, changeToLongAndLat } from "./math"
import { StarData } from "./types"

/**
 * Loads all the information from the server.
 */
export async function Init() {
    const serverStarData = await (await fetch("/data.json")).json() as ServerStarData[]

    for (const star of serverStarData) {
        stars.push(new StarData(
            changeToCartesian(exoplanet.radius, ...changeToLongAndLat(star.ra, star.dec)), 5e-8,
            // star.name
        ))
    }
}

