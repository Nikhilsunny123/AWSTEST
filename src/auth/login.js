"use strict";
import response from "../helpers/response.helper";
import { ddbDocClient } from "../helpers/ddbclient.helper";
import jwt from "jsonwebtoken";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export async function login(event) {
  try {
    const body = JSON.parse(event.body);

    if (body == null) {
      //check if a body is present
      return response(400, { message: "Bad Request" });
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
      return response(404, { message: "User not found" });
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
      return response(200, responseData);
    }
  } catch (err) {
    return response(400, {
      message: "network Error",
    });
  }
}
