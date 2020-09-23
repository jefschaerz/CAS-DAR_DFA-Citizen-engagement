import { Component, OnInit, Input, NgZone } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent, LatLngBounds } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { registerEscClick } from 'ngx-bootstrap/utils';
import { MapCoordinates } from 'src/app/models/map-coordinates.model';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { GeolocationService } from '../shared/services/geolocation.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() addNewMarkerOnMapAllowed: boolean;

  map: Map;
  mapPoint: MapCoordinates;
  // Array for issues to dispay on map
  mapMarkers: Marker[];
  mapOptions: MapOptions;
  lastLayer: any;
  // Array for ALL issues to display std (updated by the service)
  stdMarkers: Issue[];
  newMarker: Marker;
  newMarkerPosition: number[];
  userCurrentLocationLat: number = environment.defaultCityCenterPointLat;
  userCurrentLocationLong: number = environment.defaultCityCenterPointLng;

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService,
    private markersList: MarkersListService,
    private router: Router,
    private geolocation: GeolocationService,
    private ngZone: NgZone) {
    this.stdMarkers = [];
    this.mapMarkers = [];
    this.addNewMarkerOnMapAllowed = false;
    console.log('End of MapComponent constructor....');

    this.geolocation
      .getCurrentPosition()
      .then((position) => {
        //console.log('User located!', position);
        this.userCurrentLocationLat = position.coords.latitude;
        this.userCurrentLocationLong = position.coords.longitude;
      })
      .catch((error) => {
        console.warn('Failed to locate user because', error);
      });
  }

  // Workaround to navigate in the zone and avoid warning
  public navigate(commands: any[]): void {
    console.log("ngZone.run..")
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();

    // Debug

    // Subscribe to the markerPosition service to be informed on current issue marker position change
    // TODO : NOT WORKING : Why not updated received !!
    // this.markerPosition.currentPosition.subscribe(position => {
    //   console.log("Change Marker position detected !", position);
    //   this.newMarkerPosition = position;
    //   // Warning not defined !!
    //   this.updateThisIssueMapPoint(position[0], position[1]);
    //   this.updateThisIssueMarker();
    //});
    console.log('** End of ngONInit : AddNewMarkerAllowed : ', this.addNewMarkerOnMapAllowed);
  }

  ngAfterViewInit() {
    // Subscribe to the markerlist service to be informed on markers to display
    // Not in ngOnInit --> generate a ExpressionChangedAfterItHasBeenCheckedError ! 
    this.markersList.currentStdMarkers.subscribe(marker => {
      this.stdMarkers = marker;
      this.refreshMarkers(this.map, this.stdMarkers);
      console.log('Markers updated in ngAfterViewInit ', this.stdMarkers, this.map);
    });

    console.log('** End of ngAfterONInit : AddNewMarkerAllowed : ', this.addNewMarkerOnMapAllowed);
  }

  useCurrentUserlocation() {
    this.markerPosition.setNewPosition([this.userCurrentLocationLat, this.userCurrentLocationLong])
    this.updateThisIssueMapPoint(this.userCurrentLocationLat, this.userCurrentLocationLong);
    this.updateThisIssueMarker();
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

  onMarkedDragEnd(event: DragEvent) {
    console.log('drag end', event);
  };

  initializeMap(map: Map) {
    // Called automatically when map is ready 
    console.log('------ initalizeMap called ------');
    this.map = map;
  };

  refreshMarkers(map: L.Map, selectedIssueList: Issue[]) {
    this.mapMarkers = [];
    for (var i = 0; i < selectedIssueList.length; i++) {
      this.mapMarkers.push(this.addMarkerFromIssue(selectedIssueList[i], map));
    }
    console.log('Number of Markers to display:', this.mapMarkers);
  }

  addMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    let oneMarker = marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon, alt: oneIssue.description }).bindTooltip(oneIssue.description);
    oneMarker.addTo(map);
    oneMarker.on('click', e => this.onMarkerClicked(oneIssue.id));
    return oneMarker;
  }

  // Update new marker position in shared service for other components
  updateServiceWithCurrentIssueNewPosition(NewLat: number, NewLong: number) {
    this.markerPosition.setNewPosition([NewLat, NewLong]);

  }

  onMapClick(e: LeafletMouseEvent) {
    // Update this issue marker only in Add Issue mode
    if (this.addNewMarkerOnMapAllowed) {
      this.updatethisIssueMarkerOnMap(e.latlng.lat, e.latlng.lng)
    }
  }

  updatethisIssueMarkerOnMap(lat: number, lng: number) {
    this.updateThisIssueMapPoint(lat, lng);
    this.updateThisIssueMarker();
    this.updateServiceWithCurrentIssueNewPosition(lat, lng);
  }


  private updateThisIssueMapPoint(latitude: number, longitude: number, name?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };
  }

  onMarkerClicked(IssueId: string) {
    console.log('Marker clicked', IssueId);
    // Only allwow to view issue info (not edit)
    this.navigate(['/viewissue', IssueId]);
  }

  private updateThisIssueMarker() {
    // Remove current marker
    if (this.map.hasLayer(this.newMarker)) this.map.removeLayer(this.newMarker);
    // Update marker with mapPoint position
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.newMarker = marker([coordinates.lat, coordinates.lng], { icon: greenIcon, draggable: false }).addTo(this.map);
    this.newMarker.bindTooltip("Your new issue");

    // Center map on the new marker and zoom on it 
    this.map.setView(coordinates, 16);
    console.log('updateThisIssueMarker at position : Lat : ', coordinates.lat, '/ Lng: ', coordinates.lng);
  }
}
