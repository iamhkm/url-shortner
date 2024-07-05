import { 
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GetUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  RespondToAuthChallengeCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import { generateCognitoPassword, generateRandomString } from "./common.js";
import { COGNITO_CUSTOM_AUTH_CHALLENGE, USER_POOL_CLIENT_ID, USER_POOL_ID, USER_ROLE_PRIME } from "./constants.js";

// Initialize the Cognito Client
const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

// Function to sign up the user
export async function signUpUser (signUpParams) {
  try {
    const command = new SignUpCommand(signUpParams);
    const response = await client.send(command);
    console.log("User signed up successfully:", response);
  } catch (error) {
    console.error("Error signing up user:", error);
    throw new Error(error.message);
  }
};

export async function authenticateUser(authParams) {
  try {
    const command = new InitiateAuthCommand(authParams);
    const response = await client.send(command);
    console.log("User authenticated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error(error.message);
  }
};

export async function getUserByToken(token){
  try {
    const command = new GetUserCommand({
      AccessToken: token
    });
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error(error.message);
  }
}

// Function to confirm user signup
export async function confirmUserSignup(confirmationParams) {
    try {
      const command = new ConfirmSignUpCommand(confirmationParams);
      const response = await client.send(command);
      console.log("User signup confirmed successfully:", response);
    } catch (error) {
      console.error("Error confirming user signup:", error);
      throw new Error(error.message);
    }
};

export async function adminCreateUser(username, email) {
  try {
      // Create the user with a temporary password
      const permanentPassword = generateCognitoPassword();
      const createUserParams = {
          UserPoolId: USER_POOL_ID,
          Username: username,
          UserAttributes: [
              { Name: "email",
                Value: email 
              },
              {
                Name: "custom:ROLE", // Custom attribute name
                Value: USER_ROLE_PRIME // Custom attribute value
              }
          ],
          TemporaryPassword: permanentPassword,
          MessageAction: "SUPPRESS"
      };
      await client.send(new AdminCreateUserCommand(createUserParams));
      // Set the user's permanent password
      const setPasswordParams = {
          UserPoolId: USER_POOL_ID,
          Username: username,
          Password: permanentPassword,
          Permanent: true
      };
      await client.send(new AdminSetUserPasswordCommand(setPasswordParams));
      // Verify user attributes
      const verifyAttributesParams = {
          UserPoolId: USER_POOL_ID,
          Username: username,
          UserAttributes: [
              { Name: "email_verified", Value: "true" },
          ]
      };
      await client.send(new AdminUpdateUserAttributesCommand(verifyAttributesParams));
  } catch (error) {
      console.log("error adding user into db ", error.message);
      throw new Error(error.message);
  }
}

export async function adminLoginOverride(email){
  try{
    const authParams = {
      AuthFlow: "CUSTOM_AUTH",
      ClientId: USER_POOL_CLIENT_ID, // Replace with your Cognito User Pool Client ID
      AuthParameters: {
        USERNAME: email, // User's email address
      }
    };
    const result = await authenticateUser(authParams);
    const params = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: USER_POOL_CLIENT_ID,
      Session: result.Session,
      ChallengeResponses: {
          USERNAME: email,
          ANSWER: COGNITO_CUSTOM_AUTH_CHALLENGE
      }
    };
    const command = new RespondToAuthChallengeCommand(params);
    const response = await client.send(command);
    return response;
  }catch(err){
    console.log("error in adminLoginOverride " ,err);
    throw new Error(err.message);
  }
}