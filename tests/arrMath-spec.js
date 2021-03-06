var _ = require('../lib/arrMath.js');
var assert = require('assert');

var arrays = [
	[1,2,3,4,5],
	[0],
	[-7,-5,2,-10]
];

describe('arrMath', function () {

	describe('flatSum', function() {
		it("Should return the sum of any passed in array", function() {
			assert.equal(_.flatSum(arrays[0]), 15);
			assert.equal(_.flatSum(arrays[1]), 0);
			assert.equal(_.flatSum(arrays[2]), -20);
		});

		it("Should return the sum of multiple arrays", function() {
			assert.equal(_.flatSum(arrays[0],arrays[1],arrays[2]), -5);
		});

		it("Should return the sum of nested arrays", function() {
			assert.equal(_.flatSum([arrays,[[1,[2]],2]]), 0);
		});
	});
	
	describe('product', function () {
		it("Should return the product of an array of integers", function () {
			assert.equal(_.product([1, 2, 3, 4]), 24);
			assert.equal(_.product([1, 3, 1, 1]), 3);
			assert.equal(_.product([10, 10, 10]), 1000);
			assert.equal(_.product([11, 12, 1, 21]), 2772);
			assert.equal(_.product([2, 2, 2, 2, 2, 2, 2, 2]), 256);
			assert.equal(_.product([5, 11, 20, 0, 2]), 0);
			assert.equal(_.product([-7, -8]), 56);
			assert.equal(_.product([-7, -7, -7]), -343);
		});
	});

	describe('toInt', function () {
		it("Should convert an array of digits to a single int", function () {
			assert.equal(_.toInt([1, 2, 3, 4]), 1234);
			assert.equal(_.toInt([1, 0, 3, 0]), 1030);
			assert.equal(_.toInt([1, 0, 0]), 100);
			assert.equal(_.toInt([5]), 5);
		});
		
		it("Should convert an array of ints with different numbers of digits to a single int", function () {
			assert.equal(_.toInt([10, 11, 12]), 101112);
			assert.equal(_.toInt([10, 0, 120]), 100120);
			assert.equal(_.toInt([1, 100, 1, 0, 99]), 11001099);
		});
	});

	describe('toFunc', function () {
		it("Should return a function", function () {
			assert.equal(typeof _.toFunc('return a;', 'a'), 'function');
		});

		it("Should have the intended behaviour", function () {
			assert.equal(_.toFunc('return 2*a+2*b;', 'a', 'b')(3,4), 14);
		});

		it("Should work with single argument functions", function () {
			assert.equal(_.toFunc('return str.length;', 'str')('hello world'), 11);
		});

		it("Should work with multi argument functions", function () {
			assert.equal(
				_.toFunc('return str.length + arr.length + a*b;', 'str', 'arr', 'a', 'b')('hello', [1,1,1], 2, 2.5),
				13
			);
		});
	});

	describe('switchFuncs', function () {
		it("Should return the val applied to the first returnVal corresponding to a true predicate", function () {
			var val = 12;
			var predicates = ['return val % 7 === 0;', 'return val % 5 === 0;', 'return val % 6 === 0;', 'return val % 2 === 0;'];
			var returnValues = [
				function (val) {return '7 divides ' + val + '!'},
				function (val) {return '5 divides ' + val + '!'},
				function (val) {return '6 divides ' + val + '!'},
				function (val) {return '2 divides ' + val + '!'}
			];
			assert.equal(_.switchFuncs(val, predicates, returnValues), '6 divides 12!');
		});

		it("Should work if return values are objects", function () {
			var vals = ['apple', 'orange'];
			var predicates = ['return val.length == 4;', 'return val.length == 5;', 'return val.length == 6;'];
			var returnValues = [
				{apple: '"apple" has 4 letters', orange:'"orange" has 4 letters'},
				{apple: '"apple" has 5 letters', orange:'"orange" has 5 letters'},
				{apple: '"apple" has 6 letters', orange:'"orange" has 6 letters'},
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), '"apple" has 5 letters');
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), '"orange" has 6 letters');
		});

		it("Should work if return values are arrays", function () {
			var vals = [1, 2];
			var predicates = ['return val == 2;', 'return val == 3;', 'return val == 1;'];
			var returnValues = [
				['x', 'x', 'two'],
				['x', 'x', 'x'],
				['x', 'one', 'x'],
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), 'one');
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), 'two');
		});

		it("Should work if return values are null", function () {
			var vals = [1, 2];
			var predicates = ['return val == 2;', 'return val == 3;', 'return val == 1;'];
			var returnValues = [
				null,
				['x', 'x', 'x'],
				['x', 'one', 'x'],
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), 'one');
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), null);
		});

		it("Should work if return values are boolean", function () {
			var vals = [1, 2];
			var predicates = ['return val == 2;', 'return val == 3;', 'return val == 1;'];
			var returnValues = [
				true,
				['x', 'x', 'x'],
				false,
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), false);
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), true);
		});

		it("Should work if return values are strings or nums", function () {
			var vals = [1, 2];
			var predicates = ['return val == 2;', 'return val == 3;', 'return val == 1;'];
			var returnValues = [
				200,
				['x', 'x', 'x'],
				'100',
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), '100');
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), 200);
		});

		it("Should work if return values are undefined", function () {
			var vals = [1, 2];
			var predicates = ['return val == 2;', 'return val == 3;', 'return val == 1;'];
			var returnValues = [
				200,
				['x', 'x', 'x'],
				undefined
			];
			assert.equal(_.switchFuncs(vals[0], predicates, returnValues), 1);
			assert.equal(_.switchFuncs(vals[1], predicates, returnValues), 200);
		});
		// Needs more complete testing
	});
	
	describe('switchCases', function () {
		it("", function () {
			var val = {'a': 12};
			var predicates = [{'a': 7, 'b':12}, {'b': 12}, {'a': '12'}, {'c': 0, 'a': 12}, {'a': 1, 'b': 2}];
			var returnValues = [
				false,
				false,
				false,
				true,
				false
			];
			assert.equal(_.switchCases(val, predicates, returnValues), true);
		});
	});
	
	describe('intToArray', function () {
		it('should convert single digit numbers to arrays of length 1 containing the digit', function () {
			_.each(_.range(10), function (val) {
				assert.deepEqual(_.intToArray(val), [val]);
			});
		});
		
		it('should convert multi-digit arrays to multi-length arrays of single digits', function () {
			assert.deepEqual(_.intToArray(12345), [1, 2, 3, 4, 5]);
			assert.deepEqual(_.intToArray(10000), [1, 0, 0, 0, 0]);
			assert.deepEqual(_.intToArray(33), [3, 3]);
			assert.deepEqual(_.intToArray(1010101), [1, 0, 1, 0, 1, 0, 1]);
			assert.deepEqual(_.intToArray(511215), [5, 1, 1, 2, 1, 5]);
		});
	});
	
	describe('lengthsSoFar', function () {
		it("Should return a mapping...", function () {
			assert.deepEqual(_.lengthsSoFar([1, 2, 3]), [1, 2, 3]);
			assert.deepEqual(_.lengthsSoFar([22, 33, 44]), [2, 4, 6]);
			assert.deepEqual(_.lengthsSoFar([101, 0, 101]), [3, 4, 7]);
			assert.deepEqual(_.lengthsSoFar([11, 1, 111, 1]), [2, 3, 6, 7]);
		});
	});
	
	describe('pow10', function () {
		it("Should return 10 raised to the power of the argument", function () {
			assert.equal(_.pow10(-1), 0.1);
			assert.equal(_.pow10(0), 1);
			assert.equal(_.pow10(1), 10);
			assert.equal(_.pow10(2), 100);
		});
	});
	
	describe('digits', function () {
		it("Should return the number of digits in an int", function () {
			assert.equal(_.digits(1), 1);
			assert.equal(_.digits(22), 2);
			assert.equal(_.digits(505), 3);
			assert.equal(_.digits(1035301), 7);
		});
	});
	
	describe('intDiv', function () {
		it("Should return the number of times intB divides into intA", function () {
			assert.equal(_.intDiv(10,3), 3);
			assert.equal(_.intDiv(1002, 200), 5);
			assert.equal(_.intDiv(54, 17), 3);
			assert.equal(_.intDiv(1000, 10), 100);
			assert.equal(_.intDiv(143, 13), 11);
			assert.equal(_.intDiv(12, 13), 0);
			assert.equal(_.intDiv(2, 4), 0);
		});
	});
	
	describe('listBelow', function () {
		it("Should return an array containing all numbers in the first param less than the second param", function () {
			assert.deepEqual(_.listBelow([1, 2, 3, 4, 5, 6, 7], 5), [1, 2, 3, 4]);
			assert.deepEqual(_.listBelow([1, 2, 3, 4, 5, 6, 7], 8), [1, 2, 3, 4, 5, 6, 7]);
			assert.deepEqual(_.listBelow([1, 2, 3, 4, 5, 6, 7], 0), []);
			assert.deepEqual(_.listBelow([1, -1, 2, -2, 3, -3, 4, -4], 0), [-4, -3, -2, -1]);
			assert.deepEqual(_.listBelow([1, -1, 2, -2, 3, -3, 4, -4], 5), [-4, -3, -2, -1, 1, 2, 3, 4]);
			assert.deepEqual(_.listBelow([1, -1, 2, -2, 3, -3, 4, -4], -3), [-4]);
			assert.deepEqual(_.listBelow([1, -1, 2, -2, 3, -3, 4, -4], -4), []);
		});
	});
	
	describe('firstMultipleOfYAboveX', function () {
		it("Should return the first multiple of the second param greater than the first", function () {
			assert.equal(_.firstMultipleOfYAboveX(100, 7), 105);
			assert.equal(_.firstMultipleOfYAboveX(3, 4), 4);
			assert.equal(_.firstMultipleOfYAboveX(4, 3), 6);
			assert.equal(_.firstMultipleOfYAboveX(17, 17), 34);
			assert.equal(_.firstMultipleOfYAboveX(50, 25), 75);
			assert.equal(_.firstMultipleOfYAboveX(49, 2), 50);
		});
		
		it("Should return the first odd multiple of the second param greater than the first when pass callback", function () {
			assert.equal(_.firstMultipleOfYAboveX(106, 7, _.odd), 119);
			assert.equal(_.firstMultipleOfYAboveX(3, 5, _.odd), 5);
			assert.equal(_.firstMultipleOfYAboveX(4, 3, _.odd), 9);
			assert.equal(_.firstMultipleOfYAboveX(17, 17, _.odd), 51);
			assert.equal(_.firstMultipleOfYAboveX(50, 25, _.odd), 75);
			assert.equal(_.firstMultipleOfYAboveX(56, 11, _.odd), 77);
		});
	});
	
	describe('primesTo', function () {
		it("Should return the correct number of primes", function () {
			assert.equal(_.primesTo(10).length, 4);
			assert.equal(_.primesTo(100).length, 25);
			assert.equal(_.primesTo(1000).length, 168);
			assert.equal(_.primesTo(10000).length, 1229);
			assert.equal(_.primesTo(100000).length, 9592);
			assert.equal(_.primesTo(1000000).length, 78498);
		});
		
		it("Should return the correct primes", function () {
			var primes = _.primesTo(1000000);
			
			assert.equal(primes[0], 2);
			assert.equal(primes[10], 31);
			assert.equal(primes[51], 239);
			assert.equal(primes[117], 647);
			assert.equal(primes[999], 7919);
			assert.equal(primes[10000], 104743);
			assert.equal(_.last(primes), 999983);
		});
	});
	
	describe('primeFactors', function () {
		it("Should return the correct list of prime factors", function () {
			var testArrays = {
				a: [2, 2, 2],
				b: [3, 5, 11, 17],
				c: [2, 2, 3, 3, 5, 5, 101],
				d: [31, 37, 41],
				e: [47, 47, 47, 2]
			};
			
			assert.deepEqual(_.primeFactors(_.product(testArrays.a)), _.sortBy(testArrays.a));
			assert.deepEqual(_.primeFactors(_.product(testArrays.b)), _.sortBy(testArrays.b));
			assert.deepEqual(_.primeFactors(_.product(testArrays.c)), _.sortBy(testArrays.c));
			assert.deepEqual(_.primeFactors(_.product(testArrays.d)), _.sortBy(testArrays.d));
			assert.deepEqual(_.primeFactors(_.product(testArrays.e)), _.sortBy(testArrays.e));
		});
	});
});
