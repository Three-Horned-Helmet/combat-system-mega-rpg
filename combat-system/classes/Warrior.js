const {ClassBase} = require("../ClassBase")
const warriorConstants = require("../config/warrior-constants.json")

class Warrior extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        Object.keys(warriorConstants).forEach(key => this[key] = warriorConstants[key])
    }

    abilities = (ability = null) => {
        const allAbilities = {
            slam: {
                cast: this.slam,
                constants: warriorConstants.abilityConstants.slam
            },
            heartStrike: {
                cast: this.heartStrike,
                constants: warriorConstants.abilityConstants.heartStrike
            },
            shieldWall: {
                cast: this.shieldWall,
                constants: warriorConstants.abilityConstants.shieldWall
            },
            whirlwind: {
                cast: this.whirlwind,
                constants: warriorConstants.abilityConstants.whirlwind
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    slam = () => {
        const slam = this.abilities("slam")
        const abilityResponse = this.useBasicDamageAbility(slam)
        return this.generateCombatString(slam, abilityResponse)
    }


    heartStrike = (target = this.getRandomEnemy()) => {       
        const heartStrike = this.abilities("heartStrike")
        const abilityResponse = this.useBasicDamageAbility(heartStrike, target)
        return this.generateCombatString(heartStrike, abilityResponse)
    }

    shieldWall = () => {
        const shieldWall = this.abilities("shieldWall")
        const abilityResponse = this.useBasicDamageModifierAbility(shieldWall, this)
        return this.generateCombatString(shieldWall, abilityResponse)
    }

    whirlwind = () => {
        const whirlwind = this.abilities("whirlwind")
        const abilityResponse = this.useBasicAreaDamageAbility(whirlwind)
        return this.generateCombatString(whirlwind, abilityResponse)
    }
}

module.exports = { Warrior }