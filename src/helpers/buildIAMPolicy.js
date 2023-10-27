const buildIAMPolicy = (userId, effect, context) => {
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: "*",
          },
        ],
      },
      context,
    };
  
    return policy;
}

export default buildIAMPolicy;