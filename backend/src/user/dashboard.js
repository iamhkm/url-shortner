import { 
    successResponse,
    badResponse
} from '../util/common.js';
import{
    getRecord,
    queryRecord,
} from "../util/dynamoUtil.js";
import {
    BASIC_USER_PROJECTION,
    USER_ROLE_BASIC,
    BASIC_URL_PROJECTION
} from "../util/constants.js";

export async function dashboard (event, context){
    try{
        const user_id = event?.requestContext?.authorizer?.jwt?.claims["cognito:username"];
        const role = event?.requestContext?.authorizer?.jwt?.claims["custom:ROLE"];
        const userParam = {
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Key: {
                unique_id: user_id,
            }
        };
        if (role == USER_ROLE_BASIC) {
            userParam.ProjectionExpression = BASIC_USER_PROJECTION
        }
        const user = await getRecord(userParam);
        const params = {
            TableName: process.env.SHORTNER_URLS_TABLE, // Replace with your table name
            KeyConditionExpression: "user_id = :value", // Replace with your partition key
            ExpressionAttributeValues: {
              ":value": user_id // Replace with your key value
            },
            ProjectionExpression: BASIC_URL_PROJECTION
        };
        const urls = await queryRecord(params);
        return successResponse({
            ...user,
            urls
        });
    }catch(err) {
        console.log("Error add shortner url ", err);
        return badResponse({error: err.message});
    }
}