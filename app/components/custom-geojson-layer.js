import { later } from '@ember/runloop';
import GeojsonLayer from 'ember-leaflet/components/geojson-layer';

export default GeojsonLayer.extend({
  layerLifeTime: 10000,

  // Remove group-layer after 10 seconds
  addToContainer() {
    this._super(...arguments);
    later(this, function() {
      this.removeFromContainer();
    }, this.get('layerLifeTime'));
  }
});
