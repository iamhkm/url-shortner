import { 
    badResponse,
    successResponse
} from "../util/common.js";
import {
    getRecord,
    insertRecord,
} from "../util/dynamoUtil.js"

export async function updateUrl (event, context) {
    try{
        const uuid = event?.queryStringParameters?.uuid
        const user_id = event.requestContext.authorizer.claims['cognito:username'];
        if (!uuid) throw new Error("uuid is required");
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        let incomingStatus = input.status;
        const url = input.url;
        if ((incomingStatus == null || typeof incomingStatus !== "boolean") && (!url || typeof url !== "string")) 
            throw new Error("invalid input");
        const userParam = {
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Key: {
                unique_id: user_id,
            }
        };
        const user = await getRecord(userParam);
        const record = await getRecord({
            TableName: process.env.SHORTNER_URLS_TABLE,
            Key: {
                unique_id: uuid,
                user_id: user_id
            }
        });
        if (!record) throw new Error("url not found");
        const status = record.url_status;
        let newChanges = false;
        let updatingStatus = false;
        if (incomingStatus != null) {
            incomingStatus = (incomingStatus === true) ? 1 : 0;
            if (incomingStatus !== status){
                record.url_status = incomingStatus;
                updatingStatus = true;
                newChanges = true;
            }
        };
        if (url) {
            record.original_url = url;
            newChanges = true;
        }
        if (!newChanges) {
            return successResponse ({message: "no new changes"});
        }
        await insertRecord({
            TableName: process.env.SHORTNER_URLS_TABLE,
            Item: {
                ...record,
                last_modified: new Date().getTime()
            }
        });
        if (updatingStatus) {
            user.total_active = (incomingStatus === true) ? (user.total_active + 1) : (user.total_active - 1);
            await insertRecord({
                TableName: process.env.SHORTNER_URLS_USERS_TABLE,
                Item: user
            });
        }
        return successResponse({
            data: `record updated with id ${uuid}`
        });
    }catch(err){
        console.log("error updating url ", err);
        return badResponse({
            error: err.message
        })
    }
}