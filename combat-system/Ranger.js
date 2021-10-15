const {ClassBase} = require("./ClassBase")
const rangerConstants = require("./config/ranger-constants.json")

class Ranger extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        this.className = "Ranger"
        this.description = "An adaptable fighter specializing in ranged attacks"

        this.classInitiativeModifier = 3
        this.classAttackModifier = 1.1
        this.classDefenseModifier = 0.9
    }

    abilities = () => {
        return {
            piercingArrow: {
                name: "piercing arrow",
                description: "Shoots a very accurate arrow towards a target",
                cast: this.piercingArrow
            },
            exposeArmor: {
                name: "expose armor",
                description: "Exposes the armor of the target to increase the damage it takes",
                cast: this.exposeArmor
            },
            poisonedArrow: {
                name: "poisoned arrow",
                description: "Fires a poisoned arrow dealing damage to the target each turn",
                cast: this.poisonedArrow,
                combatEffect: this.poisonedArrowDot,
                duration: 3,
                fromRound: null,
                effectTarget: null
            },
            killingArrow: {
                name: "killing arrow",
                description: "An arrow that will always cause a critical hit against targets with low health",
                cast: this.killingArrow
            }
        }
    }
    
    piercingArrow = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = rangerConstants.abilities.piercingArrow
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Ranger"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf} draws the bow and fires an arrow towards ${nameEnemy} hitting bulls-eye dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf}'s arrow flies through the air hitting ${nameEnemy} directly in the head with a critical hit dealing ${damageDealt} damage!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s arrow flies through the air hitting some bushes behind ${nameEnemy}, completely missing the target!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    exposeArmor = (target) => {
        const { MISS_CHANCE, DEFENSE_DECREASE } = rangerConstants.abilities.exposeArmor
        
        const enemy = target || this.getRandomEnemy()
        const attackMissed = Math.random() <= MISS_CHANCE
        const nameSelf = this.name || "Ranger"
        const nameEnemy = enemy.name || "the enemy"

        if(!attackMissed){
            this.applyDefenseModifier(this, DEFENSE_DECREASE)
        }

        const combatHitStrings = [
            `${nameSelf} exposes the armor of ${nameEnemy} increasing all damage dealt to the target for the rest of the encounter!`
        ]
        const combatMissStrings = [
            `${nameSelf} tries to expose ${nameEnemy}'s armor, however there were no weaknesses found!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    poisonedArrow = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = rangerConstants.abilities.poisonedArrow
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : damage)
        const nameSelf = this.name || "Ranger"
        const nameEnemy = enemy.name || "the enemy"

        if(!attackMissed){
            this.applyDamage(enemy, damageDealt)
            this._applyCombatEffect(this.abilities().poisonedArrow, target)
        }

        const combatHitStrings = [
            `${nameSelf} fires a poisonous arrow hitting ${nameEnemy} dealing ${damageDealt} damage and poisoning the enemy!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s poisoned arrow hits a tree behind ${nameEnemy}!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    poisonedArrowDot = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = rangerConstants.abilities.poisonedArrowDot
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : damage)
        const nameSelf = this.name || "Ranger"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf}'s poisonous arrow deals ${damageDealt} damage to ${nameEnemy}!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }
    
    killingArrow = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER, HEALTH_THRESHOLD } = rangerConstants.abilities.killingArrow
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE || (enemy.currentHealth/enemy.health) > HEALTH_THRESHOLD
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Ranger"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf} draws the bow and fires an arrow towards ${nameEnemy} hitting the stomach dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf}'s arrow hits ${nameEnemy} with a devastating critical hit dealing ${damageDealt} damage!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s arrow flies through the air missing everything!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }
}

module.exports = { Ranger }