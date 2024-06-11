import { v4 as uuidv4 } from 'uuid';
import { 
    successResponse,
    badResponse 
} from '../util/common.js';
import{
    insertRecord
} from "../util/dynamoUtil.js"

export async function addShortner (event, context){
    try{
        console.log("event ", event);
        console.log("context ", context);
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.url) throw new Error("provide url that need to be shorten");
        const uuid = uuidv4();
        const record = {
            TableName: "shorten-urls",
            Item: {
              uuid: uuid ,
              url: input.url,
              added_date: new Date().getTime()
            }
        };
        await insertRecord(record);
        return successResponse({
            url: `https://${event.requestContext.domainName}/dev/url/${uuid}`
        });
    }catch(err) {
        console.log("Error add shortner url ", err);
        return badResponse({error: err.message});
    }
}