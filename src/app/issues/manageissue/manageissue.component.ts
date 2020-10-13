import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
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
import { stringify } from 'querystring';
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
  // Default City center location
  userCurrentLocationLat: number = environment.defaultCityCenterPointLat;
  userCurrentLocationLong: number = environment.defaultCityCenterPointLng;
  currentIssueMarkerPosition: number[];
  isNewIssue: boolean;
  isEditableIssue: boolean;
  // Indicate if component used to create new issue or to modifiy current issue
  displayIssueMarkerOnMap = false;
  displayAllMarkersOnMap = false;
  changeIssueMarkerAllowedOnMap = false;
  markerSubscription: Subscription;
  REGEXP_imageUrlPattern = environment.imageUrlPattern;

  constructor(private issueTypeService: IssueTypeService,
    private router: Router,
    private issueService: IssueService,
    public alertService: AlertService,
    private geolocation: GeolocationService,
    private markerPosition: MarkerPositionService,
    private route: ActivatedRoute) {

    // Defined to retrieve id in route patch for edit issue purpose
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.issueId = params.get('id');
    });

    // Try to get location of the user
    this.geolocation
      .getCurrentPosition()
      .then((position) => {
        this.userCurrentLocationLat = position.coords.latitude;
        this.userCurrentLocationLong = position.coords.longitude;
      })
      .catch((error) => {
        console.warn('Failed to locate user because', error);
      });
  }

  ngOnInit(): void {

    // Retrieve current list of issueTypes
    this.getTypesOfIssue();

    // Load defaut values  
    this.loadNewIssueDefaultValues();

    // Check if Add or Edit or View Issue operation (based on the current route)
    if (this.router.url.indexOf('/addissue') > -1) {
      // *** Add Issue action
      this.isNewIssue = true;
      this.isEditableIssue = true;
      this.changeIssueMarkerAllowedOnMap = true;
      this.displayIssueMarkerOnMap = true;
      this.displayAllMarkersOnMap = true;
    }
    if (this.router.url.indexOf('/editissue') > -1) {
      // *** Edit Issue action
      this.loadIssueToEditValues();
      this.isNewIssue = false;
      this.isEditableIssue = true;
      this.changeIssueMarkerAllowedOnMap = true;
      this.displayIssueMarkerOnMap = true;
      this.displayAllMarkersOnMap = true;
    }
    if (this.router.url.indexOf('/viewissue') > -1) {
      // *** View Issue action
      this.loadIssueToEditValues();
      // Allowed to change marker position only if issue is editable
      this.isNewIssue = false;
      this.isEditableIssue = false;
      this.changeIssueMarkerAllowedOnMap = false;
      this.displayIssueMarkerOnMap = true;
      this.displayAllMarkersOnMap = true;
    }
  }

  ngAfterViewInit() {

    // Subscribe to marker position change 
    this.markerSubscription = this.markerPosition.currentPosition.subscribe(position => {
      this.currentIssueMarkerPosition = (position)
      console.log('ManageIssue : NewPosition received from SERVICE : ', position)
      // Update location values
      this.issue.location.coordinates[0] = position[0];
      this.issue.location.coordinates[1] = position[1];
    });
  };

  ngOnDestroy() {
    this.markerSubscription.unsubscribe();
  }

  // For a new issue
  loadNewIssueDefaultValues() {
    this.issue = new Issue();
    this.issue.description = '';
    this.issue.imageUrl = '';
    this.issue.additionalImageUrls = [];
    this.newLocation = new Location();
    this.issue.location = this.newLocation;
    this.issue.tags = [];
    this.issue.issueTypeHref = null;
    this.newLocation.coordinates = [];
    this.newTag = '';
    // Default values : TODO : to adapt
    this.newFirstPictureURL = 'https://picsum.photos/id/200/200.jpg';
    this.newAdditionalPictureURL = 'https://picsum.photos/id/201/200.jpg';

    // console.log("loadNewIssueDefaultValues", this.issue);
  }

  // For an issue to edit
  loadIssueToEditValues() {
    // Load issue info by the service. Need time..
    this.getSearchIssue();
  }

  goToAllIssues() {
    this.router.navigate(['/seeissues']);
  }

  deleteIssue() {
    // Perform the DELETE issue request to the API.
    console.log('Delete this issue', this.issue);
    this.issueService.deleteIssue(this.issue as Issue).subscribe({
      error: (error) => this.alertService.error('An error occurs during the deletion of the issue. ', error),
      complete: () => {
        this.alertService.success('The issue has been correctly deleted', {
          autoClose: true,
          keepAfterRouteChange: false
        });
        this.goToAllIssues();
      }
    });
  }

  getTypesOfIssue() {
    // Ask service for the list of current type of issues defined
    this.issueTypeService.loadAllIssueTypes().subscribe({
      next: (receivedIssueTypes) => {
        this.issueTypes = receivedIssueTypes
        // console.log("ReceivedIssueTypes issueTypes", this.issueTypes)
      },
      error: (error) => console.error('Erreur ', error)
    });
  }

  getSearchIssue(): void {
    // Subscribe to get info of one issue
    this.issueService.loadOneIssue(this.issueId)
      .subscribe({
        next: (result) => {
          this.issue = result;
        },
        error: (error) => {
          console.warn(["Error during load of issue with ID", this.issueId], error);
          this.goToAllIssues();
        },
        complete: () => {
          // Update current issue position in the service from loaded values
          this.markerPosition.setNewPosition([this.issue.location.coordinates[0], this.issue.location.coordinates[1]])
        }
      });
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

  addFakeImageURL() {
    this.issue.imageUrl = this.getRandomPictureURL();
  }

  getRandomPictureURL(): string {
    // Debug to add fake image
    let randomNb: number;
    randomNb = Math.floor((Math.random() * 100) + 1);
    return 'https://picsum.photos/id/' + randomNb + '/200.jpg';
  }

  addFakeaAdditionalImageURL() {
    this.newAdditionalPictureURL = this.getRandomPictureURL();
  }

  removeTag(i: number) {
    this.issue.tags.splice(i, 1);
  }

  checkAddFirstPictureToIssue() {
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

  clearFormAndLoadDefaultValue(myFrom: NgForm) {
    console.log("Issue", this.issue);
    myFrom.reset();
    this.loadNewIssueDefaultValues();
  }

  useCurrentUserlocation() {
    this.markerPosition.setNewPosition([this.userCurrentLocationLat, this.userCurrentLocationLong])
  }

  onSubmit(form: NgForm) {
    console.log('Submit an issue', this.issue);
    if ((!this.issue.location.coordinates[0]) || (!this.issue.location.coordinates[1])) {
      this.alertService.error('The location is missing in your issue', {
        autoClose: false,
        keepAfterRouteChange: false
      });
    }
    else {
      if (form.valid) {
        // Clear previous alert
        this.alertService.clear();
        // Perform the ADD issue request to the API.
        if (this.isNewIssue) {
          console.log('Add a new issue', this.issue);
          this.issueService.addIssue(this.issue as Issue).subscribe({
            error: (error) => this.alertService.error('An error occurs during the add of the issue. ', error),
            complete: () => {
              this.alertService.success('Your issue has been correctly added', {
                autoClose: true,
                keepAfterRouteChange: true
              })
              console.log('Add issue DONE', this.issue);
              // Clear form for a new issue
              this.clearFormAndLoadDefaultValue(form);
              // Stay on page to infor of the success 
              // this.goToAllIssues();
            }
          });
        }
        else {
          // Perform the UPDATE issue request to the API.
          console.log('Update an issue', this.issue);
          this.issueService.updateIssue(this.issue as Issue).subscribe({
            error: (error) => this.alertService.error('An error occurs during the update of the issue. ', error),
            complete: () => this.alertService.success('The issue has been correctly updated', {
              autoClose: true,
              keepAfterRouteChange: false
            })
          });
        }

      }
      else {
        console.warn(`Submit failed :`);
      }
    }
  }
}
