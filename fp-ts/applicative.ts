import { pipe } from 'fp-ts/lib/function.js';
import * as A from 'fp-ts/lib/Array.js';
import * as O from 'fp-ts/lib/Option.js';

/**
 * Basic usage of the array applicative
 * Takes an array of anything (numbers in this case)
 * then takes an array of functions that converts numbers into numbers (can be anything)
 */
const x = A.ap([2, 3])([(x: number) => x * 2, (x: number) => x + 5]);

x; // returns [4,6,7,8]

/**
 * Trying to chain my own example Option applicative
 */

const f = (a: number) => (b: string) => (c: number) => a + b + c;

const applicative = pipe(
    O.some(f),
    O.ap(O.some(3)),
    O.ap(O.some('b')),
    O.ap(O.some(5))
);

applicative; // returns "3b5"

//with none

const noneApplicative = pipe(
    O.some(f),
    O.ap(O.some(3)),
    O.ap(O.none),
    O.ap(O.some(5))
);

//console.log(noneApplicative); // returns none

/**
 * Array applicative
 * Each combination is produced
 */

const f2 = (s1: string) => (n: number) => (s2: string) => s1 + n + s2;

const xl = pipe([f2], A.ap(['a', 'b']), A.ap([1, 2]), A.ap(['😀', '😫', '😎']));

//console.log(xl);

const xlReturn = [
    'a1😀',
    'a1😫',
    'a1😎',
    'a2😀',
    'a2😫',
    'a2😎',
    'b1😀',
    'b1😫',
    'b1😎',
    'b2😀',
    'b2😫',
    'b2😎',
];

/**
 * Using applicatives with map
 * in this case
 * map: <A, B>(f a:A => b: B) => (Option<A>) => Option<B>
 * A: number
 * B: (y:number) => (x:number) => number
 */

// <number,B> (f:(a:number => HKT<F,B>)) => (a:number) => b:B

const add = (z: number) => (y: number) => (x: number) => x + y + z;

const asda = pipe(O.some(4), O.map(add), O.ap(O.some(5)), O.ap(O.some(10)));

console.log(asda);
