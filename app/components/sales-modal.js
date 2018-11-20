import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  sales: 0,
  price: 0,

  today: computed(function() {
    return new Date().toJSON().slice(0,10).replace(/-/g,'/');
  }),
});
