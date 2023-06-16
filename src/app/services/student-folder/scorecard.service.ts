import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from '../../models/response-model';
import { map } from 'rxjs/operators';
import { UserApiService } from '../user-api.service';
import { SubjectModel } from 'src/app/models/subject-model';
import { ScoreCardModel } from 'src/app/models/scorecard-model';

@Injectable({
  providedIn: 'root',
})
export class ScorecardService {
  constructor(private http: HttpClient, private service: UserApiService) {}

  readonly token = this.service.GetToken();
  readonly reqHeader = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.token,
  });

  GetSubject(studentcode: string): Observable<ScoreCardModel[]> {
    return this.http.get<ScoreCardModel[]>(
      `${environment.apiUrl}/Students/GetScoreCard?studentcode=${studentcode}`
    );
  }

  Registry(subjectid: number, studentcode: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Students/AddSubject?subjectid=${subjectid}&studentid=${studentcode}`,
      null,
      { headers: this.reqHeader }
    );
  }

  Remove(
    subjectid: number,
    studentcode: string
  ): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Students/RemoveSubject?subjectid=${subjectid}&studentid=${studentcode}`,
      null,
      { headers: this.reqHeader }
    );
  }

  EditScore( req: ScoreCardModel
  ): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${environment.apiUrl}/Students/EditScore`,
      req,
      { headers: this.reqHeader }
    );
  }

  GetSubjectOut(subjectid: string): Observable<ScoreCardModel[]> {
    return this.http.get<ScoreCardModel[]>(
      `${environment.apiUrl}/Students/GetSubject?subjectid=${subjectid}`
    );
  }
}
