const rewire = require('rewire');

// tests for the ship constructor
const Ship = rewire('./components/ship').__get__("Ship");

test('ship length is correct', () => {
    expect(Ship(4).size).toBe(4);
});

test('checking ship length with a different number', () => {
    expect(Ship(2).size).toBe(2);
});

test('checking ship makes all the spots', () => {
    expect(Ship(2).area).toMatchObject([0, 0]);
});

test('checking ship makes all the spots with a different size', () => {
    expect(Ship(3).area).toMatchObject([0, 0, 0]);
});

// a function to help testing the hit function
const testingHit = (test, number) => {
    test.hit(number);
    return test.area
}

test('hit function works', () => {
    expect(testingHit(Ship(4), 2)).toMatchObject([0, 0, 1, 0]);
});

test('hit function works with a different number', () => {
    expect(testingHit(Ship(4), 0)).toMatchObject([1, 0, 0, 0]);
});

