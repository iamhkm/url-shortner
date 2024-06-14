import { 
    successResponse,
    badResponse
} from '../util/common.js';
import { BASIC_USER_PROJECTION, USER_ROLE_BASIC } from '../util/constants.js';
import{
    getRecord,
} from "../util/dynamoUtil.js"

export async function dashboard (event, context){
    try{
        const user_id = event.requestContext.authorizer.claims['cognito:username'];
        const role = event.requestContext.authorizer.claims['custom:ROLE'];
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
        return successResponse(user);
    }catch(err) {
        console.log("Error add shortner url ", err);
        return badResponse({error: err.message});
    }
}