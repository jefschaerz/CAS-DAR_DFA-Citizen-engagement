import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IssueType } from "src/app/models/issue-type";
// TODO Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

// DONE Insert here your personnal api URL
// REMOVED const apiUrl = "https://masrad-2020-ce-jean-francois.herokuapp.com/api";

@Injectable({
  providedIn: "root",
})
export class IssueTypeService {
  constructor(private http: HttpClient) {}

  loadAllIssueTypes(): Observable<IssueType[]> {
    // Fixed error API_URL
    return this.http.get<IssueType[]>(`${environment.apiUrl}/issueTypes`);
  }
}