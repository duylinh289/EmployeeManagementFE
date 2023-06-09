export class DeleteEmployeeModel {
  public EmployeeCode: string;
  public EmployeeName : string;

  constructor(
    EmployeeCode: string,
    EmployeeName: string,
  ) {
    this.EmployeeCode = EmployeeCode;
    this.EmployeeName = EmployeeName;
  }
}
