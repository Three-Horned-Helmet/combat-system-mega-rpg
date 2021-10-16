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

    abilities = (ability = null) => {
        const allAbilities = {
            lightningBolt: {
                cast: this.lightningBolt,
                constants: shamanConstants.abilities.lightningBolt,
            },
            naturesRemedy: {
                cast: this.naturesRemedy,
                constants: shamanConstants.abilities.naturesRemedy,
            },
            healingRain: {
                cast: this.healingRain,
                constants: shamanConstants.abilities.healingRain,
            },
            earthquake: {
                cast: this.earthquake,
                constants: shamanConstants.abilities.earthquake,
            },
            protectiveTotem: {
                cast: this.protectiveTotem,
                constants: shamanConstants.abilities.protectiveTotem,
            }
        }

        return ability ? allAbilities[ability] : allAbilities
    }
    
    lightningBolt = (target = this.getRandomEnemy()) => {    
        const lightningBolt = this.abilities("lightningBolt")
        const abilityResponse = this.useBasicDamageAbility(lightningBolt, target)
        return this.generateCombatString(lightningBolt, abilityResponse)
    }

    naturesRemedy = (target = this.getRandomFriend()) => {
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
        const earthquake = this.abilities("earthquake")
        const abilityResponse = this.useBasicAreaDamageAbility(earthquake)
        return this.generateCombatString(rainOfFire, abilityResponse)
    }

    protectiveTotem = () => {
        const protectiveTotem = this.abilities("protectiveTotem")
        const { DEFENSE_MODIFIER } = protectiveTotem.constants

        this.getAllFriendlyUnits().forEach(friend => {
            this.applyDefenseModifier(friend, DEFENSE_MODIFIER)
        })

        return this.generateCombatString(protectiveTotem)
    }
}

module.exports = { Shaman }