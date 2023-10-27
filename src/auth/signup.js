"use strict";

import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
export async function handler(event) {
  // Create a DynamoDB client.
  const client = new DynamoDBClient({});
  // Create a DynamoDB Document Client from the base client.
  const dynamo = DynamoDBDocumentClient.from(client);

  try {
    const body = JSON.parse(event.body);

    if (body == null) {
      //check if a body is present
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "bad request",
        }),
      };
    }

    if (body.email !== null) {
      const paramToCheck = {
        TableName: process.env.TABLE_USER,
        Key: {
          PK: "user",
          SK: body.email,
        },
      };

      //check user exist
      const existingUser = await dynamo.send(new GetCommand(paramToCheck));
      console.log("existingUser", existingUser);
      if (existingUser.Item !== undefined) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "Already exist",
          }),
        };
      } else {
        const insertData = {
          TableName: process.env.TABLE_USER,
          Item: {
            PK: "user",
            SK: body.email,
            password: body.password,
          },
        };
        //create new user
        await dynamo.send(new PutCommand(insertData));
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: "success",
          }),
        };
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
