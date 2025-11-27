import * as A from 'fp-ts/lib/Array.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';

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
        const decoded = await raw.json();
        return decoded;
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
 * - Converts the array of HKT into one TE containing an array instead.
 */
const sequenceTest = (nums: Array<number>) =>
    pipe(nums, A.map(createTE), A.sequence(TE.ApplicativeSeq));

const x = sequenceTest(testNums)().then((x) => console.log(x));
