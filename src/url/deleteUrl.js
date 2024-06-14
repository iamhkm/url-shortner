import { 
    badResponse,
    createStats,
    successResponse
} from "../util/common.js";
import {
    getRecord,
    insertRecord,
    deleteRecord
} from "../util/dynamoUtil.js"

export async function deleteUrl (event, context) {
    try{
        const uuid = event?.queryStringParameters?.uuid
        if (!uuid) throw new Error("uuid is required");
        const user_id = event.requestContext.authorizer.claims['cognito:username'];
        const uniqueUrlParam = {
            TableName: process.env.SHORTNER_URLS_TABLE,
            Key: {
                unique_id: uuid,
                user_id: user_id
            }
        }
        const userParam = {
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Key: {
                unique_id: user_id,
            }
        };
        const url = await getRecord(uniqueUrlParam);
        if (!url) throw new Error("url not found");
        const user = await getRecord(userParam);
        console.log(user);
        await deleteRecord(uniqueUrlParam);
        user.total_url = user.total_url - 1;
        user.total_active = user.total_active - 1;
        createStats(user, "delete_stats");
        await insertRecord({
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Item: user
        });
        return successResponse({
            data: `url deleted with id ${uuid}`
        });
    }catch(err){
        return badResponse({
            error: err.message
        })
    }

}