export class ImportEmployeeModel {
  public EmployeeName : string;
  public Email : string;
  public Gender : string;
  public DateOfBirth : Date;
  public Error?: string;

  constructor(
    EmployeeName: string,
    Email: string,
    Gender: string,
    DateOfBirth: Date,
    Err: string,

  ) {
    this.EmployeeName = EmployeeName;
    this.Email = Email;
    this.Gender = Gender;
    this.DateOfBirth = DateOfBirth;
    this.Error = Err;
  }
}
