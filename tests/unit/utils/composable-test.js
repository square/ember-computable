import Composable from 'ember-cli-computable/utils/composable';
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
