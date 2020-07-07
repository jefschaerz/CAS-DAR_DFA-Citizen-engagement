import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { IssueTypeService } from '../../api/services/issue-type.service';
import { Issue } from 'src/app/models/issue';
import { IssueType } from 'src/app/models/issue-type';
import { Location } from 'src/app/models/location';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-manageissue',
  templateUrl: './manageissue.component.html',
  styleUrls: ['./manageissue.component.scss']
})
export class ManageissueComponent implements OnInit {
  issues: Issue[];
  newIssue: Issue;
  newLocation: Location;
  issueTypes: IssueType[];
  newIssueError: boolean;
  selectedIssueTypeDescription: string;
  // Renan coordinates
  currentLocationLat: number = 47.125058;
  currentLocationLong: number = 6.932254;

  constructor(private issueTypeService: IssueTypeService, private router: Router) {
    this.newIssue = new Issue();
    this.newIssue.description = 'New issue from App by JFS';
    this.newIssue.imageUrl = '';
    this.newIssue.additionalImageUrls = [];
    this.newLocation = new Location();
    this.newIssue.location = this.newLocation;
    this.newLocation.coordinates = { latitude: 0, longitude: 0 };
    //this.newissue.location.coordinates = [0 , 0];
    //this.renanLocation = { "Point" , { 47.125058, 6.932254 };

  }

  ngOnInit(): void {
    //Retrieve current list of issueTypes
    this.getTypesOfIssue();
  }

  goToAllIssues() {
    console.log('Move to see all issues')
    this.router.navigate(['/seeissues']);
  }

  onIssueTypeSelected(value: string) {
    this.selectedIssueTypeDescription = value;
    console.log("The selected value is : " + value);
  }
  // Search for href of select issuetype
  getIssueTypeHrefFromDescription(searchDescription: string): string {
    console.log('Description used : ', searchDescription);
    return (this.issueTypes.find(issueType => issueType.description === searchDescription)).href;
  }

  getTypesOfIssue() {
    // Ask service for the list of current type of issues defined
    this.issueTypeService.loadAllIssueTypes().subscribe(
      receivedIssueTypes => {
        this.issueTypes = receivedIssueTypes,
          console.log("ReceviedIssueTypes issueTypes", this.issueTypes)
      }, error => console.error('Erreur ', error));

    // Test with only one issue by ID
    // this.issueTypeService.loadOneIssueTypes("5eebaaa6f717e8001654ce2b").subscribe(
    //   receivedIssueType => {
    //     console.log("ReceviedOneIssueType", receivedIssueType),
    //       this.issueTypes.push(receivedIssueType);
    //   }
    //);

    console.warn(`Issue will be ask by the API`);
    console.log("IssueTypes : ", this.issueTypes);
  }

  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {

      // Create the new issue with all required information
      console.log('HrefType = ', this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription));
      // Get hRefIssue Type from selection
      this.newIssue.issueTypeHref = this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription);
      this.newIssue.location.coordinates = { latitude: this.currentLocationLat, longitude: this.currentLocationLong };

      // this.newIssue.location = [this.currentLocationLat, this.currentLocationLong];
      console.log(`Issue will be added with the API ;`, this.newIssue);
    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}
