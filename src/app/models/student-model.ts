export class StudentModel {
  public StudentCode: string;
  public StudentName : string;
  public CreatedBy? : string;
  public CretedOn? : Date;
  public ModifiedBy? : string;
  public ModifiedOn? : Date;
  public Status? : number;
  public ClassName? : string;
  public AvgScore? : number;
  public Ranked? : string;

  constructor(
    StudentCode: string,
    StudentName: string,
    CreatedBy: string,
    CretedOn: Date,
    ModifiedBy: string,
    ModifiedOn: Date,
    Status: number,
    ClassName: string,
    AvgScore: number,
    Ranked: string
  ) {
    this.StudentCode = StudentCode;
    this.StudentName = StudentName;
    this.CreatedBy = CreatedBy;
    this.CretedOn = CretedOn;
    this.ModifiedBy = ModifiedBy;
    this.ModifiedOn = ModifiedOn;
    this.Status = Status;
    this.AvgScore = AvgScore;
    this.Ranked = Ranked;
    this.ClassName = ClassName;
  }
}
