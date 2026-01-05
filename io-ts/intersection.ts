import * as t from 'io-ts';

/**
 * Intersection type
 * Combines 2 codecs forming a codec which requires all aspects of both codcs
 */

const codec1 = t.type({
    codec1Key: t.number,
});

const codec2 = t.type({
    codec2Key: t.number,
});

const intersectedCodec = t.intersection([codec1, codec2]);

const obj1 = {
    codec1Key: 1,
};

const obj2 = {
    codec2Key: 2,
};

const obj3 = {
    codec1Key: 1,
    codec2Key: 2,
};

console.log({
    obj1: intersectedCodec.decode(obj1),
    obj2: intersectedCodec.decode(obj2),
    obj3: intersectedCodec.decode(obj3),
});

/**
 * returns {
 *     obj1: left
 *     obj2: left
 *     obj3: right ( as only object 3 has properties that satisfy both codecs)
 * }
 */

t.union;
