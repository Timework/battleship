
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
        return Math.floor(Math.random() * Math.floor(source.length))
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
        if (!foundShip) {
        let random = randomAttack(optionalAttacks);
        let result = enemy.gameboard.receiveAttack(optionalAttacks[random][0], optionalAttacks[random][1]);
        result.push([optionalAttacks[random][0], optionalAttacks[random][1]]);
        if (result[1] === true && level === "3") {
            foundShip = true;
            firstContact = result[2];
            markKnownShip(result[2]);
        } else if (result[1] === true && level === "2"){
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
        let random = randomAttack(knownShip);
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

    // this will attack a known ship
    const attackKnownShip = (enemy) => {
        let random = randomAttack(knownShip);
        let result = enemy.gameboard.receiveAttack(knownShip[random][0], knownShip[random][1]);
        result.push([knownShip[random][0], knownShip[random][1]]);
        updateAttack(enemy);
        if (result[1] === true) {
            markKnownShip(result[2]);
            updateKnownAttacks();
            computerIntelligence(result[2]);
            if (knowny) {
                filterKnownAttacks(true);
            } else if (knownx) {
                filterKnownAttacks(false);
            };
        } else if (Array.isArray(result[1])) {
            foundShip = false;
            knowny = false;
            knownx = false;
            firstContact = "";
            updateKnownAttacks();
        };
        return result;
    };


    // this will choose y-axis or x-axis depending on the coordinates
    computerIntelligence = (coordinates) => {
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
        for (let i = -1; i < 2; i+=2){
            options.push([coordinates[0] + i, coordinates[1]]);
            options.push([coordinates[0], coordinates[1] + i]);
        };
        for (let i = 0; i < options.length; i++){
            if (isOptional(options[i])){
                knownShip.push(options[i]);
            };
        };
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