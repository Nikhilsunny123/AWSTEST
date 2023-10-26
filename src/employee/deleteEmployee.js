"use strict";
import response from "../../helpers/response.helper";
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
        return response(500, { message: "employee doesn't exist" });
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
            return response(200, { message: "Deleted succesfully" });
          })
          .catch((err) => {
            console.log(err);
            return response(500, { message: err });
          });
      }
    }
  } catch (error) {
    return response(400, {
      message: { message: error },
    });
  }
}
