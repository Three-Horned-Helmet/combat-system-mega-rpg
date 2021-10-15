const {ClassBase} = require("./ClassBase")
const shamanConstants = require("./config/shaman-constants.json")

class Shaman extends ClassBase {
    constructor(game, owner, team = 1) {
        super(game, owner, team)

        this.className = "Shaman"
        this.description = "A versatile Shaman that uses natures power to heal and deal damage"
        
        this.classInitiativeModifier = shamanConstants.stats.initiativeModifier
        this.classAttackModifier = shamanConstants.stats.attackModifier
        this.classDefenseModifier = shamanConstants.stats.defenseModifier
    }

    abilities = () => {
        return {
            lightningBolt: {
                name: "lightning bolt",
                description: "Channels a bolt of lightning towards a targeted enemy",
                cast: this.lightningBolt
            },
            naturesRemedy: {
                name: "natures remedy",
                description: "Summons the natures remedies tp heal a targeted friendly target",
                cast: this.naturesRemedy
            },
            healingRain: {
                name: "healing rain",
                description: "Conjures soothing rain healing all friendly units",
                cast: this.healingRain
            },
            earthquake: {
                name: "earthquake",
                description: "Channels the hidden powers of the earth causing a massive earthquake damaging all enemies",
                cast: this.earthquake
            },
            protectiveTotem: {
                name: "protective totem",
                description: "Places a totem on the ground that will protect all friendly units on the battlefield",
                cast: this.protectiveTotem
            }
        }
    }
    
    lightningBolt = (target) => {    
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = shamanConstants.abilities.lightningBolt

        const enemy = target || this.getRandomEnemy()
        const damage = this.applyCombatModifiersToDamage(enemy, BASE_DAMAGE + (this.attack * (this.attack/this.defense) * ((1-DAMAGE_SPREAD/2) + Math.random() * DAMAGE_SPREAD)) * DAMAGE_MULTIPLIER)
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const damageDealt = Math.floor(attackMissed ? 0 : attackCrit ? damage * 2 : damage)
        const nameSelf = this.name || "Shaman"
        const nameEnemy = enemy.name || "the enemy"

        this.applyDamage(enemy, damageDealt)

        const combatHitStrings = [
            `${nameSelf} hurls a lightning bolt towards ${nameEnemy} dealing ${damageDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} channels a massive bolt of lightning that critical hits and completely fry ${nameEnemy} for ${damageDealt} damage!`
        ]
        const combatMissStrings = [
            `${nameSelf}'s ligning bolt misses ${nameEnemy} and evaporates in the air!`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    naturesRemedy = (target) => {
        const { HEALING_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_HEALING, HEALING_MULTIPLIER } = shamanConstants.abilities.naturesRemedy
        
        const friend = target || this.getRandomFriend()
        const healed = BASE_HEALING + (this.attack * (this.attack/this.defense) * ((1-HEALING_SPREAD/2) + Math.random() * HEALING_SPREAD)) * HEALING_MULTIPLIER
        const attackMissed = Math.random() <= MISS_CHANCE
        const attackCrit = Math.random() <= CRIT_CHANCE
        const healingDealt = Math.floor(attackMissed ? 0 : attackCrit ? healed * 2 : healed)
        const nameSelf = this.name || "Shaman"
        const nameFriend = friend.name || "the friend"

        this.applyHealing(friend, healingDealt)

        const combatHitStrings = [
            `${nameSelf} summons the natures remedy to nurture ${nameFriend}'s wounds healing ${healingDealt} damage!`
        ]
        const combatCriticalStrings = [
            `${nameSelf} channels the ancient spirits of the nature to heal ${nameFriend} for ${healingDealt} damage!`
        ]
        const combatMissStrings = [
            `${nameSelf} is unable to connect with the nature and a mild windy breeze just passes by doing absolutely nothing...`
        ]

        if(attackMissed) return combatMissStrings[Math.floor(Math.random() * combatMissStrings.length)]
        else if(attackCrit) return combatCriticalStrings[Math.floor(Math.random() * combatCriticalStrings.length)]
        else return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    healingRain = () => {
        const { HEALING_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_HEALING, HEALING_MULTIPLIER } = shamanConstants.abilities.healingRain
        
        const friends = this.getAllFriendlyUnits()

        const healingString = friends.map(friend => {
            const healed = BASE_HEALING + (this.attack * (this.attack/this.defense) * ((1-HEALING_SPREAD/2) + Math.random() * HEALING_SPREAD)) * HEALING_MULTIPLIER
            const attackMissed = Math.random() <= MISS_CHANCE
            const attackCrit = Math.random() <= CRIT_CHANCE
            const healingDealt = Math.floor(attackMissed ? 0 : attackCrit ? healed * 2 : healed)
            const nameFriend = friend.name || "the friend"
    
            this.applyHealing(friend, healingDealt)

            if(attackMissed) return ` missing ${nameFriend},`
            else if(attackCrit) return ` critical healing ${nameFriend} for ${healingDealt},`
            else return ` healing ${nameFriend} for ${healingDealt},`
        }).join("").trim(",")

        const nameSelf = this.name || "Shaman"

        const combatHitStrings = [
            `${nameSelf} spins around like a whirlwind ${healingString}!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    earthquake = () => {
        const { DAMAGE_SPREAD, MISS_CHANCE, CRIT_CHANCE, BASE_DAMAGE, DAMAGE_MULTIPLIER } = shamanConstants.abilities.earthquake
        
        const enemies = this.getAllEnemies()

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

        const nameSelf = this.name || "Shaman"

        const combatHitStrings = [
            `${nameSelf} speaks the words of the earh causing a massive earthquake ${damagesString}!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }

    protectiveTotem = () => {
        const { DEFENSE_INCREASE } = shamanConstants.abilities.protectiveTotem

        const friendlyUnits = this.getAllFriendlyUnits()

        friendlyUnits.forEach(friend => {
            this.applyDefenseModifier(friend, DEFENSE_INCREASE)
        })

        const nameSelf = this.name || "Shaman"

        const combatHitStrings = [
            `${nameSelf} places a protective totem at the ground increasing the defensive capabilities of all allied units!`
        ]

        return combatHitStrings[Math.floor(Math.random() * combatHitStrings.length)]
    }
}

module.exports = { Shaman }