import { badResponse, createStats } from "../util/common.js";
import {
    getRecord
} from "../util/dynamoUtil.js"
import {
    insertRecord
} from "../util/dynamoUtil.js"

export async function hitUrl (event, context) {
    try{
        const uuid = event?.pathParameters?.uuid
        if (!uuid) throw new Error("uuid is required");
        const info = uuid.split("_");
        if (info.length < 2) throw new Error("invalid url");
        const record = await getRecord({
            TableName: process.env.SHORTNER_URLS_TABLE,
            Key: {
                unique_id: info[1],
                user_id: info[0]
            }
        });
        if (!record) throw new Error("url not found");
        if (record.url_status !== 1) throw new Error("this url is disabled");
        record.total_hit+=1
        createStats(record, "hit_stats");
        await insertRecord({
            TableName: process.env.SHORTNER_URLS_TABLE,
            Item: record
        });
        return {
            statusCode: 301,
            headers: {
                "Location": record.original_url,
                "Cache-Control": "no-cache",
              },
        }
    }catch(err){
        return badResponse({
            error: err.message
        })
    }

}