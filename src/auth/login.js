"use strict";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../helpers/ddbclient.helper";

export async function login(event) {
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

    const user = await ddbDocClient.send(new GetCommand(params));
    if (user.Item == undefined) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User not found",
        }),
      };
    } else {
      const secret = "test";
      const params = { email: user.Item.SK, password: user.Item.PK };
      console.log(params);
      const token = jwt.sign({ params }, secret, { expiresIn: "60 days" });
      const responseData = {
        message: "Verification successful",
        email: body.email,
        token: token,
      };
      return {
        statusCode: 404,
        body: JSON.stringify({
          responseData,
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
