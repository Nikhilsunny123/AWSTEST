"use strict";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export async function createEmployee(event) {
  // Create a DynamoDB client.
  const client = new DynamoDBClient({});
  // Create a DynamoDB Document Client from the base client.
  const dynamo = DynamoDBDocumentClient.from(client);

  try {
    // Define a schema for validating the request body using Joi.
    const employeeSchema = Joi.object({
      employeeName: Joi.string().required(),
      employeePhoneNumber: Joi.string().required(),
    });

    const body = JSON.parse(event.body);
    console.log(body);

    let value;
    try {
      // Validate the request body against the schema.
      value = await employeeSchema.validateAsync(body);
    } catch (err) {
      // If validation fails, return a 500 status code with an error message.
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "validation error",
        }),
      };
    }
    console.log(value);
    if (value.employeeName !== null) {
      // Define the data to be inserted into DynamoDB.
      const insertData = {
        TableName: process.env.TABLE_EMPLOYEE,
        Item: {
          PK: "employee",
          SK: uuidv4(),
          employeeName: value.employeeName,
          employeePhoneNumber: value.employeePhoneNumber,
          createdAt: new Date().toISOString(),
        },
      };
      console.log("insertData", insertData);
      return dynamo.send(new PutCommand(insertData)).then((data) => {
        console.log(data);
        // Return a success response with a 200 status code and the inserted data.
        return {
          statusCode: 200,
          body: JSON.stringify({
            data,
          }),
        };
      });
    }
  } catch (error) {
    // If any other error occurs, return a 400 status code with an error message.
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
