import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Issue } from "src/app/models/issue";
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class IssueService {
  loadAllActions() {
    throw new Error("Method not implemented.");
  }
  constructor(private http: HttpClient) {}

  loadAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.apiUrl}/issues`);
  }
}
