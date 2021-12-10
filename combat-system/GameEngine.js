const { DefaultClass } = require("./classes/DefaultClass")
const { UserArmy } = require("./classes/NPC/UserArmy")
const { Ranger } = require("./classes/Ranger")
const { Shaman } = require("./classes/Shaman")
const { Warrior } = require("./classes/Warrior")
const { Mage } = require("./classes/Mage")

class GameEngine {
    constructor(MessageAPI = {
        pickAbilityMessage: (player, abilities) => {},
        deathMessage: (players) => {},
        effectMessage: (message) => {},
        abilityMessage: (abilityResponse) => {},
        newRoundMessage: (round) => {},
        endGameMessage: (winningTeam,losingTeam) => {}
    }, teamOne, teamTwo, options = {}) {
        MessageAPI.game = this

        const { maxRounds = 5 } = options
        this.maxRounds = maxRounds

        this.classList = {
            DefaultClass,
            UserArmy,
            Ranger,
            Shaman,
            Warrior,
            Mage,
        }

        this.teamOne = null 
        this.teamTwo = null 
        this.originalTeamOne = teamOne // []
        this.originalTeamTwo = teamTwo // []
        this.MessageAPI = MessageAPI
        
        this.round = 1
        this.currentTurn = 0
        this.combatTimeline = []
        this.gameEnded = false
        this.deadUnits = []
        
        this.combatEndedReason = ""
        this.winningTeam = null
        this.losingTeam = null
    }

    startGame = async () => {
        this._initiateGame()

        while(!this.gameEnded && this.round <= this.maxRounds){
            const currentUnit = this.combatTimeline[this.currentTurn]
            const randomAbilities = currentUnit.getRandomAbilities()
            let usedAbilityRes = ""
            if(currentUnit.isNpc){
                usedAbilityRes = randomAbilities[Math.floor(Math.random() * randomAbilities.length)].cast()
            } else {
                const chosenAbility = await this.MessageAPI.pickAbilityMessage(currentUnit, randomAbilities)
                if(chosenAbility?.cast){
                    usedAbilityRes = chosenAbility.cast()
                }
            }
            await this.MessageAPI.abilityMessage(usedAbilityRes)

            if(this.deadUnits.length){
                await this.MessageAPI.deathMessage(this.deadUnits)
                this.deadUnits = []
            }

            if(this.gameEnded){
                return this._endGame()
            }
            this.currentTurn += 1
            await this._newCombatRound()
        }

        return this._endGame(true)
    }

    unitDied = (unit) => {
        const currentUnitTurn = this.combatTimeline[this.currentTurn]
        this.combatTimeline = this.combatTimeline.filter(u => u !== unit)
        this.currentTurn = this.combatTimeline.indexOf(currentUnitTurn)
        this.deadUnits.push(unit)
        if(!this.combatTimeline.find(u => u.team === unit.team)){
            this.gameEnded = true
        }
    }

    _newCombatRound = async () => {
        if(!this.combatTimeline[this.currentTurn]){
            this.round += 1
            if(this.round >= this.maxRounds) return this._endGame()
            await this.MessageAPI.newRoundMessage(this.round)
            this.currentTurn = 0

            await this._applyCombatEffects()
        }
    }

    _applyCombatEffects = async () => {
        this.combatTimeline.forEach(unit => {
            if(unit.combatEffects.length){
                unit.combatEffects = unit.combatEffects.map(effect => {
                    const { DURATION, FROM_ROUND } = effect.constants
                    const stringRes = effect.cast(effect.effectTarget)
                    this.MessageAPI.effectMessage(stringRes)
                    if(this.round >= (FROM_ROUND + DURATION)){
                        return null
                    } else {
                        return effect
                    }
                }).filter(e => e)
            }
        })
    }

    _initiateGame = () => {
        const mapUsers = (user, team) => {
            const classToInitiate = this.classList[Object.keys(this.classList).find(classKey => classKey === user.hero?.className)] || this.classList.DefaultClass
            const classInstance = new classToInitiate(this, user, team)
            this._initiateClass(classInstance)
            return classInstance
        }

        this.teamOne = this.originalTeamOne.map(user => {
            return mapUsers(user, 1)
        })

        this.teamTwo = this.originalTeamTwo.map(user => {
            return mapUsers(user, 2)
        })

        this._sortCombatTimeline()
    }

    _initiateClass = (classUnit) => {
        if(classUnit.applyClassModifiers){
            classUnit.initiate()
        }
    }

    _sortCombatTimeline = () => {
        if(!this.combatTimeline.length){
            this._addTeamsToCombatTimeline()
        }

        this.combatTimeline.sort((a, b) => {
            return this._calculateInitiative(a) - this._calculateInitiative(b)
        })
    }

    _addTeamsToCombatTimeline = () => {
        this.combatTimeline = [...this.teamOne, ...this.teamTwo]
    }

    _calculateInitiative = (unit) => {
        return (unit.initiative * ((unit.rank || 1) / 2)) * unit.initiativeModifier
    }

    _endGame = () => {
        if(this.gameIsEnding) return
        this.gameIsEnding = true
        this.gameEnded = true
        this.#decideTeamOutcome()
        this.MessageAPI.endGameMessage(this.winningTeam,this.losingTeam)
    }

    #decideTeamOutcome = () => {
        const teamOne = this.combatTimeline.filter(u => u.team === 1)
        if(teamOne.length === this.combatTimeline.length) {
            this.winningTeam = this.originalTeamOne
            this.losingTeam = this.originalTeamTwo
            return this.originalTeamOne
        }
        else if(!teamOne.length) {
            this.winningTeam = this.originalTeamTwo
            this.losingTeam = this.originalTeamOne
            return this.originalTeamTwo
        }
        else return null
    }
}

module.exports = { GameEngine }