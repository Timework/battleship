const rewire = require('rewire');

// tests for the ship constructor
const ship = rewire('./components/ship').__get__("ship");

test('ship length is correct', () => {
    expect(ship(4).size).toBe(4);
});

test('checking ship length with a different number', () => {
    expect(ship(2).size).toBe(2);
});

