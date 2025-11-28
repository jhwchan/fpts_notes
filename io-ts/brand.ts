import * as t from 'io-ts';

/**
 * Important in differentiating between structural and nominal typing
 * Structural typing (typescript native):
 * - E.g. Username: string
 * - This kind of typing cannot differentiate between 2 string types
 * Nominal typing (acheived through branding):
 * - Allows separation between structural types via branding with a unique symbol
 * - Even if both values are strings, they will throw a compile time error.
 */

export interface UsernameBrand {
    //unique symbol: creates a type that is unqiue
    readonly Username: unique symbol;
}

/**
 * creating a codec via a brand
 * Have to follow this format using t.Branded
 * First arguement: the type of the input
 * Second arguement: can be used to assert certain qualities that the value should have
 * Third arguement: name of the key in the brand
 */
const UsernameCodec = t.brand(
    t.string,
    (s): s is t.Branded<string, UsernameBrand> => s.includes('user-'),
    'Username'
);

const validUsername = 'user-1';
const inValidUsername = 'test';

console.log({
    valid: UsernameCodec.decode(validUsername),
    invalid: UsernameCodec.decode(inValidUsername),
});
