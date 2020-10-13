import { Component, OnInit } from "@angular/core";
import { AuthRequest } from "src/app/models/auth-request";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AlertService } from '../../alerts/alerts.service';
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  /**
   * This authentication request object will be updated when the user
   * edits the login form. It will then be sent to the API.
   */
  authRequest: AuthRequest;

  /**
   * If true, it means that the authentication API has return a failed response
   * (probably because the name or password is incorrect).
   */
  loginError: boolean;
  REGEXP_AlphaNumeric = environment.alphaNumericPattern;

  constructor(private auth: AuthService,
    private router: Router,
    public alertService: AlertService) {
    this.authRequest = new AuthRequest();
    this.loginError = false;
  }

  goToNewRegistration() {
    this.router.navigate(['/newregistration']);
  }

  /**
   * Called when the login form is submitted.
   */
  onSubmit(form: NgForm) {
    if (form.valid) {
      // Hide any previous login error.
      this.loginError = false;
      this.alertService.clear();
      // Perform the authentication request to the API.
      this.auth.login(this.authRequest).subscribe({
        // In case of success
        next: () => {
          this.router.navigateByUrl("/seeissues");
        },
        // In case of error
        error: (err) => {
          this.loginError = true;
          console.warn(`Authentication failed: ${err.message}`);
          this.alertService.error('An error occurs during the login. Try again', [true, false]);
        },
      });
    }
  }
}