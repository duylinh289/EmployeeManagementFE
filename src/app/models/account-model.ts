export class AccountModel {
  public UserName: string;
  public Email: string;
  public Role: string;

  constructor(username: string, email: string, role: string) {
    this.UserName = username;
    this.Email = email;
    this.Role = role;
  }
}
