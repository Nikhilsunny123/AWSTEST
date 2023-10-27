"use strict";

import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function deleteEmployee(event) {

    // Create a DynamoDB client.
    const client = new DynamoDBClient({});
    // Create a DynamoDB Document Client from the base client.
    const dynamo = DynamoDBDocumentClient.from(client);
  
  try {
    let employeeID = event.pathParameters.employeeid;

    if (employeeID !== null) {
      const params = {
        TableName: process.env.TABLE_EMPLOYEE,
        Key: {
          PK: "employee",
          SK: employeeID,
        },
      };

      //check employee exist
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
        const deleteData = {
          TableName: process.env.TABLE_EMPLOYEE,
          Key: {
            PK: "employee",
            SK: employeeID,
          },
        };

        //delete the employee
        return dynamo
          .send(new DeleteCommand(deleteData))
          .then((data) => {
            console.log(data);
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "delete success",
              }),
            };
          })
          .catch((err) => {
            console.log(err);
            return {
              statusCode: 400,
              body: JSON.stringify({
                message: err,
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
