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

  // private user = new BehaviorSubject<string>('john');
  // castUser = this.user.asObservable();

  constructor() {

  }

  // editUser(newUser) {
  //   this.user.next(newUser);
  // }

  // Voir  : https://stackblitz.com/edit/angular-behaviorsubject-example?file=src%2Fapp%2Fservices%2Fuser.service.ts

  // Create already with default values - Not working
  private positionSource = new BehaviorSubject([this.latitude, this.longitude]);
  currentPosition = this.positionSource.asObservable();

  //Change the current value of the marker position
  changeValues(LatLong = []) {
    this.positionSource.next(LatLong)
    console.log("Marker position changed in service !")
  }
}
