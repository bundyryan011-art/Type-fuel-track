import { useState, useRef, useEffect } from "react";

const DEFAULT_GOALS = { calories:1550, protein:180, carbs:200, fat:70, fiber:38, sugar:50, sodium:2300 };

const PETS = [
  {
    id:"dog", name:"Biscuit", color:"#f59e0b",
    desc:"A loyal companion who grows from a tiny pup into a legendary guardian.",
    stages:[
      { level:1,  form:"Tiny Pup",        emoji:"🐶", description:"A wobbly little puppy just finding its legs." },
      { level:3,  form:"Playful Pup",     emoji:"🐕", description:"Energetic and bouncy, tail always wagging." },
      { level:5,  form:"Young Dog",       emoji:"🦮", description:"Growing fast, strong and loyal." },
      { level:7,  form:"Guardian Dog",    emoji:"🐕‍🦺", description:"A powerful trained companion by your side." },
      { level:10, form:"Legendary Hound", emoji:"🐺", description:"A mythic beast — feared and respected by all." },
    ],
  },
  {
    id:"cat", name:"Whisper", color:"#8b5cf6",
    desc:"Mysterious and precise. Evolves from a tiny kitten into a shadow panther.",
    stages:[
      { level:1,  form:"Tiny Kitten",   emoji:"🐱", description:"A small fluffy kitten, curious about everything." },
      { level:3,  form:"Young Cat",     emoji:"🐈", description:"Quick and clever, always one step ahead." },
      { level:5,  form:"Sleek Cat",     emoji:"🐈‍⬛", description:"Graceful and precise — just like your macros." },
      { level:7,  form:"Night Panther", emoji:"🐆", description:"A powerful predator, silently dominant." },
      { level:10, form:"Shadow Lord",   emoji:"🌑🐈‍⬛", description:"An ethereal being woven from darkness and starlight." },
    ],
  },
  {
    id:"dragon", name:"Ember", color:"#ef4444",
    desc:"Starts as a tiny egg, hatches into a serpent, evolves into a world-ending fire dragon.",
    stages:[
      { level:1,  form:"Dragon Egg",   emoji:"🥚", description:"A glowing egg pulsing with ancient power." },
      { level:3,  form:"Baby Serpent", emoji:"🐍", description:"A tiny snake-like hatchling, still finding its fire." },
      { level:5,  form:"Young Drake",  emoji:"🦎", description:"Wings sprouted. First flames crackle." },
      { level:7,  form:"Fire Drake",   emoji:"🐲", description:"A fearsome drake, scorching everything in sight." },
      { level:10, form:"Mega Dragon",  emoji:"🐉", description:"A colossal fire-breathing god. Maximum power." },
    ],
  },
  {
    id:"kraken", name:"Inkwell", color:"#06b6d4",
    desc:"From a tiny squid to the legendary Kraken Lord. Rises from the deep.",
    stages:[
      { level:1,  form:"Tiny Squid",   emoji:"🦑", description:"A small squid barely bigger than your thumb." },
      { level:3,  form:"Baby Octopus", emoji:"🐙", description:"Arms growing, already curious and crafty." },
      { level:5,  form:"Sea Beast",    emoji:"🦈", description:"Lurks the deep, a growing threat to sailors." },
      { level:7,  form:"Deep Terror",  emoji:"🌊🦑", description:"Massive and terrifying, commands the deep." },
      { level:10, form:"Kraken Lord",  emoji:"🦑", description:"The ancient Kraken rises. All seas bow." },
    ],
  },
  {
    id:"unicorn", name:"Luna", color:"#ec4899",
    desc:"A magical foal that transforms into a divine unicorn radiating celestial light.",
    stages:[
      { level:1,  form:"Magic Foal",      emoji:"🐴", description:"A tiny magical foal, horn just beginning to show." },
      { level:3,  form:"Young Unicorn",   emoji:"🦄", description:"Horn glowing softly, magic awakening." },
      { level:5,  form:"Shining Unicorn", emoji:"✨🦄", description:"Radiates light, leaves stardust in its wake." },
      { level:7,  form:"Celestial Steed", emoji:"🌟🦄", description:"Gallops between stars, power without limit." },
      { level:10, form:"Divine Unicorn",  emoji:"🌈🦄", description:"A god among creatures. Rainbows bow to its will." },
    ],
  },
  {
    id:"koi", name:"Ripple", color:"#f97316",
    desc:"A tiny fish that transforms through rare stages into the legendary Celestial Dragon Koi.",
    stages:[
      { level:1,  form:"Baby Fish",    emoji:"🐟", description:"A tiny goldfish, barely a flicker in the water." },
      { level:3,  form:"Young Koi",   emoji:"🐠", description:"Growing fins, beginning to show its true colors." },
      { level:5,  form:"Dragon Koi",  emoji:"🐡", description:"Shimmering scales catch every light. Rare and proud." },
      { level:7,  form:"River Spirit",emoji:"🌊🐟", description:"A spiritual fish, revered across all waters." },
      { level:10, form:"Celestial Koi",emoji:"🐉🐟", description:"The mythic Dragon Koi. Swims through clouds." },
    ],
  },
  {
    id:"turtle", name:"Shell", color:"#22c55e",
    desc:"Starts as a tiny hatchling and slowly grows into the Ancient Titan. Unstoppable.",
    stages:[
      { level:1,  form:"Sand Hatchling", emoji:"🐣", description:"A tiny hatchling crawling toward the ocean." },
      { level:3,  form:"Baby Turtle",    emoji:"🐢", description:"Shell hardening, paddling with newfound purpose." },
      { level:5,  form:"Sea Turtle",     emoji:"🌊🐢", description:"Gliding through deep waters with ancient grace." },
      { level:7,  form:"Ocean Elder",    emoji:"🏝️🐢", description:"Carries entire ecosystems on its back." },
      { level:10, form:"Ancient Titan",  emoji:"🏔️🐢", description:"A living island. Mountains bow. Oceans part." },
    ],
  },
];

const PET_LEVELS = [
  { level:1,  name:"Newborn",  xpRequired:0,    emoji_modifier:"" },
  { level:2,  name:"Baby",     xpRequired:100,  emoji_modifier:"" },
  { level:3,  name:"Young",    xpRequired:250,  emoji_modifier:"✨" },
  { level:4,  name:"Growing",  xpRequired:500,  emoji_modifier:"✨" },
  { level:5,  name:"Evolved",  xpRequired:900,  emoji_modifier:"⚡" },
  { level:6,  name:"Strong",   xpRequired:1400, emoji_modifier:"⚡" },
  { level:7,  name:"Powerful", xpRequired:2100, emoji_modifier:"🔥" },
  { level:8,  name:"Champion", xpRequired:3000, emoji_modifier:"🔥" },
  { level:9,  name:"Legend",   xpRequired:4200, emoji_modifier:"👑" },
  { level:10, name:"GOD MODE", xpRequired:6000, emoji_modifier:"👑" },
];

function getPetLevel(xp) {
  let cur = PET_LEVELS[0];
  for (const lvl of PET_LEVELS) { if (xp >= lvl.xpRequired) cur = lvl; else break; }
  const next = PET_LEVELS.find(l => l.xpRequired > xp);
  const progress = next ? ((xp - cur.xpRequired) / (next.xpRequired - cur.xpRequired)) * 100 : 100;
  return { ...cur, next, progress, xp };
}

function getPetStage(petInfo, level) {
  if (!petInfo || !petInfo.stages) return null;
  let cur = petInfo.stages[0];
  for (const s of petInfo.stages) { if (level >= s.level) cur = s; else break; }
  return cur;
}

const PRESET_CATEGORIES = [
  { label:"🥚 Eggs & Dairy", foods:[
    { name:"Egg (whole, large)",          emoji:"🥚", calories:72,  protein:6,   carbs:0.4, fat:5,   fiber:0, sugar:0.4, sodium:71  },
    { name:"Egg White (large)",           emoji:"🥚", calories:17,  protein:3.6, carbs:0.2, fat:0.1, fiber:0, sugar:0.2, sodium:55  },
    { name:"Egg (2 whole)",               emoji:"🥚", calories:143, protein:12,  carbs:0.7, fat:10,  fiber:0, sugar:0.7, sodium:142 },
    { name:"Egg (3 whole)",               emoji:"🥚", calories:215, protein:18,  carbs:1.1, fat:15,  fiber:0, sugar:1.1, sodium:213 },
    { name:"Greek Yogurt nonfat (1 cup)", emoji:"🫙", calories:100, protein:17,  carbs:6,   fat:0,   fiber:0, sugar:6,   sodium:65  },
    { name:"Greek Yogurt 2% (1 cup)",     emoji:"🫙", calories:150, protein:17,  carbs:8,   fat:4,   fiber:0, sugar:7,   sodium:65  },
    { name:"Cottage Cheese (1/2 cup)",    emoji:"🫙", calories:90,  protein:12,  carbs:5,   fat:2.5, fiber:0, sugar:4,   sodium:360 },
    { name:"Cottage Cheese (1 cup)",      emoji:"🫙", calories:180, protein:24,  carbs:10,  fat:5,   fiber:0, sugar:8,   sodium:720 },
    { name:"Milk 2% (1 cup)",             emoji:"🥛", calories:122, protein:8,   carbs:12,  fat:5,   fiber:0, sugar:12,  sodium:115 },
    { name:"Cheddar Cheese (1 oz)",       emoji:"🧀", calories:115, protein:7,   carbs:0.4, fat:9,   fiber:0, sugar:0.1, sodium:185 },
    { name:"String Cheese (1 stick)",     emoji:"🧀", calories:80,  protein:7,   carbs:1,   fat:5,   fiber:0, sugar:0,   sodium:200 },
    { name:"Cream Cheese (2 tbsp)",       emoji:"🧀", calories:99,  protein:1.8, carbs:1.6, fat:10,  fiber:0, sugar:1.3, sodium:90  },
  ]},
  { label:"🍗 Chicken & Turkey", foods:[
    { name:"Chicken Breast (2 oz)",  emoji:"🍗", calories:92,  protein:17, carbs:0, fat:2,  fiber:0, sugar:0, sodium:37  },
    { name:"Chicken Breast (3 oz)",  emoji:"🍗", calories:139, protein:26, carbs:0, fat:3,  fiber:0, sugar:0, sodium:56  },
    { name:"Chicken Breast (4 oz)",  emoji:"🍗", calories:185, protein:35, carbs:0, fat:4,  fiber:0, sugar:0, sodium:75  },
    { name:"Chicken Breast (5 oz)",  emoji:"🍗", calories:231, protein:43, carbs:0, fat:5,  fiber:0, sugar:0, sodium:94  },
    { name:"Chicken Breast (6 oz)",  emoji:"🍗", calories:278, protein:52, carbs:0, fat:6,  fiber:0, sugar:0, sodium:112 },
    { name:"Chicken Breast (7 oz)",  emoji:"🍗", calories:324, protein:61, carbs:0, fat:7,  fiber:0, sugar:0, sodium:131 },
    { name:"Chicken Breast (8 oz)",  emoji:"🍗", calories:370, protein:69, carbs:0, fat:8,  fiber:0, sugar:0, sodium:150 },
    { name:"Chicken Breast (10 oz)", emoji:"🍗", calories:463, protein:87, carbs:0, fat:10, fiber:0, sugar:0, sodium:188 },
    { name:"Chicken Thigh (4 oz)",   emoji:"🍗", calories:209, protein:28, carbs:0, fat:10, fiber:0, sugar:0, sodium:95  },
    { name:"Chicken Thigh (6 oz)",   emoji:"🍗", calories:314, protein:42, carbs:0, fat:15, fiber:0, sugar:0, sodium:143 },
    { name:"Chicken Thigh (8 oz)",   emoji:"🍗", calories:418, protein:56, carbs:0, fat:20, fiber:0, sugar:0, sodium:190 },
    { name:"Ground Turkey (4 oz)",   emoji:"🦃", calories:170, protein:22, carbs:0, fat:9,  fiber:0, sugar:0, sodium:75  },
    { name:"Ground Turkey (6 oz)",   emoji:"🦃", calories:255, protein:33, carbs:0, fat:13, fiber:0, sugar:0, sodium:113 },
    { name:"Ground Turkey (8 oz)",   emoji:"🦃", calories:340, protein:44, carbs:0, fat:18, fiber:0, sugar:0, sodium:150 },
    { name:"Turkey Breast deli (3 oz)", emoji:"🦃", calories:90, protein:18, carbs:1, fat:1, fiber:0, sugar:0, sodium:570 },
  ]},
  { label:"🥩 Beef & Pork", foods:[
    { name:"Ground Beef 90% (4 oz)", emoji:"🥩", calories:196, protein:24, carbs:0, fat:11, fiber:0, sugar:0, sodium:75  },
    { name:"Ground Beef 90% (6 oz)", emoji:"🥩", calories:294, protein:36, carbs:0, fat:16, fiber:0, sugar:0, sodium:113 },
    { name:"Ground Beef 90% (8 oz)", emoji:"🥩", calories:392, protein:48, carbs:0, fat:22, fiber:0, sugar:0, sodium:150 },
    { name:"Sirloin Steak (4 oz)",   emoji:"🥩", calories:213, protein:31, carbs:0, fat:9,  fiber:0, sugar:0, sodium:60  },
    { name:"Sirloin Steak (6 oz)",   emoji:"🥩", calories:320, protein:46, carbs:0, fat:14, fiber:0, sugar:0, sodium:90  },
    { name:"Sirloin Steak (8 oz)",   emoji:"🥩", calories:426, protein:61, carbs:0, fat:18, fiber:0, sugar:0, sodium:120 },
    { name:"Bacon (2 strips)",       emoji:"🥓", calories:86,  protein:6,  carbs:0.1, fat:7,  fiber:0, sugar:0, sodium:368 },
    { name:"Bacon (4 strips)",       emoji:"🥓", calories:172, protein:12, carbs:0.2, fat:14, fiber:0, sugar:0, sodium:736 },
    { name:"Pork Tenderloin (4 oz)", emoji:"🥩", calories:140, protein:24, carbs:0, fat:4, fiber:0, sugar:0, sodium:60 },
    { name:"Hot Dog (1)",            emoji:"🌭", calories:180, protein:7, carbs:2, fat:16, fiber:0, sugar:1, sodium:550 },
  ]},
  { label:"🐟 Fish & Seafood", foods:[
    { name:"Salmon (4 oz)",    emoji:"🐟", calories:234, protein:31, carbs:0, fat:12,  fiber:0, sugar:0, sodium:64  },
    { name:"Salmon (6 oz)",    emoji:"🐟", calories:351, protein:47, carbs:0, fat:18,  fiber:0, sugar:0, sodium:96  },
    { name:"Salmon (8 oz)",    emoji:"🐟", calories:468, protein:62, carbs:0, fat:24,  fiber:0, sugar:0, sodium:128 },
    { name:"Tuna can (water)", emoji:"🐟", calories:109, protein:25, carbs:0, fat:1,   fiber:0, sugar:0, sodium:303 },
    { name:"Shrimp (4 oz)",    emoji:"🦐", calories:112, protein:24, carbs:0, fat:1.5, fiber:0, sugar:0, sodium:190 },
    { name:"Shrimp (6 oz)",    emoji:"🦐", calories:168, protein:36, carbs:0, fat:2,   fiber:0, sugar:0, sodium:285 },
    { name:"Tilapia (4 oz)",   emoji:"🐟", calories:145, protein:30, carbs:0, fat:2.5, fiber:0, sugar:0, sodium:75  },
    { name:"Cod (4 oz)",       emoji:"🐟", calories:96,  protein:21, carbs:0, fat:0.8, fiber:0, sugar:0, sodium:62  },
    { name:"Sardines (1 can)", emoji:"🐟", calories:191, protein:23, carbs:0, fat:11,  fiber:0, sugar:0, sodium:465 },
  ]},
  { label:"🍚 Grains & Carbs", foods:[
    { name:"White Rice (1/2 cup)",  emoji:"🍚", calories:103, protein:2,  carbs:22, fat:0.2, fiber:0.3, sugar:0,   sodium:1   },
    { name:"White Rice (1 cup)",    emoji:"🍚", calories:206, protein:4,  carbs:45, fat:0.4, fiber:0.6, sugar:0,   sodium:2   },
    { name:"White Rice (1.5 cups)", emoji:"🍚", calories:309, protein:6,  carbs:67, fat:0.6, fiber:0.9, sugar:0,   sodium:3   },
    { name:"Brown Rice (1 cup)",    emoji:"🍚", calories:216, protein:5,  carbs:45, fat:1.8, fiber:3.5, sugar:0,   sodium:10  },
    { name:"Quinoa (1 cup)",        emoji:"🌾", calories:222, protein:8,  carbs:39, fat:4,   fiber:5,   sugar:1.6, sodium:13  },
    { name:"Oatmeal (1 cup)",       emoji:"🥣", calories:158, protein:6,  carbs:27, fat:3,   fiber:4,   sugar:0,   sodium:115 },
    { name:"Sweet Potato small",    emoji:"🍠", calories:60,  protein:1,  carbs:14, fat:0,   fiber:2,   sugar:4,   sodium:24  },
    { name:"Sweet Potato medium",   emoji:"🍠", calories:103, protein:2,  carbs:24, fat:0.1, fiber:3.8, sugar:7,   sodium:41  },
    { name:"Sweet Potato large",    emoji:"🍠", calories:162, protein:3,  carbs:37, fat:0.2, fiber:5.9, sugar:12,  sodium:65  },
    { name:"White Potato medium",   emoji:"🥔", calories:163, protein:4,  carbs:37, fat:0.2, fiber:3.8, sugar:1.7, sodium:13  },
    { name:"Bread WW (1 slice)",    emoji:"🍞", calories:81,  protein:4,  carbs:14, fat:1,   fiber:1.9, sugar:1.4, sodium:147 },
    { name:"Bagel plain",           emoji:"🥯", calories:270, protein:11, carbs:53, fat:1.5, fiber:2,   sugar:6,   sodium:430 },
    { name:"Pasta (1 cup cooked)",  emoji:"🍝", calories:220, protein:8,  carbs:43, fat:1.3, fiber:2.5, sugar:0.6, sodium:1   },
    { name:"Tortilla large flour",  emoji:"🫓", calories:218, protein:6,  carbs:36, fat:5,   fiber:2,   sugar:1,   sodium:440 },
    { name:"Carb Balance Tortilla", emoji:"🫓", calories:110, protein:5,  carbs:22, fat:3,   fiber:11,  sugar:0,   sodium:380 },
    { name:"Rice Cakes (2)",        emoji:"🍘", calories:70,  protein:1,  carbs:15, fat:0.5, fiber:0.3, sugar:0,   sodium:58  },
  ]},
  { label:"🥗 Vegetables", foods:[
    { name:"Broccoli (1 cup)",      emoji:"🥦", calories:55,  protein:4,   carbs:11, fat:0.6, fiber:5,   sugar:2,   sodium:64  },
    { name:"Broccoli (2 cups)",     emoji:"🥦", calories:110, protein:8,   carbs:22, fat:1.2, fiber:10,  sugar:4,   sodium:128 },
    { name:"Spinach (2 cups raw)",  emoji:"🥬", calories:14,  protein:1.7, carbs:2,  fat:0.2, fiber:1.3, sugar:0.2, sodium:48  },
    { name:"Kale (2 cups raw)",     emoji:"🥬", calories:67,  protein:4.4, carbs:12, fat:0.9, fiber:2.6, sugar:0,   sodium:58  },
    { name:"Mixed Greens (2 cups)", emoji:"🥗", calories:18,  protein:1.5, carbs:3,  fat:0.2, fiber:1.5, sugar:1,   sodium:35  },
    { name:"Avocado (1/2)",         emoji:"🥑", calories:120, protein:1.5, carbs:6,  fat:11,  fiber:5,   sugar:0.5, sodium:5   },
    { name:"Avocado (whole)",       emoji:"🥑", calories:240, protein:3,   carbs:12, fat:22,  fiber:10,  sugar:1,   sodium:10  },
    { name:"Bell Pepper (1 med)",   emoji:"🫑", calories:31,  protein:1,   carbs:7,  fat:0.3, fiber:2.5, sugar:3.7, sodium:4   },
    { name:"Asparagus (6 spears)",  emoji:"🌿", calories:20,  protein:2,   carbs:3,  fat:0.2, fiber:2,   sugar:1,   sodium:13  },
    { name:"Green Beans (1 cup)",   emoji:"🫛", calories:44,  protein:2,   carbs:10, fat:0.4, fiber:4,   sugar:5,   sodium:1   },
    { name:"Cucumber (1 cup)",      emoji:"🥒", calories:16,  protein:0.7, carbs:3.8,fat:0.1, fiber:0.5, sugar:2,   sodium:2   },
    { name:"Tomato (1 med)",        emoji:"🍅", calories:22,  protein:1.1, carbs:4.8,fat:0.2, fiber:1.5, sugar:3.2, sodium:6   },
    { name:"Mushrooms (1 cup)",     emoji:"🍄", calories:21,  protein:3,   carbs:3,  fat:0.3, fiber:1,   sugar:2,   sodium:4   },
    { name:"Carrots (1 cup)",       emoji:"🥕", calories:52,  protein:1.2, carbs:12, fat:0.3, fiber:3.6, sugar:6,   sodium:88  },
    { name:"Corn (1 ear)",          emoji:"🌽", calories:132, protein:4.9, carbs:29, fat:1.8, fiber:3.6, sugar:9,   sodium:21  },
    { name:"Edamame (1/2 cup)",     emoji:"🫘", calories:94,  protein:9,   carbs:8,  fat:4,   fiber:4,   sugar:2,   sodium:9   },
  ]},
  { label:"🍎 Fruits", foods:[
    { name:"Banana medium",        emoji:"🍌", calories:105, protein:1.3, carbs:27, fat:0.4, fiber:3.1, sugar:14, sodium:1 },
    { name:"Apple medium",         emoji:"🍎", calories:95,  protein:0.5, carbs:25, fat:0.3, fiber:4.4, sugar:19, sodium:2 },
    { name:"Strawberries (1 cup)", emoji:"🍓", calories:49,  protein:1,   carbs:12, fat:0.5, fiber:3,   sugar:7,  sodium:2 },
    { name:"Blueberries (1 cup)",  emoji:"🫐", calories:84,  protein:1.1, carbs:21, fat:0.5, fiber:3.6, sugar:15, sodium:1 },
    { name:"Orange medium",        emoji:"🍊", calories:62,  protein:1.2, carbs:15, fat:0.2, fiber:3.1, sugar:12, sodium:0 },
    { name:"Mango (1 cup)",        emoji:"🥭", calories:99,  protein:1.4, carbs:25, fat:0.6, fiber:2.6, sugar:23, sodium:2 },
    { name:"Raspberries (1 cup)",  emoji:"🫐", calories:64,  protein:1.5, carbs:15, fat:0.8, fiber:8,   sugar:5,  sodium:1 },
    { name:"Watermelon (2 cups)",  emoji:"🍉", calories:86,  protein:1.7, carbs:22, fat:0.4, fiber:1.1, sugar:18, sodium:4 },
  ]},
  { label:"🥜 Nuts & Seeds", foods:[
    { name:"Almonds (1 oz)",         emoji:"🌰", calories:164, protein:6,   carbs:6,  fat:14,  fiber:3.5, sugar:1.2, sodium:0   },
    { name:"Walnuts (1 oz)",         emoji:"🌰", calories:185, protein:4.3, carbs:4,  fat:18,  fiber:1.9, sugar:0.7, sodium:1   },
    { name:"Peanut Butter (1 tbsp)", emoji:"🥜", calories:94,  protein:4,   carbs:3,  fat:8,   fiber:1,   sugar:1.5, sodium:76  },
    { name:"Peanut Butter (2 tbsp)", emoji:"🥜", calories:188, protein:8,   carbs:6,  fat:16,  fiber:2,   sugar:3,   sodium:152 },
    { name:"Almond Butter (2 tbsp)", emoji:"🌰", calories:196, protein:7,   carbs:6,  fat:18,  fiber:3.3, sugar:1.7, sodium:72  },
    { name:"Chia Seeds (2 tbsp)",    emoji:"🌱", calories:138, protein:4.7, carbs:12, fat:8.7, fiber:9.8, sugar:0,   sodium:5   },
    { name:"Mixed Nuts (1 oz)",      emoji:"🌰", calories:173, protein:5,   carbs:6,  fat:16,  fiber:2,   sugar:1.3, sodium:110 },
  ]},
  { label:"💪 Protein Bars & Shakes", foods:[
    { name:"Quest Bar avg",               emoji:"💪", calories:200, protein:21, carbs:22, fat:8,   fiber:14, sugar:1,  sodium:250 },
    { name:"RXBar avg",                   emoji:"💪", calories:210, protein:12, carbs:24, fat:9,   fiber:5,  sugar:13, sodium:260 },
    { name:"ONE Bar avg",                 emoji:"💪", calories:220, protein:20, carbs:23, fat:7,   fiber:10, sugar:1,  sodium:220 },
    { name:"Barebells Protein Bar",       emoji:"💪", calories:200, protein:20, carbs:20, fat:7,   fiber:6,  sugar:2,  sodium:150 },
    { name:"Premier Protein Shake",       emoji:"🥤", calories:160, protein:30, carbs:6,  fat:3,   fiber:1,  sugar:1,  sodium:390 },
    { name:"Fairlife Core Power",         emoji:"🥤", calories:230, protein:42, carbs:13, fat:3.5, fiber:0,  sugar:11, sodium:280 },
    { name:"Protein Shake 1 scoop avg",   emoji:"🥤", calories:120, protein:25, carbs:5,  fat:2,   fiber:1,  sugar:2,  sodium:150 },
    { name:"Isopure Zero Carb (1 scoop)", emoji:"🥤", calories:110, protein:25, carbs:0,  fat:0.5, fiber:0,  sugar:0,  sodium:140 },
    { name:"ON Gold Standard (1 scoop)",  emoji:"🥤", calories:120, protein:24, carbs:3,  fat:1,   fiber:1,  sugar:1,  sodium:130 },
  ]},
  { label:"🥣 Breakfast Foods", foods:[
    { name:"Pancakes (3 med)",        emoji:"🥞", calories:345, protein:9,  carbs:57, fat:10,  fiber:1.5, sugar:8,  sodium:730 },
    { name:"Waffle (1 large)",        emoji:"🧇", calories:220, protein:6,  carbs:25, fat:11,  fiber:1,   sugar:4,  sodium:380 },
    { name:"Cheerios (1 cup)",        emoji:"🥣", calories:100, protein:3,  carbs:20, fat:2,   fiber:3,   sugar:1,  sodium:140 },
    { name:"Granola (1/2 cup)",       emoji:"🥣", calories:209, protein:5,  carbs:36, fat:6,   fiber:3,   sugar:12, sodium:14  },
    { name:"Pop-Tart (1)",            emoji:"🍰", calories:200, protein:2,  carbs:37, fat:5,   fiber:0.5, sugar:16, sodium:170 },
    { name:"Bagel + Cream Cheese",    emoji:"🥯", calories:369, protein:13, carbs:54, fat:12,  fiber:2,   sugar:7,  sodium:520 },
  ]},
  { label:"🍔 Fast Food", foods:[
    { name:"McDouble",                  emoji:"🍔", calories:400, protein:22, carbs:33, fat:20, fiber:2,  sugar:7,  sodium:840  },
    { name:"Big Mac",                   emoji:"🍔", calories:550, protein:25, carbs:46, fat:30, fiber:3,  sugar:9,  sodium:1010 },
    { name:"McD Fries Medium",          emoji:"🍟", calories:320, protein:4,  carbs:44, fat:15, fiber:3,  sugar:0,  sodium:400  },
    { name:"Chick-fil-A Sandwich",      emoji:"🍔", calories:440, protein:28, carbs:40, fat:19, fiber:1,  sugar:5,  sodium:1350 },
    { name:"Chick-fil-A Nuggets 8pc",   emoji:"🍗", calories:260, protein:26, carbs:11, fat:12, fiber:0,  sugar:1,  sodium:1010 },
    { name:"Chipotle Chicken Bowl",     emoji:"🥙", calories:655, protein:51, carbs:62, fat:21, fiber:11, sugar:5,  sodium:1810 },
    { name:"Subway 6in Turkey",         emoji:"🥖", calories:280, protein:18, carbs:46, fat:3.5,fiber:4,  sugar:7,  sodium:760  },
    { name:"Taco Bell Crunchy Taco",    emoji:"🌮", calories:170, protein:8,  carbs:13, fat:9,  fiber:3,  sugar:1,  sodium:310  },
    { name:"Raising Cane Chicken Fngr", emoji:"🍗", calories:145, protein:13, carbs:8,  fat:6,  fiber:0,  sugar:0,  sodium:360  },
    { name:"Panda Orange Chicken",      emoji:"🍊", calories:490, protein:26, carbs:67, fat:14, fiber:2,  sugar:35, sodium:820  },
  ]},
  { label:"🍕 Pizza & Snacks", foods:[
    { name:"Pizza Cheese (1 slice)",    emoji:"🍕", calories:285, protein:12, carbs:36, fat:10, fiber:2,   sugar:3,   sodium:640 },
    { name:"Pizza Pepperoni (1 slice)", emoji:"🍕", calories:313, protein:14, carbs:34, fat:13, fiber:2,   sugar:3,   sodium:760 },
    { name:"Popcorn air (3 cups)",      emoji:"🍿", calories:93,  protein:3,  carbs:19, fat:1,  fiber:3.6, sugar:0.2, sodium:2   },
    { name:"Chips potato (1 oz)",       emoji:"🥔", calories:152, protein:2,  carbs:15, fat:10, fiber:1,   sugar:0.1, sodium:148 },
    { name:"Beef Jerky (1 oz)",         emoji:"🥩", calories:116, protein:9.4,carbs:3.1,fat:7.3,fiber:0.5, sugar:2.6, sodium:506 },
    { name:"Cheese Stick (1)",          emoji:"🧀", calories:80,  protein:7,  carbs:1,  fat:5,  fiber:0,   sugar:0,   sodium:200 },
    { name:"Trail Mix (1/4 cup)",       emoji:"🌰", calories:173, protein:5,  carbs:17, fat:11, fiber:2,   sugar:8,   sodium:72  },
  ]},
  { label:"🍰 Sweets & Drinks", foods:[
    { name:"Dark Chocolate (1 oz)", emoji:"🍫", calories:170, protein:2,   carbs:13, fat:12, fiber:3,  sugar:7,  sodium:5   },
    { name:"Ice Cream (1/2 cup)",   emoji:"🍦", calories:207, protein:3.5, carbs:24, fat:11, fiber:0.7,sugar:21, sodium:80  },
    { name:"Cookie choc chip (1)",  emoji:"🍪", calories:148, protein:2,   carbs:19, fat:7,  fiber:1,  sugar:10, sodium:109 },
    { name:"Donut glazed",          emoji:"🍩", calories:269, protein:3,   carbs:31, fat:15, fiber:1,  sugar:14, sodium:319 },
    { name:"Gatorade (20 oz)",      emoji:"🥤", calories:140, protein:0,   carbs:36, fat:0,  fiber:0,  sugar:34, sodium:270 },
    { name:"Coffee black (8 oz)",   emoji:"☕", calories:5,   protein:0.3, carbs:0.7,fat:0.1,fiber:0,  sugar:0,  sodium:5   },
    { name:"Latte 16oz 2% milk",    emoji:"☕", calories:190, protein:13,  carbs:19, fat:7,  fiber:0,  sugar:17, sodium:150 },
    { name:"Beer regular (12 oz)",  emoji:"🍺", calories:153, protein:1.6, carbs:13, fat:0,  fiber:0,  sugar:0,  sodium:14  },
  ]},
  { label:"🫘 Legumes & Tofu", foods:[
    { name:"Black Beans (1/2 cup)",  emoji:"🫘", calories:114, protein:7.6, carbs:20, fat:0.5, fiber:7.5, sugar:0.3, sodium:1  },
    { name:"Black Beans (1 cup)",    emoji:"🫘", calories:228, protein:15,  carbs:40, fat:1,   fiber:15,  sugar:0.6, sodium:2  },
    { name:"Chickpeas (1/2 cup)",    emoji:"🫘", calories:134, protein:7,   carbs:22, fat:2.1, fiber:6,   sugar:3.9, sodium:5  },
    { name:"Lentils (1/2 cup)",      emoji:"🫘", calories:115, protein:9,   carbs:20, fat:0.4, fiber:7.8, sugar:1.8, sodium:2  },
    { name:"Tofu firm (4 oz)",       emoji:"🟦", calories:94,  protein:10,  carbs:2.3,fat:5,   fiber:0.3, sugar:0.5, sodium:94 },
    { name:"Tempeh (4 oz)",          emoji:"🟫", calories:222, protein:21,  carbs:11, fat:12,  fiber:7.3, sugar:0,   sodium:9  },
  ]},
  { label:"🫙 Sauces & Condiments", foods:[
    { name:"Olive Oil (1 tbsp)",      emoji:"🫒", calories:119, protein:0,   carbs:0,   fat:13.5, fiber:0,  sugar:0,   sodium:0   },
    { name:"Olive Oil (2 tbsp)",      emoji:"🫒", calories:238, protein:0,   carbs:0,   fat:27,   fiber:0,  sugar:0,   sodium:0   },
    { name:"Butter (1 tbsp)",         emoji:"🧈", calories:102, protein:0.1, carbs:0,   fat:11.5, fiber:0,  sugar:0,   sodium:82  },
    { name:"Ketchup (1 tbsp)",        emoji:"🍅", calories:17,  protein:0.2, carbs:4.6, fat:0,    fiber:0,  sugar:3.7, sodium:154 },
    { name:"Hot Sauce (1 tsp)",       emoji:"🌶️", calories:0,   protein:0,   carbs:0.1, fat:0,    fiber:0,  sugar:0,   sodium:124 },
    { name:"Soy Sauce (1 tbsp)",      emoji:"🫙", calories:11,  protein:1.3, carbs:1,   fat:0,    fiber:0,  sugar:0,   sodium:879 },
    { name:"BBQ Sauce (2 tbsp)",      emoji:"🫙", calories:58,  protein:0.5, carbs:14,  fat:0.1,  fiber:0,  sugar:11,  sodium:340 },
    { name:"Ranch (2 tbsp)",          emoji:"🥛", calories:73,  protein:0.4, carbs:1.4, fat:7.7,  fiber:0,  sugar:1,   sodium:122 },
    { name:"Honey (1 tbsp)",          emoji:"🍯", calories:64,  protein:0.1, carbs:17,  fat:0,    fiber:0,  sugar:17,  sodium:0   },
    { name:"Sriracha (1 tsp)",        emoji:"🌶️", calories:5,   protein:0.1, carbs:1,   fat:0.1,  fiber:0,  sugar:0.7, sodium:80  },
    { name:"Salsa (2 tbsp)",          emoji:"🍅", calories:10,  protein:0.5, carbs:2,   fat:0,    fiber:0.5,sugar:1,   sodium:230 },
    { name:"Guacamole (2 tbsp)",      emoji:"🥑", calories:45,  protein:0.5, carbs:2.5, fat:4,    fiber:1.5,sugar:0,   sodium:115 },
    { name:"Tahini (1 tbsp)",         emoji:"🫙", calories:89,  protein:2.6, carbs:3.2, fat:8,    fiber:1.4,sugar:0.1, sodium:17  },
  ]},
];

const THEMES = [
  { id:"obsidian", label:"Obsidian", swatch:"#030712", bg:"#030712", card:"#0a0f1a", card2:"#0f172a", border:"#1e293b", text:"#f1f5f9", textSub:"#94a3b8", textFaint:"#475569" },
  { id:"midnight", label:"Midnight", swatch:"#0d0d20", bg:"#0d0d20", card:"#14142e", card2:"#1a1a3d", border:"#2d2d60", text:"#e8e8ff", textSub:"#9090c0", textFaint:"#4a4a80" },
  { id:"forest",   label:"Forest",   swatch:"#041a08", bg:"#041a08", card:"#081f0c", card2:"#0d2a12", border:"#1a4a22", text:"#e0f5e5", textSub:"#80b890", textFaint:"#3a6a45" },
  { id:"navy",     label:"Navy",     swatch:"#030a1a", bg:"#030a1a", card:"#071428", card2:"#0a1c38", border:"#1a3560", text:"#ddeeff", textSub:"#7aaad0", textFaint:"#2a5080" },
  { id:"crimson",  label:"Crimson",  swatch:"#1a0208", bg:"#1a0208", card:"#22040c", card2:"#2c0610", border:"#5a1022", text:"#ffe0e8", textSub:"#c07080", textFaint:"#7a2030" },
  { id:"storm",    label:"Storm",    swatch:"#081018", bg:"#081018", card:"#0f1a24", card2:"#16222e", border:"#2a4055", text:"#d8eaf8", textSub:"#7aaac8", textFaint:"#2a5070" },
  { id:"snow",     label:"Snow",     swatch:"#c8d4e8", bg:"#e8edf5", card:"#f8fafc", card2:"#dde3ef", border:"#b0bdd0", text:"#0f172a", textSub:"#3a4a60", textFaint:"#6b7a90" },
  { id:"sky",      label:"Sky",      swatch:"#93c5fd", bg:"#dbeafe", card:"#bfdbfe", card2:"#93c5fd", border:"#3b82f6", text:"#072060", textSub:"#1d4ed8", textFaint:"#3b82f6" },
  { id:"sage",     label:"Sage",     swatch:"#86efac", bg:"#dcfce7", card:"#bbf7d0", card2:"#86efac", border:"#22c55e", text:"#052e16", textSub:"#15803d", textFaint:"#16a34a" },
  { id:"ocean",    label:"Ocean",    swatch:"#0077b6", bg:"#0077b6", card:"#0096c7", card2:"#00b4d8", border:"#48cae4", text:"#ffffff", textSub:"#caf0f8", textFaint:"#90e0ef" },
  { id:"emerald",  label:"Emerald",  swatch:"#065f46", bg:"#065f46", card:"#047857", card2:"#059669", border:"#34d399", text:"#ffffff", textSub:"#a7f3d0", textFaint:"#6ee7b7" },
  { id:"royal",    label:"Royal",    swatch:"#3730a3", bg:"#3730a3", card:"#4338ca", card2:"#4f46e5", border:"#818cf8", text:"#ffffff", textSub:"#c7d2fe", textFaint:"#a5b4fc" },
  { id:"rose",     label:"Rose",     swatch:"#9f1239", bg:"#9f1239", card:"#be123c", card2:"#e11d48", border:"#fb7185", text:"#ffffff", textSub:"#fecdd3", textFaint:"#fda4af" },
  { id:"amber",    label:"Amber",    swatch:"#92400e", bg:"#92400e", card:"#b45309", card2:"#d97706", border:"#fbbf24", text:"#ffffff", textSub:"#fde68a", textFaint:"#fcd34d" },
  { id:"sunset",   label:"Sunset",   swatch:"#c2410c", bg:"#c2410c", card:"#ea580c", card2:"#f97316", border:"#fdba74", text:"#ffffff", textSub:"#fed7aa", textFaint:"#fdba74" },
];

const MIME_MAP = {"image/jpeg":"image/jpeg","image/jpg":"image/jpeg","image/png":"image/png","image/webp":"image/webp","image/gif":"image/gif"};
function safeNum(v){const x=parseFloat(v);return isNaN(x)?0:x;}
function round1(x){return Math.round(safeNum(x)*10)/10;}
function extractJSON(text){
  if(!text||typeof text!=="string")return{parsed:null,error:"Empty"};
  const s=text.trim().replace(/```(?:json)?/gi,"").trim();
  const start=s.indexOf("{"),end=s.lastIndexOf("}");
  if(start===-1||end===-1||end<=start)return{parsed:null,error:"No JSON"};
  try{return{parsed:JSON.parse(s.slice(start,end+1)),error:null};}
  catch(e){return{parsed:null,error:"Parse failed"};}
}
function hasCS(){return typeof window!=="undefined"&&window.storage!=null&&typeof window.storage.set==="function";}
async function sSave(key,val){
  try{if(hasCS()){await window.storage.set(key,JSON.stringify(val));}else{localStorage.setItem(key,JSON.stringify(val));}}catch{}
}
async function sLoad(key){
  if(hasCS()){try{const r=await window.storage.get(key);return r&&r.value?JSON.parse(r.value):null;}catch{return null;}}
  try{const s=localStorage.getItem(key);return s?JSON.parse(s):null;}catch{return null;}
}
async function searchFood(query){
  try{
    const res=await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?query="+encodeURIComponent(query)+"&pageSize=6&api_key=DEMO_KEY");
    const data=await res.json();
    if(!data.foods||!data.foods.length)return[];
    return data.foods.map(f=>{
      const n=f.foodNutrients||[];
      const g=(id)=>{const x=n.find(y=>y.nutrientId===id||y.nutrientNumber===String(id));return x?Math.round(x.value*10)/10:0;};
      return{name:f.description,emoji:"🔍",brand:f.brandOwner||"",calories:g(1008)||g("208"),protein:g(1003)||g("203"),carbs:g(1005)||g("205"),fat:g(1004)||g("204"),fiber:g(1079)||g("291"),sugar:g(2000)||g("269"),sodium:g(1093)||g("307")};
    });
  }catch{return[];}
}
function scoreMeal(meal,goals,calsBefore){
  let score=0;const details=[];
  const pp100=(meal.calories>0?(meal.protein/meal.calories)*100:0);
  const ps=Math.min(40,Math.round(pp100*2.5));
  score+=ps;
  if(ps>=30)details.push({text:"High protein density",positive:true});
  else if(ps>=15)details.push({text:"Decent protein",positive:true});
  else details.push({text:"Low protein density",positive:false});
  const rem=goals.calories-calsBefore;
  const cs=meal.calories<=rem?Math.min(25,Math.round(25*(1-meal.calories/goals.calories))):0;
  score+=cs;
  if(meal.calories>rem)details.push({text:"Exceeds daily budget",positive:false});
  else if(cs>=15)details.push({text:"Great calorie fit",positive:true});
  const fs=Math.min(15,Math.round((meal.fiber/goals.fiber)*100*0.15));
  score+=fs;
  if(fs>=10)details.push({text:"Excellent fiber",positive:true});
  const sp=meal.sodium/goals.sodium>0.5?Math.min(10,Math.round((meal.sodium/goals.sodium-0.5)*20)):0;
  score-=sp;
  if(sp>=5)details.push({text:"High sodium",positive:false});
  const fr=meal.fat/(meal.calories*0.30/9);
  score+=fr<=1.2?Math.min(10,Math.round(10*(1-Math.abs(1-fr)*0.5))):0;
  const sr=meal.sugar/goals.sugar;
  const ss=sr<=0.3?10:sr<=0.5?5:sr>1?-5:0;
  score+=ss;
  if(ss<0)details.push({text:"High sugar",positive:false});
  const final=Math.max(0,Math.min(100,score));
  let grade="F",gc="#ef4444";
  if(final>=90){grade="S";gc="#fbbf24";}
  else if(final>=80){grade="A";gc="#34d399";}
  else if(final>=70){grade="B";gc="#60a5fa";}
  else if(final>=55){grade="C";gc="#a78bfa";}
  else if(final>=40){grade="D";gc="#fb923c";}
  return{score:final,grade,gradeColor:gc,details};
}

function CalRing({eaten,goal,T}){
  const pct=Math.min(eaten/goal,1),over=eaten>goal;
  const r=52,c=2*Math.PI*r,f=pct*c;
  const col=over?"#f87171":pct>=0.9?"#fbbf24":"#34d399";
  return(
    <div style={{display:"flex",alignItems:"center",gap:20}}>
      <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
        <svg width="120" height="120" style={{transform:"rotate(-90deg)",display:"block"}}>
          <circle cx="60" cy="60" r={r} fill="none" stroke={T.border} strokeWidth="10"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${f} ${c-f}`} style={{transition:"stroke-dasharray .6s"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:col,lineHeight:1}}>{eaten}</span>
          <span style={{fontSize:10,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>/{goal}</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:T.textSub,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>CALORIES TODAY</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:col,lineHeight:1,marginBottom:6}}>{over?"+"+( eaten-goal)+" OVER":(goal-eaten)+" LEFT"}</div>
        <div style={{width:140,height:4,background:T.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{width:`${Math.min(pct*100,100)}%`,height:"100%",background:col,borderRadius:99,transition:"width .6s"}}/>
        </div>
        <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginTop:4}}>{Math.round(pct*100)}% of {goal} kcal</div>
      </div>
    </div>
  );
}
function MacroBar({label,value,max,unit,color,T}){
  const over=value>max,pct=Math.min((value/max)*100,100);
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{label}</span>
        <span style={{fontSize:12,fontWeight:700,color:over?"#f87171":T.text,fontFamily:"'DM Mono',monospace"}}>{value}{unit} <span style={{color:T.textFaint,fontWeight:400}}>/ {max}{unit}</span></span>
      </div>
      <div style={{height:5,background:T.border,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:over?"#f87171":color,borderRadius:99,transition:"width .5s"}}/>
      </div>
    </div>
  );
}
function StatPill({label,value,unit,color,T}){
  return(
    <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:10,padding:"8px 12px",textAlign:"center",minWidth:64}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:T.textFaint,letterSpacing:"0.12em",marginBottom:2}}>{label}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color}}>{value}<span style={{fontSize:11,fontWeight:400}}>{unit}</span></div>
    </div>
  );
}

export default function App(){
  const [meals,setMeals]=useState([]);
  const [saved,setSaved]=useState([]);
  const [goals,setGoals]=useState(DEFAULT_GOALS);
  const [tab,setTab]=useState("home");
  const [confirm,setConfirm]=useState(false);
  const [themeId,setThemeId]=useState("obsidian");
  const [showTheme,setShowTheme]=useState(false);
  const [showGoals,setShowGoals]=useState(false);
  const [goalsForm,setGoalsForm]=useState(DEFAULT_GOALS);
  const [showSaved,setShowSaved]=useState(false);
  const [delSaved,setDelSaved]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [splash,setSplash]=useState(true);
  const [petId,setPetId]=useState(null);
  const [petXP,setPetXP]=useState(0);
  const [petName,setPetName]=useState("");
  const [showPetPick,setShowPetPick]=useState(false);
  const [xpPop,setXpPop]=useState(null);
  const [streak,setStreak]=useState(0);
  const [lastLog,setLastLog]=useState(null);
  const [mealName,setMealName]=useState("");
  const [ings,setIngs]=useState([]);
  const [mealErr,setMealErr]=useState("");
  const [cat,setCat]=useState(0);
  const [sq,setSq]=useState("");
  const [sr,setSr]=useState([]);
  const [searching,setSearching]=useState(false);
  const [searchErr,setSearchErr]=useState("");
  const [dragOver,setDragOver]=useState(false);
  const [coachMsg,setCoachMsg]=useState("");
  const [coachHist,setCoachHist]=useState([]);
  const [coachLoad,setCoachLoad]=useState(false);
  const [scoredMeal,setScoredMeal]=useState(null);
  const [photoSrc,setPhotoSrc]=useState(null);
  const [photoB64,setPhotoB64]=useState(null);
  const [photoMime,setPhotoMime]=useState("image/jpeg");
  const [scanning,setScanning]=useState(false);
  const [scanErr,setScanErr]=useState("");
  const fileRef=useRef();
  const T=THEMES.find(t=>t.id===themeId)||THEMES[0];
  const MACROS=[
    {key:"protein",label:"Protein",unit:"g", color:"#34d399",max:goals.protein},
    {key:"carbs",  label:"Carbs",  unit:"g", color:"#60a5fa",max:goals.carbs},
    {key:"fat",    label:"Fat",    unit:"g", color:"#fbbf24",max:goals.fat},
    {key:"fiber",  label:"Fiber",  unit:"g", color:"#a78bfa",max:goals.fiber},
    {key:"sugar",  label:"Sugar",  unit:"g", color:"#f472b6",max:goals.sugar},
    {key:"sodium", label:"Sodium", unit:"mg",color:"#fb923c",max:goals.sodium},
  ];
  const petInfo=petId?PETS.find(p=>p.id===petId):null;
  const petLevel=getPetLevel(petXP);
  const petStage=petInfo?getPetStage(petInfo,petLevel.level):null;

  useEffect(()=>{
    (async()=>{
      try{
        const m=await sLoad("ft-meals");
        const th=await sLoad("ft-theme");
        const sv=await sLoad("ft-saved");
        const g=await sLoad("ft-goals");
        const pid=await sLoad("ft-petid");
        const pxp=await sLoad("ft-petxp");
        const pn=await sLoad("ft-petname");
        const str=await sLoad("ft-streak");
        const ll=await sLoad("ft-lastlog");
        if(Array.isArray(m)&&m.length)setMeals(m);
        if(th&&THEMES.find(t=>t.id===th))setThemeId(th);
        if(Array.isArray(sv))setSaved(sv);
        if(g&&typeof g==="object"){setGoals(g);setGoalsForm(g);}
        if(pid)setPetId(pid);
        if(typeof pxp==="number")setPetXP(pxp);
        if(pn)setPetName(pn);
        if(typeof str==="number")setStreak(str);
        if(ll)setLastLog(ll);
      }catch{}
      setLoaded(true);
      setTimeout(()=>setSplash(false),2400);
    })();
  },[]);

  useEffect(()=>{if(loaded)sSave("ft-meals",meals);},[meals,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-theme",themeId);},[themeId,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-saved",saved);},[saved,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-goals",goals);},[goals,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-petid",petId);},[petId,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-petxp",petXP);},[petXP,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-petname",petName);},[petName,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-streak",streak);},[streak,loaded]);
  useEffect(()=>{if(loaded)sSave("ft-lastlog",lastLog);},[lastLog,loaded]);

  const totals=meals.reduce((a,m)=>{
    a.calories+=safeNum(m.calories);a.protein+=safeNum(m.protein);a.carbs+=safeNum(m.carbs);
    a.fat+=safeNum(m.fat);a.fiber+=safeNum(m.fiber);a.sugar+=safeNum(m.sugar);a.sodium+=safeNum(m.sodium);
    return a;
  },{calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

  const ingTots=ings.reduce((a,i)=>{
    const s=safeNum(i.servings);
    a.calories+=Math.round(safeNum(i.calories)*s);
    a.protein+=round1(safeNum(i.protein)*s);
    a.carbs+=round1(safeNum(i.carbs)*s);
    a.fat+=round1(safeNum(i.fat)*s);
    a.fiber+=round1(safeNum(i.fiber)*s);
    a.sugar+=round1(safeNum(i.sugar)*s);
    a.sodium+=Math.round(safeNum(i.sodium)*s);
    return a;
  },{calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

  const avgScore=meals.length>0?Math.round(meals.reduce((a,m)=>a+(m.score||0),0)/meals.length):null;
  const calOver=totals.calories>goals.calories;
  const prevCal=totals.calories+ingTots.calories;
  const displayFoods=sr.length>0?sr:PRESET_CATEGORIES[cat].foods;

  function awardXP(amt){
    setPetXP(p=>p+amt);
    setXpPop(amt);
    setTimeout(()=>setXpPop(null),2500);
  }
  function updateStreak(){
    const today=new Date().toDateString();
    if(lastLog===today)return;
    const yesterday=new Date(Date.now()-86400000).toDateString();
    const ns=lastLog===yesterday?streak+1:1;
    setStreak(ns);setLastLog(today);
    if(ns>1&&petId)awardXP(Math.min(30,ns*3));
  }
  function saveGoals(){
    const g={calories:safeNum(goalsForm.calories)||DEFAULT_GOALS.calories,protein:safeNum(goalsForm.protein)||DEFAULT_GOALS.protein,carbs:safeNum(goalsForm.carbs)||DEFAULT_GOALS.carbs,fat:safeNum(goalsForm.fat)||DEFAULT_GOALS.fat,fiber:safeNum(goalsForm.fiber)||DEFAULT_GOALS.fiber,sugar:safeNum(goalsForm.sugar)||DEFAULT_GOALS.sugar,sodium:safeNum(goalsForm.sodium)||DEFAULT_GOALS.sodium};
    setGoals(g);setShowGoals(false);
  }
  function addIng(food){
    setIngs(prev=>{
      const ex=prev.find(i=>i.name===food.name);
      if(ex)return prev.map(i=>i.name===food.name?{...i,servings:String(safeNum(i.servings)+1)}:i);
      return[...prev,{...food,id:Date.now()+Math.random(),servings:"1"}];
    });
    setMealErr("");
  }
  function updServ(id,val){setIngs(prev=>prev.map(i=>i.id===id?{...i,servings:val}:i));}
  function removeIng(id){setIngs(prev=>prev.filter(i=>i.id!==id));}
  function dragStart(e,food){e.dataTransfer.setData("food",JSON.stringify(food));}
  function drop(e){e.preventDefault();setDragOver(false);try{addIng(JSON.parse(e.dataTransfer.getData("food")));}catch{}}
  async function doSearch(){
    if(!sq.trim())return;
    setSearching(true);setSearchErr("");setSr([]);
    const r=await searchFood(sq);
    if(!r.length)setSearchErr("No results.");
    setSr(r);setSearching(false);
  }
  function saveMeal(){
    if(!mealName.trim()||!ings.length){setMealErr("Name your meal and add ingredients first.");return;}
    setSaved(p=>[...p,{id:Date.now(),name:mealName.trim(),ings:ings.map(i=>({...i})),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat}]);
    setMealErr("");alert(mealName+" saved!");
  }
  function loadMeal(m){setMealName(m.name);setIngs(m.ings.map(i=>({...i,id:Date.now()+Math.random()})));setShowSaved(false);setTab("build");setMealErr("");}
  function delMealTmpl(id){setSaved(p=>p.filter(m=>m.id!==id));setDelSaved(null);}
  function logMeal(){
    if(!mealName.trim()){setMealErr("Give your meal a name.");return;}
    if(!ings.length){setMealErr("Add at least one ingredient.");return;}
    const meal={id:Date.now(),name:mealName.trim(),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat,fiber:ingTots.fiber,sugar:ingTots.sugar,sodium:ingTots.sodium,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ingredientCount:ings.length};
    const sc=scoreMeal(meal,goals,totals.calories);
    meal.score=sc.score;meal.grade=sc.grade;meal.gradeColor=sc.gradeColor;
    setMeals(p=>[...p,meal]);
    setScoredMeal({...meal,...sc});
    if(petId){let xp=10;if(sc.score>=80)xp+=15;else if(sc.score>=65)xp+=8;awardXP(xp);}
    updateStreak();
    setMealName("");setIngs([]);setMealErr("");clearPhoto();setTab("log");
  }
  function photoFile(file){
    if(!file||!file.type.startsWith("image/"))return;
    const mime=MIME_MAP[file.type]||"image/jpeg";
    const r=new FileReader();
    r.onload=e=>{const d=e.target.result;setPhotoSrc(d);setPhotoB64(d.split(",")[1]);setPhotoMime(mime);setScanErr("");};
    r.readAsDataURL(file);
  }
  function clearPhoto(){setPhotoSrc(null);setPhotoB64(null);setScanErr("");}
  async function scan(){
    if(!photoB64)return;
    setScanning(true);setScanErr("");
    try{
      const k=import.meta.env.VITE_ANTHROPIC_KEY;
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "content-type":"application/json",
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
          "x-api-key":k,
        },
        body:JSON.stringify({
          model:"claude-opus-4-5",
          max_tokens:512,
          system:"You are a nutrition database. Output only raw JSON starting with { and ending with }.",
          messages:[{
            role:"user",
            content:[
              {type:"image",source:{type:"base64",media_type:photoMime,data:photoB64}},
              {type:"text",text:"Return JSON with keys: name, calories, protein, carbs, fat, fiber, sugar, sodium."},
            ],
          }],
        }),
      });
      if(!res.ok){const b=await res.text();throw new Error("HTTP "+res.status+": "+b.slice(0,200));}
      const data=await res.json();
      const tb=data.content&&data.content.find(function(b){return b.type==="text";});
      if(!tb||!tb.text)throw new Error("Empty response");
      const jp=extractJSON(tb.text);
      if(!jp.parsed)throw new Error(jp.error||"Could not read data.");
      addIng({name:String(jp.parsed.name||"Scanned food"),emoji:"📸",calories:jp.parsed.calories||0,protein:jp.parsed.protein||0,carbs:jp.parsed.carbs||0,fat:jp.parsed.fat||0,fiber:jp.parsed.fiber||0,sugar:jp.parsed.sugar||0,sodium:jp.parsed.sodium||0,brand:""});
    }catch(e){setScanErr(e.message||"Error.");}
    finally{setScanning(false);}
  }
  async function askCoach(){
    if(!coachMsg.trim())return;
    const msg=coachMsg.trim();
    setCoachMsg("");
    setCoachHist(h=>[...h,{role:"user",content:msg}]);
    setCoachLoad(true);
    try{
      const k=import.meta.env.VITE_ANTHROPIC_KEY;
      const ctx="Today: "+Math.round(totals.calories)+"/"+goals.calories+" kcal, protein "+round1(totals.protein)+"/"+goals.protein+"g, "+meals.length+" meals, streak "+streak+" days, avg meal score "+(avgScore||0)+"/100";
      const messages=coachHist.map(h=>({role:h.role,content:h.content})).concat([{role:"user",content:ctx+"\n\nQuestion: "+msg}]);
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{
          "content-type":"application/json",
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
          "x-api-key":k,
        },
        body:JSON.stringify({
          model:"claude-opus-4-5",
          max_tokens:400,
          system:"You are a friendly expert nutrition coach in an app called FUEL TRACK. You have the user's today data. Give concise actionable advice in 2-4 sentences. Be encouraging and specific.",
          messages:messages,
        }),
      });
      if(!res.ok)throw new Error("HTTP "+res.status);
      const data=await res.json();
      const reply=data.content&&data.content.find(function(b){return b.type==="text";});
      setCoachHist(h=>[...h,{role:"assistant",content:reply?reply.text:"Could not respond."}]);
      if(petId)awardXP(5);
    }catch(e){
      setCoachHist(h=>[...h,{role:"assistant",content:"Need API credits to respond. Add at console.anthropic.com"}]);
    }
    finally{setCoachLoad(false);}
  }
  function delMealLog(id){setMeals(p=>p.filter(m=>m.id!==id));}
  function newDay(){
    if(petId&&meals.length>0){
      let xp=0;
      if(meals.length>=3)xp+=10;
      const cp=totals.calories/goals.calories;
      if(cp>=0.85&&cp<=1.05)xp+=15;
      if(totals.protein/goals.protein>=0.9)xp+=20;
      if(xp>0)awardXP(xp);
    }
    setMeals([]);setMealName("");setIngs([]);setMealErr("");clearPhoto();setConfirm(false);setTab("home");setScoredMeal(null);
  }
  function navSt(active){return{flex:1,padding:"10px 0 8px",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:600,letterSpacing:"0.04em",background:"transparent",color:active?"#34d399":T.textFaint,transition:"color .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:2};}

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'DM Sans',sans-serif",transition:"background .4s",paddingBottom:64}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
        .del-btn{opacity:0!important;transition:opacity .2s!important;}
        .meal-card:hover .del-btn{opacity:1!important;}
        .fc{cursor:grab;transition:all .15s;user-select:none;}
        .fc:hover{border-color:#34d399!important;transform:translateY(-2px);}
        .fc:active{transform:scale(0.97);}
        .ir:hover .id{opacity:1!important;}
        .id{opacity:0!important;transition:opacity .2s!important;}
        .pc:hover{transform:scale(1.02);}
        @keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}}
        @keyframes loadbar{from{width:0%;}to{width:100%;}}
        @keyframes floatPet{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes xpPop{0%{opacity:0;transform:translateY(0) scale(.5);}20%{opacity:1;transform:translateY(-20px) scale(1.2);}80%{opacity:1;transform:translateY(-40px);}100%{opacity:0;transform:translateY(-60px) scale(.8);}}
        .xpa{animation:xpPop 2.5s ease-out forwards;}
        .pf{animation:floatPet 3s ease-in-out infinite;}
      `}</style>

      {splash&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"#030712",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:58,fontWeight:700,letterSpacing:"0.08em",lineHeight:1,marginBottom:6}}>
            <span style={{color:"#34d399"}}>FUEL</span><span style={{color:"#f1f5f9"}}> TRACK</span>
          </div>
          <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:32}}>NUTRITION RPG</div>
          <div style={{display:"flex",gap:8,marginBottom:32}}>
            {["🐶","🐱","🥚","🦑","🐴","🐟","🐣"].map((e,i)=>(
              <div key={i} style={{fontSize:24,animation:"bounce 1s ease-in-out "+i*0.1+"s infinite alternate"}}>{e}</div>
            ))}
          </div>
          <div style={{width:160,height:3,background:"#1e293b",borderRadius:99,overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",background:"#34d399",borderRadius:99,animation:"loadbar 2.2s ease-out forwards"}}/>
          </div>
          <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>LOADING YOUR WORLD...</div>
        </div>
      )}

      {xpPop!=null&&(
        <div className="xpa" style={{position:"fixed",top:80,right:20,zIndex:150,background:"#fbbf24",color:"#030712",borderRadius:12,padding:"8px 16px",fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(251,191,36,.4)",pointerEvents:"none"}}>
          +{xpPop} XP ⚡
        </div>
      )}

      {scoredMeal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:28,width:"100%",maxWidth:400,textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:8}}>{scoredMeal.grade==="S"?"🏆":scoredMeal.grade==="A"?"🥇":scoredMeal.grade==="B"?"🥈":scoredMeal.grade==="C"?"🥉":"📊"}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:T.textSub,marginBottom:2}}>MEAL SCORE</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:72,fontWeight:700,color:scoredMeal.gradeColor,lineHeight:1,marginBottom:2}}>{scoredMeal.score}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:700,color:scoredMeal.gradeColor,marginBottom:16}}>GRADE {scoredMeal.grade}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20,textAlign:"left"}}>
              {scoredMeal.details.map((d,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:T.card2,borderRadius:8}}>
                  <span style={{fontSize:14}}>{d.positive?"✅":"⚠️"}</span>
                  <span style={{fontSize:13,color:T.textSub}}>{d.text}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setScoredMeal(null)} style={{width:"100%",padding:"13px 0",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>AWESOME!</button>
          </div>
        </div>
      )}

      {showGoals&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>🎯 DAILY GOALS</div>
              <button onClick={()=>setShowGoals(false)} style={{background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>CANCEL</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{key:"calories",label:"Calories (kcal)",color:"#34d399"},{key:"protein",label:"Protein (g)",color:"#34d399"},{key:"carbs",label:"Carbs (g)",color:"#60a5fa"},{key:"fat",label:"Fat (g)",color:"#fbbf24"},{key:"fiber",label:"Fiber (g)",color:"#a78bfa"},{key:"sugar",label:"Sugar (g)",color:"#f472b6"},{key:"sodium",label:"Sodium (mg)",color:"#fb923c"}].map(function(item){return(
                <div key={item.key}>
                  <label style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>{item.label}</label>
                  <input type="number" min="0" value={goalsForm[item.key]} onChange={function(e){setGoalsForm(function(f){return{...f,[item.key]:e.target.value};});}}
                    style={{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:15,padding:"10px 14px",fontFamily:"'DM Mono',monospace",outline:"none",borderLeft:"3px solid "+item.color}}
                  />
                </div>
              );})}
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={function(){setGoalsForm(DEFAULT_GOALS);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>RESET</button>
              <button onClick={saveGoals} style={{flex:2,padding:"12px 0",background:"#34d399",border:"none",borderRadius:8,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>SAVE GOALS</button>
            </div>
          </div>
        </div>
      )}

      {showTheme&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowTheme(false);}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"70vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:16}}>🎨 THEMES</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {THEMES.map(function(th){return(
                <button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===th.id?"2px solid #34d399":"1px solid "+T.border,background:th.card,transition:"all .2s"}}>
                  <div style={{width:14,height:14,borderRadius:3,background:th.swatch,border:"1px solid rgba(128,128,128,.3)",flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===th.id?"#34d399":th.text,whiteSpace:"nowrap"}}>{th.label}</span>
                </button>
              );})}
            </div>
          </div>
        </div>
      )}

      {confirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:32,maxWidth:340,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🌅</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,marginBottom:8,color:T.text}}>New Day?</div>
            <p style={{color:T.textSub,fontSize:13,lineHeight:1.6,marginBottom:24}}>Clears {meals.length} meal{meals.length!==1?"s":""} and resets totals. Your pet earns XP for today before reset.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){setConfirm(false);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CANCEL</button>
              <button onClick={newDay} style={{flex:1,padding:"12px 0",background:"#7f1d1d",border:"1px solid #991b1b",color:"#fca5a5",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>NEW DAY</button>
            </div>
          </div>
        </div>
      )}

      {showSaved&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowSaved(false);}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>⭐ SAVED MEALS</div>
              <button onClick={function(){setShowSaved(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>CLOSE</button>
            </div>
            {!saved.length?(
              <div style={{textAlign:"center",padding:"30px 0",color:T.textFaint,fontSize:13,fontFamily:"'DM Mono',monospace"}}>No saved meals yet. Build a meal and tap SAVE.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {saved.map(function(m){return(
                  <div key={m.id} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{m.name}</div>
                        <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{m.calories} kcal · P{m.protein}g</div>
                      </div>
                      <div style={{display:"flex",gap:6,marginLeft:8}}>
                        <button onClick={function(){loadMeal(m);}} style={{padding:"6px 12px",background:"#065f46",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>LOAD</button>
                        {delSaved===m.id?(
                          <button onClick={function(){delMealTmpl(m.id);}} style={{padding:"6px 10px",background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>DEL?</button>
                        ):(
                          <button onClick={function(){setDelSaved(m.id);}} style={{padding:"6px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.textFaint,fontSize:13,cursor:"pointer"}}>×</button>
                        )}
                      </div>
                    </div>
                  </div>
                );})}
              </div>
            )}
          </div>
        </div>
      )}

      {showPetPick&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>CHOOSE YOUR PET</div>
            <div style={{fontSize:12,color:T.textSub,textAlign:"center",marginBottom:20}}>Each pet evolves through 5 stages as you level up. Pick wisely!</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {PETS.map(function(pet){return(
                <button key={pet.id} className="pc" onClick={function(){setPetId(pet.id);if(!petName||petName===petInfo?.name)setPetName(pet.name);setShowPetPick(false);}} style={{background:petId===pet.id?pet.color+"22":T.card2,border:"2px solid "+(petId===pet.id?pet.color:T.border),borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all .2s",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{fontSize:44,flexShrink:0,width:54,textAlign:"center"}}>{pet.stages[0].emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:petId===pet.id?pet.color:T.text,marginBottom:2}}>{pet.name}</div>
                    <div style={{fontSize:11,color:T.textSub,lineHeight:1.4,marginBottom:6}}>{pet.desc}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:9,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>EVOLVES:</span>
                      {pet.stages.map(function(s,i){return(<span key={i} style={{fontSize:16}}>{s.emoji}</span>);})}
                    </div>
                  </div>
                  {petId===pet.id&&<span style={{fontSize:10,color:pet.color,fontFamily:"'DM Mono',monospace",fontWeight:700,flexShrink:0}}>✓</span>}
                </button>
              );})}
            </div>
            {petId&&<button onClick={function(){setShowPetPick(false);}} style={{width:"100%",marginTop:16,padding:"12px 0",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CONFIRM PET</button>}
          </div>
        </div>
      )}

      <header style={{padding:"12px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:"#34d399",letterSpacing:"0.06em"}}>FUEL</span>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,letterSpacing:"0.06em"}}>TRACK</span>
          {streak>0&&<span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#fbbf24",marginLeft:4}}>🔥{streak}</span>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={function(){setGoalsForm({...goals});setShowGoals(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🎯</button>
          <button onClick={function(){setShowTheme(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🎨</button>
          {meals.length>0&&<button onClick={function(){setConfirm(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🌅</button>}
        </div>
      </header>

      <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 0"}}>

        {tab==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <CalRing eaten={Math.round(totals.calories)} goal={goals.calories} T={T}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>
                <StatPill label="PROTEIN" value={round1(totals.protein)} unit="g"  color="#34d399" T={T}/>
                <StatPill label="CARBS"   value={round1(totals.carbs)}   unit="g"  color="#60a5fa" T={T}/>
                <StatPill label="FAT"     value={round1(totals.fat)}     unit="g"  color="#fbbf24" T={T}/>
                <StatPill label="FIBER"   value={round1(totals.fiber)}   unit="g"  color="#a78bfa" T={T}/>
                <StatPill label="SUGAR"   value={round1(totals.sugar)}   unit="g"  color="#f472b6" T={T}/>
                <StatPill label="SODIUM"  value={Math.round(totals.sodium)} unit="mg" color="#fb923c" T={T}/>
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>MACRO BREAKDOWN</div>
              {MACROS.map(function(m){return <MacroBar key={m.key} label={m.label} value={round1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T}/>;  })}
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              {!petId?(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <div style={{fontSize:40,marginBottom:10}}>🥚</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>Choose Your Pet!</div>
                  <div style={{fontSize:13,color:T.textSub,marginBottom:16}}>Pick a companion to level up as you hit your nutrition goals</div>
                  <button onClick={function(){setShowPetPick(true);}} style={{padding:"12px 24px",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🐾 CHOOSE PET</button>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div className="pf" style={{fontSize:56,lineHeight:1,cursor:"pointer"}} onClick={function(){setShowPetPick(true);}}>{petStage?petStage.emoji:petInfo.stages[0].emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:petInfo.color,marginBottom:1}}>{petName||petInfo.name}</div>
                      <div style={{fontSize:11,color:petInfo.color,fontFamily:"'DM Mono',monospace",marginBottom:4}}>✦ {petStage?petStage.form:"Newborn"}</div>
                      <div style={{fontSize:11,color:T.textSub,fontFamily:"'DM Mono',monospace",marginBottom:8}}>LVL {petLevel.level} {petLevel.name} · {petXP} XP</div>
                      <div style={{height:5,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:3}}>
                        <div style={{width:petLevel.progress+"%",height:"100%",background:petInfo.color,borderRadius:99,transition:"width .8s"}}/>
                      </div>
                      <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>
                        {petLevel.next?"→ "+petLevel.next.xpRequired+" XP for Lv"+(petLevel.level+1):"MAX LEVEL 👑"}
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:12,padding:"10px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:10}}>
                    <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>TODAY'S PROGRESS</div>
                    <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                      {[
                        {icon:"🍽️",v:meals.length+"/3",done:meals.length>=3,label:"Meals"},
                        {icon:"🔥",v:Math.round((totals.calories/goals.calories)*100)+"%",done:totals.calories>=goals.calories*0.85&&totals.calories<=goals.calories*1.05,label:"Cal Goal"},
                        {icon:"💪",v:Math.round((totals.protein/goals.protein)*100)+"%",done:totals.protein>=goals.protein*0.9,label:"Protein"},
                        {icon:"⚡",v:streak+"d",done:streak>0,label:"Streak"},
                      ].map(function(x){return(
                        <div key={x.label} style={{display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:12}}>{x.icon}</span>
                          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:x.done?"#34d399":T.textSub}}>{x.v}</span>
                          <span style={{fontSize:9,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>{x.label}</span>
                        </div>
                      );})}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {avgScore!=null&&(
              <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:46,fontWeight:700,color:avgScore>=80?"#34d399":avgScore>=65?"#fbbf24":"#fb923c",lineHeight:1}}>{avgScore}</div>
                  <div style={{fontSize:9,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>AVG SCORE</div>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:4}}>
                    {avgScore>=80?"🏆 Excellent nutrition day!":avgScore>=65?"👍 Good progress today":avgScore>=50?"📈 Room to improve":"⚠️ Focus on quality"}
                  </div>
                  <div style={{fontSize:12,color:T.textSub}}>{meals.length} meal{meals.length!==1?"s":""} logged · tap LOG for details</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="log"&&(
          <div style={{marginTop:8}}>
            {!meals.length?(
              <div style={{background:T.card,border:"1px dashed "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:12}}>🍽️</div>
                <div style={{color:T.textSub,fontSize:14,marginBottom:6}}>No meals logged yet</div>
                <div style={{color:T.textFaint,fontSize:12,fontFamily:"'DM Mono',monospace"}}>Tap BUILD to get started</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {meals.map(function(meal,idx){return(
                  <div key={meal.id} className="meal-card" style={{background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:26,height:26,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'DM Mono',monospace",fontSize:10,color:T.textFaint}}>{idx+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:2}}>
                        <span style={{fontWeight:600,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.textSub,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#34d399"}}>{meal.calories} <span style={{fontSize:12,fontWeight:400,color:T.textSub}}>kcal</span></div>
                        {meal.grade&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:meal.gradeColor,background:meal.gradeColor+"22",borderRadius:6,padding:"1px 7px"}}>Grade {meal.grade}</div>}
                        {meal.score!=null&&<div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.textFaint}}>{meal.score}/100</div>}
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {[{l:"P",v:meal.protein,u:"g",c:"#34d399"},{l:"C",v:meal.carbs,u:"g",c:"#60a5fa"},{l:"F",v:meal.fat,u:"g",c:"#fbbf24"},{l:"Fi",v:meal.fiber,u:"g",c:"#a78bfa"},{l:"Na",v:meal.sodium,u:"mg",c:"#fb923c"}].filter(function(x){return x.v>0;}).map(function(chip){return(
                          <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:4,padding:"1px 6px",fontSize:10,fontFamily:"'DM Mono',monospace",color:chip.c}}>{chip.l} {round1(chip.v)}{chip.u}</span>
                        );})}
                      </div>
                    </div>
                    <button className="del-btn" onClick={function(){delMealLog(meal.id);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textFaint,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                );})}
                <div style={{background:calOver?"#1a0505":"#061a0f",border:"1px solid "+(calOver?"#7f1d1d":"#14532d"),borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:calOver?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace",marginBottom:2}}>{calOver?"⚠ OVER GOAL":"✓ DAILY TOTAL"}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:calOver?"#f87171":"#4ade80",lineHeight:1}}>{Math.round(totals.calories)} / {goals.calories} kcal</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                    <div style={{fontSize:12,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{round1(totals.protein)}g protein</div>
                    {avgScore!=null&&<div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>Avg: {avgScore}/100</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="build"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>MEAL NAME</div>
              <input type="text" value={mealName} onChange={function(e){setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Post-Workout Lunch"
                style={{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"10px 13px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              />
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>🍽️ FOOD BROWSER — tap to add</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input type="text" value={sq} onChange={function(e){setSq(e.target.value);if(!e.target.value)setSr([]);}} onKeyDown={function(e){if(e.key==="Enter")doSearch();}} placeholder="Search any food..."
                  style={{flex:1,background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:13,padding:"8px 11px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
                />
                <button onClick={doSearch} disabled={searching} style={{padding:"8px 13px",background:"#0891b2",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"SEARCH"}</button>
                {sr.length>0&&<button onClick={function(){setSr([]);setSq("");}} style={{padding:"8px 10px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer"}}>✕</button>}
              </div>
              {searchErr&&<div style={{fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace",marginBottom:8}}>⚠ {searchErr}</div>}
              {!sr.length&&(
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>
                  {PRESET_CATEGORIES.map(function(c,i){return(
                    <button key={i} onClick={function(){setCat(i);}} style={{padding:"5px 11px",borderRadius:18,border:"1px solid "+(cat===i?"#34d399":T.border),background:cat===i?"#34d399":T.card2,color:cat===i?"#030712":T.textSub,fontSize:10,fontWeight:600,fontFamily:"'DM Mono',monospace",flexShrink:0,cursor:"pointer",whiteSpace:"nowrap"}}>{c.label}</button>
                  );})}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {displayFoods.map(function(food,i){return(
                  <div key={i} className="fc" draggable onDragStart={function(e){dragStart(e,food);}} onClick={function(){addIng(food);}} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:11,padding:"10px",cursor:"pointer"}}>
                    <div style={{fontSize:22,marginBottom:4,lineHeight:1}}>{food.emoji}</div>
                    <div style={{fontSize:10,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{food.name}</div>
                    {food.brand&&<div style={{fontSize:9,color:T.textFaint,marginBottom:3}}>{food.brand}</div>}
                    <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#34d399",fontWeight:700}}>{food.calories} kcal</div>
                    <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:T.textSub}}>P{food.protein}g · C{food.carbs}g · F{food.fat}g</div>
                  </div>
                );})}
              </div>
            </div>
            <div onDragOver={function(e){e.preventDefault();setDragOver(true);}} onDragLeave={function(){setDragOver(false);}} onDrop={drop}
              style={{background:T.card,border:"2px "+(dragOver?"solid #34d399":"dashed "+T.border),borderRadius:16,padding:"14px 16px",minHeight:80,transition:"all .2s"}}>
              {!ings.length?(
                <div style={{textAlign:"center",padding:"12px 0"}}>
                  <div style={{fontSize:24,marginBottom:5}}>🧺</div>
                  <div style={{color:dragOver?"#34d399":T.textSub,fontSize:13,fontWeight:600,marginBottom:2}}>{dragOver?"Drop it!":"Your Meal"}</div>
                  <div style={{color:T.textFaint,fontSize:11,fontFamily:"'DM Mono',monospace"}}>Tap foods above to add them</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>🧺 {ings.length} INGREDIENT{ings.length!==1?"S":""}{dragOver&&" · DROP TO ADD"}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {ings.map(function(ing){return(
                      <div key={ing.id} className="ir" style={{display:"flex",alignItems:"center",gap:8,background:T.card2,borderRadius:9,padding:"8px 10px",border:"1px solid "+T.border}}>
                        <span style={{fontSize:18,flexShrink:0}}>{ing.emoji||"🍽️"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                          <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{Math.round(safeNum(ing.calories)*safeNum(ing.servings))} kcal · P{round1(safeNum(ing.protein)*safeNum(ing.servings))}g</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                          <button onClick={function(){updServ(ing.id,String(Math.max(0.25,safeNum(ing.servings)-0.25)));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.text,minWidth:25,textAlign:"center"}}>{ing.servings}x</span>
                          <button onClick={function(){updServ(ing.id,String(safeNum(ing.servings)+0.25));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          <button className="id" onClick={function(){removeIng(ing.id);}} style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,color:T.textFaint,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>×</button>
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
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>📸 PHOTO SCAN — needs API credits</div>
              {!photoSrc?(
                <div onClick={function(){if(fileRef.current)fileRef.current.click();}} style={{border:"2px dashed "+T.border,borderRadius:9,padding:"12px",textAlign:"center",cursor:"pointer"}}>
                  <div style={{fontSize:20,marginBottom:3}}>📷</div>
                  <div style={{color:"#60a5fa",fontWeight:600,fontSize:12}}>Take or choose a photo</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={function(e){if(e.target.files[0])photoFile(e.target.files[0]);e.target.value="";}}/>
                </div>
              ):(
                <div>
                  <div style={{position:"relative",borderRadius:9,overflow:"hidden",marginBottom:8}}>
                    <img src={photoSrc} alt="food" style={{width:"100%",maxHeight:140,objectFit:"cover",display:"block"}}/>
                    <button onClick={clearPhoto} style={{position:"absolute",top:6,right:6,background:"rgba(3,7,18,.85)",border:"1px solid #334155",color:"#94a3b8",borderRadius:5,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>✕</button>
                  </div>
                  <button onClick={scan} disabled={scanning} style={{width:"100%",padding:"10px 0",background:"#1d4ed8",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:scanning?0.5:1}}>
                    {scanning?"🔍 ANALYZING...":"🔍 SCAN & ADD"}
                  </button>
                  {scanErr&&<div style={{marginTop:6,padding:"7px 10px",background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:7,fontSize:11,color:"#fca5a5",fontFamily:"'DM Mono',monospace"}}>⚠ {scanErr}</div>}
                </div>
              )}
            </div>
            {mealErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>⚠ {mealErr}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveMeal} disabled={!mealName.trim()||!ings.length} style={{flex:1,padding:"13px 0",background:"#0c4a6e",border:"1px solid #0369a1",borderRadius:11,color:"#7dd3fc",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>⭐ SAVE</button>
              <button onClick={logMeal} disabled={!mealName.trim()||!ings.length} style={{flex:2,padding:"13px 0",background:"#34d399",border:"none",borderRadius:11,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>
                + LOG {ings.length>0&&"· "+ingTots.calories+" kcal"}
              </button>
            </div>
            <button onClick={function(){setShowSaved(true);}} style={{padding:"11px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:11,color:T.textSub,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
              ⭐ SAVED MEALS {saved.length>0&&"("+saved.length+")"}
            </button>
          </div>
        )}

        {tab==="pet"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
            {!petId?(
              <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:60,marginBottom:16}}>🥚</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:8}}>Choose Your Pet!</div>
                <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Your companion evolves through 5 unique stages as you level up by hitting nutrition goals.</div>
                <button onClick={function(){setShowPetPick(true);}} style={{padding:"14px 32px",background:"#34d399",border:"none",borderRadius:12,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🐾 CHOOSE YOUR PET</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
                  <div className="pf" style={{fontSize:90,lineHeight:1,marginBottom:8}}>{petStage?petStage.emoji:petInfo.stages[0].emoji}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:petInfo.color,marginBottom:2}}>{petName||petInfo.name}</div>
                  <div style={{fontSize:14,fontWeight:600,color:petInfo.color,opacity:0.8,marginBottom:4}}>✦ {petStage?petStage.form:"Newborn"}</div>
                  <div style={{fontSize:13,color:T.textSub,marginBottom:4,lineHeight:1.5,fontStyle:"italic"}}>{petStage?petStage.description:petInfo.stages[0].description}</div>
                  <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px",marginBottom:14,marginTop:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:T.text}}>Level {petLevel.level} — {petLevel.name} {petLevel.emoji_modifier}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.textSub}}>{petXP} XP</span>
                    </div>
                    <div style={{height:7,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:5}}>
                      <div style={{width:petLevel.progress+"%",height:"100%",background:petInfo.color,borderRadius:99,transition:"width 1s"}}/>
                    </div>
                    <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>
                      {petLevel.next?"→ "+(petLevel.next.xpRequired-petXP)+" XP to Level "+(petLevel.level+1):"👑 MAX LEVEL!"}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>RENAME YOUR PET</div>
                    <div style={{display:"flex",gap:8}}>
                      <input type="text" value={petName} onChange={function(e){setPetName(e.target.value);}} placeholder={petInfo.name}
                        style={{flex:1,background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
                      />
                      <button onClick={function(){setShowPetPick(true);}} style={{padding:"8px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>CHANGE</button>
                    </div>
                  </div>
                </div>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>🌱 EVOLUTION STAGES</div>
                  {petInfo.stages.map(function(stage,i){
                    const unlocked=petLevel.level>=stage.level;
                    const isCurrent=petLevel.level>=stage.level&&(i===petInfo.stages.length-1||petLevel.level<petInfo.stages[i+1].level);
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid "+T.border,opacity:unlocked?1:0.35}}>
                        <div style={{fontSize:34,flexShrink:0,width:42,textAlign:"center"}}>{stage.emoji}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                            <span style={{fontSize:13,fontWeight:700,color:isCurrent?petInfo.color:unlocked?T.text:T.textFaint}}>{stage.form}</span>
                            {isCurrent&&<span style={{fontSize:9,background:petInfo.color,color:"#030712",borderRadius:4,padding:"1px 6px",fontFamily:"'DM Mono',monospace",fontWeight:700}}>NOW</span>}
                            {!unlocked&&<span style={{fontSize:9,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>Lv{stage.level} required</span>}
                          </div>
                          <div style={{fontSize:11,color:T.textFaint,fontStyle:"italic"}}>{stage.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>⚡ HOW TO EARN XP</div>
                  {[
                    ["🍽️","Log any meal","+10 XP"],
                    ["🍽️","Log 3+ meals in a day","+10 XP"],
                    ["🔥","Hit calorie goal ±15%","+15 XP"],
                    ["💪","Hit protein goal 90%+","+20 XP"],
                    ["⚡","Daily streak (×3/day)","up to +30 XP"],
                    ["🏆","Meal score 80+","+15 XP"],
                    ["👍","Meal score 65-79","+8 XP"],
                    ["🤖","Ask AI Coach","+5 XP"],
                    ["🌅","Complete a full day","bonus XP"],
                  ].map(function(x){return(
                    <div key={x[1]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid "+T.border}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:14}}>{x[0]}</span>
                        <span style={{fontSize:12,color:T.textSub}}>{x[1]}</span>
                      </div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#fbbf24",fontWeight:700}}>{x[2]}</span>
                    </div>
                  );})}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="coach"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{fontSize:28}}>🤖</div>
                <div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#34d399"}}>AI NUTRITION COACH</div>
                  <div style={{fontSize:11,color:T.textSub}}>Powered by Claude · Needs API credits</div>
                </div>
              </div>
              <div style={{padding:"8px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,fontSize:12,color:T.textSub}}>
                Today: {Math.round(totals.calories)}/{goals.calories} kcal · {round1(totals.protein)}g protein · {meals.length} meals · 🔥{streak} day streak
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 18px",minHeight:280,display:"flex",flexDirection:"column",gap:10}}>
              {!coachHist.length?(
                <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:36,marginBottom:10}}>💬</div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:12}}>Ask your coach anything!</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
                    {["What should I eat for dinner?","How is my protein today?","Give me a high-protein snack idea","Am I on track to hit my goals?"].map(function(q){return(
                      <button key={q} onClick={function(){setCoachMsg(q);}} style={{padding:"8px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer",textAlign:"left"}}>{q}</button>
                    );})}
                  </div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {coachHist.map(function(msg,i){return(
                    <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
                      <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?"#34d399":T.card2,color:msg.role==="user"?"#030712":T.text,fontSize:13,lineHeight:1.5,border:msg.role==="assistant"?"1px solid "+T.border:"none"}}>
                        {msg.content}
                      </div>
                    </div>
                  );})}
                  {coachLoad&&(
                    <div style={{display:"flex",justifyContent:"flex-start"}}>
                      <div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:T.card2,border:"1px solid "+T.border,color:T.textSub,fontSize:13}}>Thinking...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input type="text" value={coachMsg} onChange={function(e){setCoachMsg(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&!coachLoad)askCoach();}} placeholder="Ask anything about your nutrition..."
                style={{flex:1,background:T.card,border:"1px solid "+T.border,borderRadius:10,color:T.text,fontSize:13,padding:"12px 14px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              />
              <button onClick={askCoach} disabled={coachLoad||!coachMsg.trim()} style={{padding:"12px 16px",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(coachLoad||!coachMsg.trim())?0.5:1}}>
                {coachLoad?"...":"SEND"}
              </button>
            </div>
            {coachHist.length>0&&<button onClick={function(){setCoachHist([]);}} style={{padding:"8px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.textFaint,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CLEAR CHAT</button>}
          </div>
        )}

        {tab==="info"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"20px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#34d399",marginBottom:6}}>FUEL TRACK GUIDE 🐾</div>
              <div style={{fontSize:13,color:T.textSub,lineHeight:1.7}}>A nutrition RPG — log meals, earn XP, level up your pet, and crush your goals every single day.</div>
            </div>
            {[
              {icon:"🍳",title:"HOW TO BUILD AND LOG A MEAL",color:"#34d399",steps:["Tap BUILD in the bottom nav","Type a name for your meal (e.g. Lunch, Post-Workout)","Browse 15+ food categories and tap any food to add it","Use − and + buttons to adjust serving size in 0.25x steps","Use the SEARCH bar to find any food in the USDA database","Tap SAVE to store the meal as a template to reuse forever","Tap + LOG to add it to today — your meal score pops up instantly"]},
              {icon:"🏆",title:"HOW MEALS ARE SCORED (0 to 100)",color:"#f97316",steps:["Every meal gets rated 0–100 and a letter grade S / A / B / C / D / F","PROTEIN EFFICIENCY (0–40 pts): protein per calorie. More protein per calorie = more points","CALORIE FIT (0–25 pts): how well the meal fits your remaining daily budget","FIBER BONUS (0–15 pts): fiber content vs your daily fiber goal","SODIUM PENALTY (up to −10 pts): deducted if meal exceeds 50% of your sodium goal","FAT BALANCE (0–10 pts): fat ratio vs expected for the calorie count","SUGAR (−5 to +10 pts): low sugar earns bonus points, high sugar loses points","S = 90+, A = 80+, B = 70+, C = 55+, D = 40+, F = below 40","High-scoring meals give your pet bonus XP!"]},
              {icon:"🐾",title:"PET SYSTEM AND EVOLUTION",color:"#8b5cf6",steps:["Choose from 7 pets: Dog, Cat, Dragon, Kraken, Unicorn, Koi, or Turtle","Every pet starts as a baby and evolves through 5 unique stages","The Dragon starts as a tiny glowing egg, hatches into a baby serpent, then a young drake, fire drake, and finally the colossal Mega Dragon","The Kraken starts as a tiny squid and grows into the legendary Kraken Lord","The Unicorn starts as a magic foal and transforms into the Divine Unicorn with a rainbow","The Koi starts as a baby fish and becomes the mythic Celestial Dragon Koi that swims through clouds","The Turtle starts as a sand hatchling and becomes the Ancient Titan, a living island","Tap the PET tab to see your full evolution timeline and which stages are locked"]},
              {icon:"⚡",title:"HOW TO EARN XP FOR YOUR PET",color:"#fbbf24",steps:["Log any meal: +10 XP","Log 3 or more meals in a day: +10 XP bonus","Hit your calorie goal within 15%: +15 XP","Hit your protein goal at 90% or more: +20 XP","Daily streak bonus: +3 XP per day in your streak, up to 30 XP max","Meal score 80 or higher: +15 XP bonus","Meal score 65 to 79: +8 XP bonus","Ask the AI Coach a question: +5 XP","Complete a full day by tapping New Day: bonus XP for any goals hit"]},
              {icon:"🎯",title:"SETTING YOUR DAILY GOALS",color:"#60a5fa",steps:["Tap the target emoji in the top right header","Set your personal daily targets for calories, protein, carbs, fat, fiber, sugar, and sodium","Tap SAVE GOALS to lock them in permanently","All rings, bars, and meal scores update to match your targets","Tap RESET to return to the default recommended targets"]},
              {icon:"🤖",title:"AI NUTRITION COACH",color:"#a78bfa",steps:["Tap the COACH tab at the bottom","The AI knows exactly what you have eaten today, your goals, streak, and average meal score","Ask anything: What should I eat for dinner, how is my protein, give me a high protein snack","Asking a question earns your pet +5 XP","Requires Anthropic API credits — add credits at console.anthropic.com"]},
              {icon:"🔥",title:"STREAKS",color:"#fb923c",steps:["A streak counts every day you log at least one meal","Tap the sunrise emoji each morning to start a new day and keep your streak","Longer streaks give more XP per day for your pet","Your streak count shows in the header as a fire emoji followed by the number"]},
            ].map(function(section){return(
              <div key={section.title} style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{fontSize:22}}>{section.icon}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:section.color}}>{section.title}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {section.steps.map(function(step,i){return(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:18,height:18,borderRadius:99,background:section.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:"#030712",fontFamily:"'DM Mono',monospace",marginTop:2}}>{i+1}</div>
                      <div style={{fontSize:13,color:T.textSub,lineHeight:1.5}}>{step}</div>
                    </div>
                  );})}
                </div>
              </div>
            );})}
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.textFaint,letterSpacing:"0.08em",marginBottom:10}}>PRO TIPS</div>
              {["Tap a food card twice to instantly add 2 servings","Search the USDA database for any branded food","Saved meals are perfect for daily meal prep routines","A high protein low calorie meal will score close to 100","Never break your streak — consistent XP beats big burst days","Your pet emoji in the nav bar changes as it evolves"].map(function(tip,i){return(
                <div key={i} style={{fontSize:12,color:T.textSub,padding:"7px 10px",background:T.card2,borderRadius:8,marginBottom:5}}>💡 {tip}</div>
              );})}
            </div>
          </div>
        )}
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:"1px solid "+T.border,display:"flex",zIndex:60,maxWidth:520,margin:"0 auto"}}>
        {[
          {id:"home",  icon:"🏠",  label:"HOME"},
          {id:"log",   icon:"📋",  label:"LOG"},
          {id:"build", icon:"🍳",  label:"BUILD"},
          {id:"pet",   icon:petId&&petStage?petStage.emoji:"🐾", label:"PET"},
          {id:"coach", icon:"🤖",  label:"COACH"},
          {id:"info",  icon:"ℹ️",  label:"GUIDE"},
        ].map(function(n){return(
          <button key={n.id} style={navSt(tab===n.id)} onClick={function(){setTab(n.id);}}>
            <span style={{fontSize:17}}>{n.icon}</span>
            <span>{n.label}</span>
            {n.id==="log"&&meals.length>0&&<span style={{position:"absolute",top:6,background:"#34d399",color:"#030712",borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 5px",fontFamily:"'DM Mono',monospace"}}>{meals.length}</span>}
          </button>
        );})}
      </div>
    </div>
  );
}
