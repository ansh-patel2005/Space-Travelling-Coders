import fs from "fs"
import { parse } from "csv-parse"
import { ServerStarData } from "../shared/star"

/**
 * @todo optimize this fn
 */
function starDataFromCSVRow(data: string[], headers: string[]): ServerStarData {
    const raIndex = headers.indexOf("rastr")
    const decIndex = headers.indexOf("decstr")
    const distIndex = headers.indexOf("sy_dist")

    const starNameIndex = headers.indexOf("hostname")

    return {
        name: data[starNameIndex],
        ra: data[raIndex],
        dec: data[decIndex],
        dist: Number(data[distIndex])
    }
}

// To prevent duplicate stars.
const starNames: Set<string> = new Set()

// The star data
export async function loadStarData(csvPath: string): Promise<ServerStarData[]> {
    const csvParser = parse({ delimiter: "," })

    return await new Promise(resolve => {
        const starData: ServerStarData[] = []

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

                starData.push(star)
                starNames.add(star.name)
            })
            .on("end", () => {
                resolve(starData)
            })
    })
}