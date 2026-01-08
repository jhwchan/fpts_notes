import * as t from 'io-ts';
import * as tt from "io-ts-types";
import * as O from 'fp-ts/lib/Option.js';

/**
 * fromNullable converts nullable value into a specific value that is defined by the user
 * Have to provide a codec and a value to convert null into
 * Returns an Either
 */

const nullableStringCodec = tt.fromNullable(t.string,"Null input placeholder");

console.log(nullableStringCodec.decode("Hello")); // {_tag: "Right", right: "Hello"}
console.log(nullableStringCodec.decode(null)); // {_tag: "Right", right: "Null input placeholder"} null input is converted into user specified value

const userCodec = t.type({
    name: t.string,
    age: t.number,
})


/**
 * Slighlt more complex example with an object
 */

const nullableUserCodec = tt.fromNullable(userCodec,{
    name:"Default Name",
    age:0
})

console.log(nullableUserCodec.decode({name:"Jason",age:24})); // {_tag: "Right", right: {name:"Jason",age:24}}
console.log(nullableUserCodec.decode(null)); // {_tag: "Right", right: {name:"Default Name",age:0}} null input is converted into user specified value

/**
 * Converts nullable values into an option type
 * O.some(value) if not input is null
 * O.none if input is null
 */

const optionStringCodec = tt.optionFromNullable(t.string)

console.log(optionStringCodec.decode("Hello")); // {_tag: "Right", right: O.some("Hello")}
console.log(optionStringCodec.decode(null)); // {_tag: "Right", right: O.none} null input is converted into O.none

/**
 * Encoding with fromNullable does the exact opposite of decoding
 */

optionStringCodec.encode(O.some("World")); // returns "World"
optionStringCodec.encode(O.none); // returns null