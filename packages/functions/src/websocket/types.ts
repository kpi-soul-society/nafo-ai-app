export interface AccessToken {
  /**
   * user id from the DB
   */
  userId: string;

  /**
   * token expiration time in seconds
   */
  exp: number;
}

export interface AuthorizerContext {
  /**
   * user id in the DB
   */
  userId: string;

  /**
   * Cognito username
   */
  principalId: string;
}
