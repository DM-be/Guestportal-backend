export class AdminUserDoesNotExistError {
  public message: string;

  constructor() {
    this.message = 'user does not exist';
  }
}
