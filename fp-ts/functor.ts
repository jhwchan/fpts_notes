import * as A from "fp-ts/lib/Array.js";
import * as E from "fp-ts/lib/Either.js";

/**
 * Defining a basic functor for arrays
 */

function lift<A, B>(f: (a: A) => B): (fa: Array<A>) => Array<B> {
  return (fa) => fa.map(f);
}

const double = (x: number) => x * 2;

const x = lift(double);

x([2, 4]); // returns [4,8]

/**
 * Using functor from fp-ts module
 */

//Functor for arrays
// map: <A, B>(f: (a: A) => B) => (fa: A[]) => B[]
const doubleContent = A.map(double) //providing an arguement

doubleContent([5,11]); //returns [10,22]

const doubleEither = E.map(double)

//Functor for Either, only transforms the right hand side
const rightEither: E.Either<boolean, number> = E.right(3);
const leftEither: E.Either<boolean, number> = E.left(false);

doubleEither(rightEither) // returns {_tag:"Right", right:6}
doubleEither(leftEither) // returns {_tag:"Left", left:false}

