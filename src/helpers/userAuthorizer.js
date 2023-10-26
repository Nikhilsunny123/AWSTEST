"use strict";

import JWT from "jsonwebtoken";
import buildIAMPolicy from "./buildIAMPolicy";

export async function userAuthorizer(event) {
  const bearerToken = event.authorizationToken;
  const token = bearerToken.split(" ")[1];
  console.log(JSON.stringify(event));
  try {
    // Verify JWT
    const decoded = JWT.verify(token, "test");

    const user = decoded.params;

    let effect="Deny";
    if (user.role === "user") {
      effect = "Allow";
    }

    const userId = user.email;

    const authorizerContext = { user: JSON.stringify(user) };
    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(
      userId,
      effect,
      event.methodArn,
      authorizerContext
    );
    return policyDocument;
  } catch (e) {
    return "Unauthorized";
  }
}
