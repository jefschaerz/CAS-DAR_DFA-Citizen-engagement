import { Component, OnInit } from '@angular/core';
import { latLng, MapOptions, tileLayer, marker, Marker, LatLngExpression } from 'leaflet';
import { defaultIcon } from './default-marker';
import { IssueService } from '../../api/services/issue.service';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: L.Map;
  mapOptions: MapOptions;
  mapMarkers: Marker[];
  issuesList: Issue[];

  constructor(private issueService: IssueService) {
    this.issuesList = [];
    // Define mapOptions
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18 }
        )
      ],
      zoom: 13,
      // Center on Renan
      center: latLng(47.125058, 6.932254)
    };
    // Define some mapMarkers with linked actions
    this.mapMarkers = [
      marker([47.125058, 6.932254], { icon: defaultIcon }).bindTooltip('Demo1')
    ];

    console.log('addIssuesMarkers called');
    this.addIssuesMarkers();
    this.refreshMarkers();

    this.mapMarkers.push(marker([47.126058, 6.942254], { icon: defaultIcon }).bindTooltip('Demo2')
    );
    console.log('Default markers added : ', this.mapMarkers);
    //TODO : Define L.Map and set opions correctly
    //this.map.options = this.mapOptions;


  }

  addIssuesMarkers() {
    // https://stackblitz.com/edit/angular-ngx-leaflet-tests-3p74ln
    // Need to link with the issue service
    // simply iterate over the array of markers from our data service
    // and add them to the map
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => {
        this.issuesList = result;
        console.log("Issues loaded in ISSUES (by MAP are ", this.issuesList);
      },
      error: (error) => console.warn("Error", error),
      complete: () => {
        this.refreshMarkers()
      }
    });


  }

  refreshMarkers() {
    console.log('Refresh markers..',);
    console.log('Number or Issues :', this.issuesList.length);
    this.mapMarkers.push(marker([47.127058, 6.932254], { icon: defaultIcon }).bindTooltip('DemoX'));
    this.issuesList.forEach(function (issue) {
      console.log('Each... : ', issue.description);
      console.log('LatLng ... : ', <LatLngExpression>(issue.location.coordinates));
      //this.mapMarkers.push(marker(<LatLngExpression>(issue.location.coordinates), { icon: defaultIcon }).bindTooltip(issue.description));
    });
  }

  addNewMarker() {
    //this.mapMarkers.push(marker(<LatLngExpression>(issue.location.coordinates), { icon: defaultIcon }).bindTooltip(issue.description));
  }

  displayMarkers() {
    console.log('Current markers : ', this.mapMarkers);
  }

  getClickedPosition(data) {
    // let title = data.targe.title;
    // console.log('User clicked on position', data.target.options.title)
  }
  // Convert issue to marker
  convertIssueToMarker(issue: Issue): Marker {
    let oneMarker: Marker;
    oneMarker = marker([47.125058, 6.932254], { icon: defaultIcon }).bindTooltip('Demo1');
    //oneMarker(issue.location.coordinates.);
    return oneMarker;

  }

  ngOnInit(): void {
  }

}
