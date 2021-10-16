const {ClassBase} = require("../ClassBase")
const rangerConstants = require("../config/ranger-constants.json")

class Ranger extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        this.className = "Ranger"
        this.description = "An adaptable fighter specializing in ranged attacks"

        this.classInitiativeModifier = rangerConstants.stats.initiativeModifier
        this.classAttackModifier = rangerConstants.stats.attackModifier
        this.classDefenseModifier = rangerConstants.stats.defenseModifier
    }

    abilities = (ability = null) => {
        const allAbilities = {
            piercingArrow: {
                cast: this.piercingArrow,
                constants: rangerConstants.abilities.piercingArrow,
            },
            exposeArmor: {
                cast: this.exposeArmor,
                constants: rangerConstants.abilities.exposeArmor,
            },
            poisonedArrow: {
                cast: this.poisonedArrow,
                constants: rangerConstants.abilities.poisonedArrow,
            },
            poisonedArrowDot: {
                cast: this.poisonedArrowDot,
                constants: rangerConstants.abilities.poisonedArrowDot,
                notAnAbility: true
            },
            killingArrow: {
                cast: this.killingArrow,
                constants: rangerConstants.abilities.killingArrow,
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    piercingArrow = (target = this.getRandomEnemy()) => {
        const piercingArrow = this.abilities("piercingArrow")
        const abilityResponse = this.useBasicDamageAbility(piercingArrow, target)
        return this.generateCombatString(piercingArrow, abilityResponse)
    }

    exposeArmor = (target = this.getRandomEnemy()) => {
        const exposeArmor = this.abilities("exposeArmor")
        const abilityResponse = this.useBasicDamageModifierAbility(exposeArmor, target)
        return this.generateCombatString(exposeArmor, abilityResponse)
    }

    poisonedArrow = (target = this.getRandomEnemy()) => {
        const poisonedArrow = this.abilities("poisonedArrow")
        const abilityResponse = this.useBasicDamageAbility(poisonedArrow, target)
        return this.generateCombatString(poisonedArrow, abilityResponse)
    }

    poisonedArrowDot = (target) => {
        if(!target) return
        const poisonedArrowDot = this.abilities("poisonedArrowDot")
        const abilityResponse = this.useBasicDamageAbility(poisonedArrowDot, target)
        return this.generateCombatString(poisonedArrowDot, abilityResponse)
    }
    
    killingArrow = (target = this.getRandomEnemy()) => {
        const killingArrow = this.abilities("killingArrow")
        const { CRIT_HEALTH_THRESHOLD } = killingArrow.constants
        const adjustedCritChance = (target.currentHealth/target.health) > CRIT_HEALTH_THRESHOLD ? 0 : 1
        const abilityResponse = this.useBasicDamageAbility(killingArrow, target, { CRIT_CHANCE: adjustedCritChance})
        return this.generateCombatString(killingArrow, abilityResponse)
    }
}

module.exports = { Ranger }