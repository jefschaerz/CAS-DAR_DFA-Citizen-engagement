import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { IssueTypeService } from '../../api/services/issue-type.service';
import { Issue } from 'src/app/models/issue';
import { IssueType } from 'src/app/models/issue-type';

@Component({
  selector: 'app-manageissue',
  templateUrl: './manageissue.component.html',
  styleUrls: ['./manageissue.component.scss']
})
export class ManageissueComponent implements OnInit {
  issues: Issue[];
  newissue: Issue;
  issueTypes: IssueType[];
  newIssueError: boolean;

  constructor(private issueTypeService: IssueTypeService, private router: Router) {
    this.newissue = new Issue();
  }

  ngOnInit(): void {
  }

  goToAllIssues() {
    console.log('Move to see all issues')
    this.router.navigate(['/seeissues']);
  }

  getTypesOfIssue() {
    // Ask service for the list of current type of issues defined
    // Perform the add user request to the API.

    //TODO : Save list os issue correctly in array !!
    // Check Jokes code
    this.issueTypeService.loadAllIssueTypes().subscribe(
      receivedIssueTypes => console.log(receivedIssueTypes)
      // receivedIssueTypes => this.issueTypes = receivedIssueTypes
    );


    console.warn(`Issue will be ask by the API`);
    console.log("IssueTypes : ", this.issueTypes);
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
