import {
    confirmUserSignup
} from "../util/cognitoUtil.js"
import{
    successResponse,
    badResponse
} from "../util/common.js"

export async function confirmSignup (event, context){
    try{
        console.log("event ", event);
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.username || !input.confirmation_code) throw new Error("username and confirmation_code is required");
        const confirmationParams = {
            ClientId: process.env.USER_POOL_CLIENT_ID,
            Username: input.username,
            ConfirmationCode: input.confirmation_code
          };
        await confirmUserSignup(confirmationParams);
        return successResponse({data: "sign up successful now you can login"});
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}