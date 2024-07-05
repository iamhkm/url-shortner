import {
    OAuth2Client
} from "google-auth-library"
import { 
    AUTH_SCOPES,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI 
} from "../util/constants.js";
import { 
    successResponse,
    badResponse,
} from '../util/common.js';

export async function generateAuthUrl(event, context) {
    try{
        const oauth2Client = new OAuth2Client(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
          );
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: AUTH_SCOPES,
            prompt: "consent"
        });
        return successResponse({
            url
        });
    }catch(err){
        console.log("Error creating auth url ", err);
        return badResponse({error: err.message});
    }
}