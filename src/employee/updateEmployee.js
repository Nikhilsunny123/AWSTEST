"use strict";
import response from "../../helpers/response.helper";
import Joi from "joi";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../helpers/ddbclient.helper";

export async function updateEmployee(event) {
  try {
    const employeeSchema = Joi.object({
      employeeName: Joi.string().required(),
      employeePhoneNumber: Joi.string().required(),
    });
    let employeeID = event.pathParameters.employeeid;

    const body = JSON.parse(event.body);
    console.log(body);
    if (body == null) {
      return response(400, { message: "Bad request" });
    }

    let value;
    try {
      value = await employeeSchema.validateAsync(body);
    } catch (err) {
      return response(500, { message: "validation error" });
    }
    if (employeeID !== null) {
      const params = {
        TableName: process.env.TABLE_EMPLOYEE,
        Key: {
          PK: "employee",
          SK: employeeID,
        },
      };
      const existingemployee = await ddbDocClient.send(new GetCommand(params));

      console.log("existingemployee", existingemployee);
      if (existingemployee.Item === undefined) {
        return response(500, { message: "employee doesn't exist" });
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
        return ddbDocClient.send(new UpdateCommand(insertData)).then((data) => {
          console.log(data);
          return response(200, data);
        });
      }
    }
  } catch (error) {
    return response(400, {
      message: error,
    });
  }
}
