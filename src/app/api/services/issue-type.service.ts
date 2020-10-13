import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { IssueType } from "src/app/models/issue-type";
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class IssueTypeService {
  httpOptions = {
    headers: new HttpHeaders({
    }),
    params: new HttpParams,
  };
  constructor(private http: HttpClient) {

  }

  loadAllIssueTypes(): Observable<IssueType[]> {
    // Fixed error API_URL
    return this.http.get<IssueType[]>(`${environment.apiUrl}/issueTypes`);
  }

  loadIssueTypesByPage(page: number = 1, pageSize: number = 10): Observable<IssueType[]> {
    this.httpOptions.params = this.httpOptions.params.set('page', page.toString());
    this.httpOptions.params = this.httpOptions.params.set('pageSize', pageSize.toString());
    return this.http.get<IssueType[]>(`${environment.apiUrl}/issueTypes`, this.httpOptions);
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
    return (myIssuesTypes.find(issueType => issueType.href === searchHref))?.description;
  }

  // Add a new comment object to the issue.
  addIssueType(myIssueType: IssueType): Observable<IssueType> {
    return this.http.post<any>(`${environment.apiUrl}/issueTypes`, myIssueType).pipe(
      tap((issueType: IssueType) => console.log(`Success : Issue Type added:`, issueType)),
    )
  }


}