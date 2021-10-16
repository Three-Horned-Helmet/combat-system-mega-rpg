class AbilityEngine {
    constructor() {

    }

    generateCombatString = (abilityObj, options = {}) => {
        const { target, damageDealt, attackMissed, attackCrit } = options

        const nameSelf = this.name || this.className
        const nameEnemy = target?.name || "the enemy"

        const { combatHitStrings, combatCriticalStrings, combatMissStrings } = abilityObj.constants

        let combatString;
        if(attackMissed) combatString = combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) combatString = combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else combatString = combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
        
        Object.assign(options, { nameSelf, nameEnemy, damageDealt })
        return this._formatCombatString(combatString, options)
    }

    useBasicDamageAbility = (abilityObj, target = this.getRandomEnemy(), options = {}) => {
        const responseObject = this._damageCalculation(abilityObj, target, options)
        const { attackMissed, damageDealt } = responseObject
        responseObject.target = target

        if(!attackMissed){
            this.applyDamage(target, damageDealt)
            if(abilityObj.constants.DOT){
                const response = this.applyCombatEffect(this.abilities(abilityObj.constants.DOT), target)
                if(response) Object.assign(responseObject, response)
            }
        }

        return responseObject
    }

    useBasicAreaDamageAbility = (abilityObj, targets = [], options = {}) => {
        if(!targets.length){
            const { TARGET_ENEMIES } = abilityObj
            targets = TARGET_ENEMIES ? this.getSeveralRandomEnemies(TARGET_ENEMIES) : this.getAllEnemies()
        }

        const damagesString = targets.map(target => {
            const { damageDealt, attackMissed, attackCrit } = this.useBasicDamageAbility(abilityObj, target)

            const nameEnemy = target.name || "the enemy"

            this.applyDamage(target, damageDealt)

            if(attackMissed) return ` missing ${nameEnemy},`
            else if(attackCrit) return ` critical hitting ${nameEnemy} for ${damageDealt},`
            else return ` hitting ${nameEnemy} for ${damageDealt},`
        }).join("").replace(/,$/g, "")

        return { damagesString }
    }

    useBasicDamageModifierAbility = (abilityObj, target = this.getRandomEnemy()) => {
        const { DEFENSE_MODIFIER, ATTACK_MODIFIER, MISS_CHANCE = 0 } = abilityObj.constants

        const attackMissed = Math.random() <= MISS_CHANCE

        if(!attackMissed){
            this.applyDefenseModifier(target, DEFENSE_MODIFIER)
            this.applyAttackModifier(target, ATTACK_MODIFIER)
        }

        return { attackMissed, target }
    }

    _damageCalculation = (abilityObj, target, options = {}) => {
        const { DAMAGE_SPREAD, MISS_CHANCE = 0, CRIT_CHANCE = 0, CRIT_MULTIPLIER = 2, BASE_DAMAGE, DAMAGE_MULTIPLIER } = abilityObj.constants

        const rawDamage = BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER
        const damage = this.applyCombatModifiersToDamage(target, rawDamage)
        const attackMissed = Math.random() <= (options.MISS_CHANCE || MISS_CHANCE)
        const attackCrit = Math.random() <= (options.CRIT_CHANCE || CRIT_CHANCE)
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * CRIT_MULTIPLIER : damage)

        return { damageDealt, attackMissed, attackCrit }
    }

    _formatCombatString = (combatString = "", { nameSelf, nameEnemy, damageDealt, damagesString} = options) => {
        return combatString
            .replace(/\${nameSelf}/g, nameSelf)
            .replace(/\${nameEnemy}/g, nameEnemy)
            .replace(/\${damageDealt}/g, damageDealt)
            .replace(/\${damagesString}/g, damagesString)
    }
}

module.exports = { AbilityEngine }