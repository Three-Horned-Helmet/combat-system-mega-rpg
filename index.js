const { askQuestion } = require("./helper")
const { Game } = require("./combat-system/Game")
const { MessageEngine } = require("./combat-system/MessageEngine")
const {playerOne, playerTwo} = require("./exampleUsers")

const startGame = async () => {
    const game = new Game(new MessageEngine(askQuestion), [playerOne], [playerTwo])
    game.startGame()
}

startGame()