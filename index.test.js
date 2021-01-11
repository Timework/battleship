const rewire = require('rewire');

const Ship = rewire('./components/ship').__get__("Ship");
const Gameboard = rewire('./components/gameboard').__get__("Gameboard");
const Player = rewire('./components/player').__get__("Player");

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
        expect(placeShip(Ship(1), 9, 9, false)).toBe(1);
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

    // this will place two ships in the same location
    const sameShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        return testboard.ships();
    };

    test('gameboard will not place a ship that is in the same location of another ship', () => {
        expect(sameShips(Ship(4), 0, 0, true)).toBe(1);
    });

    test('gameboard will not place a ship that is in the same location of another ship with different numbers', () => {
        expect(sameShips(Ship(1), 5, 5, true)).toBe(1);
    });

    // this function will make two ships overlap slightly to help test the gameboard not allowing overlapping
    // this will overlap if the ship size is three or bigger
    const overlapShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate, yCoordinate - 2, vertical);
        return testboard.ships();
    };

    test('gameboard will not allow ships that overlap with another ship', () => {
        expect(overlapShips(Ship(3), 4, 4, true)).toBe(1);
    });

    // this function will cross ships if the ships are size 3 or bigger
    const crossShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate - 2, yCoordinate + 2, !vertical);
        return testboard.ships();
    };

    test('gameboard will not allow ships that overlap ships in a cross formation', () => {
        expect(crossShips(Ship(3), 4, 4, true)).toBe(1);
    });

    // this function will put two ships next to each other if they are vertical
    const nearShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate - 1, yCoordinate, vertical);
        return testboard.ships();
    };

    test('gameboard will not allow ships to be next together vertically', () => {
        expect(nearShips(Ship(2), 4, 4, true)).toBe(1);
    });

    // this function will put two ships next to each other if they are horiztonally
    const hnearShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate, yCoordinate + 1, vertical);
        return testboard.ships();
    };

    test('gameboard will not allow ships to be next together horizontally', () => {
        expect(hnearShips(Ship(3), 4, 4, false)).toBe(1);
    });

    // this function will put two ships diagionally together make the ship 1 length
    const diagShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate + 1, yCoordinate + 1, vertical);
        return testboard.ships();
    };

    test('gameboard will not allow ships to be next together diagionally', () => {
        expect(diagShips(Ship(1), 4, 4, true)).toBe(1);
    });

    // this function will put two ships almost diagionally together make the ship 1 length
    const almostDiagShips = (ship, xCoordinate, yCoordinate, vertical) => {
        const testboard = Gameboard();
        testboard.place(ship, xCoordinate, yCoordinate, vertical);
        testboard.place(ship, xCoordinate + 1, yCoordinate + 2, vertical);
        return testboard.ships();
    };

    test('gameboard will allow ships to be almost next together diagionally', () => {
        expect(almostDiagShips(Ship(1), 4, 4, true)).toBe(2);
    });

    // this will commit an attack on that board
    const attackSample = (attackx, attacky) => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(attackx, attacky);
        return testboard.showAttacks();
    };
    

    test('gameboard can recieve an attack', () => {
        expect(attackSample(2, 2)).toMatchObject([[2, 2]]);
    });

    test('gameboard can recieve an attack with a diffent number', () => {
        expect(attackSample(3, 4)).toMatchObject([[3, 4]]);
    });

    // this will commit two attacks on the board
    const doubleAttack = (attackx, attacky, attackxx, attackyy) => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(attackx, attacky);
        testboard.receiveAttack(attackxx, attackyy);
        return testboard.showAttacks();
    };

    test('gameboard can recieve two attacks', () => {
        expect(doubleAttack(3, 3, 4, 5)).toMatchObject([[3, 3], [4, 5]]);
    });

    test('gameboard can recieve two attacks with different numbers', () => {
        expect(doubleAttack(5, 5, 0, 1)).toMatchObject([[5, 5], [0, 1]]);
    });

    // this will attack the same place twice
    const doubleSame = (attackx, attacky) => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(attackx, attacky);
        testboard.receiveAttack(attackx, attacky);
        return testboard.showAttacks();
    };

    test('gameboard can will not allow the same attack twice', () => {
        expect(doubleSame(2, 2)).toMatchObject([[2, 2]]);
    });

    test('gameboard can will not allow the same attack twice with a different number', () => {
        expect(doubleSame(3, 4)).toMatchObject([[3, 4]]);
    });

    // this will sink a ship
    const singleSink = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(2, 3);
        testboard.receiveAttack(2, 4);
        testboard.receiveAttack(2, 5);
        return testboard.sunk();
    };

    test('gameboard can sink a ship', () => {
        expect(singleSink()).toBe(1);
    });

    // this will sink two ships
    const doubleSink = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(2, 3);
        testboard.receiveAttack(2, 4);
        testboard.receiveAttack(2, 5);
        testboard.receiveAttack(4, 2);
        testboard.receiveAttack(4, 3);
        testboard.receiveAttack(4, 4);
        testboard.receiveAttack(4, 5);
        return testboard.sunk();
    };

    test('gameboard can sink two ship', () => {
        expect(doubleSink()).toBe(2);
    });

    // this will sink everything and check to see
    const positiveAll = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(2, 3);
        testboard.receiveAttack(2, 4);
        testboard.receiveAttack(2, 5);
        testboard.receiveAttack(4, 2);
        testboard.receiveAttack(4, 3);
        testboard.receiveAttack(4, 4);
        testboard.receiveAttack(4, 5);
        return testboard.allSunk();
    };

    test('gameboard can detect that everything is sunk', () => {
        expect(positiveAll()).toBe(true);
    });

    // this will almost sink everything
    const negativeAll = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.place(Ship(4), 4, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(2, 3);
        testboard.receiveAttack(2, 4);
        testboard.receiveAttack(2, 5);
        testboard.receiveAttack(4, 2);
        testboard.receiveAttack(4, 3);
        testboard.receiveAttack(4, 4);
        return testboard.allSunk();
    };

    test('gameboard can that not everything is sunk', () => {
        expect(negativeAll()).toBe(false);
    });

    // this is to test the surrounding attacks that result from a boat sinking
    const surroundAttack = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 2, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(2, 3);
        testboard.receiveAttack(2, 4);
        testboard.receiveAttack(2, 5);
        return testboard.showAttacks().length;
    };

    test('gameboard will automatically attack all spaces surrounding a ship when sunk', () => {
        expect(surroundAttack()).toBe(18);
    });

    // this will put a ship on the edge of the map and then sink it to see if the attacks are counted correctly
    const surroundAttackEdge = () => {
        const testboard = Gameboard();
        testboard.place(Ship(4), 9, 2, true);
        testboard.receiveAttack(9, 2);
        testboard.receiveAttack(9, 3);
        testboard.receiveAttack(9, 4);
        testboard.receiveAttack(9, 5);
        return testboard.showAttacks().length;
    };

    test('gameboard will not autmatically attack spots that are out of bound when the ship is sunk', () => {
        expect(surroundAttackEdge()).toBe(12);
    });

    // attacks when sunk works on a different size ship as well
    const surroundAttackSmall = () => {
        const testboard = Gameboard();
        testboard.place(Ship(1), 2, 2, true);
        testboard.receiveAttack(2, 2);
        return testboard.showAttacks().length;
    };

    test('gameboard will automatically attack spots on a smaller ship', () => {
        expect(surroundAttackSmall()).toBe(9);
    });

    const surroundAttackSmallExtra = () => {
        const testboard = Gameboard();
        testboard.place(Ship(1), 2, 2, true);
        testboard.receiveAttack(2, 2);
        testboard.receiveAttack(1, 2);
        testboard.receiveAttack(3, 2);
        return testboard.showAttacks().length;
    };

    test('gameboard will not repeat attacks when a ship is sunk', () => {
        expect(surroundAttackSmallExtra()).toBe(9);
    });

  });

  describe('tests for the player constructor', function () {

    const attackPlayer = () => {
        const player1 = Player(false);
        const player2 = Player(true);
        player1.attack(player2, 2, 2);
        return player2.gameboard.showAttacks();
    };

    test('a player can attack the board', () => {
        expect(attackPlayer()).toMatchObject([[2, 2]]);
    });

    // this will win the game
    const winGame = () => {
        const player1 = Player(false);
        const player2 = Player(true);
        player2.gameboard.place(Ship(3), 2, 2, true);
        player1.attack(player2, 2, 2);
        player1.attack(player2, 2, 3);
        player1.attack(player2, 2, 4);
        return player1.win(player2);
    };


    test('player can win the game', () => {
        expect(winGame()).toBe(true);
    });

    // this will almost win the game
    const almostWinGame = () => {
        const player1 = Player(false);
        const player2 = Player(true);
        player2.gameboard.place(Ship(3), 2, 2, true);
        player1.attack(player2, 2, 2);
        player1.attack(player2, 2, 3);
        return player1.win(player2);
    };

    test('it wont say the player won if he didnt win', () => {
        expect(almostWinGame()).toBe(false);
    });

    // this will make the computer attack at random
    const computerAttack = () => {
        const player1 = Player(false);
        const player2 = Player(true);
        player2.autoAttack(player1);
        player2.autoAttack(player1);
        player2.autoAttack(player1);
        return player1.gameboard.showAttacks().length;
    };

    test('the computer can make a random attack', () => {
        expect(computerAttack()).toBe(3);
    });

    // this will check to see if the computer updates the available attacks
    const computerUpdate = () => {
        const player1 = Player(false);
        const player2 = Player(true);
        player1.gameboard.place(Ship(3), 2, 2, true);
        player2.attack(player1, 2, 2);
        player2.attack(player1, 2, 3);
        player2.attack(player1, 2, 4);
        player2.updateAttack(player1);
        player2.autoAttack(player1)
        return player2.showOptionalAttacks().length;
    };

    test('the computer updates the optional attacks properly', () => {
        expect(computerUpdate()).toBe(84);
    });
  });