export class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User with id ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

export class NotEnoughTokensError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotEnoughTokensError';
  }
}
