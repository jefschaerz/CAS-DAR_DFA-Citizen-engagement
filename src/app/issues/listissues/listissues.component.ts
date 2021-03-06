import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { IssueTypeService } from 'src/app/api/services/issue-type.service';
import { Issue, stateLabels, stateIDs } from 'src/app/models/issue';
import { User } from 'src/app/models/user';
import { IssueType } from "src/app/models/issue-type";
import { IssueComment } from 'src/app/models/issue-comment';
import { filter, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { AuthService } from 'src/app/security/auth.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

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
  currentPageIssues: Issue[] = [];
  issueTypes: IssueType[];
  selectedIssue: Issue;
  searchText: string = '';
  displayIssueMarkerOnMap = false;
  displayAllMarkersOnMap = true;
  applyCenterOnIssue = false;
  loggedUser: User;
  // To retreive list of states
  stateIDs = stateIDs;
  stateLabels = stateLabels;
  selectedState = { href: 'all' };
  selectOnlyOwnIssue: string;
  commentText: string;
  // For State handling : https://www.freakyjolly.com/how-to-get-multiple-checkbox-value-in-angular/#.X0T5lcgzZaQ
  selectedItemsList = [];
  // For pagination of issues (https://valor-software.com/ngx-bootstrap/#/pagination)
  issueCurrentPage: number = 1;
  issuePerPage = 4;  // Constant
  // For issue state
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
    public issueTypeService: IssueTypeService,
    public authService: AuthService,
    private markersList: MarkersListService,
    private router: Router) {

    console.log('*** End constructor: ', this.allIssues);
  }

  ngOnInit(): void {
    this.getIssuesList();
    this.getIssueTypeList();
    this.selectOnlyOwnIssue = "No";

    // Get logged user name info
    this.authService.getUser().subscribe(user => {
      this.loggedUser = user;
    });
  }

  ngAfterViewInit(): void {
    this.updatehMarkersListInService(this.displayedIssues);
  }

  // Update newMarker List in shared service for other components
  updatehMarkersListInService(NewMarkersList) {
    this.markersList.changeStdMarkersList(NewMarkersList);
  }

  clearSearchField() {
    this.searchText = '';
    this.refreshFilterAndSearch();
  }

  getIssuesList(): void {
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues()
      .subscribe({
        next: (result) => {
          this.allIssues = result;
        },
        error: (error) => console.warn("Error", error),
        complete: () => {
          this.displayedIssues = this.allIssues;
          // Refresh filter and serach filter only after loading completed
          this.refreshFilterAndSearch();
        }
      });
  }

  getIssuesByPage() {
    this.issueService.loadIssuesByPage(this.issueCurrentPage, this.issuePerPage).subscribe({
      next: (result) => console.log("Issues by Page", result),
      error: (error) => console.warn("Error", error),
    });
  }

  getIssueTypeList(): void {
    // Subscribe to get list of all issue Types
    this.issueTypes = [];
    this.issueTypeService.loadAllIssueTypes()
      .subscribe({
        next: (result) => {
          this.issueTypes = result;
        },
        error: (error) => console.warn("Error", error)
      });
  }

  onSelect(myIssue: Issue): void {
    this.selectedIssue = myIssue;
    //console.log('Issue selected : ', this.selectedIssue.description);
    //console.log('Issue description : ', this.issueTypeService.getIssueDescriptionFromTypeHref(this.issueTypes, this.selectedIssue.issueTypeHref));
  }

  onEditIssue(id: string) {
    this.router.navigate(['/editissue', id]);
  }

  onViewIssue(id: string) {
    this.router.navigate(['/viewissue', id]);
  }

  onEditComments(id: string) {
    this.router.navigate(['/editissue', id, 'comments']);
  }

  refreshFilterAndSearch() {
    this.displayedIssues = this.allIssues;
    this.applyFilterByState(this.selectedState.href);
    this.applySearchByDescription(this.searchText);
    this.applySearchByAuthorHref(this.selectOnlyOwnIssue);
    // console.log('Issue to display : OK', this.displayedIssues);
    // Markers will show displayIssues 
    this.updatehMarkersListInService(this.displayedIssues);
    this.setCurrentPage(1);
  }

  applyFilterByState(stateToFilter) {
    if (stateToFilter === '' || stateToFilter === 'all') {
      this.filteredIssues = this.displayedIssues;
    }
    else {
      this.filteredIssues = this.displayedIssues.filter((oneIssue) => oneIssue.state.includes(stateToFilter))
    }
    // Update info in Markerlist service
    this.displayedIssues = this.filteredIssues;
  }

  applySearchByDescription(valueToSearch) {
    if (valueToSearch === '') {
      this.searchedIssues = this.displayedIssues;
    }
    else {
      this.searchedIssues = this.displayedIssues.filter((oneIssue) => oneIssue.description.includes(valueToSearch))
    }
    // Update info in Marekerlist service
    this.displayedIssues = this.searchedIssues;
  }

  applySearchByAuthorHref(FilterOwnIssue) {
    if (FilterOwnIssue === "No") {
      this.searchedIssues = this.displayedIssues;
    }
    else {
      this.searchedIssues = this.displayedIssues.filter((oneIssue) => oneIssue.creatorHref === this.loggedUser.href);
    }
    // Update info in Marekerlist service
    this.displayedIssues = this.searchedIssues;
  }

  // Change current page selected
  setCurrentPage(newPageNb: number): void {
    this.issueCurrentPage = newPageNb;
    // Emit event to set back page 1 - No besser solution yet found 
    this.pageChanged({
      itemsPerPage: 4,
      page: newPageNb
    })
  }

  // Action on page change done by user
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // Extract issues to display
    this.currentPageIssues = this.displayedIssues.slice(startItem, endItem);
  }

  isThisIssueOwnIssue(issueHref: string) {
    return (issueHref === this.loggedUser.href);
  }
}
