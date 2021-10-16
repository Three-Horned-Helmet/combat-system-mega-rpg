const { askQuestion } = require("./helper")
const { GameEngine } = require("../combat-system/GameEngine")
const { MessageEngine } = require("./MessageEngine")
const {playerOne, playerTwo, playerTree, playerFour} = require("./exampleUsers")

const startGame = async () => {
    const gameEngine = new GameEngine(new MessageEngine(askQuestion), [playerOne], [playerFour])
    gameEngine.startGame()
}

startGame()