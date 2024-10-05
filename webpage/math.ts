export function changeToLongAndLat(rightAsc: string, declination: string): [number, number] {
    let tokens = rightAsc.match(/[\d.+-]+/g)
    let secondTokens = declination.match(/[\d.+-]+/g)

    if (!tokens || tokens.length != 3) {
        throw new Error(`Invalid right ascension.`)
    }
    if (!secondTokens || secondTokens.length != 3) {
        throw new Error(`Invalid declination.`)
    }

    // change to longitude
    let hours = Number(tokens[0])
    let minutes = Number(tokens[1])
    hours += minutes/60
    let seconds = Number(tokens[2])
    hours += seconds/3600
    let longitude = hours*15

    // change to latitude
    let degrees = Number(secondTokens[0])
    let decMinutes = Number(tokens[1])
    degrees += decMinutes/60
    let decSeconds = Number(tokens[2])
    degrees += decSeconds/3600
    let latitude = degrees

    return [longitude, latitude]
}

function degToRad(deg: number) {
    return deg/180 * Math.PI
}

export function changeToCartesian(distanceFromEarth: number, longitude: number, latitude: number): [number, number, number] {
    let adjustedLongitude = degToRad(longitude + 180)
    let adjustedLatitude = degToRad(latitude + 90)

    let x = distanceFromEarth*Math.sin(adjustedLongitude)*Math.cos(adjustedLatitude)
    let y = distanceFromEarth*Math.sin(adjustedLongitude)*Math.sin(adjustedLatitude)
    let z = distanceFromEarth*Math.cos(adjustedLongitude)
    return [x, y, z]
}