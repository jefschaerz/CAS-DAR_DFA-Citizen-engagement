import { Icon, IconOptions, icon } from 'leaflet';
export const defaultIcon: Icon<IconOptions> = icon({
    // This define the displayed icon size, in pixel
    iconSize: [25, 41],
    // This defines the pixel that should be placed right above the location
    // If not provided, the image center will be used, and that could be awkward
    iconAnchor: [13, 41],
    // The path to the image to display. In this case, it's a Leaflet asset
    iconUrl: 'leaflet/marker-icon.png',
    // The path to the image's shadow to display. Also a leaflet asset
    shadowUrl: 'leaflet/marker-shadow.png'
});
// Add colored markers from 
// https://github.com/pointhi/leaflet-color-markers

export const greenIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});