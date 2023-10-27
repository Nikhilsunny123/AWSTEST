"use strict";

import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../helpers/ddbclient.helper";

export async function deleteEmployee(event) {
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
      const existingemployee = await ddbDocClient.send(new GetCommand(params));
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
        return ddbDocClient
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
