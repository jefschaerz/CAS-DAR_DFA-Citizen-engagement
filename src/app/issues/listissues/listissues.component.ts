import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { IssueTypeService } from 'src/app/api/services/issue-type.service';
import { IssueCommentService } from 'src/app/api/services/issue-comment.service';
import { Issue, stateLabels, stateIDs } from 'src/app/models/issue';
import { User } from 'src/app/models/user';
import { IssueType } from "src/app/models/issue-type";
import { IssueComment } from 'src/app/models/issue-comment';
import { filter, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { AuthService } from 'src/app/security/auth.service';

@Component({
  selector: 'app-listissues',
  templateUrl: './listissues.component.html',
  styleUrls: ['./listissues.component.scss']
})
export class ListissuesComponent implements OnInit, AfterViewInit {
  allIssues: Issue[] = [];
  filteredIssues: Issue[] = [];
  searchedIssues: Issue[] = [];
  displayedIssues: Issue[] = [];
  issueTypes: IssueType[];
  selectedIssue: Issue;
  searchText: string = '';
  addNewMarkerAllowed = false;
  issueComment: IssueComment;
  issueComments: IssueComment[];
  loggedUser: User;
  // To retreive list of States
  stateIDs = stateIDs;
  stateLabels = stateLabels;
  selectedState = { href: 'all' };
  selectOnlyOwnIssue: string = "Yes";
  commentText: string;
  // For State handling : https://www.freakyjolly.com/how-to-get-multiple-checkbox-value-in-angular/#.X0T5lcgzZaQ
  selectedItemsList = [];
  checkedIDs = [];
  checkboxesDataList = [
    {
      id: '0',
      href: 'all',
      label: 'All',
      isChecked: true
    },
    {
      id: '1',
      href: 'new',
      label: 'New',
      isChecked: true
    },
    {
      id: '2',
      href: 'inProgress',
      label: 'In progress',
      isChecked: true
    },
    {
      id: '3',
      href: 'rejected',
      label: 'Rejected',
      isChecked: true
    },
    {
      id: '4',
      href: 'resolved',
      label: 'Resolved',
      isChecked: false
    }
  ]

  constructor(private issueService: IssueService,
    public alertService: AlertService,
    public issueCommentService: IssueCommentService,
    public issueTypeService: IssueTypeService,
    public authService: AuthService,
    private markersList: MarkersListService,
    private router: Router) {

    console.log('*** End constructor: ', this.allIssues);
  }

  ngOnInit(): void {
    this.getIssuesList();
    this.getIssueTypeList();

    console.log('*** End ngOnInit - ListissuesCompo ', this.allIssues);

    // Get logged user name info
    this.authService.getUser().subscribe(user => {
      // Add ? to check before if it is defined user (in case of not logged)
      this.loggedUser = user;
      console.log(' @@@ Changes : Logged user is ', this.loggedUser);

    });
  }
  ngAfterViewInit(): void {
    // console.log('*** Start ngAfterViewInit: ', this.allIssues);
    //console.log('*** End ngAfterViewInit - ListissuesCompo ', this.allIssues);
  }

  // Update newMarker List in shared service for other components
  refreshMarkersList(NewMarkersList) {
    this.markersList.changeStdMarkersList(NewMarkersList);
  }

  changeSelection() {
    this.fetchSelectedItems()
    console.log('Selected items :', this.selectedItemsList);
  }

  changeItemsSelection(value) {
    console.log('Selected radio :', value);
  }

  fetchSelectedItems() {
    this.selectedItemsList = this.checkboxesDataList.filter((value, index) => {
      return value.isChecked
    });
  }

  fetchCheckedIDs() {
    this.checkedIDs = [];
    this.checkboxesDataList.forEach((value, index) => {
      if (value.isChecked) {
        this.checkedIDs.push(value.id);
      }
    });
  }

  getIssuesList(): void {
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues()
      .subscribe({
        next: (result) => {
          this.allIssues = result;
          //console.log("Issues loaded in ISSUES are ", this.allIssues)
        },
        error: (error) => console.warn("Error", error),
        complete: () => {
          console.log('GetIssuesList completed!')
          this.displayedIssues = this.allIssues;
          // Apply filter only after loading completed
          this.applyFilterByState(this.selectedState.href);
        }
      });
  }

  getIssueTypeList(): void {
    // Subscribe to get list of all issue Types
    this.issueTypes = [];
    this.issueTypeService.loadAllIssueTypes()
      .subscribe({
        next: (result) => {
          this.issueTypes = result;
          console.log("IssueTypes loaded are ", this.issueTypes)
        },
        error: (error) => console.warn("Error", error),
        complete: () => console.log('getIssueTypeList completed!')
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
    console.log('Issue description : ', this.issueTypeService.getIssueDescriptionFromTypeHref(this.issueTypes, this.selectedIssue.issueTypeHref));
  }

  onEditIssue(id: string) {
    console.log('Issue to edit : ', id);
    this.router.navigate(['/editissue', id]);
  }

  onEditComments(id: string) {
    console.log('Issue Comments to edit : ', id);
    this.router.navigate(['/editissue', id, 'comments']);
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

  refreshFilterAndSearch() {
    console.log('Refresh filters wiht slectOnwissue', this.selectOnlyOwnIssue);
    this.displayedIssues = this.allIssues;
    this.applyFilterByState(this.selectedState.href);
    this.applySearchByDescription(this.searchText);
    this.applySearchByAuthorHref(this.selectOnlyOwnIssue);
    console.log('Issue to display : OK', this.displayedIssues);
  }

  applyFilterByState(stateToFilter) {
    if (stateToFilter === '' || stateToFilter === 'all') {
      this.filteredIssues = this.displayedIssues;
    }
    else {
      this.filteredIssues = this.displayedIssues.filter((oneIssue) => oneIssue.state.includes(stateToFilter))
    }
    //console.log('@applyFilterByText (filtered) :', stateToFilter)
    // Update info in Markerlist service
    this.displayedIssues = this.filteredIssues;
    this.refreshMarkersList(this.displayedIssues);
  }

  applySearchByDescription(valueToSearch) {
    console.log('Value to search:', valueToSearch);
    if (valueToSearch === '') {
      this.searchedIssues = this.displayedIssues;
    }
    else {
      this.searchedIssues = this.displayedIssues.filter((oneIssue) => oneIssue.description.includes(valueToSearch))
    }
    console.log('@applySearchByDescription (filtered) :', valueToSearch)
    // Update info in Marekerlist service
    this.displayedIssues = this.searchedIssues;
    this.refreshMarkersList(this.displayedIssues);
  }

  applySearchByAuthorHref(FilterOwnIssue) {
    console.log('Search only own issue status:', FilterOwnIssue);
    if (FilterOwnIssue === "No") {
      this.searchedIssues = this.displayedIssues;
      console.log('Show all', this.displayedIssues);
    }
    else {
      console.log('Show only own issue');
      this.searchedIssues = this.displayedIssues.filter((oneIssue) => oneIssue.creatorHref === this.loggedUser.href);
    }
    console.log('@applySearchByAuthorHref (filtered) :', FilterOwnIssue)
    // Update info in Marekerlist service
    this.displayedIssues = this.searchedIssues;
    this.refreshMarkersList(this.displayedIssues);
  }
}
