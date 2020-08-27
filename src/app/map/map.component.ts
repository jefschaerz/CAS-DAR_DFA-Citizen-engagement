import { Component, OnInit, Input } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { registerEscClick } from 'ngx-bootstrap/utils';
import { MapCoordinates } from 'src/app/models/map-coordinates.model';
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() addNewMarkerOnMapAllowed: boolean;
  // Array for issues to display (search or filter)

  map: Map;
  mapPoint: MapCoordinates;
  mapMarkers: Marker[];
  mapOptions: MapOptions;
  lastLayer: any;
  // Array for ALL issues defined
  stdMarkers: Issue[];
  newMarker: Marker;
  newMarkerPosition: number[];

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService,
    private markersList: MarkersListService) {
    this.stdMarkers = [];
    this.mapMarkers = [];
    this.addNewMarkerOnMapAllowed = false;
    console.log('End of MapComponent constructor....');
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();

    // Subscribe to update marker position on click
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
    });

    // Subscribe to update marker to display
    this.markersList.currentStdMarkers.subscribe(marker => {
      this.stdMarkers = marker;
      this.refreshMarkers(this.map, this.stdMarkers);
      console.log('New markers list', this.stdMarkers)
    });
    console.log('** End of ngONInit : AddNewMarkerAllowed : ', this.addNewMarkerOnMapAllowed);
  }

  onMarkedDragEnd(event: DragEvent) {
    console.log('drag end', event);
  };

  initializeMap(map: Map) {
    // Called automatically when map is ready 
    console.log('------ initalizeMap called ------');
    this.map = map;
    //this.getListOfAllIssues();
    this.refreshMarkers(this.map, this.stdMarkers);
    // If necessary... (not possible with leaftlMoveEnd in html)
    // this.map.on('moveend', () => {
    //   const center = this.map.getCenter();
    //   console.log(`Map moved to ${center.lng}, ${center.lat}`);
    // });
  };

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

  // Update newMarker position in shared service for other components
  refreshNewMarkerPosition(NewLat: number, NewLong: number) {
    this.markerPosition.changeValues([NewLat, NewLong]);
  }

  onMapClick(e: LeafletMouseEvent) {
    console.log('OnMapClick...')
    console.log('List of issues to display', this.stdMarkers);
    this.refreshMarkers(this.map, this.stdMarkers);
    // Click allowed on ly in Add Issue mode
    if (this.addNewMarkerOnMapAllowed) {
      console.log('Add mode because addnNewMarkedAllowed: ', this.addNewMarkerOnMapAllowed);
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
      latitude: environment.defaultCityCenterPointLat,
      longitude: environment.defaultCityCenterPointLng
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
      // City defined in enviromment
      center: latLng(environment.defaultCityCenterPointLat, environment.defaultCityCenterPointLng),

    };
  }

  private clearMap() {
    if (this.map.hasLayer(this.newMarker)) this.map.removeLayer(this.newMarker);
  }
}
