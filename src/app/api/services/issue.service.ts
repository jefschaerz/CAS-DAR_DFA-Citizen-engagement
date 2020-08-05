import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Issue } from "src/app/models/issue";
import { catchError, map, tap } from 'rxjs/operators';
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";
import { AlertService } from '../../alerts/alerts.service';

@Injectable({
  providedIn: "root",
})
export class IssueService {

  constructor(private http: HttpClient, public alertService: AlertService) { }

  loadAllActions() {
    throw new Error("Method not implemented.");
  }

  loadAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.apiUrl}/issues`);
  }

  /** POST: add a new issue to the API */
  addIssue(issue: Issue): Observable<Issue> {
    return this.http.post<any>(`${environment.apiUrl}/issues`, issue).pipe(
      tap((issue: Issue) => console.log(`Success : Added issue w/ id=${issue.description}`)),

    )
  }
}
