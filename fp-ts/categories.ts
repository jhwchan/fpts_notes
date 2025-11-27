/**
 * Categories are a pair of (Objects, morphisms)
 * Objects in TS are types
 * Morhpisms are functions which transforms these types into one another
 */
import * as O from 'fp-ts/lib/Option.js';
import * as E from 'fp-ts/lib/Either.js';

// f A => B
// f number = > string
const numToString = (x: number) => x.toString();

// g B => C
// g string => boolean
const stringToBool = (x: string) => (x.length > 2 ? true : false);

// composition of f and g
// g . f A => C
// g . f number => boolean
function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
    return (a) => g(f(a)); // can also be written as pipe(a, f, g)
}

const x = compose(stringToBool, numToString);

x(100); // returns true
x(10); // returns false
