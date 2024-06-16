import {
    signUpUser
} from "../util/cognitoUtil.js"
import{
  badResponse,
  successResponse,
  generateRandomString,
  createStats
} from "../util/common.js"
import { MATRIX_TYPE_USER, USER_ROLE_PRIME } from "../util/constants.js";
import {
  getRecord,
  insertRecord
} from "../util/dynamoUtil.js"

export async function signup (event, context){
    try{
        console.log("event ", event);
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.username || !input.password) throw new Error("username and password is required");
        const username = generateRandomString();
        const signUpParams = {
            ClientId: process.env.USER_POOL_CLIENT_ID,
            Username: username,
            Password: input.password,
            UserAttributes: [
              {
                Name: "email",
                Value: input.username
              },
              {
                Name: "custom:ROLE", // Custom attribute name
                Value: USER_ROLE_PRIME // Custom attribute value
              }
            ]
          };
        await signUpUser(signUpParams);
        const record = {
            TableName: process.env.SHORTNER_URLS_USERS_TABLE,
            Item: {
              unique_id: username,
              email: input.username,
              added_date: new Date().getTime(),
              total_url: 0,
              total_active: 0
            }
        };
        await insertRecord(record);
        let userStats = await getRecord({
          TableName: process.env.ADMIN_STATS_TABLE,
          Key: {
            matrix_type: MATRIX_TYPE_USER,
          }
        });
        if (!userStats) {
          userStats = {
            matrix_type: MATRIX_TYPE_USER
          }
        }
        createStats(userStats, "stats");
        await insertRecord({
          TableName: process.env.ADMIN_STATS_TABLE,
          Item: userStats
        });
        return successResponse({id: username, message: "signup success... please confirm using otp"});
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}