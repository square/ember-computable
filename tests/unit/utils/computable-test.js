import Ember from 'ember';
import Computable from 'ember-cli-computable/utils/computable';
import { module, test } from 'qunit';

module('Unit | Utils | Computable.ifElse');

test('Should return first item when condition property evaluates to true', function(assert) {
  var component = Ember.Component.extend({
    isBusiness: true,
    message: Computable.ifElse('isBusiness', 'Hello, Business Customer', 'Hola, Personal Customer')
  }).create();
  assert.equal(component.get('message'), 'Hello, Business Customer');
});

test('Should return second item when condition property evaluates to true', function(assert) {
  var component = Ember.Component.extend({
    isBusiness: false,
    message: Computable.ifElse('isBusiness', 'Hello, Business Customer', 'Hola, Personal Customer')
  }).create();
  assert.equal(component.get('message'), 'Hola, Personal Customer');
});


module('Unit | Utils | Computable.ifElseKeys');

test('Should return first item when condition property evaluates to true', function(assert) {
  var component = Ember.Component.extend({
    isBusiness: true,
    businessFee: 12,
    personalFee: 5,
    fee: Computable.ifElseKeys('isBusiness', 'businessFee', 'personalFee')
  }).create();
  assert.equal(component.get('fee'), 12);
});

test('Should return second item when condition property evaluates to false', function(assert) {
  var component = Ember.Component.extend({
    isBusiness: false,
    businessFee: 12,
    personalFee: 5,
    fee: Computable.ifElseKeys('isBusiness', 'businessFee', 'personalFee')
  }).create();
  assert.equal(component.get('fee'), 5);
});

test('Should handle undefined keys', function(assert) {
  var component = Ember.Component.extend({
    isBusiness: false,
    businessFee: 12,
    fee: Computable.ifElseKeys('isBusiness', 'businessFee', 'personalFee')
  }).create();
  assert.equal(component.get('fee'), undefined);
});


module('Unit | Utils | Computable.fn');

test('Should resolve the dependent keys', function(assert) {
  var component = Ember.Component.extend({
    numerator: 6,
    denominator: 2,
    result: Computable.fn('numerator', 'denominator', function(numerator, denominator){
      return numerator/denominator;
    })
  }).create();
  assert.equal(component.get('result'), 3);
});

test('Should resolve many dependent keys', function(assert) {
  var component = Ember.Component.extend({
    a: 'the',
    b: 'quick',
    c: 'brown',
    d: 'fox',
    e: 'jumps',
    sentence: Computable.fn('a', 'b', 'c', 'd', 'e', function(){
      return Array.prototype.slice.call(arguments).join(' ');
    })
  }).create();
  assert.equal(component.get('sentence'), 'the quick brown fox jumps');
});

test('Should have correct `this` scope inside function', function(assert) {
  var component = Ember.Component.extend({
    a: 'the',
    b: 'quick',
    c: 'brown',
    sentence: Computable.fn('a', 'b', function(){
      return this.get('c');
    })
  }).create();
  assert.equal(component.get('sentence'), 'brown');
});


module('Unit | Utils | Computable.findBy');

test('Should find the requested item', function(assert) {
  var component = Ember.Component.extend({
    participants: [
      {
        name: 'Alice',
        id: 1492
      },
      {
        name: 'Bob',
        id: 1493
      },
      {
        name: 'Eve',
        id: 1494
      },
      {
        name: 'Dave',
        id: 1495
      }
    ],
    eve: Computable.findBy('participants', 'id', 1494)
  }).create();
  assert.equal(component.get('eve.name'), 'Eve');
});

test('Should handle duplicate items, returning first match', function(assert) {
  var component = Ember.Component.extend({
    participants: [
      {
        name: 'Alice',
        id: 1492
      },
      {
        name: 'Bob',
        id: 1493
      },
      {
        name: 'Eve',
        id: 1494
      },
      {
        name: 'Dave',
        id: 1495
      },
      {
        name: 'Eve',
        id: 1496
      }
    ],
    eve: Computable.findBy('participants', 'name', 'Eve')
  }).create();
  assert.equal(component.get('eve.id'), 1494);
});

test('Should handle an empty collection', function(assert) {
  var component = Ember.Component.extend({
    participants: [],
    eve: Computable.findBy('participants', 'id', 1494)
  }).create();
  assert.equal(component.get('eve'), undefined);
});

test('Should handle a non-existant collection', function(assert) {
  var component = Ember.Component.extend({
    eve: Computable.findBy('participants', 'id', 1494)
  }).create();
  assert.equal(component.get('eve'), undefined);
});


module('Unit | Utils | Computable.indexBy');

test('Indexes by single level selector', function(assert) {
  var alice = Ember.Object.create({ name: 'Alice', id: 1492 });
  var bob   = Ember.Object.create({ name: 'Bob', id: 1493 });
  var eve   = Ember.Object.create({ name: 'Eve', id: 1494 });
  var dave  = Ember.Object.create({ name: 'Bob', id: 1495 });

  var component = Ember.Component.extend({
    participants: Ember.A([
      alice,
      bob,
      eve,
      dave
    ]),
    idLookup: Computable.indexBy('participants', 'id')
  }).create();
  var idLookup = component.get('idLookup');

  assert.equal(idLookup['1492'], alice);
  assert.equal(idLookup['1493'], bob);
});

test('Gracefully handles empty target array', function(assert) {
  var component = Ember.Component.extend({
    participants: Ember.A([]),
    idLookup: Computable.indexBy('participants', 'id')
  }).create();
  var idLookup = component.get('idLookup');
  assert.notEqual(idLookup, undefined);
  assert.equal(idLookup['1492'], undefined);
});


module('Unit | Utils | Computable.contains');

test('Indexes by single level selector', function(assert) {
  var component = Ember.Component.extend({
    participants: Ember.A([
      'one',
      'two',
      'three'
    ]),
    hasThree: Computable.contains('participants', 'three'),
    hasFour: Computable.contains('participants', 'four')
  }).create();

  assert.equal(component.get('hasThree'), true);
  assert.equal(component.get('hasFour'), false);
});

test('Gracefully handles empty target array', function(assert) {
  var component = Ember.Component.extend({
    participants: Ember.A([]),
    hasFour: Computable.contains('participants', 'four')
  }).create();
  assert.equal(component.get('hasFour'), false);
});

module('Unit | Utils | Computable.notEqual');
test('returns true when not equal', function(assert) {
  let component = Ember.Component.extend({
    value: 'A VALUE',
    notEqual: Computable.notEqual('value', 'NOT A VALUE')
  }).create();
  assert.equal(component.get('notEqual'), true);
});
test('returns false when equal', function(assert) {
  let component = Ember.Component.extend({
    value: 'A VALUE',
    notEqual: Computable.notEqual('value', 'A VALUE')
  }).create();
  assert.equal(component.get('notEqual'), false);
});
test('handles undefined values', function(assert) {
  let component = Ember.Component.extend({
    value: undefined,
    notEqual: Computable.notEqual('value', 'A VALUE')
  }).create();
  assert.equal(component.get('notEqual'), true);
});
