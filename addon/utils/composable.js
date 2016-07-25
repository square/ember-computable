
export default {


  argsToArray: function() {
    return Array.prototype.slice.call(arguments);
  },

  identity: function(arg) {
    return arg;
  },

  not: function(arg) {
    return !arg;
  },

  compact: function(arg) {
    return arg.filter(arg);
  },

  // Curried and Partially Evaluated Fns

  filter: function(fn) {
    return function(collection) {
      return collection.filter(fn);
    };
  },

  filterBy: function(key, value) {
    return function(collection) {
      return collection.filterBy(key, value);
    };
  },

  join: function(separator) {
    return function(arg) {
      return arg.join(separator);
    };
  },

  mapBy: function(key) {
    return function(collection) {
      console.log(collection);
      return collection.mapBy(key);
    };
  },

  parseInt: function(radix) {
    return function(arg) {
      return parseInt(arg, radix);
    };
  },

  replace: function(regex, replacement) {
    return function(arg) {
      return arg && arg.replace(regex, replacement);
    };
  }

};
