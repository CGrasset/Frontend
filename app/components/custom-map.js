import Component from '@ember/component';
import config from  '../config/environment';

export default Component.extend({
  classNames: ['map-container'],
  lat: -27.7123606,
  lng: -24.2137865,
  zoom: 4,
  tileLayerUrl: config.MAP_URL,
  data: null,

  // Bind markers popup on click
  onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.name);
  }
});
