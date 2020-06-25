import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { User } from '../models/user';

@Component({
  selector: 'app-newregistration-page',
  templateUrl: './newregistration-page.component.html',
  styleUrls: ['./newregistration-page.component.scss']
})
export class NewregistrationPageComponent implements OnInit {
  newUser: User;
  newRegError: boolean;

  constructor() {
    this.newUser = new User() ;
    this.newRegError = false ;
   }

  ngOnInit(): void {
  }

 /**
   * Called when the login form is submitted.
   */
  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {
      // Hide any previous login error.
      this.newRegError = false; }
      else {
        console.warn(`Submit failed :`);

      }

      // Perform the add user request to the API.
      // this.auth.login(this.authRequest).subscribe({
      //   // Info JFS : In case of success
      //   next: () => this.router.navigateByUrl("/"),
      //   // Info JFS : In case of error
      //   error: (err) => {
      //     this.loginError = true;
      //     console.warn(`Authentication failed: ${err.message}`);
      //   },
      // });
  }
}