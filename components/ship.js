const Ship = (size) => {
    // this will hold the area of the ship
    let area = [];

    // this will run when object is made
    const initalize = () => {
        makeArea();
    };

    // making the area of the ship
    const makeArea = () => {
        for (let i = 0; i < size; i++) {
            area.push(0);
        };
    };

    // hitting a spot function
    const hit = (spot) => {
        if (area[spot] === 0) {
        area[spot] = 1
        } else {
            return "This spot was already hit"
        };
    };

    // checking to see if all the positions are hit
    const isSunk = () => {
        const hitChecking = (position) => position === 1;
        return area.every(hitChecking);
    }

    // this will show the area without letting it be changed
    const showArea = () => {
        return area;
    }

    // this will show the size without letting it be changed
    const showSize = () => {
        return size;
    }

    // runs initalize
    initalize();
    return {showSize, showArea, hit, isSunk};
};

module.exports.Ship = Ship;