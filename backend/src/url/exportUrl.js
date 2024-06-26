import { 
    badResponse,
} from "../util/common.js";
import {EXPORT_URL_PROJECTION } from "../util/constants.js";
import {
    queryRecord
} from "../util/dynamoUtil.js"
import xlsx from 'node-xlsx';
import { getObjectUrl, uploadBufferToS3 } from "../util/s3Util.js"

export async function exportUrl (event, context) {
    try{
        const user_id = event?.requestContext?.authorizer?.jwt?.claims["cognito:username"];
        const params = {
            TableName: process.env.SHORTNER_URLS_TABLE, // Replace with your table name
            KeyConditionExpression: "user_id = :value", // Replace with your partition key
            ExpressionAttributeValues: {
              ":value": user_id // Replace with your key value
            },
        };
        params.ProjectionExpression = EXPORT_URL_PROJECTION;
        const result = await queryRecord(params);
        const urls = [];
        urls.push(EXPORT_URL_PROJECTION.split(","));
        result.map(obj => {
            urls.push([obj.unique_id,obj.identification_name,obj.original_url,obj.short_url,obj.url_status === 1 ? "enabled" : "disabled", obj.total_hit])
        })
        const buffer = xlsx.build([
            {name: 'urls', data: urls},
        ]);
        await uploadBufferToS3 (
            buffer,
            `${user_id}/url/export/stats.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        const url = await getObjectUrl(`${user_id}/url/export/stats.xlsx`);
        return {
            statusCode: 301,
            headers: {
                "Location": url,
                "Cache-Control": "no-cache",
            },
        };
    }catch(err){
        return badResponse({
            error: err.message
        })
    }

}