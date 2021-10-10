const {ClassBase} = require("./ClassBase")

class Warrior extends ClassBase {
    constructor(game, owner, team = 1){
        super(game, owner, team)

        this.className = "Warrior"
        this.description = "A ruthless Warrior that hits before it thinks!"

        this.classInitiativeModifier = 2
        this.classAttackModifier = 0.8
        this.classDefenseModifier = 1.2
    }

    abilities = () => {
        return {
            slam: {
                name: "slam",
                description: "Slams the target with a mighty force",
                cast: this.slam
            },
            heartStrike: {
                name: "heart strike",
                description: "Attempts to slice through the target's heart to deal a critical strike",
                cast: this.heartStrike
            },
            shieldWall: {
                name: "shield wall",
                description: "Raises the shield to increase the defensive capabilities for the rest of the fight",
                cast: this.shieldWall
            },
            whirlwind: {
                name: "whirlwind",
                description: "Spins around hitting multiple targets at the same time",
                cast: this.whirlwind
            }
        }
    }
    
    slam = () => {        
        const DAMAGE_SPREAD = 0.4
        const MISS_CHANCE = 0.2
        const CRIT_CHANCE = 0.2
        const BASE_DAMAGE = 20
        const DAMAGE_MULTIPLIER = 1
        
        const enemy = this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Warrior"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf} slams ${nameEnemy} to the ground with a mighty force dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} weapon slams ${nameEnemy} with a critical hit, crushing every bone in its body dealing ${damageDealt} damage!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s mighty swing misses ${nameEnemy} and shatters the ground!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }


    heartStrike = (target) => {        
        const DAMAGE_SPREAD = 0.4
        const MISS_CHANCE = 0.5
        const CRIT_CHANCE = 0.6
        const BASE_DAMAGE = 30
        const DAMAGE_MULTIPLIER = 1
        
        const enemy = this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2.2 : damage * 0.7)
        const nameSelf = this.name || "Warrior"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf} slices through ${nameEnemy}'s skin dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} cuts through ${nameEnemy} piercing its heart with a critical hit dealing ${damageDealt} damage!`
        ]
        const combatMissStrings = [
            `In a valient attempt to stab ${nameEnemy}, ${nameSelf} misses awkwardly its target`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    shieldWall = () => {
        const DEFENSE_INCREASE = 0.4

        this.applyDefenseModifier(this, DEFENSE_INCREASE)

        const nameSelf = this.name || "Warrior"

        const combatHitStrings = [
            `${nameSelf} raises the shield to significantly increase its defence!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    whirlwind = () => {
        const DAMAGE_SPREAD = 0.2
        const MISS_CHANCE = 0.1
        const CRIT_CHANCE = 0.1
        const BASE_DAMAGE = 10
        const TARGET_ENEMIES = 3
        const DAMAGE_MULTIPLIER = 0.5
        
        const enemies = this.getSeveralRandomEnemies(TARGET_ENEMIES)

        const damagesString = enemies.map(enemy => {
            const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
            const attackMissed = Math.random() <= MISS_CHANCE
            const attackCrit = Math.random() <= CRIT_CHANCE
            const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)

            const nameEnemy = enemy.name || "the enemy"

            this.applyDamage(enemy, damageDealt)

            if(attackMissed) return ` missing ${nameEnemy},`
            else if(attackCrit) return ` critical hitting ${nameEnemy} for ${damageDealt},`
            else return ` hitting ${nameEnemy} for ${damageDealt},`
        }).join("").trim(",")

        const nameSelf = this.name || "Warrior"

        const combatHitStrings = [
            `${nameSelf} spins around like a whirlwind ${damagesString}!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }
}

module.exports = { Warrior }