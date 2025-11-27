import * as RTE from 'fp-ts/lib/ReaderTaskEither.js'
import { pipe } from 'fp-ts/lib/function.js'
import { env1, func1 } from './readerTaskEither.js'

//making a pipeline with tap
//returns the same RTE, allows performance of a side effect

const pipeLine = (num: number) =>
    pipe(
        func1(num),
        // tap performs a side effect but returns the same RTE that was given as an arguement no matter the outcome
        RTE.tap((x) => {
            console.log('Tap effect')
            return RTE.right(undefined)
        })
    )

const init = pipeLine(5)
const call = () =>
    init(env1)().then((x) => console.log('Called successfully tap'))

//uncomment below to call

//call()
