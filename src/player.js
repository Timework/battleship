
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