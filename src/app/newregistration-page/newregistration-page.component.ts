import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
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
  newRegError: boolean;

  constructor(private userService: UserService) {
    this.newUser = new User();
    this.newRegError = false;
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
      this.newRegError = false;
      console.warn(`User will be added with the API`);
      // Perform the add user request to the API.
      this.userService.addUser(this.newUser as User).subscribe(
        addUser => this.users.push(this.newUser)
      );
    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}