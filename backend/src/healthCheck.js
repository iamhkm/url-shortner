import {
    successResponse
} from "./util/common.js"

export async function ping (event, context) {
    return successResponse("Server Online");
}