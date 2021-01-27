(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
!function(t,e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define([],e):t.Draggable=e()}(this,function(){"use strict";var t={grid:0,filterTarget:null,limit:{x:null,y:null},threshold:0,setCursor:!1,setPosition:!0,smoothDrag:!0,useGPU:!0,onDrag:u,onDragStart:u,onDragEnd:u},e={transform:function(){for(var t=" -o- -ms- -moz- -webkit-".split(" "),e=document.body.style,n=t.length;n--;){var o=t[n]+"transform";if(o in e)return o}}()},n={assign:function(){for(var t=arguments[0],e=arguments.length,n=1;n<e;n++){var o=arguments[n];for(var i in o)t[i]=o[i]}return t},bind:function(t,e){return function(){t.apply(e,arguments)}},on:function(t,e,o){if(e&&o)n.addEvent(t,e,o);else if(e)for(var i in e)n.addEvent(t,i,e[i])},off:function(t,e,o){if(e&&o)n.removeEvent(t,e,o);else if(e)for(var i in e)n.removeEvent(t,i,e[i])},limit:function(t,e){return e instanceof Array?t<(e=[+e[0],+e[1]])[0]?t=e[0]:t>e[1]&&(t=e[1]):t=+e,t},addEvent:"attachEvent"in Element.prototype?function(t,e,n){t.attachEvent("on"+e,n)}:function(t,e,n){t.addEventListener(e,n,!1)},removeEvent:"attachEvent"in Element.prototype?function(t,e,n){t.detachEvent("on"+e,n)}:function(t,e,n){t.removeEventListener(e,n)}};function o(e,o){var i=this,r=n.bind(i.start,i),s=n.bind(i.drag,i),u=n.bind(i.stop,i);if(!a(e))throw new TypeError("Draggable expects argument 0 to be an Element");o=n.assign({},t,o),n.assign(i,{element:e,handle:o.handle&&a(o.handle)?o.handle:e,handlers:{start:{mousedown:r,touchstart:r},move:{mousemove:s,mouseup:u,touchmove:s,touchend:u}},options:o}),i.initialize()}function i(t){return parseInt(t,10)}function r(t){return"currentStyle"in t?t.currentStyle:getComputedStyle(t)}function s(t){return null!=t}function a(t){return t instanceof Element||"undefined"!=typeof HTMLDocument&&t instanceof HTMLDocument}function u(){}return n.assign(o.prototype,{setOption:function(t,e){var n=this;return n.options[t]=e,n.initialize(),n},get:function(){var t=this.dragEvent;return{x:t.x,y:t.y}},set:function(t,e){var n=this.dragEvent;return n.original={x:n.x,y:n.y},this.move(t,e),this},dragEvent:{started:!1,x:0,y:0},initialize:function(){var t,o=this,i=o.element,s=(o.handle,i.style),a=r(i),u=o.options,f=e.transform,l=o._dimensions={height:i.offsetHeight,left:i.offsetLeft,top:i.offsetTop,width:i.offsetWidth};u.useGPU&&f&&("none"===(t=a[f])&&(t=""),s[f]=t+" translate3d(0,0,0)"),u.setPosition&&(s.display="block",s.left=l.left+"px",s.top=l.top+"px",s.width=l.width+"px",s.height=l.height+"px",s.bottom=s.right="auto",s.margin=0,s.position="absolute"),u.setCursor&&(s.cursor="move"),o.setLimit(u.limit),n.assign(o.dragEvent,{x:l.left,y:l.top}),n.on(o.handle,o.handlers.start)},start:function(t){var e=this,o=e.getCursor(t),i=e.element;e.useTarget(t.target||t.srcElement)&&(t.preventDefault&&!t.target.getAttribute("contenteditable")?t.preventDefault():t.target.getAttribute("contenteditable")||(t.returnValue=!1),e.dragEvent.oldZindex=i.style.zIndex,i.style.zIndex=1e4,e.setCursor(o),e.setPosition(),e.setZoom(),n.on(document,e.handlers.move))},drag:function(t){var e=this,n=e.dragEvent,o=e.element,i=e._cursor,r=e._dimensions,s=e.options,a=r.zoom,u=e.getCursor(t),f=s.threshold,l=(u.x-i.x)/a+r.left,d=(u.y-i.y)/a+r.top;!n.started&&f&&Math.abs(i.x-u.x)<f&&Math.abs(i.y-u.y)<f||(n.original||(n.original={x:l,y:d}),n.started||(s.onDragStart(o,l,d,t),n.started=!0),e.move(l,d)&&s.onDrag(o,n.x,n.y,t))},move:function(t,e){var n=this,o=n.dragEvent,i=n.options,r=i.grid,s=n.element.style,a=n.limit(t,e,o.original.x,o.original.y);return!i.smoothDrag&&r&&(a=n.round(a,r)),(a.x!==o.x||a.y!==o.y)&&(o.x=a.x,o.y=a.y,s.left=a.x+"px",s.top=a.y+"px",!0)},stop:function(t){var e,o=this,i=o.dragEvent,r=o.element,s=o.options,a=s.grid;n.off(document,o.handlers.move),r.style.zIndex=i.oldZindex,s.smoothDrag&&a&&(e=o.round({x:i.x,y:i.y},a),o.move(e.x,e.y),n.assign(o.dragEvent,e)),o.dragEvent.started&&s.onDragEnd(r,i.x,i.y,t),o.reset()},reset:function(){this.dragEvent.started=!1},round:function(t){var e=this.options.grid;return{x:e*Math.round(t.x/e),y:e*Math.round(t.y/e)}},getCursor:function(t){return{x:(t.targetTouches?t.targetTouches[0]:t).clientX,y:(t.targetTouches?t.targetTouches[0]:t).clientY}},setCursor:function(t){this._cursor=t},setLimit:function(t){var e=this,o=function(t,e){return{x:t,y:e}};if(t instanceof Function)e.limit=t;else if(a(t)){var i=e._dimensions,r=t.scrollHeight-i.height,u=t.scrollWidth-i.width;e.limit=function(t,e){return{x:n.limit(t,[0,u]),y:n.limit(e,[0,r])}}}else if(t){var f=s(t.x),l=s(t.y);e.limit=f||l?function(e,o){return{x:f?n.limit(e,t.x):e,y:l?n.limit(o,t.y):o}}:o}else e.limit=o},setPosition:function(){var t=this.element,e=t.style;n.assign(this._dimensions,{left:i(e.left)||t.offsetLeft,top:i(e.top)||t.offsetTop})},setZoom:function(){for(var t=this.element,e=1;t=t.offsetParent;){var n=r(t).zoom;if(n&&"normal"!==n){e=n;break}}this._dimensions.zoom=e},useTarget:function(t){var e=this.options.filterTarget;return!(e instanceof Function)||e(t)},destroy:function(){n.off(this.handle,this.handlers.start),n.off(document,this.handlers.move)}}),o});
},{}],2:[function(require,module,exports){
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
},{"./ship":6}],3:[function(require,module,exports){

let Player = require('./player');
Player = Player.Player;

let Ship = require('./ship');
Ship = Ship.Ship;

let Draggable = require ('Draggable');


const Gamedom = () => {

    // declaring the players
    let player1;
    let player2;
    let difficulty;
    let shipPositions = [
        {id: "1",
        vertical: false,
        options: [],
        size: 2,
        name: "twoShip",
        color: "blue",
        body: [],
        x: null,
        y: null,
        },
        {id: "2",
        vertical: false,
        options: [],
        size: 3,
        name: "threeShipTwo",
        color: "blue",
        body: [],
        x: null,
        y: null,
        },
        {id: "3",
        vertical: false,
        options: [],
        size: 3,
        name: "threeShip",
        color: "blue",
        body: [],
        x: null,
        y: null,
        },
        {id: "4",
        vertical: false,
        options: [],
        size: 4,
        name: "fourShip",
        color: "blue",
        body: [],
        x: null,
        y: null,
        },
        {id: "5",
        vertical: false,
        options: [],
        size: 5,
        name: "fiveShip",
        color: "blue",
        body: [],
        x: null,
        y: null,
        },
    ];
    let allClear = false;

    // runs in the beginning of a game
    const init = () => {
        if (document.getElementById("makeSinglePlayer")) {
            chooseForm();
            singlePlayerForm();
            twoPlayerForm();
            goBackButtons();
            startSingleGame();
        };
    };

    // this will start the game of the single player mode
    const startSingleGame = () => {
        const beginning = document.getElementById("startSingleGame");
        beginning.addEventListener("click", () => {
            testPackage();
        });
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

    // this will give the buttons the ability to go back
    const goBackButtons = () => {
       const single = document.getElementById("goBackSingle");
       const double = document.getElementById("goBackDouble");
       single.addEventListener("click", () => {
           goBack("firstPlayerForm");
       });
       double.addEventListener("click", () => {
        goBack("twoPlayerForm");
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

    // this will go back to the computer or player form
    const goBack = (formName) => {
        hideForm(formName);
        showForm("computerOrPlayerForm");
    };

    // this will show the placement form
    const showPlacementForm = () => {
        showForm("placementForm");
        generatePlacementBoard();
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
        showPlacementForm();
    };

    // launches single player mode
    const singlePlayer = () => {
        let name = document.getElementById("firstPlayer").value;
        onePlayer(name);
    };

    // this will be how the first player attacks
    const singlePlayerAttack = (coordinates) => {
        clearMessage("error");
        if (winLoop(player1, player2)) {
            return;
        };
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

    // this will hold the test package
    const testPackage = () => {
        hideForm("placementForm");
        placePlayerShips(player1, shipPositions);
        player2.gameboard.randomPlacement();
        generateBoard();
        generateSecondBoard();
        markOccupied(player1);
    };

    // this will place all the player ships
    const placePlayerShips = (player, ownShips) => {
        for (let i = 0; i < ownShips.length; i++){
            let ship  = determineShipSize(ownShips[i].id);
            player.gameboard.place(ship, ownShips[i].x, ownShips[i].y, ownShips[i].vertical);
        };
    };

    // this will determine the ship size
    const determineShipSize = (size) => {
        switch(size) {
            case "1":
                return Ship(2);
                break;
            case "2":
                return Ship(3);
                break;
            case "3":
                return Ship(3);
                break;
            case "4":
                return Ship(4);
                break;
            case "5":
                return Ship(5);
                break;
        };
    };

    // mark the occupied squares with the color blue
    const markOccupied = (player) => {
        let positions = player.gameboard.occupied;
        for (let i = 0; i < positions.length; i++){
            for (let ii = 0; ii < positions[i].length - 1; ii++){
                markComputerSquare(positions[i][ii], "blue");
            };
        };
    };

    // this will be the code to drag the ship container
    const dragShip = () => {
        let ships = ["twoShip", "threeShip", "threeShipTwo", "fourShip", "fiveShip"];
        for (let i = 0; i < ships.length; i++){
            let ship = document.getElementById(ships[i]);
            let options = {
                grid: 50,
                limit: document.getElementById("placementBoard"),
                onDragEnd: dragEnd,
            };
            let drag = new Draggable (ship, options);
            ship.addEventListener("dblclick", () => {
                goVertical(ships[i], drag);
            });
        };
    };

    // this will mark the surrounding area of the ship
    const tempSurrounding = (name) => {
        let ship = document.getElementById(name);
        let options = [];
        let body = [];
        let sample = ship.getAttribute("value");
        let num;
        for (let i = 0; i < shipPositions.length; i++){
            if (shipPositions[i].id === sample) {
                num = i;
            };
        };
        let specs;
        if (shipPositions[num].vertical) {
            specs = [true, shipPositions[num].size];
        } else {
            specs = [false, shipPositions[num].size];
        };
        let x = shipPositions[num].x
        let y = shipPositions[num].y
        if (specs[0]) {
            for (let i = 0; i < specs[1]; i++){
                let tempy = y + i;
                body.push(`${x}${tempy}`);
                for (let ii = -1; ii < 2; ii++){
                    for (let iii = -1; iii < 2; iii++){
                        options.push(`${x + iii}${tempy + ii}`);
                    };
                };
            };
        } else {
            for (let i = 0; i < specs[1]; i++){
                let tempx = x + i;
                body.push(`${tempx}${y}`);
                for (let ii = -1; ii < 2; ii++){
                    for (let iii = -1; iii < 2; iii++){
                        options.push(`${tempx + iii}${y + ii}`);
                    };
                };
            };
        };
        shipPositions[num].options = options;
        shipPositions[num].body = body;
    };


    // this will change a ship to vertical
    const goVertical = (shipName, drag) => {
        let ship = document.getElementById(shipName);
        let sample = ship.getAttribute("value");
        let width = ship.style.width;
        let height = ship.style.height;
        ship.style.width = height;
        ship.style.height = width;
        let num;
        for (let i = 0; i < shipPositions.length; i++){
            if (shipPositions[i].id === sample) {
                num = i;
            };
        };
        shipPositions[num].vertical = !shipPositions[num].vertical
        drag["_dimensions"]["height"] = width;
        drag["_dimensions"]["width"] = height;
        drag.setOption('limit', document.getElementById("placementBoard"));
        let x = drag["_dimensions"]["left"];
        let y = drag["_dimensions"]["top"];
        if (shipPositions[num].vertical && drag["_dimensions"]["top"] > 500 - drag["_dimensions"]["height"]){
            drag.set(drag["_dimensions"]["left"], 500 - drag["_dimensions"]["height"]);
            y = 500 - drag["_dimensions"]["height"];
        } else if (!(shipPositions[num].vertical) && drag["_dimensions"]["left"] > 500 - drag["_dimensions"]["width"]){
            drag.set(500 - drag["_dimensions"]["width"], drag["_dimensions"]["top"]);
            x = 500 - drag["_dimensions"]["width"]
        };
        updateShipPosition(ship.getAttribute("value"), x, y);
        tempSurrounding(ship.getAttribute("id"));
        changeColor();
        updateColor();
        toggleDisable();
    };

    // this will update the colors of the moving ships
    const updateColor = () => {
        for (let i = 0; i < shipPositions.length; i++){
            ship = document.getElementById(shipPositions[i].name);
            ship.className = '';
            ship.classList.add(shipPositions[i].color);
        };
    };

    const toggleDisable = () => {
        let shouldDisable = false
        for (let i = 0; i < shipPositions.length; i++){
            if (shipPositions[i].color === "red" || shipPositions[i].x === null){
                shouldDisable = true;
            };
        };
        document.getElementById("startSingleGame").disabled = shouldDisable;
    };


    // code for the drag end
    const dragEnd = (element, x, y) => {
        updateShipPosition(element.getAttribute("value"), x, y);
        tempSurrounding(element.getAttribute("id"));
        changeColor();
        updateColor();
        toggleDisable();
    };

    // this will change the color of the ships
    const changeColor = () => {
        for (let i = 0; i < shipPositions.length; i++){
            let color = "blue";
            for (let ii = 0; ii < shipPositions[i].options.length; ii++){
                for (let iii = 0; iii < shipPositions.length; iii++){
                    if (i !== iii){
                        if (shipPositions[iii].body.includes(shipPositions[i].options[ii])) {
                            color = "red";
                        };
                    };
                };
            };
            shipPositions[i].color = color;
        };
    };

    // will update the ship positions
    const updateShipPosition = (value, x, y) => {
        let num;
        for (let i = 0; i < shipPositions.length; i++){
            if (shipPositions[i].id === value) {
                num = i;
            };
        };
        shipPositions[num].x = x/50;
        shipPositions[num].y = y/50;
    };


    // this will generate the placement board
    const generatePlacementBoard = () => {
        const board = document.getElementById("placementBoard");
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                let square = document.createElement("div");
                square.id = `p, ${ii}, ${i}`
                square.classList.add("square");
                board.appendChild(square);
            };
        };
        dragShip();
    };

    init ();
    return {twoPlayer, players, onePlayer, singlePlayer};
};

module.exports.Gamedom = Gamedom;
},{"./player":5,"./ship":6,"Draggable":1}],4:[function(require,module,exports){
let Gameboard = require("./gameboard");
let Player = require("./player");
let Gamedom = require("./gamedom");
let Ship = require("./ship");

Gameboard = Gameboard.Gameboard;
Player = Player.Player;
Gamedom = Gamedom.Gamedom;
Ship = Ship.Ship;

const game = Gamedom();


},{"./gameboard":2,"./gamedom":3,"./player":5,"./ship":6}],5:[function(require,module,exports){

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
                return shipCheck(result, true, false, small);
            } else {
                result = [coordinates[0], firstContact[1] + 1];
                return shipCheck(result, true, true, small);
            };
        } else {
            if (coordinates[0] > firstContact[0]){
                result = [firstContact[0] - 1, coordinates[1]];
                return shipCheck(result, false, false, small);
            } else {
                result = [firstContact[0] + 1, coordinates[1]];
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
},{"./gameboard":2}],6:[function(require,module,exports){
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
},{}]},{},[4]);
