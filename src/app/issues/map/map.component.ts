import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { defaultIcon } from './default-marker';
import { IssueService } from '../../api/services/issue.service';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map;
  mapOptions: L.MapOptions;
  mapMarkers: L.Marker[];
  loadedMarkers: L.Marker[];
  issuesList: Issue[];


  constructor(private issueService: IssueService) {
    this.issuesList = [];
    this.mapMarkers = [];

    // Define mapOptions
    // this.mapOptions = {
    //   zoom: 13,
    //   // Center on Renan
    //   center: L.latLng(47.125058, 6.932254)
    //};
    // Define some mapMarkers with linked actions

    //this.mapMarkers.push(marker([47.126058, 6.942254], { icon: defaultIcon }).bindTooltip('Demo2'));

    //TODO : Define L.Map and set options correctly
    //this.map.options = this.mapOptions;
  }

  initMap(): void {
    console.log('Start Map initialize:', this.map);
    this.map = L.map('map2', {
      center: [47.125058, 6.932254],
      zoom: 13
    });
    console.log('Map initialized:', this.map);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  addIssuesMarkers(map: L.Map) {
    // https://stackblitz.com/edit/angular-ngx-leaflet-tests-3p74ln
    // Need to link with the issue service
    // simply iterate over the array of markers from our data service
    // and add them to the map
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => {
        this.issuesList = result;
        console.log("Issues loaded in ISSUES (by MAP are ", this.issuesList);
        console.log('Number or Issues :', this.issuesList.length)
      },
      error: (error) => console.warn("Error", error),
      complete: () => {
        console.log('Number or Issues in completed:', this.issuesList.length)
        this.refreshMarkers(map)
      }
    });
  }

  refreshMarkers(map: L.Map) {
    console.log('Number or Issues in refreshMarkers:', this.issuesList.length);
    //this.mapMarkers.push(marker([47.127058, 6.932254], { icon: defaultIcon }).bindTooltip('Demo3'));
    //OK this.mapMarkers.push(this.addNewMarkerFromIssue(this.issuesList[1]));
    for (var i = 0; i < this.issuesList.length; i++) {
      this.mapMarkers.push(this.addNewMarkerFromIssue(this.issuesList[i], map));
    }
  }

  addNewMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    console.log('Issue received :', oneIssue.location.coordinates, '-', oneIssue.description);
    let oneMarker = L.marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon }).bindTooltip(oneIssue.description);
    console.log('Map :', map);
    console.log('Add marker to the map..');
    // DO not work correctly because this.map not defined!
    oneMarker.addTo(map);
    return oneMarker;
  }

  displayMarkers() {
    console.log('Current markers : ', this.mapMarkers);
  }

  getClickedPosition(data) {
    // let title = data.targe.title;
    // console.log('User clicked on position', data.target.options.title)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('*** ngAfterViewInit', this.map);
    this.initMap();
    console.log('In AfterViewrInit', this.map);
    this.addIssuesMarkers(this.map);

    console.log('Default markers added : ', this.mapMarkers);
  }

}
