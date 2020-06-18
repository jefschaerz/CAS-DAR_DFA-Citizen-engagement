import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IssueComment } from "src/app/models/issue-comment";
// TODO Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class IssueCommentService {
  constructor(private http: HttpClient) {}

  loadAllIssueComments(): Observable<IssueComment[]> {
    // Fixed error API_URL
    // TODO To Adapt {id}
    return this.http.get<IssueComment[]>(`${environment.apiUrl}/issues/{id}Comments`);
  }
}
