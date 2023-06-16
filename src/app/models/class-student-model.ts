export class ClassStudentModel {
  public ClassId: number;
  public ClassName : string;
  public Description? : string;
  public Grade? : number;
  public CountStudents? : number;

  constructor(
    ClassName: string,
    ClassId: number,
    Description: string,
    Grade: number,
    CountStudents: number,
  ) {
    this.ClassName = ClassName;
    this.ClassId = ClassId;
    this.Description = Description;
    this.Grade = Grade;
    this.CountStudents = CountStudents;
  }
}
