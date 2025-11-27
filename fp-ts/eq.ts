import * as N from "fp-ts/lib/number.js";
import * as S from "fp-ts/lib/string.js";
import { struct, type Eq, contramap } from "fp-ts/lib/Eq.js";
import { getEq } from "fp-ts/lib/NonEmptyArray.js";

/**
 * Basic equality checker using built in modules
 */

N.Eq.equals(3, 3); // returns true
N.Eq.equals(3, 4); // returns true

/**
 * Creating more complex Eq's using struct
 */

type user = {
  age: number;
  name: string;
};

const userEq: Eq<user> = struct({
  age: N.Eq,
  name: S.Eq,
});

const user1: user = {
  age: 24,
  name: "Jason",
};

const user2: user = {
  age: 24,
  name: "Jason",
};

const user3: user = {
  age: 23,
  name: "Louise",
};

userEq.equals(user1, user2); // returns true
userEq.equals(user1, user3); // returns false

/**
 * Creating an Eq checker to compare 2 arrays of the same item
 * using getEq
 */

const userArrEq = getEq(userEq); //input the desired Eq

userArrEq.equals([user1, user2], [user1, user2]); //returns true
userArrEq.equals([user1, user2], [user1, user2]); //returns false

/**
 * Using contramap to only compare one aspect of an object
 */

const eqUserAge = contramap((user: user) => user.age)(N.Eq);

eqUserAge.equals(user1, user2); //returns true
eqUserAge.equals(user1, user3); //returns false
