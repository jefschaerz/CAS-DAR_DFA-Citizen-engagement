import { Component, OnInit } from "@angular/core";
import { IssueTypeService } from "../api/services/issue-type.service";
import { IssueService } from '../api/services/issue.service';
import { IssueCommentService } from '../api/services/issue-comment.service';
import { ActionService } from '../api/services/action.service';
import { AlertService } from '../alerts/alerts.service';
import { Router } from "@angular/router";
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';

@Component({
  selector: "app-debuggin-page",
  templateUrl: "./debugging-page.component.html",
  styleUrls: ["./debugging-page.component.scss"],
})
export class DebuggingPageComponent implements OnInit {
  issueNb = '5f297015659f4400165b68c6';
  options = {
    autoClose: false,
    keepAfterRouteChange: true
  };

  // For pagination tests :
  totalItems = 64;
  currentPage = 4;

  setPage(pageNo: number): void {
    this.currentPage = pageNo;
  }
  //-------------------------------------

  // Inject the UserService
  constructor(private issueTypeService: IssueTypeService,
    private issueService: IssueService,
    private markerPosition: MarkerPositionService,
    private actionService: ActionService,
    private issueCommentService: IssueCommentService,
    public alertService: AlertService,
    private router: Router) { }

  ngOnInit(): void {
    // Ask the service to make an API call on component initialisation
    this.issueTypeService.loadAllIssueTypes().subscribe({
      next: (result) => console.log("Issue types", result),
      error: (error) => console.warn("Error", error),
    });

    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => console.log("Issues", result),
      error: (error) => console.warn("Error", error),
    });
    console.log("Set Behavior not working..");

    this.markerPosition.currentPosition.subscribe(newPos => console.log("New Position", newPos));
    // this.markerPosition.castUser.subscribe(user => console.log("User in Debug: ", user));
    // this.markerPosition.castUser.subscribe(user => console.log("User : ", user));

  }
  goToIssueNbRoute() {
    this.router.navigate(['/editissue', this.issueNb]);
  }

  loadIssuesByPage() {
    console.log("Load page : ", this.currentPage);
    this.issueService.loadIssuesByPage(this.currentPage, 2).subscribe({
      next: (result) => console.log("Issues by Page", result),
      error: (error) => console.warn("Error", error),
    });
  }
}