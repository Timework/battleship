
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
        small: "twoShipSmall",
        color: "blue",
        body: [],
        x: null,
        y: null,
        drags: null,
        drag: null,
        button: "twoShipSmallButton",
        },
        {id: "2",
        vertical: false,
        options: [],
        size: 3,
        name: "threeShipTwo",
        small: "threeShipTwoSmall",
        color: "blue",
        body: [],
        x: null,
        y: null,
        drags: null,
        drag: null,
        button: "threeShipTwoSmallButton",
        },
        {id: "3",
        vertical: false,
        options: [],
        size: 3,
        name: "threeShip",
        small: "threeShipSmall",
        color: "blue",
        body: [],
        x: null,
        y: null,
        drags: null,
        drag: null,
        button: "threeShipSmallButton",
        },
        {id: "4",
        vertical: false,
        options: [],
        size: 4,
        name: "fourShip",
        small: "fourShipSmall",
        color: "blue",
        body: [],
        x: null,
        y: null,
        drags: null,
        drag: null,
        button: "fourShipSmallButton",
        },
        {id: "5",
        vertical: false,
        options: [],
        size: 5,
        name: "fiveShip",
        small: "fiveShipSmall",
        color: "blue",
        body: [],
        x: null,
        y: null,
        drags: null,
        drag: null,
        button: "fiveShipSmallButton",
        },
    ];

    // runs in the beginning of a game
    const init = () => {
        if (document.getElementById("makeSinglePlayer")) {
            chooseForm();
            singlePlayerForm();
            twoPlayerForm();
            startSingleGame();
            initateHeader();
        };
    };

    // this will trigger the moving text of the header
    const initateHeader = () => {
        const header = document.getElementById("headerText");
        header.style.maxWidth = "100%";
    };

    // this will start the game of the single player mode
    const startSingleGame = () => {
        const beginning = document.getElementById("startSingleGame");
        const smallBeginning = document.getElementById("startSingleGameSmall");
        beginning.addEventListener("click", () => {
            testPackage();
        });
        smallBeginning.addEventListener("click", () => {
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
        generatePlacementBoard("placementBoard");
        generatePlacementBoard("placementBoardSmall");
        dragShip();
        dragShipSmall();
        document.getElementById("testDiv").classList.add("bigPosition");
        document.getElementById("testDivTwo").classList.add("smallPosition");
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
        first.addEventListener('click', (e) => {
            e.preventDefault(); 
            singlePlayerGame();
            return false;
        });
    };

    // program two player start up
    const twoPlayerForm = () => {
        const second = document.getElementById("makeTwoPlayers");
        second.addEventListener('click', () => { multiplayerGame() });
    };

    // single player game start 
    const singlePlayerGame = () => {
        showForm("instructions");
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
        difficulty = setDifficulty();
        showPlacementForm();
    };

    // launches single player mode
    const singlePlayer = () => {
        let name = document.getElementById("firstPlayer").value;
        if (name === ""){
            name = "Player";
        };
        onePlayer(name);
    };

    // this will be how the first player attacks
    const singlePlayerAttack = async (coordinates) => {
        let stopper = document.getElementById("absolute");
        stopper.style.display = "block";
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
            stopper.style.display = "none";
        } else if (result[0] && result[1]) {
            markSquare(coordinates, "red");
            stopper.style.display = "none";
        } else if (result[0]) {
            markSquare(coordinates, "green");
            computerMove(difficulty);
            if (winLoop(player2, player1)) {
                return;
            };
        } else {
            errorMessage("That space has already been attacked");
            stopper.style.display = "none";
        };
    };

    // this will set a time delay
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // this will be the computer move in single player mode
    const computerMove = async (level) => {
        let stopper = document.getElementById("absolute");
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
            stopper.style.display = "none";
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
        showForm("resultHolder");
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
        showForm("flexHolder")
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
        let ships = ["twoShip", "threeShipTwo", "threeShip", "fourShip", "fiveShip"];
        for (let i = 0; i < ships.length; i++){
            let ship = document.getElementById(ships[i]);
            let options = {
                grid: 50,
                limit: document.getElementById("placementBoard"),
                onDragEnd: dragEnd,
            };
            let drag = new Draggable (ship, options);
            shipPositions[i].drag = drag;
            ship.addEventListener("dblclick", () => {
                goVertical(ships[i], drag);
            });
            ship.addEventListener("click", () => {
                notMove(i);
            });
        };
    };

    // this will keep a ship still when clicked
    const notMove = (spot) => {
        shipPositions[spot].drag.set((shipPositions[spot].x * 50), (shipPositions[spot].y * 50));
    };

    // this will keep a ship still when clicked in small mode
    const notMoveSmall = (spot) => {
        shipPositions[spot].drags.set((shipPositions[spot].x * 25), (shipPositions[spot].y * 25))
    };

    // this will be the code to drag the ship container in the small size
    const dragShipSmall = () => {
        let ships = ["twoShipSmall", "threeShipTwoSmall", "threeShipSmall", "fourShipSmall", "fiveShipSmall"];
        for (let i = 0; i < ships.length; i++){
            let ship = document.getElementById(ships[i]);
            let button = document.getElementById(shipPositions[i].button);
            let options = {
                grid: 25,
                limit: document.getElementById("placementBoardSmall"),
                onDragEnd: dragEndSmall,
            };
            let drag = new Draggable (ship, options);
            shipPositions[i].drags = drag;
            button.addEventListener("click", () => {
                goVerticalSmall(ships[i], drag);
            });
            button.addEventListener("touchstart", () => {
                goVerticalSmall(ships[i], drag);
            });            
            ship.addEventListener("touchstart", () => {
                notMoveSmall(i);
            });
            ship.addEventListener("click", () => {
                notMoveSmall(i);
            });
        };
    };

    // this will change a ship to vertical for small size
    const goVerticalSmall = (shipName, drag) => {
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
        drag["_dimensions"]["height"] = parseInt(width);
        drag["_dimensions"]["width"] = parseInt(height);
        let bigShip = document.getElementById(shipPositions[num].name);
        let bwidth = bigShip.style.width;
        let bheight = bigShip.style.height;
        bigShip.style.width = bheight;
        bigShip.style.height = bwidth;
        let x = shipPositions[num].x * 25;
        let y = shipPositions[num].y * 25;
        drag.setOption('limit', document.getElementById("placementBoardSmall"));
        shipPositions[num].drag["_dimensions"]["height"] = parseInt(bwidth);
        shipPositions[num].drag["_dimensions"]["width"] = parseInt(bheight);
        if (shipPositions[num].vertical && y > 250 - drag["_dimensions"]["height"]){
            drag.set(x, 250 - drag["_dimensions"]["height"]);
            y = 250 - drag["_dimensions"]["height"];
        } else if (!(shipPositions[num].vertical) && x > 250 - drag["_dimensions"]["width"]){
            drag.set(250 - drag["_dimensions"]["width"], y);
            x = 250 - drag["_dimensions"]["width"]
        };
        updateShipPositionSmall(ship.getAttribute("value"), x, y);
        tempSurrounding(ship.getAttribute("id"));
        changeColor();
        updateColor();
        toggleDisable();
        document.getElementById("testDiv").className = '';
        shipPositions[num].drag.setOption('limit', document.getElementById("placementBoard"));
        document.getElementById("testDiv").classList.add("bigPosition");
    };

    // code for the drag end for small size
    const dragEndSmall = (element, x, y) => {
        updateShipPositionSmall(element.getAttribute("value"), x, y);
        tempSurrounding(element.getAttribute("id"));
        changeColor();
        updateColor();
        toggleDisable();
    };

    // will update the ship positions for small size
    const updateShipPositionSmall = (value, x, y) => {
        let num;
        for (let i = 0; i < shipPositions.length; i++){
            if (shipPositions[i].id === value) {
                num = i;
            };
        };
        shipPositions[num].x = x/25;
        shipPositions[num].y = y/25;
        shipPositions[num].drag.set(x * 2, y * 2);
        document.getElementById("testDiv").className = '';
        shipPositions[num].drag.setOption('limit', document.getElementById("placementBoard"));
        document.getElementById("testDiv").classList.add("bigPosition");
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
        let smallShip = document.getElementById(shipPositions[num].small);
        let swidth = smallShip.style.width;
        let sheight = smallShip.style.height;
        smallShip.style.width = sheight;
        smallShip.style.height = swidth;
        shipPositions[num].vertical = !shipPositions[num].vertical
        drag["_dimensions"]["height"] = parseInt(width);
        drag["_dimensions"]["width"] = parseInt(height);
        drag.setOption('limit', document.getElementById("placementBoard"));
        shipPositions[num].drags["_dimensions"]["height"] = parseInt(swidth);
        shipPositions[num].drags["_dimensions"]["width"] = parseInt(sheight);
        console.log(shipPositions[num].drags["_dimensions"]["height"]);
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
        document.getElementById("testDivTwo").className = '';
        shipPositions[num].drags.setOption('limit', document.getElementById("placementBoardSmall"));
        document.getElementById("testDivTwo").classList.add("smallPosition");
    };

    // this will update the colors of the moving ships
    const updateColor = () => {
        for (let i = 0; i < shipPositions.length; i++){
            let ship = document.getElementById(shipPositions[i].name);
            let smallShip = document.getElementById(shipPositions[i].small);
            smallShip.className = '';
            ship.className = '';
            ship.classList.add(shipPositions[i].color);
            smallShip.classList.add(shipPositions[i].color);
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
        document.getElementById("startSingleGameSmall").disabled = shouldDisable;
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
        shipPositions[num].drags.set((x / 2), (y / 2));
        document.getElementById("testDivTwo").className = '';
        shipPositions[num].drags.setOption('limit', document.getElementById("placementBoardSmall"));
        document.getElementById("testDivTwo").classList.add("smallPosition");
    };


    // this will generate the placement board
    const generatePlacementBoard = (name) => {
        const board = document.getElementById(name);
        for (let i = 0; i <= 9; i++){
            for (let ii = 0; ii <= 9; ii++){
                let square = document.createElement("div");
                square.classList.add("square");
                board.appendChild(square);
            };
        };
    };

    init ();
    return {twoPlayer, players, onePlayer, singlePlayer};
};

module.exports.Gamedom = Gamedom;