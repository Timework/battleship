const rewire = require('rewire');

const Ship = rewire('./components/ship').__get__("Ship");
const Gameboard = rewire('./components/gameboard').__get__("Gameboard");

describe('tests for the ship constructor', function () {

    test('ship length is correct', () => {
        expect(Ship(4).showSize()).toBe(4);
    });

    test('checking ship length with a different number', () => {
        expect(Ship(2).showSize()).toBe(2);
    });

    // this will check if you can change the size of a ship
    const sizeChanger = (ship, newSize) => {
        ship.size = newSize;
        return ship.showSize();
    };

    test('changing the size wont work', () => {
        expect(sizeChanger(Ship(2), 4)).toBe(2);
    });

    test('checking ship makes all the spots', () => {
        expect(Ship(2).showArea()).toMatchObject([0, 0]);
    });

    test('checking ship makes all the spots with a different size', () => {
        expect(Ship(3).showArea()).toMatchObject([0, 0, 0]);
    });

    // a function to help testing the hit function
    const testingHit = (test, number) => {
        test.hit(number);
        return test.showArea();
    }

    test('hit function works', () => {
        expect(testingHit(Ship(4), 2)).toMatchObject([0, 0, 1, 0]);
    });

    test('hit function works with a different number', () => {
        expect(testingHit(Ship(4), 0)).toMatchObject([1, 0, 0, 0]);
    });

    // a function to help test multiple hits
    const multipleHit = (test, first, second) => {
        test.hit(first);
        test.hit(second);
        return test.showArea();
    }

    test('multiple hits work', () => {
        expect(multipleHit(Ship(4), 2, 1)).toMatchObject([0, 1, 1, 0]);
    });

    test('multiple hits work with different numbers', () => {
        expect(multipleHit(Ship(4), 0, 3)).toMatchObject([1, 0, 0, 1]);
    });

    test('multiple hits in the same area doesnt do anything', () => {
        expect(multipleHit(Ship(4), 1, 1)).toMatchObject([0, 1, 0, 0]);
    });


    // this will make every position hit on a ship
    const sinkShip = (number) => {
        const testShip = Ship(number);
        for (let i = 0; i < number; i++){
            testShip.hit(i);
        };
        return testShip;
    }


    test('function to check if something is sunk', () => {
        expect(sinkShip(4).isSunk()).toBe(true);
    });

    test('function to check if something is sunk with a different size ship', () => {
        expect(sinkShip(2).isSunk()).toBe(true);
    });

    // almost sinks the ship
    const almostSinkShip = (number) => {
        const testShip = Ship(number);
        for (let i = 0; i < number-1; i++){
            testShip.hit(i);
        };
        return testShip;
    }

    test('will return false when the ship is not sunk', () => {
        expect(almostSinkShip(2).isSunk()).toBe(false);
    });

    test('will return false when the ship is not sunk with a different size ship', () => {
        expect(almostSinkShip(4).isSunk()).toBe(false);
    });

    test('will return false when the ship is not hit', () => {
        expect(Ship(4).isSunk()).toBe(false);
    });

});

describe('tests for the gameboard constructor', function () {

    // function to help place ships on the gameboard
    const placeShip = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        return testboard.ships();
    };

    test('gameboard can properly place ships', () => {
        expect(placeShip(Ship(2), 2, 3, true)).toBe(1);
    });

    test('gameboard can properly place ships with different specs', () => {
        expect(placeShip(Ship(4), 0, 0, false)).toBe(1);
    });

    // function to help place multiple ships on the gameboard
    const placeMultipleShip = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate - 2, yCoordinate - 2, !vertical);
        return testboard.ships();
    };

    test('gameboard can properly place more than 1 ship', () => {
        expect(placeMultipleShip(Ship(4), 2, 2, true)).toBe(2);
    });

    test('gameboard can properly place more than 1 ship with different specs', () => {
        expect(placeMultipleShip(Ship(2), 4, 4, false)).toBe(2);
    });

    test('gameboard will not place a ship that goes out of bounds', () => {
        expect(placeShip(Ship(4), 8, 8, true)).toBe(0);
    });

    test('gameboard will not place a ship that goes out of bounds horiztonally', () => {
        expect(placeShip(Ship(4), 8, 8, false)).toBe(0);
    });

    test('gameboard will still place a ship that is on the edge', () => {
        expect(placeShip(Ship(1), 10, 10, false)).toBe(1);
    });

    test('gameboard will not place a ship on negative y coordinates', () => {
        expect(placeShip(Ship(3), 0, -2, false)).toBe(0);
    });

    test('gameboard will not place a ship on negative x coordinates', () => {
        expect(placeShip(Ship(3), -2, 0, false)).toBe(0);
    });

    test('gameboard will not place a ship on negative x & y coordinates', () => {
        expect(placeShip(Ship(3), -2, -2, true)).toBe(0);
    });

    const sameShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        // changed the occupired back to ships once you are done debugging
        return testboard.occupied;
    };

    test('gameboard will not place a ship that overlaps with another ship', () => {
        expect(sameShips(Ship(4), 0, 0, true)).toBe(1);
    });

  });