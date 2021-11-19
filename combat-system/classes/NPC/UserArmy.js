const {ClassBase} = require("../../ClassBase")
const userArmyConstants = require("../../config/NPC/user-army-constants.json")

class UserArmy extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        Object.keys(userArmyConstants).forEach(key => this[key] = userArmyConstants[key])
    }

    abilities = (ability = null) => {
        const allAbilities = {
            weaponSwing: {
                cast: this.weaponSwing,
                constants: userArmyConstants.abilityConstants.weaponSwing
            },
            drawArrow: {
                cast: this.drawArrow,
                constants: userArmyConstants.abilityConstants.drawArrow
            },
            charge: {
                cast: this.charge,
                constants: userArmyConstants.abilityConstants.charge
            },
            volleyOfArrows: {
                cast: this.volleyOfArrows,
                constants: userArmyConstants.abilityConstants.volleyOfArrows
            },
            rally: {
                cast: this.rally,
                constants: userArmyConstants.abilityConstants.rally
            },
            defensiveFormation: {
                cast: this.defensiveFormation,
                constants: userArmyConstants.abilityConstants.defensiveFormation
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    weaponSwing = () => {
        const weaponSwing = this.abilities("weaponSwing")
        const abilityResponse = this.useBasicDamageAbility(weaponSwing)
        return this.generateCombatString(weaponSwing, abilityResponse)
    }


    drawArrow = (target = this.getRandomEnemy()) => {       
        const drawArrow = this.abilities("drawArrow")
        const abilityResponse = this.useBasicDamageAbility(drawArrow, target)
        return this.generateCombatString(drawArrow, abilityResponse)
    }

    charge = (target = this.getRandomEnemy()) => {       
        const charge = this.abilities("charge")
        const abilityResponse = this.useBasicDamageAbility(charge, target)
        this.useBasicDamageModifierAbility(charge, target)
        return this.generateCombatString(charge, abilityResponse)
    }

    volleyOfArrows = () => {
        const volleyOfArrows = this.abilities("volleyOfArrows")
        const abilityResponse = this.useBasicAreaDamageAbility(volleyOfArrows)
        return this.generateCombatString(volleyOfArrows, abilityResponse)
    }

    rally = () => {
        const rally = this.abilities("rally")
        const abilityResponse = this.useBasicDamageModifierAbility(rally, this)
        return this.generateCombatString(rally, abilityResponse)
    }

    defensiveFormation = () => {
        const defensiveFormation = this.abilities("defensiveFormation")
        const abilityResponse = this.useBasicDamageModifierAbility(defensiveFormation, this)
        return this.generateCombatString(defensiveFormation, abilityResponse)
    }
}

module.exports = { UserArmy }