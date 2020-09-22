import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service providing NewIssueMarker current position to several components (by subscription)
// Based on resource : https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/

@Injectable({
  providedIn: 'root'
})
export class MarkerPositionService {
  private latitude = 47.12466270666165;
  private longitude = 6.925011754915126;

  private positionSource = new BehaviorSubject([this.latitude, this.longitude]);
  currentPosition = this.positionSource.asObservable();

  constructor() { }

  // Change the current value of the marker position
  changeValues(LatLong = []) {
    this.positionSource.next(LatLong)
    console.log("Marker position changed in service !")
  }

}
