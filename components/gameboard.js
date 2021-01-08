const Gameboard = () => {

    // keeps track of occupied area
    let occupied = [];

    // places a ship
    const place = (ship, xCoordinate, yCoordinate, vertical) => {
        // will hold the new ships coordinates until it is ready to be placed
        let newShip = [];
        // keeps track of the ship's size
        let shipSize = ship.showSize();

        // checks to make sure the coordinates are positive if not does not place the ship
        if (!positiveChecker(xCoordinate, yCoordinate)) {
            return;
        };
        
        // places the ship as long as all the coordinates remains in bounds
        if (vertical) {
            if (boundChecker(shipSize, yCoordinate)) {
                for (let i = 0; i < shipSize; i++){
                    if (emptyChecker([xCoordinate, yCoordinate + i])){
                        newShip.push([xCoordinate, yCoordinate + i]);
                    } else {
                        return;
                    };
                };
            } else {
                return;
            };
        } else {
            if (boundChecker(shipSize, xCoordinate)) {
                for (let i = 0; i < shipSize; i++){
                    if (emptyChecker([xCoordinate + i, yCoordinate])){
                        newShip.push([xCoordinate + i, yCoordinate]);
                    } else {
                        return;
                    };
                };
            } else {
                return;
            };
        };
        // puts the ship in the object to keep track of hits
        newShip.push(ship);
        // the ship is placed on board
        occupied.push(newShip);
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

    return {place, ships, occupied}

};

module.exports.Gameboard = Gameboard;