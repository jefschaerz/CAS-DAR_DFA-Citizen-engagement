import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../security/auth.service";
import { switchMap, first, finalize, tap } from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: "root",
})
export class ApiTokenInterceptorService implements HttpInterceptor {
  count = 0;
  constructor(private injector: Injector,
    private spinner: NgxSpinnerService) {

  }


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve AuthService on method invocation from the Angular injector.
    // (Otherwise there would be a circular dependency:
    //  AuthInterceptorProvider -> AuthService -> HttpClient -> AuthInterceptorProvider).
    const auth = this.injector.get(AuthService);

    // Display spinner
    this.spinner.show()

    // Get the auth token, if any
    return auth.getToken().pipe(
      first(),
      switchMap((token) => {
        // If the token exists and the header does not...
        if (token && !req.headers.has("Authorization")) {
          // Clone the actual request and add it the header
          req = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${token}`),
          });
        }

        // Add counter of API for spinner purpose
        this.count++;
        // Process this updated request
        return next.handle(req)
          .pipe(tap(
            //event => console.log('Analyse Http Interceptor event', event),
            //error => console.log('Analyse Http Interceptor error', error)
          ),
            finalize(() => {
              this.count--;
              //console.log('Check if spinner to hide..', this.count)
              if (this.count == 0) this.spinner.hide()
            })
          );
      })
    );
  }
}