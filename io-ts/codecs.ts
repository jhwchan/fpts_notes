import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/lib/Option.js';
import * as E from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import { UsernameCodec, type UsernameCodecType } from './brand.js';

/**
 * Creating more complex codecs
 */

/**
 * complexCodec1
 * - Defining a more complex codec via constructor
 * - t.Type<A, O, I>
 *   - A: the type that you want to be represented by the codec during runtime (in this case number)
 *   - O: the output type that you want this codec to encode to (O => A) (in this case string)
 *   - I: the input type from which the codec will decode from (I=>A) (in this case any)
 *
 * - Arguements:
 *   - 1st Arguement (name): name of codec
 *   - 2nd Arguement (is): A typeguard for A
 *     - returns boolean value, determining if input is or is not of type A
 *   - 3rd Arguement (validate): A function that succeeds if a value of type I can be converted into type A, or fails if otherwise
 *     - In this case: checking if an unknown value is initally a string
 *     - Then checking via regex if it is a string of a number (case-insensitive)
 *   - 4th Arguement (encode): Function converting value of type A => O
 *
 *   - Extra method:
 *     - decode: A version of validate with a default context
 *       - No need to provide it
 */

const numberRegex = /\d/i;

const StringFromNumber = new t.Type<number, string, any>(
    'StringFromNumber',
    t.number.is,
    (input, context) =>
        pipe(
            t.string.validate(input, context),
            E.flatMap((s) => {
                if (numberRegex.test(s)) {
                    return t.success(Number(s));
                }
                return t.failure(s, context);
            })
        ),
    String
);

/**
 * complexCodec2
 *
 * decode:
 *  - converts a variable of unknown type into { age: number, username: Option<Branded Username> }
 *  - since overall codec is wrapped in a tt.fromNullable
 *    - if a null variable is passed in, it will default into { age: 0, username: O.none } as stated in declaration
 *  - age:
 *    - Expects a string
 *    - If is a string of a number returns the string numberified
 *    - If encounters a null value, instead of failing and returning left will default to 0
 *    - If encounters a non-string or string which isn't a number, will trigger a failure to decode, returing an Either.left result
 *  - username:
 *    - expects a string which aligns with the UsernameCodec brand ( has prefix of "user-" )
 *    - tt.optionFromNullable:
 *      - converts a null input into an option.none
 *      - otherwise if UsernameCodec successfully decodes returns option.some("input")
 *    - tt.withFallback:
 *      - if the UsernameCodec decode fails, falls back on the declared value
 *      - in this case: O.some('Fallback value on UsernameCodec decode fail' as UsernameCodecType)
 *
 * encode:
 *   - converts a variable of type { age: number, username: Option<Branded Username> } into { age: number, username: Branded Username }
 */

//rand
const complexCodec2 = tt.fromNullable(
    t.strict({
        age: tt.fromNullable(StringFromNumber, 0),
        username: tt.withFallback(
            tt.optionFromNullable(UsernameCodec),
            O.some(
                'Fallback value on UsernameCodec decode fail' as UsernameCodecType
            )
        ),
    }),

    {
        username: O.none,
        age: 0,
    },

    'complexCodec'
);

type ComplexCodecType = t.TypeOf<typeof complexCodec2>;

const unknownUser: any = {
    age: null,
    username: 'user-3',
};

const decoded = complexCodec2.decode(unknownUser);
console.log('complexCodec2 decode');
console.log(decoded);

const encodeTest: ComplexCodecType = {
    age: 0,
    username: O.some('user-3' as UsernameCodecType),
};

const encoded = complexCodec2.encode(encodeTest);
console.log({ encoded });
