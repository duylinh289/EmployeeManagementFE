export class TaskNotifyModel {
  public username: string;
  public task: string;

  constructor(username: string, task: string) {
    this.username = username;
    this.task = task;
  }
}
