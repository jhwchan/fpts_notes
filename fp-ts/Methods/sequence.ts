import * as A from 'fp-ts/lib/Array.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as O from 'fp-ts/lib/Option.js';
import { pipe } from 'fp-ts/lib/function.js';
import { sequenceS } from 'fp-ts/lib/Apply.js';

/**
 * Takes an Array<HKT<A>> and converts it into HKT<Array<A>>.
 * Does the same thing as the traverseArray method for each HKT
 * E.g. Either
 * Array<Either<Error,A>> => Either<Array<A>>.
 * Requires an applicative for the HKT being targeted
 * - Array<Either> requires an applicative for either
 * - Array<Option> requires an applicative or option
 * Then requires the Array<HKT>.
 * - This means it is usually used in with .map preceding it to generate the Array<HKT>
 */

const swapi = 'https://swapi.dev/api/';

const testNums = [1, 2, 3, 4, 5];

const createTE = TE.tryCatchK(
    async (num: number) => {
        const raw = await fetch(`${swapi}/people/${num}`);
        return await raw.json();
    },
    (err) => {
        console.error('[createTE]', err);
        return err;
    }
);

/**
 * Takes an array of nums
 * Maps it, therefore producing Array<TE>.
 * Then using A.sequence(TE.applicativeSeq)
 * - Converts the Array<TE<Output of func, error>> into one TE<Array<output of function>,error>
 */
const numToTE = (nums: Array<number>) =>
    pipe(nums, A.map(createTE), A.sequence(TE.ApplicativeSeq));

numToTE(testNums)().then((x) => console.log(x));

/**
 * Sequence with options
 * Works on all type classes switching the inner type class with the outer
 * E.g. here an Option<TaskEither<E,A>> => TaskEither<E, Option<A>>
 */

const optionToTaskEither = O.sequence(TE.ApplicativePar);

const TEofOption = optionToTaskEither(O.some(TE.right(3)));

TEofOption().then((x) => console.log(x));

/**
 * Using sequence from the Apply library
 * Can be used on objects
 */

const sequenceSExample = sequenceS(TE.ApplicativePar)({
    person1: createTE(1),
    person3: createTE(2),
    person2: createTE(3),
});

sequenceSExample().then((x) => console.log(x));
