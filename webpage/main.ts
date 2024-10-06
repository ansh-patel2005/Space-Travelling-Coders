import { Init } from "./comm"
import { fov, stars, exoplanet} from "./internals"
import { changeToLongAndLat, changeToCartesian, degToRad, parsecToKm } from "./math"
import { computeStarProjections, FOVSize } from "./projections"
import { StarData } from "./types"

const canvas = document.querySelector("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

// Temporary testing code.
// polaris
stars.push(new StarData(changeToCartesian(4.10438e15/parsecToKm, ...changeToLongAndLat(
    "03h03m17.13s",
    "+89d22m07.3s"
)), 5e-7))

// Menkalinan
stars.push(new StarData(changeToCartesian(768.3*1e12/parsecToKm, ...changeToLongAndLat(
    "06h01m21.0s", "+44d56m51.9s"
)), 5e-7))

// kochab
stars.push(new StarData(changeToCartesian(130.92*9.461e12/parsecToKm, ...changeToLongAndLat(
    "14h50m41.25s",
    "74d03m33.5s"
)), 5e-7))

// errai
stars.push(new StarData(changeToCartesian(424.6*1e12/parsecToKm, ...changeToLongAndLat(
    "23h40m25.8s",
    "77d46m19.7s"
)), 5e-7))

// alpha centauri
stars.push(new StarData(changeToCartesian(37.8*1e12/parsecToKm, ...changeToLongAndLat(
    "14h41m14.9s",
    "-60d56m18.0s"
)), 5e-7))

// gamma centauri
stars.push(new StarData(changeToCartesian(1.231*1e15/parsecToKm, ...changeToLongAndLat(
    "12h42m50.9s",
    "-49d05m37.4s"
)), 5e-7))

// hip
stars.push(new StarData(changeToCartesian(6153.89*9.461e12/parsecToKm, ...changeToLongAndLat(
    "13h20m48.34s",
    "-55d55m02.4s"
)), 5e-7))

// hadar
stars.push(new StarData(changeToCartesian(525.21*9.461e12/parsecToKm, ...changeToLongAndLat(
    "14h05m34.39s",
    "-60d29m31.1s"
)), 5e-7))

// hip 6798 - sao 129310
stars.push(new StarData(changeToCartesian(1156.58*0.306601/parsecToKm, ...changeToLongAndLat(
    "01h28m42.23s",
    "-07d12m58.4s"
)), 5e-7))


function Animate() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const fovSize = FOVSize(fov, exoplanet.radius)
    const maxDisplaySize = Math.min(canvas.width, canvas.height)
    const scaleFactor = maxDisplaySize/fovSize

    for (const star of stars) {
        if (!star.isVisible) {
            continue
        }

        let {screenX, screenY} = star
        
        screenX = screenX*scaleFactor + canvas.width/2
        screenY = screenY*scaleFactor + canvas.height/2

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        // console.log(star.screenRadius)
        ctx.arc(screenX, screenY, star.screenRadius, 0, Math.PI*2)
        ctx.fill()
    }

    requestAnimationFrame(() => {})
}

function changeLongitude(newLongitude: string){
    let a = document.getElementById("LongitudeOut") as HTMLInputElement
    a.value = newLongitude
    fov.longitude = degToRad(Number(newLongitude))
    computeStarProjections(fov, exoplanet.radius, stars)
    Animate()
}
// @ts-ignore
window.changeLongitude = changeLongitude

function changeLatitude(newLatitude: string){
    let a = document.getElementById("LatitudeOut") as HTMLInputElement
    a.value = newLatitude
    fov.latitude = degToRad(90 - Number(newLatitude))
    computeStarProjections(fov, exoplanet.radius, stars)
    Animate()
}
// @ts-ignore
window.changeLatitude = changeLatitude

function changeFOV(newFOV: string) {
    let a = document.getElementById("FOVOut") as HTMLInputElement
    a.value = newFOV
    fov.angle = degToRad(Number(newFOV))
    computeStarProjections(fov, exoplanet.radius, stars)
    Animate()
}
// @ts-ignore
window.changeFOV = changeFOV

;(async () => {
    // await Init()
    computeStarProjections(fov, exoplanet.radius, stars)
    Animate()
})()