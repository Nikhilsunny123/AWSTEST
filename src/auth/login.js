"use strict";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export async function login(event) {

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
    const params = {
      TableName: process.env.TABLE_USER,
      Key: {
        SK: body.email,
        PK: "user",
      },
    };

    //check user exist 
    const user = await dynamo.send(new GetCommand(params));
    if (user.Item == undefined) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User not found",
        }),
      };
    }
    console.log(user,user.Item.password == body.password);

    //verify the password
    if (user.Item.password == body.password) {
      const secret = "test";
      const params = { email: user.Item.SK, role: "user" };
      console.log(params);
      const token = jwt.sign({ params }, secret, { expiresIn: "60 days" });
      const responseData = {
        message: "Verification successful",
        email: body.email,
        role: "user",
        token: token,
      };
      return {
        statusCode: 200,
        body: JSON.stringify({
          responseData,
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "wrong password",
        }),
      };
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
