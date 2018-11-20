import DS from 'ember-data';

export default DS.Model.extend({
  originId:       DS.attr(),
  destinationId:  DS.attr(),
  price:          DS.attr()
});
