(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let Ship = require('./ship');
Ship = Ship.Ship;

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

    const checkSpot = (ship, xCoordinate, yCoordinate, vertical) => {
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
        return [ship, xCoordinate, yCoordinate, vertical];
    };

    // this will choose random coordinates for ship placement
    const randomPlacement = () => {
        for (let i = 5; i > 1; i--) {
            let size = showOptions(Ship(i));
            let random = randomSelect(size.length);
            place(size[random][0], size[random][1], size[random][2], size[random][3]);
        };
        const lastsize = showOptions(Ship(3));
        const lastrandom = randomSelect(lastsize.length);
        place(lastsize[lastrandom][0], lastsize[lastrandom][1], lastsize[lastrandom][2], lastsize[lastrandom][3]);
    };

    // this will select a random option
    const randomSelect = (source) => {
        return Math.floor(Math.random() * Math.floor(source))
    };

    // this will show the options available for ship placement
    const showOptions = (ship) => {
        acceptable = [];
        for (let i = 0; i < 10; i++){
            for (let ii = 0; ii < 10; ii++){
                if (checkSpot(ship, i, ii, true)){
                    acceptable.push(checkSpot(ship, i, ii, true));
                };
                if (checkSpot(ship, i, ii, false)){
                    acceptable.push(checkSpot(ship, i, ii, false));
                };
            };
        };
        return acceptable
    };

    // checks to see if the ship would be out of bounds
    const boundChecker = (size, coordinate) => {
        finalCoordinate = size + coordinate;
        return finalCoordinate <= 10;
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
            let result = hitShip(currentAttack);
            return [true, result];
        } else {
            return [false, false];
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
                        if (occupied[i][occupied[i].length -1].isSunk()) {
                            return attackSurrounding(occupied[i]);
                        };
                        return true;
                    };
                };
            };
        };
        attacks.push(attack);
        return false;
    };

    // this will attack the surrounding area of a ship if it is sunk
    const attackSurrounding = (destroyedShip) => {
        let newAttacks = []
        for (let i = 0; i < destroyedShip.length; i++){
            for (let ii = -1; ii < 2; ii++){
                let xCoordinate = destroyedShip[i][0] + ii;
                if (xCoordinate >= 0 && xCoordinate <= 9) {
                    for (let iii = -1; iii < 2; iii++) {
                        let yCoordinate = destroyedShip[i][1] + iii;
                        if (yCoordinate >= 0 && yCoordinate <= 9) {
                            let currentAttack = [xCoordinate, yCoordinate];
                            if (!attackChecker(currentAttack)) {
                                newAttacks.push(currentAttack);
                                attacks.push(currentAttack);
                            };
                        };
                    };
                };
            };
        };
        return newAttacks
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

    return {place, ships, receiveAttack, showAttacks, sunk, allSunk, occupied, randomPlacement}

};

module.exports.Gameboard = Gameboard;
},{"./ship":5}],2:[function(require,module,exports){

let Player = require('./player');
Player = Player.Player;

let Ship = require('./ship');
Ship = Ship.Ship;


const Gamedom = () => {
    // this will tell you if there is an ai in the game
    let ai = false;

    // declaring the players
    let player1;
    let player2;
    let difficulty;

    // runs in the beginning of a game
    const init = () => {
        if (document.getElementById("makeSinglePlayer")) {
            chooseForm();
            singlePlayerForm();
            twoPlayerForm();
        };
    };

    // program the ability to choose from single player or multiplayer
    const chooseForm = () => {
        const single = document.getElementById("toSinglePlayer");
        const multiplayer = document.getElementById("toTwoPlayer");
        single.addEventListener('click', () => {
            singlePlayerFormReveal();
        });
        multiplayer.addEventListener('click', () => {
            twoPlayerFormReveal();
        });
    };

    // this will show the two player form while hiding the original form
    const twoPlayerFormReveal = () => {
        hideForm("computerOrPlayerForm");
        showForm("twoPlayerForm");
    };

    // this will show the single player form while hiding the original form
    const singlePlayerFormReveal = () => {
        hideForm("computerOrPlayerForm");
        showForm("firstPlayerForm");
    };

    // this will hide the from you choose
    const hideForm = (formName) => {
        const originalForm = document.getElementById(formName);
        originalForm.style.display = "none";
    };

    // this will show the form
    const showForm = (formName) => {
        const originalForm = document.getElementById(formName);
        originalForm.style.display = "block";
    };

    // program single player start up
    const singlePlayerForm = () => {
        const first = document.getElementById("makeSinglePlayer");
        first.addEventListener('click', () => { singlePlayerGame() });
    };

    // program two player start up
    const twoPlayerForm = () => {
        const second = document.getElementById("makeTwoPlayers");
        second.addEventListener('click', () => { multiplayerGame() });
    };

    // single player game start 
    const singlePlayerGame = () => {
        hideForm("firstPlayerForm");
        singlePlayer();
    };

    // multiplayer game start
    const multiplayerGame = () => {
        hideForm("twoPlayerForm");
        multiplayer();
    };

    // launches two player mode
    const multiplayer = () => {
        let firstName = document.getElementById("onePlayer").value;
        let secondName = document.getElementById("twoPlayer").value;
        twoPlayer(firstName, secondName);
    };

    // this will set up the game if there is two players
    const twoPlayer = (first, second) => {
        player1 = Player(false, first);
        player2 = Player(false, second);
    };

    // this will tell you the players names
    const players = () => {
        if (player1.name) {
            return (`${player1.name}, ${player2.name}`);
        } else {
            return "Players have not been declared"
        };
    };

    // this will set up the game with one player and a computer
    const onePlayer = (first) => {
        player1 = Player(false, first);
        player2 = Player(true);
        ai = true;
        difficulty = setDifficulty();
        testPackage();
    };

    // launches single player mode
    const singlePlayer = () => {
        let name = document.getElementById("firstPlayer").value;
        onePlayer(name);
    };

    // this will be how the first player attacks
    const singlePlayerAttack = (coordinates) => {
        clearMessage("error");
        let result = player1.attack(player2, coordinates[0], coordinates[1]);
        if (winLoop(player1, player2)) {
            markSquare(coordinates, "red");
            markSurrounding(result[1]);
            return;
        };
        if (result[0] && Array.isArray(result[1])) {
            markSquare(coordinates, "red");
            markSurrounding(result[1]);
        } else if (result[0] && result[1]) {
            markSquare(coordinates, "red");
            if (winLoop(player2, player1)) {
                return;
            };
        } else if (result[0]) {
            markSquare(coordinates, "green");
            computerMove(difficulty);
            if (winLoop(player2, player1)) {
                return;
            };
        } else {
            errorMessage("That space has already been attacked");
        };
    };

    // this will set a time delay
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // this will be the computer move in single player mode
    const computerMove = async (level) => {
        await delay(250);
        if (winLoop(player2, player1)) {
            return;
        };
        let move = player2.autoAttack(player1, level);
        if (move[0] && Array.isArray(move[1])) {
            markComputerSquare(move[2], "red");
            markComputerSurrounding(move[1]);
            if (winLoop(player2, player1)) {
                return;
            };
            computerMove(level);
        } else if (move[0] && move[1]) {
            markComputerSquare(move[2], "red");
            computerMove(level);
        } else if (move[0]) {
            markComputerSquare(move[2], "green");
        } else {
            computerMove(level);
        };
    };

    // this will set the difficuty of the ai
    const setDifficulty = () => {
        let radios = document.getElementsByName("difficulty");
        for (let i = 0; i < radios.length; i++){
            if (radios[i].checked) {
                return radios[i].value;
            };
        };
    };

    // this will mark your board after the computer attacks
    const markComputerSquare = (coordinates, color) => {
        let square = document.getElementById(`1, ${coordinates[0]}, ${coordinates[1]}`);
        square.classList.add(color);
    };

    // this will mark the area around a sunk ship after a computer attack
    const markComputerSurrounding = (position) => {
        for (let i = 0; i < position.length; i++){
            markComputerSquare(position[i], "green");
        };
    };

    // this will make the area around a sunk ship marked
    const markSurrounding = (position) => {
        for (let i = 0; i < position.length; i++){
            markSquare(position[i], "green");
        };
    };

    // this will mark the square after it has been attack
    const markSquare = (coordinates, color) => {
        let square = document.getElementById(`${coordinates[0]}, ${coordinates[1]}`);
        square.classList.add(color);
    };

     // this will generate the second board
     const generateSecondBoard = () => {
        const board = document.getElementById("board1");
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                let square = document.createElement("div");
                square.id = `1, ${ii}, ${i}`
                square.classList.add("square");
                board.appendChild(square);
            };
        };
    };

    // this will generate the board
    const generateBoard = () => {
        const board = document.getElementById("board");
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                let square = document.createElement("div");
                square.id = `${ii}, ${i}`
                square.addEventListener('click', () => {singlePlayerAttack([ii, i])});
                square.classList.add("square");
                board.appendChild(square);
            };
        };
    };

    // this will run the win checking loop
    const winLoop = (first, second) => {
        if (checkWin(first, second)) {
            announceWinner(first);
            return true;
        } else {
            return false;
        };
    };

    // this will check if there is a winner
    const checkWin = (first, second) => {
        return first.win(second);
    };

    // this will announce the winner
    const announceWinner = (player) => {
        let announcement = document.getElementById('result');
        announcement.innerHTML = `${player.name} won!`
    };

    // this will set up an error message
    const errorMessage = (message) => {
        let errorHolder = document.getElementById("error");
        errorHolder.innerHTML = message;
    };

    // this will clear the error message
    const clearMessage = (message) => {
        let holder = document.getElementById(message);
        holder.innerHTML = "";
    };

    // will set up ships on the board determinded testing purposes only
    const testBoardSetUp = (player) => {
        player.gameboard.place(Ship(2), 2, 2, true);
        player.gameboard.place(Ship(3), 4, 4, true);
        player.gameboard.place(Ship(3), 9, 6, true);
        player.gameboard.place(Ship(4), 4, 8, false);
        player.gameboard.place(Ship(5), 0, 0, false);
    };

    // this will hold the test package
    const testPackage = () => {
        player1.gameboard.randomPlacement();
        player2.gameboard.randomPlacement();
        generateBoard();
        generateSecondBoard();
        markOccupied(player1);
    };

    // mark the occupied squares with the color blue
    const markOccupied = (player) => {
        let positions = player.gameboard.occupied;
        for (let i = 0; i < positions.length; i++){
            for (let ii = 0; ii < positions[i].length - 1; ii++){
                markComputerSquare(positions[i][ii], "blue");
            }
        };
    };


    init ();
    return {twoPlayer, players, onePlayer, singlePlayer};
};

module.exports.Gamedom = Gamedom;
},{"./player":4,"./ship":5}],3:[function(require,module,exports){
let Gameboard = require("./gameboard");
let Player = require("./player");
let Gamedom = require("./gamedom");
let Ship = require("./ship");

Gameboard = Gameboard.Gameboard;
Player = Player.Player;
Gamedom = Gamedom.Gamedom;
Ship = Ship.Ship;

const game = Gamedom();
},{"./gameboard":1,"./gamedom":2,"./player":4,"./ship":5}],4:[function(require,module,exports){

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
},{"./gameboard":1}],5:[function(require,module,exports){
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
        area[spot] = 1;
        } else {
            return "This spot was already hit"
        };
    };

    // checking to see if all the positions are hit
    const isSunk = () => {
        const hitChecking = (position) => position === 1;
        return area.every(hitChecking);
    };

    // this will show the area without letting it be changed
    const showArea = () => {
        return area;
    };

    // this will show the size without letting it be changed
    const showSize = () => {
        return size;
    };

    // runs initalize
    initalize();
    return {showSize, showArea, hit, isSunk};
};

module.exports.Ship = Ship;
},{}]},{},[3]);
