# ember-cli-computable

This library two parts:
* `Computable` - a set of Computable Property extensions applied to Ember.computed.
* `Composable` - a set of curried and partially applied functions that can be used with `Computable.compose()`.

---
## Computable

#### .compose(dependentKey, [dependentKey, ] [fn, ] fn1)

Multiple dependencies can be used as direct input to a set of composed functions.

The values of the dependent keys are passed to the rightmost function. Functions are then evaluated from right to left, passing the intermediate result on to the next.

#### .ifElse(dependentKey, value, elseValue)

If the value stored at the `dependentKey` is truthy then `value` is returned, otherwise `elseValue` is returned.

#### .ifElseKeys(dependentKey, key, elseKey)

If the value stored at the `dependentKey` is truthy then the value stored at `key` is returned, otherwise the value at `elseKey`.

#### .includes(collectionKey, value)

Returns true if `value` is in the enumerable collection.

#### .indexBy(collectionKey, selector)

Iterates a collection of objects and uses the attributes at `selector` of each as keys to populate a new hashtable containing the original items.

#### .findBy(collectionKey, key, value)

Returns the first item in the target collection with a property at key matching the provided value

#### .notEqual(dependentKey, value)

Tests that the value at `dependentKey` is not equal to the provided value.

---

## Composable


#### .argsToArray

Converts all the function `arguments` to a proper Array and returns.

#### .identity

Returns the value of the first argument passed to the function.

#### .not

Returns the inverse truthy/falsy value of the provided argument.

#### .compact

Iterates an array and returns a new array that does not contain null or undefined elements.

#### .filter(filterFn)

Returns a partially evaluated function that will filter an array using the provided filter function.

- @param `filterFn(array) -> boolean`
- @returns `fn(array) -> array`

#### .filterBy(key, value)

Returns a partial fn that will filter an array by the `key` and `value` provided.

- @param `key` - accessor
- @param `value` - desired value
- @returns `fn(array) -> array`

#### .join(separator)

- @param `separator` - the separator to be applied
- @returns `fn(array) -> string`

#### .mapBy(key)

- @param `separator` - the separator to be applied
- @returns `fn(array) -> array`

#### .parseInt(radix)

- @param `radix` - the radix (int) value to use
- @returns `fn(stringValue) -> int` - will call parseInt(radix) on the `stringValue`

#### .replace(regex, replacement)

Returns a partial fn that runs the provided regular expression replacement on a string.

- @param `RegExp` - the regex to use
- @param `replacement` - the replacement string
- @returns `fn(stringValue) -> string`

---
## Examples

Calling a utility method with the same value as you're dependent on:

```
paymentComplete: Ember.computed('payment.state', function() {  
    return Utils.isSuccessfulPayment(this.get('payment.state'));
}
```

Reduces to directly providing the function.

```
paymentComplete: Ember.computed.fn('payment.state', Utils.isSuccessfulPayment)
```

#### Multiple Composed Functions

This example converts a function that calls two functions in sequence:

```
  date: Ember.computed('transaction.initiated_at', function() {
    let date = parseInt(this.get('transaction.initiated_at'), 10);
    return moment(date);
  })
```

Into two composed functions that are evaluated in reverse order:

```
  date: Ember.computed.compose('transaction.initiated_at', moment, comp.parseInt(10))
```

#### Multiple dependencies

Previously multiple dependencies required a lot of boilerplate getter code.

```
  singleLineAddress: Ember.computed(
      'model.address_line_1',
      'model.address_line_2',
      'model.locality',
      'model.administrative_district_level_1',
      'model.postal_code',
    function() {
      [
        this.get('model.address_line_1'),
        this.get('model.address_line_2'),
        this.get('model.locality'),,
        this.get('model.administrative_district_level_1'),
        this.get('model.postal_code'),
      ].map(function(part) {
          return part && part.trim().replace(/(,$)/g, '');
        }).filter(function(part) {
          return part;
        }).join(', ');
    }
  ),
```

Now the dependencies are passed directly to the composed function. We can combine many small partial functions together into a series of composed functions:

```
  singleLineAddress: Ember.computed.compose(
    'model.address_line_1',
    'model.address_line_2',
    'model.locality',
    'model.administrative_district_level_1',
    'model.postal_code',
    comp.join(', '),
    comp.compact,
    comp.map(comp.replace(/^\s+|,?\s+$/g, ''))),
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
