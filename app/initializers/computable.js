import Ember from 'ember';
import Computable from 'ember-computable/utils/computable';
const { computed } = Ember;

export function initialize() {
  return;
}

// We don't want to rely on the initializers running in order to
// add these methods to the Ember.computed namespace. Doing it
// this way so these methods are available in unit tests.
(function() {
  Object.keys(Computable).forEach(function(key){
    if (!computed[key]) {
      computed[key] = Computable[key];
    }
  });
})();

export default {
  name: 'computable',
  initialize: initialize
};
