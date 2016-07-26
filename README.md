# ember-cli-computable

This library two parts:
* `Computable` - a set of Computable Property extensions.
* `Composable` - a set of curried and partially applied functions that can be used with the `Computable.fn()` and `Computable.compose()` functions.

---
## Computable

#### .compose(dependentKey, [dependentKey, ] [fn, ] fn1)

#### .ifElse(dependentKey, value, elseValue)

#### .ifElseKeys(dependentKey, key, elseKey)

#### .includes(collectionKey, value)

#### .indexBy(collectionKey, selector)

#### .findBy(collectionKey, key, value)

#### .notEqual(dependentKey, value)

---

## Composable

#### .argsToArray

#### .identity

#### .not

#### .compact

---

#### .filter(filterFn)

#### .filterBy(key, value)

#### .join(separator)

#### .mapBy(key)

#### .parseInt(radix)

#### .replace(regex, replacement)


---
## Examples

```
  date: Ember.computed('transaction.initiated_at', function() {
    let date = parseInt(this.get('transaction.initiated_at'), 10);
    return moment(date);
  }),
```

```
  date: Ember.computed.compose('transaction.initiated_at', moment, comp.parseInt(10))
```

```
  singleLineAddress: Ember.computed.fn(
      'model.address_line_1',
      'model.address_line_2',
      'model.locality',
      'model.administrative_district_level_1',
      'model.postal_code',
    function() {
      // Trim each part, remove trailing commas, join non-null parts with comma+space
      return Array.prototype.map.call(arguments, function(part) {
          return part && part.trim().replace(/(,$)/g, '');
        }).filter(function(part) {
          return part;
        }).join(', ');
    }
  ),
```

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


---
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
