const { AbilityEngine } = require("./AbilityEngine")

class ClassBase extends AbilityEngine {
    constructor(game, owner, team = 1){
        super()

        const { health, currentHealth, attack, defense, rank = null } = owner.hero

        this.game = game
        this.owner = owner
        this.team = team
        this.name = owner.name || owner.account?.username || "NPC"
        this.isNpc = owner.isNPC
        this.health = health
        this.currentHealth = currentHealth
        this.attack = attack
        this.defense = defense
        this.initiative = 100
        this.rank = rank
        this.combatEffects = []

        this.defenseModifier = 1
        this.attackModifier = 1
        this.initiativeModifier = 1
    }

    getRandomAbilities = (numberOfAbilities = 2) => {
        const abilities = this.abilities()
        const abilityKeys = Object.keys(abilities).filter(a => !abilities[a].notAnAbility)
        const randomAbilities = []

        for(let i = 0; i < numberOfAbilities; i++){
            if(abilityKeys.length){
                const randomAbilityIndex = Math.floor(Math.random() * abilityKeys.length)
                randomAbilities.push(abilities[abilityKeys[randomAbilityIndex]])
                abilityKeys.splice(randomAbilityIndex, 1)
            }
        }

        return randomAbilities
    }

    initiate = () => {
        this._applyClassModifiers()
    }

    getRandomEnemy = () => {
        const team = this._getAliveMembersFromTeam(this.team === 1 ? 2 : 1)
        return team[Math.floor(Math.random(team.length))]
    }

    getSeveralRandomEnemies = (numberOfEnemies) => {
        const team = this._getAliveMembersFromTeam(this.team === 1 ? 2 : 1)

        if(numberOfEnemies >= team.length) return team

        const teamCopy = team.slice()
        const randomEnemies = []
        for(const i = 0; i < numberOfEnemies; i++){
            const randomTeamIndex = Math.floor(Math.random() * teamCopy.length)
            randomEnemies.push(teamCopy[randomTeamIndex])
            teamCopy.splice(randomTeamIndex, 1)
        }

        return randomEnemies
    }

    getAllEnemies = () => {
        return this._getAliveMembersFromTeam(this.team === 1 ? 2 : 1)
    }

    getRandomFriend = () => {
        const team = this._getAliveMembersFromTeam(this.team === 1 ? 1 : 2)
        return team[Math.floor(Math.random(team.length))]
    }

    getFriendWithLeastHealth = () => {
        const team = this._getAliveMembersFromTeam(this.team === 1 ? 1 : 2)
        return team.sort((a, b) => a.currentHealth - b.currentHealth)[0]
    }

    getAllFriendlyUnits = () => {
        return this._getAliveMembersFromTeam(this.team === 1 ? 1 : 2)
    }

    // Returns null if the target is dead
    // Returns true if target is alive
    applyDamage = async (target, damage) => {
        target.currentHealth -= Math.floor(damage)
        if(target.save) target.save()

        if(target.currentHealth <= 0) {
            this.game.unitDied(target)
            return false
        }
        else return true
    }

    applyHealing = async (target, healing) => {
        target.currentHealth += Math.floor(healing)
        if(target.currentHealth > target.health) target.currentHealth = target.health
        if(target.save) await target.save()

        return true
    }

    applyAttackModifier = (target, modifier) => {
        if(!modifier) return

        const MIN_MODIFIER = 0.4
        const MAX_MODIFIER = 2.5

        target.attackModifier += modifier

        if(target.attackModifier < MIN_MODIFIER) target.attackModifier = MIN_MODIFIER
        else if(target.attackModifier > MAX_MODIFIER) target.attackModifier = MAX_MODIFIER

        return true
    }

    applyDefenseModifier = (target, modifier) => {
        if(!modifier) return

        const MIN_MODIFIER = 0.4
        const MAX_MODIFIER = 2.5

        target.defenseModifier += modifier

        if(target.defenseModifier < MIN_MODIFIER) target.defenseModifier = MIN_MODIFIER
        else if(target.defenseModifier > MAX_MODIFIER) target.defenseModifier = MAX_MODIFIER

        return target.defenseModifier
    }

    applyCombatModifiersToDamage = (target, damage) => {
        const newDamage = damage * (this.attackModifier / target.defenseModifier)
        return newDamage
    }

    applyCombatEffect = (ability, target) => {
        this.combatEffects.push({...ability, fromRound: this.game.round, effectTarget: target})
    }

    _applyClassModifiers = () => {
        this.initiative = this.initiative * (this.classInitiativeModifier || 1)
        this.attack = this.attack * (this.classAttackModifier || 1)
        this.defense = this.defense * (this.classDefenseModifier || 1)
    }

    _getAliveMembersFromTeam = (team = this.team) => {
        return this.game.combatTimeline.filter(unit => unit.team === team)
    }
}

module.exports = {ClassBase}