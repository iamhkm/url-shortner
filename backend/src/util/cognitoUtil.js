import { 
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

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
    console.log("User authenticated successfully:", response.AuthenticationResult);
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