import Ember from 'ember';
import Composable from './composable';

// Opt-in to native array extensions
Ember.NativeArray.apply(Array.prototype);

/**
 * Helper functions similar to Ember.computed helpers
 */
var Computable = {

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
   * Returns true if the provided value is in the enumerable collection
   *
   * Note: This is an O(n) operation, it should not be used with large collections
   *
   * Ex:
   *
   *    instrument: Ember.computed.includes('supported_instrument_types', 'DEBIT_CARD'),
   *
   */
  includes(collectionKey, value) {
    return Ember.computed(collectionKey, function(){
      var collection = this.get(collectionKey);
      return collection &&
        ((collection.includes && collection.includes(value)) || (!collection.includes && collection.contains && collection.contains(value)));
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
  indexBy(collectionKey, selector) {
    return Ember.computed(collectionKey, function(){
      var collection = this.get(collectionKey),
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
   * Compose multiple arguments and functions together.
   *
   * Takes an unlimited number of args and fns. (key, [dependentKey, ] [fn, ] fn)
   * The first m string arguments are dependent keys.
   * The remaining arguments are functions that get evaluated right to left
   * which is often called `compose`.
   *
   * The values of the dependent keys are passed to the rightmost function.
   * The result from each function is passed to the next function, and the final
   * result is the value the computed property takes on.
   *
   * - The order of the keys provided is preserved.
   * - Inside the provided functions `this` is the parent object.
   *
   * Ex:
   *
   *    formattedTotal: Ember.computed.fn( 'amount', 'fee', 'tax',
   *      function(total) {
   *        return `$${total}`;
   *      },
   *      function(amount, fee, tax){
   *        return amount + fee + tax;
   *      })
   */
  compose() {
    var args = Array.prototype.slice.call(arguments),
        dependentKeys = args.filter(function(arg){ return typeof arg === 'string'; }),
        computedArgs = dependentKeys.slice(),
        composedFn = Composable.compose.apply(this, args.slice(dependentKeys.length));

    computedArgs.push(function(){
      return composedFn.apply(this, dependentKeys.map( (key) => { return this.get(key); }));
    });
    return Ember.computed.apply(Ember, computedArgs);
  }
};

// Alias the includes functino to `contains`
Computable.contains = Computable.includes;

// Alias the compose function to `fn`
Computable.fn = Computable.compose;

export default Computable;
