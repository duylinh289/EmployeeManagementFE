export class ScoreCardModel {
  public SubjectId: number;
  public SubjectName : string;
  public StudentCode? : string;
  public RegularExam?: number;
  public MidtermExam?: number;
  public FinalExam?: number;
  public AvgScore?: number;

  constructor(
    SubjectId: number,
    SubjectName: string,
    StudentCode: string,
    RegularExam: number,
    MidtermExam: number,
    FinalExam: number,
    AvgScore: number,
  ) {
    this.SubjectId = SubjectId;
    this.SubjectName = SubjectName;
    this.StudentCode = StudentCode;
    this.RegularExam = RegularExam;
    this.MidtermExam = MidtermExam;
    this.FinalExam = FinalExam;
    this.AvgScore = AvgScore;
  }
}
