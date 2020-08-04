import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { IssueTypeService } from '../../api/services/issue-type.service';
import { IssueService } from '../../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { IssueType } from 'src/app/models/issue-type';
import { Location } from 'src/app/models/location';
import { AlertService } from '../../alerts/alerts.service';
import { environment } from "../../../environments/environment";
import { GeolocationService } from '../../shared/services/geolocation.service';
import { MarkerPositionService } from '../../shared/services/markerposition.service';

@Component({
  selector: 'app-manageissue',
  templateUrl: './manageissue.component.html',
  styleUrls: ['./manageissue.component.scss']
})
export class ManageissueComponent implements OnInit {

  // @Input() isNewIssue: boolean;

  issues: Issue[];
  newIssue: Issue;
  newTag: string;
  newFirstPictureURL: string;
  newAdditionalPictureURL: string;
  newLocation: Location;
  issueTypes: IssueType[];
  newIssueError: boolean;
  selectedIssueTypeDescription: string;
  // Renan coordinates
  currentLocationLat: number = 47.125058;
  currentLocationLong: number = 6.932254;
  newMarkerPosition: number[];
  // Indicate if component used to create new issue or to modifiy current issue
  isNewIssue: boolean;

  constructor(private issueTypeService: IssueTypeService,
    private router: Router,
    private issueService: IssueService,
    private alertService: AlertService,
    private geolocation: GeolocationService,
    private markerPosition: MarkerPositionService) {
    this.newIssue = new Issue();
    this.newIssue.description = 'New issue from App by JFS';
    this.newIssue.imageUrl = '';
    this.newIssue.additionalImageUrls = [];
    this.newLocation = new Location();
    this.newIssue.location = this.newLocation;
    this.newIssue.tags = [];
    this.newIssue.additionalImageUrls = [];
    this.newLocation.coordinates = [];
    this.newTag = 'New tag';
    // Default values : TODO to adapt
    this.newFirstPictureURL = 'https://picsum.photos/id/1/200/300.jpg';
    this.newAdditionalPictureURL = 'https://picsum.photos/id/53/200/300.jpg';
    this.isNewIssue = true;
    this.geolocation
      .getCurrentPosition()
      .then((position) => {
        console.log('User located!', position);
        // Set current location point
        this.currentLocationLat = position.coords.latitude;
        this.currentLocationLong = position.coords.longitude;
      })
      .catch((error) => {
        console.warn('Failed to locate user because', error);
      });
  }

  ngOnInit(): void {
    // Retrieve current list of issueTypes
    this.getTypesOfIssue();

    // Get new Marker Position on change
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
      console.log('NewPosition in ManageIssue /  NewMarker : ', this.newMarkerPosition)
      this.currentLocationLat = position[0];
      this.currentLocationLong = position[1];
      console.log('change in CurrentlocationLat : ', this.currentLocationLat);
    });
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
    this.issueTypeService.loadAllIssueTypes().subscribe({
      next: (receivedIssueTypes) => {
        this.issueTypes = receivedIssueTypes,
          console.log("ReceviedIssueTypes issueTypes", this.issueTypes)
      },
      error: (error) => console.error('Erreur ', error)
    });

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

  addTagToIssue() {
    // Check if provided tag already exists and add only if not
    if (this.newTag != '') {
      if (this.newIssue.tags.indexOf(this.newTag) === -1) {
        this.newIssue.tags.push(this.newTag);
        this.newTag = '';
      }
      else {
        this.alertService.error('This tag already exists for this issue', {
          autoClose: true,
          keepAfterRouteChange: false
        });
      }
      console.log('Current tags : ', this.newIssue.tags);
    }
  }

  removeTag(i: number) {
    this.newIssue.tags.splice(i, 1);
  }

  addFirstPictureToIssue() {
    // Check if provided URL already exists and add only if not
    if (this.newFirstPictureURL != '' &&
      this.newIssue.imageUrl !== this.newFirstPictureURL &&
      this.newIssue.additionalImageUrls.indexOf(this.newIssue.imageUrl) === -1) {
      this.newIssue.imageUrl = this.newFirstPictureURL;
    }
    else {
      this.alertService.error('This imageURL already exists for this issue', {
        autoClose: true,
        keepAfterRouteChange: false
      });
    }
    console.log('Current picture URL : ', this.newIssue.imageUrl);
  }

  addAdditionalPictureToIssue() {
    // Check if provided URL already exists (also for imageURL) and add only if not
    if (this.newAdditionalPictureURL !== '') {
      if (this.newIssue.additionalImageUrls.indexOf(this.newAdditionalPictureURL) === -1 &&
        this.newAdditionalPictureURL !== this.newIssue.imageUrl) {
        this.newIssue.additionalImageUrls.push(this.newAdditionalPictureURL);
        this.newAdditionalPictureURL = '';
      }
      else {
        this.alertService.error('This imageUrl already exists for this issue', {
          autoClose: true,
          keepAfterRouteChange: false
        });
      }
      console.log('Current additional pictures : ', this.newIssue.additionalImageUrls);
    }
  }

  removePicture(i: number) {
    this.newIssue.additionalImageUrls.splice(i, 1);
    console.log('Current additional pictures : ', this.newIssue.additionalImageUrls);
  }

  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {
      // Create the new issue with all required information
      console.log('HrefType = ', this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription));
      // Get hRefIssue type from selection
      this.newIssue.issueTypeHref = this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription);
      this.newIssue.location.coordinates.push(this.currentLocationLat, this.currentLocationLong);
      console.log(`Issue will be added with the API ;`, this.newIssue);

      // Perform the add issue request to the API.
      this.issueService.addIssue(this.newIssue as Issue).subscribe({
        next: (result) => this.alertService.success('tThe issue hs been correctly added', result),
        error: (error) => this.alertService.error('An error occurs during the add of the issue. ', error)
      });

    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}
