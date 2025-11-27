import * as TE from 'fp-ts/lib/TaskEither.js';
import { nameCodec } from '../RTE/readerTaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';

/**
 * Traverse array maps over an array of items sequentially converting them into the specified type class
 * Generating data from these effects
 * If any one of these items returns a left path, if will fail fast
 * otherwise it will return an array wrapped in the type class
 * E.g. (TaskEither)
 * (a:A => TE<Error,B>)=>(a:Array<A>)=>TE<Error,Array<B>>
 */

const api = 'https://swapi.dev/api/asd';

const array1 = [15, 1, 2, 3];

const traverseArrayEff = TE.traverseSeqArray<number, { name: string }, Error>(
    (num: number) => {
        return TE.tryCatch(
            async () => {
                const raw = await fetch(`${api}/people/${num}`);
                const decoded = await raw.json();
                console.log('Raw decode success');
                // const nameObj = nameCodec.decode(decoded)
                // if (E.isRight(nameObj)) {
                //     console.log('Logging from each call')
                //     console.log({ name: nameObj.right.name })
                //     return nameObj.right.name
                // } else {
                //     throw new Error('Decode error')
                // }
                return pipe(nameCodec.decode(decoded), TE.fromEither);
            },
            (err) => {
                console.error('[traverseArray]', err);
                return new Error('Unable to get item');
            }
        );
    }
);

const call = traverseArrayEff(array1);

call().then((x) => console.log('[Result]:', x));
