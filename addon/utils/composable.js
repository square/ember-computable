
export default {

  argsToArray: function() {
    return Array.prototype.slice.call(arguments);
  },

  compact: function(arg) {
    return arg.filter(this.identity);
  },

  identity: function(arg) {
    return arg;
  },

  not: function(arg) {
    return !arg;
  },

  // Curried and Partially Evaluated Fns

  compose: function() {
    var composedFns = Array.prototype.slice.call(arguments);

    return function(){
      var args = Array.prototype.slice.call(arguments),
          i = composedFns.length - 1,
          intermediate;

      intermediate = composedFns[i].apply(this, args);
      while (i--) {
        intermediate = composedFns[i].call(this, intermediate);
      }
      return intermediate;
    };
  },

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
