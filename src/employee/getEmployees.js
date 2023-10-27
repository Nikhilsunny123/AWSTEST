"use strict";
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: employeees,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
}
