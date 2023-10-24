export interface ApiGatewaySqsEvent {
  Records: {
    body: string;
    messageId: string;
    messageAttributes: object;
  }[];
}

export interface UserPoolAuthorizerRequestContext {
  jwt: {
    claims: {
      username: string;
    };
  };
}
