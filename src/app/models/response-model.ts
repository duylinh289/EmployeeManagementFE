export class ResponseModel{
  public code : string;
  public message : string;
  constructor(code: string, mesage: string){
    this.code = code;
    this.message = mesage;
  }
}
