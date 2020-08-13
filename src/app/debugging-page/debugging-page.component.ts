import { Component, OnInit } from "@angular/core";
import { IssueTypeService } from "../api/services/issue-type.service";
import { IssueService } from '../api/services/issue.service';
import { IssueCommentService } from '../api/services/issue-comment.service';
import { ActionService } from '../api/services/action.service';
import { AlertService } from '../alerts/alerts.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-debuggin-page",
  templateUrl: "./debugging-page.component.html",
  styleUrls: ["./debugging-page.component.scss"],
})
export class DebuggingPageComponent implements OnInit {

  issueNb = '5f297015659f4400165b68c6';
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  // Inject the UserService
  constructor(private issueTypeService: IssueTypeService,
    private issueService: IssueService,
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

    // Subscribe to get list of all actions. Only posible for STAFF users ! 
    // this.actionService.loadAllActions().subscribe({
    //   next: (result) => console.log("Actions", result),
    //   error: (error) => console.warn("Error", error),
    // });
  }
  goToIssueNbRoute() {
    this.router.navigate(['/editissue', this.issueNb]);
  }

  loadIssueComments() {
    // Subscribe to get list of all comments of a issue
    this.issueCommentService.loadAllIssueComments('5f286ad44916cb0016592c9b').subscribe({
      next: (result) => console.log("Issue comments", result),
      error: (error) => console.warn("Error to get issue comments", error),
    });
  }
}