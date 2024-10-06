import { Init } from "./comm"
import { fov, stars, exoplanet, exoPlanets} from "./internals"
import { degToRad } from "./math"
import { changePlanets, computeStarProjections, FOVSize } from "./projections"

const canvas = document.querySelector("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

function Animate() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    const fovSize = FOVSize(fov, exoplanet.radius)
    const maxDisplaySize = Math.min(canvas.width, canvas.height)
    const scaleFactor = maxDisplaySize/fovSize

    for (const star of stars.values()) {
        if (!star.isVisible) {
            continue
        }

        let {screenX, screenY} = star
        
        screenX = screenX*scaleFactor + canvas.width/2
        screenY = screenY*scaleFactor + canvas.height/2

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(screenX, screenY, 2, 0, Math.PI*2)
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
    await Init()
    computeStarProjections(fov, exoplanet.radius, stars)
    Animate()

    const planetSelectMenu = document.getElementById("PlanetSelectMenu") as HTMLSelectElement
    // Listener for changing planets
    planetSelectMenu.addEventListener("change", () => {
        const name = planetSelectMenu.selectedOptions[0].value
        const planet = exoPlanets.find(item => item.name == name)

        if (!planet) {
            console.log(`Failed to select planet ${name}.`)
            return
        }

        const hostStar = planet.hostName
        
        // Change the exoplanet.
        exoplanet.name = name
        exoplanet.position = [...stars.get(hostStar)!.position]
        exoplanet.radius = planet.radius

        changePlanets(exoplanet)
        computeStarProjections(fov, exoplanet.radius, stars)
        Animate()
    })
})()