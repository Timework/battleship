
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