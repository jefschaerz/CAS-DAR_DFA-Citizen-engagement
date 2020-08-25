import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IssueType } from "src/app/models/issue-type";
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class IssueTypeService {
  constructor(private http: HttpClient) { }

  loadAllIssueTypes(): Observable<IssueType[]> {
    // Fixed error API_URL
    return this.http.get<IssueType[]>(`${environment.apiUrl}/issueTypes`);
  }

  loadOneIssueTypes(id: string): Observable<IssueType> {
    // Fixed error API_URL
    return this.http.get<IssueType>(`${environment.apiUrl}/issueTypes/${id}`)
  }

  // Search for href of select issuetype description
  getIssueTypeHrefFromDescription(myIssuesTypes: IssueType[], searchDescription: string): string {
    console.log('Description used : ', searchDescription);
    return (myIssuesTypes.find(issueType => issueType.description === searchDescription)).href;
  }

  // Search for description of select issuetype href 
  getIssueDescriptionFromTypeHref(myIssuesTypes: IssueType[], searchHref: string): string {
    //TODO called to often : find why
    //console.log('Href used : ', searchHref);
    return (myIssuesTypes.find(issueType => issueType.href === searchHref)).description;
  }
}