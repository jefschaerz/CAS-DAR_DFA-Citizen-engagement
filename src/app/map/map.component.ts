import { Component, OnInit, Input, NgZone } from '@angular/core';
import { defaultIcon, greenIcon } from './default-marker';
import { latLng, MapOptions, marker, Marker, Map, tileLayer, LeafletMouseEvent } from 'leaflet';
import { IssueService } from '../api/services/issue.service';
import { Issue } from 'src/app/models/issue';
import { MarkerPositionService } from 'src/app/shared/services/markerposition.service';
import { MarkersListService } from 'src/app/shared/services/markerslist.service';
import { registerEscClick } from 'ngx-bootstrap/utils';
import { MapCoordinates } from 'src/app/models/map-coordinates.model';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
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

  constructor(
    private issueService: IssueService,
    private markerPosition: MarkerPositionService,
    private markersList: MarkersListService,
    private router: Router,
    private ngZone: NgZone) {
    this.stdMarkers = [];
    this.mapMarkers = [];
    this.addNewMarkerOnMapAllowed = false;
    console.log('End of MapComponent constructor....');
  }

  // Workaround to navigate in the zone and avoir warning
  public navigate(commands: any[]): void {
    console.log("ngZone.run..")
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

  ngOnInit(): void {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();

    // Subscribe to update marker position on click
    this.markerPosition.currentPosition.subscribe(position => {
      this.newMarkerPosition = (position)
    });

    console.log('** End of ngONInit : AddNewMarkerAllowed : ', this.addNewMarkerOnMapAllowed);
  }

  ngAfterViewInit() {
    // Subscribe to update marker to display
    // Not in ngOnInit --> generate a ExpressionChangedAfterItHasBeenCheckedError ! 
    this.markersList.currentStdMarkers.subscribe(marker => {
      this.stdMarkers = marker;
      this.refreshMarkers(this.map, this.stdMarkers);
      console.log('Markers updated ', this.stdMarkers, this.map);
    });
    console.log('** End of ngAfterONInit : AddNewMarkerAllowed : ', this.addNewMarkerOnMapAllowed);
  }

  onMarkedDragEnd(event: DragEvent) {
    console.log('drag end', event);
  };

  initializeMap(map: Map) {
    // Called automatically when map is ready 
    console.log('------ initalizeMap called ------');
    this.map = map;
    //this.refreshMarkers(this.map, this.stdMarkers);
    // If necessary... (not possible with leaftlMoveEnd in html)
    // this.map.on('moveend', () => {
    //   const center = this.map.getCenter();
    //   console.log(`Map moved to ${center.lng}, ${center.lat}`);
    // });
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
    //     {
    //       console.log('Id of the issue', oneIssue.id);
    // //      this.router.navigate(['/editissue', oneIssue.id]);
    //     })
    return oneMarker;
  }

  // Update new marker position in shared service for other components
  refreshNewMarkerPosition(NewLat: number, NewLong: number) {
    this.markerPosition.changeValues([NewLat, NewLong]);
  }

  onMapClick(e: LeafletMouseEvent) {
    //console.log('OnMapClick...')
    //console.log('List of issues to display', this.stdMarkers);
    this.refreshMarkers(this.map, this.stdMarkers);
    // Update marker only in Add Issue mode
    if (this.addNewMarkerOnMapAllowed) {
      console.log('Add mode because addnNewMarkedAllowed: ', this.addNewMarkerOnMapAllowed);
      this.updateMapPoint(e.latlng.lat, e.latlng.lng);
      this.createNewMarker();
    }
    // Select issue in See issues
    else {
      console.log('Marker : ', e.target);
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

  onMarkerClicked(IssueId: string) {
    console.log('Marker clicked', IssueId);
    this.navigate(['/editissue', IssueId]);
  }

  private createNewMarker() {
    // Remove current marker
    if (this.map.hasLayer(this.newMarker)) this.map.removeLayer(this.newMarker);
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.newMarker = marker([coordinates.lat, coordinates.lng], { icon: greenIcon, draggable: false }).addTo(this.map);
    this.newMarker.bindTooltip("New issue");
    // JFS ?? this.newMarker.on({ click: this.onMarkerClicked });
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

}
