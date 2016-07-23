import Ember from 'ember';

/**
 * Helper functions similar to Ember.computed helpers
 */
export default {

  /**
   * If the value stored at the dependentKey evaluates to true
   * then `value` is returned, otherwise `elseValue` is returned
   */
  ifElse(dependentKey, value, elseValue) {
    return Ember.computed(dependentKey, function(){
      return this.get(dependentKey) ? value : elseValue;
    });
  },

  /**
   * If the value stored at the dependentKey evaluates to true
   * then the value stored at `key` is returned, otherwise the value at `elseKey`
   */
  ifElseKeys(dependentKey, key, elseKey) {
    return Ember.computed(dependentKey, key, elseKey, function(){
      return this.get(this.get(dependentKey) ? key : elseKey);
    });
  },

  /**
   * Returns the first item in the target colelction with a property
   * at key matching the provided value
   *
   * Note: This is an O(n) operation, it should not be used with large collections
   *
   * Ex:
   *
   *    instrument: Ember.computed.findBy('instruments', 'type', 'DEBIT_CARD'),
   *
   */
  findBy(collectionKey, key, value) {
    return Ember.computed(collectionKey, function(){
      var collection = this.get(collectionKey);
      return collection && Ember.A(collection).findBy(key, value);
    });
  },

  /**
   * Returns true if the provided value is in the enumerable collection
   *
   * Note: This is an O(n) operation, it should not be used with large collections
   *
   * Ex:
   *
   *    instrument: Ember.computed.findBy('supported_instrument_types', 'DEBIT_CARD'),
   *
   */
  contains(collectionKey, value) {
    return Ember.computed(collectionKey, function(){
      var collection = this.get(collectionKey);
      return collection && collection.contains(value);
    });
  },

  /**
   * Iterates the collection and uses the values at selector
   * as keys to populate a hashtable containing the items.
   *
   * posts: [{guid: 'foo', body:'one'}, {guid: 'bar', body: 'two'}]
   * idLookup: Ember.computed.indexBy('posts.[]', 'guid')
   *
   * // idLookup has the value:
   *  {
   *    foo: {guid: 'foo', body:'one' },
   *    bar: {guid: 'bar', body: 'two'}
   *  }
   *
   */
  indexBy(dependentKey, selector) {
    return Ember.computed(dependentKey, function(){
      var collection = this.get(dependentKey),
          result = {};
      if (collection && typeof collection.forEach === 'function'){
        collection.forEach(function(item){
          let key = item.get(selector);
          if (key) {
            result[key] = item;
          }
        });
      }
      return result;
    });
  },

  /**
   * Tests that the value at `dependentKey` is not equal to the provided value.
   *
   * city: 'Montreal',
   * isMontreal: Ember.computed.equal('city', 'Montreal')
   * isNotMontreal: Ember.computed.notEqual('city', 'Montreal')
   *
   * // isMontreal is true
   * // isNotMontreal is false
   */
  notEqual(dependentKey, value) {
    Ember.assert(value, "notEqual requires a value for comparison");
    return Ember.computed(dependentKey, function() {
      return this.get(dependentKey) !== value;
    });
  },

  /**
   * Takes an unlimited number of arguments. (key, key, key, ... , fn)
   * The first n-1 arguments are keys to properties on the object.
   * The nth argument is a function.
   *
   * The function will be called with the values stored at each of the keys.
   * The order of the keys provided will be preserved when they are passed to the function.
   * Inside the provided function `this` is the parent object.
   *
   * Ex:
   *
   *    total: Ember.computed.fn( 'amount', 'fee', 'tax', function(amount, fee, tax){
   *      return amount + fee + tax;
   *    }
   */
  fn() {
    var fn = arguments[arguments.length - 1],
        dependentKeys = Array.prototype.slice.call(arguments, 0, -1),
        computedArgs = dependentKeys.slice();

    computedArgs.push( function(){
      return fn.apply(this, dependentKeys.map( (key) => { return this.get(key); }));
    });

    return Ember.computed.apply(Ember, computedArgs);
  }
};
