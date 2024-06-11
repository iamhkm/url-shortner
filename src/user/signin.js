import {
    authenticateUser
} from "../util/cognitoUtil.js"
import{
    badResponse,
    successResponse
} from "../util/common.js"

export async function signin (event, context){
    try{
        console.log("event ", event);
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.username || !input.password) throw new Error("username and password is required");
        const authParams = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.client_id, // Replace with your Cognito User Pool Client ID
            AuthParameters: {
              USERNAME: input.username, // User's email address
              PASSWORD: input.password // User's password
            }
        };
        const result = await authenticateUser(authParams);
        return successResponse({data: result});
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}