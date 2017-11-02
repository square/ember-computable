import Composable from 'ember-computable/utils/composable';
import { module, test } from 'qunit';

module('Unit | Utils | Composable');

test('#argsToArray', function(assert) {
  var a = 'one',
      b = 'two',
      c = 'three',
      result = Composable.argsToArray(a, b, c);
  assert.equal(result.length, 3);
  assert.equal(result[0], a);
  assert.equal(result[1], b);
  assert.equal(result[2], c);
});

test('#compact', function(assert) {
  var result = Composable.compact(['one', 2, null, false, true, '0', undefined]);
  assert.equal(result.length, 4);
  assert.equal(result[0], 'one');
  assert.equal(result[1], 2);
  assert.equal(result[2], true);
  assert.equal(result[3], '0');
});

test('#compose', function(assert) {
  var divideBy = function(divisor) {
    return function(number) {
      return number / divisor;
    };
  };

  var divideBy200 = Composable.compose(divideBy(20), divideBy(10));
  var divideBy6000 = Composable.compose(divideBy(30), divideBy(20), divideBy(10));

  assert.equal(divideBy200(400), 2, 'Divides 400 by 200 = 2');
  assert.equal(divideBy200(800), 4, 'Divides 800 by 200 = 4');

  assert.equal(divideBy6000(6000), 1, 'Divides 6000 by 6000 = 1');
  assert.equal(divideBy6000(6), 0.001, 'Divides 6 by 6000 = .0001');
});

test('#default', function(assert) {
  var otherwiseRed = Composable.default('red');

  assert.equal(otherwiseRed('blue'), 'blue', 'When a truthy value is provided, the truthy value is returned');
  assert.equal(otherwiseRed(true), true, 'When a truthy value is provided, the truthy value is returned');

  var obj = { foo: 'bar' };
  assert.equal(otherwiseRed(obj), obj, 'When an object is provided, the same object is returned');

  assert.equal(otherwiseRed(false), 'red', 'When a falsy value is provided, "red" (the default) is returned');
  assert.equal(otherwiseRed(0), 'red', 'When a falsy value is provided, "red" (the default) is returned');
  assert.equal(otherwiseRed(undefined), 'red', 'When a falsy value is provided, "red" (the default) is returned');
  assert.equal(otherwiseRed(null), 'red', 'When a falsy value is provided, "red" (the default) is returned');
});

test('#lookupKey', function(assert) {
  var stateMapping = {
    COMPLETE: '/success.png',
    FAILURE: '/error.png',
    PENDING: '/waiting.png',
    INSTANT: '/instant.png',
  };

  var stateToImage = Composable.lookupKey(stateMapping, stateMapping.COMPLETE);
  assert.equal(stateToImage('FAILURE'), stateMapping.FAILURE, 'Lookup a valid key');
  assert.equal(stateToImage('FAILURES'), stateMapping.COMPLETE, 'Lookup a non-existant key returns the default value');
  assert.equal(stateToImage(null), stateMapping.COMPLETE, 'Lookup an invalid key returns the default value');
});
