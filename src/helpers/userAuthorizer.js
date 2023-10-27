"use strict";

import JWT from "jsonwebtoken";

export async function userAuthorizer(event) {
  const bearerToken = event.authorizationToken;
  const token = bearerToken.split(" ")[1];
  console.log(JSON.stringify(event));
  console.log(token);
  try {
    // Verify JWT
    const decoded = JWT.verify(token, "test");

    const user = decoded.params;

    let effect = "Deny";
    if (user.role === "user") {
      effect = "Allow";
    }

    const userId = user.email;

   
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: "*",
          },
        ],
      },
    };
    const policyDocument = policy;
    console.log(policyDocument);
    return policyDocument;
  } catch (e) {
    return "Unauthorized";
  }
}
