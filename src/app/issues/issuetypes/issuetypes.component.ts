import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { NgForm } from "@angular/forms";
import { timeStamp } from 'console';
import { IssueTypeService } from 'src/app/api/services/issue-type.service';
import { IssueType } from "src/app/models/issue-type";
import { PageChangedEvent, PaginationConfig } from 'ngx-bootstrap/pagination';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-issuetypes',
  templateUrl: './issuetypes.component.html',
  styleUrls: ['./issuetypes.component.scss']
})
export class IssuetypesComponent implements OnInit {
  issueTypes: IssueType[];
  newIssueType: IssueType;
  issueType: IssueType;
  REGEXP_AlphaNumericHypen = environment.alphaNumericHypenPattern;
  REGEXP_imageUrlPattern = environment.imageUrlPattern;

  // Configuration for pagination
  currentIssueTypesPage: IssueType[] = [];
  issueTypesCurrentPage: number = 1;
  issueTypesPerPage = 4;

  constructor(public alertService: AlertService,
    public issueTypeService: IssueTypeService,) {
    this.newIssueType = new IssueType;
  }

  ngOnInit(): void {
    this.getIssueTypeList();
  }

  getIssueTypeList(): void {
    // Subscribe to get list of comments for this issue (with author)
    this.issueTypes = [];
    // TODO : Get Pagination total from Header response to know how many comments available.
    // Here load max 20
    this.issueTypeService.loadIssueTypesByPage(1, 20)
      .subscribe({
        next: (result) => {
          this.issueTypes = result;
        },
        error: (error) => console.warn("Error", error),
        complete: () => {
          this.setCurrentPage(1);
        }
      });
  }

  // Change current page selected
  setCurrentPage(newPageNb: number): void {
    console.log("Set current page", newPageNb);
    this.issueTypesCurrentPage = newPageNb;
    // Emit event to set back page 1 - No better solution yet found 
    this.pageChanged({
      itemsPerPage: this.issueTypesPerPage,
      page: newPageNb
    })
  }

  // Action on page change done by user
  pageChanged(event: PageChangedEvent): void {
    console.log("Page changed", event)
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // Extract info to display
    this.currentIssueTypesPage = this.issueTypes.slice(startItem, endItem);
    console.log("this.currentIssueCommentsPage", this.currentIssueTypesPage);
  }

  clearForm(myForm: NgForm) {
    myForm.reset();
  }

  addNewIssueType(form: NgForm) {
    // Subscribe to add a issuetype
    console.log("form:", form);
    this.issueType = new IssueType;
    this.alertService.clear;
    // Set value of the object
    this.issueType.name = this.newIssueType.name;
    this.issueType.description = this.newIssueType.description;
    this.issueTypeService.addIssueType(this.issueType)
      .subscribe({
        next: (result) => {
          this.alertService.success('Your issue type has been correctly added', {
            autoClose: true,
            keepAfterRouteChange: false
          });
          // Clear form only on success
          this.clearForm(form);
        },
        error: (error) => {
          this.alertService.error('En error occurs when adding your issue type', {
            autoClose: true,
            keepAfterRouteChange: false
          });
        },
        complete: () => {
          // Refresh current list
          this.getIssueTypeList();
        }
      });

  }
}
