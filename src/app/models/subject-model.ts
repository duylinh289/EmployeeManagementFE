export class SubjectModel {
  public SubjectId?: number;
  public SubjectName : string;
  public Description? : string;
  public CreatedBy? : string;
  public CretedOn? : Date;
  public ModifiedBy? : string;
  public ModifiedOn? : Date;
  public Status? : number;

  constructor(
    SubjectId: number,
    SubjectName: string,
    Description: string,
    CreatedBy: string,
    CretedOn: Date,
    ModifiedBy: string,
    ModifiedOn: Date,
    Status: number
  ) {
    this.SubjectId = SubjectId;
    this.SubjectName = SubjectName;
    this.Description = Description;
    this.CreatedBy = CreatedBy;
    this.CretedOn = CretedOn;
    this.ModifiedBy = ModifiedBy;
    this.ModifiedOn = ModifiedOn;
    this.Status = Status;
  }
}
