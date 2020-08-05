import { Component, OnInit, Input } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { registerEscClick } from 'ngx-bootstrap/utils';
import { MapCoordinates } from 'src/app/models/map-coordinates.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() addNewMarkerAllowed: boolean;
  @Input() issuesToDisplay: Issue[];

  map: Map;
  mapPoint: MapCoordinates;
  mapMarkers: Marker[];
  mapOptions: MapOptions;
  lastLayer: any;
  // Array for ALL issues defined
  issuesList: Issue[];
  // Array for issues to display (search or filter)
  issuesListtoDipsplay: Issue[];
  newMarker: Marker;
  newMarkerPosition: number[];

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService) {
    this.issuesList = [];
    this.mapMarkers = [];
    this.addNewMarkerAllowed = false;
    console.log('End of MapComponent constructor....');
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();

    // Update marker position on change
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
    });
    console.log('** ngONInit : AddNewMarkerAllowed : ', this.addNewMarkerAllowed);
  }

  onMarkedDragEnd(event: DragEvent) {
    console.log('drag end', event);
  };

  initializeMap(map: Map) {
    // Called automatically when map is ready 
    console.log('------ initalizeMap called ------');
    this.map = map;
    this.getListOfAllIssues();
    this.refreshMarkers(this.map, this.issuesList);
    // If necessary... (not possible with leaftlMoveEnd in html)
    // this.map.on('moveend', () => {
    //   const center = this.map.getCenter();
    //   console.log(`Map moved to ${center.lng}, ${center.lat}`);
    // });
  };

  onMapReady(map: Map) {

    //this.map = map;

    // Allow to add a NEW marker only if in add issue mode (not in edit mode)
    // if (this.addNewMarkerAllowed) {
    //   console.log('Add mode because addnNewMarkedAllowed: ', this.addNewMarkerAllowed);
    //   this.map.on('click', <LeafletMouseEvent>(event) => {
    //     console.log(`Map clicked EVENT`);
    //     // Add a new Marker only if not yet on the map else remove
    //     if (this.newMarker) {
    //       map.removeLayer(this.newMarker);
    //     }
    //     console.log(event.latlng);
    //     // Add this new marker with green icon and NOT yet draggable (TODO : not working now)
    //     this.newMarker = marker(event.latlng, { icon: greenIcon, draggable: false }).bindTooltip("New").addTo(map);
    //     this.refreshNewMarkerPosition(this.newMarker.getLatLng().lat, this.newMarker.getLatLng().lng);

    //     // NOT WORKING :  On drag currentMarker
    //     // this.newMarker.on('dragend', function (event) {
    //     //   var marker = event.target;
    //     //   console.log('Draged latitude : ', marker.getLatLng().lat);
    //     //   console.log('Draged longitude : ', marker.getLatLng().lng);
    //     // - TODO TO FIX
    //     //this.refreshNewMarkerPosition(marker.getLatLng().lat, marker.getLatLng().lng)
    //     //});
    //     // Disable click (for see all issues only)
    //     // this.map.off('click');
    //   });

    // }
    // else {
    //   console.log('Edit mode because addnNewMarkedAllowed:: ', this.addNewMarkerAllowed);
    // }
    // Get all issues available
    // this.getListOfAllIssues();
    // this.refreshMarkers(this.map, this.issuesList);
  }

  getListOfAllIssues() {
    // Subscribe to get list of all issues
    this.issueService.loadAllIssues().subscribe({
      next: (result) => {
        this.issuesList = result;
        console.log("Issues loaded : ", this.issuesList);
      },
      error: (error) => console.warn("Error during issues loading", error),
      complete: () => {
        //console.log('Number or Issues in completed:', this.issuesList.length)
        this.refreshMarkers(this.map, this.issuesList);
      }
    });
  }

  refreshMarkers(map: L.Map, selectedIssueList: Issue[]) {
    console.log('Number of Issues in refreshMarkers:', selectedIssueList.length);
    // Clear current markers
    this.mapMarkers = [];
    for (var i = 0; i < selectedIssueList.length; i++) {
      this.mapMarkers.push(this.addNewMarkerFromIssue(selectedIssueList[i], map));
    }
    console.log('Number of Markers:', this.mapMarkers);
  }

  addNewMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    //console.log('Issue received :', oneIssue.location.coordinates, '-', oneIssue.description);
    let oneMarker = marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon }).bindTooltip(oneIssue.description);
    //console.log('Add marker to the map..');
    oneMarker.addTo(map);
    return oneMarker;
  }

  // Updte newMarker position in sahred service for other components
  refreshNewMarkerPosition(NewLat: number, NewLong: number) {
    this.markerPosition.changeValues([NewLat, NewLong]);
  }

  onMapClick(e: LeafletMouseEvent) {
    console.log('OnMapClick...')
    // Click allowed on ly in Add Issue mode
    if (this.addNewMarkerAllowed) {
      console.log('Add mode because addnNewMarkedAllowed: ', this.addNewMarkerAllowed);
      this.clearMap();
      this.updateMapPoint(e.latlng.lat, e.latlng.lng);
      this.createNewMarker();
    }
  }

  onMapMove(e: LeafletMouseEvent) {
    console.log('OnMapMove...')
    const center = this.map.getCenter();
    console.log(`Map moved to ${center.lng}, ${center.lat}`);
  }

  private updateMapPoint(latitude: number, longitude: number, name?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };
  }

  private createNewMarker() {
    this.clearMap();
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.newMarker = marker([coordinates.lat, coordinates.lng], { icon: greenIcon, draggable: false }).bindTooltip("New").addTo(this.map);
    // Not working Drag
    // this.newMarker.on('dragend', function (event) {
    //   var marker = event.target;
    //   console.log('Draged latitude : ', marker.getLatLng().lat);
    //   console.log('Draged longitude : ', marker.getLatLng().lng);
    //   this.refreshNewMarkerPosition(this.marker.getLatLng().lat, marker.getLatLng().lng)
    // })
    // Refresh newMarker position in shared service 
    this.refreshNewMarkerPosition(this.newMarker.getLatLng().lat, this.newMarker.getLatLng().lng);
    // Center map on the new marker
    this.map.setView(coordinates, this.map.getZoom());
    console.log('createNewMarker at position : Lat : ', coordinates.lat, '/ Lng: ', coordinates.lng);
  }

  private initializeDefaultMapPoint() {
    this.mapPoint = {
      name: 'Default',
      latitude: 47.126058,
      longitude: 6.942254
      // Renan BE
    };
  }
  private initializeMapOptions() {
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
  }

  private clearMap() {
    if (this.map.hasLayer(this.newMarker)) this.map.removeLayer(this.newMarker);
  }
}
