import { validationT } from "fp-ts";
import * as t from "io-ts";
import { isLeft, isRight } from "fp-ts/lib/Either.js";
import { PathReporter } from "io-ts/lib/PathReporter.js";

/**
 * Using io-ts to define some basic decode functions
 * and a custom encode at the end
 */

const string: unknown = "s";

//returns a right, since the input is a string
//cannot access the actual input in this form
t.string.decode(string); //returns {_tag:"Right",right:"{input}"}

/*
  decoding more complex types using t.type
  showing what returns in a valid and an invalid type
*/

//t.Type<A= Decoded type,O=output (the desired item you want to obtain),I=input(usually unknown)>
const Usert: t.Type<User> = t.type({
  age: t.number,
  name: t.string,
});
//above is the same as
type User = {
  age: number;
  name: string;
};

const validUser: unknown = {
  age: 24,
  name: "Jason",
};

const invalidUser: unknown = {
  age: "24",
  name: 5,
};

const missingPropertyUser: unknown = {
  age: 25,
};

const extraPropertyUser: unknown = {
  age: 24,
  name: "Jason",
  extra: "extra",
};

Usert.decode(validUser); // returns {_tag:"Right", right:{age:24,name:"Jason"}}
Usert.decode(invalidUser); // returns {_tag:"Left", left:[ contains details about the errors in the object ], message:undefined}]}
Usert.decode(missingPropertyUser); // returns {_tag:"Left"}
Usert.decode(extraPropertyUser); // returns {_tag:"Right",right:{age:24,name:"Jason",extra:"extra" }} (can still validate with extra properties, but returns the entire object)

const decoded = Usert.decode(validUser);
const decodedInvalid = Usert.decode(invalidUser);

//isRight checks if the decoded returns a right tag
//alternatively use isLeft to check an error
if (isRight(decoded)) {
  const valid = decoded.right;
  //can access the object now
  const age = valid.age;
  const name = valid.name;
}

/**
 * t.Strict
 * only checks the desired properties
 * strips anything outside desired properties
 */

const UserStrict: t.Type<User> = t.strict({
  age: t.number,
  name: t.string,
});
UserStrict.decode(extraPropertyUser); // returns {_tag:"Right",right:{age:24,name:'Jason'}}

/**
 * Using the Pathreporter module from io-ts to repor errors
 */

PathReporter.report(decoded); // return ['No errors!']
PathReporter.report(decodedInvalid); // return [ details contianing errors ]

/**
 * Converting into an array
 */

const userArrayCheck = t.array(Usert); // returns a type guard for an array of the User object

userArrayCheck.decode([validUser, invalidUser]); // returns left
userArrayCheck.decode([validUser, validUser]); //returns right

/**
 * Using encode
 * Defining a specific io-ts type and a specific encoder function
 */

const number: unknown = "45";

/**
 * decode converts unknown into a number
 * Encode converts that number into the desired type
 */
const NumberToUser = new t.Type<number, User, unknown>(
  "NumberToUser",
  (u): u is number => typeof u === "number", // is
  (u, c) =>
    typeof u === "number"
      ? t.success(u) // valid → return number as-is
      : t.failure(u, c), // invalid → return failure
  (a) => {
    return { age: a, name: "Jason" };
  } // encode: number → User
);

const decodedNum = NumberToUser.decode(number);

// If decode is successful, able toe use encode to convert the value into desired type
if (isRight(decodedNum)) {
  const encodedUser = NumberToUser.encode(decodedNum.right);
}

/**
 * Using encode to extract a certain value from an unknown
 * Can reuse the User type guard for the is and the validation function
 */

const userToNumber = new t.Type<User, number, unknown>(
  "userToNumber",
  Usert.is,
  Usert.decode,
  (a) => a.age
);

const decodedUser2 = userToNumber.decode(validUser);

if (isRight(decodedUser2)) {
  const age = userToNumber.encode(decodedUser2.right);
  age; // 24
}

