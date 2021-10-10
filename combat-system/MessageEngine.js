class MessageEngine  {
    constructor(messageAPI) {
        this.messageAPI = messageAPI
    }

    generateAbilityOptionsMessage = async (player, abilities) => {
        const playerName = player.name
        const allLetters = "abcefghijklmnopqrstuvwxyz".split("")
        const abilitiesString = `${playerName}: Can pick from abilities ${abilities.map((a, i) => allLetters[i] + ") " + a.name).join(", ")}`
        let ability = undefined
        let pickAbilityTimeout = false
        setTimeout(() => {
            pickAbilityTimeout = true
        }, 10000)

        while(!ability && !pickAbilityTimeout){
            // TODO GIVE A TIME FOR THEIR RESPONSE
            const playerResponse = await this.messageAPI(abilitiesString)
            const indexOfPlayerResponse = allLetters.indexOf(playerResponse[0])
            ability = abilities[indexOfPlayerResponse]
        }

        if(pickAbilityTimeout) {
            return console.log(playerName + " did not respond in time and lost its turn")
        }
        else {
            return ability
        }
    }

    generateDeathMessage = (player) => {
        return console.log(player.name + " has died")
    }

    generateEffectMessage = (msg) => {
        return console.log(msg)
    }
}

module.exports = {MessageEngine}