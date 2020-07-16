import { Component, OnInit } from '@angular/core';
import { defaultIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: Map;
  mapMarkers: Marker[];
  mapOptions: MapOptions;
  issuesList: Issue[];

  constructor(private issueService: IssueService) {
    this.issuesList = [];
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18 }
        )
      ],
      zoom: 13,
      center: latLng(47.126058, 6.942254)
    };
    this.mapMarkers = [];
    //   marker([47.127058, 6.942254], { icon: defaultIcon }),
    //   marker([47.128058, 6.942254], { icon: defaultIcon }),
    //   marker([47.129058, 6.942254], { icon: defaultIcon })
    // ];
  }

  onMapReady(map: Map) {
    this.map = map;
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
        console.log("Issues loaded : ", this.issuesList);
        console.log('Number or Issues :', this.issuesList.length)
      },
      error: (error) => console.warn("Error", error),
      complete: () => {
        console.log('Number or Issues in completed:', this.issuesList.length)
        this.refreshMarkers(this.map)
      }
    });
  }

  refreshMarkers(map: L.Map) {
    console.log('Number or Issues in refreshMarkers:', this.issuesList.length);
    for (var i = 0; i < this.issuesList.length; i++) {
      this.mapMarkers.push(this.addNewMarkerFromIssue(this.issuesList[i], map));
    }
  }

  addNewMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    console.log('Issue received :', oneIssue.location.coordinates, '-', oneIssue.description);
    let oneMarker = marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon }).bindTooltip(oneIssue.description);
    console.log('Add marker to the map..');
    // DO not work correctly because this.map not defined!
    oneMarker.addTo(map);
    return oneMarker;
  }

  ngOnInit(): void {
  }

}
