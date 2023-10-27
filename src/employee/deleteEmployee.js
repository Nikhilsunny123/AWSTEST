"use strict";

import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function deleteEmployee(event) {
  const client = new DynamoDBClient({});

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
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
