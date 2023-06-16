export class SeachStudentModel {
  public Student?: string;
  public Class? : string;
  public Rank? : string;

  constructor(
    Student: string,
    Class: string,
    Rank: string,
  ) {
    this.Student = Student;
    this.Class = Class;
    this.Rank = Rank;
  }
}
