import http from "http"
import fs from "fs"
import { loadStarData } from "./starLoader"

const port = 38712
// It will be compiled to out/server
const htmlFilePath = "../../webpage/index.html"
const jsFilePath = "../../webpage/compiled.js"
const csvFilePath = "../../server/nasaSpaceCatalog.csv"

;(async () => {
    const starData = JSON.stringify(await loadStarData(csvFilePath))

    loadStarData(csvFilePath)
    
    const server = http.createServer((req, res) => {
        if (req.url == "/" || req.url == "/index.html") {
            res.writeHead(200)
            res.end(fs.readFileSync(htmlFilePath))
            return
        } else if (req.url == "/compiled.js") {
            res.writeHead(200)
            res.end(fs.readFileSync(jsFilePath))
            return
        } else if (req.url == "/data.json") {
            res.writeHead(200)
            res.end(starData)
        } else {
            res.writeHead(404)
            res.end("Not found")
        }    
    })
    
    server.listen(port, () => {
        console.log(`Listening on port ${port}.`)
    })
})()