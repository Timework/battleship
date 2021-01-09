const Gameboard = () => {

    // keeps track of occupied area
    let occupied = [];

    // keeps track of attacks
    let attacks = [];

    // places a ship
    const place = (ship, xCoordinate, yCoordinate, vertical) => {
        // will hold the new ships coordinates until it is ready to be placed
        let newShip = [];
        // keeps track of the ship's size
        let shipSize = ship.showSize();

        // checks to make sure the coordinates are positive if not does not place the ship
        if (!positiveChecker(xCoordinate, yCoordinate)) {
            return false;
        };
        
        // places the ship as long as all the coordinates remains in bounds
        if (vertical) {
            if (boundChecker(shipSize, yCoordinate)) {
                for (let i = 0; i < shipSize; i++){
                    if (emptyChecker([xCoordinate, yCoordinate + i])){
                        newShip.push([xCoordinate, yCoordinate + i]);
                    } else {
                        return false;
                    };
                };
            } else {
                return false;
            };
        } else {
            if (boundChecker(shipSize, xCoordinate)) {
                for (let i = 0; i < shipSize; i++){
                    if (emptyChecker([xCoordinate + i, yCoordinate])){
                        newShip.push([xCoordinate + i, yCoordinate]);
                    } else {
                        return false;
                    };
                };
            } else {
                return false;
            };
        };
        // puts the ship in the object to keep track of hits
        newShip.push(ship);
        // the ship is placed on board
        occupied.push(newShip);
        return true;
    };

    // checks to see if the ship would be out of bounds
    const boundChecker = (size, coordinate) => {
        finalCoordinate = size + coordinate;
        return finalCoordinate <= 11;
    };

    // checks to see if the ship's coordinates are positive
    const positiveChecker = (xCoordinate, yCoordinate) => {
        return (xCoordinate >= 0 && yCoordinate >= 0);
    };

    // checks to see if the coordinate is already occupied or near a ship
    const emptyChecker = (coordinates) => {
        for (let i = 0; i < occupied.length; i++) {
            for (let ii = 0; ii < occupied[i].length - 1; ii++) {
                for (let j = -1; j <= 1; j++) {
                    if ((occupied[i][ii][0] + j) === coordinates[0]) {
                        for (let jj = -1; jj <= 1; jj++){
                            if ((occupied[i][ii][1] + jj) === coordinates[1]) {
                                return false;
                            };
                        };   
                    };
                };
            };
        };
        return true;
    };

    // counts the ships
    const ships = () => {
        return occupied.length;
    };

    // this will commit an attack
    const receiveAttack = (attackx, attacky) => {
        let currentAttack = [attackx, attacky];
        if (!attackChecker(currentAttack)){
            hitShip(currentAttack);
            return true;
        } else {
            return false;
        };
    };

    // this will hit any ships that are on the attack coordinates
    const hitShip = (attack) => {
        for (let i = 0; i < occupied.length; i++){
            for (let ii = 0; ii < occupied[i].length - 1; ii++){
                if (occupied[i][ii][0] === attack[0]) {
                    if (occupied[i][ii][1] === attack[1]) {
                        occupied[i][occupied[i].length -1].hit(ii);
                        attacks.push(attack);
                        return true;
                    };
                };
            };
        };
        attacks.push(attack);
        return false;
    };

    // this will check to see if the attack has already been made
    const attackChecker = (attack) => {
        for (let i = 0; i < attacks.length; i++){
            if (attacks[i][0] === attack[0] && attacks[i][1] === attack[1]){
                return true;
            };
        };
        return false;
    };

    // this will count how many ships have been sunk
    const sunk = () => {
        let counter = 0
        for (let i = 0; i < occupied.length; i++){
            if (occupied[i][occupied[i].length - 1].isSunk()) {
                counter += 1;
            };
        };
        return counter;
    };

    // this will show attacks
    const showAttacks = () => {
        return attacks;
    };

    // this will tell you if all the ships are sunk
    const allSunk = () => {
        return (sunk() === occupied.length);
    };

    return {place, ships, receiveAttack, showAttacks, sunk, allSunk, occupied}

};

module.exports.Gameboard = Gameboard;