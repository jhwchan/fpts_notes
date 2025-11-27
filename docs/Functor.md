# Functors

```
map: <A, B>(f: (a: A) => B) => (fa: HKT<F, A>) => HKT<F, B>
```

- A functor is a pair of (F, Lift)
- F:
    - An n-ary type constructor which converts type X into F X
- Lift:
    - A function following this structure
    ```
    lift: <A, B>(f: (a: A) => B) => ((fa: F<A>) => F<B>)
    ```
- A functor combines the pure program into a function that can interact with F (context)
- Limitations
    - Only works with unary operators
        - functions that accept only one arguement


### Pure program
```
(a: A) => B
```

### Effectul program
```
(a: A) => F<B>
```
- Where F is a type constructor
- E.g.
    - Array
    - Option
    - Task (async function)

## Lifting

- Converting a function into a function that applies to certain type constructors
```
(a: A) => B

// into

(fa: F<A>) => F<B>
```

- E.g. for an array
    - A function which accepts a partial parameter of a function that converts A => B
        - Returning a function which accepts type F(A)
    - Uses the inital function to transform the F(B) => F(B)

```
function lift<A, B>(f: (a: A) => B): (fa: Array<A>) => Array<B> {
  return fa => fa.map(f)
}
```

- E.g. for an Option
```
function lift<A, B>(f: (a: A) => B): (fa: Option<A>) => Option<B> {
  return fa => (isNone(fa) ? none : some(f(fa.value)))
}
```
- E.g. for a Task
```
function lift<A, B>(f: (a: A) => B): (fa: Task<A>) => Task<B> {
  return fa => () => fa().then(f)
}
```