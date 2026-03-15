import { useState, useEffect } from “react”;

const DEFAULT_GOALS = { calories:1550, protein:180, carbs:200, fat:70, fiber:38, sugar:50, sodium:2300 };

const PETS = [
{ id:“dog”,     name:“Biscuit”,  color:”#f59e0b”,
stages:[
{ level:1,  form:“Tiny Pup”,        emoji:”\u{1F436}”, desc:“A wobbly little puppy finding its legs.” },
{ level:3,  form:“Playful Pup”,     emoji:”\u{1F415}”, desc:“Energetic and bouncy, tail always wagging.” },
{ level:5,  form:“Young Dog”,       emoji:”\u{1F9AE}”, desc:“Growing fast, strong and loyal.” },
{ level:7,  form:“Guardian Dog”,    emoji:”\u{1F9AE}”, desc:“A powerful trained companion by your side.” },
{ level:10, form:“Legendary Hound”, emoji:”\u{1F43A}”, desc:“A mythic beast feared by all.” },
]},
{ id:“cat”,     name:“Whisper”,  color:”#8b5cf6”,
stages:[
{ level:1,  form:“Tiny Kitten”,   emoji:”\u{1F431}”, desc:“A small fluffy kitten, curious about everything.” },
{ level:3,  form:“Young Cat”,     emoji:”\u{1F408}”, desc:“Quick and clever, always one step ahead.” },
{ level:5,  form:“Sleek Cat”,     emoji:”\u{1F408}\u200D\u2B1B”, desc:“Graceful and precise.” },
{ level:7,  form:“Night Panther”, emoji:”\u{1F406}”, desc:“A powerful predator, silently dominant.” },
{ level:10, form:“Shadow Lord”,   emoji:”\u{1F311}\u{1F408}\u200D\u2B1B”, desc:“Woven from darkness and starlight.” },
]},
{ id:“dragon”,  name:“Ember”,    color:”#ef4444”,
stages:[
{ level:1,  form:“Dragon Egg”,   emoji:”\u{1F95A}”, desc:“A glowing egg pulsing with ancient power.” },
{ level:3,  form:“Baby Serpent”, emoji:”\u{1F40D}”, desc:“A tiny hatchling, still finding its fire.” },
{ level:5,  form:“Young Drake”,  emoji:”\u{1F98E}”, desc:“Wings sprouted. First flames crackle.” },
{ level:7,  form:“Fire Drake”,   emoji:”\u{1F432}”, desc:“A fearsome drake, scorching everything.” },
{ level:10, form:“Mega Dragon”,  emoji:”\u{1F409}”, desc:“A colossal fire-breathing god.” },
]},
{ id:“kraken”,  name:“Inkwell”,  color:”#06b6d4”,
stages:[
{ level:1,  form:“Tiny Squid”,   emoji:”\u{1F991}”, desc:“A small squid barely bigger than your thumb.” },
{ level:3,  form:“Baby Octopus”, emoji:”\u{1F419}”, desc:“Arms growing, already crafty.” },
{ level:5,  form:“Sea Beast”,    emoji:”\u{1F988}”, desc:“Lurks the deep, a growing threat.” },
{ level:7,  form:“Deep Terror”,  emoji:”\u{1F30A}\u{1F991}”, desc:“Massive and terrifying.” },
{ level:10, form:“Kraken Lord”,  emoji:”\u{1F991}”, desc:“The ancient Kraken rises. All seas bow.” },
]},
{ id:“unicorn”, name:“Luna”,     color:”#ec4899”,
stages:[
{ level:1,  form:“Magic Foal”,      emoji:”\u{1F434}”, desc:“A tiny magical foal, horn just showing.” },
{ level:3,  form:“Young Unicorn”,   emoji:”\u{1F984}”, desc:“Horn glowing softly, magic awakening.” },
{ level:5,  form:“Shining Unicorn”, emoji:”\u2728\u{1F984}”, desc:“Radiates light, leaves stardust.” },
{ level:7,  form:“Celestial Steed”, emoji:”\u{1F31F}\u{1F984}”, desc:“Gallops between stars.” },
{ level:10, form:“Divine Unicorn”,  emoji:”\u{1F308}\u{1F984}”, desc:“Rainbows bow to its will.” },
]},
{ id:“koi”,     name:“Ripple”,   color:”#f97316”,
stages:[
{ level:1,  form:“Baby Fish”,     emoji:”\u{1F41F}”, desc:“A tiny goldfish, barely a flicker.” },
{ level:3,  form:“Young Koi”,     emoji:”\u{1F420}”, desc:“Growing fins, showing true colors.” },
{ level:5,  form:“Dragon Koi”,    emoji:”\u{1F421}”, desc:“Shimmering scales. Rare and proud.” },
{ level:7,  form:“River Spirit”,  emoji:”\u{1F30A}\u{1F41F}”, desc:“Revered across all waters.” },
{ level:10, form:“Celestial Koi”, emoji:”\u{1F409}\u{1F41F}”, desc:“Swims through clouds.” },
]},
{ id:“turtle”,  name:“Shell”,    color:”#22c55e”,
stages:[
{ level:1,  form:“Sand Hatchling”, emoji:”\u{1F423}”, desc:“A tiny hatchling crawling to the ocean.” },
{ level:3,  form:“Baby Turtle”,    emoji:”\u{1F422}”, desc:“Shell hardening, paddling with purpose.” },
{ level:5,  form:“Sea Turtle”,     emoji:”\u{1F30A}\u{1F422}”, desc:“Gliding through deep waters.” },
{ level:7,  form:“Ocean Elder”,    emoji:”\u{1F3DD}\u{1F422}”, desc:“Carries ecosystems on its back.” },
{ level:10, form:“Ancient Titan”,  emoji:”\u{26F0}\u{1F422}”, desc:“A living island. Mountains bow.” },
]},
{ id:“phoenix”, name:“Blaze”,    color:”#ff6b35”,
stages:[
{ level:1,  form:“Tiny Ember”,    emoji:”\u{1F525}”, desc:“A flickering flame, barely alive.” },
{ level:3,  form:“Fire Chick”,    emoji:”\u{1F425}”, desc:“Feathers of flame, learning to fly.” },
{ level:5,  form:“Young Phoenix”, emoji:”\u{1F985}”, desc:“Soaring high, leaving fire trails.” },
{ level:7,  form:“Fire Phoenix”,  emoji:”\u{1F99C}”, desc:“Reborn from ash, stronger than before.” },
{ level:10, form:“Eternal Phoenix”,emoji:”\u{1F31F}\u{1F985}”, desc:“Immortal and blazing.” },
]},
{ id:“wolf”,    name:“Frost”,    color:”#94a3b8”,
stages:[
{ level:1,  form:“Wolf Pup”,    emoji:”\u{1F43A}”, desc:“A small pup with ice-blue eyes.” },
{ level:3,  form:“Young Wolf”,  emoji:”\u{1F43A}”, desc:“Running with the pack, learning.” },
{ level:5,  form:“Ice Wolf”,    emoji:”\u2744\u{1F43A}”, desc:“Howls that freeze rivers mid-flow.” },
{ level:7,  form:“Alpha Wolf”,  emoji:”\u{1F315}\u{1F43A}”, desc:“Leads the pack under the full moon.” },
{ level:10, form:“Dire Wolf”,   emoji:”\u26A1\u{1F43A}”, desc:“A mythic beast from the age of gods.” },
]},
{ id:“bear”,    name:“Bulk”,     color:”#78716c”,
stages:[
{ level:1,  form:“Tiny Cub”,   emoji:”\u{1F43B}”, desc:“A fluffy little cub, just waking up.” },
{ level:3,  form:“Young Bear”, emoji:”\u{1F43B}”, desc:“Growing strong, loving snacks.” },
{ level:5,  form:“Grizzly”,    emoji:”\u{1F43B}\u200D\u2744\uFE0F”, desc:“Massive and powerful.” },
{ level:7,  form:“War Bear”,   emoji:”\u{1F9AC}”, desc:“A battle-scarred behemoth.” },
{ level:10, form:“Titan Bear”, emoji:”\u26F0\u{1F43B}”, desc:“A living mountain. Earthquakes fear it.” },
]},
];

const PET_LEVELS = [
{ level:1,  name:“Newborn”,  xpReq:0,    mod:”” },
{ level:2,  name:“Baby”,     xpReq:100,  mod:”” },
{ level:3,  name:“Young”,    xpReq:250,  mod:”” },
{ level:4,  name:“Growing”,  xpReq:500,  mod:”” },
{ level:5,  name:“Evolved”,  xpReq:900,  mod:”” },
{ level:6,  name:“Strong”,   xpReq:1400, mod:”” },
{ level:7,  name:“Powerful”, xpReq:2100, mod:”” },
{ level:8,  name:“Champion”, xpReq:3000, mod:”” },
{ level:9,  name:“Legend”,   xpReq:4200, mod:”” },
{ level:10, name:“GOD MODE”, xpReq:6000, mod:”” },
];

function getLvl(xp) {
let cur = PET_LEVELS[0];
for (var i = 0; i < PET_LEVELS.length; i++) {
if (xp >= PET_LEVELS[i].xpReq) cur = PET_LEVELS[i]; else break;
}
var nxt = null;
for (var j = 0; j < PET_LEVELS.length; j++) {
if (PET_LEVELS[j].xpReq > xp) { nxt = PET_LEVELS[j]; break; }
}
var prog = nxt ? ((xp - cur.xpReq) / (nxt.xpReq - cur.xpReq)) * 100 : 100;
return Object.assign({}, cur, { nxt: nxt, prog: prog, xp: xp });
}
function getStage(pet, lvl) {
if (!pet) return null;
var s = pet.stages[0];
for (var i = 0; i < pet.stages.length; i++) {
if (lvl >= pet.stages[i].level) s = pet.stages[i]; else break;
}
return s;
}

const THEMES = [
{ id:“obsidian”, label:“Obsidian”,  bg:”#030712”, card:”#0a0f1a”, card2:”#0f172a”, border:”#1e293b”, text:”#f1f5f9”, sub:”#94a3b8”, faint:”#475569”, accent:”#34d399” },
{ id:“midnight”, label:“Midnight”,  bg:”#0d0d20”, card:”#14142e”, card2:”#1a1a3d”, border:”#2d2d60”, text:”#e8e8ff”, sub:”#9090c0”, faint:”#4a4a80”, accent:”#818cf8” },
{ id:“forest”,   label:“Forest”,    bg:”#041a08”, card:”#081f0c”, card2:”#0d2a12”, border:”#1a4a22”, text:”#e0f5e5”, sub:”#80b890”, faint:”#3a6a45”, accent:”#4ade80” },
{ id:“navy”,     label:“Navy”,      bg:”#030a1a”, card:”#071428”, card2:”#0a1c38”, border:”#1a3560”, text:”#ddeeff”, sub:”#7aaad0”, faint:”#2a5080”, accent:”#60a5fa” },
{ id:“crimson”,  label:“Crimson”,   bg:”#1a0208”, card:”#22040c”, card2:”#2c0610”, border:”#5a1022”, text:”#ffe0e8”, sub:”#c07080”, faint:”#7a2030”, accent:”#fb7185” },
{ id:“storm”,    label:“Storm”,     bg:”#081018”, card:”#0f1a24”, card2:”#16222e”, border:”#2a4055”, text:”#d8eaf8”, sub:”#7aaac8”, faint:”#2a5070”, accent:”#38bdf8” },
{ id:“grape”,    label:“Grape”,     bg:”#120820”, card:”#1a0c2e”, card2:”#22103c”, border:”#3d1f6e”, text:”#eeddff”, sub:”#a87ed0”, faint:”#5a3080”, accent:”#c084fc” },
{ id:“espresso”, label:“Espresso”,  bg:”#1a0f05”, card:”#241508”, card2:”#2e1c0c”, border:”#5a3018”, text:”#f5e8d8”, sub:”#c0956a”, faint:”#7a5030”, accent:”#fb923c” },
{ id:“cherry”,   label:“Cherry”,    bg:”#1a0008”, card:”#2d0010”, card2:”#3d0018”, border:”#6b001f”, text:”#ffe0eb”, sub:”#ff7aaa”, faint:”#4a0014”, accent:”#ff3d6e” },
{ id:“arctic”,   label:“Arctic”,    bg:”#0a1628”, card:”#0d1f3c”, card2:”#102850”, border:”#1e4080”, text:”#e8f4ff”, sub:”#90bfff”, faint:”#2a5090”, accent:”#38bdf8” },
{ id:“void”,     label:“Void”,      bg:”#000000”, card:”#0a0a0a”, card2:”#141414”, border:”#222222”, text:”#ffffff”, sub:”#888888”, faint:”#333333”, accent:”#ffffff” },
{ id:“gold”,     label:“Gold”,      bg:”#1a1200”, card:”#2a1d00”, card2:”#3a2800”, border:”#7a5a00”, text:”#fff7cc”, sub:”#d4aa00”, faint:”#5a4000”, accent:”#fbbf24” },
{ id:“neon”,     label:“Neon”,      bg:”#000814”, card:”#001020”, card2:”#001830”, border:”#003060”, text:”#00ffff”, sub:”#00cccc”, faint:”#005555”, accent:”#00ffff” },
{ id:“snow”,     label:“Snow”,      bg:”#e8edf5”, card:”#f8fafc”, card2:”#dde3ef”, border:”#b0bdd0”, text:”#0f172a”, sub:”#3a4a60”, faint:”#6b7a90”, accent:”#34d399” },
{ id:“cream”,    label:“Cream”,     bg:”#f0e6c8”, card:”#faf0d8”, card2:”#e4d0a0”, border:”#c8a86a”, text:”#2c1a06”, sub:”#6b4010”, faint:”#9a6830”, accent:”#d97706” },
{ id:“blush”,    label:“Blush”,     bg:”#fce4ec”, card:”#fbb6ca”, card2:”#f48fb1”, border:”#e06090”, text:”#3b0018”, sub:”#880040”, faint:”#c0406a”, accent:”#f43f5e” },
{ id:“sky”,      label:“Sky”,       bg:”#dbeafe”, card:”#bfdbfe”, card2:”#93c5fd”, border:”#3b82f6”, text:”#072060”, sub:”#1d4ed8”, faint:”#3b82f6”, accent:”#2563eb” },
{ id:“sage”,     label:“Sage”,      bg:”#dcfce7”, card:”#bbf7d0”, card2:”#86efac”, border:”#22c55e”, text:”#052e16”, sub:”#15803d”, faint:”#16a34a”, accent:”#16a34a” },
{ id:“lavender”, label:“Lavender”,  bg:”#ede9fe”, card:”#ddd6fe”, card2:”#c4b5fd”, border:”#7c3aed”, text:”#1e0050”, sub:”#5b21b6”, faint:”#7c3aed”, accent:”#7c3aed” },
{ id:“peach”,    label:“Peach”,     bg:”#fff7ed”, card:”#fed7aa”, card2:”#fdba74”, border:”#ea580c”, text:”#3a0e00”, sub:”#9a3412”, faint:”#c2410c”, accent:”#ea580c” },
{ id:“ocean”,    label:“Ocean”,     bg:”#0077b6”, card:”#0096c7”, card2:”#00b4d8”, border:”#48cae4”, text:”#ffffff”, sub:”#caf0f8”, faint:”#90e0ef”, accent:”#48cae4” },
{ id:“emerald”,  label:“Emerald”,   bg:”#065f46”, card:”#047857”, card2:”#059669”, border:”#34d399”, text:”#ffffff”, sub:”#a7f3d0”, faint:”#6ee7b7”, accent:”#34d399” },
{ id:“royal”,    label:“Royal”,     bg:”#3730a3”, card:”#4338ca”, card2:”#4f46e5”, border:”#818cf8”, text:”#ffffff”, sub:”#c7d2fe”, faint:”#a5b4fc”, accent:”#a5b4fc” },
{ id:“rose”,     label:“Rose”,      bg:”#9f1239”, card:”#be123c”, card2:”#e11d48”, border:”#fb7185”, text:”#ffffff”, sub:”#fecdd3”, faint:”#fda4af”, accent:”#fda4af” },
{ id:“amber”,    label:“Amber”,     bg:”#92400e”, card:”#b45309”, card2:”#d97706”, border:”#fbbf24”, text:”#ffffff”, sub:”#fde68a”, faint:”#fcd34d”, accent:”#fbbf24” },
{ id:“teal”,     label:“Teal”,      bg:”#134e4a”, card:”#115e59”, card2:”#0f766e”, border:”#2dd4bf”, text:”#ffffff”, sub:”#99f6e4”, faint:”#5eead4”, accent:”#2dd4bf” },
{ id:“sunset”,   label:“Sunset”,    bg:”#c2410c”, card:”#ea580c”, card2:”#f97316”, border:”#fdba74”, text:”#ffffff”, sub:”#fed7aa”, faint:”#fdba74”, accent:”#fdba74” },
];

const FOODS = [
{ label:“Eggs & Dairy”, emoji:”\u{1F95A}”, items:[
{ name:“Egg (whole, large)”,          emoji:”\u{1F95A}”, calories:72,  protein:6,   carbs:0.4, fat:5,   fiber:0, sugar:0.4, sodium:71  },
{ name:“Egg White (large)”,           emoji:”\u{1F95A}”, calories:17,  protein:3.6, carbs:0.2, fat:0.1, fiber:0, sugar:0.2, sodium:55  },
{ name:“Egg (2 whole)”,               emoji:”\u{1F95A}”, calories:143, protein:12,  carbs:0.7, fat:10,  fiber:0, sugar:0.7, sodium:142 },
{ name:“Greek Yogurt nonfat 1 cup”,   emoji:”\u{1FAD9}”, calories:100, protein:17,  carbs:6,   fat:0,   fiber:0, sugar:6,   sodium:65  },
{ name:“Greek Yogurt 2pct 1 cup”,     emoji:”\u{1FAD9}”, calories:150, protein:17,  carbs:8,   fat:4,   fiber:0, sugar:7,   sodium:65  },
{ name:“Cottage Cheese 1/2 cup”,      emoji:”\u{1FAD9}”, calories:90,  protein:12,  carbs:5,   fat:2.5, fiber:0, sugar:4,   sodium:360 },
{ name:“Milk 2pct 1 cup”,             emoji:”\u{1F95B}”, calories:122, protein:8,   carbs:12,  fat:5,   fiber:0, sugar:12,  sodium:115 },
{ name:“Cheddar Cheese 1oz”,          emoji:”\u{1F9C0}”, calories:115, protein:7,   carbs:0.4, fat:9,   fiber:0, sugar:0.1, sodium:185 },
{ name:“String Cheese 1 stick”,       emoji:”\u{1F9C0}”, calories:80,  protein:7,   carbs:1,   fat:5,   fiber:0, sugar:0,   sodium:200 },
]},
{ label:“Chicken & Turkey”, emoji:”\u{1F357}”, items:[
{ name:“Chicken Breast 2oz”,  emoji:”\u{1F357}”, calories:92,  protein:17, carbs:0, fat:2,  fiber:0, sugar:0, sodium:37  },
{ name:“Chicken Breast 3oz”,  emoji:”\u{1F357}”, calories:139, protein:26, carbs:0, fat:3,  fiber:0, sugar:0, sodium:56  },
{ name:“Chicken Breast 4oz”,  emoji:”\u{1F357}”, calories:185, protein:35, carbs:0, fat:4,  fiber:0, sugar:0, sodium:75  },
{ name:“Chicken Breast 5oz”,  emoji:”\u{1F357}”, calories:231, protein:43, carbs:0, fat:5,  fiber:0, sugar:0, sodium:94  },
{ name:“Chicken Breast 6oz”,  emoji:”\u{1F357}”, calories:278, protein:52, carbs:0, fat:6,  fiber:0, sugar:0, sodium:112 },
{ name:“Chicken Breast 8oz”,  emoji:”\u{1F357}”, calories:370, protein:69, carbs:0, fat:8,  fiber:0, sugar:0, sodium:150 },
{ name:“Chicken Breast 10oz”, emoji:”\u{1F357}”, calories:463, protein:87, carbs:0, fat:10, fiber:0, sugar:0, sodium:188 },
{ name:“Chicken Thigh 4oz”,   emoji:”\u{1F357}”, calories:209, protein:28, carbs:0, fat:10, fiber:0, sugar:0, sodium:95  },
{ name:“Chicken Thigh 6oz”,   emoji:”\u{1F357}”, calories:314, protein:42, carbs:0, fat:15, fiber:0, sugar:0, sodium:143 },
{ name:“Ground Turkey 4oz”,   emoji:”\u{1F983}”, calories:170, protein:22, carbs:0, fat:9,  fiber:0, sugar:0, sodium:75  },
{ name:“Ground Turkey 6oz”,   emoji:”\u{1F983}”, calories:255, protein:33, carbs:0, fat:13, fiber:0, sugar:0, sodium:113 },
{ name:“Turkey Breast deli 3oz”,emoji:”\u{1F983}”, calories:90,protein:18, carbs:1, fat:1,  fiber:0, sugar:0, sodium:570 },
]},
{ label:“Beef & Pork”, emoji:”\u{1F969}”, items:[
{ name:“Ground Beef 90pct 4oz”, emoji:”\u{1F969}”, calories:196, protein:24, carbs:0, fat:11, fiber:0, sugar:0, sodium:75  },
{ name:“Ground Beef 90pct 6oz”, emoji:”\u{1F969}”, calories:294, protein:36, carbs:0, fat:16, fiber:0, sugar:0, sodium:113 },
{ name:“Ground Beef 90pct 8oz”, emoji:”\u{1F969}”, calories:392, protein:48, carbs:0, fat:22, fiber:0, sugar:0, sodium:150 },
{ name:“Sirloin Steak 4oz”,     emoji:”\u{1F969}”, calories:213, protein:31, carbs:0, fat:9,  fiber:0, sugar:0, sodium:60  },
{ name:“Sirloin Steak 6oz”,     emoji:”\u{1F969}”, calories:320, protein:46, carbs:0, fat:14, fiber:0, sugar:0, sodium:90  },
{ name:“Bacon 2 strips”,        emoji:”\u{1F953}”, calories:86,  protein:6,  carbs:0.1, fat:7,  fiber:0, sugar:0, sodium:368 },
{ name:“Bacon 4 strips”,        emoji:”\u{1F953}”, calories:172, protein:12, carbs:0.2, fat:14, fiber:0, sugar:0, sodium:736 },
{ name:“Pork Tenderloin 4oz”,   emoji:”\u{1F969}”, calories:140, protein:24, carbs:0,   fat:4,  fiber:0, sugar:0, sodium:60  },
]},
{ label:“Fish & Seafood”, emoji:”\u{1F41F}”, items:[
{ name:“Salmon 4oz”,    emoji:”\u{1F41F}”, calories:234, protein:31, carbs:0, fat:12,  fiber:0, sugar:0, sodium:64  },
{ name:“Salmon 6oz”,    emoji:”\u{1F41F}”, calories:351, protein:47, carbs:0, fat:18,  fiber:0, sugar:0, sodium:96  },
{ name:“Salmon 8oz”,    emoji:”\u{1F41F}”, calories:468, protein:62, carbs:0, fat:24,  fiber:0, sugar:0, sodium:128 },
{ name:“Tuna can water”,emoji:”\u{1F41F}”, calories:109, protein:25, carbs:0, fat:1,   fiber:0, sugar:0, sodium:303 },
{ name:“Shrimp 4oz”,    emoji:”\u{1F990}”, calories:112, protein:24, carbs:0, fat:1.5, fiber:0, sugar:0, sodium:190 },
{ name:“Shrimp 6oz”,    emoji:”\u{1F990}”, calories:168, protein:36, carbs:0, fat:2,   fiber:0, sugar:0, sodium:285 },
{ name:“Tilapia 4oz”,   emoji:”\u{1F41F}”, calories:145, protein:30, carbs:0, fat:2.5, fiber:0, sugar:0, sodium:75  },
{ name:“Cod 4oz”,       emoji:”\u{1F41F}”, calories:96,  protein:21, carbs:0, fat:0.8, fiber:0, sugar:0, sodium:62  },
]},
{ label:“Grains & Carbs”, emoji:”\u{1F35A}”, items:[
{ name:“White Rice 1/2 cup”,  emoji:”\u{1F35A}”, calories:103, protein:2, carbs:22, fat:0.2, fiber:0.3, sugar:0, sodium:1 },
{ name:“White Rice 1 cup”,    emoji:”\u{1F35A}”, calories:206, protein:4, carbs:45, fat:0.4, fiber:0.6, sugar:0, sodium:2 },
{ name:“White Rice 1.5 cups”, emoji:”\u{1F35A}”, calories:309, protein:6, carbs:67, fat:0.6, fiber:0.9, sugar:0, sodium:3 },
{ name:“Brown Rice 1 cup”,    emoji:”\u{1F35A}”, calories:216, protein:5, carbs:45, fat:1.8, fiber:3.5, sugar:0, sodium:10 },
{ name:“Quinoa 1 cup”,        emoji:”\u{1F33E}”, calories:222, protein:8, carbs:39, fat:4,   fiber:5,   sugar:1.6,sodium:13 },
{ name:“Oatmeal 1 cup”,       emoji:”\u{1F963}”, calories:158, protein:6, carbs:27, fat:3,   fiber:4,   sugar:0, sodium:115 },
{ name:“Sweet Potato small”,  emoji:”\u{1F360}”, calories:60,  protein:1, carbs:14, fat:0,   fiber:2,   sugar:4, sodium:24 },
{ name:“Sweet Potato medium”, emoji:”\u{1F360}”, calories:103, protein:2, carbs:24, fat:0.1, fiber:3.8, sugar:7, sodium:41 },
{ name:“Sweet Potato large”,  emoji:”\u{1F360}”, calories:162, protein:3, carbs:37, fat:0.2, fiber:5.9, sugar:12,sodium:65 },
{ name:“Bread WW 1 slice”,    emoji:”\u{1F35E}”, calories:81,  protein:4, carbs:14, fat:1,   fiber:1.9, sugar:1.4,sodium:147 },
{ name:“Bagel plain”,         emoji:”\u{1F96F}”, calories:270, protein:11,carbs:53, fat:1.5, fiber:2,   sugar:6, sodium:430 },
{ name:“Pasta 1 cup cooked”,  emoji:”\u{1F35D}”, calories:220, protein:8, carbs:43, fat:1.3, fiber:2.5, sugar:0.6,sodium:1 },
{ name:“Tortilla large flour”,emoji:”\u{1FAD3}”, calories:218, protein:6, carbs:36, fat:5,   fiber:2,   sugar:1, sodium:440 },
{ name:“Carb Balance Tortilla”,emoji:”\u{1FAD3}”,calories:110, protein:5, carbs:22, fat:3,   fiber:11,  sugar:0, sodium:380 },
{ name:“Rice Cakes 2”,        emoji:”\u{1F358}”, calories:70,  protein:1, carbs:15, fat:0.5, fiber:0.3, sugar:0, sodium:58 },
]},
{ label:“Vegetables”, emoji:”\u{1F966}”, items:[
{ name:“Broccoli 1 cup”,     emoji:”\u{1F966}”, calories:55,  protein:4,   carbs:11, fat:0.6, fiber:5,   sugar:2,   sodium:64  },
{ name:“Broccoli 2 cups”,    emoji:”\u{1F966}”, calories:110, protein:8,   carbs:22, fat:1.2, fiber:10,  sugar:4,   sodium:128 },
{ name:“Spinach 2 cups”,     emoji:”\u{1F96C}”, calories:14,  protein:1.7, carbs:2,  fat:0.2, fiber:1.3, sugar:0.2, sodium:48  },
{ name:“Mixed Greens 2 cups”,emoji:”\u{1F957}”, calories:18,  protein:1.5, carbs:3,  fat:0.2, fiber:1.5, sugar:1,   sodium:35  },
{ name:“Avocado 1/2”,        emoji:”\u{1F951}”, calories:120, protein:1.5, carbs:6,  fat:11,  fiber:5,   sugar:0.5, sodium:5   },
{ name:“Bell Pepper 1 med”,  emoji:”\u{1FAD1}”, calories:31,  protein:1,   carbs:7,  fat:0.3, fiber:2.5, sugar:3.7, sodium:4   },
{ name:“Asparagus 6 spears”, emoji:”\u{1F33F}”, calories:20,  protein:2,   carbs:3,  fat:0.2, fiber:2,   sugar:1,   sodium:13  },
{ name:“Green Beans 1 cup”,  emoji:”\u{1FAD8}”, calories:44,  protein:2,   carbs:10, fat:0.4, fiber:4,   sugar:5,   sodium:1   },
{ name:“Tomato 1 med”,       emoji:”\u{1F345}”, calories:22,  protein:1.1, carbs:4.8,fat:0.2, fiber:1.5, sugar:3.2, sodium:6   },
{ name:“Mushrooms 1 cup”,    emoji:”\u{1F344}”, calories:21,  protein:3,   carbs:3,  fat:0.3, fiber:1,   sugar:2,   sodium:4   },
{ name:“Carrots 1 cup”,      emoji:”\u{1F955}”, calories:52,  protein:1.2, carbs:12, fat:0.3, fiber:3.6, sugar:6,   sodium:88  },
{ name:“Corn 1 ear”,         emoji:”\u{1F33D}”, calories:132, protein:4.9, carbs:29, fat:1.8, fiber:3.6, sugar:9,   sodium:21  },
{ name:“Edamame 1/2 cup”,    emoji:”\u{1FAD8}”, calories:94,  protein:9,   carbs:8,  fat:4,   fiber:4,   sugar:2,   sodium:9   },
]},
{ label:“Fruits”, emoji:”\u{1F34E}”, items:[
{ name:“Banana medium”,        emoji:”\u{1F34C}”, calories:105, protein:1.3, carbs:27, fat:0.4, fiber:3.1, sugar:14, sodium:1 },
{ name:“Apple medium”,         emoji:”\u{1F34E}”, calories:95,  protein:0.5, carbs:25, fat:0.3, fiber:4.4, sugar:19, sodium:2 },
{ name:“Strawberries 1 cup”,   emoji:”\u{1F353}”, calories:49,  protein:1,   carbs:12, fat:0.5, fiber:3,   sugar:7,  sodium:2 },
{ name:“Blueberries 1 cup”,    emoji:”\u{1FAD0}”, calories:84,  protein:1.1, carbs:21, fat:0.5, fiber:3.6, sugar:15, sodium:1 },
{ name:“Orange medium”,        emoji:”\u{1F34A}”, calories:62,  protein:1.2, carbs:15, fat:0.2, fiber:3.1, sugar:12, sodium:0 },
{ name:“Mango 1 cup”,          emoji:”\u{1F96D}”, calories:99,  protein:1.4, carbs:25, fat:0.6, fiber:2.6, sugar:23, sodium:2 },
{ name:“Raspberries 1 cup”,    emoji:”\u{1FAD0}”, calories:64,  protein:1.5, carbs:15, fat:0.8, fiber:8,   sugar:5,  sodium:1 },
{ name:“Watermelon 2 cups”,    emoji:”\u{1F349}”, calories:86,  protein:1.7, carbs:22, fat:0.4, fiber:1.1, sugar:18, sodium:4 },
]},
{ label:“Nuts & Seeds”, emoji:”\u{1F330}”, items:[
{ name:“Almonds 1oz”,         emoji:”\u{1F330}”, calories:164, protein:6,   carbs:6,  fat:14,  fiber:3.5, sugar:1.2, sodium:0   },
{ name:“Walnuts 1oz”,         emoji:”\u{1F330}”, calories:185, protein:4.3, carbs:4,  fat:18,  fiber:1.9, sugar:0.7, sodium:1   },
{ name:“Peanut Butter 1 tbsp”,emoji:”\u{1F95C}”, calories:94,  protein:4,   carbs:3,  fat:8,   fiber:1,   sugar:1.5, sodium:76  },
{ name:“Peanut Butter 2 tbsp”,emoji:”\u{1F95C}”, calories:188, protein:8,   carbs:6,  fat:16,  fiber:2,   sugar:3,   sodium:152 },
{ name:“Almond Butter 2 tbsp”,emoji:”\u{1F330}”, calories:196, protein:7,   carbs:6,  fat:18,  fiber:3.3, sugar:1.7, sodium:72  },
{ name:“Chia Seeds 2 tbsp”,   emoji:”\u{1F331}”, calories:138, protein:4.7, carbs:12, fat:8.7, fiber:9.8, sugar:0,   sodium:5   },
{ name:“Mixed Nuts 1oz”,      emoji:”\u{1F330}”, calories:173, protein:5,   carbs:6,  fat:16,  fiber:2,   sugar:1.3, sodium:110 },
]},
{ label:“Protein Bars & Shakes”, emoji:”\u{1F4AA}”, items:[
{ name:“Quest Bar avg”,            emoji:”\u{1F4AA}”, calories:200, protein:21, carbs:22, fat:8,   fiber:14, sugar:1,  sodium:250 },
{ name:“RXBar avg”,                emoji:”\u{1F4AA}”, calories:210, protein:12, carbs:24, fat:9,   fiber:5,  sugar:13, sodium:260 },
{ name:“ONE Bar avg”,              emoji:”\u{1F4AA}”, calories:220, protein:20, carbs:23, fat:7,   fiber:10, sugar:1,  sodium:220 },
{ name:“Barebells Protein Bar”,    emoji:”\u{1F4AA}”, calories:200, protein:20, carbs:20, fat:7,   fiber:6,  sugar:2,  sodium:150 },
{ name:“Premier Protein Shake”,    emoji:”\u{1F964}”, calories:160, protein:30, carbs:6,  fat:3,   fiber:1,  sugar:1,  sodium:390 },
{ name:“Fairlife Core Power”,      emoji:”\u{1F964}”, calories:230, protein:42, carbs:13, fat:3.5, fiber:0,  sugar:11, sodium:280 },
{ name:“Protein Shake 1 scoop”,    emoji:”\u{1F964}”, calories:120, protein:25, carbs:5,  fat:2,   fiber:1,  sugar:2,  sodium:150 },
{ name:“Isopure Zero Carb 1 scoop”,emoji:”\u{1F964}”, calories:110, protein:25, carbs:0,  fat:0.5, fiber:0,  sugar:0,  sodium:140 },
]},
{ label:“Breakfast”, emoji:”\u{1F9C7}”, items:[
{ name:“Pancakes 3 med”,     emoji:”\u{1F9C7}”, calories:345, protein:9,  carbs:57, fat:10,  fiber:1.5, sugar:8,  sodium:730 },
{ name:“Waffle 1 large”,     emoji:”\u{1F9C7}”, calories:220, protein:6,  carbs:25, fat:11,  fiber:1,   sugar:4,  sodium:380 },
{ name:“Cheerios 1 cup”,     emoji:”\u{1F963}”, calories:100, protein:3,  carbs:20, fat:2,   fiber:3,   sugar:1,  sodium:140 },
{ name:“Granola 1/2 cup”,    emoji:”\u{1F963}”, calories:209, protein:5,  carbs:36, fat:6,   fiber:3,   sugar:12, sodium:14  },
{ name:“Pop-Tart 1”,         emoji:”\u{1F370}”, calories:200, protein:2,  carbs:37, fat:5,   fiber:0.5, sugar:16, sodium:170 },
{ name:“Bagel plus Cream Cheese”,emoji:”\u{1F96F}”, calories:369, protein:13, carbs:54, fat:12, fiber:2, sugar:7, sodium:520 },
]},
{ label:“Fast Food”, emoji:”\u{1F354}”, items:[
{ name:“McDouble”,                  emoji:”\u{1F354}”, calories:400, protein:22, carbs:33, fat:20, fiber:2,  sugar:7,  sodium:840  },
{ name:“Big Mac”,                   emoji:”\u{1F354}”, calories:550, protein:25, carbs:46, fat:30, fiber:3,  sugar:9,  sodium:1010 },
{ name:“McD Fries Medium”,          emoji:”\u{1F35F}”, calories:320, protein:4,  carbs:44, fat:15, fiber:3,  sugar:0,  sodium:400  },
{ name:“Chick-fil-A Sandwich”,      emoji:”\u{1F354}”, calories:440, protein:28, carbs:40, fat:19, fiber:1,  sugar:5,  sodium:1350 },
{ name:“Chick-fil-A Nuggets 8pc”,   emoji:”\u{1F357}”, calories:260, protein:26, carbs:11, fat:12, fiber:0,  sugar:1,  sodium:1010 },
{ name:“Chipotle Chicken Bowl”,     emoji:”\u{1F959}”, calories:655, protein:51, carbs:62, fat:21, fiber:11, sugar:5,  sodium:1810 },
{ name:“Subway 6in Turkey”,         emoji:”\u{1F956}”, calories:280, protein:18, carbs:46, fat:3.5,fiber:4,  sugar:7,  sodium:760  },
{ name:“Taco Bell Crunchy Taco”,    emoji:”\u{1F32E}”, calories:170, protein:8,  carbs:13, fat:9,  fiber:3,  sugar:1,  sodium:310  },
{ name:“Raising Cane Chicken Fngr”, emoji:”\u{1F357}”, calories:145, protein:13, carbs:8,  fat:6,  fiber:0,  sugar:0,  sodium:360  },
{ name:“Panda Orange Chicken”,      emoji:”\u{1F34A}”, calories:490, protein:26, carbs:67, fat:14, fiber:2,  sugar:35, sodium:820  },
]},
{ label:“Pizza & Snacks”, emoji:”\u{1F355}”, items:[
{ name:“Pizza Cheese 1 slice”,   emoji:”\u{1F355}”, calories:285, protein:12, carbs:36, fat:10, fiber:2,   sugar:3,   sodium:640 },
{ name:“Pizza Pepperoni 1 slice”,emoji:”\u{1F355}”, calories:313, protein:14, carbs:34, fat:13, fiber:2,   sugar:3,   sodium:760 },
{ name:“Popcorn air 3 cups”,     emoji:”\u{1F37F}”, calories:93,  protein:3,  carbs:19, fat:1,  fiber:3.6, sugar:0.2, sodium:2   },
{ name:“Chips potato 1oz”,       emoji:”\u{1F954}”, calories:152, protein:2,  carbs:15, fat:10, fiber:1,   sugar:0.1, sodium:148 },
{ name:“Beef Jerky 1oz”,         emoji:”\u{1F969}”, calories:116, protein:9.4,carbs:3.1,fat:7.3,fiber:0.5, sugar:2.6, sodium:506 },
{ name:“Cheese Stick 1”,         emoji:”\u{1F9C0}”, calories:80,  protein:7,  carbs:1,  fat:5,  fiber:0,   sugar:0,   sodium:200 },
{ name:“Trail Mix 1/4 cup”,      emoji:”\u{1F330}”, calories:173, protein:5,  carbs:17, fat:11, fiber:2,   sugar:8,   sodium:72  },
]},
{ label:“Sweets & Drinks”, emoji:”\u{2615}”, items:[
{ name:“Dark Chocolate 1oz”, emoji:”\u{1F36B}”, calories:170, protein:2,   carbs:13, fat:12, fiber:3,  sugar:7,  sodium:5   },
{ name:“Ice Cream 1/2 cup”,  emoji:”\u{1F366}”, calories:207, protein:3.5, carbs:24, fat:11, fiber:0.7,sugar:21, sodium:80  },
{ name:“Cookie choc chip 1”, emoji:”\u{1F36A}”, calories:148, protein:2,   carbs:19, fat:7,  fiber:1,  sugar:10, sodium:109 },
{ name:“Donut glazed”,       emoji:”\u{1F369}”, calories:269, protein:3,   carbs:31, fat:15, fiber:1,  sugar:14, sodium:319 },
{ name:“Gatorade 20oz”,      emoji:”\u{1F964}”, calories:140, protein:0,   carbs:36, fat:0,  fiber:0,  sugar:34, sodium:270 },
{ name:“Coffee black 8oz”,   emoji:”\u2615”,    calories:5,   protein:0.3, carbs:0.7,fat:0.1,fiber:0,  sugar:0,  sodium:5   },
{ name:“Latte 16oz 2pct”,    emoji:”\u2615”,    calories:190, protein:13,  carbs:19, fat:7,  fiber:0,  sugar:17, sodium:150 },
{ name:“Beer regular 12oz”,  emoji:”\u{1F37A}”, calories:153, protein:1.6, carbs:13, fat:0,  fiber:0,  sugar:0,  sodium:14  },
]},
{ label:“Legumes & Tofu”, emoji:”\u{1FAD8}”, items:[
{ name:“Black Beans 1/2 cup”,emoji:”\u{1FAD8}”, calories:114, protein:7.6, carbs:20, fat:0.5, fiber:7.5, sugar:0.3, sodium:1  },
{ name:“Black Beans 1 cup”,  emoji:”\u{1FAD8}”, calories:228, protein:15,  carbs:40, fat:1,   fiber:15,  sugar:0.6, sodium:2  },
{ name:“Chickpeas 1/2 cup”,  emoji:”\u{1FAD8}”, calories:134, protein:7,   carbs:22, fat:2.1, fiber:6,   sugar:3.9, sodium:5  },
{ name:“Lentils 1/2 cup”,    emoji:”\u{1FAD8}”, calories:115, protein:9,   carbs:20, fat:0.4, fiber:7.8, sugar:1.8, sodium:2  },
{ name:“Tofu firm 4oz”,      emoji:”\u{1FAD8}”, calories:94,  protein:10,  carbs:2.3,fat:5,   fiber:0.3, sugar:0.5, sodium:94 },
{ name:“Tempeh 4oz”,         emoji:”\u{1FAD8}”, calories:222, protein:21,  carbs:11, fat:12,  fiber:7.3, sugar:0,   sodium:9  },
]},
{ label:“Sauces & Condiments”, emoji:”\u{1FAD9}”, items:[
{ name:“Olive Oil 1 tbsp”,  emoji:”\u{1FAD2}”, calories:119, protein:0,   carbs:0,   fat:13.5, fiber:0,  sugar:0,   sodium:0   },
{ name:“Olive Oil 2 tbsp”,  emoji:”\u{1FAD2}”, calories:238, protein:0,   carbs:0,   fat:27,   fiber:0,  sugar:0,   sodium:0   },
{ name:“Butter 1 tbsp”,     emoji:”\u{1F9C8}”, calories:102, protein:0.1, carbs:0,   fat:11.5, fiber:0,  sugar:0,   sodium:82  },
{ name:“Ketchup 1 tbsp”,    emoji:”\u{1F345}”, calories:17,  protein:0.2, carbs:4.6, fat:0,    fiber:0,  sugar:3.7, sodium:154 },
{ name:“Hot Sauce 1 tsp”,   emoji:”\u{1F336}”, calories:0,   protein:0,   carbs:0.1, fat:0,    fiber:0,  sugar:0,   sodium:124 },
{ name:“Soy Sauce 1 tbsp”,  emoji:”\u{1FAD9}”, calories:11,  protein:1.3, carbs:1,   fat:0,    fiber:0,  sugar:0,   sodium:879 },
{ name:“BBQ Sauce 2 tbsp”,  emoji:”\u{1FAD9}”, calories:58,  protein:0.5, carbs:14,  fat:0.1,  fiber:0,  sugar:11,  sodium:340 },
{ name:“Ranch 2 tbsp”,      emoji:”\u{1F95B}”, calories:73,  protein:0.4, carbs:1.4, fat:7.7,  fiber:0,  sugar:1,   sodium:122 },
{ name:“Honey 1 tbsp”,      emoji:”\u{1F36F}”, calories:64,  protein:0.1, carbs:17,  fat:0,    fiber:0,  sugar:17,  sodium:0   },
{ name:“Sriracha 1 tsp”,    emoji:”\u{1F336}”, calories:5,   protein:0.1, carbs:1,   fat:0.1,  fiber:0,  sugar:0.7, sodium:80  },
{ name:“Salsa 2 tbsp”,      emoji:”\u{1F345}”, calories:10,  protein:0.5, carbs:2,   fat:0,    fiber:0.5,sugar:1,   sodium:230 },
{ name:“Guacamole 2 tbsp”,  emoji:”\u{1F951}”, calories:45,  protein:0.5, carbs:2.5, fat:4,    fiber:1.5,sugar:0,   sodium:115 },
]},
];

function sn(v){var x=parseFloat(v);return isNaN(x)?0:x;}
function r1(x){return Math.round(sn(x)*10)/10;}
function hasCS(){return typeof window!==“undefined”&&window.storage!=null&&typeof window.storage.set===“function”;}
async function kv_set(k,v){try{if(hasCS()){await window.storage.set(k,JSON.stringify(v));}else{localStorage.setItem(k,JSON.stringify(v));}}catch(e){}}
async function kv_get(k){if(hasCS()){try{var r=await window.storage.get(k);return r&&r.value?JSON.parse(r.value):null;}catch(e){return null;}}try{var s=localStorage.getItem(k);return s?JSON.parse(s):null;}catch(e){return null;}}

async function searchUSDA(q){
try{
var res=await fetch(“https://api.nal.usda.gov/fdc/v1/foods/search?query=”+encodeURIComponent(q)+”&pageSize=6&api_key=DEMO_KEY”);
var data=await res.json();
if(!data.foods||!data.foods.length)return[];
return data.foods.map(function(f){
var ns=f.foodNutrients||[];
function g(id){var x=ns.find(function(y){return y.nutrientId===id||y.nutrientNumber===String(id);});return x?Math.round(x.value*10)/10:0;}
return{name:f.description,emoji:“🔍”,brand:f.brandOwner||””,calories:g(1008)||g(“208”),protein:g(1003)||g(“203”),carbs:g(1005)||g(“205”),fat:g(1004)||g(“204”),fiber:g(1079)||g(“291”),sugar:g(2000)||g(“269”),sodium:g(1093)||g(“307”)};
});
}catch(e){return[];}
}

function scoreMeal(meal, goals, calsBefore){
var score=0; var details=[]; var tips=[];
var pp=meal.calories>0?(meal.protein/meal.calories)*100:0;
var ps=Math.min(40,Math.round(pp*2.5)); score+=ps;
if(ps>=30){details.push({t:“High protein density”,pos:true});}
else if(ps>=15){details.push({t:“Decent protein”,pos:true});}
else{details.push({t:“Low protein density”,pos:false});tips.push(“Add protein: chicken, eggs, Greek yogurt, or a protein shake”);}
var rem=goals.calories-calsBefore;
var cs=meal.calories<=rem?Math.min(25,Math.round(25*(1-meal.calories/goals.calories))):0;
score+=cs;
if(meal.calories>rem){details.push({t:“Exceeds daily calorie budget”,pos:false});tips.push(“Over budget — try a smaller portion or swap to leaner protein”);}
else if(cs>=15){details.push({t:“Great calorie fit”,pos:true});}
var fs=Math.min(15,Math.round((meal.fiber/Math.max(goals.fiber,1))*100*0.15));
score+=fs;
if(fs>=10){details.push({t:“Excellent fiber”,pos:true});}
else if(meal.fiber<2){details.push({t:“Low fiber”,pos:false});tips.push(“Add fiber: broccoli, black beans, chia seeds, or whole grain carbs”);}
var sodRatio=meal.sodium/Math.max(goals.sodium,1);
var sp=sodRatio>0.5?Math.min(10,Math.round((sodRatio-0.5)*20)):0;
score-=sp;
if(sp>=5){details.push({t:“High sodium”,pos:false});tips.push(“Reduce sodium: skip deli meats or heavy sauces”);}
var fr=meal.fat/(Math.max(meal.calories,1)*0.30/9);
score+=fr<=1.2?Math.min(10,Math.round(10*(1-Math.abs(1-fr)*0.5))):0;
var sr=meal.sugar/Math.max(goals.sugar,1);
var ss=sr<=0.3?10:sr<=0.5?5:sr>1?-5:0;
score+=ss;
if(ss<0){details.push({t:“High sugar content”,pos:false});tips.push(“Cut sugar: swap sweets or juice for whole fruit or water”);}
var final=Math.max(0,Math.min(100,score));
var grade=“F”; var gc=”#ef4444”;
if(final>=90){grade=“S”;gc=”#fbbf24”;}
else if(final>=80){grade=“A”;gc=”#34d399”;}
else if(final>=70){grade=“B”;gc=”#60a5fa”;}
else if(final>=55){grade=“C”;gc=”#a78bfa”;}
else if(final>=40){grade=“D”;gc=”#fb923c”;}
if(tips.length===0&&final<90){tips.push(“Good meal! Add more vegetables or fiber to push toward an S grade”);}
return{score:final,grade:grade,gradeColor:gc,details:details,tips:tips};
}

function CalRing(props){
var eaten=props.eaten; var goal=props.goal; var T=props.T;
var pct=Math.min(eaten/goal,1); var over=eaten>goal;
var R=52; var C=2*Math.PI*R; var F=pct*C;
var col=over?”#f87171”:pct>=0.9?”#fbbf24”:T.accent;
return(
<div style={{display:“flex”,alignItems:“center”,gap:20}}>
<div style={{position:“relative”,width:120,height:120,flexShrink:0}}>
<svg width=“120” height=“120” style={{transform:“rotate(-90deg)”,display:“block”}}>
<circle cx="60" cy="60" r={R} fill="none" stroke={T.border} strokeWidth="10"/>
<circle cx=“60” cy=“60” r={R} fill=“none” stroke={col} strokeWidth=“10” strokeLinecap=“round” strokeDasharray={F+” “+(C-F)} style={{transition:“stroke-dasharray .6s”}}/>
</svg>
<div style={{position:“absolute”,inset:0,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<span style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:26,fontWeight:700,color:col,lineHeight:1}}>{eaten}</span>
<span style={{fontSize:10,color:T.sub,fontFamily:”‘DM Mono’,monospace”}}>/{goal}</span>
</div>
</div>
<div>
<div style={{fontSize:10,color:T.sub,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.08em”,marginBottom:4}}>CALORIES TODAY</div>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:28,fontWeight:700,color:col,lineHeight:1,marginBottom:6}}>{over?”+”+(eaten-goal)+” OVER”:(goal-eaten)+” LEFT”}</div>
<div style={{width:140,height:4,background:T.border,borderRadius:99,overflow:“hidden”}}>
<div style={{width:Math.min(pct*100,100)+”%”,height:“100%”,background:col,borderRadius:99,transition:“width .6s”}}/>
</div>
<div style={{fontSize:10,color:T.faint,fontFamily:”‘DM Mono’,monospace”,marginTop:4}}>{Math.round(pct*100)}% of {goal} kcal</div>
</div>
</div>
);
}

function MBar(props){
var label=props.label; var value=props.value; var max=props.max; var unit=props.unit; var color=props.color; var T=props.T;
var over=value>max; var pct=Math.min((value/max)*100,100);
return(
<div style={{marginBottom:10}}>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:4}}>
<span style={{fontSize:11,color:T.sub,fontFamily:”‘DM Mono’,monospace”}}>{label}</span>
<span style={{fontSize:12,fontWeight:700,color:over?”#f87171”:T.text,fontFamily:”‘DM Mono’,monospace”}}>{value}{unit} <span style={{color:T.faint,fontWeight:400}}>/ {max}{unit}</span></span>
</div>
<div style={{height:5,background:T.border,borderRadius:99,overflow:“hidden”}}>
<div style={{width:pct+”%”,height:“100%”,background:over?”#f87171”:color,borderRadius:99,transition:“width .5s”}}/>
</div>
</div>
);
}

function Pill(props){
var label=props.label; var value=props.value; var unit=props.unit; var color=props.color; var T=props.T;
return(
<div style={{background:T.card2,border:“1px solid “+T.border,borderRadius:10,padding:“8px 12px”,textAlign:“center”,minWidth:64}}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:T.faint,letterSpacing:“0.12em”,marginBottom:2}}>{label}</div>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:20,fontWeight:700,color:color}}>{value}<span style={{fontSize:11,fontWeight:400}}>{unit}</span></div>
</div>
);
}

export default function App(){
var [users, setUsers] = useState({});
var [currentUser, setCurrentUser] = useState(null);
var [authScreen, setAuthScreen] = useState(“login”);
var [authUser, setAuthUser] = useState(””);
var [authPass, setAuthPass] = useState(””);
var [authPass2, setAuthPass2] = useState(””);
var [authErr, setAuthErr] = useState(””);
var [meals, setMeals] = useState([]);
var [savedMeals, setSavedMeals] = useState([]);
var [goals, setGoals] = useState(DEFAULT_GOALS);
var [goalsForm, setGoalsForm] = useState(DEFAULT_GOALS);
var [tab, setTab] = useState(“home”);
var [themeId, setThemeId] = useState(“obsidian”);
var [loaded, setLoaded] = useState(false);
var [splash, setSplash] = useState(true);
var [activePetId, setActivePetId] = useState(null);
var [petData, setPetData] = useState({});
var [zooUnlocked, setZooUnlocked] = useState([]);
var [streak, setStreak] = useState(0);
var [lastLog, setLastLog] = useState(null);
var [xpPop, setXpPop] = useState(null);
var [showGoals, setShowGoals] = useState(false);
var [showTheme, setShowTheme] = useState(false);
var [showSaved, setShowSaved] = useState(false);
var [showPetPick, setShowPetPick] = useState(false);
var [showZoo, setShowZoo] = useState(false);
var [confirmNewDay, setConfirmNewDay] = useState(false);
var [delSaved, setDelSaved] = useState(null);
var [scoredMeal, setScoredMeal] = useState(null);
var [mealName, setMealName] = useState(””);
var [ings, setIngs] = useState([]);
var [mealErr, setMealErr] = useState(””);
var [catIdx, setCatIdx] = useState(0);
var [searchQ, setSearchQ] = useState(””);
var [searchR, setSearchR] = useState([]);
var [searching, setSearching] = useState(false);
var [searchErr, setSearchErr] = useState(””);
var [dragOver, setDragOver] = useState(false);

var T = THEMES.find(function(t){return t.id===themeId;}) || THEMES[0];
var MACROS = [
{key:“protein”,label:“Protein”,unit:“g”, color:”#34d399”,max:goals.protein},
{key:“carbs”,  label:“Carbs”,  unit:“g”, color:”#60a5fa”,max:goals.carbs},
{key:“fat”,    label:“Fat”,    unit:“g”, color:”#fbbf24”,max:goals.fat},
{key:“fiber”,  label:“Fiber”,  unit:“g”, color:”#a78bfa”,max:goals.fiber},
{key:“sugar”,  label:“Sugar”,  unit:“g”, color:”#f472b6”,max:goals.sugar},
{key:“sodium”, label:“Sodium”, unit:“mg”,color:”#fb923c”,max:goals.sodium},
];
var activePet = activePetId ? PETS.find(function(p){return p.id===activePetId;}) : null;
var activePetXP = (petData[activePetId]||{}).xp || 0;
var activePetName = (petData[activePetId]||{}).name || (activePet ? activePet.name : “”);
var petLvl = getLvl(activePetXP);
var petStage = activePet ? getStage(activePet, petLvl.level) : null;

useEffect(function(){
(async function(){
try{
var usrs = await kv_get(“ft-users”);
var cu = await kv_get(“ft-currentuser”);
if(usrs && typeof usrs===“object”) setUsers(usrs);
if(cu) setCurrentUser(cu);
}catch(e){}
setLoaded(true);
setTimeout(function(){setSplash(false);}, 2200);
})();
}, []);

useEffect(function(){
if(!loaded || !currentUser) return;
(async function(){
var key = “ft-”+currentUser+”-”;
try{
var m = await kv_get(key+“meals”);
var th = await kv_get(key+“theme”);
var sm = await kv_get(key+“savedmeals”);
var g = await kv_get(key+“goals”);
var ap = await kv_get(key+“activepet”);
var pd = await kv_get(key+“petdata”);
var zu = await kv_get(key+“zoo”);
var str = await kv_get(key+“streak”);
var ll = await kv_get(key+“lastlog”);
if(Array.isArray(m) && m.length) setMeals(m); else setMeals([]);
if(th && THEMES.find(function(t){return t.id===th;})) setThemeId(th); else setThemeId(“obsidian”);
if(Array.isArray(sm)) setSavedMeals(sm); else setSavedMeals([]);
if(g && typeof g===“object”){setGoals(g);setGoalsForm(g);}else{setGoals(DEFAULT_GOALS);setGoalsForm(DEFAULT_GOALS);}
if(ap) setActivePetId(ap); else setActivePetId(null);
if(pd && typeof pd===“object”) setPetData(pd); else setPetData({});
if(Array.isArray(zu)) setZooUnlocked(zu); else setZooUnlocked([]);
if(typeof str===“number”) setStreak(str); else setStreak(0);
if(ll) setLastLog(ll); else setLastLog(null);
}catch(e){}
})();
}, [currentUser, loaded]);

useEffect(function(){if(loaded) kv_set(“ft-users”, users);}, [users, loaded]);
useEffect(function(){if(loaded) kv_set(“ft-currentuser”, currentUser);}, [currentUser, loaded]);

function saveUserData(field, value){
if(!currentUser) return;
kv_set(“ft-”+currentUser+”-”+field, value);
}
useEffect(function(){if(loaded && currentUser) saveUserData(“meals”, meals);}, [meals, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“theme”, themeId);}, [themeId, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“savedmeals”, savedMeals);}, [savedMeals, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“goals”, goals);}, [goals, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“activepet”, activePetId);}, [activePetId, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“petdata”, petData);}, [petData, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“zoo”, zooUnlocked);}, [zooUnlocked, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“streak”, streak);}, [streak, loaded, currentUser]);
useEffect(function(){if(loaded && currentUser) saveUserData(“lastlog”, lastLog);}, [lastLog, loaded, currentUser]);

var totals = meals.reduce(function(a,m){
a.calories+=sn(m.calories); a.protein+=sn(m.protein); a.carbs+=sn(m.carbs);
a.fat+=sn(m.fat); a.fiber+=sn(m.fiber); a.sugar+=sn(m.sugar); a.sodium+=sn(m.sodium);
return a;
}, {calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

var ingTots = ings.reduce(function(a,i){
var s=sn(i.servings);
a.calories+=Math.round(sn(i.calories)*s); a.protein+=r1(sn(i.protein)*s);
a.carbs+=r1(sn(i.carbs)*s); a.fat+=r1(sn(i.fat)*s);
a.fiber+=r1(sn(i.fiber)*s); a.sugar+=r1(sn(i.sugar)*s);
a.sodium+=Math.round(sn(i.sodium)*s);
return a;
}, {calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

var avgScore = meals.length>0 ? Math.round(meals.reduce(function(a,m){return a+(m.score||0);},0)/meals.length) : null;
var calOver = totals.calories > goals.calories;
var prevCal = totals.calories + ingTots.calories;
var displayFoods = searchR.length>0 ? searchR : FOODS[catIdx].items;

function doLogin(){
setAuthErr(””);
var u = authUser.trim().toLowerCase();
if(!u){setAuthErr(“Enter a username.”);return;}
if(!authPass){setAuthErr(“Enter a password.”);return;}
if(!users[u]){setAuthErr(“No account found. Sign up below.”);return;}
if(users[u] !== authPass){setAuthErr(“Wrong password.”);return;}
setCurrentUser(u);
setAuthUser(””); setAuthPass(””);
}
function doSignup(){
setAuthErr(””);
var u = authUser.trim().toLowerCase().replace(/[^a-z0-9_]/g,””);
if(!u || u.length < 3){setAuthErr(“Username must be 3+ letters/numbers.”);return;}
if(!authPass || authPass.length < 4){setAuthErr(“Password must be 4+ characters.”);return;}
if(authPass !== authPass2){setAuthErr(“Passwords do not match.”);return;}
if(users[u]){setAuthErr(“Username taken. Try another.”);return;}
var updated = Object.assign({}, users);
updated[u] = authPass;
setUsers(updated);
setCurrentUser(u);
setAuthUser(””); setAuthPass(””); setAuthPass2(””);
}
function doLogout(){
setCurrentUser(null);
setMeals([]); setSavedMeals([]); setGoals(DEFAULT_GOALS);
setGoalsForm(DEFAULT_GOALS); setActivePetId(null); setPetData({});
setZooUnlocked([]); setStreak(0); setLastLog(null);
setTab(“home”); setScoredMeal(null);
}

function awardXP(amt){
if(!activePetId) return;
setPetData(function(prev){
var cur = prev[activePetId] || {xp:0, name:activePet?activePet.name:””, maxed:false};
var newXP = cur.xp + amt;
var newMaxed = newXP >= 6000;
if(newMaxed && !cur.maxed){
setZooUnlocked(function(z){return z.includes(activePetId)?z:[…z,activePetId];});
}
var updated = Object.assign({}, prev);
updated[activePetId] = Object.assign({}, cur, {xp:Math.min(newXP,6000), maxed:newMaxed});
return updated;
});
setXpPop(amt);
setTimeout(function(){setXpPop(null);}, 2500);
}

function updateStreak(){
var today = new Date().toDateString();
if(lastLog === today) return;
var yesterday = new Date(Date.now()-86400000).toDateString();
var ns = lastLog===yesterday ? streak+1 : 1;
setStreak(ns); setLastLog(today);
if(ns > 1) awardXP(Math.min(30, ns*3));
}

function saveGoalsFn(){
var g = {
calories: sn(goalsForm.calories)||DEFAULT_GOALS.calories,
protein: sn(goalsForm.protein)||DEFAULT_GOALS.protein,
carbs: sn(goalsForm.carbs)||DEFAULT_GOALS.carbs,
fat: sn(goalsForm.fat)||DEFAULT_GOALS.fat,
fiber: sn(goalsForm.fiber)||DEFAULT_GOALS.fiber,
sugar: sn(goalsForm.sugar)||DEFAULT_GOALS.sugar,
sodium: sn(goalsForm.sodium)||DEFAULT_GOALS.sodium
};
setGoals(g); setShowGoals(false);
}

function addIng(food){
setIngs(function(prev){
var ex = prev.find(function(i){return i.name===food.name;});
if(ex) return prev.map(function(i){return i.name===food.name ? Object.assign({},i,{servings:String(sn(i.servings)+1)}) : i;});
return prev.concat([Object.assign({},food,{id:Date.now()+Math.random(),servings:“1”})]);
});
setMealErr(””);
}
function updServ(id,val){setIngs(function(prev){return prev.map(function(i){return i.id===id?Object.assign({},i,{servings:val}):i;});});}
function removeIng(id){setIngs(function(prev){return prev.filter(function(i){return i.id!==id;});});}

async function doSearch(){
if(!searchQ.trim()) return;
setSearching(true); setSearchErr(””); setSearchR([]);
var r = await searchUSDA(searchQ);
if(!r.length) setSearchErr(“No results. Try simpler terms.”);
setSearchR(r); setSearching(false);
}

function saveMeal(){
if(!mealName.trim()||!ings.length){setMealErr(“Name your meal and add ingredients first.”);return;}
setSavedMeals(function(p){return p.concat([{id:Date.now(),name:mealName.trim(),ings:ings.map(function(i){return Object.assign({},i);}),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat}]);});
setMealErr(””); alert(mealName+” saved!”);
}
function loadMeal(m){setMealName(m.name);setIngs(m.ings.map(function(i){return Object.assign({},i,{id:Date.now()+Math.random()});}));setShowSaved(false);setTab(“build”);setMealErr(””);}
function delSavedFn(id){setSavedMeals(function(p){return p.filter(function(m){return m.id!==id;});});setDelSaved(null);}

function logMeal(){
if(!mealName.trim()){setMealErr(“Give your meal a name.”);return;}
if(!ings.length){setMealErr(“Add at least one ingredient.”);return;}
var meal = {id:Date.now(),name:mealName.trim(),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat,fiber:ingTots.fiber,sugar:ingTots.sugar,sodium:ingTots.sodium,time:new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”}),ingredientCount:ings.length};
var sc = scoreMeal(meal, goals, totals.calories);
meal.score=sc.score; meal.grade=sc.grade; meal.gradeColor=sc.gradeColor;
setMeals(function(p){return p.concat([meal]);});
setScoredMeal(Object.assign({},meal,sc));
var xp = 10;
if(sc.score>=80) xp+=15; else if(sc.score>=65) xp+=8;
awardXP(xp);
updateStreak();
setMealName(””); setIngs([]); setMealErr(””); setTab(“log”);
}

function newDay(){
if(activePetId && meals.length>0){
var xp=0;
if(meals.length>=3) xp+=10;
var cp = totals.calories/Math.max(goals.calories,1);
if(cp>=0.85 && cp<=1.05) xp+=15;
if(totals.protein/Math.max(goals.protein,1)>=0.9) xp+=20;
if(xp>0) awardXP(xp);
}
setMeals([]); setMealName(””); setIngs([]); setMealErr(””);
setConfirmNewDay(false); setTab(“home”); setScoredMeal(null);
}

function selectPet(id){
if(!petData[id]){
var pet = PETS.find(function(p){return p.id===id;});
setPetData(function(prev){var upd=Object.assign({},prev);upd[id]={xp:0,name:pet?pet.name:””,maxed:false};return upd;});
}
setActivePetId(id);
setShowPetPick(false);
}

function navSt(active){return {flex:1,padding:“9px 0 7px”,border:“none”,cursor:“pointer”,fontFamily:”‘DM Mono’,monospace”,fontSize:9,fontWeight:600,background:“transparent”,color:active?T.accent:T.faint,transition:“color .2s”,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:2};}
function inp(extra){return Object.assign({},{width:“100%”,background:T.card2,border:“1px solid “+T.border,borderRadius:8,color:T.text,fontSize:14,padding:“11px 14px”,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”},extra||{});}

if(splash) return(
<div style={{position:“fixed”,inset:0,zIndex:200,background:”#030712”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<style>{”@import url(‘https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap’);”}</style>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:58,fontWeight:700,letterSpacing:“0.08em”,lineHeight:1,marginBottom:6}}>
<span style={{color:”#34d399”}}>FUEL</span><span style={{color:”#f1f5f9”}}> TRACK</span>
</div>
<div style={{fontSize:11,color:”#475569”,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.15em”,marginBottom:32}}>NUTRITION RPG</div>
<div style={{display:“flex”,gap:8,marginBottom:32}}>
{[“🐶”,“🐱”,“🥚”,“🦑”,“🐴”,“🐟”,“🐣”,“🔥”,“🐺”].map(function(e,i){return(<div key={i} style={{fontSize:22,animation:“bounce 1s ease-in-out “+i*0.1+“s infinite alternate”}}>{e}</div>);})}
</div>
<div style={{width:160,height:3,background:”#1e293b”,borderRadius:99,overflow:“hidden”,marginBottom:10}}>
<div style={{height:“100%”,background:”#34d399”,borderRadius:99,animation:“loadbar 2s ease-out forwards”}}/>
</div>
<div style={{fontSize:11,color:”#475569”,fontFamily:”‘DM Mono’,monospace”}}>LOADING…</div>
<style>{”@keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}} @keyframes loadbar{from{width:0%;}to{width:100%;}}”}</style>
</div>
);

if(!currentUser) return(
<div style={{minHeight:“100vh”,background:T.bg,color:T.text,fontFamily:”‘DM Sans’,sans-serif”,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20}}>
<style>{”@import url(‘https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap’); *{box-sizing:border-box;margin:0;padding:0;}”}</style>
<div style={{width:“100%”,maxWidth:380}}>
<div style={{textAlign:“center”,marginBottom:32}}>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:52,fontWeight:700,letterSpacing:“0.06em”,lineHeight:1,marginBottom:6}}>
<span style={{color:”#34d399”}}>FUEL</span><span style={{color:T.text}}> TRACK</span>
</div>
<div style={{fontSize:12,color:T.sub,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.12em”}}>NUTRITION RPG</div>
</div>
<div style={{background:T.card,border:“1px solid “+T.border,borderRadius:20,padding:28}}>
<div style={{display:“flex”,marginBottom:20,background:T.card2,borderRadius:10,padding:3}}>
<button onClick={function(){setAuthScreen(“login”);setAuthErr(””);}} style={{flex:1,padding:“10px 0”,border:“none”,borderRadius:8,background:authScreen===“login”?T.accent:“transparent”,color:authScreen===“login”?”#030712”:T.sub,fontFamily:”‘DM Mono’,monospace”,fontSize:12,fontWeight:700,cursor:“pointer”,transition:“all .2s”}}>LOG IN</button>
<button onClick={function(){setAuthScreen(“signup”);setAuthErr(””);}} style={{flex:1,padding:“10px 0”,border:“none”,borderRadius:8,background:authScreen===“signup”?T.accent:“transparent”,color:authScreen===“signup”?”#030712”:T.sub,fontFamily:”‘DM Mono’,monospace”,fontSize:12,fontWeight:700,cursor:“pointer”,transition:“all .2s”}}>SIGN UP</button>
</div>
<div style={{display:“flex”,flexDirection:“column”,gap:12}}>
<div>
<label style={{fontSize:10,color:T.faint,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.08em”,display:“block”,marginBottom:5}}>USERNAME</label>
<input type=“text” value={authUser} onChange={function(e){setAuthUser(e.target.value);setAuthErr(””);}} onKeyDown={function(e){if(e.key===“Enter”) authScreen===“login”?doLogin():doSignup();}} placeholder=“your_username” autoCapitalize=“none” autoCorrect=“off” style={inp({borderLeft:“3px solid “+T.accent})}/>
</div>
<div>
<label style={{fontSize:10,color:T.faint,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.08em”,display:“block”,marginBottom:5}}>PASSWORD</label>
<input type=“password” value={authPass} onChange={function(e){setAuthPass(e.target.value);setAuthErr(””);}} onKeyDown={function(e){if(e.key===“Enter”) authScreen===“login”?doLogin():doSignup();}} placeholder=“password” style={inp({borderLeft:“3px solid “+T.accent})}/>
</div>
{authScreen===“signup” && (
<div>
<label style={{fontSize:10,color:T.faint,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.08em”,display:“block”,marginBottom:5}}>CONFIRM PASSWORD</label>
<input type=“password” value={authPass2} onChange={function(e){setAuthPass2(e.target.value);setAuthErr(””);}} onKeyDown={function(e){if(e.key===“Enter”) doSignup();}} placeholder=“confirm password” style={inp({borderLeft:“3px solid “+T.accent})}/>
</div>
)}
{authErr && <div style={{color:”#fca5a5”,fontSize:12,fontFamily:”‘DM Mono’,monospace”,padding:“8px 12px”,background:”#1a0505”,border:“1px solid #7f1d1d”,borderRadius:8}}>⚠ {authErr}</div>}
<button onClick={authScreen===“login”?doLogin:doSignup} style={{padding:“14px 0”,background:T.accent,border:“none”,borderRadius:10,color:”#030712”,fontSize:14,fontWeight:700,fontFamily:”‘DM Mono’,monospace”,cursor:“pointer”,marginTop:4}}>
{authScreen===“login” ? “LOG IN” : “CREATE ACCOUNT”}
</button>
</div>
{authScreen===“login” && (
<div style={{textAlign:“center”,marginTop:16,fontSize:12,color:T.faint}}>
No account? <button onClick={function(){setAuthScreen(“signup”);setAuthErr(””);}} style={{background:“none”,border:“none”,color:T.accent,cursor:“pointer”,fontSize:12,fontFamily:”‘DM Mono’,monospace”}}>Sign up free</button>
</div>
)}
</div>
<div style={{textAlign:“center”,marginTop:16}}>
<button onClick={function(){setShowTheme(true);}} style={{background:“transparent”,border:“1px solid “+T.border,color:T.sub,borderRadius:8,padding:“6px 14px”,fontSize:11,cursor:“pointer”,fontFamily:”‘DM Mono’,monospace”}}>🎨 THEME</button>
</div>
{showTheme && (
<div style={{position:“fixed”,inset:0,background:“rgba(3,7,18,.88)”,zIndex:100,display:“flex”,alignItems:“flex-end”,justifyContent:“center”}} onClick={function(e){if(e.target===e.currentTarget)setShowTheme(false);}}>
<div style={{background:T.card,border:“1px solid “+T.border,borderRadius:“20px 20px 0 0”,padding:24,width:“100%”,maxWidth:520,maxHeight:“70vh”,overflowY:“auto”}}>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:20,fontWeight:700,color:T.text,marginBottom:16}}>🎨 THEMES</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:8}}>
{THEMES.map(function(th){return(
<button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:“flex”,alignItems:“center”,gap:7,padding:“7px 12px”,borderRadius:8,cursor:“pointer”,border:themeId===th.id?“2px solid “+T.accent:“1px solid “+T.border,background:th.card}}>
<div style={{width:14,height:14,borderRadius:3,background:th.bg,border:“1px solid rgba(128,128,128,.3)”,flexShrink:0}}/>
<span style={{fontSize:11,fontWeight:600,fontFamily:”‘DM Mono’,monospace”,color:themeId===th.id?T.accent:th.text,whiteSpace:“nowrap”}}>{th.label}</span>
</button>
);})}
</div>
</div>
</div>
)}
</div>
</div>
);

return(
<div style={{minHeight:“100vh”,background:T.bg,color:T.text,fontFamily:”‘DM Sans’,sans-serif”,transition:“background .3s”,paddingBottom:64}}>
<style>{”@import url(‘https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap’); *{box-sizing:border-box;margin:0;padding:0;} input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;} input[type=number]{-moz-appearance:textfield;} .delbtn{opacity:0!important;transition:opacity .2s!important;} .mcard:hover .delbtn{opacity:1!important;} .fc{transition:all .15s;} .fc:hover{transform:translateY(-2px);} .ir:hover .hid{opacity:1!important;} .hid{opacity:0!important;transition:opacity .2s!important;} .pf{animation:floatPet 3s ease-in-out infinite;} @keyframes floatPet{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}} @keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}} @keyframes loadbar{from{width:0%;}to{width:100%;}} @keyframes xpA{0%{opacity:0;transform:translateY(0) scale(.5);}20%{opacity:1;transform:translateY(-20px) scale(1.2);}80%{opacity:1;transform:translateY(-40px);}100%{opacity:0;transform:translateY(-60px);}} .xpa{animation:xpA 2.5s ease-out forwards;}”}</style>

```
  {xpPop!=null && <div className="xpa" style={{position:"fixed",top:80,right:20,zIndex:150,background:"#fbbf24",color:"#030712",borderRadius:12,padding:"8px 16px",fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(251,191,36,.4)",pointerEvents:"none"}}>+{xpPop} XP ⚡</div>}

  {scoredMeal && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:44,marginBottom:6}}>{scoredMeal.grade==="S"?"🏆":scoredMeal.grade==="A"?"🥇":scoredMeal.grade==="B"?"🥈":scoredMeal.grade==="C"?"🥉":"📊"}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:T.sub,marginBottom:2}}>MEAL SCORE</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:68,fontWeight:700,color:scoredMeal.gradeColor,lineHeight:1,marginBottom:2}}>{scoredMeal.score}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:scoredMeal.gradeColor,marginBottom:16}}>GRADE {scoredMeal.grade}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
          {scoredMeal.details.map(function(d,i){return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:T.card2,borderRadius:8}}>
              <span style={{fontSize:14}}>{d.pos?"✅":"⚠️"}</span>
              <span style={{fontSize:12,color:T.sub}}>{d.t}</span>
            </div>
          );})}
        </div>
        {scoredMeal.tips && scoredMeal.tips.length>0 && (
          <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
            <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>HOW TO IMPROVE THIS MEAL</div>
            {scoredMeal.tips.map(function(tip,i){return(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <div style={{width:18,height:18,borderRadius:99,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:"#030712",fontFamily:"'DM Mono',monospace",marginTop:1}}>{i+1}</div>
                <div style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{tip}</div>
              </div>
            );})}
          </div>
        )}
        <button onClick={function(){setScoredMeal(null);}} style={{width:"100%",padding:"13px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>GOT IT!</button>
      </div>
    </div>
  )}

  {showGoals && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>DAILY GOALS</div>
          <button onClick={function(){setShowGoals(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>CANCEL</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[{key:"calories",label:"Calories (kcal)",color:"#34d399"},{key:"protein",label:"Protein (g)",color:"#34d399"},{key:"carbs",label:"Carbs (g)",color:"#60a5fa"},{key:"fat",label:"Fat (g)",color:"#fbbf24"},{key:"fiber",label:"Fiber (g)",color:"#a78bfa"},{key:"sugar",label:"Sugar (g)",color:"#f472b6"},{key:"sodium",label:"Sodium (mg)",color:"#fb923c"}].map(function(item){return(
            <div key={item.key}>
              <label style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>{item.label}</label>
              <input type="number" min="0" value={goalsForm[item.key]} onChange={function(e){var v=e.target.value;setGoalsForm(function(f){var u=Object.assign({},f);u[item.key]=v;return u;});}} style={inp({borderLeft:"3px solid "+item.color})}/>
            </div>
          );})}
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={function(){setGoalsForm(DEFAULT_GOALS);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>RESET</button>
          <button onClick={saveGoalsFn} style={{flex:2,padding:"12px 0",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>SAVE GOALS</button>
        </div>
      </div>
    </div>
  )}

  {showTheme && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowTheme(false);}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"75vh",overflowY:"auto"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>THEMES</div>
        <div style={{fontSize:11,color:T.sub,marginBottom:16}}>{THEMES.length} themes available</div>
        {[["DARK",["obsidian","midnight","forest","navy","crimson","storm","grape","espresso","cherry","arctic","void","gold","neon"]],["LIGHT",["snow","cream","blush","sky","sage","lavender","peach"]],["VIBRANT",["ocean","emerald","royal","rose","amber","teal","sunset"]]].map(function(group){return(
          <div key={group[0]} style={{marginBottom:16}}>
            <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>{group[0]}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {group[1].map(function(tid){var th=THEMES.find(function(t){return t.id===tid;});if(!th)return null;return(
                <button key={tid} onClick={function(){setThemeId(tid);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===tid?"2px solid "+T.accent:"1px solid "+T.border,background:th.card}}>
                  <div style={{width:14,height:14,borderRadius:3,background:th.bg,border:"1px solid rgba(128,128,128,.3)",flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===tid?T.accent:th.text,whiteSpace:"nowrap"}}>{th.label}</span>
                </button>
              );})}
            </div>
          </div>
        );})}
      </div>
    </div>
  )}

  {confirmNewDay && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:32,maxWidth:340,width:"90%",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>🌅</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,marginBottom:8,color:T.text}}>New Day?</div>
        <p style={{color:T.sub,fontSize:13,lineHeight:1.6,marginBottom:24}}>Clears {meals.length} meal{meals.length!==1?"s":""} and resets today. Pet earns XP for goals hit today!</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={function(){setConfirmNewDay(false);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CANCEL</button>
          <button onClick={newDay} style={{flex:1,padding:"12px 0",background:"#7f1d1d",border:"1px solid #991b1b",color:"#fca5a5",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>NEW DAY</button>
        </div>
      </div>
    </div>
  )}

  {showSaved && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowSaved(false);}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>SAVED MEALS</div>
          <button onClick={function(){setShowSaved(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>CLOSE</button>
        </div>
        {!savedMeals.length ? (
          <div style={{textAlign:"center",padding:"30px 0",color:T.faint,fontSize:13,fontFamily:"'DM Mono',monospace"}}>No saved meals. Build a meal and tap SAVE.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {savedMeals.map(function(m){return(
              <div key={m.id} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{m.name}</div>
                  <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.accent}}>{m.calories} kcal · P{m.protein}g</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={function(){loadMeal(m);}} style={{padding:"6px 12px",background:"#065f46",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>LOAD</button>
                  {delSaved===m.id ? (
                    <button onClick={function(){delSavedFn(m.id);}} style={{padding:"6px 10px",background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>DEL?</button>
                  ) : (
                    <button onClick={function(){setDelSaved(m.id);}} style={{padding:"6px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.faint,fontSize:13,cursor:"pointer"}}>x</button>
                  )}
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  )}

  {showPetPick && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>CHOOSE YOUR PET</div>
        <div style={{fontSize:12,color:T.sub,textAlign:"center",marginBottom:20}}>10 pets, 5 evolution stages each. Max out a pet to add it to your Zoo!</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {PETS.map(function(pet){
            var pd = petData[pet.id] || {};
            var isActive = activePetId===pet.id;
            var lvl = getLvl(pd.xp||0);
            var stage = getStage(pet, lvl.level);
            return(
              <button key={pet.id} onClick={function(){selectPet(pet.id);}} style={{background:isActive?pet.color+"22":T.card2,border:"2px solid "+(isActive?pet.color:T.border),borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all .2s",display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:40,flexShrink:0,width:50,textAlign:"center"}}>{stage?stage.emoji:pet.stages[0].emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:isActive?pet.color:T.text,marginBottom:1}}>{pd.name||pet.name}</div>
                  <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>EVOLVES:</span>
                    {pet.stages.map(function(s,i){return(<span key={i} style={{fontSize:14}}>{s.emoji}</span>);})}
                  </div>
                  {(pd.xp||0)>0 && (
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,height:3,background:T.border,borderRadius:99,overflow:"hidden"}}>
                        <div style={{width:Math.min((pd.xp||0)/60,100)+"%",height:"100%",background:pet.color,borderRadius:99}}/>
                      </div>
                      <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>Lv{lvl.level}{pd.maxed?" MAXED":""}</span>
                    </div>
                  )}
                </div>
                {isActive && <span style={{fontSize:10,color:pet.color,fontFamily:"'DM Mono',monospace",fontWeight:700,flexShrink:0}}>ACTIVE</span>}
              </button>
            );
          })}
        </div>
        <button onClick={function(){setShowPetPick(false);}} style={{width:"100%",marginTop:16,padding:"12px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>DONE</button>
      </div>
    </div>
  )}

  {showZoo && (
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>PET ZOO</div>
        <div style={{fontSize:12,color:T.sub,textAlign:"center",marginBottom:20}}>{zooUnlocked.length}/{PETS.length} pets maxed out and collected</div>
        {!zooUnlocked.length ? (
          <div style={{textAlign:"center",padding:"30px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🥚</div>
            <div style={{fontSize:13,color:T.sub}}>Max out any pet to unlock your first Zoo resident!</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {PETS.map(function(pet){
              var unlocked = zooUnlocked.includes(pet.id);
              var pd = petData[pet.id] || {};
              var maxStage = pet.stages[pet.stages.length-1];
              if(unlocked) return(
                <div key={pet.id} style={{background:pet.color+"22",border:"2px solid "+pet.color,borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
                  <div style={{fontSize:44,marginBottom:6}}>{maxStage.emoji}</div>
                  <div style={{fontWeight:700,fontSize:13,color:pet.color,marginBottom:2}}>{pd.name||pet.name}</div>
                  <div style={{fontSize:10,color:T.sub,fontFamily:"'DM Mono',monospace",marginBottom:2}}>{maxStage.form}</div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>GOD MODE</div>
                </div>
              );
              return(
                <div key={pet.id} style={{background:T.card2,border:"1px dashed "+T.border,borderRadius:14,padding:"16px 12px",textAlign:"center",opacity:0.4}}>
                  <div style={{fontSize:36,marginBottom:6}}>?</div>
                  <div style={{fontWeight:700,fontSize:12,color:T.faint}}>???</div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginTop:2}}>Not maxed</div>
                </div>
              );
            })}
          </div>
        )}
        <button onClick={function(){setShowZoo(false);}} style={{width:"100%",marginTop:16,padding:"12px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CLOSE</button>
      </div>
    </div>
  )}

  <header style={{padding:"12px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
    <div style={{display:"flex",alignItems:"baseline",gap:6}}>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.accent,letterSpacing:"0.06em"}}>FUEL</span>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text,letterSpacing:"0.06em"}}>TRACK</span>
      {streak>0 && <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#fbbf24",marginLeft:4}}>🔥{streak}</span>}
      <span style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginLeft:4}}>@{currentUser}</span>
    </div>
    <div style={{display:"flex",gap:5}}>
      <button onClick={function(){setGoalsForm(Object.assign({},goals));setShowGoals(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:11,cursor:"pointer"}}>🎯</button>
      <button onClick={function(){setShowTheme(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:11,cursor:"pointer"}}>🎨</button>
      {meals.length>0 && <button onClick={function(){setConfirmNewDay(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:11,cursor:"pointer"}}>🌅</button>}
      <button onClick={doLogout} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>OUT</button>
    </div>
  </header>

  <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 0"}}>

    {tab==="home" && (
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
          <CalRing eaten={Math.round(totals.calories)} goal={goals.calories} T={T}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>
            <Pill label="PROTEIN" value={r1(totals.protein)} unit="g"  color="#34d399" T={T}/>
            <Pill label="CARBS"   value={r1(totals.carbs)}   unit="g"  color="#60a5fa" T={T}/>
            <Pill label="FAT"     value={r1(totals.fat)}     unit="g"  color="#fbbf24" T={T}/>
            <Pill label="FIBER"   value={r1(totals.fiber)}   unit="g"  color="#a78bfa" T={T}/>
            <Pill label="SUGAR"   value={r1(totals.sugar)}   unit="g"  color="#f472b6" T={T}/>
            <Pill label="SODIUM"  value={Math.round(totals.sodium)} unit="mg" color="#fb923c" T={T}/>
          </div>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
          <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>MACRO BREAKDOWN</div>
          {MACROS.map(function(m){return <MBar key={m.key} label={m.label} value={r1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T}/>;  })}
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
          {!activePetId ? (
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:40,marginBottom:10}}>🥚</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>No Pet Yet!</div>
              <div style={{fontSize:13,color:T.sub,marginBottom:16}}>Choose a companion that grows as you hit your goals</div>
              <button onClick={function(){setShowPetPick(true);}} style={{padding:"12px 24px",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CHOOSE PET</button>
            </div>
          ) : (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div className="pf" style={{fontSize:54,lineHeight:1,cursor:"pointer"}} onClick={function(){setShowPetPick(true);}}>{petStage?petStage.emoji:activePet.stages[0].emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:activePet.color,marginBottom:1}}>{activePetName}</div>
                  <div style={{fontSize:11,color:activePet.color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>{petStage?petStage.form:"Newborn"}</div>
                  <div style={{fontSize:11,color:T.sub,fontFamily:"'DM Mono',monospace",marginBottom:6}}>Lv{petLvl.level} {petLvl.name} · {activePetXP} XP</div>
                  <div style={{height:5,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:3}}>
                    <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width .8s"}}/>
                  </div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>
                    {(petData[activePetId]||{}).maxed?"MAXED — check your Zoo!":petLvl.nxt?"→ "+(petLvl.nxt.xpReq-activePetXP)+" XP to Lv"+(petLvl.level+1):""}
                  </div>
                </div>
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:10}}>
                <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>TODAY</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[{i:"🍽️",v:meals.length+"/3",ok:meals.length>=3,l:"Meals"},{i:"🔥",v:Math.round((totals.calories/Math.max(goals.calories,1))*100)+"%",ok:totals.calories>=goals.calories*0.85&&totals.calories<=goals.calories*1.05,l:"Cal"},{i:"💪",v:Math.round((totals.protein/Math.max(goals.protein,1))*100)+"%",ok:totals.protein>=goals.protein*0.9,l:"Protein"},{i:"⚡",v:streak+"d",ok:streak>0,l:"Streak"}].map(function(x){return(
                    <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:12}}>{x.i}</span>
                      <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:x.ok?T.accent:T.sub}}>{x.v}</span>
                      <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>{x.l}</span>
                    </div>
                  );})}
                </div>
              </div>
              {zooUnlocked.length>0 && (
                <button onClick={function(){setShowZoo(true);}} style={{width:"100%",marginTop:10,padding:"8px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.accent,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
                  🏆 PET ZOO ({zooUnlocked.length}/{PETS.length})
                </button>
              )}
            </div>
          )}
        </div>
        {avgScore!=null && (
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:46,fontWeight:700,color:avgScore>=80?T.accent:avgScore>=65?"#fbbf24":"#fb923c",lineHeight:1}}>{avgScore}</div>
              <div style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>AVG SCORE</div>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:4}}>{avgScore>=80?"🏆 Excellent day!":avgScore>=65?"👍 Good progress":avgScore>=50?"📈 Room to improve":"⚠️ Focus on quality"}</div>
              <div style={{fontSize:12,color:T.sub}}>{meals.length} meal{meals.length!==1?"s":""} logged · see details in LOG</div>
            </div>
          </div>
        )}
      </div>
    )}

    {tab==="log" && (
      <div style={{marginTop:8}}>
        {!meals.length ? (
          <div style={{background:T.card,border:"1px dashed "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🍽️</div>
            <div style={{color:T.sub,fontSize:14,marginBottom:6}}>No meals logged yet</div>
            <div style={{color:T.faint,fontSize:12,fontFamily:"'DM Mono',monospace"}}>Tap BUILD to get started</div>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {meals.map(function(meal,idx){return(
              <div key={meal.id} className="mcard" style={{background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:26,height:26,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'DM Mono',monospace",fontSize:10,color:T.faint}}>{idx+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:2}}>
                    <span style={{fontWeight:600,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.sub,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.accent}}>{meal.calories} <span style={{fontSize:12,fontWeight:400,color:T.sub}}>kcal</span></div>
                    {meal.grade && <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:meal.gradeColor,background:meal.gradeColor+"22",borderRadius:6,padding:"1px 7px"}}>Grade {meal.grade}</div>}
                    {meal.score!=null && <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.faint}}>{meal.score}/100</div>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {[{l:"P",v:meal.protein,u:"g",c:"#34d399"},{l:"C",v:meal.carbs,u:"g",c:"#60a5fa"},{l:"F",v:meal.fat,u:"g",c:"#fbbf24"},{l:"Fi",v:meal.fiber,u:"g",c:"#a78bfa"},{l:"Na",v:meal.sodium,u:"mg",c:"#fb923c"}].filter(function(x){return x.v>0;}).map(function(chip){return(
                      <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:4,padding:"1px 6px",fontSize:10,fontFamily:"'DM Mono',monospace",color:chip.c}}>{chip.l} {r1(chip.v)}{chip.u}</span>
                    );})}
                  </div>
                </div>
                <button className="delbtn" onClick={function(){setMeals(function(p){return p.filter(function(m){return m.id!==meal.id;});});}} style={{background:"transparent",border:"1px solid "+T.border,color:T.faint,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
              </div>
            );})}
            <div style={{background:calOver?"#1a0505":"#061a0f",border:"1px solid "+(calOver?"#7f1d1d":"#14532d"),borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:calOver?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace",marginBottom:2}}>{calOver?"OVER GOAL":"DAILY TOTAL"}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:calOver?"#f87171":"#4ade80",lineHeight:1}}>{Math.round(totals.calories)} / {goals.calories} kcal</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                <div style={{fontSize:12,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r1(totals.protein)}g protein</div>
                {avgScore!=null && <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>Avg: {avgScore}/100</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {tab==="build" && (
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>MEAL NAME</div>
          <input type="text" value={mealName} onChange={function(e){setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Post-Workout Lunch" style={inp({})}/>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>FOOD BROWSER — tap to add · 200+ foods</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input type="text" value={searchQ} onChange={function(e){setSearchQ(e.target.value);if(!e.target.value)setSearchR([]);}} onKeyDown={function(e){if(e.key==="Enter")doSearch();}} placeholder="Search USDA database..." style={inp({flex:1,fontSize:13,padding:"8px 11px"})}/>
            <button onClick={doSearch} disabled={searching} style={{padding:"8px 13px",background:"#0891b2",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"SEARCH"}</button>
            {searchR.length>0 && <button onClick={function(){setSearchR([]);setSearchQ("");}} style={{padding:"8px 10px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.sub,fontSize:12,cursor:"pointer"}}>X</button>}
          </div>
          {searchErr && <div style={{fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace",marginBottom:8}}>⚠ {searchErr}</div>}
          {!searchR.length && (
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:10}}>
              {FOODS.map(function(c,i){return(
                <button key={i} onClick={function(){setCatIdx(i);}} style={{padding:"5px 11px",borderRadius:18,border:"1px solid "+(catIdx===i?T.accent:T.border),background:catIdx===i?T.accent:T.card2,color:catIdx===i?"#030712":T.sub,fontSize:10,fontWeight:600,fontFamily:"'DM Mono',monospace",flexShrink:0,cursor:"pointer",whiteSpace:"nowrap"}}>{c.emoji} {c.label}</button>
              );})}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {displayFoods.map(function(food,i){return(
              <div key={i} className="fc" onClick={function(){addIng(food);}} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:11,padding:"10px",cursor:"pointer"}}>
                <div style={{fontSize:22,marginBottom:4,lineHeight:1}}>{food.emoji}</div>
                <div style={{fontSize:10,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{food.name}</div>
                {food.brand && <div style={{fontSize:9,color:T.faint,marginBottom:3}}>{food.brand}</div>}
                <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.accent,fontWeight:700}}>{food.calories} kcal</div>
                <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:T.sub}}>P{food.protein}g C{food.carbs}g F{food.fat}g</div>
              </div>
            );})}
          </div>
        </div>
        <div onDragOver={function(e){e.preventDefault();setDragOver(true);}} onDragLeave={function(){setDragOver(false);}} onDrop={function(e){e.preventDefault();setDragOver(false);try{addIng(JSON.parse(e.dataTransfer.getData("food")));}catch(er){}}}
          style={{background:T.card,border:"2px "+(dragOver?"solid "+T.accent:"dashed "+T.border),borderRadius:16,padding:"14px 16px",minHeight:80,transition:"all .2s"}}>
          {!ings.length ? (
            <div style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{fontSize:24,marginBottom:5}}>🧺</div>
              <div style={{color:dragOver?T.accent:T.sub,fontSize:13,fontWeight:600,marginBottom:2}}>{dragOver?"Drop it!":"Your Meal"}</div>
              <div style={{color:T.faint,fontSize:11,fontFamily:"'DM Mono',monospace"}}>Tap foods above to add them</div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>🧺 {ings.length} INGREDIENT{ings.length!==1?"S":""}</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {ings.map(function(ing){return(
                  <div key={ing.id} className="ir" style={{display:"flex",alignItems:"center",gap:8,background:T.card2,borderRadius:9,padding:"8px 10px",border:"1px solid "+T.border}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ing.emoji||"🍽️"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                      <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.accent}}>{Math.round(sn(ing.calories)*sn(ing.servings))} kcal · P{r1(sn(ing.protein)*sn(ing.servings))}g</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                      <button onClick={function(){updServ(ing.id,String(Math.max(0.25,sn(ing.servings)-0.25)));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                      <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.text,minWidth:25,textAlign:"center"}}>{ing.servings}x</span>
                      <button onClick={function(){updServ(ing.id,String(sn(ing.servings)+0.25));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      <button className="hid" onClick={function(){removeIng(ing.id);}} style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,color:T.faint,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>x</button>
                    </div>
                  </div>
                );})}
              </div>
              <div style={{marginTop:10,padding:"10px 12px",background:prevCal>goals.calories?"#1a0505":"#061a0f",border:"1px solid "+(prevCal>goals.calories?"#7f1d1d":"#14532d"),borderRadius:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                  <span style={{fontSize:10,color:prevCal>goals.calories?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace"}}>MEAL TOTAL</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:prevCal>goals.calories?"#f87171":"#4ade80"}}>{ingTots.calories} kcal</span>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[["P",ingTots.protein,"g","#34d399"],["C",ingTots.carbs,"g","#60a5fa"],["F",ingTots.fat,"g","#fbbf24"],["Fi",ingTots.fiber,"g","#a78bfa"],["Na",ingTots.sodium,"mg","#fb923c"]].map(function(x){return(<span key={x[0]} style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:x[3]}}>{x[0]} {x[1]}{x[2]}</span>);})}
                </div>
              </div>
            </div>
          )}
        </div>
        {mealErr && <div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>⚠ {mealErr}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={saveMeal} disabled={!mealName.trim()||!ings.length} style={{flex:1,padding:"13px 0",background:"#0c4a6e",border:"1px solid #0369a1",borderRadius:11,color:"#7dd3fc",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>SAVE</button>
          <button onClick={logMeal} disabled={!mealName.trim()||!ings.length} style={{flex:2,padding:"13px 0",background:T.accent,border:"none",borderRadius:11,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>
            + LOG {ings.length>0 && "· "+ingTots.calories+" kcal"}
          </button>
        </div>
        <button onClick={function(){setShowSaved(true);}} style={{padding:"11px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:11,color:T.sub,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
          SAVED MEALS {savedMeals.length>0 && "("+savedMeals.length+")"}
        </button>
      </div>
    )}

    {tab==="pet" && (
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
        {!activePetId ? (
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:16}}>🥚</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:8}}>Choose Your Pet!</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:20}}>10 pets, each with 5 unique evolution stages. Max one out to add it to your Zoo!</div>
            <button onClick={function(){setShowPetPick(true);}} style={{padding:"14px 32px",background:T.accent,border:"none",borderRadius:12,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CHOOSE YOUR PET</button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
              <div className="pf" style={{fontSize:88,lineHeight:1,marginBottom:8}}>{petStage?petStage.emoji:activePet.stages[0].emoji}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:activePet.color,marginBottom:2}}>{activePetName}</div>
              <div style={{fontSize:14,fontWeight:600,color:activePet.color,opacity:0.8,marginBottom:4}}>{petStage?petStage.form:"Newborn"}</div>
              <div style={{fontSize:13,color:T.sub,marginBottom:12,lineHeight:1.5,fontStyle:"italic"}}>{petStage?petStage.desc:activePet.stages[0].desc}</div>
              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:T.text}}>Level {petLvl.level} — {petLvl.name}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.sub}}>{activePetXP} XP</span>
                </div>
                <div style={{height:7,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:5}}>
                  <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width 1s"}}/>
                </div>
                <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>
                  {(petData[activePetId]||{}).maxed?"👑 MAX LEVEL — check your Zoo!":petLvl.nxt?"→ "+(petLvl.nxt.xpReq-activePetXP)+" XP to Level "+(petLvl.level+1):""}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={function(){setShowPetPick(true);}} style={{flex:1,padding:"10px 0",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.sub,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CHANGE PET</button>
                <button onClick={function(){setShowZoo(true);}} style={{flex:1,padding:"10px 0",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.accent,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>ZOO ({zooUnlocked.length})</button>
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>EVOLUTION STAGES</div>
              {activePet.stages.map(function(stage,i){
                var unlocked = petLvl.level>=stage.level;
                var isCur = petLvl.level>=stage.level && (i===activePet.stages.length-1 || petLvl.level<activePet.stages[i+1].level);
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid "+T.border,opacity:unlocked?1:0.35}}>
                    <div style={{fontSize:32,flexShrink:0,width:42,textAlign:"center"}}>{stage.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <span style={{fontSize:13,fontWeight:700,color:isCur?activePet.color:unlocked?T.text:T.faint}}>{stage.form}</span>
                        {isCur && <span style={{fontSize:9,background:activePet.color,color:"#030712",borderRadius:4,padding:"1px 6px",fontFamily:"'DM Mono',monospace",fontWeight:700}}>NOW</span>}
                        {!unlocked && <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>Lv{stage.level} needed</span>}
                      </div>
                      <div style={{fontSize:11,color:T.faint,fontStyle:"italic"}}>{stage.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>HOW TO EARN XP</div>
              {[["🍽️","Log any meal","+10 XP"],["🍽️","Log 3+ meals per day","+10 XP"],["🔥","Hit calorie goal ±15%","+15 XP"],["💪","Hit protein goal 90%+","+20 XP"],["⚡","Daily streak x3 per day","up to +30"],["🏆","Meal score 80+","+15 XP"],["👍","Meal score 65–79","+8 XP"],["🌅","Complete a full day","bonus XP"]].map(function(x){return(
                <div key={x[1]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+T.border}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14}}>{x[0]}</span><span style={{fontSize:12,color:T.sub}}>{x[1]}</span></div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#fbbf24",fontWeight:700}}>{x[2]}</span>
                </div>
              );})}
            </div>
          </div>
        )}
      </div>
    )}

    {tab==="info" && (
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"20px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:T.accent,marginBottom:6}}>FUEL TRACK GUIDE</div>
          <div style={{fontSize:13,color:T.sub,lineHeight:1.7}}>A nutrition RPG — log meals, earn XP, evolve your pet, and crush your goals every day.</div>
        </div>
        {[
          {icon:"👤",title:"ACCOUNTS",color:"#94a3b8",steps:["Create a free account with any username and password","All your data — meals, pets, goals, themes — saves to your account","Log out and log back in from any browser to access your data","Multiple people can have their own accounts on the same device"]},
          {icon:"🍳",title:"BUILD AND LOG A MEAL",color:"#34d399",steps:["Tap BUILD in the bottom nav","Type a name for your meal","Browse 15+ food categories and tap any food card to add it","Tap the same food again to add another serving","Use the minus and plus buttons to fine-tune servings","Tap SAVE to store the meal as a template to reuse","Tap LOG to add it to today and see your meal score instantly"]},
          {icon:"🏆",title:"MEAL SCORING — 0 to 100",color:"#f97316",steps:["PROTEIN EFFICIENCY 0-40 pts: protein per calorie — high protein per cal earns the most points","CALORIE FIT 0-25 pts: how well the meal fits your remaining daily budget","FIBER BONUS 0-15 pts: fiber content vs your daily fiber goal","SODIUM PENALTY up to -10 pts: deducted if meal is over 50 percent of your sodium goal","FAT BALANCE 0-10 pts: fat ratio vs expected for the calorie count","SUGAR -5 to +10 pts: low sugar earns bonus points, high sugar loses points","S grade = 90+, A = 80+, B = 70+, C = 55+, D = 40+, F = below 40","After scoring the app shows specific tips on how to improve your next meal"]},
          {icon:"🐾",title:"PETS AND EVOLUTION",color:"#8b5cf6",steps:["Choose from 10 pets: Dog, Cat, Dragon, Kraken, Unicorn, Koi, Turtle, Phoenix, Wolf, Bear","Every pet starts as a baby and evolves through 5 unique stages as you level up","Dragon: tiny egg to baby serpent to young drake to fire drake to the Mega Dragon","Kraken: tiny squid to baby octopus to sea beast to deep terror to Kraken Lord","Unicorn: magic foal to young unicorn to shining unicorn to celestial steed to Divine Unicorn","Max a pet at 6000 XP to unlock it in your Pet Zoo forever","Switch active pets at any time without losing any XP progress on other pets"]},
          {icon:"🏛️",title:"PET ZOO",color:"#fbbf24",steps:["The Zoo stores every pet you have maxed out at GOD MODE which requires 6000 XP","Maxed pets stay in your Zoo permanently even if you switch to a different active pet","Collect all 10 pets to complete the Zoo","Tap ZOO from the Pet tab or the Home screen to see your collection"]},
          {icon:"🎯",title:"DAILY GOALS",color:"#60a5fa",steps:["Tap the target icon in the top header to open goal settings","Set personal daily targets for calories, protein, carbs, fat, fiber, sugar, and sodium","Tap SAVE GOALS to lock them in permanently","All scoring, rings, and progress bars update to match your personal targets"]},
          {icon:"🎨",title:"THEMES",color:"#ec4899",steps:["Tap the palette icon in the header to open the theme picker","Choose from 27 themes across Dark, Light, and Vibrant categories","Your theme choice saves automatically to your account"]},
        ].map(function(sec){return(
          <div key={sec.title} style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{fontSize:22}}>{sec.icon}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:sec.color}}>{sec.title}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {sec.steps.map(function(step,i){return(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:18,height:18,borderRadius:99,background:sec.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:"#030712",fontFamily:"'DM Mono',monospace",marginTop:2}}>{i+1}</div>
                  <div style={{fontSize:13,color:T.sub,lineHeight:1.5}}>{step}</div>
                </div>
              );})}
            </div>
          </div>
        );})}
      </div>
    )}

  </div>

  <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:"1px solid "+T.border,display:"flex",zIndex:60,maxWidth:520,margin:"0 auto"}}>
    {[
      {id:"home",  icon:"🏠",  label:"HOME"},
      {id:"log",   icon:"📋",  label:"LOG"},
      {id:"build", icon:"🍳",  label:"BUILD"},
      {id:"pet",   icon:activePetId&&petStage?petStage.emoji:"🐾", label:"PET"},
      {id:"info",  icon:"ℹ️",  label:"GUIDE"},
    ].map(function(nav){return(
      <button key={nav.id} style={navSt(tab===nav.id)} onClick={function(){setTab(nav.id);}}>
        <span style={{fontSize:17}}>{nav.icon}</span>
        <span>{nav.label}</span>
        {nav.id==="log" && meals.length>0 && <span style={{position:"absolute",top:6,background:T.accent,color:"#030712",borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 5px",fontFamily:"'DM Mono',monospace"}}>{meals.length}</span>}
      </button>
    );})}
  </div>
</div>
```

);
}
