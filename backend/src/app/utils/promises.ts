import { verify } from "jsonwebtoken"

export async function getDataTokenPromise(token: string) {
    return new Promise((resolve, reject) => {
        const data = verify(token, String(process.env.JWTKEY))
        if (data) {
            resolve(data)
        }
        reject("No token found")
    })
}