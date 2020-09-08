import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IssueCommentService } from 'src/app/api/services/issue-comment.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { IssueComment } from 'src/app/models/issue-comment';
import { Issue } from 'src/app/models/issue';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-manageissuecomments',
  templateUrl: './manageissuecomments.component.html',
  styleUrls: ['./manageissuecomments.component.scss']
})
export class ManageissuecommentsComponent implements OnInit {
  issueId: any;
  newComment: string;
  issueComment: IssueComment;
  issue: Issue;
  issueComments: IssueComment[];
  searchTextInComment: string;
  // Indicate if component used to create new issue or to modifiy current issue
  addNewMarkerAllowed = false;

  constructor(public alertService: AlertService,
    public issueCommentService: IssueCommentService,
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute) {

    // Defined to retrieve id in route patch for edit issue purpose
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.issueId = params.get('id');
    });
  }

  ngOnInit(): void {
    console.log('IssueId :', this.issueId);
    this.getIssueInfo();
    this.getIssueComments();

    // For debug (random string)
    let randomNb: number;
    randomNb = Math.floor((Math.random() * 1000) + 1);
    this.newComment = 'This is a new random comment [' + randomNb + ']';
  }

  getIssueInfo(): void {
    // Subscribe to get info of one issue
    this.issueService.loadOneIssue(this.issueId)
      .subscribe({
        next: (result) => {
          this.issue = result;
          console.log("Issue loaded by the service : ", this.issue)
        },
        error: (error) => {
          console.warn(["Error during load of issue with ID", this.issueId], error);
          this.router.navigate(['/seeissues']);
        },
        complete: () => console.log('Load issue in getIssueInfo completed!')
      });
  }

  getIssueComments(): void {
    // Subscribe to get list of comments for this issue
    this.issueComments = [];
    // TODO : Sort by date
    this.issueCommentService.loadIssueComments(this.issueId)
      .subscribe({
        next: (result) => {
          this.issueComments = result;
          console.log("In manageIssueComments : Comments loaded are:", this.issueComments)
        },
        error: (error) => console.warn("Error", error),
        complete: () => console.log('getIssueComment completed!')
      });
  }

  goBackToIssues() {
    this.router.navigate(['/seeissues']);
  }

  addNewComment() {
    // Subscribe to add a comment
    this.issueComment = new IssueComment;
    // Set text value of the object
    this.issueComment.text = this.newComment;
    console.log('Add new comment (', this.newComment, ') to issue id : ', this.issueId);
    this.issueCommentService.addCommentToIssue(this.issueId, this.issueComment,)
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
        complete: () => {
          // Refresh current list of comments
          this.getIssueComments();
        }
      });

  }
}
