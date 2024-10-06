import { fov, stars } from "./internals"
import { changeToLongAndLat, changeToCartesian } from "./math"
import { computeStarProjections, FOVSize } from "./projections"
import { StarData } from "./types"

const canvas = document.querySelector("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

// Temporary testing code.
// polaris
stars.push(new StarData(changeToCartesian(4.10438e15, ...changeToLongAndLat(
    "03h03m17.13s",
    "+89d22m07.3s"
))))

// Menkalinan
stars.push(new StarData(changeToCartesian(768.3*1e12, ...changeToLongAndLat(
    "06h01m21.0s", "+44d56m51.9s"
))))

// kochab
stars.push(new StarData(changeToCartesian(130.92*9.461e12, ...changeToLongAndLat(
    "14h50m41.25s",
    "74d03m33.5s"
))))

// errai
stars.push(new StarData(changeToCartesian(424.6*1e12, ...changeToLongAndLat(
    "23h40m25.8s",
    "77d46m19.7s"
))))

// alpha centauri
stars.push(new StarData(changeToCartesian(37.8*1e12, ...changeToLongAndLat(
    "14h41m14.9s",
    "-60d56m18.0s"
))))

// gamma centauri
stars.push(new StarData(changeToCartesian(1.231*1e15, ...changeToLongAndLat(
    "12h42m50.9s",
    "-49d05m37.4s"
))))

// hip
stars.push(new StarData(changeToCartesian(6153.89*9.461e12, ...changeToLongAndLat(
    "13h20m48.34s",
    "-55d55m02.4s"
))))

// hadar
stars.push(new StarData(changeToCartesian(525.21*9.461e12, ...changeToLongAndLat(
    "14h05m34.39s",
    "-60d29m31.1s"
))))

computeStarProjections(fov, 6371, stars)

Animate()
function Animate() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const fovSize = FOVSize(fov, 6371)
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
        ctx.arc(screenX, screenY, 5, 0, Math.PI*2)
        ctx.fill()
    }

    requestAnimationFrame(() => {})
}