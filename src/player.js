
let Gameboard = require('./gameboard');
Gameboard = Gameboard.Gameboard;

const Player = (ai, name = "Computer") => {
    let gameboard = Gameboard();
    let optionalAttacks = [];
    let foundShip = false;
    let knownShip = [];
    let firstContact = "";
    let knowny = false;
    let knownx = false;
    let unsunkShips = {
        five:1,
        four:1,
        three:2,
        two:1, 
    };
    let hitCounter = 0;
    let hardBoard = [];
    let originalShip = [];

    // this will do the attack for the very hard mode
    const hardAttack = (enemy) => {
        resetHardBoard();
        hardPatternBoard();
        shipPointAdder();
        let randomNumber = hardBoardTotal();
        let attack = "";
        if (randomNumber <= 1240) {
            attack = highestAttack();
        } else {
            let random = randomAttack(randomNumber);
            attack = findAttack(random);
        };
        let result = enemy.gameboard.receiveAttack(attack[0], attack[1]);
        result.push([attack[0], attack[1]]);
        return result;
    };

    // this will select one of the options for the highest chance of hitting
    const highestAttack = () => {
        let source = hardBoardHighestAttacks();
        let random = randomAttack(source.length);
        return [source[random][0], source[random][1]];
    };

    // this will find the attacks that share the most options
    const hardBoardHighestAttacks = () => {
        let high = hardBoardHighest();
        let answer = [];
        hardBoard.forEach((x) => {
            if (x[2] === high){
                answer.push([x[0], x[1]]);
            };
        });
        return answer
    };

    // this will find the space with the most options
    const hardBoardHighest = () => {
        let total = 0;
        hardBoard.forEach((x) => {
            if (x[2] > total){
                total = x[2];
            };
        });
        return total;
    };

    // this will find the attack for very hard mode
    const findAttack = (random) => {
        let counter = 0;
        for (let i = 0; i < hardBoard.length; i++){
            counter += hardBoard[i][2];
            if (random <= counter) {
                return [hardBoard[i][0], hardBoard[i][1]];
            };
        };
    };

    // this will add points based on the unsunk ships
    const shipPointAdder = () => {
        if (unsunkShips.five > 0) {
            hardPointAdded(5);
        };
        if (unsunkShips.four > 0) {
            hardPointAdded(4);
        };
        if (unsunkShips.three > 1) {
            hardPointAdded(3);
            hardPointAdded(3);
        } else if (unsunkShips.three > 0) {
            hardPointAdded(3);
        };
        if (unsunkShips.two > 0) {
            hardPointAdded(2);
        };
    };

    // this will reset hard board
    const resetHardBoard = () => {
        hardBoard = [];
    };

    // this will generate the attack pattern of the very hard mode
    const hardPatternBoard = () => {
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                hardBoard.push([i, ii, 0]);
            };
        };
    };

    // this will count the amount of points in the hard board
    const hardBoardTotal = () => {
        let total = 0;
        hardBoard.forEach((x) => {
            total += x[2];
        });
        return total;
    };

    // this will add points to the hard board
    const hardPointAdded = (ship) => {
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 10 - ship; ii++){
                let temp = [];
                for (let iii = 0; iii < ship; iii++){
                    temp.push([ii + iii, i]); 
                };
                if (theoreticalShipCheck(temp)) {
                    addPoints(temp);
                };
            };
        };
        for (let i = 0; i <= 10 - ship; i++){
            for (let ii = 0; ii <= 9; ii++){
                let temp = [];
                for (let iii = 0; iii < ship; iii++){
                    temp.push([ii, i + iii]); 
                };
                if (theoreticalShipCheck(temp)) {
                    addPoints(temp);
                };
            };
        };
    };

    // add points to the ship
    const addPoints = (ship) => {
        for (let i = 0; i < ship.length; i++){
            hardBoardAdded(ship[i]);
        };
    };

    // adds points to the hard board
    const hardBoardAdded = (ship) => {
        for (let i = 0; i <= hardBoard.length; i++){
            if (hardBoard[i][0] === ship[0]) {
                if (hardBoard[i][1] === ship[1]){
                    hardBoard[i][2] += 1;
                    return;
                };
            };
        };
    };

    // this will check to see if all the parts of the theoretical ship is possible
    const theoreticalShipCheck = (ship) => {
        for (let i = 0; i < ship.length; i++){
            if (!isOptional([ship[i][0], ship[i][1]])){
                return false;
            };
        };
        return true;
    };

    // this will run when the player is made
    const init = () => {
        if (ai) {
            generateAttacks();
        };
    };

    // this will attack the other players board
    const attack = (enemy, xCoordinate, yCoordinate) => {
        return enemy.gameboard.receiveAttack(xCoordinate, yCoordinate);
    };

    // this will check if the player won the game
    const win = (player) => {
        return player.gameboard.allSunk();
    };

    // this will generate the optional attacks the computer can make
    const generateAttacks = () => {
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                optionalAttacks.push([i, ii]);
            };
        };
    };

    // this will pick a random number for the attack
    const randomAttack = (source) => {
        return Math.floor(Math.random() * Math.floor(source))
    };

    // this will update the available attacks
    const updateAttack = (enemy) => {
        let usedAttacks = enemy.gameboard.showAttacks();
        for (let i = 0; i < usedAttacks.length; i++){
            removeAttack(usedAttacks[i]);
        };
    };

    // this will remove the attack from the available options
    const removeAttack = (usedAttack) => {
        for (let i = 0; i < optionalAttacks.length; i++){
            if (optionalAttacks[i][0] === usedAttack[0] && optionalAttacks[i][1] === usedAttack[1]) {
                optionalAttacks.splice(i, 1);
                return;
            };
        };
    };

    // this will make a random attack if it is a computer
    const autoAttack = (enemy, level) => {
        if (level === "4") {
            if (!foundShip) {
                let result = hardAttack(enemy);
                if (result[1] === true) {
                    foundShip = true;
                    firstContact = result[2];
                    markKnownShip(result[2]);
                    hitCounter += 1;
                };
                updateAttack(enemy);
                return result;
            } else {
                let result = attackKnownShip(enemy);
                return result;   
            };
        } else if (!foundShip && !(level === "4")) {
        let random = randomAttack(optionalAttacks.length);
        let result = enemy.gameboard.receiveAttack(optionalAttacks[random][0], optionalAttacks[random][1]);
        result.push([optionalAttacks[random][0], optionalAttacks[random][1]]);
        if (result[1] === true && level === "3") {
            foundShip = true;
            firstContact = result[2];
            markKnownShip(result[2]);
        } else if (result[1] === true && level === "2") {
            foundShip = true;
            markKnownShip(result[2]);
        };
        updateAttack(enemy);
        return result;
        } else if (level === "2") {
            let result = attackMedium(enemy);
            return result;
         } else {
            let result = attackKnownShip(enemy);
            return result;   
        };
    };

    // this will set an attack in the medium difficulty
    const attackMedium = (enemy) => {
        let random = randomAttack(knownShip.length);
        let result = enemy.gameboard.receiveAttack(knownShip[random][0], knownShip[random][1]);
        result.push([knownShip[random][0], knownShip[random][1]]);
        updateAttack(enemy);
        if (result[1] === true) {
            markKnownShip(result[2]);
            updateKnownAttacks();
        } else if (Array.isArray(result[1])) {
            foundShip = false;
            updateKnownAttacks();
        };
        return result;
    };

    // this will destory a ship 
    const destroyedShip = (ship) => {
        switch(ship) {
            case 2:
                unsunkShips.two -= 1;
                break;
            case 3:
                unsunkShips.three -= 1;
                break;
            case 4:
                unsunkShips.four -= 1;
                break;
            case 5:
                unsunkShips.five -= 1;
                break;
        }
    };

    // this will attack a known ship
    const attackKnownShip = (enemy) => {
        let random = randomAttack(knownShip.length);
        let result = enemy.gameboard.receiveAttack(knownShip[random][0], knownShip[random][1]);
        result.push([knownShip[random][0], knownShip[random][1]]);
        updateAttack(enemy);
        if (result[1] === true) {
            if (hitCounter >= 1){
                hitCounter += 1;
            };
            markKnownShip(result[2]);
            updateKnownAttacks();
            computerIntelligence(result[2]);
            if (knowny) {
                filterKnownAttacks(true);
            } else if (knownx) {
                filterKnownAttacks(false);
            };
        } else if (Array.isArray(result[1])) {
            if (hitCounter >= 1) {
                hitCounter += 1
                destroyedShip(hitCounter);
                hitCounter = 0;
            };
            foundShip = false;
            knowny = false;
            knownx = false;
            firstContact = "";
            originalShip = [];
            updateKnownAttacks();
        } else {
            if (hitCounter >= 1) {
                if (oppositePresent(result[2])[0]){
                    let sample = oppositePresent(result[2])[1]
                    console.log(sample);
                    removeKnown(sample);
                };
            };
        };
        return result;
    };

    // this will remove an attack from known attack spots
    const removeKnown = (coordinates) => {
        let newKnown = [];
        knownShip.forEach((x) => {
            if (x[0] === coordinates[0] && x[1] === coordinates[1]){
                
            } else {
                newKnown.push(x);
            };
        });
        knownShip = newKnown;
    };

    // this will check if the other side of the knownship attack is available
    const oppositePresent = (coordinates) => {
        if (unsunkShips.two === 1) {
            return [false];
        };
        if (!isOrigin(coordinates)){
            return [false];
        };
        let small = smallestShip();
        let result = "";
        if (coordinates[0] === firstContact[0]) {
            if (coordinates[1] > firstContact[1]){
                result = [coordinates[0], firstContact[1] - 1];
                console.log("vertical negative");
                return shipCheck(result, true, false, small);
            } else {
                result = [coordinates[0], firstContact[1] + 1];
                console.log("vertical positive");
                return shipCheck(result, true, true, small);
            };
        } else {
            if (coordinates[0] > firstContact[0]){
                result = [firstContact[0] - 1, coordinates[1]];
                console.log("horiztonal negative");
                return shipCheck(result, false, false, small);
            } else {
                result = [firstContact[0] + 1, coordinates[1]];
                console.log("horiztonal positive");
                return shipCheck(result, false, true, small);
            };
        };
    };

    // this will check if all are optional
    const allOptional = (x) => isOptional(x);

    // this will check to see if all the positions of the ship is possible
    const shipCheck = (origin, vertical, positive, size) => {
        let answer = [];
        if (vertical) {
            if (positive) {
                for (let i = 0; i < size - 1; i++){
                    answer.push([origin[0], origin[1] + i]);
                };
            } else {
                for (let i = 0; i < size - 1; i++){
                    answer.push([origin[0], origin[1] - i]);
                };
            };
        } else {
            if (positive) {
                for (let i = 0; i < size - 1; i++){
                    answer.push([origin[0] + i, origin[1]]);
                };
            } else {
                for (let i = 0; i < size - 1; i++){
                    answer.push([origin[0] - i, origin[1]]);
                };
            };
        };
        let result = answer.every(allOptional);
        return [!result, origin]
    };

    // this will find the smallest ship size
    const smallestShip = () => {
        if (unsunkShips.three >= 1){
            return 3;
        } else if (unsunkShips.four >= 1){
            return 4;
        } else {
            return 5;
        };
    };

    // this will check if the coordinates are in the original spots
    const isOrigin = (coordinates) => {
        for (let i = 0; i < originalShip.length; i++){
            if (originalShip[i][0] === coordinates[0] && originalShip[i][1] === coordinates[1]) {
                return true;
            };
        };
        return false;
    };

    // this will choose y-axis or x-axis depending on the coordinates
    const computerIntelligence = (coordinates) => {
        if (coordinates[0] === firstContact[0]){
            knownx = true;
        } else {
            knowny = true;
        };
    };

    // refresh optional attacks for known ship
    const updateKnownAttacks = () => {
        let newKnown = []
        for (let i = 0; i < knownShip.length; i++){
            if (isOptional(knownShip[i])){
                newKnown.push(knownShip[i]);
            };
        };
        knownShip = newKnown;
    };

    // filters the ai to make smarter moves
    const filterKnownAttacks = (yaxis) => {
        let newKnown = []
        for (let i = 0; i < knownShip.length; i++){
            if (isOptional(knownShip[i])){
                if (filterChecker(knownShip[i], yaxis)) {
                    newKnown.push(knownShip[i]);
                };
            };
        };
        knownShip = newKnown;
    };

    // this will help check to see if they pass the filter
    const filterChecker = (coordinates, yaxis) => {
        if (yaxis) {
            return coordinates[1] === firstContact[1];
        } else {
            return coordinates[0] === firstContact[0];
        };
    };

    // this will mark the available known ship locations
    const markKnownShip = (coordinates) => {
        let options = [];
        let markOriginal = false
        if (originalShip.length === 0) {
            markOriginal = true
        };
        for (let i = -1; i < 2; i+=2){
            options.push([coordinates[0] + i, coordinates[1]]);
            options.push([coordinates[0], coordinates[1] + i]);
        };
        for (let i = 0; i < options.length; i++){
            if (isOptional(options[i])){
                if (hardBoard.length !== 0){
                    if (unsunkShips.two >= 1){
                        knownShip.push(options[i]);
                        if (markOriginal) {
                            originalShip.push(options[i]);
                        };
                    } else {
                        let size = smallestShip();
                        if (markOriginal) {
                            if (viableOption(options[i], size)){
                                knownShip.push(options[i]);
                                originalShip.push(options[i]);
                            };
                        } else {
                            knownShip.push(options[i]);
                        };
                    };
                } else {
                    knownShip.push(options[i]);
                };
            };
        };
    };

    // this will check if it is an available option in the hard board
    const viableOption = (coordinates, size) => {
        if (coordinates[0] === firstContact[0]){
            return isViable(true, size);
        } else {
            return isViable(false, size);
        };
    };

    // this will check if it is possible for a ship to be in the vertical or horizontal coorindates
    const isViable = (vertical, size) => {
        let count = 1;
        if (vertical) {
            let sample = [firstContact[0], firstContact[1] + 1];
            while (isOptional(sample)) {
                count += 1;
                sample[1] += 1;
            };
            let secondsample = [firstContact[0], firstContact[1] - 1];
            while (isOptional(secondsample)) {
                count += 1;
                secondsample[1] -= 1;
            };
        } else {
            let sample = [firstContact[0] + 1, firstContact[1]];
            while (isOptional(sample)) {
                count += 1;
                sample[0] += 1;
            };
            let secondsample = [firstContact[0] - 1, firstContact[1]];
            while (isOptional(secondsample)) {
                count += 1;
                secondsample[0] -= 1;
            };
        };
        return count >= size;
    };

    // this will check if a move is possible
    const isOptional = (coordinates) => {
        for (let i = 0; i < optionalAttacks.length; i++){
            if (optionalAttacks[i][0] === coordinates[0] && optionalAttacks[i][1] === coordinates[1]){
                return true;
            };
        };
        return false;
    };

    // this will show the optional attacks
    const showOptionalAttacks = () => {
        return optionalAttacks;
    };

    init();

    return {attack, gameboard, win, autoAttack, updateAttack, showOptionalAttacks, name, ai};
}

module.exports.Player = Player;