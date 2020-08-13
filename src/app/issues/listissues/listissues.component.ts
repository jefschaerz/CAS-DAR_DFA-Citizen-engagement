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
  issues: Issue[];
  displayedIssues: Issue[];
  issue: Issue;
  selectedIssue: Issue;
  searchText: string;
  addNewMarkerAllowed = false;
  issueComment: IssueComment;

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
        complete: () => console.log('Load completed!')
      });
  }

  onSelect(issue: Issue): void {
    this.selectedIssue = issue;
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
    this.issueComment.text = 'Comment #1';

    console.log()
    this.issueCommentService.addCommentToIssue(id, this.issueComment)
      .subscribe({
        next: (result) => {
          console.log("Comment add successfully")
        },
        error: (error) => console.warn("Error during add of comment", error),
        complete: () => console.log('Comment add completed!')
      });
  }

}
