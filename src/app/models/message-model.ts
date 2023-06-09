
export class Message{
  public from : string;
  public to? : string;
  public content: string;
  public time?: string;
  constructor(From: string, To: string, Content: string, time: string){
    this.from = From,
    this.to = To,
    this.content = Content,
    this.time = time
  }
}
