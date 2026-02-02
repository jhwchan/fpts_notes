import * as TE from 'fp-ts/lib/TaskEither.js';
import { pipe } from 'fp-ts/lib/function.js';

const main = () =>
    pipe(
        TE.right(3),
        TE.map((x) => {
            console.log('Hello', x);
        }),
        (task) => task()
    );

main();
