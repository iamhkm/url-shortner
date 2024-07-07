import {
    authenticateUser,
    forgotPassword,
    getUserByToken
} from "../util/cognitoUtil.js"
import{
    badResponse,
    successResponse
} from "../util/common.js"

export async function forgotPasswordInit (event, context){
    try{
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        const email = input.email;
        if (!email) throw new Error("email is required");
        await forgotPassword(email);
        return successResponse({
            data: "Request initiated.. Please verify using otp"
        });
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}