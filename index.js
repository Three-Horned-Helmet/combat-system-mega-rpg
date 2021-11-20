const { GameEngine } = require("./combat-system/GameEngine")
const { AbilityEngine } = require("./combat-system/AbilityEngine")

const { DefaultClass } = require("./combat-system/classes/DefaultClass")
const { UserArmy } = require("./combat-system/classes/NPC/UserArmy")
const { Mage } = require("./combat-system/classes/Mage")
const { Ranger } = require("./combat-system/classes/Ranger")
const { Warrior } = require("./combat-system/classes/Warrior")
const { Shaman } = require("./combat-system/classes/Shaman")

const allClasses = { 
    DefaultClass: {
        class: DefaultClass,
        ...(require("./combat-system/config/default-class-constants.json"))
    }, 
    UserArmy: {
        class: UserArmy,
        ...(require("./combat-system/config/NPC/user-army-constants.json"))
    }, 
    Mage: {
        class: Mage,
        ...(require("./combat-system/config/mage-constants.json"))
    }, 
    Ranger: {
        class: Ranger,
        ...(require("./combat-system/config/ranger-constants.json"))
    }, 
    Warrior: {
        class: Warrior,
        ...(require("./combat-system/config/warrior-constants.json"))
    }, 
    Shaman: {
        class: Shaman,
        ...(require("./combat-system/config/shaman-constants.json"))
    }
}
console.log("classes", allClasses)

module.exports = { GameEngine, AbilityEngine, allClasses }