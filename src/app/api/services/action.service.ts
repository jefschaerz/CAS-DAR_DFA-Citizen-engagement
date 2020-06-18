import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Action } from "src/app/models/action";
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(private http: HttpClient) {}

  loadAllActions(): Observable<Action[]> {
    return this.http.get<Action[]>(`${environment.apiUrl}/Actions`);
  }
}
