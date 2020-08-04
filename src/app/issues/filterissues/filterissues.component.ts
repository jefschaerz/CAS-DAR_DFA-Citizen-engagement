import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filterissues',
  templateUrl: './filterissues.component.html',
  styleUrls: ['./filterissues.component.scss']
})
export class FilterissuesComponent implements OnInit {
  searchText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
