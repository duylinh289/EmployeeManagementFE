export class AddEditEmployeeModel {
  public EmployeeCode: string;
  public EmployeeName : string;
  public Email : string;
  public Gender : string;
  public DateOfBirth : Date;

  constructor(
    EmployeeCode: string,
    EmployeeName: string,
    Email: string,
    Gender: string,
    DateOfBirth: Date
  ) {
    this.EmployeeCode = EmployeeCode;
    this.EmployeeName = EmployeeName;
    this.Email = Email;
    this.Gender = Gender;
    this.DateOfBirth = DateOfBirth;
  }
}
