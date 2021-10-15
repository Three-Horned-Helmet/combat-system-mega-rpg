const { ClassBase } = require("./ClassBase")
const mageConstants = require("./config/mage-constants.json")


class Mage extends ClassBase {
    constructor(game, owner, team = 1) {
        super(game, owner, team)

        this.className = "Mage"
        this.description = "A powerful mage capable of dealing massive damage to enemies"
        
        this.classInitiativeModifier = 1
        this.classAttackModifier = 1.3
        this.classDefenseModifier = 0.7
    }

    abilities = () => {
        return {
            fireball: {
                name: "fireball",
                description: "Hurls a ball of fire towards a targeted enemy dealing damage instantly and over time",
                cast: this.fireball,
                combatEffect: this.fireballDot,
                duration: 2,
                fromRound: null,
                effectTarget: null
            },
            arcaneblast: {
                name: "arcane blast",
                description: "Channels an arcane blast at the target location capable of dealing massive damage",
                cast: this.arcaneblast
            },
            arcaneConcentration: {
                name: "arcane concentration",
                description: "Meditates to increase the power of all damaging attacks for the rest of the fight",
                cast: this.arcaneConcentration
            },
            rainOfFire: {
                name: "rain of fire",
                description: "Summons a rain of fire upon all enemies",
                cast: this.rainOfFire
            }
        }
    }
    
    fireball = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = mageConstants.abilities.fireball
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Mage"
        const nameEnemy = enemy.name || "the enemy"

        if(!attackMissed){
            this.applyDamage(enemy, damageDealt)
            this._applyCombatEffect(this.abilities().fireball, target)
        }

        const combatHitStrings = [
            `${nameSelf} hurls a ball of fire towards ${nameEnemy} dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} hurls a massive ball of fire to critically hit ${nameEnemy} for ${damageDealt} damage completely frying it in the process!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s fireball evaporates in the air missing ${nameEnemy}!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    fireballDot = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = mageConstants.abilities.fireballDot
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : damage)
        const nameSelf = this.name || "Mage"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf}'s fireball continues to burn ${nameEnemy} for ${damageDealt} damage!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    arcaneblast = (target) => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = mageConstants.abilities.arcaneblast
        
        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Mage"
        const nameEnemy = enemy.name || "the enemy"

        if(!attackMissed){
            this.applyDamage(enemy, damageDealt)
        }

        const combatHitStrings = [
            `${nameSelf} conjures an arcane blast at ${nameEnemy}'s location dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} channels all power to create a devastating arcane blast dealing ${damageDealt} critical damage to ${nameEnemy}!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s arcane blast misses ${nameEnemy} by an inch!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    arcaneConcentration = () => {
        const { ATTACK_INCREASE } = mageConstants.abilities.arcaneConcentration

        this.applyAttackModifier(this, ATTACK_INCREASE)

        const nameSelf = this.name || "Mage"

        const combatHitStrings = [
            `${nameSelf} meditates to increase its powers for the rest of the fight!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    rainOfFire = () => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = mageConstants.abilities.rainOfFire
        
        const enemies = this.getAllEnemies()

        const damagesString = enemies.map(enemy => {
            const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack / this.defense) * ((1 - DAMAGE_SPREAD / 2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
            const attackMissed = Math.random() <= MISS_CHANCE
            const attackCrit = Math.random() <= CRIT_CHANCE
            const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)

            const nameEnemy = enemy.name || "the enemy"

            this.applyDamage(enemy, damageDealt)

            if(attackMissed) return ` missing ${nameEnemy},`
            else if(attackCrit) return ` critical hitting ${nameEnemy} for ${damageDealt},`
            else return ` hitting ${nameEnemy} for ${damageDealt},`
        }).join("").trim(",")

        const nameSelf = this.name || "Mage"

        const combatHitStrings = [
            `${nameSelf} channels a rain of fire on the battlefield ${damagesString}!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }
}

module.exports = { Mage }