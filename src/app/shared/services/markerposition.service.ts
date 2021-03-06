import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Service providing NewIssueMarker current position to several components (by subscription)
// Based on resource : https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/

@Injectable({
  providedIn: 'root'
})
export class MarkerPositionService {
  private oneMarker = [];
  constructor() {
  }
  // Voir  : https://stackblitz.com/edit/angular-behaviorsubject-example?file=src%2Fapp%2Fservices%2Fuser.service.ts

  // Create already with default values - Not working
  private positionSource = new BehaviorSubject(this.oneMarker);
  currentPosition = this.positionSource.asObservable();

  // Change the current value of the marker position
  setNewPosition(LatLong) {
    this.positionSource.next(LatLong)
    console.log("Marker position changed in service !")
  }
}
