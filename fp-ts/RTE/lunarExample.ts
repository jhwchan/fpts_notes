import * as TE from 'fp-ts/lib/TaskEither.js'
import * as RTE from 'fp-ts/lib/ReaderTaskEither.js'
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'

/**
 * Codecs
 */
const planetCodec = t.strict({
    name: t.string,
    residents: t.array(t.string),
})

const personCodec = t.strict({
    name: t.string,
    mass: t.string,
})

/**
 * Has pattern
 * Helps with building the Env in the stack
 * Defines what effect the env should contain
 */
interface HasGetStarWarsPlanetEff {
    readonly getStarWarsPlanetEff: (
        planetId: number
    ) => TE.TaskEither<Error, void>
}

interface HasGetStarWarsPersonEff {
    readonly getStarWarsPersonEff: (
        planetId: number
    ) => TE.TaskEither<Error, void>
}

/**
 * Function which create a RTE
 * Specifying the env that it requires to run
 * and running the function inside that env
 * Used to compose the program later
 */
const getPlanet =
    (
        planetId: number
    ): RTE.ReaderTaskEither<HasGetStarWarsPlanetEff, Error, void> =>
    (r) =>
        r.getStarWarsPlanetEff(planetId)

const getPerson =
    (
        personId: number
    ): RTE.ReaderTaskEither<HasGetStarWarsPersonEff, Error, void> =>
    (r) =>
        r.getStarWarsPersonEff(personId)

/**
 * The function that makes the effect
 * Effect in this context is the TaskEither that performs the impure action
 * In this case takes the url string and performs an API call to an outside source
 * These are the main buisness logic
 */
const mkGetStarWarsPlanetEff =
    (url: string): HasGetStarWarsPlanetEff['getStarWarsPlanetEff'] =>
    (planetId) =>
        TE.tryCatch(
            async () => {
                const rsp = await fetch(`${url}/planets/${planetId}`)
                const decoded: unknown = await rsp.json()
                console.log('Raw Object', { decoded })
                return pipe(
                    planetCodec.decode(decoded),
                    (x) => x,
                    E.match(
                        () => {
                            throw new Error('Decode error')
                        },
                        (x) => console.log({ planet: x })
                    )
                )
            },
            (err) => {
                console.error('[mkGetStarWarsPlanetEff]', err)
                return new Error()
            }
        )

const mkGetStarWarsPersonEff =
    (url: string): HasGetStarWarsPersonEff['getStarWarsPersonEff'] =>
    (personId) =>
        pipe(
            TE.tryCatch(
                async () => {
                    console.log('running person')
                    const rsp = await fetch(`${url}/people/${personId}`)
                    const decoded: unknown = await rsp.json()
                    console.log('Raw Object', { decoded })
                    return pipe(
                        personCodec.decode(decoded),
                        E.match(
                            () => {
                                throw new Error('Decode error')
                            },
                            (x) => console.log({ planet: x })
                        )
                    )
                },
                (err) => {
                    console.error('[mkGetStarWarsPersonEff]', err)
                    return new Error()
                }
            )
        )

/**
 * The interface located in the lambda files
 * used to type all the effects that should be included
 * These effects will be called by the composed RTE's whenever this env variable is passed in
 */
const swapiApi = 'https://swapi.dev/api/'
interface Env extends HasGetStarWarsPlanetEff, HasGetStarWarsPersonEff {}

const env: Env = {
    getStarWarsPlanetEff: mkGetStarWarsPlanetEff(swapiApi),
    getStarWarsPersonEff: mkGetStarWarsPersonEff(swapiApi),
}

/**
 * Program which takes an input composes all the RTE's into one RTE
 * RTE is used in the handler
 */

const program = ({
    planetId,
    personId,
}: {
    planetId: number
    personId: number
}): RTE.ReaderTaskEither<Env, Error, void> =>
    pipe(
        getPlanet(planetId),
        RTE.flatMap(() => getPerson(personId))
    )

/**
 * Handler which calls the program with the env
 * will usually be called with an AWSlambda event param
 * which contains all the information needed for the lambda e.g. user credentials payload etc.
 */
const handler = () => pipe({ planetId: 15, personId: 50 }, program)(env)()

/**
 * Whenever a lambda is called it is ran like so
 */
handler()
