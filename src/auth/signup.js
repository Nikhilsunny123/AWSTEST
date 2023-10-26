"use strict";
import Joi from "joi";
import response from "../helpers/response.helper";
import { ddbDocClient } from "../helpers/ddbclient.helper";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
export async function handler(event) {
  try {
    // Validate the JSON body
    const signUpSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().min(10).required(),
    });
    const body = JSON.parse(event.body);

    if (body == null) {
      //check if a body is present
      return response(400, { error: "Bad Request" });
    }
    let value;
    try {
      value = await signUpSchema.validateAsync(body);
    } catch (err) {
      return response(500, { message: err.details });
    }

    if (value.email !== null) {
      const paramToCheck = {
        TableName: process.env.TABLE_USER,
        Key: {
          PK: "user",
          SK: value.email,
        },
      };
      const existingUser = await ddbDocClient.send(
        new GetCommand(paramToCheck)
      );
      console.log("existingUser", existingUser);
      if (existingUser.Item !== undefined) {
        return response(500, { message: "aleadry exist" });
      } else {
        const insertData = {
          TableName: process.env.TABLE_USER,
          Item: {
            PK: "user",
            SK: value.email,
            password: password,
          },
        };
        await ddbDocClient.send(new PutCommand(insertData));
        return response(200, { data: "sign up success" });
      }
    }
  } catch (error) {
    return response(400, {
      message: error,
    });
  }
}
