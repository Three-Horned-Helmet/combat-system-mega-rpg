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
        className: "Mage"
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

const playerTree = {
    _id: "p-3",
    account: {
        username: "Player Tree"
    },
    hero: {
        rank: 3,
        health: 180,
        currentHealth: 180,
        attack: 25,
        defense: 35,
        className: "Shaman"
    }
}

const playerFour = {
    _id: "p-4",
    account: {
        username: "Player Four"
    },
    hero: {
        rank: 3,
        health: 180,
        currentHealth: 180,
        attack: 30,
        defense: 30,
        className: "Mage"
    }
}

const playerFive = {
    _id: "p-4",
    account: {
        username: "Player Five"
    },
    hero: {
        rank: 3,
        health: 180,
        currentHealth: 180,
        attack: 30,
        defense: 30
    }
}

const userArmy = {
    _id: "p-1",
    account: {
        username: "User Army"
    },
    hero: {
        rank: 3,
        health: 900,
        currentHealth: 900,
        attack: 100,
        defense: 100,
        className: "UserArmy"
    }
}

module.exports = { playerOne, playerTwo, playerTree, playerFour, playerFive, userArmy }