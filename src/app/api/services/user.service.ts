import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { User } from "src/app/models/user";
// Import the environment file to get prod or dev apiUrl
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'

})// See : https://angular.io/guide/http


export class UserService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    }),
    params: new HttpParams
  };

  constructor(private http: HttpClient) { }

  /** POST: add a new user to the API */
  addUser(user: User): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/users`, user, this.httpOptions).pipe(
      tap((newUser: User) => console.log(`Success : Added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('AddUser'))
    );
  }

  /** GET: load user info from the API */
  loadUserInfo(userId: string): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/users/${userId}`).pipe(
      tap((User: User) => console.log(`Success : Read user info w/ id=${User.id} , ${User.name}`)),
      catchError(this.handleError<User>('loadUserInfo'))
    );
  }

  /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`Error : ${operation} failed: ${error.message} / API info : ${error.error.name.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

