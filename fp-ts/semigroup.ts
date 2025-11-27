import { type Semigroup, struct, concatAll } from "fp-ts/lib/Semigroup.js";
import * as F from "fp-ts/lib/function.js";
import * as S from "fp-ts/lib/string.js";
import * as N from "fp-ts/lib/number.js";
import * as B from "fp-ts/lib/boolean.js";
import { getApplySemigroup } from "fp-ts/lib/Apply.js";
import * as O from "fp-ts/lib/Option.js";
import * as E from "fp-ts/lib/Either.js";

/**
 * defining a semigroup
 * Semigroups contain a concat function that must be associative, converting two values of the same type into one value of that type
 */

const basicSemigroup: Semigroup<number> = {
  concat: (x, y) => x + y,
};

basicSemigroup.concat(2, 3); //returns 5

//built in semigroups
S.Semigroup.concat("x", "y"); // returns "xy"
N.SemigroupProduct.concat(4, 5); //returns 20

B.SemigroupAll.concat(true, false); // returns true (&&)
B.SemigroupAny.concat(true, false); //returns true (||)

/**
 * Using getStruct for more complex types
 */

type user = {
  age: number;
  name: string;
};

const user1: user = {
  age: 24,
  name: "Jason",
};

const user2: user = {
  age: 24,
  name: "Jason",
};

//creating a semigroup to more complex types
const userSemigroup: Semigroup<user> = struct({
  age: N.SemigroupSum,
  name: S.Semigroup,
});

userSemigroup.concat(user1, user2); // returns { age: 48, name: 'JasonJason' }

/**
 * Semigroup form combining functions
 */

//In this example combining 2 params
const cond1 = (n: number) => n < 2;
const cond2 = (n: number) => n === 0;

//since its using SemigroupAll, both conditions have to be true
const combineCondition = F.getSemigroup(B.SemigroupAll)<number>();

combineCondition.concat(cond1, cond2)(4); //returns false
combineCondition.concat(cond1, cond2)(0); // returns true

/**
 * Using concatAll to combine an array of items
 */

const numArrConcatSum = concatAll(N.SemigroupSum);
const numArrConcatProduct = concatAll(N.SemigroupProduct);

//takes one item of the type as an arguement, returning a function which takes an array of that type
numArrConcatSum(3)([1, 2, 10]); //returns 16
numArrConcatProduct(3)([4, 2]); //returns 24

/**
 * Using semigroup with Option via getApplySemigroup
 * Combining possible options
 * none + some = none
 * some + some = some
 * only applies the semigroup if both values are some
 */

//Need to input an apply from the desired applicative then input the desired semigroup
const optionSemi = getApplySemigroup(O.Apply)(N.SemigroupProduct);
const optionSemi2 = getApplySemigroup(E.Applicative)(N.SemigroupProduct);

optionSemi.concat(O.none, O.some(4)); //returns none
optionSemi.concat(O.some(2), O.some(4)); //returns 8
