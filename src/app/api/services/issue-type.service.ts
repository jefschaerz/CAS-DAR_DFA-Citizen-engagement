import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IssueType } from "src/app/models/issue-type";

// DONE Insert here your personnal api URL
const apiUrl = "https://masrad-2020-ce-jean-francois.herokuapp.com/api";

@Injectable({
  providedIn: "root",
})
export class IssueTypeService {
  constructor(private http: HttpClient) {}

  loadAllIssueTypes(): Observable<IssueType[]> {
    // Fixed error API_URL
    return this.http.get<IssueType[]>(`${apiUrl}/issueTypes`);
  }
}