import {
    signUpUser
} from "../util/cognitoUtil.js"
import{
  badResponse,
  successResponse
} from "../util/common.js"
import {
  insertRecord
} from "../util/dynamoUtil.js"
import { v4 as uuidv4 } from 'uuid';

export async function signup (event, context){
    try{
        console.log("event ", event);
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.username || !input.password) throw new Error("username and password is required");
        const username = uuidv4();
        const signUpParams = {
            ClientId: process.env.client_id,
            Username: username,
            Password: input.password,
            UserAttributes: [
              {
                Name: "email",
                Value: input.username
              },
              {
                Name: "custom:ROLE", // Custom attribute name
                Value: "BASIC" // Custom attribute value
              }
            ]
          };
        await signUpUser(signUpParams);
        const record = {
            TableName: "shorten-urls-users",
            Item: {
              uuid: username,
              email: input.username,
              role: "BASIC",
              added_date: new Date().getTime()
            }
        };
        await insertRecord(record);
        return successResponse({id: username});
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}