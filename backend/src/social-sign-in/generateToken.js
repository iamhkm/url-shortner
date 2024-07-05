import {
    OAuth2Client
} from "google-auth-library"
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI, 
    MATRIX_TYPE_USER
} from "../util/constants.js";
import { 
    successResponse,
    badResponse,
    generateRandomString,
} from '../util/common.js';
import { getUserInfo } from "../util/googleUtil.js";
import { adminCreateUser, adminLoginOverride, getUserByToken } from "../util/cognitoUtil.js";
import { getRecord, insertRecord, scanRecord } from "../util/dynamoUtil.js";

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
        const tokens = await oauth2Client.getToken(decodedToken);
        const profile = await getUserInfo(tokens.tokens.access_token);
        const email = profile.emailAddresses[0].value.toLocaleLowerCase();
        console.log("email fetched ", email);
        const input = {
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
              ":email": email
            }
        };
        console.log("input here ", input);
        const record = await scanRecord(input);
        console.log("response from db ", record);
        if (!record || record.length < 1) {
            const username = generateRandomString();
            await adminCreateUser(username, email);
            const record = {
                TableName: process.env.SHORTNER_URLS_USERS_TABLE,
                Item: {
                  unique_id: username,
                  email,
                  added_date: new Date().getTime(),
                  total_url: 0,
                  total_active: 0,
                  stats_enabled: false,
                  profile_url: profile?.photos?.[0]?.url || "",
                  first_name: profile?.names?.[0]?.givenName || "",
                  last_name: profile?.names?.[0]?.familyName || "",
                }
            };
            await insertRecord(record);
            let userStats = await getRecord({
                TableName: process.env.ADMIN_STATS_TABLE,
                Key: {
                  matrix_type: MATRIX_TYPE_USER,
                }
              });
              if (!userStats) {
                userStats = {
                  matrix_type: MATRIX_TYPE_USER
                }
              }
              createStats(userStats, "stats");
              await insertRecord({
                TableName: process.env.ADMIN_STATS_TABLE,
                Item: userStats
              });
        }
        const finalRes = await adminLoginOverride(email);
        const additionalInfo = await getUserByToken(finalRes.AuthenticationResult.AccessToken);
        const role = additionalInfo.UserAttributes.reduce((acc, curr) => {
            if (curr.Name == "custom:ROLE") return curr.Value
            return acc;
        }, "");
        const response = {
            id_token: finalRes.AuthenticationResult.IdToken,
            access_token: finalRes.AuthenticationResult.AccessToken,
            refresh_token: finalRes.AuthenticationResult.RefreshToken,
            role: role,
            username: additionalInfo.Username
        }
        return successResponse(response);
    }catch(err){
        console.log("Error creating auth url ", err);
        return badResponse({error: err.message});
    }
}