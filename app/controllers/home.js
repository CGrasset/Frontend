import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { A } from '@ember/array';
import { isArray } from '@ember/array';
import config from '../config/environment';
import Ember from 'ember';

const { inject } = Ember;

export default Controller.extend({
  socket: inject.service('cable'),
  wsURL: config.WS_URL,
  salesConsumer: null,
  salesSummaryConsumer: null,
  salesData: A(),
  salesSummary: null,

  // Create consumers on controller initialize
  setupConsumers: on('init', function() {
    this.setupSalesConsumer();
    this.setupSalesSummaryConsumer();
  }),

  // Consumer setup for channel 'SalesChannel'
  setupSalesConsumer() {
    let consumer = this.setupConsumer('SalesChannel', 'salesData');
    this.set('salesConsummer', consumer);
  },

  // Consumer setup for channel 'SalesSummaryChannel'
  setupSalesSummaryConsumer(){
    let consumer = this.setupConsumer('SalesSummaryChannel', 'salesSummary');
    this.set('salesSummaryConsumer', consumer);
  },

  // Consumer setup
  setupConsumer(channel, setAttribute){
    let consumer  = this.get('socket').createConsumer(this.get('wsURL'));
    let self      = this;

    consumer.subscriptions.create(channel, {
      connected() {
        this.perform('request');
      },
      received(data) {
        if (isArray(self.get(setAttribute))){
          self.get(setAttribute).pushObject(data);
        }else{
          self.set(setAttribute, data);
        }
      },
      disconnect() {}
    });
  },

  // Create new sales record on ember-data
  sale: computed(function() {
    return this.store.createRecord('sale');
  }),

  // Query for a city
  searchCity(term) {
    return this.get('store').query('city', { city: { url_name: term } });
  },

  // Update layers
  saleData: computed('salesData', function() {
    return this.get('salesData') === null ? [] : this.get('salesData');
  }),

  actions: {
    // Action handler for origin city selector
    searchOrigin(term) {
      return this.get('sale').set('originId', this.searchCity(term));
    },

    // Action handler for destination city selector
    searchDestination(term) {
      return this.get('sale').set('destinationId', this.searchCity(term));
    },

    // On submit action handler
    // Create actual ember-data sales record on DB
    submit(){
      this.get('sale').set('originId', parseInt(this.get('sale.originId.id')));
      this.get('sale').set('destinationId', parseInt(this.get('sale.destinationId.id')));
      this.get('sale').save();

      this.set('sale', this.store.createRecord('sale'));
    }
  }
});
