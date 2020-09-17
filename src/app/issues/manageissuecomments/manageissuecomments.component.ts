import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IssueCommentService } from 'src/app/api/services/issue-comment.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { IssueComment } from 'src/app/models/issue-comment';
import { Issue } from 'src/app/models/issue';
import { UserService } from 'src/app/api/services/user.service';
import { PageChangedEvent, PaginationConfig } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-manageissuecomments',
  templateUrl: './manageissuecomments.component.html',
  styleUrls: ['./manageissuecomments.component.scss']
})
export class ManageissuecommentsComponent implements OnInit {
  issueId: any;
  newComment: string;
  issueComment: IssueComment;
  issueCommentUsername: string;
  issue: Issue;
  issueComments: IssueComment[];
  // Configuration for pagination
  currentIssueCommentsPage: IssueComment[] = [];
  issueCommentsCurrentPage: number = 1;
  issueCommentsPerPage = 8;
  // Indicate if component used to create new issue or to modifiy current issue
  addNewMarkerAllowed = false;

  constructor(public alertService: AlertService,
    public issueCommentService: IssueCommentService,
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) {

    this.issue = new Issue;
    this.issue.imageUrl = '';

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
    // Subscribe to get list of comments for this issue (with author)
    this.issueComments = [];
    // TODO : Get Pagination total from Header response to know how many comments avaiable.
    // Here load max 100
    this.issueCommentService.loadIssueComments(this.issueId, 1, 100)
      .subscribe({
        next: (result) => {
          this.issueComments = result;
          console.log("In manageIssueComments : Comments loaded are:", this.issueComments)
        },
        error: (error) => console.warn("Error", error),
        complete: () => {
          console.log('getIssueComment completed!')
          this.setCurrentPage(1);
        }
      });
  }

  goBackToIssues() {
    this.router.navigate(['/seeissues']);
  }

  addNewComment() {
    // Subscribe to add a comment
    this.issueComment = new IssueComment;
    this.alertService.clear;
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

  // Change current page selected
  setCurrentPage(newPageNb: number): void {
    console.log("Set current page", newPageNb);
    this.issueCommentsCurrentPage = newPageNb;
    // Emit event to set back page 1 - No better solution yet found 
    this.pageChanged({
      itemsPerPage: this.issueCommentsPerPage,
      page: newPageNb
    })
  }

  // Action on page change done by user
  pageChanged(event: PageChangedEvent): void {
    console.log("Page changed", event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // Extract info to display
    this.currentIssueCommentsPage = this.issueComments.slice(startItem, endItem);
    console.log("this.currentIssueCommentsPage", this.currentIssueCommentsPage);
  }

}
