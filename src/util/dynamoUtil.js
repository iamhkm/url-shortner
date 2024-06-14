import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
      return record;
    } catch (err) {
      console.log("Error retrieving record:", err);
      throw new Error(err.message)
    }
};

export async function queryRecord(input){
  try {
    const command = new QueryCommand(input);
    const response = await client.send(command);
    return response.Items;
  } catch (err) {
    console.log("Error retrieving records:", err);
    throw new Error(err.message)
  }
}

export async function deleteRecord(input){
  try {
    const command = new DeleteCommand(input);
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.log("Error deleting record:", err);
    throw new Error(err.message)
  }
}
