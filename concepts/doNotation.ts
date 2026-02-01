import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';
import 'dotenv/config';

/**
 * Do notation
 * Allow user to bind values to the specified HKT (e.g. RTE, TE, Option ... ) in the pipe
 */

const fetchApi = TE.tryCatchK(
    async (num: number, type: string) => {
        const rsp = await fetch(
            `${process.env.SWAPI_API}/${type}/${String(num)}`
        );
        console.log(`fetching ${type}`);
        return await rsp.json();
    },
    (err) => {
        console.log(err);
        return err;
    }
);

const example1 = (param: number) =>
    pipe(
        /**
         * Do inits an empty TE.TaskEither<never,{}>
         */
        TE.Do,
        TE.apS('person', fetchApi(param, 'people')),
        /**
         * apS and bind do similar things
         * - Adds key value pairs into the HKT allowing functions down the line to use these variables
         * - Is an alternative to using flatMap
         * apS: indicates that the TE can run in parallel
         * bind: indicates that the previous TE must finish running before it is run
         *  - it is dependent on an output from the previous function
         */
        TE.bind('planet', () => fetchApi(param, 'planets')),
        TE.bind('vehicle', () => fetchApi(param, 'starships'))
    );

const example2 = (param: number) =>
    pipe(
        /**
         * Do inits an empty TE.TaskEither<never,{}>
         */
        TE.Do,
        TE.apS('person', fetchApi(param, 'people')),
        /**
         *Now looking at the logs, you will see that the order of people, planets and starships can be mixed up
         */
        TE.apS('planet', fetchApi(param, 'planets')),
        TE.apS('vehicle', fetchApi(param, 'starships'))
    );

example1(3)(); //fetching will be in order
example2(3)(); //the fetching can be out of order
