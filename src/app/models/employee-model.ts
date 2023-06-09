export class EmployeeModel {
  public EmployeeCode: string;
  public EmployeeName : string;
  public Email : string;
  public Gender : boolean;
  public DateOfBirth : Date;
  public CreatedBy? : string;
  public CretedOn? : Date;
  public ModifiedBy? : string;
  public ModifiedOn? : Date;
  public Status? : number;

  constructor(
    EmployeeCode: string,
    EmployeeName: string,
    Email: string,
    Gender: boolean,
    DateOfBirth: Date,
    CreatedBy: string,
    CretedOn: Date,
    ModifiedBy: string,
    ModifiedOn: Date,
    Status: number
  ) {
    this.EmployeeCode = EmployeeCode;
    this.EmployeeName = EmployeeName;
    this.Email = Email;
    this.Gender = Gender;
    this.DateOfBirth = DateOfBirth;
    this.CreatedBy = CreatedBy;
    this.CretedOn = CretedOn;
    this.ModifiedBy = ModifiedBy;
    this.ModifiedOn = ModifiedOn;
    this.Status = Status;
  }
}
