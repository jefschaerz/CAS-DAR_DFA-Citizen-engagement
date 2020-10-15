import { Component, OnInit, Input, NgZone } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent, LatLngBounds, featureGroup, FeatureGroup } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { registerEscClick } from 'ngx-bootstrap/utils';
import { MapCoordinates } from 'src/app/models/map-coordinates.model';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { GeolocationService } from '../shared/services/geolocation.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() displayIssueMarker: boolean;
  @Input() displayAllMarkers: boolean;
  @Input() changeIssueMarkerAllowed: boolean = false;
  @Input() applyCenterOnIssue: boolean;

  map: Map;
  mapPoint: MapCoordinates;
  // Array for issues to display on map
  mapMarkers: Marker[];
  mapOptions: MapOptions;
  lastLayer: any;
  // Array for ALL issues to display std (updated by the service)
  stdMarkers: Issue[];
  newMarker: Marker;

  userCurrentLocationLat: number = environment.defaultCityCenterPointLat;
  userCurrentLocationLong: number = environment.defaultCityCenterPointLng;
  markersListSubscription: Subscription;
  markerPositionSubscription: Subscription;
  issuesMarkersGroup: FeatureGroup;

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService,
    private markersList: MarkersListService,
    private router: Router,
    private geolocation: GeolocationService,
    private ngZone: NgZone) {
    this.stdMarkers = [];
    this.mapMarkers = [];
    this.displayIssueMarker = false;
    console.log('End of MapComponent constructor....');

    this.geolocation
      .getCurrentPosition()
      .then((position) => {
        this.userCurrentLocationLat = position.coords.latitude;
        this.userCurrentLocationLong = position.coords.longitude;
      })
      .catch((error) => {
        console.warn('Failed to locate user because', error);
      });

    // Create markers layers
    this.issuesMarkersGroup = featureGroup();
  }

  // Workaround to navigate in the zone and avoid warning
  public navigate(commands: any[]): void {
    console.log("ngZone.run..")
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    console.log("AfterngONInit Point : ", this.mapPoint);
    this.initializeMapOptions();
  }

  ngAfterViewInit() {
    // Subscribe to the markerlist service to be informed on markers to display
    // Not in ngOnInit --> generate a ExpressionChangedAfterItHasBeenCheckedError ! 
    if (this.displayAllMarkers) {
      this.markersListSubscription = this.markersList.currentStdMarkers.subscribe(marker => {
        this.stdMarkers = marker;
        this.refreshMarkers(this.map, this.stdMarkers);
      });
    }
    this.issuesMarkersGroup.addTo(this.map);

    // Subscribe to the markerPosition service to be informed on current issue marker position change
    // Only if in EDIT issue mode
    if (this.displayIssueMarker) {
      this.markerPositionSubscription = this.markerPosition.currentPosition.subscribe(position => {
        this.updateThisIssueMapPoint(position[0], position[1]);
        this.updateThisIssueMarker();
      });
    }

    if (this.applyCenterOnIssue) {
      this.centerMapOnIssue();
    }
    console.log("Center on issue : ", this.applyCenterOnIssue);
    console.log("Current Point : ", this.mapPoint);
  }

  ngOnDestroy() {
    if (this.markersListSubscription) {
      this.markersListSubscription.unsubscribe();
    };
    if (this.markerPositionSubscription) {
      this.markerPositionSubscription.unsubscribe();
    };
  }
  useCurrentUserlocation() {
    this.updateThisIssueMapPoint(this.userCurrentLocationLat, this.userCurrentLocationLong);
    this.updateThisIssueMarker();
    this.updateServiceWithCurrentIssueNewPosition(this.userCurrentLocationLat, this.userCurrentLocationLong);
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

  initializeMap(map: Map) {
    this.map = map;
  };

  refreshMarkers(map: L.Map, selectedIssueList: Issue[]) {
    // Clear previous markers layers
    for (var i = 0; i < this.mapMarkers.length; i++) {
      this.issuesMarkersGroup.removeLayer(this.mapMarkers[i]);
    }
    // Create and add all markers in the featureGroup
    this.mapMarkers = [];
    for (var i = 0; i < selectedIssueList.length; i++) {
      // TODO : improvment: do not add current issue
      this.mapMarkers.push(this.addMarkerFromIssue(selectedIssueList[i], map));
    }
  }

  addMarkerFromIssue(oneIssue: Issue, map: L.Map): L.Marker {
    let oneMarker = marker(<L.LatLngExpression>(oneIssue.location.coordinates), { icon: defaultIcon, alt: oneIssue.description }).bindTooltip(oneIssue.description);
    // Add in the featuregroup layer
    oneMarker.addTo(this.issuesMarkersGroup);
    oneMarker.on('click', e => this.onMarkerClicked(oneIssue.id));
    return oneMarker;
  }

  // Update new marker position in shared service for other components
  updateServiceWithCurrentIssueNewPosition(NewLat: number, NewLong: number) {
    this.markerPosition.setNewPosition([NewLat, NewLong]);
  }

  onMapClick(e: LeafletMouseEvent) {
    // Update this issue marker only in Add Issue mode
    if (this.changeIssueMarkerAllowed) {
      this.updatethisIssueMarkerOnMap(e.latlng.lat, e.latlng.lng)
    }
  }

  updatethisIssueMarkerOnMap(lat: number, lng: number) {
    this.updateServiceWithCurrentIssueNewPosition(lat, lng);
    this.updateThisIssueMapPoint(lat, lng);
    this.updateThisIssueMarker();
  }

  private updateThisIssueMapPoint(latitude: number, longitude: number, name?: string) {
    if (latitude != undefined) {
      this.initializeDefaultMapPoint()
    }
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };
  }

  onMarkerClicked(IssueId: string) {
    // Allowed only in see issues
    if (!this.changeIssueMarkerAllowed) {
      console.log('Marker clicked', IssueId);
      // Only allow to view issue info (not edit)
      this.navigate(['/viewissue', IssueId]);
    }
  }

  private updateThisIssueMarker() {
    // Remove current marker
    if (this.map.hasLayer(this.newMarker)) this.map.removeLayer(this.newMarker);
    // Update marker with mapPoint position
    if (this.mapPoint.latitude != undefined) {
      const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
      this.newMarker = marker([coordinates.lat, coordinates.lng], { icon: greenIcon, draggable: false }).addTo(this.map);
      this.newMarker.bindTooltip("Current issue");
      this.centerMapOnIssue();
    }
  }

  centerMapOnIssue() {
    if (this.mapPoint.latitude != undefined) {
      const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
      this.map.setView(coordinates, 16);
      console.log("Centered on issue called !", this.mapPoint.latitude, this.mapPoint.longitude)
    }
  }
}
