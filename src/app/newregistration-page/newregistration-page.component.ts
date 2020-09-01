import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from '../models/user';
import { UserService } from '../api/services/user.service';
import { environment } from "../../environments/environment";
//import { format } from 'path';
import { AlertService } from 'src/app/alerts/alerts.service';

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
  atLeastOneRole: boolean;
  REGEXP_AlphaNumeric = environment.alphaNumericPattern;

  constructor(private userService: UserService,
    private router: Router,
    public alertService: AlertService) {
    this.newUser = new User();
    this.newUser.roles = [];
    this.newRegError = false;
    // By default Citizen
    this.newUserIsCitizen = true;
    this.atLeastOneRole = true;
    this.newUserIsStaff = false;
  }

  ngOnInit(): void {

  }

  CheckboxCitizenChange() {
    if (this.newUserIsCitizen || this.newUserIsStaff) {
      this.atLeastOneRole = true
      console.log('One ! ')
    }
    else {
      this.atLeastOneRole = false;
      console.log('No one ! ')
    }
  }

  goToLogin() {
    console.log('Move to new login page')
    this.router.navigate(['/login']);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Hide any previous login error.
      this.newRegError = false;
      //TODO Improvement : Check in Valid form (and disable Create button)
      if (!this.atLeastOneRole) {
        this.alertService.error('Please check at least one role. ', {
          autoClose: true,
          keepAfterRouteChange: true
        });
      }
      else {
        if (this.newUserIsCitizen) {
          console.log('Citizen checked');
          this.newUser.roles.push("citizen");
        }
        if (this.newUserIsStaff) {
          console.log('Staff checked');
          this.newUser.roles.push("staff");
        }
        console.warn(`User will be added with the API`);
        console.log(this.newUser);
        //Perform the add user request to the API.
        this.userService.addUser(this.newUser as User).subscribe({
          error: (error) => this.alertService.error('An error occurs during your registration. ', error),
          complete: () => {
            this.alertService.success('Your registration has been completed correctly', {
              autoClose: true,
              keepAfterRouteChange: true
            })
            this.goToLogin();
          }
        });
      }
    }
    else {
      console.warn(`Submit failed :`);
    }
  }
}