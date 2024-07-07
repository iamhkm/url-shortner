import {
  adminDeleteUser,
  adminFindUserByEmail,
    resendConfirmationCode,
    signUpUser
} from "../util/cognitoUtil.js"
import{
  badResponse,
  successResponse,
  generateRandomString,
} from "../util/common.js"
import { USER_ROLE_PRIME } from "../util/constants.js";

export async function signup (event, context){
    try{
        const body = event.body;
        if (!body) throw new Error("request body can not be empty");
        const input = JSON.parse(body);
        if (!input.username || !input.password) throw new Error("username and password is required");
        const result = await adminFindUserByEmail(input.username);
        const username = generateRandomString();
        let addUser = true;
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
        for (let user of result){
          if (user.UserStatus === "CONFIRMED") {
            addUser = false;
            continue;
          }
          await adminDeleteUser(user.Username);
        }
        if (addUser === true){
          await signUpUser(signUpParams);
        }
        else throw new Error("user already exists");
        return successResponse({id: signUpParams.Username, message: "signup success... please confirm using otp"});
    }catch(err) {
        console.log("Error signing up user", err);
        return badResponse({error: err.message});
    }
}