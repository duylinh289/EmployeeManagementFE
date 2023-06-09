export class TaskModel {
  public Id: number;
  public TaskName: string;
  public TaskDescription: string;
  public Assignee: string;
  public AssigneeName : string;
  public Reporter: string;

  constructor(Id: number, TaskName: string, TaskDescription: string, Assignee: string, AssigneeName: string, Reporter: string) {
    this.Id = Id;
    this.TaskName = TaskName;
    this.TaskDescription = TaskDescription;
    this.Assignee = Assignee;
    this.AssigneeName = AssigneeName;
    this.Reporter = Reporter;
  }
}
