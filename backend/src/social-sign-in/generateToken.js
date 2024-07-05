import {
    OAuth2Client
} from "google-auth-library"
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI 
} from "../util/constants.js";
import { 
    successResponse,
    badResponse,
} from '../util/common.js';
import { getUserInfo } from "../util/googleUtil.js";



export async function generateToken(event, context) {
    try{
        const code = event.queryStringParameters.code;
        if (!code) throw new Error("code is required");
        const oauth2Client = new OAuth2Client(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
          );
          const decodedToken = decodeURIComponent(code);
          console.log("decodedToken ", decodedToken);
          const tokens = await oauth2Client.getToken(decodedToken);
          const profile = await getUserInfo(tokens.tokens.access_token);
          console.log("profile ", profile);
          return successResponse({
            ...tokens
        });
    }catch(err){
        console.log("Error creating auth url ", err);
        return badResponse({error: err.message});
    }
}