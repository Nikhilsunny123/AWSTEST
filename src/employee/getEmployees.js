"use strict";
import response from "../../helpers/response.helper";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../helpers/ddbclient.helper";

export async function getemployeees() {
  try {
    const params = {
      TableName: process.env.TABLE_EMPLOYEE,
      KeyConditionExpression: "#PK = :PK",
      ExpressionAttributeNames: {
        "#PK": "PK",
      },
      ExpressionAttributeValues: {
        ":PK": "employee",
      },
    };

    const employeees = await ddbDocClient.send(new QueryCommand(params));
    return response(200, { data: employeees });
  } catch (error) {
    return response(400, {
      message: error,
    });
  }
}
