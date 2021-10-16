const { ClassBase } = require("../ClassBase")
const mageConstants = require("../config/mage-constants.json")


class Mage extends ClassBase {
    constructor(game, owner, team = 1) {
        super(game, owner, team)

        this.className = "Mage"
        this.description = "A powerful mage capable of dealing massive damage to enemies"
        
        this.classInitiativeModifier = mageConstants.stats.initiativeModifier
        this.classAttackModifier = mageConstants.stats.attackModifier
        this.classDefenseModifier = mageConstants.stats.defenseModifier
    }

    abilities = (ability = null) => {
        const allAbilities = {
            fireball: {
                cast: this.fireball,
                constants: mageConstants.abilities.fireball,
            },
            fireballDot: {
                cast: this.fireballDot,
                constants: mageConstants.abilities.fireballDot,
                notAnAbility: true
            },
            arcaneblast: {
                cast: this.arcaneblast,
                constants: mageConstants.abilities.arcaneblast,
            },
            arcaneConcentration: {
                cast: this.arcaneConcentration,
                constants: mageConstants.abilities.arcaneConcentration,
            },
            rainOfFire: {
                cast: this.rainOfFire,
                constants: mageConstants.abilities.rainOfFire,
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    fireball = (target = this.getRandomEnemy()) => {
        const fireball = this.abilities("fireball")
        const abilityResponse = this.useBasicDamageAbility(fireball, target)
        return this.generateCombatString(fireball, abilityResponse)
    }

    fireballDot = (target) => {
        if(!target) return
        const fireballDot = this.abilities("fireballDot")
        const abilityResponse = this.useBasicDamageAbility(fireballDot, target)
        return this.generateCombatString(fireballDot, abilityResponse)
    }

    arcaneblast = () => {
        const arcaneblast = this.abilities("arcaneblast")
        const abilityResponse = this.useBasicDamageAbility(arcaneblast)
        return this.generateCombatString(arcaneblast, abilityResponse)
    }

    arcaneConcentration = () => {
        const arcaneConcentration = this.abilities("arcaneConcentration")
        const abilityResponse = this.useBasicDamageModifierAbility(arcaneConcentration, this)
        return this.generateCombatString(arcaneConcentration, abilityResponse)
    }

    rainOfFire = () => {
        const rainOfFire = this.abilities("rainOfFire")
        const abilityResponse = this.useBasicAreaDamageAbility(rainOfFire)
        return this.generateCombatString(rainOfFire, abilityResponse)
    }
}

module.exports = { Mage }