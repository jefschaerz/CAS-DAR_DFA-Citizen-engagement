import { Component, OnInit } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { registerEscClick } from 'ngx-bootstrap/utils';

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
  newMarker: Marker;
  newMarkerPosition: number[];

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService) {
    this.issuesList = [];
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18 }
        )
      ],
      zoom: 13,
      // Renan BE
      center: latLng(47.126058, 6.942254)
    };
    this.mapMarkers = [];
  }

  onMarkedDragEnd(event: DragEvent) {
    console.log('drag end', event);
  };
  // Called automatically when map is ready 
  onMapReady(map: Map) {
    console.log('Map READY called');
    this.map = map;

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      console.log(`Map moved to ${center.lng}, ${center.lat}`);
    });

    // On Click on the map
    this.map.on('click', <LeafletMouseEvent>(event) => {
      console.log(`Map clicked EVENT`);
      // Add a new Marker only if not yet on the map else remove
      if (this.newMarker) {
        map.removeLayer(this.newMarker);
      }
      console.log(event.latlng);
      // Add this new marker with green icon and NOT yet draggable (TODO : not working now)
      this.newMarker = marker(event.latlng, { icon: greenIcon, draggable: false }).bindTooltip("New").addTo(map);
      this.refreshNewMarkerPosition(this.newMarker.getLatLng().lat, this.newMarker.getLatLng().lng);

      // NOT WORKING :  On drag currentMarker
      // this.newMarker.on('dragend', function (event) {
      //   var marker = event.target;
      //   console.log('Draged latitude : ', marker.getLatLng().lat);
      //   console.log('Draged longitude : ', marker.getLatLng().lng);
      // - TODO TO FIX
      //this.refreshNewMarkerPosition(marker.getLatLng().lat, marker.getLatLng().lng)
      //});
      // Disable click (for see all issues only)
      // this.map.off('click');
    });
    // Display curent issues with markers
    this.addIssuesMarkers();

  }

  addIssuesMarkers() {
    // Need to link with the issue service
    // simply iterate over the array of markers from our issue service
    // and add them to the map
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => {
        this.issuesList = result;
        console.log("Issues loaded : ", this.issuesList);
      },
      error: (error) => console.warn("Error during issues loading", error),
      complete: () => {
        //console.log('Number or Issues in completed:', this.issuesList.length)
        this.refreshMarkers(this.map)
      }
    });
  }

  refreshMarkers(map: L.Map) {
    console.log('Number of Issues in refreshMarkers:', this.issuesList.length);
    // Clear current markers
    this.mapMarkers = [];
    for (var i = 0; i < this.issuesList.length; i++) {
      this.mapMarkers.push(this.addNewMarkerFromIssue(this.issuesList[i], map));
    }
    console.log('Number of Markers:', this.mapMarkers);
  }

  addNewMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    console.log('Issue received :', oneIssue.location.coordinates, '-', oneIssue.description);
    let oneMarker = marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon }).bindTooltip(oneIssue.description);
    console.log('Add marker to the map..');
    oneMarker.addTo(map);
    return oneMarker;
  }

  getNewMarkerCoordinates() {
    console.log('NewMarker coordinates are :')
  }

  refreshNewMarkerPosition(NewLat: number, NewLong: number) {
    this.markerPosition.changeValues([NewLat, NewLong]);
  }

  ngOnInit(): void {
    // Update marker position on change
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
    });




  }
}
