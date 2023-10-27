"use strict";

import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../helpers/ddbclient.helper";

export async function createEmployee(event) {
  try {
    const employeeSchema = Joi.object({
      employeeName: Joi.string().required(),
      employeePhoneNumber: Joi.string().required(),
    });

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
    console.log(value);
    if (value.employeeName !== null) {
      const insertData = {
        TableName: process.env.TABLE_EMPLOYEE,
        Item: {
          PK: "employee",
          SK: uuidv4(),
          employeeName: value.employeeName,
          employeePhoneNumber: employeePhoneNumber,
          createdAt: new Date().toISOString(),
        },
      };
      console.log("insertData", insertData);
      return ddbDocClient.send(new PutCommand(insertData)).then((data) => {
        console.log(data);
        return {
          statusCode: 200,
          body: JSON.stringify({
            data,
          }),
        };
      });
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
