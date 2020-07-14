import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private hasApi: boolean;

  constructor() {
    this.hasApi = 'geolocation' in navigator;
  }

  getCurrentPosition(options: PositionOptions = {}): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (!this.hasApi) {
        reject('The Geolocation API is not available on this browser');
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  }

  watchPosition(options: PositionOptions = {}): Observable<Position> {
    return new Observable((subscriber) => {
      if (!this.hasApi) {
        subscriber.error(
          'The Geolocation API is not available on this browser'
        );
        subscriber.complete();
      }
      navigator.geolocation.watchPosition(
        (position) => subscriber.next(position),
        (error) => subscriber.error(error),
        options
      );
    });
  }
}