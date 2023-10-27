"use strict";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

export async function getemployeees() {

  const client = new DynamoDBClient({});

  const dynamo = DynamoDBDocumentClient.from(client);

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

    const employeees = await dynamo.send(new QueryCommand(params));
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
