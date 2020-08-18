import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { IssueCommentService } from 'src/app/api/services/issue-comment.service';
import { Issue } from 'src/app/models/issue';
import { IssueComment } from 'src/app/models/issue-comment';
import { filter, map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Component({
  selector: 'app-listissues',
  templateUrl: './listissues.component.html',
  styleUrls: ['./listissues.component.scss']
})
export class ListissuesComponent implements OnInit {
  isCollapsed = false;
  issues: Issue[];
  displayedIssues: Issue[];
  //issue: Issue;
  selectedIssue: Issue;
  searchText: string;
  addNewMarkerAllowed = false;
  issueComment: IssueComment;
  issueComments: IssueComment[];
  commentText: string;

  constructor(private issueService: IssueService,
    public alertService: AlertService,
    public issueCommentService: IssueCommentService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getIssuesList();
    console.log('Issues after init: ', this.issues);
  }

  getIssuesList(): void {
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues()
      .subscribe({
        next: (result) => {
          this.issues = result;
          console.log("Issues loaded in ISSUES are ", this.issues)
        },
        error: (error) => console.warn("Error", error),
        complete: () => console.log('getIssuesList completed!')
      });
  }

  getIssueComments(issueId: string): void {
    // Subscribe to get list of comments for this issue
    this.issueComments = [];
    this.issueCommentService.loadIssueComments(issueId)
      .subscribe({
        next: (result) => {
          this.issueComments = result;
          console.log("Comments loaded are:", this.issueComments)
        },
        error: (error) => console.warn("Error", error),
        complete: () => console.log('getIssueComment completed!')
      });
  }

  onSelect(myIssue: Issue): void {
    this.selectedIssue = myIssue;
    console.log('Issue selected : ', this.selectedIssue.description);
    //show on the map
  }

  onEditIssue(id: string) {
    console.log('Issue to edit : ', id);
    this.router.navigate(['/editissue', id]);
  }

  addOneComment(id: string): void {
    // Subscribe to add a comment
    this.issueComment = new IssueComment;
    this.issueComment.text = '';

    console.log()
    this.issueCommentService.addCommentToIssue(id, this.issueComment)
      .subscribe({
        next: (result) => {
          this.alertService.success('Your comment has been correctly added', {
            autoClose: true,
            keepAfterRouteChange: false
          });
        },
        error: (error) => {
          this.alertService.error('En error occurs when adding your comment', {
            autoClose: true,
            keepAfterRouteChange: false
          });
        },
      });
  }

}
