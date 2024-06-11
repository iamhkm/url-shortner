import { badResponse } from "../util/common.js";
import {
    getRecord
} from "../util/dynamoUtil.js"

export async function hitUrl (event, context) {
    try{
        const uuid = event?.pathParameters?.uuid
        if (!uuid) throw new Error("uuid is required");
        const record = await getRecord({
            TableName: "shorten-urls",
            Key: {
                uuid: uuid
            }
        });
        return {
            statusCode: 301,
            headers: {
                "Location": record.url,
                "Cache-Control": "no-cache",
              },
        }
    }catch(err){
        return badResponse({
            error: err.message
        })
    }

}