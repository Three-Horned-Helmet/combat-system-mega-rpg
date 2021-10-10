const { Ranger } = require("./Ranger")
const { Shaman } = require("./Shaman")
const { Warrior } = require("./Warrior")

class Game {
    constructor(MessageAPI, teamOne, teamTwo, options = {}) {
        const { maxRounds = 5 } = options
        this.maxRounds = maxRounds

        this.teamOne = teamOne // []
        this.teamTwo = teamTwo // []
        this.MessageAPI = MessageAPI

        this.round = 1
        this.currentTurn = 0
        this.combatTimeline = []
        this.gameEnded = false
        this.deadUnits = []

        this.classList = {
            Ranger,
            Shaman,
            Warrior
        }
    }

    startGame = async () => {
        this._initiateGame()

        while(!this.gameEnded && this.round <= this.maxRounds){
            const currentUnit = this.combatTimeline[this.currentTurn]
            const randomAbilities = currentUnit.getRandomAbilities()
            let castedAbilityRes = ""
            if(currentUnit.npc){
                castedAbilityRes = randomAbilities[Math.floor(Math.random() * randomAbilities.length)].cast()
            } else {
                const chosenAbility = await this.MessageAPI.generateAbilityOptionsMessage(currentUnit, randomAbilities)
                if(chosenAbility.cast){
                    castedAbilityRes = chosenAbility.cast()
                }
            }
            console.log(castedAbilityRes)

            if(this.deadUnits.length){
                this.deadUnits.forEach(unit => {
                    this.MessageAPI.generateDeathMessage(unit)
                })
                this.deadUnits = []
            }

            if(this.gameEnded){
                return this._endGame()
            }

            this.currentTurn += 1
            this._newCombatRound()
        }
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

    _newCombatRound = () => {
        if(!this.combatTimeline[this.currentTurn]){
            this.round += 1
            console.log("New round: " + this.round)
            this.currentTurn = 0

            this._applyCombatEffects()
        }
    }

    _applyCombatEffects = () => {
        this.combatTimeline.forEach(unit => {
            if(unit.combatEffects.length){
                unit.combatEffects = unit.combatEffects.map(effect => {
                    const stringRes = effect.combatEffect(effect.effectTarget)
                    this.MessageAPI.generateEffectMessage(stringRes)
                    if(this.round >= (effect.fromRound + effect.duration)){
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
            const classToInitiate = this.classList[Object.keys(this.classList).find(classKey => classKey === user.hero?.className)]
            const classInstance = new classToInitiate(this, user, team)
            this._initiateClass(classInstance)

            return classInstance
        }

        this.teamOne = this.teamOne.map(user => {
            return mapUsers(user, 1)
        })

        this.teamTwo = this.teamTwo.map(user => {
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
        this.gameEnded = true
        console.log("END GAME")
        process.exit()
    }
}

module.exports = { Game }