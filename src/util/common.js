export function successResponse (body){
    return {
        statusCode: 200,
        body: (typeof body === "string") ? body : JSON.stringify(body)
    }
}

export function badResponse (body){
    return {
        statusCode: 400,
        body: (typeof body === "string") ? body : JSON.stringify(body)
    }
}