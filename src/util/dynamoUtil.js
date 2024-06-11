import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize the DynamoDB Client
const client = new DynamoDBClient({ region: "ap-south-1" });

// Function to insert the record
export async function insertRecord (record) {
  try {
    const command = new PutCommand(record);
    const response = await client.send(command);
    console.log("Record inserted successfully:", response);
  } catch (err) {
    console.log("error inserting record in db", err);
    throw new Error(err.message);
  }
};

export async function getRecord (input) {
    try {
      const command = new GetCommand(input);
      const response = await client.send(command);
      const record = response.Item;
      if (!record) throw new Error("url not found");
      return record;
    } catch (err) {
      console.log("Error retrieving record:", err);
      throw new Error(err.message)
    }
  };
