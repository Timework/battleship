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

    // runs initalize
    initalize();
    return {size, area, hit};
};

module.exports.Ship = Ship;