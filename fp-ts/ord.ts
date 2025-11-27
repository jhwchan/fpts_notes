import * as N from "fp-ts/lib/number.js";
import * as S from "fp-ts/lib/string.js";
import { type Ord, reverse, contramap, fromCompare } from "fp-ts/lib/Ord.js";

/**
 * Basic type order checking
 * Extends the Eq class, therefore can use equals as well
 */

N.Ord.compare(3, 2); //returns 1
N.Ord.compare(3, 4); //returns -1
N.Ord.compare(3, 3); //returns 0

/**
 * Using fromCompare for more complex types
 */

type User = {
  age: number;
  name: string;
};

const user1: User = {
  age: 24,
  name: "Jason",
};

const user2: User = {
  age: 24,
  name: "Jason1",
};

const user3: User = {
  age: 23,
  name: "Louise",
};

//creating a function which compares the ages of the user object
const compareByAge = fromCompare((x: User, y: User) =>
  N.Ord.compare(x.age, y.age)
);

compareByAge.compare(user1, user3); // returns 1
compareByAge.compare(user1, user2); // returns 0

type Group = {
  leader: User;
  follower: User;
};

const group1: Group = {
  leader: user1,
  follower: user2,
};

const group2: Group = {
  leader: user3,
  follower: user2,
};

//creating a more complex object, and generating a comparison function
const compareGroupsByLeaderAge: Ord<Group> = fromCompare((x: Group, y: Group) =>
  compareByAge.compare(x.leader, y.leader)
);

compareGroupsByLeaderAge.compare(group1, group2); // returns 1 (comparing the age of the leader of each group)

/**
 * Using contramap
 */

const compareByAgeContra: Ord<User> = contramap((user: User) => user.age)(
  N.Ord
);

console.log(compareByAgeContra.compare(user1, user3)); // returns 1
console.log(compareByAgeContra.equals(user1, user2)); // returns 1

/**
 * Reverse
 * If first num is larger returns -1
 */

const reverseNum = reverse(N.Ord);

reverseNum.compare(2, 1); //returns -1
