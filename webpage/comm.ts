// For communicating with the server.

import { ServerPlanetData, ServerStarData } from "../shared/star"
import { exoplanet, exoPlanets, stars } from "./internals"
import { changeToCartesian, changeToLongAndLat } from "./math"
import { changePlanets } from "./projections"
import { StarData } from "./types"

function getExoplanetDistance(exoplanet: ServerPlanetData) {
    const hostStar = stars.get(exoplanet.hostName)

    if (!hostStar) {
        return Infinity
    }

    return Math.hypot(...hostStar.position)
}

function createExoPlanetOption(name: string, selectMenu: HTMLSelectElement) {
    const option = document.createElement("option") as HTMLOptionElement
    option.value = name
    option.text = name

    selectMenu.appendChild(option)
}

/**
 * Loads all the information from the server.
 */
export async function Init() {
    const [serverStarData, serverPlanetData] = await (await fetch("/data.json")).json() as [ServerStarData[], ServerPlanetData[]]

    for (const star of serverStarData) {
        stars.set(star.name, new StarData(
            changeToCartesian(exoplanet.radius, ...changeToLongAndLat(star.ra, star.dec)),
            5e-8 // to be implemented later
        ))
    }

    const planetSelectMenu = document.getElementById("PlanetSelectMenu") as HTMLSelectElement

    // Load exoplanets
    for (const exoplanet of serverPlanetData) {
        exoPlanets.push(exoplanet)
    }

    // Sort exoplanets by distance
    exoPlanets.sort((a, b) => getExoplanetDistance(a) - getExoplanetDistance(b))

    // Populate the planet select menu
    exoPlanets.forEach(planet => {
        createExoPlanetOption(planet.name, planetSelectMenu)
    })

    planetSelectMenu.selectedIndex = -1 // should start on earth but we don't have an Earth option

}

