const { GameEngine } = require("./combat-system/GameEngine")
const { AbilityEngine } = require("./combat-system/AbilityEngine")
const { DefaultClass } = require("./combat-system/classes/DefaultClass")
const { UserArmy } = require("./combat-system/classes/NPC/UserArmy")
const { Mage } = require("./combat-system/classes/Mage")
const { Ranger } = require("./combat-system/classes/Ranger")
const { Warrior } = require("./combat-system/classes/Warrior")
const { Shaman } = require("./combat-system/classes/Shaman")

const allClasses = [DefaultClass, UserArmy, Mage, Ranger, Warrior, Shaman]

module.exports = { GameEngine, AbilityEngine, allClasses }