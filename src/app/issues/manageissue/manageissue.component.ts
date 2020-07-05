import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-manageissue',
  templateUrl: './manageissue.component.html',
  styleUrls: ['./manageissue.component.scss']
})
export class ManageissueComponent implements OnInit {
  issues: Issue[];
  newissue: Issue;
  newIssueError: boolean;

  constructor(private router: Router) {
    this.newissue = new Issue();

  }

  ngOnInit(): void {
  }

  goToAllIssues() {
    console.log('Move to see all issues')
    this.router.navigate(['/seeissues']);
  }

  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {
      console.warn(`Issue will be added with the API`);
      console.log(this.newissue);
    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}
