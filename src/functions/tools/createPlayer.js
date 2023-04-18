const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');

module.exports = (client) => {
    client.createPlayer = async(interaction, client) => {

        var user = {
            "username" : interaction.user.username,
            "gold" : 100,
            "tradeFocus" : null,

            "factionID" : null,
            "hometown" : null,
            "curLocation" : null,

            "activeParty" : [],

            "adventureSlots" : {
                "slot1" : {
                    "unlocked": true,
                    "available" : true,
                    "unit" : null,
                    "task" : null,
                    "location" : null,
                    "endTime" : null,
                    "duration" : null
                },

                "slot2" : {
                    "unlocked": true,
                    "available" : true,
                    "unit" : null,
                    "task" : null,
                    "location" : null,
                    "endTime" : null,
                    "duration" : null
                },

                "slot3" : {
                    "unlocked": true,
                    "available" : true,
                    "unit" : null,
                    "task" : null,
                    "location" : null,
                    "endTime" : null,
                    "duration" : null
                },

                "slot4" : {
                    "unlocked": false,
                    "available" : true,
                    "unit" : null,
                    "task" : null,
                    "location" : null,
                    "endTime" : null,
                    "duration" : null
                },

                "slot5" : {
                    "unlocked": false,
                    "available" : true,
                    "unit" : null,
                    "task" : null,
                    "location" : null,
                    "endTime" : null,
                    "duration" : null
                }
            }
        };


        var army = {
            "undead" : {
                "info" : {
                        "title": "Majesty", "name" : "USER", "class1" : "Snuff", "class2" : "Venin",
                        "heldItem" : "None", "unlocked" : true, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 1, "mag" : 1, "res" : 1, "acc" : 2, "spd" : 2
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Strike"}, "Sight" : {"name" : "Distract"},
                    "Range" : {"name" : "Rally"}, "Far" : {"name" : "Shoot"},
                    "Commander" : {"name" : "Infection"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "troglodyte" : {
                "info" : {
                        "title": "Cheiftain", "name" : "L'munak", "class1" : "Snuff", "class2" : "Rive",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 3, "def" : 1, "mag" : 1, "res" : 1, "acc" : 1, "spd" : 2
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Strike"}, "Sight" : {"name" : "Distract"},
                    "Range" : {"name" : "Rally"}, "Far" : {"name" : "Shoot"},
                    "Commander" : {"name" : "Pierce"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "kolbold" : {
                "info" : {
                        "title": "Akitainu", "name" : "Snugna", "class1" : "Snuff", "class2" : "Miscellany",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 95, "mp" : 95, "energy" : 150, "maxhp" : 95, "maxmp" : 95, "maxenergy" : 150,
                    "atk" : 25, "def" : 17, "mag" : 15, "res" : 19, "acc" : 18, "spd" : 18
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 0.8},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1.2}, "leatherworker" : {"lvl" : 1, "growth": 0.8},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 0.8}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1.2}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 0.8},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1.2},
                }, 
                "abilities" : {
                    "Clash" : {"name" : "Strike"}, "Sight" : {"name" : "Distract"},
                    "Range" : {"name" : "Rally"}, "Far" : {"name" : "Shoot"},
                    "Commander" : {"name" : "Scorch"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "myconid" : {
                "info" : {
                        "title": "Maitake", "name" : "Herab", "class1" : "Venin", "class2" : "Vigor",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 20, "mp" : 10, "energy" : 15, "maxhp" : 20, "maxmp" : 10, "maxenergy" : 15,
                    "atk" : 2, "def" : 1, "mag" : 1, "res" : 2, "acc" : 2, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Trap"}, "Sight" : {"name" : "Backstab"},
                    "Range" : {"name" : "Dart"}, "Far" : {"name" : "Taunt"},
                    "Commander" : {"name" : "Spore"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "mimic" : {
                "info" : {
                        "title": "Trunk", "name" : "Erk", "class1" : "Venin", "class2" : "Beast",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 80, "mp" : 90, "energy" : 150, "maxhp" : 95, "maxmp" : 95, "maxenergy" : 150,
                    "atk" : 25, "def" : 10, "mag" : 19, "res" : 8, "acc" : 29, "spd" : 25
                    },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1.2}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1.2}, "enchanting" : {"lvl" : 1, "growth": 0.8},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1.2}, "alchemy" : {"lvl" : 1, "growth": 0.8},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 0.8},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1.2},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Trap"}, "Sight" : {"name" : "Backstab"},
                    "Range" : {"name" : "Dart"}, "Far" : {"name" : "Taunt"},
                    "Commander" : {"name" : "Lock"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "oblet" : {
                "info" : {
                        "title": "Ooze", "name" : "Glom", "class1" : "Venin", "class2" : "Culminate",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 80, "mp" : 60, "energy" : 100, "maxhp" : 80, "maxmp" : 60, "maxenergy" : 100,
                    "atk" : 16, "def" : 8, "mag" : 6, "res" : 12, "acc" : 12, "spd" : 18
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 0.8 },
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1.2},
                    "engineering" : {"lvl" : 1, "growth": 0.8}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1.2},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Trap"}, "Sight" : {"name" : "Backstab"},
                    "Range" : {"name" : "Dart"}, "Far" : {"name" : "Taunt"},
                    "Commander" : {"name" : "Disintegrate"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "wisp" : {
                "info" : {
                        "title": "Tribune", "name" : "Will-o'", "class1" : "Essence", "class2" : "Miscellany",
                        "heldItem" : "None", "unlocked" : true, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 1, "def" : 1, "mag" : 3, "res" : 2, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Embew"}, "Sight" : {"name" : "Burn"},
                    "Range" : {"name" : "Bolt"}, "Far" : {"name" : "Force Field"},
                    "Commander" : {"name" : "Tornado"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "wraith" : {
                "info" : {
                        "title": "Reaper", "name" : "Breeth", "class1" : "Essence", "class2" : "Snuff",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 1, "mag" : 2, "res" : 1, "acc" : 1, "spd" : 2
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Embew"}, "Sight" : {"name" : "Burn"},
                    "Range" : {"name" : "Bolt"}, "Far" : {"name" : "Force Field"},
                    "Commander" : {"name" : "Grasp"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "misphet" : {
                "info" : {
                        "title": "Trickster", "name" : "Puck", "class1" : "Essence", "class2" : "Rive",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 20, "mp" : 40, "energy" : 50, "maxhp" : 20, "maxmp" : 40, "maxenergy" : 50,
                    "atk" : 2, "def" : 4, "mag" : 10, "res" : 4, "acc" : 10, "spd" : 8
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 0.8}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1.2}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Embew"}, "Sight" : {"name" : "Burn"},
                    "Range" : {"name" : "Bolt"}, "Far" : {"name" : "Force Field"},
                    "Commander" : {"name" : "Reversal"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "naga" : {
                "info" : {
                        "title": "Serpentine", "name" : "Vrata", "class1" : "Assial", "class2" : "Beast",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 30, "mp" : 30, "energy" : 50, "maxhp" : 30, "maxmp" : 30, "maxenergy" : 50,
                    "atk" : 8, "def" : 6, "mag" : 2, "res" : 4, "acc" : 6, "spd" : 12
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 0.8},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1.2},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 0.8},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Topple"}, "Sight" : {"name" : "Disenage"},
                    "Range" : {"name" : "Arched"}, "Far" : {"name" : "Snipe"},
                    "Commander" : {"name" : "Counter"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "elf" : {
                "info" : {
                        "title": "High-Elf", "name" : "Qhesh", "class1" : "Assial", "class2" : "Essence",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 1, "def" : 1, "mag" : 2, "res" : 1, "acc" : 3, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Topple"}, "Sight" : {"name" : "Disenage"},
                    "Range" : {"name" : "Arched"}, "Far" : {"name" : "Snipe"},
                    "Commander" : {"name" : "Zap"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            

            "troll" : {
                "info" : {
                        "title": "Prince", "name" : "Zed", "class1" : "Assial", "class2" : "Venin",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 70, "mp" : 80, "energy" : 100, "maxhp" : 70, "maxmp" : 80, "maxenergy" : 100,
                    "atk" : 18, "def" : 6, "mag" : 8, "res" : 6, "acc" : 16, "spd" : 16
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1.2}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 0.8},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1.2},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 0.8},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1.2},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 0.8}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Topple"}, "Sight" : {"name" : "Disenage"},
                    "Range" : {"name" : "Arched"}, "Far" : {"name" : "Snipe"},
                    "Commander" : {"name" : "Toxin"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            

            "blight" : {
                "info" : {
                        "title": "Oaken", "name" : "Cherri", "class1" : "Culminate", "class2" : "Essence",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 50, "mp" : 35, "energy" : 50, "maxhp" : 50, "maxmp" : 35, "maxenergy" : 50,
                    "atk" : 6, "def" : 4, "mag" : 6, "res" : 9, "acc" : 5, "spd" : 3
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 0.8}, "enchanting" : {"lvl" : 1, "growth": 1.2},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shove"}, "Sight" : {"name" : "Bellow"},
                    "Range" : {"name" : "Quake"}, "Far" : {"name" : "Rumble"},
                    "Commander" : {"name" : "Sap"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "giant" : {
                "info" : {
                        "title": "Overlord", "name" : "Xubog", "class1" : "Culminate", "class2" : "Vigor",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 150, "mp" : 110, "energy" : 150, "maxhp" : 150, "maxmp" : 110, "maxenergy" : 150,
                    "atk" : 29, "def" : 27, "mag" : 8, "res" : 8, "acc" : 18, "spd" : 8
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 0.8},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1.2},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 0.8}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 0.8},
                    "whittling" : {"lvl" : 1, "growth": 1.2}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1.2},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 0.8}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shove"}, "Sight" : {"name" : "Bellow"},
                    "Range" : {"name" : "Quake"}, "Far" : {"name" : "Rumble"},
                    "Commander" : {"name" : "Rebuttal"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "talus" : {
                "info" : {
                        "title": "Boulder", "name" : "Tinus", "class1" : "Culminate", "class2" : "Assial",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 3, "mag" : 1, "res" : 1, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shove"}, "Sight" : {"name" : "Bellow"},
                    "Range" : {"name" : "Quake"}, "Far" : {"name" : "Rumble"},
                    "Commander" : {"name" : "Earthquake"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "sprite" : {
                "info" : {
                        "title": "Royal", "name" : "Pastel", "class1" : "Conduit", "class2" : "Assial",
                        "heldItem" : "None", "unlocked" : true, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 1, "def" : 1, "mag" : 1, "res" : 4, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Smite"}, "Sight" : {"name" : "Heal"},
                    "Range" : {"name" : "Cleanse"}, "Far" : {"name" : "Bless"},
                    "Commander" : {"name" : "Grace"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "witch" : {
                "info" : {
                        "title": "Sage", "name" : "Medeia", "class1" : "Conduit", "class2" : "Essence",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 20, "energy" : 15, "maxhp" : 15, "maxmp" : 20, "maxenergy" : 15,
                    "atk" : 1, "def" : 1, "mag" : 2, "res" : 2, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Smite"}, "Sight" : {"name" : "Heal"},
                    "Range" : {"name" : "Cleanse"}, "Far" : {"name" : "Bless"},
                    "Commander" : {"name" : "Cauldron"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "demon" : {
                "info" : {
                        "title": "Abaddon", "name" : "Nybbas", "class1" : "Conduit", "class2" : "Beast",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 60, "mp" : 80, "energy" : 100, "maxhp" : 60, "maxmp" : 80, "maxenergy" : 100,
                    "atk" : 8, "def" : 6, "mag" : 12, "res" : 16, "acc" : 12, "spd" : 18
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 0.8},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 0.8}, "leatherworker" : {"lvl" : 1, "growth": 1.2},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 0.8}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1.2}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Smite"}, "Sight" : {"name" : "Heal"},
                    "Range" : {"name" : "Cleanse"}, "Far" : {"name" : "Bless"},
                    "Commander" : {"name" : "Curse"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            

            "quickling" : {
                "info" : {
                        "title": "Eagle", "name" : "Aeran", "class1" : "Rive", "class2" : "Conduit",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 1, "def" : 1, "mag" : 1, "res" : 1, "acc" : 1, "spd" : 4
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Mark"}, "Sight" : {"name" : "Encourage"},
                    "Range" : {"name" : "Spark"}, "Far" : {"name" : "Restore"},
                    "Commander" : {"name" : "Tailwind"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "harpy" : {
                "info" : {
                        "title": "Mother", "name" : "Ferise", "class1" : "Rive", "class2" : "Venin",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 30, "mp" : 30, "energy" : 50, "maxhp" : 30, "maxmp" : 30, "maxenergy" : 50,
                    "atk" : 9, "def" : 2, "mag" : 5, "res" : 7, "acc" : 9, "spd" : 6
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 0.8},
                    "armory" : {"lvl" : 1, "growth": 1.2}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Mark"}, "Sight" : {"name" : "Encourage"},
                    "Range" : {"name" : "Spark"}, "Far" : {"name" : "Restore"},
                    "Commander" : {"name" : "Screech"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "imp" : {
                "info" : {
                        "title": "Captain", "name" : "Drac", "class1" : "Rive", "class2" : "Miscellany",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 50, "mp" : 70, "energy" : 100, "maxhp" : 50, "maxmp" : 70, "maxenergy" : 100,
                    "atk" : 9, "def" : 6, "mag" : 19, "res" : 15, "acc" : 15, "spd" : 10
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1.2}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 0.8}, "enchanting" : {"lvl" : 1, "growth": 1.2},
                    "engineering" : {"lvl" : 1, "growth": 1.2}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 0.8}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Mark"}, "Sight" : {"name" : "Encourage"},
                    "Range" : {"name" : "Spark"}, "Far" : {"name" : "Restore"},
                    "Commander" : {"name" : "Skewer"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "treant" : {
                "info" : {
                        "title": "Elder", "name" : "Juniper", "class1" : "Miscellany", "class2" : "Conduit",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 1, "mag" : 2, "res" : 2, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1.2},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Brace"}, "Sight" : {"name" : "Lunge"},
                    "Range" : {"name" : "Rations"}, "Far" : {"name" : "Fear"},
                    "Commander" : {"name" : "Revive"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "gnoll" : {
                "info" : {
                        "title": "Chief", "name" : "Izz", "class1" : "Miscellany", "class2" : "Culminate",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 30, "mp" : 30, "energy" : 50, "maxhp" : 30, "maxmp" : 30, "maxenergy" : 50,
                    "atk" : 8, "def" : 2, "mag" : 4, "res" : 6, "acc" : 10, "spd" : 8
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1.2},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 0.8},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Brace"}, "Sight" : {"name" : "Lunge"},
                    "Range" : {"name" : "Rations"}, "Far" : {"name" : "Fear"},
                    "Commander" : {"name" : "Bash"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "goblin" : {
                "info" : {
                        "title": "Duke", "name" : "Rigzuct", "class1" : "Miscellany", "class2" : "Assial",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 70, "mp" : 110, "energy" : 150, "maxhp" : 70, "maxmp" : 110, "maxenergy" : 150,
                    "atk" : 30, "def" : 12, "mag" : 8, "res" : 10, "acc" : 25, "spd" : 29
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1.2}, "leatherworker" : {"lvl" : 1, "growth": 0.8},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1.2}, "jewelcrafting" : {"lvl" : 1, "growth": 0.8},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1.2}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 0.8},
                },
                "abilities" : {
                    "Clash" : {"name" : "Brace"}, "Sight" : {"name" : "Lunge"},
                    "Range" : {"name" : "Rations"}, "Far" : {"name" : "Fear"},
                    "Commander" : {"name" : "Debris"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },


            "draenei" : {
                "info" : {
                        "title": "Warden", "name" : "Kelras", "class1" : "Vigor", "class2" : "Conduit",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 1, "def" : 2, "mag" : 1, "res" : 3, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shield"}, "Sight" : {"name" : "Toss"},
                    "Range" : {"name" : "Bolster"}, "Far" : {"name" : "Shout"},
                    "Commander" : {"name" : "Aura"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "dwarf" : {
                "info" : {
                        "title": "Master", "name" : "Urat", "class1" : "Vigor", "class2" : "Rive",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 120, "mp" : 60, "energy" : 150, "maxhp" : 120, "maxmp" : 60, "maxenergy" : 150,
                    "atk" : 24, "def" : 34, "mag" : 21, "res" : 6, "acc" : 26, "spd" : 3
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 1.2},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 1.2},
                    "armory" : {"lvl" : 1, "growth": 0.8}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1.2},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 0.8},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1.2},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 0.8},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shield"}, "Sight" : {"name" : "Toss"},
                    "Range" : {"name" : "Bolster"}, "Far" : {"name" : "Shout"},
                    "Commander" : {"name" : "Barrier"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            
            "orc" : {
                "info" : {
                        "title": "General", "name" : "Orbul", "class1" : "Vigor", "class2" : "Snuff",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 3, "mag" : 1, "res" : 1, "acc" : 1, "spd" : 1
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1.2}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 0.8}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Shield"}, "Sight" : {"name" : "Toss"},
                    "Range" : {"name" : "Bolster"}, "Far" : {"name" : "Shout"},
                    "Commander" : {"name" : "Enrage"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },
            

            "murlok" : {
                "info" : {
                        "title": "Warleader", "name" : "Grrbr", "class1" : "Beast", "class2" : "Snuff",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 80, "mp" : 100, "energy" : 150, "maxhp" : 80, "maxmp" : 100, "maxenergy" : 150,
                    "atk" : 33, "def" : 5, "mag" : 4, "res" : 5, "acc" : 34, "spd" : 33
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 0.8}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 1.2}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 0.8},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1.2}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 0.8}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1.2}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 0.8}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1.2}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Slash"}, "Sight" : {"name" : "Hone"},
                    "Range" : {"name" : "Bleed"}, "Far" : {"name" : "Howl"},
                    "Commander" : {"name" : "Dexerity"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "warg" : {
                "info" : {
                        "title": "Alpha", "name" : "Wynter", "class1" : "Beast", "class2" : "Vigor",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 15, "mp" : 15, "energy" : 15, "maxhp" : 15, "maxmp" : 15, "maxenergy" : 15,
                    "atk" : 2, "def" : 2, "mag" : 1, "res" : 1, "acc" : 1, "spd" : 2
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1}, "mining" : {"lvl" : 1, "growth": 0.8},
                    "skinning" : {"lvl" : 1, "growth": 1}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1.2}, "weaponsmith" : {"lvl" : 1, "growth": 1},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 1},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 1}, "alchemy" : {"lvl" : 1, "growth": 1},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Slash"}, "Sight" : {"name" : "Hone"},
                    "Range" : {"name" : "Bleed"}, "Far" : {"name" : "Howl"},
                    "Commander" : {"name" : "Bark"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            },

            "dragon" : {
                "info" : {
                        "title": "High", "name" : "Yilbegan", "class1" : "Beast", "class2" : "Culminate",
                        "heldItem" : "None", "unlocked" : false, "activity" : null
                    },
                "stats" : {
                    "hp" : 60, "mp" : 60, "energy" : 100, "maxhp" : 60, "maxmp" : 60, "maxenergy" : 100,
                    "atk" : 12, "def" : 12, "mag" : 16, "res" : 12, "acc" : 12, "spd" : 12
                },
                "profession" : {
                    "logging" : {"lvl" : 1, "growth": 1.2}, "mining" : {"lvl" : 1, "growth": 1},
                    "skinning" : {"lvl" : 1, "growth": 0.8}, "harvesting" : {"lvl" : 1, "growth": 1},
                    "fishing" : {"lvl" : 1, "growth": 1}, "weaponsmith" : {"lvl" : 1, "growth": 1.2},
                    "armory" : {"lvl" : 1, "growth": 1}, "leatherworker" : {"lvl" : 1, "growth": 1},
                    "talioring" : {"lvl" : 1, "growth": 1}, "enchanting" : {"lvl" : 1, "growth": 0.8},
                    "engineering" : {"lvl" : 1, "growth": 1}, "jewelcrafting" : {"lvl" : 1, "growth": 1},
                    "whittling" : {"lvl" : 1, "growth": 0.8}, "alchemy" : {"lvl" : 1, "growth": 1.2},
                    "cooking" : {"lvl" : 1, "growth": 1}, "masonry" : {"lvl" : 1, "growth": 1},
                    "trader" : {"lvl" : 1, "growth": 1}, "furnishing" : {"lvl" : 1, "growth": 1},
                    "artisan" : {"lvl" : 1, "growth": 1}, "inscription" : {"lvl" : 1, "growth": 1},
                },
                "abilities" : {
                    "Clash" : {"name" : "Slash"}, "Sight" : {"name" : "Hone"},
                    "Range" : {"name" : "Bleed"}, "Far" : {"name" : "Howl"},
                    "Commander" : {"name" : "Fireball"}, "Profession" : {"name" : "Logging"}, "Passive" : {}
                }
            }
        }

        
        //Tweaking the army
        if("aeiou".includes(interaction.user.username.substring(0, 1).toLowerCase()) ){

                army.undead.info.name = "Z" + interaction.user.username[0].toLowerCase() 
                + interaction.user.username.substring(1);
        }
        else{
            army.undead.info.name = "Z" + interaction.user.username.substring(1);
        }


        //Starting Location
        var randHome = Math.floor(Math.random() * 2);
        
        if(randHome == 0){
            army.elf.info.unlocked = true;
            user.activeParty = ["undead", "wisp", "sprite", "elf"];
            user.hometown = "Vazon";
            user.curLocation = "Vazon";
        }
        else if(randHome == 1){
            army.orc.info.unlocked = true;
            user.activeParty = ["undead", "wisp", "sprite", "orc"];
            user.hometown = "Dracon";
            user.curLocation = "Dracon";
        }


        let userProfile = await new UserStats({
            _id: mongoose.Types.ObjectId(),
            userId: interaction.user.id,
            user: user,
            army: army,
            inventory: {"World Map" : 1},
            battleState: {}
        })
        await userProfile.save();

        await interaction.editReply("Interaction Interupted to Create your account!\nWelcome to the Legion!");
        console.log("Account Created!");
    }
}