import { useState, useRef, useEffect } from “react”;

const DEFAULT_GOALS = { calories:1550, protein:180, carbs:200, fat:70, fiber:38, sugar:50, sodium:2300 };

// ── Pet definitions ────────────────────────────────────────────
const PETS = [
{ id:“dog”,     name:“Gains”,  emoji:“🐶”, type:“Labrador”,   color:”#f59e0b”, desc:“Loyal and energetic. Loves protein!” },
{ id:“cat”,     name:“Macro”,  emoji:“🐱”, type:“Siamese”,    color:”#8b5cf6”, desc:“Sleek and precise. Tracks every macro.” },
{ id:“dragon”,  name:“Flex”,   emoji:“🐉”, type:“Fire Dragon”,color:”#ef4444”, desc:“Legendary. Grows stronger with every PR.” },
{ id:“fox”,     name:“Swift”,  emoji:“🦊”, type:“Arctic Fox”, color:”#06b6d4”, desc:“Quick and clever. Always one step ahead.” },
{ id:“bear”,    name:“Bulk”,   emoji:“🐻”, type:“Grizzly”,    color:”#78716c”, desc:“Massive and powerful. Built for gains.” },
{ id:“penguin”, name:“Shred”,  emoji:“🐧”, type:“Emperor”,    color:”#3b82f6”, desc:“Cool under pressure. Cuts like a knife.” },
{ id:“lion”,    name:“King”,   emoji:“🦁”, type:“African”,    color:”#d97706”, desc:“Rules the gym. Dominates every session.” },
{ id:“wolf”,    name:“Pack”,   emoji:“🐺”, type:“Timber”,     color:”#6366f1”, desc:“Runs with discipline. Never skips a day.” },
];

const PET_LEVELS = [
{ level:1,  name:“Hatchling”,  xpRequired:0,    size:60,  emoji_modifier:”” },
{ level:2,  name:“Pup”,        xpRequired:100,  size:70,  emoji_modifier:”” },
{ level:3,  name:“Juvenile”,   xpRequired:250,  size:80,  emoji_modifier:”” },
{ level:4,  name:“Young”,      xpRequired:500,  size:90,  emoji_modifier:“✨” },
{ level:5,  name:“Trained”,    xpRequired:900,  size:100, emoji_modifier:“✨” },
{ level:6,  name:“Strong”,     xpRequired:1400, size:110, emoji_modifier:“⚡” },
{ level:7,  name:“Elite”,      xpRequired:2100, size:120, emoji_modifier:“⚡” },
{ level:8,  name:“Champion”,   xpRequired:3000, size:130, emoji_modifier:“🔥” },
{ level:9,  name:“Legend”,     xpRequired:4200, size:140, emoji_modifier:“🔥” },
{ level:10, name:“GOD MODE”,   xpRequired:6000, size:160, emoji_modifier:“👑” },
];

function getPetLevel(xp) {
let currentLevel = PET_LEVELS[0];
for (const lvl of PET_LEVELS) {
if (xp >= lvl.xpRequired) currentLevel = lvl;
else break;
}
const nextLevel = PET_LEVELS.find(l => l.xpRequired > xp);
const progress = nextLevel
? ((xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
: 100;
return { …currentLevel, nextLevel, progress, xp };
}

// ── Meal scoring ───────────────────────────────────────────────
function scoreMeal(meal, goals, totalCaloriesBeforeMeal) {
let score = 0;
const details = [];

// Protein efficiency (0-40 pts)
const proteinPer100cal = meal.calories > 0 ? (meal.protein / meal.calories) * 100 : 0;
const proteinScore = Math.min(40, Math.round(proteinPer100cal * 2.5));
score += proteinScore;
if (proteinScore >= 30) details.push({ text: “High protein density 💪”, positive: true });
else if (proteinScore >= 15) details.push({ text: “Decent protein”, positive: true });
else details.push({ text: “Low protein density”, positive: false });

// Calorie fit (0-25 pts)
const remainingBefore = goals.calories - totalCaloriesBeforeMeal;
const calFit = Math.max(0, remainingBefore - meal.calories);
const calScore = meal.calories <= remainingBefore
? Math.min(25, Math.round(25 * (1 - meal.calories / goals.calories)))
: 0;
score += calScore;
if (meal.calories > remainingBefore) details.push({ text: “Exceeds daily budget ⚠️”, positive: false });
else if (calScore >= 15) details.push({ text: “Great calorie fit ✓”, positive: true });
else details.push({ text: “Moderate calorie fit”, positive: true });

// Fiber bonus (0-15 pts)
const fiberScore = Math.min(15, Math.round((meal.fiber / goals.fiber) * 100 * 0.15));
score += fiberScore;
if (fiberScore >= 10) details.push({ text: “Excellent fiber 🌿”, positive: true });

// Sodium penalty (0-10 pts, deducted if too high)
const sodiumRatio = meal.sodium / goals.sodium;
const sodiumPenalty = sodiumRatio > 0.5 ? Math.min(10, Math.round((sodiumRatio - 0.5) * 20)) : 0;
score -= sodiumPenalty;
if (sodiumPenalty >= 5) details.push({ text: “High sodium ⚠️”, positive: false });

// Fat balance (0-10 pts)
const fatRatio = meal.fat / (meal.calories * 0.30 / 9);
const fatScore = fatRatio <= 1.2 ? Math.min(10, Math.round(10 * (1 - Math.abs(1 - fatRatio) * 0.5))) : 0;
score += fatScore;

// Sugar bonus/penalty (0-10 pts)
const sugarRatio = meal.sugar / goals.sugar;
const sugarScore = sugarRatio <= 0.3 ? 10 : sugarRatio <= 0.5 ? 5 : sugarRatio > 1 ? -5 : 0;
score += sugarScore;
if (sugarScore < 0) details.push({ text: “High sugar content”, positive: false });

const finalScore = Math.max(0, Math.min(100, score));
let grade = “F”;
let gradeColor = “#ef4444”;
if (finalScore >= 90) { grade = “S”; gradeColor = “#fbbf24”; }
else if (finalScore >= 80) { grade = “A”; gradeColor = “#34d399”; }
else if (finalScore >= 70) { grade = “B”; gradeColor = “#60a5fa”; }
else if (finalScore >= 55) { grade = “C”; gradeColor = “#a78bfa”; }
else if (finalScore >= 40) { grade = “D”; gradeColor = “#fb923c”; }

return { score: finalScore, grade, gradeColor, details };
}

function calcDailyXP(meals, totals, goals, streak) {
let xp = 0;
let reasons = [];
if (meals.length >= 1) { xp += 10; reasons.push(“Logged a meal +10 XP”); }
if (meals.length >= 3) { xp += 10; reasons.push(“Logged 3+ meals +10 XP”); }
const calPct = totals.calories / goals.calories;
if (calPct >= 0.85 && calPct <= 1.05) { xp += 15; reasons.push(“Hit calorie goal +15 XP”); }
const protPct = totals.protein / goals.protein;
if (protPct >= 0.9) { xp += 20; reasons.push(“Hit protein goal +20 XP”); }
if (streak >= 3) { xp += Math.min(30, streak * 3); reasons.push(`${streak} day streak +${Math.min(30,streak*3)} XP`); }
const avgScore = meals.length > 0 ? meals.reduce((a,m) => a + (m.score||0), 0) / meals.length : 0;
if (avgScore >= 80) { xp += 20; reasons.push(“High meal quality avg +20 XP”); }
else if (avgScore >= 65) { xp += 10; reasons.push(“Good meal quality +10 XP”); }
return { xp, reasons };
}

const PRESET_CATEGORIES = [
{ label:“🥚 Eggs & Dairy”, foods:[
{ name:“Egg (whole, large)”,           emoji:“🥚”, calories:72,  protein:6,   carbs:0.4, fat:5,   fiber:0, sugar:0.4, sodium:71  },
{ name:“Egg White (large)”,            emoji:“🥚”, calories:17,  protein:3.6, carbs:0.2, fat:0.1, fiber:0, sugar:0.2, sodium:55  },
{ name:“Egg (2 whole)”,                emoji:“🥚”, calories:143, protein:12,  carbs:0.7, fat:10,  fiber:0, sugar:0.7, sodium:142 },
{ name:“Egg (3 whole)”,                emoji:“🥚”, calories:215, protein:18,  carbs:1.1, fat:15,  fiber:0, sugar:1.1, sodium:213 },
{ name:“Greek Yogurt nonfat (1 cup)”,  emoji:“🫙”, calories:100, protein:17,  carbs:6,   fat:0,   fiber:0, sugar:6,   sodium:65  },
{ name:“Greek Yogurt 2% (1 cup)”,      emoji:“🫙”, calories:150, protein:17,  carbs:8,   fat:4,   fiber:0, sugar:7,   sodium:65  },
{ name:“Cottage Cheese (1/2 cup)”,     emoji:“🫙”, calories:90,  protein:12,  carbs:5,   fat:2.5, fiber:0, sugar:4,   sodium:360 },
{ name:“Cottage Cheese (1 cup)”,       emoji:“🫙”, calories:180, protein:24,  carbs:10,  fat:5,   fiber:0, sugar:8,   sodium:720 },
{ name:“Milk 2% (1 cup)”,              emoji:“🥛”, calories:122, protein:8,   carbs:12,  fat:5,   fiber:0, sugar:12,  sodium:115 },
{ name:“Cheddar Cheese (1 oz)”,        emoji:“🧀”, calories:115, protein:7,   carbs:0.4, fat:9,   fiber:0, sugar:0.1, sodium:185 },
{ name:“String Cheese (1 stick)”,      emoji:“🧀”, calories:80,  protein:7,   carbs:1,   fat:5,   fiber:0, sugar:0,   sodium:200 },
{ name:“Cream Cheese (2 tbsp)”,        emoji:“🧀”, calories:99,  protein:1.8, carbs:1.6, fat:10,  fiber:0, sugar:1.3, sodium:90  },
]},
{ label:“🍗 Chicken & Turkey”, foods:[
{ name:“Chicken Breast (2 oz)”,  emoji:“🍗”, calories:92,  protein:17, carbs:0, fat:2,  fiber:0, sugar:0, sodium:37  },
{ name:“Chicken Breast (3 oz)”,  emoji:“🍗”, calories:139, protein:26, carbs:0, fat:3,  fiber:0, sugar:0, sodium:56  },
{ name:“Chicken Breast (4 oz)”,  emoji:“🍗”, calories:185, protein:35, carbs:0, fat:4,  fiber:0, sugar:0, sodium:75  },
{ name:“Chicken Breast (5 oz)”,  emoji:“🍗”, calories:231, protein:43, carbs:0, fat:5,  fiber:0, sugar:0, sodium:94  },
{ name:“Chicken Breast (6 oz)”,  emoji:“🍗”, calories:278, protein:52, carbs:0, fat:6,  fiber:0, sugar:0, sodium:112 },
{ name:“Chicken Breast (7 oz)”,  emoji:“🍗”, calories:324, protein:61, carbs:0, fat:7,  fiber:0, sugar:0, sodium:131 },
{ name:“Chicken Breast (8 oz)”,  emoji:“🍗”, calories:370, protein:69, carbs:0, fat:8,  fiber:0, sugar:0, sodium:150 },
{ name:“Chicken Breast (10 oz)”, emoji:“🍗”, calories:463, protein:87, carbs:0, fat:10, fiber:0, sugar:0, sodium:188 },
{ name:“Chicken Thigh (4 oz)”,   emoji:“🍗”, calories:209, protein:28, carbs:0, fat:10, fiber:0, sugar:0, sodium:95  },
{ name:“Chicken Thigh (6 oz)”,   emoji:“🍗”, calories:314, protein:42, carbs:0, fat:15, fiber:0, sugar:0, sodium:143 },
{ name:“Chicken Thigh (8 oz)”,   emoji:“🍗”, calories:418, protein:56, carbs:0, fat:20, fiber:0, sugar:0, sodium:190 },
{ name:“Ground Turkey (4 oz)”,   emoji:“🦃”, calories:170, protein:22, carbs:0, fat:9,  fiber:0, sugar:0, sodium:75  },
{ name:“Ground Turkey (6 oz)”,   emoji:“🦃”, calories:255, protein:33, carbs:0, fat:13, fiber:0, sugar:0, sodium:113 },
{ name:“Ground Turkey (8 oz)”,   emoji:“🦃”, calories:340, protein:44, carbs:0, fat:18, fiber:0, sugar:0, sodium:150 },
{ name:“Turkey Breast deli (3 oz)”, emoji:“🦃”, calories:90, protein:18, carbs:1, fat:1, fiber:0, sugar:0, sodium:570 },
]},
{ label:“🥩 Beef & Pork”, foods:[
{ name:“Ground Beef 90% (4 oz)”, emoji:“🥩”, calories:196, protein:24, carbs:0, fat:11, fiber:0, sugar:0, sodium:75  },
{ name:“Ground Beef 90% (6 oz)”, emoji:“🥩”, calories:294, protein:36, carbs:0, fat:16, fiber:0, sugar:0, sodium:113 },
{ name:“Ground Beef 90% (8 oz)”, emoji:“🥩”, calories:392, protein:48, carbs:0, fat:22, fiber:0, sugar:0, sodium:150 },
{ name:“Sirloin Steak (4 oz)”,   emoji:“🥩”, calories:213, protein:31, carbs:0, fat:9,  fiber:0, sugar:0, sodium:60  },
{ name:“Sirloin Steak (6 oz)”,   emoji:“🥩”, calories:320, protein:46, carbs:0, fat:14, fiber:0, sugar:0, sodium:90  },
{ name:“Sirloin Steak (8 oz)”,   emoji:“🥩”, calories:426, protein:61, carbs:0, fat:18, fiber:0, sugar:0, sodium:120 },
{ name:“Bacon (2 strips)”,       emoji:“🥓”, calories:86,  protein:6,  carbs:0.1,fat:7, fiber:0, sugar:0, sodium:368 },
{ name:“Bacon (4 strips)”,       emoji:“🥓”, calories:172, protein:12, carbs:0.2,fat:14,fiber:0, sugar:0, sodium:736 },
{ name:“Pork Tenderloin (4 oz)”, emoji:“🥩”, calories:140, protein:24, carbs:0,  fat:4,  fiber:0, sugar:0, sodium:60  },
{ name:“Pork Tenderloin (6 oz)”, emoji:“🥩”, calories:210, protein:36, carbs:0,  fat:6,  fiber:0, sugar:0, sodium:90  },
{ name:“Hot Dog (1)”,            emoji:“🌭”, calories:180, protein:7,  carbs:2,  fat:16, fiber:0, sugar:1, sodium:550 },
]},
{ label:“🐟 Fish & Seafood”, foods:[
{ name:“Salmon (4 oz)”,    emoji:“🐟”, calories:234, protein:31, carbs:0, fat:12,  fiber:0, sugar:0, sodium:64  },
{ name:“Salmon (6 oz)”,    emoji:“🐟”, calories:351, protein:47, carbs:0, fat:18,  fiber:0, sugar:0, sodium:96  },
{ name:“Salmon (8 oz)”,    emoji:“🐟”, calories:468, protein:62, carbs:0, fat:24,  fiber:0, sugar:0, sodium:128 },
{ name:“Tuna can (water)”, emoji:“🐟”, calories:109, protein:25, carbs:0, fat:1,   fiber:0, sugar:0, sodium:303 },
{ name:“Shrimp (4 oz)”,    emoji:“🦐”, calories:112, protein:24, carbs:0, fat:1.5, fiber:0, sugar:0, sodium:190 },
{ name:“Shrimp (6 oz)”,    emoji:“🦐”, calories:168, protein:36, carbs:0, fat:2,   fiber:0, sugar:0, sodium:285 },
{ name:“Tilapia (4 oz)”,   emoji:“🐟”, calories:145, protein:30, carbs:0, fat:2.5, fiber:0, sugar:0, sodium:75  },
{ name:“Cod (4 oz)”,       emoji:“🐟”, calories:96,  protein:21, carbs:0, fat:0.8, fiber:0, sugar:0, sodium:62  },
{ name:“Sardines (1 can)”, emoji:“🐟”, calories:191, protein:23, carbs:0, fat:11,  fiber:0, sugar:0, sodium:465 },
]},
{ label:“🍚 Grains & Carbs”, foods:[
{ name:“White Rice (1/2 cup)”,   emoji:“🍚”, calories:103, protein:2,  carbs:22, fat:0.2, fiber:0.3, sugar:0,   sodium:1   },
{ name:“White Rice (1 cup)”,     emoji:“🍚”, calories:206, protein:4,  carbs:45, fat:0.4, fiber:0.6, sugar:0,   sodium:2   },
{ name:“White Rice (1.5 cups)”,  emoji:“🍚”, calories:309, protein:6,  carbs:67, fat:0.6, fiber:0.9, sugar:0,   sodium:3   },
{ name:“Brown Rice (1 cup)”,     emoji:“🍚”, calories:216, protein:5,  carbs:45, fat:1.8, fiber:3.5, sugar:0,   sodium:10  },
{ name:“Quinoa (1 cup)”,         emoji:“🌾”, calories:222, protein:8,  carbs:39, fat:4,   fiber:5,   sugar:1.6, sodium:13  },
{ name:“Oatmeal cooked (1 cup)”, emoji:“🥣”, calories:158, protein:6,  carbs:27, fat:3,   fiber:4,   sugar:0,   sodium:115 },
{ name:“Sweet Potato small”,     emoji:“🍠”, calories:60,  protein:1,  carbs:14, fat:0,   fiber:2,   sugar:4,   sodium:24  },
{ name:“Sweet Potato medium”,    emoji:“🍠”, calories:103, protein:2,  carbs:24, fat:0.1, fiber:3.8, sugar:7,   sodium:41  },
{ name:“Sweet Potato large”,     emoji:“🍠”, calories:162, protein:3,  carbs:37, fat:0.2, fiber:5.9, sugar:12,  sodium:65  },
{ name:“White Potato medium”,    emoji:“🥔”, calories:163, protein:4,  carbs:37, fat:0.2, fiber:3.8, sugar:1.7, sodium:13  },
{ name:“Bread WW (1 slice)”,     emoji:“🍞”, calories:81,  protein:4,  carbs:14, fat:1,   fiber:1.9, sugar:1.4, sodium:147 },
{ name:“Bagel plain”,            emoji:“🥯”, calories:270, protein:11, carbs:53, fat:1.5, fiber:2,   sugar:6,   sodium:430 },
{ name:“Pasta (1 cup cooked)”,   emoji:“🍝”, calories:220, protein:8,  carbs:43, fat:1.3, fiber:2.5, sugar:0.6, sodium:1   },
{ name:“Tortilla large flour”,   emoji:“🫓”, calories:218, protein:6,  carbs:36, fat:5,   fiber:2,   sugar:1,   sodium:440 },
{ name:“Carb Balance Tortilla”,  emoji:“🫓”, calories:110, protein:5,  carbs:22, fat:3,   fiber:11,  sugar:0,   sodium:380 },
{ name:“Rice Cakes (2)”,         emoji:“🍘”, calories:70,  protein:1,  carbs:15, fat:0.5, fiber:0.3, sugar:0,   sodium:58  },
]},
{ label:“🥗 Vegetables”, foods:[
{ name:“Broccoli (1 cup)”,      emoji:“🥦”, calories:55,  protein:4,   carbs:11, fat:0.6, fiber:5,   sugar:2,   sodium:64  },
{ name:“Broccoli (2 cups)”,     emoji:“🥦”, calories:110, protein:8,   carbs:22, fat:1.2, fiber:10,  sugar:4,   sodium:128 },
{ name:“Spinach (2 cups raw)”,  emoji:“🥬”, calories:14,  protein:1.7, carbs:2,  fat:0.2, fiber:1.3, sugar:0.2, sodium:48  },
{ name:“Kale (2 cups raw)”,     emoji:“🥬”, calories:67,  protein:4.4, carbs:12, fat:0.9, fiber:2.6, sugar:0,   sodium:58  },
{ name:“Mixed Greens (2 cups)”, emoji:“🥗”, calories:18,  protein:1.5, carbs:3,  fat:0.2, fiber:1.5, sugar:1,   sodium:35  },
{ name:“Avocado (1/2)”,         emoji:“🥑”, calories:120, protein:1.5, carbs:6,  fat:11,  fiber:5,   sugar:0.5, sodium:5   },
{ name:“Avocado (whole)”,       emoji:“🥑”, calories:240, protein:3,   carbs:12, fat:22,  fiber:10,  sugar:1,   sodium:10  },
{ name:“Bell Pepper (1 med)”,   emoji:“🫑”, calories:31,  protein:1,   carbs:7,  fat:0.3, fiber:2.5, sugar:3.7, sodium:4   },
{ name:“Asparagus (6 spears)”,  emoji:“🌿”, calories:20,  protein:2,   carbs:3,  fat:0.2, fiber:2,   sugar:1,   sodium:13  },
{ name:“Green Beans (1 cup)”,   emoji:“🫛”, calories:44,  protein:2,   carbs:10, fat:0.4, fiber:4,   sugar:5,   sodium:1   },
{ name:“Cucumber (1 cup)”,      emoji:“🥒”, calories:16,  protein:0.7, carbs:3.8,fat:0.1, fiber:0.5, sugar:2,   sodium:2   },
{ name:“Tomato (1 med)”,        emoji:“🍅”, calories:22,  protein:1.1, carbs:4.8,fat:0.2, fiber:1.5, sugar:3.2, sodium:6   },
{ name:“Mushrooms (1 cup)”,     emoji:“🍄”, calories:21,  protein:3,   carbs:3,  fat:0.3, fiber:1,   sugar:2,   sodium:4   },
{ name:“Carrots (1 cup)”,       emoji:“🥕”, calories:52,  protein:1.2, carbs:12, fat:0.3, fiber:3.6, sugar:6,   sodium:88  },
{ name:“Corn (1 ear)”,          emoji:“🌽”, calories:132, protein:4.9, carbs:29, fat:1.8, fiber:3.6, sugar:9,   sodium:21  },
{ name:“Edamame (1/2 cup)”,     emoji:“🫘”, calories:94,  protein:9,   carbs:8,  fat:4,   fiber:4,   sugar:2,   sodium:9   },
]},
{ label:“🍎 Fruits”, foods:[
{ name:“Banana medium”,        emoji:“🍌”, calories:105, protein:1.3, carbs:27, fat:0.4, fiber:3.1, sugar:14, sodium:1 },
{ name:“Apple medium”,         emoji:“🍎”, calories:95,  protein:0.5, carbs:25, fat:0.3, fiber:4.4, sugar:19, sodium:2 },
{ name:“Strawberries (1 cup)”, emoji:“🍓”, calories:49,  protein:1,   carbs:12, fat:0.5, fiber:3,   sugar:7,  sodium:2 },
{ name:“Blueberries (1 cup)”,  emoji:“🫐”, calories:84,  protein:1.1, carbs:21, fat:0.5, fiber:3.6, sugar:15, sodium:1 },
{ name:“Orange medium”,        emoji:“🍊”, calories:62,  protein:1.2, carbs:15, fat:0.2, fiber:3.1, sugar:12, sodium:0 },
{ name:“Mango (1 cup)”,        emoji:“🥭”, calories:99,  protein:1.4, carbs:25, fat:0.6, fiber:2.6, sugar:23, sodium:2 },
{ name:“Raspberries (1 cup)”,  emoji:“🫐”, calories:64,  protein:1.5, carbs:15, fat:0.8, fiber:8,   sugar:5,  sodium:1 },
{ name:“Watermelon (2 cups)”,  emoji:“🍉”, calories:86,  protein:1.7, carbs:22, fat:0.4, fiber:1.1, sugar:18, sodium:4 },
]},
{ label:“🥜 Nuts & Seeds”, foods:[
{ name:“Almonds (1 oz)”,         emoji:“🌰”, calories:164, protein:6,   carbs:6,  fat:14,  fiber:3.5, sugar:1.2, sodium:0   },
{ name:“Walnuts (1 oz)”,         emoji:“🌰”, calories:185, protein:4.3, carbs:4,  fat:18,  fiber:1.9, sugar:0.7, sodium:1   },
{ name:“Peanut Butter (1 tbsp)”, emoji:“🥜”, calories:94,  protein:4,   carbs:3,  fat:8,   fiber:1,   sugar:1.5, sodium:76  },
{ name:“Peanut Butter (2 tbsp)”, emoji:“🥜”, calories:188, protein:8,   carbs:6,  fat:16,  fiber:2,   sugar:3,   sodium:152 },
{ name:“Almond Butter (2 tbsp)”, emoji:“🌰”, calories:196, protein:7,   carbs:6,  fat:18,  fiber:3.3, sugar:1.7, sodium:72  },
{ name:“Chia Seeds (2 tbsp)”,    emoji:“🌱”, calories:138, protein:4.7, carbs:12, fat:8.7, fiber:9.8, sugar:0,   sodium:5   },
{ name:“Mixed Nuts (1 oz)”,      emoji:“🌰”, calories:173, protein:5,   carbs:6,  fat:16,  fiber:2,   sugar:1.3, sodium:110 },
]},
{ label:“💪 Protein Bars & Shakes”, foods:[
{ name:“Quest Bar avg”,               emoji:“💪”, calories:200, protein:21, carbs:22, fat:8,   fiber:14, sugar:1,  sodium:250 },
{ name:“RXBar avg”,                   emoji:“💪”, calories:210, protein:12, carbs:24, fat:9,   fiber:5,  sugar:13, sodium:260 },
{ name:“ONE Bar avg”,                 emoji:“💪”, calories:220, protein:20, carbs:23, fat:7,   fiber:10, sugar:1,  sodium:220 },
{ name:“Barebells Protein Bar”,       emoji:“💪”, calories:200, protein:20, carbs:20, fat:7,   fiber:6,  sugar:2,  sodium:150 },
{ name:“Premier Protein Shake”,       emoji:“🥤”, calories:160, protein:30, carbs:6,  fat:3,   fiber:1,  sugar:1,  sodium:390 },
{ name:“Fairlife Core Power”,         emoji:“🥤”, calories:230, protein:42, carbs:13, fat:3.5, fiber:0,  sugar:11, sodium:280 },
{ name:“Protein Shake 1 scoop avg”,   emoji:“🥤”, calories:120, protein:25, carbs:5,  fat:2,   fiber:1,  sugar:2,  sodium:150 },
{ name:“Isopure Zero Carb (1 scoop)”, emoji:“🥤”, calories:110, protein:25, carbs:0,  fat:0.5, fiber:0,  sugar:0,  sodium:140 },
{ name:“ON Gold Standard (1 scoop)”,  emoji:“🥤”, calories:120, protein:24, carbs:3,  fat:1,   fiber:1,  sugar:1,  sodium:130 },
]},
{ label:“🥣 Breakfast Foods”, foods:[
{ name:“Pancakes (3 med)”,        emoji:“🥞”, calories:345, protein:9,  carbs:57, fat:10,  fiber:1.5, sugar:8,  sodium:730 },
{ name:“Waffle (1 large)”,        emoji:“🧇”, calories:220, protein:6,  carbs:25, fat:11,  fiber:1,   sugar:4,  sodium:380 },
{ name:“Cheerios (1 cup)”,        emoji:“🥣”, calories:100, protein:3,  carbs:20, fat:2,   fiber:3,   sugar:1,  sodium:140 },
{ name:“Granola (1/2 cup)”,       emoji:“🥣”, calories:209, protein:5,  carbs:36, fat:6,   fiber:3,   sugar:12, sodium:14  },
{ name:“Pop-Tart (1)”,            emoji:“🍰”, calories:200, protein:2,  carbs:37, fat:5,   fiber:0.5, sugar:16, sodium:170 },
{ name:“Bagel + Cream Cheese”,    emoji:“🥯”, calories:369, protein:13, carbs:54, fat:12,  fiber:2,   sugar:7,  sodium:520 },
]},
{ label:“🍔 Fast Food”, foods:[
{ name:“McDouble”,                  emoji:“🍔”, calories:400, protein:22, carbs:33, fat:20, fiber:2,  sugar:7,  sodium:840  },
{ name:“Big Mac”,                   emoji:“🍔”, calories:550, protein:25, carbs:46, fat:30, fiber:3,  sugar:9,  sodium:1010 },
{ name:“McD Fries Medium”,          emoji:“🍟”, calories:320, protein:4,  carbs:44, fat:15, fiber:3,  sugar:0,  sodium:400  },
{ name:“Chick-fil-A Sandwich”,      emoji:“🍔”, calories:440, protein:28, carbs:40, fat:19, fiber:1,  sugar:5,  sodium:1350 },
{ name:“Chick-fil-A Nuggets 8pc”,   emoji:“🍗”, calories:260, protein:26, carbs:11, fat:12, fiber:0,  sugar:1,  sodium:1010 },
{ name:“Chipotle Chicken Bowl”,     emoji:“🥙”, calories:655, protein:51, carbs:62, fat:21, fiber:11, sugar:5,  sodium:1810 },
{ name:“Subway 6in Turkey”,         emoji:“🥖”, calories:280, protein:18, carbs:46, fat:3.5,fiber:4,  sugar:7,  sodium:760  },
{ name:“Taco Bell Crunchy Taco”,    emoji:“🌮”, calories:170, protein:8,  carbs:13, fat:9,  fiber:3,  sugar:1,  sodium:310  },
{ name:“Raising Cane Chicken Fngr”, emoji:“🍗”, calories:145, protein:13, carbs:8,  fat:6,  fiber:0,  sugar:0,  sodium:360  },
{ name:“Panda Orange Chicken”,      emoji:“🍊”, calories:490, protein:26, carbs:67, fat:14, fiber:2,  sugar:35, sodium:820  },
]},
{ label:“🍕 Pizza & Snacks”, foods:[
{ name:“Pizza Cheese (1 slice)”,    emoji:“🍕”, calories:285, protein:12, carbs:36, fat:10, fiber:2,   sugar:3,   sodium:640 },
{ name:“Pizza Pepperoni (1 slice)”, emoji:“🍕”, calories:313, protein:14, carbs:34, fat:13, fiber:2,   sugar:3,   sodium:760 },
{ name:“Popcorn air (3 cups)”,      emoji:“🍿”, calories:93,  protein:3,  carbs:19, fat:1,  fiber:3.6, sugar:0.2, sodium:2   },
{ name:“Chips potato (1 oz)”,       emoji:“🥔”, calories:152, protein:2,  carbs:15, fat:10, fiber:1,   sugar:0.1, sodium:148 },
{ name:“Beef Jerky (1 oz)”,         emoji:“🥩”, calories:116, protein:9.4,carbs:3.1,fat:7.3,fiber:0.5, sugar:2.6, sodium:506 },
{ name:“Cheese Stick (1)”,          emoji:“🧀”, calories:80,  protein:7,  carbs:1,  fat:5,  fiber:0,   sugar:0,   sodium:200 },
{ name:“Trail Mix (1/4 cup)”,       emoji:“🌰”, calories:173, protein:5,  carbs:17, fat:11, fiber:2,   sugar:8,   sodium:72  },
]},
{ label:“🍰 Sweets & Drinks”, foods:[
{ name:“Dark Chocolate (1 oz)”, emoji:“🍫”, calories:170, protein:2,   carbs:13, fat:12, fiber:3,  sugar:7,  sodium:5   },
{ name:“Ice Cream (1/2 cup)”,   emoji:“🍦”, calories:207, protein:3.5, carbs:24, fat:11, fiber:0.7,sugar:21, sodium:80  },
{ name:“Cookie choc chip (1)”,  emoji:“🍪”, calories:148, protein:2,   carbs:19, fat:7,  fiber:1,  sugar:10, sodium:109 },
{ name:“Donut glazed”,          emoji:“🍩”, calories:269, protein:3,   carbs:31, fat:15, fiber:1,  sugar:14, sodium:319 },
{ name:“Gatorade (20 oz)”,      emoji:“🥤”, calories:140, protein:0,   carbs:36, fat:0,  fiber:0,  sugar:34, sodium:270 },
{ name:“Coffee black (8 oz)”,   emoji:“☕”, calories:5,   protein:0.3, carbs:0.7,fat:0.1,fiber:0,  sugar:0,  sodium:5   },
{ name:“Latte 16oz 2% milk”,    emoji:“☕”, calories:190, protein:13,  carbs:19, fat:7,  fiber:0,  sugar:17, sodium:150 },
{ name:“Beer regular (12 oz)”,  emoji:“🍺”, calories:153, protein:1.6, carbs:13, fat:0,  fiber:0,  sugar:0,  sodium:14  },
]},
{ label:“🫘 Legumes & Tofu”, foods:[
{ name:“Black Beans (1/2 cup)”,  emoji:“🫘”, calories:114, protein:7.6, carbs:20, fat:0.5, fiber:7.5, sugar:0.3, sodium:1  },
{ name:“Black Beans (1 cup)”,    emoji:“🫘”, calories:228, protein:15,  carbs:40, fat:1,   fiber:15,  sugar:0.6, sodium:2  },
{ name:“Chickpeas (1/2 cup)”,    emoji:“🫘”, calories:134, protein:7,   carbs:22, fat:2.1, fiber:6,   sugar:3.9, sodium:5  },
{ name:“Lentils (1/2 cup)”,      emoji:“🫘”, calories:115, protein:9,   carbs:20, fat:0.4, fiber:7.8, sugar:1.8, sodium:2  },
{ name:“Tofu firm (4 oz)”,       emoji:“🟦”, calories:94,  protein:10,  carbs:2.3,fat:5,   fiber:0.3, sugar:0.5, sodium:94 },
{ name:“Tempeh (4 oz)”,          emoji:“🟫”, calories:222, protein:21,  carbs:11, fat:12,  fiber:7.3, sugar:0,   sodium:9  },
]},
{ label:“🫙 Sauces & Condiments”, foods:[
{ name:“Olive Oil (1 tbsp)”,      emoji:“🫒”, calories:119, protein:0,   carbs:0,   fat:13.5, fiber:0,  sugar:0,   sodium:0   },
{ name:“Olive Oil (2 tbsp)”,      emoji:“🫒”, calories:238, protein:0,   carbs:0,   fat:27,   fiber:0,  sugar:0,   sodium:0   },
{ name:“Butter (1 tbsp)”,         emoji:“🧈”, calories:102, protein:0.1, carbs:0,   fat:11.5, fiber:0,  sugar:0,   sodium:82  },
{ name:“Ketchup (1 tbsp)”,        emoji:“🍅”, calories:17,  protein:0.2, carbs:4.6, fat:0,    fiber:0,  sugar:3.7, sodium:154 },
{ name:“Hot Sauce (1 tsp)”,       emoji:“🌶️”, calories:0,   protein:0,   carbs:0.1, fat:0,    fiber:0,  sugar:0,   sodium:124 },
{ name:“Soy Sauce (1 tbsp)”,      emoji:“🫙”, calories:11,  protein:1.3, carbs:1,   fat:0,    fiber:0,  sugar:0,   sodium:879 },
{ name:“BBQ Sauce (2 tbsp)”,      emoji:“🫙”, calories:58,  protein:0.5, carbs:14,  fat:0.1,  fiber:0,  sugar:11,  sodium:340 },
{ name:“Ranch (2 tbsp)”,          emoji:“🥛”, calories:73,  protein:0.4, carbs:1.4, fat:7.7,  fiber:0,  sugar:1,   sodium:122 },
{ name:“Honey (1 tbsp)”,          emoji:“🍯”, calories:64,  protein:0.1, carbs:17,  fat:0,    fiber:0,  sugar:17,  sodium:0   },
{ name:“Sriracha (1 tsp)”,        emoji:“🌶️”, calories:5,   protein:0.1, carbs:1,   fat:0.1,  fiber:0,  sugar:0.7, sodium:80  },
{ name:“Salsa (2 tbsp)”,          emoji:“🍅”, calories:10,  protein:0.5, carbs:2,   fat:0,    fiber:0.5,sugar:1,   sodium:230 },
{ name:“Guacamole (2 tbsp)”,      emoji:“🥑”, calories:45,  protein:0.5, carbs:2.5, fat:4,    fiber:1.5,sugar:0,   sodium:115 },
{ name:“Tahini (1 tbsp)”,         emoji:“🫙”, calories:89,  protein:2.6, carbs:3.2, fat:8,    fiber:1.4,sugar:0.1, sodium:17  },
]},
];

const THEMES = [
{ id:“obsidian”, label:“Obsidian”, swatch:”#030712”, bg:”#030712”, card:”#0a0f1a”, card2:”#0f172a”, border:”#1e293b”, text:”#f1f5f9”, textSub:”#94a3b8”, textFaint:”#475569” },
{ id:“midnight”, label:“Midnight”, swatch:”#0d0d20”, bg:”#0d0d20”, card:”#14142e”, card2:”#1a1a3d”, border:”#2d2d60”, text:”#e8e8ff”, textSub:”#9090c0”, textFaint:”#4a4a80” },
{ id:“forest”,   label:“Forest”,   swatch:”#041a08”, bg:”#041a08”, card:”#081f0c”, card2:”#0d2a12”, border:”#1a4a22”, text:”#e0f5e5”, textSub:”#80b890”, textFaint:”#3a6a45” },
{ id:“navy”,     label:“Navy”,     swatch:”#030a1a”, bg:”#030a1a”, card:”#071428”, card2:”#0a1c38”, border:”#1a3560”, text:”#ddeeff”, textSub:”#7aaad0”, textFaint:”#2a5080” },
{ id:“crimson”,  label:“Crimson”,  swatch:”#1a0208”, bg:”#1a0208”, card:”#22040c”, card2:”#2c0610”, border:”#5a1022”, text:”#ffe0e8”, textSub:”#c07080”, textFaint:”#7a2030” },
{ id:“storm”,    label:“Storm”,    swatch:”#081018”, bg:”#081018”, card:”#0f1a24”, card2:”#16222e”, border:”#2a4055”, text:”#d8eaf8”, textSub:”#7aaac8”, textFaint:”#2a5070” },
{ id:“snow”,     label:“Snow”,     swatch:”#c8d4e8”, bg:”#e8edf5”, card:”#f8fafc”, card2:”#dde3ef”, border:”#b0bdd0”, text:”#0f172a”, textSub:”#3a4a60”, textFaint:”#6b7a90” },
{ id:“sky”,      label:“Sky”,      swatch:”#93c5fd”, bg:”#dbeafe”, card:”#bfdbfe”, card2:”#93c5fd”, border:”#3b82f6”, text:”#072060”, textSub:”#1d4ed8”, textFaint:”#3b82f6” },
{ id:“sage”,     label:“Sage”,     swatch:”#86efac”, bg:”#dcfce7”, card:”#bbf7d0”, card2:”#86efac”, border:”#22c55e”, text:”#052e16”, textSub:”#15803d”, textFaint:”#16a34a” },
{ id:“ocean”,    label:“Ocean”,    swatch:”#0077b6”, bg:”#0077b6”, card:”#0096c7”, card2:”#00b4d8”, border:”#48cae4”, text:”#ffffff”, textSub:”#caf0f8”, textFaint:”#90e0ef” },
{ id:“emerald”,  label:“Emerald”,  swatch:”#065f46”, bg:”#065f46”, card:”#047857”, card2:”#059669”, border:”#34d399”, text:”#ffffff”, textSub:”#a7f3d0”, textFaint:”#6ee7b7” },
{ id:“royal”,    label:“Royal”,    swatch:”#3730a3”, bg:”#3730a3”, card:”#4338ca”, card2:”#4f46e5”, border:”#818cf8”, text:”#ffffff”, textSub:”#c7d2fe”, textFaint:”#a5b4fc” },
{ id:“rose”,     label:“Rose”,     swatch:”#9f1239”, bg:”#9f1239”, card:”#be123c”, card2:”#e11d48”, border:”#fb7185”, text:”#ffffff”, textSub:”#fecdd3”, textFaint:”#fda4af” },
{ id:“amber”,    label:“Amber”,    swatch:”#92400e”, bg:”#92400e”, card:”#b45309”, card2:”#d97706”, border:”#fbbf24”, text:”#ffffff”, textSub:”#fde68a”, textFaint:”#fcd34d” },
{ id:“sunset”,   label:“Sunset”,   swatch:”#c2410c”, bg:”#c2410c”, card:”#ea580c”, card2:”#f97316”, border:”#fdba74”, text:”#ffffff”, textSub:”#fed7aa”, textFaint:”#fdba74” },
];

const MIME_MAP = {“image/jpeg”:“image/jpeg”,“image/jpg”:“image/jpeg”,“image/png”:“image/png”,“image/webp”:“image/webp”,“image/gif”:“image/gif”};
function safeNum(v){const x=parseFloat(v);return isNaN(x)?0:x;}
function round1(x){return Math.round(safeNum(x)*10)/10;}
function extractJSON(text){
if(!text||typeof text!==“string”)return{parsed:null,error:“Empty”};
let s=text.trim().replace(/```(?:json)?/gi,””).trim();
const start=s.indexOf(”{”),end=s.lastIndexOf(”}”);
if(start===-1||end===-1||end<=start)return{parsed:null,error:“No JSON”};
try{return{parsed:JSON.parse(s.slice(start,end+1)),error:null};}
catch(e){return{parsed:null,error:“Parse failed”};}
}
function hasClaudeStorage(){return typeof window!==“undefined”&&window.storage!=null&&typeof window.storage.set===“function”;}
async function storageSave(key,value){
try{
if(hasClaudeStorage()){await window.storage.set(key,JSON.stringify(value));}
else{localStorage.setItem(key,JSON.stringify(value));}
}catch{}
}
async function storageLoad(key){
if(hasClaudeStorage()){try{const r=await window.storage.get(key);return r&&r.value?JSON.parse(r.value):null;}catch{return null;}}
try{const str=localStorage.getItem(key);return str?JSON.parse(str):null;}catch{return null;}
}
async function searchFood(query){
try{
const res=await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=6&api_key=DEMO_KEY`);
const data=await res.json();
if(!data.foods||!data.foods.length)return[];
return data.foods.map(food=>{
const n=food.foodNutrients||[];
const get=(id)=>{const f=n.find(x=>x.nutrientId===id||x.nutrientNumber===String(id));return f?Math.round(f.value*10)/10:0;};
return{name:food.description,emoji:“🔍”,brand:food.brandOwner||””,calories:get(1008)||get(“208”),protein:get(1003)||get(“203”),carbs:get(1005)||get(“205”),fat:get(1004)||get(“204”),fiber:get(1079)||get(“291”),sugar:get(2000)||get(“269”),sodium:get(1093)||get(“307”)};
});
}catch{return[];}
}

function CalRing({eaten,goal,T}){
const pct=Math.min(eaten/goal,1),over=eaten>goal;
const radius=52,circ=2*Math.PI*radius,fill=pct*circ;
const color=over?”#f87171”:pct>=0.9?”#fbbf24”:”#34d399”;
return(
<div style={{display:“flex”,alignItems:“center”,gap:20}}>
<div style={{position:“relative”,width:120,height:120,flexShrink:0}}>
<svg width=“120” height=“120” style={{transform:“rotate(-90deg)”,display:“block”}}>
<circle cx="60" cy="60" r={radius} fill="none" stroke={T.border} strokeWidth="10"/>
<circle cx=“60” cy=“60” r={radius} fill=“none” stroke={color} strokeWidth=“10” strokeLinecap=“round” strokeDasharray={`${fill} ${circ-fill}`} style={{transition:“stroke-dasharray .6s ease”}}/>
</svg>
<div style={{position:“absolute”,inset:0,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<span style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:26,fontWeight:700,color,lineHeight:1}}>{eaten}</span>
<span style={{fontSize:10,color:T.textSub,fontFamily:”‘DM Mono’,monospace”}}>/{goal}</span>
</div>
</div>
<div>
<div style={{fontSize:10,color:T.textSub,fontFamily:”‘DM Mono’,monospace”,letterSpacing:“0.08em”,marginBottom:4}}>CALORIES TODAY</div>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:28,fontWeight:700,color,lineHeight:1,marginBottom:6}}>{over?`+${eaten-goal} OVER`:`${goal-eaten} LEFT`}</div>
<div style={{width:140,height:4,background:T.border,borderRadius:99,overflow:“hidden”}}>
<div style={{width:`${Math.min(pct*100,100)}%`,height:“100%”,background:color,borderRadius:99,transition:“width .6s ease”}}/>
</div>
<div style={{fontSize:10,color:T.textFaint,fontFamily:”‘DM Mono’,monospace”,marginTop:4}}>{Math.round(pct*100)}% of {goal} kcal</div>
</div>
</div>
);
}
function MacroBar({label,value,max,unit,color,T}){
const over=value>max,pct=Math.min((value/max)*100,100);
return(
<div style={{marginBottom:10}}>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:4}}>
<span style={{fontSize:11,color:T.textSub,fontFamily:”‘DM Mono’,monospace”}}>{label}</span>
<span style={{fontSize:12,fontWeight:700,color:over?”#f87171”:T.text,fontFamily:”‘DM Mono’,monospace”}}>{value}{unit} <span style={{color:T.textFaint,fontWeight:400}}>/ {max}{unit}</span></span>
</div>
<div style={{height:5,background:T.border,borderRadius:99,overflow:“hidden”}}>
<div style={{width:`${pct}%`,height:“100%”,background:over?”#f87171”:color,borderRadius:99,transition:“width .5s ease”}}/>
</div>
</div>
);
}
function StatPill({label,value,unit,color,T}){
return(
<div style={{background:T.card2,border:“1px solid “+T.border,borderRadius:10,padding:“8px 12px”,textAlign:“center”,minWidth:64}}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:8,color:T.textFaint,letterSpacing:“0.12em”,marginBottom:2}}>{label}</div>
<div style={{fontFamily:”‘Barlow Condensed’,sans-serif”,fontSize:20,fontWeight:700,color}}>{value}<span style={{fontSize:11,fontWeight:400}}>{unit}</span></div>
</div>
);
}

export default function App(){
const [meals,setMeals]=useState([]);
const [savedTemplates,setSavedTemplates]=useState([]);
const [goals,setGoals]=useState(DEFAULT_GOALS);
const [tab,setTab]=useState(“home”);
const [confirm,setConfirm]=useState(false);
const [themeId,setThemeId]=useState(“obsidian”);
const [showTheme,setShowTheme]=useState(false);
const [showGoals,setShowGoals]=useState(false);
const [goalsForm,setGoalsForm]=useState(DEFAULT_GOALS);
const [showSaved,setShowSaved]=useState(false);
const [delSaved,setDelSaved]=useState(null);
const [loaded,setLoaded]=useState(false);
const [showSplash,setShowSplash]=useState(true);
// Pet state
const [petId,setPetId]=useState(null);
const [petXP,setPetXP]=useState(0);
const [petName,setPetName]=useState(””);
const [showPetSelect,setShowPetSelect]=useState(false);
const [xpGain,setXpGain]=useState(null);
// Streak
const [streak,setStreak]=useState(0);
const [lastLogDate,setLastLogDate]=useState(null);
// Build meal
const [mealName,setMealName]=useState(””);
const [ingredients,setIngredients]=useState([]);
const [mealErr,setMealErr]=useState(””);
const [activeCat,setActiveCat]=useState(0);
const [searchQ,setSearchQ]=useState(””);
const [searchRes,setSearchRes]=useState([]);
const [searching,setSearching]=useState(false);
const [searchErr,setSearchErr]=useState(””);
const [dragOver,setDragOver]=useState(false);
// AI Coach
const [coachMsg,setCoachMsg]=useState(””);
const [coachHistory,setCoachHistory]=useState([]);
const [coachLoading,setCoachLoading]=useState(false);
// Scored meal display
const [scoredMeal,setScoredMeal]=useState(null);
// Photo
const [photoSrc,setPhotoSrc]=useState(null);
const [photoB64,setPhotoB64]=useState(null);
const [photoMime,setPhotoMime]=useState(“image/jpeg”);
const [scanning,setScanning]=useState(false);
const [scanErr,setScanErr]=useState(””);
const fileRef=useRef();
const T=THEMES.find(t=>t.id===themeId)||THEMES[0];
const MACROS=[
{key:“protein”,label:“Protein”,unit:“g”, color:”#34d399”,max:goals.protein},
{key:“carbs”,  label:“Carbs”,  unit:“g”, color:”#60a5fa”,max:goals.carbs},
{key:“fat”,    label:“Fat”,    unit:“g”, color:”#fbbf24”,max:goals.fat},
{key:“fiber”,  label:“Fiber”,  unit:“g”, color:”#a78bfa”,max:goals.fiber},
{key:“sugar”,  label:“Sugar”,  unit:“g”, color:”#f472b6”,max:goals.sugar},
{key:“sodium”, label:“Sodium”, unit:“mg”,color:”#fb923c”,max:goals.sodium},
];

// Load data
useEffect(()=>{
(async()=>{
try{
const m=await storageLoad(“ft-meals”);
const th=await storageLoad(“ft-theme”);
const tmpl=await storageLoad(“ft-templates”);
const g=await storageLoad(“ft-goals”);
const pid=await storageLoad(“ft-petid”);
const pxp=await storageLoad(“ft-petxp”);
const pname=await storageLoad(“ft-petname”);
const str=await storageLoad(“ft-streak”);
const lld=await storageLoad(“ft-lastlog”);
if(Array.isArray(m)&&m.length)setMeals(m);
if(th&&THEMES.find(t=>t.id===th))setThemeId(th);
if(Array.isArray(tmpl))setSavedTemplates(tmpl);
if(g&&typeof g===“object”){setGoals(g);setGoalsForm(g);}
if(pid)setPetId(pid);
if(typeof pxp===“number”)setPetXP(pxp);
if(pname)setPetName(pname);
if(typeof str===“number”)setStreak(str);
if(lld)setLastLogDate(lld);
}catch{}
setLoaded(true);
setTimeout(()=>setShowSplash(false),2400);
})();
},[]);

useEffect(()=>{if(loaded)storageSave(“ft-meals”,meals);},[meals,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-theme”,themeId);},[themeId,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-templates”,savedTemplates);},[savedTemplates,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-goals”,goals);},[goals,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-petid”,petId);},[petId,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-petxp”,petXP);},[petXP,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-petname”,petName);},[petName,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-streak”,streak);},[streak,loaded]);
useEffect(()=>{if(loaded)storageSave(“ft-lastlog”,lastLogDate);},[lastLogDate,loaded]);

const totals=meals.reduce((a,m)=>{
a.calories+=safeNum(m.calories);a.protein+=safeNum(m.protein);a.carbs+=safeNum(m.carbs);
a.fat+=safeNum(m.fat);a.fiber+=safeNum(m.fiber);a.sugar+=safeNum(m.sugar);a.sodium+=safeNum(m.sodium);
return a;
},{calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

const ingTotals=ingredients.reduce((a,i)=>{
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

const petInfo = petId ? PETS.find(p=>p.id===petId) : null;
const petLevel = getPetLevel(petXP);

function awardXP(amount, reason){
setPetXP(prev=>{
const newXP=prev+amount;
return newXP;
});
setXpGain({amount,reason});
setTimeout(()=>setXpGain(null),3000);
}

function updateStreak(){
const today=new Date().toDateString();
if(lastLogDate===today)return;
const yesterday=new Date(Date.now()-86400000).toDateString();
const newStreak=lastLogDate===yesterday?streak+1:1;
setStreak(newStreak);
setLastLogDate(today);
if(newStreak>1){awardXP(Math.min(30,newStreak*3),`${newStreak} day streak!`);}
}

function saveGoals(){
const g={calories:safeNum(goalsForm.calories)||DEFAULT_GOALS.calories,protein:safeNum(goalsForm.protein)||DEFAULT_GOALS.protein,carbs:safeNum(goalsForm.carbs)||DEFAULT_GOALS.carbs,fat:safeNum(goalsForm.fat)||DEFAULT_GOALS.fat,fiber:safeNum(goalsForm.fiber)||DEFAULT_GOALS.fiber,sugar:safeNum(goalsForm.sugar)||DEFAULT_GOALS.sugar,sodium:safeNum(goalsForm.sodium)||DEFAULT_GOALS.sodium};
setGoals(g);setShowGoals(false);
}
function addIng(food){
setIngredients(prev=>{
const ex=prev.find(i=>i.name===food.name);
if(ex)return prev.map(i=>i.name===food.name?{…i,servings:String(safeNum(i.servings)+1)}:i);
return[…prev,{…food,id:Date.now()+Math.random(),servings:“1”}];
});
setMealErr(””);
}
function updServ(id,val){setIngredients(prev=>prev.map(i=>i.id===id?{…i,servings:val}:i));}
function removeIng(id){setIngredients(prev=>prev.filter(i=>i.id!==id));}
function dragStart(e,food){e.dataTransfer.setData(“food”,JSON.stringify(food));}
function drop(e){e.preventDefault();setDragOver(false);try{addIng(JSON.parse(e.dataTransfer.getData(“food”)));}catch{}}
async function doSearch(){
if(!searchQ.trim())return;
setSearching(true);setSearchErr(””);setSearchRes([]);
const r=await searchFood(searchQ);
if(!r.length)setSearchErr(“No results. Try simpler terms.”);
setSearchRes(r);setSearching(false);
}
function saveTmpl(){
if(!mealName.trim()||!ingredients.length){setMealErr(“Name your meal and add ingredients first.”);return;}
setSavedTemplates(prev=>[…prev,{id:Date.now(),name:mealName.trim(),ingredients:ingredients.map(i=>({…i})),calories:ingTotals.calories,protein:ingTotals.protein,carbs:ingTotals.carbs,fat:ingTotals.fat}]);
setMealErr(””);alert(`"${mealName}" saved!`);
}
function loadTmpl(t){setMealName(t.name);setIngredients(t.ingredients.map(i=>({…i,id:Date.now()+Math.random()})));setShowSaved(false);setTab(“build”);setMealErr(””);}
function delTmpl(id){setSavedTemplates(prev=>prev.filter(t=>t.id!==id));setDelSaved(null);}

function logMeal(){
if(!mealName.trim()){setMealErr(“Give your meal a name.”);return;}
if(!ingredients.length){setMealErr(“Add at least one ingredient.”);return;}
const meal={
id:Date.now(),name:mealName.trim(),
calories:ingTotals.calories,protein:ingTotals.protein,carbs:ingTotals.carbs,
fat:ingTotals.fat,fiber:ingTotals.fiber,sugar:ingTotals.sugar,sodium:ingTotals.sodium,
time:new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”}),
ingredientCount:ingredients.length,
};
// Score the meal
const scoreResult=scoreMeal(meal,goals,totals.calories);
meal.score=scoreResult.score;
meal.grade=scoreResult.grade;
meal.gradeColor=scoreResult.gradeColor;
setMeals(prev=>[…prev,meal]);
setScoredMeal({…meal,…scoreResult});

```
// XP awards
if(petId){
  let xp=10;
  let reasons=["Logged a meal +10 XP"];
  if(scoreResult.score>=80){xp+=15;reasons.push("High quality meal +15 XP");}
  else if(scoreResult.score>=65){xp+=8;reasons.push("Good meal +8 XP");}
  awardXP(xp,reasons.join(", "));
}
updateStreak();

setMealName("");setIngredients([]);setMealErr("");clearPhoto();
setTab("log");
```

}

function photoFile(file){
if(!file||!file.type.startsWith(“image/”))return;
const mime=MIME_MAP[file.type]||“image/jpeg”;
const r=new FileReader();
r.onload=e=>{const d=e.target.result;setPhotoSrc(d);setPhotoB64(d.split(”,”)[1]);setPhotoMime(mime);setScanErr(””);};
r.readAsDataURL(file);
}
function clearPhoto(){setPhotoSrc(null);setPhotoB64(null);setScanErr(””);}

async function scan(){
if(!photoB64)return;
setScanning(true);setScanErr(””);
try{
const apiKey=import.meta.env.VITE_ANTHROPIC_KEY;
const res=await fetch(“https://api.anthropic.com/v1/messages”,{
method:“POST”,
headers:{“content-type”:“application/json”,“anthropic-version”:“2023-06-01”,“anthropic-dangerous-direct-browser-access”:“true”,“x-api-key”:apiKey},
body:JSON.stringify({
model:“claude-opus-4-5”,max_tokens:512,
system:“You are a nutrition database. Output only raw JSON starting with { and ending with }.”,
messages:[{role:“user”,content:[
{type:“image”,source:{type:“base64”,media_type:photoMime,data:photoB64}},
{type:“text”,text:“Return JSON with keys: name, calories, protein, carbs, fat, fiber, sugar, sodium.”},
]}],
}),
});
if(!res.ok){const b=await res.text();throw new Error(`HTTP ${res.status}: ${b.slice(0,200)}`);}
const data=await res.json();
const tb=data.content?.find(b=>b.type===“text”);
if(!tb?.text)throw new Error(“Empty response”);
const{parsed,error:pe}=extractJSON(tb.text);
if(!parsed)throw new Error(pe||“Could not read data.”);
addIng({name:String(parsed.name||“Scanned food”),emoji:“📸”,calories:parsed.calories||0,protein:parsed.protein||0,carbs:parsed.carbs||0,fat:parsed.fat||0,fiber:parsed.fiber||0,sugar:parsed.sugar||0,sodium:parsed.sodium||0,brand:””});
}catch(e){setScanErr(e.message||“Something went wrong.”);}
finally{setScanning(false);}
}

async function askCoach(){
if(!coachMsg.trim())return;
const userMsg=coachMsg.trim();
setCoachMsg(””);
setCoachHistory(h=>[…h,{role:“user”,content:userMsg}]);
setCoachLoading(true);
try{
const apiKey=import.meta.env.VITE_ANTHROPIC_KEY;
const context=`Today's nutrition log: Calories: ${Math.round(totals.calories)}/${goals.calories} kcal (${Math.round((totals.calories/goals.calories)*100)}%) Protein: ${round1(totals.protein)}/${goals.protein}g (${Math.round((totals.protein/goals.protein)*100)}%) Carbs: ${round1(totals.carbs)}/${goals.carbs}g Fat: ${round1(totals.fat)}/${goals.fat}g Fiber: ${round1(totals.fiber)}/${goals.fiber}g Meals logged today: ${meals.length} Streak: ${streak} days Average meal score: ${meals.length>0?Math.round(meals.reduce((a,m)=>a+(m.score||0),0)/meals.length):0}/100`;

```
  const messages=[
    ...coachHistory.map(h=>({role:h.role,content:h.content})),
    {role:"user",content:`${context}\n\nUser question: ${userMsg}`},
  ];

  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"content-type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true","x-api-key":apiKey},
    body:JSON.stringify({
      model:"claude-opus-4-5",max_tokens:400,
      system:"You are a friendly, expert nutrition coach inside a macro tracking app called FUEL TRACK. You have the user's today's nutrition data. Give concise, actionable advice in 2-4 sentences. Be encouraging and specific. Reference their actual numbers when relevant.",
      messages,
    }),
  });
  if(!res.ok){const b=await res.text();throw new Error(`HTTP ${res.status}`);}
  const data=await res.json();
  const reply=data.content?.find(b=>b.type==="text")?.text||"I couldn't respond right now.";
  setCoachHistory(h=>[...h,{role:"assistant",content:reply}]);
  if(petId)awardXP(5,"Asked coach +5 XP");
}catch(e){
  setCoachHistory(h=>[...h,{role:"assistant",content:"I need API credits to respond. Add credits at console.anthropic.com."}]);
}
finally{setCoachLoading(false);}
```

}

function delMeal(id){setMeals(prev=>prev.filter(m=>m.id!==id));}
function newDay(){
// Award XP for completed day before resetting
if(petId&&meals.length>0){
const{xp,reasons}=calcDailyXP(meals,totals,goals,streak);
if(xp>0)awardXP(xp,“Day completed: “+reasons[0]);
}
setMeals([]);setMealName(””);setIngredients([]);setMealErr(””);clearPhoto();setConfirm(false);setTab(“home”);setScoredMeal(null);
}

const calOver=totals.calories>goals.calories;
const prevCal=totals.calories+ingTotals.calories;
const displayFoods=searchRes.length>0?searchRes:PRESET_CATEGORIES[activeCat].foods;
const avgScore=meals.length>0?Math.round(meals.reduce((a,m)=>a+(m.score||0),0)/meals.length):null;

function navSt(active){return{flex:1,padding:“10px 0 8px”,border:“none”,cursor:“pointer”,fontFamily:”‘DM Mono’,monospace”,fontSize:9,fontWeight:600,letterSpacing:“0.05em”,background:“transparent”,color:active?”#34d399”:T.textFaint,borderRadius:0,transition:“color .2s”,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:2};}

return(
<div style={{minHeight:“100vh”,background:T.bg,color:T.text,fontFamily:”‘DM Sans’,sans-serif”,transition:“background .4s”,paddingBottom:60}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;} input[type=number]{-moz-appearance:textfield;} .del-btn{opacity:0!important;transition:opacity .2s!important;} .meal-card:hover .del-btn{opacity:1!important;} .food-card{cursor:grab;transition:all .15s;user-select:none;} .food-card:hover{border-color:#34d399!important;transform:translateY(-2px);} .food-card:active{transform:scale(0.97);} .ing-row:hover .ing-del{opacity:1!important;} .ing-del{opacity:0!important;transition:opacity .2s!important;} .pet-card:hover{transform:scale(1.03);} @keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}} @keyframes loadbar{from{width:0%;}to{width:100%;}} @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}} @keyframes xpPop{0%{opacity:0;transform:translateY(0) scale(0.5);}20%{opacity:1;transform:translateY(-20px) scale(1.2);}80%{opacity:1;transform:translateY(-40px) scale(1);}100%{opacity:0;transform:translateY(-60px) scale(0.8);}} .xp-pop{animation:xpPop 2.5s ease-out forwards;} .pet-float{animation:float 3s ease-in-out infinite;}`}</style>

```
  {showSplash&&(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"#030712",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:60,fontWeight:700,letterSpacing:"0.08em",lineHeight:1,marginBottom:6}}>
        <span style={{color:"#34d399"}}>FUEL</span><span style={{color:"#f1f5f9"}}> TRACK</span>
      </div>
      <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:36}}>NUTRITION RPG</div>
      <div style={{display:"flex",gap:8,marginBottom:36}}>
        {["🐶","🐱","🐉","🦊","🐻","🐧","🦁","🐺"].map((e,i)=>(
          <div key={i} style={{fontSize:24,animation:`bounce 1s ease-in-out ${i*0.1}s infinite alternate`}}>{e}</div>
        ))}
      </div>
      <div style={{width:160,height:3,background:"#1e293b",borderRadius:99,overflow:"hidden",marginBottom:10}}>
        <div style={{height:"100%",background:"#34d399",borderRadius:99,animation:"loadbar 2.2s ease-out forwards"}}/>
      </div>
      <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>LOADING YOUR WORLD...</div>
    </div>
  )}

  {/* XP Pop notification */}
  {xpGain&&(
    <div className="xp-pop" style={{position:"fixed",top:80,right:20,zIndex:150,background:"#fbbf24",color:"#030712",borderRadius:12,padding:"8px 16px",fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(251,191,36,0.4)"}}>
      +{xpGain.amount} XP ⚡
    </div>
  )}

  {/* Scored meal overlay */}
  {scoredMeal&&(
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:28,width:"100%",maxWidth:400,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:8}}>{scoredMeal.grade==="S"?"🏆":scoredMeal.grade==="A"?"🥇":scoredMeal.grade==="B"?"🥈":scoredMeal.grade==="C"?"🥉":"📊"}</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:T.textSub,marginBottom:4}}>MEAL SCORE</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:72,fontWeight:700,color:scoredMeal.gradeColor,lineHeight:1,marginBottom:4}}>{scoredMeal.score}</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:700,color:scoredMeal.gradeColor,marginBottom:16}}>GRADE {scoredMeal.grade}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20,textAlign:"left"}}>
          {scoredMeal.details.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:T.card2,borderRadius:8}}>
              <span style={{fontSize:14}}>{d.positive?"✅":"⚠️"}</span>
              <span style={{fontSize:13,color:T.textSub}}>{d.text}</span>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
          {[["CAL",scoredMeal.calories,"kcal"],["PROTEIN",scoredMeal.protein,"g"],["CARBS",scoredMeal.carbs,"g"]].map(([l,v,u])=>(
            <div key={l} style={{background:T.card2,borderRadius:8,padding:"8px"}}>
              <div style={{fontSize:9,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:2}}>{l}</div>
              <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:"'Barlow Condensed',sans-serif"}}>{v}{u}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>setScoredMeal(null)} style={{width:"100%",padding:"13px 0",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>AWESOME! →</button>
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
          {[{key:"calories",label:"Calories (kcal)",color:"#34d399"},{key:"protein",label:"Protein (g)",color:"#34d399"},{key:"carbs",label:"Carbs (g)",color:"#60a5fa"},{key:"fat",label:"Fat (g)",color:"#fbbf24"},{key:"fiber",label:"Fiber (g)",color:"#a78bfa"},{key:"sugar",label:"Sugar (g)",color:"#f472b6"},{key:"sodium",label:"Sodium (mg)",color:"#fb923c"}].map(({key,label,color})=>(
            <div key={key}>
              <label style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>{label}</label>
              <input type="number" min="0" value={goalsForm[key]} onChange={e=>setGoalsForm(f=>({...f,[key]:e.target.value}))}
                style={{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:15,padding:"10px 14px",fontFamily:"'DM Mono',monospace",outline:"none",borderLeft:`3px solid ${color}`}}
              />
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button onClick={()=>setGoalsForm(DEFAULT_GOALS)} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>RESET</button>
          <button onClick={saveGoals} style={{flex:2,padding:"12px 0",background:"#34d399",border:"none",borderRadius:8,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>SAVE GOALS</button>
        </div>
      </div>
    </div>
  )}

  {showTheme&&(
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setShowTheme(false);}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"70vh",overflowY:"auto"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:16}}>🎨 THEMES</div>
        {[["DARK",[0,1,2,3,4,5]],["LIGHT",[6,7,8]],["VIBRANT",[9,10,11,12,13,14]]].map(([lbl,indices])=>(
          <div key={lbl} style={{marginBottom:16}}>
            <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>{lbl}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {indices.map(i=>{const th=THEMES[i];return(
                <button key={th.id} onClick={()=>{setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===th.id?"2px solid #34d399":"1px solid "+T.border,background:th.card,transition:"all .2s"}}>
                  <div style={{width:14,height:14,borderRadius:3,background:th.swatch,border:"1px solid rgba(128,128,128,0.3)",flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===th.id?"#34d399":th.text,whiteSpace:"nowrap"}}>{th.label}</span>
                </button>
              );})}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {confirm&&(
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:32,maxWidth:340,width:"90%",textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>🌅</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,marginBottom:8,color:T.text}}>New Day?</div>
        <p style={{color:T.textSub,fontSize:13,lineHeight:1.6,marginBottom:16}}>Your pet will earn XP for today's progress before resetting.</p>
        <p style={{color:T.textSub,fontSize:13,lineHeight:1.6,marginBottom:24}}>Clears {meals.length} meal{meals.length!==1?"s":""} and resets totals.</p>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setConfirm(false)} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CANCEL</button>
          <button onClick={newDay} style={{flex:1,padding:"12px 0",background:"#7f1d1d",border:"1px solid #991b1b",color:"#fca5a5",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>NEW DAY</button>
        </div>
      </div>
    </div>
  )}

  {showSaved&&(
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)setShowSaved(false);}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>⭐ SAVED MEALS</div>
          <button onClick={()=>setShowSaved(false)} style={{background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>CLOSE</button>
        </div>
        {!savedTemplates.length?(
          <div style={{textAlign:"center",padding:"30px 0",color:T.textFaint,fontSize:13,fontFamily:"'DM Mono',monospace"}}>No saved meals yet. Build a meal and tap SAVE.</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {savedTemplates.map(tmpl=>(
              <div key={tmpl.id} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{tmpl.name}</div>
                    <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{tmpl.calories} kcal · P{tmpl.protein}g</div>
                  </div>
                  <div style={{display:"flex",gap:6,marginLeft:8}}>
                    <button onClick={()=>loadTmpl(tmpl)} style={{padding:"6px 12px",background:"#065f46",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>LOAD</button>
                    {delSaved===tmpl.id?(
                      <button onClick={()=>delTmpl(tmpl.id)} style={{padding:"6px 10px",background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>DEL?</button>
                    ):(
                      <button onClick={()=>setDelSaved(tmpl.id)} style={{padding:"6px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.textFaint,fontSize:13,cursor:"pointer"}}>×</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )}

  {/* Pet selection modal */}
  {showPetSelect&&(
    <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>CHOOSE YOUR PET</div>
        <div style={{fontSize:12,color:T.textSub,textAlign:"center",marginBottom:20}}>Your companion will level up as you hit your nutrition goals!</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {PETS.map(pet=>(
            <button key={pet.id} className="pet-card" onClick={()=>{setPetId(pet.id);if(!petName)setPetName(pet.name);setShowPetSelect(false);}} style={{background:petId===pet.id?pet.color+"22":T.card2,border:`2px solid ${petId===pet.id?pet.color:T.border}`,borderRadius:14,padding:"16px 12px",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
              <div style={{fontSize:40,marginBottom:6}}>{pet.emoji}</div>
              <div style={{fontWeight:700,fontSize:14,color:petId===pet.id?pet.color:T.text,marginBottom:2}}>{pet.name}</div>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{pet.type}</div>
              <div style={{fontSize:11,color:T.textSub,lineHeight:1.4}}>{pet.desc}</div>
            </button>
          ))}
        </div>
        {petId&&<button onClick={()=>setShowPetSelect(false)} style={{width:"100%",marginTop:16,padding:"12px 0",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CONFIRM PET</button>}
      </div>
    </div>
  )}

  {/* Header */}
  <header style={{padding:"12px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
    <div style={{display:"flex",alignItems:"baseline",gap:6}}>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:"#34d399",letterSpacing:"0.06em"}}>FUEL</span>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,letterSpacing:"0.06em"}}>TRACK</span>
      {streak>0&&<span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#fbbf24",marginLeft:4}}>🔥{streak}</span>}
    </div>
    <div style={{display:"flex",gap:6}}>
      <button onClick={()=>{setGoalsForm({...goals});setShowGoals(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🎯</button>
      <button onClick={()=>setShowTheme(true)} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🎨</button>
      {meals.length>0&&<button onClick={()=>setConfirm(true)} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"5px 9px",fontSize:11,cursor:"pointer"}}>🌅</button>}
    </div>
  </header>

  <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 0"}}>

    {/* HOME TAB */}
    {tab==="home"&&(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>

        {/* Calorie ring */}
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

        {/* Macro bars */}
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
          <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>MACRO BREAKDOWN</div>
          {MACROS.map(m=><MacroBar key={m.key} label={m.label} value={round1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T}/>)}
        </div>

        {/* Pet widget */}
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
          {!petId?(
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{fontSize:40,marginBottom:10}}>🥚</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>No Pet Yet!</div>
              <div style={{fontSize:13,color:T.textSub,marginBottom:16}}>Choose a companion to level up as you hit your goals</div>
              <button onClick={()=>setShowPetSelect(true)} style={{padding:"12px 24px",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🐾 CHOOSE PET</button>
            </div>
          ):(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div className="pet-float" style={{fontSize:56,lineHeight:1,cursor:"pointer"}} onClick={()=>setShowPetSelect(true)}>{petInfo?.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:2}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:petInfo?.color}}>{petName||petInfo?.name}</div>
                    <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.textFaint}}>{petLevel.emoji_modifier}</div>
                  </div>
                  <div style={{fontSize:11,color:T.textSub,fontFamily:"'DM Mono',monospace",marginBottom:8}}>LVL {petLevel.level} {petLevel.name} · {petXP} XP</div>
                  <div style={{height:6,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:4}}>
                    <div style={{width:`${petLevel.progress}%`,height:"100%",background:petInfo?.color,borderRadius:99,transition:"width .8s ease"}}/>
                  </div>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>
                    {petLevel.nextLevel?`${petLevel.xp - petLevel.xpRequired} / ${petLevel.nextLevel.xpRequired - petLevel.xpRequired} XP to Lvl ${petLevel.level+1}`:"MAX LEVEL 👑"}
                  </div>
                </div>
              </div>

              {/* Today's XP preview */}
              <div style={{marginTop:12,padding:"10px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:10}}>
                <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>TODAY'S PROGRESS</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[
                    {label:"Meals",value:meals.length,target:3,icon:"🍽️"},
                    {label:"Calories",value:Math.round((totals.calories/goals.calories)*100)+"%",target:null,icon:"🔥",done:totals.calories>=goals.calories*0.85&&totals.calories<=goals.calories*1.05},
                    {label:"Protein",value:Math.round((totals.protein/goals.protein)*100)+"%",target:null,icon:"💪",done:totals.protein>=goals.protein*0.9},
                    {label:"Streak",value:streak+"d",target:null,icon:"⚡",done:streak>0},
                  ].map(({label,value,target,icon,done})=>(
                    <div key={label} style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:12}}>{icon}</span>
                      <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:done===true?"#34d399":done===false?"#f87171":T.textSub}}>{value}{target?"/"+target:""}</span>
                      <span style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daily score */}
        {avgScore!==null&&(
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px",display:"flex",alignItems:"center",gap:16}}>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:48,fontWeight:700,color:avgScore>=80?"#34d399":avgScore>=65?"#fbbf24":"#fb923c",lineHeight:1}}>{avgScore}</div>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>AVG SCORE</div>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:4}}>
                {avgScore>=80?"🏆 Excellent nutrition day!":avgScore>=65?"👍 Good progress today":avgScore>=50?"📈 Room to improve":"⚠️ Focus on quality"}
              </div>
              <div style={{fontSize:12,color:T.textSub}}>
                {meals.length} meal{meals.length!==1?"s":""} logged today · tap LOG to see details
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* LOG TAB */}
    {tab==="log"&&(
      <div>
        {!meals.length?(
          <div style={{background:T.card,border:"1px dashed "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center",marginTop:8}}>
            <div style={{fontSize:36,marginBottom:12}}>🍽️</div>
            <div style={{color:T.textSub,fontSize:14,marginBottom:6}}>No meals logged yet</div>
            <div style={{color:T.textFaint,fontSize:12,fontFamily:"'DM Mono',monospace"}}>Tap 🍳 BUILD to get started</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
            {meals.map((meal,idx)=>(
              <div key={meal.id} className="meal-card" style={{background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:26,height:26,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'DM Mono',monospace",fontSize:10,color:T.textFaint}}>{idx+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:2}}>
                    <span style={{fontWeight:600,fontSize:13,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.textSub,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#34d399"}}>{meal.calories} <span style={{fontSize:12,fontWeight:400,color:T.textSub}}>kcal</span></div>
                    {meal.grade&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,color:meal.gradeColor,background:meal.gradeColor+"22",borderRadius:6,padding:"1px 7px"}}>Grade {meal.grade}</div>}
                    {meal.score!=null&&<div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.textFaint}}>{meal.score}/100</div>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {[{l:"P",v:meal.protein,u:"g",c:"#34d399"},{l:"C",v:meal.carbs,u:"g",c:"#60a5fa"},{l:"F",v:meal.fat,u:"g",c:"#fbbf24"},{l:"Fi",v:meal.fiber,u:"g",c:"#a78bfa"},{l:"Na",v:meal.sodium,u:"mg",c:"#fb923c"}].filter(x=>x.v>0).map(chip=>(
                      <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:4,padding:"1px 6px",fontSize:10,fontFamily:"'DM Mono',monospace",color:chip.c}}>{chip.l} {round1(chip.v)}{chip.u}</span>
                    ))}
                  </div>
                </div>
                <button className="del-btn" onClick={()=>delMeal(meal.id)} style={{background:"transparent",border:"1px solid "+T.border,color:T.textFaint,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ))}
            <div style={{background:calOver?"#1a0505":"#061a0f",border:`1px solid ${calOver?"#7f1d1d":"#14532d"}`,borderRadius:12,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:calOver?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:2}}>{calOver?"⚠ OVER GOAL":"✓ DAILY TOTAL"}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:calOver?"#f87171":"#4ade80",lineHeight:1}}>{Math.round(totals.calories)} / {goals.calories} kcal</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                <div style={{fontSize:12,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{round1(totals.protein)}g protein</div>
                {avgScore!==null&&<div style={{fontSize:11,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>Avg: {avgScore}/100</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* BUILD TAB */}
    {tab==="build"&&(
      <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>MEAL NAME</div>
          <input type="text" value={mealName} onChange={e=>{setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Post-Workout Lunch"
            style={{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"10px 13px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
          />
        </div>

        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>🍽️ FOOD BROWSER — tap to add</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input type="text" value={searchQ} onChange={e=>{setSearchQ(e.target.value);if(!e.target.value)setSearchRes([]);}} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Search any food..."
              style={{flex:1,background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:13,padding:"8px 11px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
            />
            <button onClick={doSearch} disabled={searching} style={{padding:"8px 13px",background:"#0891b2",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"SEARCH"}</button>
            {searchRes.length>0&&<button onClick={()=>{setSearchRes([]);setSearchQ("");}} style={{padding:"8px 10px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer"}}>✕</button>}
          </div>
          {searchErr&&<div style={{fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace",marginBottom:8}}>⚠ {searchErr}</div>}
          {!searchRes.length&&(
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:10,scrollbarWidth:"none"}}>
              {PRESET_CATEGORIES.map((cat,i)=>(
                <button key={i} onClick={()=>setActiveCat(i)} style={{padding:"5px 11px",borderRadius:18,border:"1px solid "+(activeCat===i?"#34d399":T.border),background:activeCat===i?"#34d399":T.card2,color:activeCat===i?"#030712":T.textSub,fontSize:10,fontWeight:600,fontFamily:"'DM Mono',monospace",flexShrink:0,cursor:"pointer",whiteSpace:"nowrap"}}>{cat.label}</button>
              ))}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {displayFoods.map((food,i)=>(
              <div key={i} className="food-card" draggable onDragStart={e=>dragStart(e,food)} onClick={()=>addIng(food)} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:11,padding:"10px",cursor:"pointer"}}>
                <div style={{fontSize:22,marginBottom:4,lineHeight:1}}>{food.emoji}</div>
                <div style={{fontSize:10,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{food.name}</div>
                {food.brand&&<div style={{fontSize:9,color:T.textFaint,marginBottom:3}}>{food.brand}</div>}
                <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#34d399",fontWeight:700}}>{food.calories} kcal</div>
                <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:T.textSub}}>P{food.protein}g · C{food.carbs}g · F{food.fat}g</div>
              </div>
            ))}
          </div>
        </div>

        <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={drop}
          style={{background:T.card,border:`2px ${dragOver?"solid #34d399":"dashed "+T.border}`,borderRadius:16,padding:"14px 16px",minHeight:80,transition:"all .2s"}}>
          {!ingredients.length?(
            <div style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{fontSize:24,marginBottom:5}}>🧺</div>
              <div style={{color:dragOver?"#34d399":T.textSub,fontSize:13,fontWeight:600,marginBottom:2}}>{dragOver?"Drop it!":"Your Meal"}</div>
              <div style={{color:T.textFaint,fontSize:11,fontFamily:"'DM Mono',monospace"}}>Tap foods above to add them</div>
            </div>
          ):(
            <div>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>🧺 {ingredients.length} INGREDIENT{ingredients.length!==1?"S":""}{dragOver&&<span style={{color:"#34d399",marginLeft:8}}>DROP TO ADD</span>}</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {ingredients.map(ing=>(
                  <div key={ing.id} className="ing-row" style={{display:"flex",alignItems:"center",gap:8,background:T.card2,borderRadius:9,padding:"8px 10px",border:"1px solid "+T.border}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ing.emoji||"🍽️"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                      <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{Math.round(safeNum(ing.calories)*safeNum(ing.servings))} kcal · P{round1(safeNum(ing.protein)*safeNum(ing.servings))}g</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                      <button onClick={()=>updServ(ing.id,String(Math.max(0.25,safeNum(ing.servings)-0.25)))} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.text,minWidth:25,textAlign:"center"}}>{ing.servings}x</span>
                      <button onClick={()=>updServ(ing.id,String(safeNum(ing.servings)+0.25))} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      <button className="ing-del" onClick={()=>removeIng(ing.id)} style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,color:T.textFaint,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10,padding:"10px 12px",background:prevCal>goals.calories?"#1a0505":"#061a0f",border:`1px solid ${prevCal>goals.calories?"#7f1d1d":"#14532d"}`,borderRadius:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                  <span style={{fontSize:10,color:prevCal>goals.calories?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace"}}>MEAL TOTAL</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:prevCal>goals.calories?"#f87171":"#4ade80"}}>{ingTotals.calories} kcal</span>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[["P",ingTotals.protein,"g","#34d399"],["C",ingTotals.carbs,"g","#60a5fa"],["F",ingTotals.fat,"g","#fbbf24"],["Fi",ingTotals.fiber,"g","#a78bfa"],["Na",ingTotals.sodium,"mg","#fb923c"]].map(([l,v,u,c])=>(
                    <span key={l} style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:c}}>{l} {v}{u}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Photo */}
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>📸 PHOTO SCAN — needs API credits</div>
          {!photoSrc?(
            <div onClick={()=>{if(fileRef.current)fileRef.current.click();}} style={{border:"2px dashed "+T.border,borderRadius:9,padding:"12px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:20,marginBottom:3}}>📷</div>
              <div style={{color:"#60a5fa",fontWeight:600,fontSize:12}}>Take or choose a photo</div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])photoFile(e.target.files[0]);e.target.value="";}}/>
            </div>
          ):(
            <div>
              <div style={{position:"relative",borderRadius:9,overflow:"hidden",marginBottom:8}}>
                <img src={photoSrc} alt="food" style={{width:"100%",maxHeight:140,objectFit:"cover",display:"block"}}/>
                <button onClick={clearPhoto} style={{position:"absolute",top:6,right:6,background:"rgba(3,7,18,.85)",border:"1px solid #334155",color:"#94a3b8",borderRadius:5,padding:"3px 8px",fontSize:11,cursor:"pointer"}}>✕</button>
              </div>
              <button onClick={scan} disabled={scanning} style={{width:"100%",padding:"10px 0",background:"#1d4ed8",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:scanning?0.5:1}}>
                {scanning?"🔍 ANALYZING…":"🔍 SCAN & ADD"}
              </button>
              {scanErr&&<div style={{marginTop:6,padding:"7px 10px",background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:7,fontSize:11,color:"#fca5a5",fontFamily:"'DM Mono',monospace"}}>⚠ {scanErr}</div>}
            </div>
          )}
        </div>

        {mealErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>⚠ {mealErr}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={saveTmpl} disabled={!mealName.trim()||!ingredients.length}
            style={{flex:1,padding:"13px 0",background:"#0c4a6e",border:"1px solid #0369a1",borderRadius:11,color:"#7dd3fc",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ingredients.length)?0.4:1}}>
            ⭐ SAVE
          </button>
          <button onClick={logMeal} disabled={!mealName.trim()||!ingredients.length}
            style={{flex:2,padding:"13px 0",background:"#34d399",border:"none",borderRadius:11,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ingredients.length)?0.4:1}}>
            + LOG {ingredients.length>0&&`· ${ingTotals.calories} kcal`}
          </button>
        </div>
        <button onClick={()=>setShowSaved(true)} style={{padding:"11px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:11,color:T.textSub,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
          ⭐ SAVED MEALS {savedTemplates.length>0&&`(${savedTemplates.length})`}
        </button>
      </div>
    )}

    {/* PET TAB */}
    {tab==="pet"&&(
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
        {!petId?(
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:60,marginBottom:16}}>🥚</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:8}}>Choose Your Pet!</div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:20}}>Your companion will grow and level up as you hit nutrition goals and maintain streaks.</div>
            <button onClick={()=>setShowPetSelect(true)} style={{padding:"14px 32px",background:"#34d399",border:"none",borderRadius:12,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🐾 CHOOSE YOUR PET</button>
          </div>
        ):(
          <>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
              <div className="pet-float" style={{fontSize:80,lineHeight:1,marginBottom:8}}>{petInfo?.emoji}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:petInfo?.color,marginBottom:4}}>{petName||petInfo?.name}</div>
              <div style={{fontSize:12,color:T.textSub,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{petInfo?.type}</div>
              <div style={{fontSize:14,color:T.textSub,marginBottom:20}}>{petInfo?.desc}</div>

              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"16px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text}}>Level {petLevel.level} — {petLevel.name} {petLevel.emoji_modifier}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:T.textSub}}>{petXP} XP total</span>
                </div>
                <div style={{height:8,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:6}}>
                  <div style={{width:`${petLevel.progress}%`,height:"100%",background:petInfo?.color,borderRadius:99,transition:"width 1s ease"}}/>
                </div>
                <div style={{fontSize:11,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>
                  {petLevel.nextLevel?`${petLevel.xp - petLevel.xpRequired} / ${petLevel.nextLevel.xpRequired - petLevel.xpRequired} XP to Level ${petLevel.level+1}`:
                  "👑 MAX LEVEL ACHIEVED!"}
                </div>
              </div>

              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginBottom:8}}>RENAME YOUR PET</div>
                <div style={{display:"flex",gap:8}}>
                  <input type="text" value={petName} onChange={e=>setPetName(e.target.value)} placeholder={petInfo?.name}
                    style={{flex:1,background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"8px 12px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
                  />
                  <button onClick={()=>setShowPetSelect(true)} style={{padding:"8px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>CHANGE PET</button>
                </div>
              </div>
            </div>

            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>HOW TO EARN XP</div>
              {[
                {icon:"🍽️",label:"Log a meal",xp:"+10 XP"},
                {icon:"🍽️🍽️🍽️",label:"Log 3+ meals in a day",xp:"+10 XP"},
                {icon:"🔥",label:"Hit calorie goal (±15%)",xp:"+15 XP"},
                {icon:"💪",label:"Hit protein goal (90%+)",xp:"+20 XP"},
                {icon:"⚡",label:"Daily streak (×3 per day)",xp:"up to +30 XP"},
                {icon:"🏆",label:"High quality meal (80+ score)",xp:"+15 XP"},
                {icon:"👍",label:"Good meal (65-79 score)",xp:"+8 XP"},
                {icon:"🤖",label:"Ask the AI Coach",xp:"+5 XP"},
                {icon:"🌅",label:"Complete a full day",xp:"bonus XP"},
              ].map(({icon,label,xp})=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+T.border}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <span style={{fontSize:13,color:T.textSub}}>{label}</span>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#fbbf24",fontWeight:700}}>{xp}</span>
                </div>
              ))}
            </div>

            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>PET MILESTONES</div>
              {PET_LEVELS.map(lvl=>(
                <div key={lvl.level} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid "+T.border,opacity:petLevel.level>=lvl.level?1:0.4}}>
                  <div style={{width:28,height:28,borderRadius:99,background:petLevel.level>=lvl.level?petInfo?.color:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:700,color:"#030712",fontFamily:"'DM Mono',monospace"}}>
                    {petLevel.level>=lvl.level?"✓":lvl.level}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:petLevel.level>=lvl.level?T.text:T.textFaint}}>Lv{lvl.level} — {lvl.name} {lvl.emoji_modifier}</div>
                    <div style={{fontSize:11,color:T.textFaint,fontFamily:"'DM Mono',monospace"}}>{lvl.xpRequired} XP required</div>
                  </div>
                  {petLevel.level===lvl.level&&<span style={{fontSize:11,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:700}}>CURRENT</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    )}

    {/* COACH TAB */}
    {tab==="coach"&&(
      <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{fontSize:28}}>🤖</div>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:"#34d399"}}>AI NUTRITION COACH</div>
              <div style={{fontSize:11,color:T.textSub}}>Powered by Claude · Needs API credits</div>
            </div>
          </div>
          <div style={{padding:"10px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,fontSize:12,color:T.textSub}}>
            Today: {Math.round(totals.calories)}/{goals.calories} kcal · {round1(totals.protein)}g protein · {meals.length} meal{meals.length!==1?"s":""} · 🔥{streak} day streak
          </div>
        </div>

        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px",minHeight:300,display:"flex",flexDirection:"column",gap:10}}>
          {!coachHistory.length?(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:40,marginBottom:12}}>💬</div>
              <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:8}}>Ask your coach anything!</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
                {["What should I eat for dinner?","How's my protein today?","Give me a high-protein snack idea","Am I on track to hit my goals?"].map(q=>(
                  <button key={q} onClick={()=>{setCoachMsg(q);}} style={{padding:"8px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer",textAlign:"left"}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {coachHistory.map((msg,i)=>(
                <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"85%",padding:"10px 14px",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:msg.role==="user"?"#34d399":T.card2,color:msg.role==="user"?"#030712":T.text,fontSize:13,lineHeight:1.5,border:msg.role==="assistant"?"1px solid "+T.border:"none"}}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {coachLoading&&(
                <div style={{display:"flex",justifyContent:"flex-start"}}>
                  <div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:T.card2,border:"1px solid "+T.border,color:T.textSub,fontSize:13}}>
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{display:"flex",gap:8}}>
          <input type="text" value={coachMsg} onChange={e=>setCoachMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!coachLoading&&askCoach()} placeholder="Ask anything about your nutrition..."
            style={{flex:1,background:T.card,border:"1px solid "+T.border,borderRadius:10,color:T.text,fontSize:13,padding:"12px 14px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
          />
          <button onClick={askCoach} disabled={coachLoading||!coachMsg.trim()} style={{padding:"12px 16px",background:"#34d399",border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(coachLoading||!coachMsg.trim())?0.5:1}}>
            {coachLoading?"...":"SEND"}
          </button>
        </div>
        {coachHistory.length>0&&(
          <button onClick={()=>setCoachHistory([])} style={{padding:"8px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.textFaint,fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
            CLEAR CHAT
          </button>
        )}
      </div>
    )}
  </div>

  {/* Bottom nav */}
  <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:"1px solid "+T.border,display:"flex",zIndex:60,maxWidth:520,margin:"0 auto"}}>
    {[
      {id:"home",icon:"🏠",label:"HOME"},
      {id:"log",icon:"📋",label:"LOG"},
      {id:"build",icon:"🍳",label:"BUILD"},
      {id:"pet",icon:petId?PETS.find(p=>p.id===petId)?.emoji||"🐾":"🐾",label:"PET"},
      {id:"coach",icon:"🤖",label:"COACH"},
    ].map(({id,icon,label})=>(
      <button key={id} style={navSt(tab===id)} onClick={()=>setTab(id)}>
        <span style={{fontSize:18}}>{icon}</span>
        <span>{label}</span>
        {id==="log"&&meals.length>0&&<span style={{position:"absolute",top:6,right:"18%",background:"#34d399",color:"#030712",borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 5px",fontFamily:"'DM Mono',monospace"}}>{meals.length}</span>}
      </button>
    ))}
  </div>
</div>
```

);
}
