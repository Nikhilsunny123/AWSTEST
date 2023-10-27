"use strict";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export async function getEmployees() {
  // Create a DynamoDB client.
  const client = new DynamoDBClient({});
  // Create a DynamoDB Document Client from the base client.
  const dynamo = DynamoDBDocumentClient.from(client);

  try {
    const params = {
      TableName: process.env.TABLE_EMPLOYEE,
      KeyConditionExpression: "#PK = :PK",
      ExpressionAttributeNames: {
        "#PK": "PK", // Define the attribute name placeholders in the query.
      },
      ExpressionAttributeValues: {
        ":PK": "employee", // Define the attribute values for the query.
      },
    };

    console.log(params);
    // Send the query command to DynamoDB using the Document Client.
    const employeees = await dynamo.send(new QueryCommand(params));
    // Return a success response with a 200 status code and the retrieved data.
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: employeees,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
