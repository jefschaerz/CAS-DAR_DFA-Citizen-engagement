import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { User } from "src/app/models/user";
import { MessagesService } from '../../messages/messages.service';
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

  constructor(private http: HttpClient,
    private messageService: MessagesService) { }
  /** GET: get list of all users (staff only) to the API */
  //  getUser(): Observable<User> {
  //   return this.http.get<User>(`${environment.apiUrl}/users`, this.httpOptions).pipe(
  //     map(this.log(`Success : List of users`)),
  //     catchError(this.handleError<User>('GetUsers'))
  //   );
  // }

  /** POST: add a new user to the API */
  addUser(user: User): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/users`, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`Success : Added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('AddUser'))
    );
  }

  /** POST: load user info from the API */
  loadUserInfo(userId: string): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/users/${userId}`).pipe(
      tap((User: User) => this.log(`Success : Read user info w/ id=${User.id} , ${User.name}`)),
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
      this.log(`Error : ${operation} failed: ${error.message} / API info : ${error.error.name.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a UserService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`UserService: ${message}`);
  }
}

