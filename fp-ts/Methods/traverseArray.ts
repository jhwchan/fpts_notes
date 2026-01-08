import * as TE from 'fp-ts/lib/TaskEither.js';
import { nameCodec, type CharacterName } from '../RTE/readerTaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as E from 'fp-ts/lib/Either.js';
import 'dotenv/config';

/**
 * Traverse array maps over an array of items sequentially converting them into the specified type class
 * Generating data from these effects
 * If any one of these items returns a left path, if will fail fast
 * otherwise it will return an array wrapped in the type class
 * E.g. (TaskEither)
 * (a:A => TE<Error,B>)=>(a:Array<A>)=>TE<Error,Array<B>>
 */

const array1 = [15, 1, 2, 3];

const traverseArrayEff = TE.traverseSeqArray<number, CharacterName, Error>(
    (num: number) => {
        // piping into a flatMap so both fetch error and decode error can be properly recorded
        return pipe(
            TE.tryCatch(
                async () => {
                    const raw = await fetch(
                        `${process.env.SWAPI_API}/people/${num}`
                    );
                    const decoded = await raw.json();
                    console.log('Raw decode success');
                    return decoded;
                },
                (err) => {
                    console.error('[traverseArray]', err);
                    return new Error('Unable to get item');
                }
            ),
            TE.flatMap((data) =>
                pipe(
                    nameCodec.decode(data),
                    E.mapLeft(() => new Error('Unable to decode')),
                    TE.fromEither
                )
            )
        );
    }
);

const call = traverseArrayEff(array1);

call().then((x) => console.log('Result:', x));
