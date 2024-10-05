import { fov, stars } from "./internals"
import { changeToLongAndLat, changeToCartesian } from "./math"
import { computeDisplayStars, FOVSize } from "./projections"
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
stars.push(new StarData(changeToCartesian(7.683e12, ...changeToLongAndLat(
    "06h01m21.0s", "+44d56m51.9s"
))))

computeDisplayStars(fov, 6371)

console.log(stars)
console.log(FOVSize(fov, 6371))

Animate()
function Animate() {
    requestAnimationFrame(Animate)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const fovSize = FOVSize(fov, 6371)
    const maxDisplaySize = Math.max(canvas.width, canvas.height)
    const scaleFactor = maxDisplaySize/fovSize

    for (const star of stars) {
        let {screenX, screenY} = star
        
        screenX = screenX*scaleFactor + canvas.width/2
        screenY = screenY*scaleFactor + canvas.height/2

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(screenX, screenY, 5, 0, Math.PI*2)
        ctx.fill()
    }
}