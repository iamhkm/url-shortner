import { 
    successResponse,
    badResponse,
    generateRandomString,
    createStats
} from '../util/common.js';
import{
    getRecord,
    insertRecord
} from "../util/dynamoUtil.js"
import { BASIC_USER_ALLOWED_URLS, USER_ROLE_BASIC } from "../util/constants.js";

export async function addUrl (event, context){
    try{
        console.log("event ", event.requestContext.authorizer.claims);
        const user_id = event.requestContext.authorizer.claims['cognito:username'];
        const role = event.requestContext.authorizer.claims['custom:ROLE'];
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        const {
            tag,
            name,
            description
        } = input;
        let url = input.url;
        if (!input.url || !input.name) throw new Error("provide url and name for identification");
        if (!url.startsWith("https://")) url = `https://${url}`
        const uuid = generateRandomString();
        const user = await getRecord({
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Key: {
                unique_id: user_id,
            }
        });
        if (role === USER_ROLE_BASIC && user.total_url >= BASIC_USER_ALLOWED_URLS) {
            throw new Error("you've exhausted your free limit of urls");
        }
        createStats(user, "add_stats");
        user.total_url+=1;
        user.total_active+=1;
        const dateToday = new Date();
        const shortUrl = `https://${process.env.BASE_URL}/dev/url/${user_id}_${uuid}`;
        const record = {
            TableName: process.env.SHORTNER_URLS_TABLE,
            Item: {
              unique_id: uuid ,
              user_id: user_id,
              original_url: url,
              identification_name: name,
              short_url: shortUrl,
              added_date: dateToday.getTime(),
              last_modified: dateToday.getTime(),
              url_status: 1,
              total_hit: 0
            }
        };
        if (tag && Array.isArray(tag)) record.Item.tag = tag;
        if (description) record.Item.description = description;
        await insertRecord(record);
        await insertRecord({
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Item: user
        });
        return successResponse({
            url: shortUrl
        });
    }catch(err) {
        console.log("Error add shortner url ", err);
        return badResponse({error: err.message});
    }
}