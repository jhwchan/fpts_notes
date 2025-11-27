import { pipe } from 'fp-ts/lib/function.js'
import * as E from 'fp-ts/lib/Either.js'
import * as TE from 'fp-ts/lib/TaskEither.js'
import * as RTE from 'fp-ts/lib/ReaderTaskEither.js'
import * as t from 'io-ts'

/**
 * Basic RTE example
 * (r:Reader)=>()=>Promise<Either<E,A>>
 * takes in a Reader variable (usually the environment)
 * returns a TaskEither
 * Useful for separating buisness logic functions from the environments that they use
 * helping increase reusability
 */

/**
 * Func is pure, only performs action when called
 */

export const nameCodec = t.strict({ name: t.string })

export interface Env1 {
    baseUrl: string
}

export const env1: Env1 = {
    baseUrl: 'https://swapi.dev/api/people',
}

export const func1 =
    (number: number): RTE.ReaderTaskEither<Env1, any, string> =>
    (r: Env1) =>
        // Built-in function which returns a task either
        // 1st callback is the right path, 2nd is the left path
        TE.tryCatch(
            async () => {
                const raw = await fetch(`${r.baseUrl}/${number}`)
                const decoded = await raw.json()
                //t.strict creates a codec that strips away unneeded values
                return pipe(
                    nameCodec.decode(decoded), // This returns an Either<Errors, { name: string }>
                    //fold takes 2 functions that return the same value
                    //resolving both options in an either into a non either type
                    //in this case since the left path is throwing an error, returning never (as the path will never resolve since it throws)
                    //the return type is just string
                    E.fold(
                        // Left (Failure) handler
                        (errors) => {
                            throw new Error(`Decoding failed:${{ errors }}`)
                        },
                        // Right (Success) handler
                        (result) => {
                            console.log({
                                loggingFrom: 'readerTaskEither.js',
                                name: result.name,
                            })
                            return result.name
                        }
                    )
                )
            },
            //throwing an error here to catch later
            (e) => {
                console.log('Could not hit endpoint', e)
            }
        )

const init = func1(3)
const call = () =>
    init(env1)().then((x) => console.log('Called successfully RTE'))

//uncomment below to call
//call()
