import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from '../models/user';
import { UserService } from '../api/services/user.service';

@Component({
  selector: 'app-newregistration-page',
  templateUrl: './newregistration-page.component.html',
  styleUrls: ['./newregistration-page.component.scss']
})
export class NewregistrationPageComponent implements OnInit {
  users: User[];
  newUser: User;
  newUserIsCitizen: boolean;
  newUserIsStaff: boolean;
  newRegError: boolean;

  constructor(private userService: UserService, private router: Router) {
    this.newUser = new User();
    this.newRegError = false;
    this.newUserIsCitizen = false;
    this.newUserIsStaff = false;
    // Provide default for TEST
    this.newUser.name = 'UserX';
    this.newUser.firstname = 'FirstnameX';
    this.newUser.lastname = 'LastnameX';
    this.newUser.password = 'UserX';
  }

  ngOnInit(): void {
  }

  // TODO: Not working
  get diagnostic() { return JSON.stringify(this.newUser); }


  goToLogin() {
    console.log('Move to new login page')
    this.router.navigate(['/login']);
  }
  /**
    * Called when the login form is submitted.
    */
  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {
      // Hide any previous login error.
      this.newRegError = false;
      // TODO : Adapt newUser oject with roles information
      if (this.newUserIsCitizen) {
        console.log('Citizen checked');
        //Working : this.newUser.roles = ["citizen"];
        this.newUser.roles.push("citizen");
      }
      if (this.newUserIsStaff) {
        console.log('Staff checked');
        this.newUser.roles = ["staff"];
      }
      console.warn(`User will be added with the API`);
      console.log(this.newUser);
      console.log('API CALL disabled because user cannot be then deleted');
      // Perform the add user request to the API.
      // this.userService.addUser(this.newUser as User).subscribe(
      //   addUser => this.users.push(this.newUser)
      // );
    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}