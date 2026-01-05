// Implement forEach using reduce.

type sideEffect<A> = (x: A) => void;

type forEachType<A> = (initA: Array<A>) => void;

const forEachUsingReduce =
    <A>(func: sideEffect<A>): forEachType<A> =>
    (arr) => {
        arr.reduce((acc, curr) => {
            func(curr);
            return [];
        }, []);
    };

forEachUsingReduce((x: number) => {
    console.log(`Side effect logging: ${x}`);
})([1, 2, 3]);

// Implement map using reduce.

type converter<A, B> = (x: A) => B;

type mapArrType<A, B> = (arr: Array<A>) => Array<B>;

const mapUsingReduce =
    <A, B>(func: converter<A, B>): mapArrType<A, B> =>
    (arr) => {
        return arr.reduce<Array<B>>((acc, curr) => {
            const newVal = func(curr);
            return [...acc, newVal];
        }, []);
    };

const mapTest = mapUsingReduce((x: number) => x + 3)([1, 2, 3]);

console.log({ mapTest });

// Implement filter using reduce.

type filterFunc<A> = (x: A) => boolean;

type filterArrType<A> = (arr: Array<A>) => Array<A>;

const filterUsingReduce =
    <A>(func: filterFunc<A>): filterArrType<A> =>
    (arr) => {
        return arr.reduce<Array<A>>((acc, curr) => {
            return func(curr) ? [...acc, curr] : acc;
        }, []);
    };

const filterTest = filterUsingReduce((x: number) => x > 5)([4, 6, 3, 8]);

console.log({ filterTest });
