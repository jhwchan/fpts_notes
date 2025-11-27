import { type Monoid, struct, concatAll } from "fp-ts/lib/Monoid.js";
import * as N from "fp-ts/lib/number.js";
import * as A from "fp-ts/lib/Applicative.js";
import * as O from "fp-ts/lib/Option.js";
import * as E from "fp-ts/lib/Either.js";
import { first, last } from "fp-ts/lib/Semigroup.js";

/**
 * Basic monoids
 * Are semigroups with an empty value
 * Empty values - values that when applied in .concat() does not affect the other value
 */

N.MonoidSum.concat(3, 4); // returns 7
N.MonoidProduct.concat(3, 4); // returns 12
N.MonoidSum.concat(N.MonoidSum.empty, 4); //returns 4

/**
 * Using struct to create more complex monoids
 */

type Point = {
  x: number;
  y: number;
};

const point1: Point = {
  x: 3,
  y: 4,
};
const point2: Point = {
  x: 5,
  y: 6,
};

const pointMonoid: Monoid<Point> = struct({
  x: N.MonoidSum,
  y: N.MonoidSum,
});

pointMonoid.concat(point1, point2); // returns {x:8,y:10}

//an example of further creating more complex monoids
type Coordinate = {
  p1: Point;
  p2: Point;
};

const coordinateMonoid: Monoid<Coordinate> = struct({
  p1: pointMonoid,
  p2: pointMonoid,
});

/**
 * Using concatAll to combine an array of monoids into one item
 * Unlike semigroups, no requirement for an initial number
 */

const pointArrMonoid = concatAll(pointMonoid);

pointArrMonoid([point1, point2, point1]); // returns {x:11,y:14}

/**
 * Monoids with Applicatives
 * using getApplicativeMonoid from Applicatives module
 */

//input the desired applicative from desired module
const optionMonoid = A.getApplicativeMonoid(O.Applicative); //monoid for options
const eitherMonoid = A.getApplicativeMonoid(E.Applicative); //monoid for either

const numOptionMonoid = optionMonoid(N.MonoidSum);

numOptionMonoid.concat(O.some(3), numOptionMonoid.empty); //returns 3 (since empty results in returning the same value)
numOptionMonoid.concat(O.some(3), O.none); //returns none

/*
 * Using first from semigroup and getMonoid from Option
 * To get the first non none value
 */

//e.g. a monoid for numbers
const getFirstMonoid = O.getMonoid<number>(first());

getFirstMonoid.concat(O.some(3), O.some(4)); //returns 3
getFirstMonoid.concat(O.none, O.some(4)); //returns 4
getFirstMonoid.concat(getFirstMonoid.empty, O.some(4)); //returns 4

/*
 * Using last from semigroup and getMonoid from Option
 * To get the last non none value
 */

const getLastMonoid = O.getMonoid<number>(last());

getLastMonoid.concat(O.some(3), O.some(4)); //returns 4
getLastMonoid.concat(O.some(4), O.none); //returns 4
getLastMonoid.concat(O.some(4), getFirstMonoid.empty); //returns 4
