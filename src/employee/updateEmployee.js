"use strict";

import Joi from "joi";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function updateEmployee(event) {

  const client = new DynamoDBClient({});

  const dynamo = DynamoDBDocumentClient.from(client);

  try {
    const employeeSchema = Joi.object({
      employeeName: Joi.string().required(),
      employeePhoneNumber: Joi.string().required(),
    });
    let employeeID = event.pathParameters.employeeid;

    const body = JSON.parse(event.body);
    console.log(body);
    if (body == null) {
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
            ":employeePhoneNumber": employeePhoneNumber,
          },
          ReturnValues: "ALL_NEW",
        };
        console.log("insertData", insertData);
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
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
