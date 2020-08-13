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

  loadOneIssue(issueId): Observable<Issue> {
    return this.http.get<Issue>(`${environment.apiUrl}/issues/${issueId}`);
  }

  /** POST: add a new issue by the API */
  addIssue(issue: Issue): Observable<Issue> {
    return this.http.post<any>(`${environment.apiUrl}/issues`, issue).pipe(
      tap((issue: Issue) => console.log(`Success : Added issue w/ id=${issue.description}`)),

    )
  }

  /** PATCH: update an issue with the API */
  updateIssue(issue: Issue): Observable<Issue> {
    return this.http.patch<any>(`${environment.apiUrl}/issues/${issue.id}`, issue).pipe(
      tap((issue: Issue) => console.log(`Success : Updated issue w/ id=${issue.description}`)),
    )
  }

  /** DELTE: delete an issue by the API */
  deleteIssue(issue: Issue): Observable<Issue> {
    console.log(`Success : Delete issue w / id=${issue.description}`);
    return this.http.delete<any>(`${environment.apiUrl}/issues/${issue.id}`);
  }
}
