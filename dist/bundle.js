(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
                        if (occupied[i][occupied[i].length -1].isSunk()) {
                            attackSurrounding(occupied[i]);
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
        for (let i = 0; i < destroyedShip.length; i++){
            for (let ii = -1; ii < 2; ii++){
                let xCoordinate = destroyedShip[i][0] + ii;
                if (xCoordinate >= 0 && xCoordinate <= 9) {
                    for (let iii = -1; iii < 2; iii++) {
                        let yCoordinate = destroyedShip[i][1] + iii;
                        if (yCoordinate >= 0 && yCoordinate <= 9) {
                            let currentAttack = [xCoordinate, yCoordinate];
                            if (!attackChecker(currentAttack)) {
                                attacks.push(currentAttack);
                            };
                        };
                    };
                };
            };
        };
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
},{}],2:[function(require,module,exports){

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
        markSquare(coordinates);
        if (winLoop(player1, player2)) {
            return;
        };
        if (result) {
            player2.autoAttack(player1);
            if (winLoop(player2, player1)) {
                return;
            };
        } else {
            errorMessage("That space has already been attacked");
        };
    };

    // this will mark the square after it has been attack
    const markSquare = (coordinates) => {
        let square = document.getElementById(`${coordinates[0]}, ${coordinates[1]}`);
        square.classList.add("green");
    };

    // this will generate the board
    const generateBoard = () => {
        const board = document.getElementById("board");
        for (let i = 0; i <= 9; i++){
            for (let ii=0; ii <= 9; ii++){
                let square = document.createElement("div");
                square.id = `${i}, ${ii}`
                square.addEventListener('click', () => {singlePlayerAttack([i, ii])});
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
        result.innerHTML = `${player.name} won!`
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
        player.gameboard.place(Ship(4), 2, 2, true);
        player.gameboard.place(Ship(4), 4, 2, true);
        player.gameboard.place(Ship(4), 6, 2, true);
    };

    // this will hold the test package
    const testPackage = () => {
        testBoardSetUp(player1);
        testBoardSetUp(player2);
        generateBoard();
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
    const randomAttack = () => {
        return Math.floor(Math.random() * Math.floor(optionalAttacks.length))
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
    const autoAttack = (enemy) => {
        let random = randomAttack();
        enemy.gameboard.receiveAttack(optionalAttacks[random][0], optionalAttacks[random][1]);
        updateAttack(enemy);
    };

    // this will show the optional attacks
    const showOptionalAttacks = () => {
        return optionalAttacks;
    }

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
