# Applicative

```
ap: <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>

```

- An extension on a functor allowing you to use n number of arguements
- Via providing a function wrapped in the type constructor


- Provide a type constructor with content
- Provide a function wrapped in a type constructor
- Applicative uses these to transform the content in the type constructor with the function


## Advantages

- Allows currying of variables
    - Gives more flexibility than functors
    - useful for providing several arguements
    - refer to the fp-ts/fp-ts/applicatives.ts file