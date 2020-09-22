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
//import { MarkersListService } from '../../shared/services/markerslist.service';
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
  selectedLocationLat: number = environment.defaultCityCenterPointLat;
  selectedLocationLong: number = environment.defaultCityCenterPointLng;
  newMarkerPosition: number[];
  isNewIssue: boolean;
  isEditableIssue: boolean;
  // Indicate if component used to create new issue or to modifiy current issue
  addNewMarkerAllowed = true;

  constructor(private issueTypeService: IssueTypeService,
    private router: Router,
    private issueService: IssueService,
    public alertService: AlertService,
    private geolocation: GeolocationService,
    private markerPosition: MarkerPositionService,
    //private markersList: MarkersListService,
    private route: ActivatedRoute) {

    // Defined to retrieve id in route patch for edit issue purpose
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.issueId = params.get('id');
    });

    this.geolocation
      .getCurrentPosition()
      .then((position) => {
        //console.log('User located!', position);
        this.selectedLocationLat = position.coords.latitude;
        this.selectedLocationLong = position.coords.longitude;
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

    console.log("Router link is : ", this.route.url);
    // Check if Add or Edit Issue operation (based on the current route)
    if (this.router.url.indexOf('/addissue') > -1) {
      // *** Add Issue action
      this.isNewIssue = true;
      this.isEditableIssue = true;
      console.log("Router link is /addissue");
    }
    if (this.router.url.indexOf('/editissue') > -1) {
      this.loadIssueToEditValues();
      // *** Edit Issue action
      this.isNewIssue = false;
      // Improvment possible: allow only if logged user issue
      this.isEditableIssue = true;
      console.log("Router link is /editissue");
    }
    if (this.router.url.indexOf('/viewissue') > -1) {
      // *** View Issue action
      this.loadIssueToEditValues();
      // Allowed to change marker position only if issue is editable
      this.isEditableIssue = false;
      this.isNewIssue = false;
      this.addNewMarkerAllowed = this.isEditableIssue;
      console.log("Router link is /viewissue");
    }

    // Update current issue position in the service from loaded values
    this.markerPosition.changeValues([this.issue.location.coordinates[0], this.issue.location.coordinates[1]])
    console.log("Position at ngOnInit : ", [this.issue.location.coordinates[0], this.issue.location.coordinates[1]])
  }

  ngAfterViewInit() {

    // Subscribe to marker position change 
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
      console.log('NewPosition in ManageIssue /  NewMarker : ', this.newMarkerPosition)
      this.issue.location.coordinates[0] = position[0];
      this.issue.location.coordinates[1] = position[1];
    });
  };

  // For a new issue
  loadNewIssueDefaultValues() {
    this.issue = new Issue();
    this.issue.description = 'Default - Issue from App by JFS';
    this.issue.imageUrl = '';
    this.issue.additionalImageUrls = [];
    this.newLocation = new Location();
    this.issue.location = this.newLocation;
    this.issue.tags = [];
    this.issue.issueTypeHref = null;
    this.newLocation.coordinates = [];
    this.newTag = 'Default - New tag';
    // Default values : TODO : to adapt
    this.newFirstPictureURL = 'https://picsum.photos/id/200/200.jpg';
    this.newAdditionalPictureURL = 'https://picsum.photos/id/201/200.jpg';
    console.log("loadNewIssueDefaultValues", this.issue);
  }

  // For an issue to edit
  loadIssueToEditValues() {
    // Load issue info by the service. Need time..
    this.getSearchIssue();
    // Set according issueType inissues Types 
  }

  goToAllIssues() {
    console.log('Move to see all issues')
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

  // TODO : No more necessary with Two way binding.
  onIssueTypeSelected(value: string) {
    console.log("The selected value is : " + value);
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

  getSearchIssue(): void {
    // Subscribe to get info of one issue
    this.issueService.loadOneIssue(this.issueId)
      .subscribe({
        next: (result) => {
          this.issue = result;
          console.log("Issue loaded by the service : ", this.issue)
        },
        error: (error) => {
          console.warn(["Error during load of issue with ID", this.issueId], error);
          this.goToAllIssues();
        },
        complete: () => console.log('Load completed!')
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Clear previous alert
      this.alertService.clear();
      // Create the new issue with all required information
      console.log(`Issue will be added/updated with the API ;`, this.issue);
      // Perform the ADD issue request to the API.
      if (this.isNewIssue) {
        console.log('Add a new issue', this.issue);
        this.issueService.addIssue(this.issue as Issue).subscribe({
          error: (error) => this.alertService.error('An error occurs during the add of the issue. ', error),
          complete: () => {
            this.alertService.success('The issue has been correctly added', {
              autoClose: true,
              keepAfterRouteChange: true
            })
            // Clear form for a new issue
            this.clearFormAndLoadDefaultValue(form);
            this.goToAllIssues();
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
