# Appendix

## Applicatives

### Option

```
type Option<A> = none | some<A>
```

- Returns either a none (does not exist) or a some

### Some

```
interface Some<A> {
    readonly _tag: 'Some'
    readonly value: A
}
```
- Returns the desired item

### Either

```
export type Either<E, A> = Left<E> | Right<A>

export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}

export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}
```
- Returns either E or A
- Left path indicates a error
- Right returns the item

### of

- Lifts values into type constructors

### Validation

```
```

### fold

- Used to define actions that can be performed to either choice in a type class
- Ensuring that the return variable is the same type

- E.g. for an Either
  - Process the either so that no matter what the return value is a string
```
type UserData = { id: number, name: string };

const processResult = (result: E.Either<string, UserData>): string => {
  return E.fold(
    // Left Function (Failure/Error handler)
    (error) => `Failed to load user: ${error}`,
    // Right Function (Success handler)
    (user) => `Successfully loaded user ${user.id}: ${user.name}`
  )(result);
};

//usage
const successCase = E.right({ id: 101, name: "Alice" });
const failureCase = E.left("Database connection timed out");

processResult(successCase);
processResult(failureCase);
```

- E.g. for an Option
  - Converts either choice of the Option into a string
```
const getDisplayName = (usernameOption: O.Option<string>): string => {
  return O.fold(
    // None Function (Return a default value when missing)
    () => "Guest User (N/A)",
    // Some Function (Use the existing value)
    (name) => `Logged in as: ${name.toUpperCase()}`
  )(usernameOption);
};

// Usage:
const someUser = O.some("bob_builder");
const noneUser = O.none;

getDisplayName(someUser);
getDisplayName(noneUser); 
```