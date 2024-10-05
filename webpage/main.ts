import { changeToLongAndLat, changeToCartesian } from "./math"

document.body.innerText = "hello world"

console.log(changeToCartesian(93.1846, ...changeToLongAndLat("12h20m42.91s", "+17d47m35.71s")))
