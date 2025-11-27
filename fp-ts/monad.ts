import * as O from "fp-ts/lib/Option.js";
import * as A from "fp-ts/lib/Array.js";
import { identity, pipe } from "fp-ts/lib/function.js";

/**
 * Issue with using map here
 * If the function is in the shape of f(a:A)=>HKT<F,B>
 * then the return value will be HKT<HKT<F, B>>
 */

const parseNumber = (s: string): O.Option<number> =>
  isNaN(Number(s)) ? O.none : O.some(Number(s));

const x = pipe(O.some("123"), O.map(parseNumber)); // returns Option<Option<number>>

const arrEg = (x: number) => [x];

const y = pipe([123], A.map(arrEg)); // returns number[][]

/**
 * Using flatmap to mitigate this
 */

//array flatmap example

const arrDoubler = (x: number) => [x, x];

const z = pipe([1, 2, 3], A.flatMap(arrDoubler)); // returns [1, 1, 2, 2, 3, 3]
//<number,number> (f(number)=>Array<number>) => HKT<number> => HKT<number>
//<number,number> (f(number)=>Array<number>) => HKT<number> => HKT<number>
console.log({z})


//Options flatmap example

const optionsEg = (x: number) => (x > 5 ? O.none : O.some(x + 5));

const f:O.Option<number> = optionsEg(0);

const l = pipe(f, O.flatMap(optionsEg));

console.log(l)

//traverseSeqArray

