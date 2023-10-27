"use strict";
import Joi from "joi";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../helpers/ddbclient.helper";
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
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "bad request",
        }),
      };
    }
    let value;
    try {
      value = await signUpSchema.validateAsync(body);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "validation error",
        }),
      };
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
            SK: value.email,
            password: password,
          },
        };
        await ddbDocClient.send(new PutCommand(insertData));
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
