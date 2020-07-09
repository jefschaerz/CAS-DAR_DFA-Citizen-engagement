import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/alerts/alerts.service';
import { IssueService } from 'src/app/api/services/issue.service';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-listissues',
  templateUrl: './listissues.component.html',
  styleUrls: ['./listissues.component.scss']
})
export class ListissuesComponent implements OnInit {
  issues: Issue[];
  issue: Issue;
  selectedIssue: Issue;

  bookList = [
    {
      name: 'eXtreme Programming Explained'
    },
    {
      name: 'Clean Code'
    }
  ];

  constructor(private issueService: IssueService,
    public alertService: AlertService) {
  }

  ngOnInit(): void {
    console.log('Issues before init: ', this.issues);
    this.getIssuesList();
    console.log('Issues after init: ', this.issues);
  }

  getIssuesList(): void {
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => {
        this.alertService.success('Load of current issues done',);
        console.log("Issues loaded are ", result)
        this.issues = result;
        console.log("Issues loaded in ISSUES are ", this.issues)
      },
      error: (error) => console.warn("Error", error),
      complete: () => console.log('Load completed!')
    });
  }

  onSelect(issue: Issue): void {
    this.selectedIssue = issue;
  }

}
