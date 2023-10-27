"use strict";

import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function updateEmployee(event) {


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

      // Extract the employee ID from the path parameters.
      let employeeID = event.pathParameters.employeeid;

      // Parse the request body as JSON.
      const body = JSON.parse(event.body);
      console.log(body);

      // Check if the request body is null.
      if (body == null) {
          // Return a 400 status code with an error message.
          return {
              statusCode: 400,
              body: JSON.stringify({
                  message: " error",
              }),
          };
      }

    let value;
    try {
      value = await employeeSchema.validateAsync(body);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "validation error",
        }),
      };
    }
    if (employeeID !== null) {
      const params = {
        TableName: process.env.TABLE_EMPLOYEE,
        Key: {
          PK: "employee",
          SK: employeeID,
        },
      };
       // Retrieve the existing employee record from DynamoDB.
      const existingemployee = await dynamo.send(new GetCommand(params));

      console.log("existingemployee", existingemployee);
      if (existingemployee.Item === undefined) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "employee doesnt exist",
          }),
        };
      } else {
         // Define the data to be updated in DynamoDB.
        const insertData = {
          TableName: process.env.TABLE_EMPLOYEE,
          Key: {
            PK: "employee",
            SK: employeeID,
          },
          UpdateExpression:
            "set #employeeName=:employeeName,#employeePhoneNumber=:employeePhoneNumber",
          ExpressionAttributeNames: {
            "#employeeName": "employeeName",
            "#employeePhoneNumber": "employeePhoneNumber",
          },
          ExpressionAttributeValues: {
            ":employeeName": value.employeeName,
            ":employeePhoneNumber": value.employeePhoneNumber,
          },
          ReturnValues: "ALL_NEW",
        };
       // Update the employee data in DynamoDB using an UpdateCommand.
        return dynamo.send(new UpdateCommand(insertData)).then((data) => {
          console.log(data);
          return {
            statusCode: 200,
            body: JSON.stringify({
              data,
            }),
          };
        });
      }
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
