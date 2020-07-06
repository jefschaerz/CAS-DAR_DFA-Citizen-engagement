import { Component, OnInit } from "@angular/core";
import { IssueTypeService } from "../api/services/issue-type.service";
import { IssueService } from '../api/services/issue.service';
import { ActionService } from '../api/services/action.service';
import { AlertService } from '../alerts/alerts.service';

@Component({
  selector: "app-debuggin-page",
  templateUrl: "./debugging-page.component.html",
  styleUrls: ["./debugging-page.component.scss"],
})
export class DebuggingPageComponent implements OnInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  // Inject the UserService
  constructor(private issueTypeService: IssueTypeService,
    private issueService: IssueService,
    private actionService: ActionService,
    public alertService: AlertService) { }

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
}