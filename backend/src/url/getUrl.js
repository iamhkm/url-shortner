import { 
    badResponse,
    successResponse
} from "../util/common.js";
import { BASIC_URL_PROJECTION, USER_ROLE_BASIC } from "../util/constants.js";
import {
    getRecord,
    queryRecord
} from "../util/dynamoUtil.js"

export async function getUrl (event, context) {
    try{
        const uuid = event?.queryStringParameters?.uuid
        const user_id = event?.requestContext?.authorizer?.jwt?.claims["cognito:username"];
        const role = event?.requestContext?.authorizer?.jwt?.claims["custom:ROLE"];
        if (!uuid) {
            const params = {
                TableName: process.env.SHORTNER_URLS_TABLE, // Replace with your table name
                KeyConditionExpression: "user_id = :value", // Replace with your partition key
                ExpressionAttributeValues: {
                  ":value": user_id // Replace with your key value
                },
              };
              if (role == USER_ROLE_BASIC) params.ProjectionExpression = BASIC_URL_PROJECTION;
            return successResponse(await queryRecord(params));
        }
        const param = {
            TableName: process.env.SHORTNER_URLS_TABLE,
            Key: {
                unique_id: uuid,
                user_id: user_id
            }
        };
        if (role == USER_ROLE_BASIC) param.ProjectionExpression = BASIC_URL_PROJECTION;
        const record = await getRecord(param);
        if (!record) throw new Error("url not found");
        return successResponse(record);
    }catch(err){
        return badResponse({
            error: err.message
        })
    }

}