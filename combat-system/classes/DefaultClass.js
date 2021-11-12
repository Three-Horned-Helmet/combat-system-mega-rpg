const {ClassBase} = require("../ClassBase")
const defaultClassConstants = require("../config/default-class-constants.json")

class DefaultClass extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        this.className = "DefaultClass"
        this.description = "Default Class"

        this.classInitiativeModifier = defaultClassConstants.stats.initiativeModifier
        this.classAttackModifier = defaultClassConstants.stats.attackModifier
        this.classDefenseModifier = defaultClassConstants.stats.defenseModifier
    }

    abilities = (ability = null) => {
        const allAbilities = {
            hit: {
                cast: this.hit,
                constants: defaultClassConstants.abilities.hit
            },
            bodySlam: {
                cast: this.bodySlam,
                constants: defaultClassConstants.abilities.bodySlam
            },
            crush: {
                cast: this.crush,
                constants: defaultClassConstants.abilities.crush
            },
            massiveSwing: {
                cast: this.massiveSwing,
                constants: defaultClassConstants.abilities.massiveSwing
            },
            protect: {
                cast: this.protect,
                constants: defaultClassConstants.abilities.protect
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    hit = () => {
        const hit = this.abilities("hit")
        const abilityResponse = this.useBasicDamageAbility(hit)
        return this.generateCombatString(hit, abilityResponse)
    }


    bodySlam = (target = this.getRandomEnemy()) => {       
        const bodySlam = this.abilities("bodySlam")
        const abilityResponse = this.useBasicDamageAbility(bodySlam, target)
        return this.generateCombatString(bodySlam, abilityResponse)
    }

    crush = (target = this.getRandomEnemy()) => {       
        const crush = this.abilities("crush")
        const abilityResponse = this.useBasicDamageAbility(crush, target)
        this.useBasicDamageModifierAbility(crush, target)
        return this.generateCombatString(crush, abilityResponse)
    }

    massiveSwing = () => {
        const massiveSwing = this.abilities("massiveSwing")
        const abilityResponse = this.useBasicAreaDamageAbility(massiveSwing)
        return this.generateCombatString(massiveSwing, abilityResponse)
    }

    protect = () => {
        const protect = this.abilities("protect")
        const abilityResponse = this.useBasicDamageModifierAbility(protect, this)
        return this.generateCombatString(protect, abilityResponse)
    }
}

module.exports = { DefaultClass }