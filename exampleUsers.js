const playerOne = {
    _id: "p-1",
    account: {
        username: "Player One"
    },
    hero: {
        rank: 3,
        health: 200,
        currentHealth: 200,
        attack: 30,
        defense: 30,
        className: "Warrior"
    }
}

const playerTwo = {
    _id: "p-2",
    account: {
        username: "Player Two"
    },
    hero: {
        rank: 2,
        health: 150,
        currentHealth: 150,
        attack: 25,
        defense: 35,
        className: "Ranger"
    }
}

module.exports = {playerOne, playerTwo}