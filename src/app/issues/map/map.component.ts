import { Component, OnInit } from '@angular/core';
import { latLng, MapOptions, tileLayer, marker, Marker } from 'leaflet';
import { defaultIcon } from './default-marker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: L.Map;
  mapOptions: MapOptions;
  mapMarkers: Marker[];

  constructor(/* ... */) {
    // Define mapOptions
    this.mapOptions = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18 }
        )
      ],
      zoom: 13,
      // Center on Renan
      center: latLng(47.125058, 6.932254)
    };
    // Define some mapMarkers with linked actions
    this.mapMarkers = [
      marker([47.125058, 6.932254], { icon: defaultIcon }).bindTooltip('Demo1'),
      marker([47.12262, 6.932255], { icon: defaultIcon }),
      marker([47.12270, 6.932256], { icon: defaultIcon })
    ];

    //TODO : Define L.Map and set opions correctly
    //this.map.options = this.mapOptions;
  }

  addIssuesMarkers() {
    // https://stackblitz.com/edit/angular-ngx-leaflet-tests-3p74ln
    // Need to link with the issue service
  }
  getClickedPosition(data) {
    // let title = data.targe.title;
    // console.log('User clicked on position', data.target.options.title)
  }

  ngOnInit(): void {
  }

}
