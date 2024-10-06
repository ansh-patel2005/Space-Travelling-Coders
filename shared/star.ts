// Typings for the star shared type

/**
 * All distances are in parsecs. 
 */
export interface ServerStarData {
    name: string
    ra: string
    dec: string
    dist: number
    radius: number
}

export interface ServerPlanetData {
    name: string
    hostName: string
    radius: number
}