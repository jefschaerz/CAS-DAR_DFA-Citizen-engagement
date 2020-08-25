import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IssueComment } from "src/app/models/issue-comment";
import { tap } from 'rxjs/operators';
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IssueCommentService {
  constructor(private http: HttpClient) { }

  loadIssueComments(id: string): Observable<IssueComment[]> {
    return this.http.get<IssueComment[]>(`${environment.apiUrl}/issues/${id}/Comments`);
  }

  // Add a new comment object to the issue.
  addCommentToIssue(issueId: string, myComment: IssueComment): Observable<IssueComment> {
    return this.http.post<any>(`${environment.apiUrl}/issues/${issueId}/Comments`, myComment).pipe(
      tap((comment: IssueComment) => console.log(`Success : Comment added to issue:`, comment)),

    )
  }
}
