import fs from "fs"
import { parse } from "csv-parse"
import { ServerPlanetData, ServerStarData } from "../shared/star"
import { earthRadiusInParsecs, solarRadiusInParsecs } from "../shared/constants"

/**
 * @todo optimize this fn
 */
function starDataFromCSVRow(data: string[], headers: string[]): ServerStarData {
    const raIndex = headers.indexOf("rastr")
    const decIndex = headers.indexOf("decstr")
    const distIndex = headers.indexOf("sy_dist")
    const solarRadiusIndex = headers.indexOf("st_rad")

    const starNameIndex = headers.indexOf("hostname")

    return {
        name: data[starNameIndex],
        ra: data[raIndex],
        dec: data[decIndex],
        dist: Number(data[distIndex]),
        radius: Number(data[solarRadiusIndex]) * solarRadiusInParsecs
    }
}

function planetDataFromCSVRow(data: string, headers: string[]): ServerPlanetData {
    const hostNameIndex = headers.indexOf("hostname")
    const planetNameIndex = headers.indexOf("pl_name")
    const radiusIndex = headers.indexOf("pl_rade")

    return {
        name: data[planetNameIndex],
        hostName: data[hostNameIndex],
        radius: Number(data[radiusIndex]) * earthRadiusInParsecs
    }
}

// To prevent duplicate stars.
// We're also going to only allow one exoplanet per star system.
const starNames: Set<string> = new Set()

// The star data
export async function loadStarData(csvPath: string): Promise<[ServerStarData[], ServerPlanetData[]]> {
    const csvParser = parse({ delimiter: "," })

    return await new Promise(resolve => {
        const starData: ServerStarData[] = []
        const planetData: ServerPlanetData[] = []

        let headers: string[] | null = null

        fs.createReadStream(csvPath)
            .pipe(csvParser)
            .on("data", data => {
                if (headers == null) {
                    headers = data
                    return
                }

                const star = starDataFromCSVRow(data, headers)
                if (starNames.has(star.name)) {
                    return
                }

                planetData.push(planetDataFromCSVRow(data, headers))
                starData.push(star)
                starNames.add(star.name)
            })
            .on("end", () => {
                resolve([starData, planetData])
            })
    })
}