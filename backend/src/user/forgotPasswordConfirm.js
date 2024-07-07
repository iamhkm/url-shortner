import {
    confirmForgotPassword,
} from "../util/cognitoUtil.js"
import{
    badResponse,
    successResponse
} from "../util/common.js"

export async function forgotPasswordConfirm (event, context){
    try{
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        const { email, confirmation_code, password } = input;
        if (!email || !confirmation_code || !password) throw new Error("email, code and password is required");
        await confirmForgotPassword(email, confirmation_code, password);
        return successResponse({
            data: "Request initiated.. Please verify using otp"
        });
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}