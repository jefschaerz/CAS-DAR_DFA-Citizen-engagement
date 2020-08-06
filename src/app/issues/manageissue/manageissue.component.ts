import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IssueTypeService } from '../../api/services/issue-type.service';
import { IssueService } from '../../api/services/issue.service';
import { Issue, State } from 'src/app/models/issue';
import { IssueType } from 'src/app/models/issue-type';
import { Location } from 'src/app/models/location';
import { AlertService } from '../../alerts/alerts.service';
import { environment } from "../../../environments/environment";
import { GeolocationService } from '../../shared/services/geolocation.service';
import { MarkerPositionService } from '../../shared/services/markerposition.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-manageissue',
  templateUrl: './manageissue.component.html',
  styleUrls: ['./manageissue.component.scss']
})
export class ManageissueComponent implements OnInit {
  issueId: any;
  issues: Issue[];
  issue: Issue;
  newTag: string;
  newFirstPictureURL: string;
  newAdditionalPictureURL: string;
  newLocation: Location;
  issueTypes: IssueType[];
  issueError: boolean;
  selectedIssueTypeDescription: string;
  // Renan coordinates
  currentLocationLat: number = 47.125058;
  currentLocationLong: number = 6.932254;
  newMarkerPosition: number[];
  isNewIssue: boolean;
  // Indicate if component used to create new issue or to modifiy current issue
  addNewMarkerAllowed = true;

  constructor(private issueTypeService: IssueTypeService,
    private router: Router,
    private issueService: IssueService,
    private alertService: AlertService,
    private geolocation: GeolocationService,
    private markerPosition: MarkerPositionService,
    private route: ActivatedRoute) {

    // Defined to retrieve id in route patch for edit issue purpose
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.issueId = params.get('id');
    });

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

    // Check if Add or Edit Issue operation (based on the current route)
    if (this.router.url === '/addissue') {
      this.isNewIssue = true;
    }
    else {
      this.isNewIssue = false;
    }

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

    // Load information according to operation
    if (this.isNewIssue) {
      this.loadNewIssueDefaultValues();
    }
    else {
      this.loadIssueToEditValues();
    }
  }

  loadNewIssueDefaultValues() {
    this.issue = new Issue();
    this.issue.description = 'New issue from App by JFS';
    this.issue.imageUrl = '';
    this.issue.additionalImageUrls = [];
    this.newLocation = new Location();
    this.issue.location = this.newLocation;
    this.issue.tags = [];
    this.issue.additionalImageUrls = [];
    this.newLocation.coordinates = [];
    this.newTag = 'New tag';
    // Default values : TODO : to adapt
    this.newFirstPictureURL = 'https://picsum.photos/id/1/200/300.jpg';
    this.newAdditionalPictureURL = 'https://picsum.photos/id/53/200/300.jpg';
  }

  loadIssueToEditValues() {
    //let loadedIssue = new Issue;
    this.issue = new Issue;
    this.issue.description = 'default';
    console.log('this.issue values loaded : ', this.issue.description);
    let loadedIssue = this.getOneIssue(this.issueId);
    this.issue = _.cloneDeep(this.getOneIssue(this.issueId));
    // //console.log('loadedIssue values in copy : ', loadedIssue);

    // // Work with this :
    // this.issue = new Issue();
    // this.issue.description = '';
    // this.issue.imageUrl = '';
    // this.issue.additionalImageUrls = [];
    // this.newLocation = new Location();
    // this.issue.location = this.newLocation;
    // this.issue.tags = [];
    // this.issue.state = 'inProgress';
    // this.issue.additionalImageUrls = [];
    // this.newLocation.coordinates = [];
    // this.newTag = 'New tag';
    // // Default values : TODO : to adapt
    // this.newFirstPictureURL = '';
    // this.newAdditionalPictureURL = '';
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
  }

  getOneIssue(searchedId: any) {
    return this.issues.find(issue => issue.id === searchedId);
    // Search in the issues list the searched one
    // Test with only one issue by ID
    // this.issueTypeService.loadOneIssueTypes("5eebaaa6f717e8001654ce2b").subscribe(
    //   receivedIssueType => {
    //     console.log("ReceviedOneIssueType", receivedIssueType),
    //       this.issueTypes.push(receivedIssueType);
    //   }
    // );
    // console.warn(`Issue will be ask by the API`);
    // console.log("IssueTypes : ", this.issueTypes);
    //   }
  }

  addTagToIssue() {
    // Check if provided tag already exists and add only if not
    if (this.newTag != '') {
      if (this.issue.tags.indexOf(this.newTag) === -1) {
        this.issue.tags.push(this.newTag);
        this.newTag = '';
      }
      else {
        this.alertService.error('This tag already exists for this issue', {
          autoClose: true,
          keepAfterRouteChange: false
        });
      }
      console.log('Current tags : ', this.issue.tags);
    }
  }

  removeTag(i: number) {
    this.issue.tags.splice(i, 1);
  }

  addFirstPictureToIssue() {
    // Check if provided URL already exists and add only if not
    if (this.newFirstPictureURL != '' &&
      this.issue.imageUrl !== this.newFirstPictureURL &&
      this.issue.additionalImageUrls.indexOf(this.issue.imageUrl) === -1) {
      this.issue.imageUrl = this.newFirstPictureURL;
    }
    else {
      this.alertService.error('This imageURL already exists for this issue', {
        autoClose: true,
        keepAfterRouteChange: false
      });
    }
    console.log('Current picture URL : ', this.issue.imageUrl);
  }

  addAdditionalPictureToIssue() {
    // Check if provided URL already exists (also for imageURL) and add only if not
    if (this.newAdditionalPictureURL !== '') {
      if (this.issue.additionalImageUrls.indexOf(this.newAdditionalPictureURL) === -1 &&
        this.newAdditionalPictureURL !== this.issue.imageUrl) {
        this.issue.additionalImageUrls.push(this.newAdditionalPictureURL);
        this.newAdditionalPictureURL = '';
      }
      else {
        this.alertService.error('This imageUrl already exists for this issue', {
          autoClose: true,
          keepAfterRouteChange: false
        });
      }
      console.log('Current additional pictures : ', this.issue.additionalImageUrls);
    }
  }

  removePicture(i: number) {
    this.issue.additionalImageUrls.splice(i, 1);
    console.log('Current additional pictures : ', this.issue.additionalImageUrls);
  }

  onSubmit(form: NgForm) {
    // Only do something if the form is valid
    if (form.valid) {
      // Create the new issue with all required information
      console.log('HrefType = ', this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription));
      // Get hRefIssue type from selection
      this.issue.issueTypeHref = this.getIssueTypeHrefFromDescription(this.selectedIssueTypeDescription);
      this.issue.location.coordinates.push(this.currentLocationLat, this.currentLocationLong);
      console.log(`Issue will be added with the API ;`, this.issue);

      // Perform the add issue request to the API.
      this.issueService.addIssue(this.issue as Issue).subscribe({
        next: (result) => this.alertService.success('tThe issue hs been correctly added', result),
        error: (error) => this.alertService.error('An error occurs during the add of the issue. ', error)
      });

    }
    else {
      console.warn(`Submit failed :`);

    }
  }
}
