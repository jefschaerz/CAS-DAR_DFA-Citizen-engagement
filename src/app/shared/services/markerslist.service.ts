import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service providing Markeslist to other components (by subscription)
// Based on ressource : https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/

@Injectable({
  providedIn: 'root'
})
export class MarkersListService {
  private stdMarkers = [];

  private markersListSource = new BehaviorSubject(this.stdMarkers);
  currentStdMarkers = this.markersListSource.asObservable();

  constructor() { }

  changeStdMarkersList(newStdMarkersList) {
    this.markersListSource.next(newStdMarkersList)
    console.log('List of Markers updated in service', newStdMarkersList);
  }
}
