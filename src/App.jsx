import { useState, useRef, useEffect } from "react";

const DEFAULT_GOALS = { calories:1550, protein:180, carbs:200, fat:70, fiber:38, sugar:50, sodium:2300 };

const PRESET_CATEGORIES = [
  { label:"🥚 Eggs & Dairy", foods:[
    { name:"Egg (whole, large)",           emoji:"🥚", calories:72,  protein:6,   carbs:0.4, fat:5,   fiber:0, sugar:0.4, sodium:71  },
    { name:"Egg White (large)",            emoji:"🥚", calories:17,  protein:3.6, carbs:0.2, fat:0.1, fiber:0, sugar:0.2, sodium:55  },
    { name:"Egg (2 whole)",                emoji:"🥚", calories:143, protein:12,  carbs:0.7, fat:10,  fiber:0, sugar:0.7, sodium:142 },
    { name:"Egg (3 whole)",                emoji:"🥚", calories:215, protein:18,  carbs:1.1, fat:15,  fiber:0, sugar:1.1, sodium:213 },
    { name:"Greek Yogurt nonfat (1 cup)",  emoji:"🫙", calories:100, protein:17,  carbs:6,   fat:0,   fiber:0, sugar:6,   sodium:65  },
    { name:"Greek Yogurt 2% (1 cup)",      emoji:"🫙", calories:150, protein:17,  carbs:8,   fat:4,   fiber:0, sugar:7,   sodium:65  },
    { name:"Cottage Cheese (1/2 cup)",     emoji:"🫙", calories:90,  protein:12,  carbs:5,   fat:2.5, fiber:0, sugar:4,   sodium:360 },
    { name:"Cottage Cheese (1 cup)",       emoji:"🫙", calories:180, protein:24,  carbs:10,  fat:5,   fiber:0, sugar:8,   sodium:720 },
    { name:"Milk whole (1 cup)",           emoji:"🥛", calories:149, protein:8,   carbs:12,  fat:8,   fiber:0, sugar:12,  sodium:105 },
    { name:"Milk 2% (1 cup)",              emoji:"🥛", calories:122, protein:8,   carbs:12,  fat:5,   fiber:0, sugar:12,  sodium:115 },
    { name:"Milk skim (1 cup)",            emoji:"🥛", calories:83,  protein:8,   carbs:12,  fat:0.2, fiber:0, sugar:12,  sodium:103 },
    { name:"Cheddar Cheese (1 oz)",        emoji:"🧀", calories:115, protein:7,   carbs:0.4, fat:9,   fiber:0, sugar:0.1, sodium:185 },
    { name:"Mozzarella (1 oz)",            emoji:"🧀", calories:85,  protein:6,   carbs:1,   fat:6,   fiber:0, sugar:0.3, sodium:175 },
    { name:"Cream Cheese (2 tbsp)",        emoji:"🧀", calories:99,  protein:1.8, carbs:1.6, fat:10,  fiber:0, sugar:1.3, sodium:90  },
    { name:"String Cheese (1 stick)",      emoji:"🧀", calories:80,  protein:7,   carbs:1,   fat:5,   fiber:0, sugar:0,   sodium:200 },
    { name:"Sour Cream (2 tbsp)",          emoji:"🥛", calories:60,  protein:0.9, carbs:1.2, fat:6,   fiber:0, sugar:1,   sodium:15  },
  ]},
  { label:"🍗 Chicken & Turkey", foods:[
    { name:"Chicken Breast (2 oz)",        emoji:"🍗", calories:92,  protein:17, carbs:0, fat:2,  fiber:0, sugar:0, sodium:37  },
    { name:"Chicken Breast (3 oz)",        emoji:"🍗", calories:139, protein:26, carbs:0, fat:3,  fiber:0, sugar:0, sodium:56  },
    { name:"Chicken Breast (4 oz)",        emoji:"🍗", calories:185, protein:35, carbs:0, fat:4,  fiber:0, sugar:0, sodium:75  },
    { name:"Chicken Breast (5 oz)",        emoji:"🍗", calories:231, protein:43, carbs:0, fat:5,  fiber:0, sugar:0, sodium:94  },
    { name:"Chicken Breast (6 oz)",        emoji:"🍗", calories:278, protein:52, carbs:0, fat:6,  fiber:0, sugar:0, sodium:112 },
    { name:"Chicken Breast (7 oz)",        emoji:"🍗", calories:324, protein:61, carbs:0, fat:7,  fiber:0, sugar:0, sodium:131 },
    { name:"Chicken Breast (8 oz)",        emoji:"🍗", calories:370, protein:69, carbs:0, fat:8,  fiber:0, sugar:0, sodium:150 },
    { name:"Chicken Breast (10 oz)",       emoji:"🍗", calories:463, protein:87, carbs:0, fat:10, fiber:0, sugar:0, sodium:188 },
    { name:"Chicken Thigh (4 oz)",         emoji:"🍗", calories:209, protein:28, carbs:0, fat:10, fiber:0, sugar:0, sodium:95  },
    { name:"Chicken Thigh (6 oz)",         emoji:"🍗", calories:314, protein:42, carbs:0, fat:15, fiber:0, sugar:0, sodium:143 },
    { name:"Chicken Thigh (8 oz)",         emoji:"🍗", calories:418, protein:56, carbs:0, fat:20, fiber:0, sugar:0, sodium:190 },
    { name:"Chicken Drumstick (2)",        emoji:"🍗", calories:230, protein:29, carbs:0, fat:12, fiber:0, sugar:0, sodium:190 },
    { name:"Rotisserie Chicken (3.5 oz)",  emoji:"🍗", calories:190, protein:27, carbs:0, fat:9,  fiber:0, sugar:0, sodium:340 },
    { name:"Ground Turkey (4 oz)",         emoji:"🦃", calories:170, protein:22, carbs:0, fat:9,  fiber:0, sugar:0, sodium:75  },
    { name:"Ground Turkey (6 oz)",         emoji:"🦃", calories:255, protein:33, carbs:0, fat:13, fiber:0, sugar:0, sodium:113 },
    { name:"Ground Turkey (8 oz)",         emoji:"🦃", calories:340, protein:44, carbs:0, fat:18, fiber:0, sugar:0, sodium:150 },
    { name:"Turkey Breast deli (3 oz)",    emoji:"🦃", calories:90,  protein:18, carbs:1, fat:1,  fiber:0, sugar:0, sodium:570 },
  ]},
  { label:"🥩 Beef & Pork", foods:[
    { name:"Ground Beef 90% (4 oz)", emoji:"🥩", calories:196, protein:24, carbs:0, fat:11, fiber:0, sugar:0, sodium:75  },
    { name:"Ground Beef 90% (6 oz)", emoji:"🥩", calories:294, protein:36, carbs:0, fat:16, fiber:0, sugar:0, sodium:113 },
    { name:"Ground Beef 90% (8 oz)", emoji:"🥩", calories:392, protein:48, carbs:0, fat:22, fiber:0, sugar:0, sodium:150 },
    { name:"Ground Beef 80% (4 oz)", emoji:"🥩", calories:287, protein:20, carbs:0, fat:23, fiber:0, sugar:0, sodium:75  },
    { name:"Sirloin Steak (4 oz)",   emoji:"🥩", calories:213, protein:31, carbs:0, fat:9,  fiber:0, sugar:0, sodium:60  },
    { name:"Sirloin Steak (6 oz)",   emoji:"🥩", calories:320, protein:46, carbs:0, fat:14, fiber:0, sugar:0, sodium:90  },
    { name:"Sirloin Steak (8 oz)",   emoji:"🥩", calories:426, protein:61, carbs:0, fat:18, fiber:0, sugar:0, sodium:120 },
    { name:"Ribeye (6 oz)",          emoji:"🥩", calories:430, protein:42, carbs:0, fat:28, fiber:0, sugar:0, sodium:100 },
    { name:"Bacon (2 strips)",       emoji:"🥓", calories:86,  protein:6,  carbs:0.1,fat:7, fiber:0, sugar:0, sodium:368 },
    { name:"Bacon (4 strips)",       emoji:"🥓", calories:172, protein:12, carbs:0.2,fat:14,fiber:0, sugar:0, sodium:736 },
    { name:"Ham deli (3 oz)",        emoji:"🥩", calories:90,  protein:14, carbs:2,  fat:3,  fiber:0, sugar:1, sodium:800 },
    { name:"Pork Tenderloin (4 oz)", emoji:"🥩", calories:140, protein:24, carbs:0,  fat:4,  fiber:0, sugar:0, sodium:60  },
    { name:"Pork Tenderloin (6 oz)", emoji:"🥩", calories:210, protein:36, carbs:0,  fat:6,  fiber:0, sugar:0, sodium:90  },
    { name:"Italian Sausage (1)",    emoji:"🌭", calories:230, protein:14, carbs:4,  fat:18, fiber:0, sugar:1, sodium:500 },
    { name:"Hot Dog (1)",            emoji:"🌭", calories:180, protein:7,  carbs:2,  fat:16, fiber:0, sugar:1, sodium:550 },
    { name:"Pepperoni (1 oz)",       emoji:"🍕", calories:141, protein:6,  carbs:0,  fat:13, fiber:0, sugar:0, sodium:513 },
  ]},
  { label:"🐟 Fish & Seafood", foods:[
    { name:"Salmon (4 oz)",    emoji:"🐟", calories:234, protein:31, carbs:0, fat:12,  fiber:0, sugar:0, sodium:64  },
    { name:"Salmon (6 oz)",    emoji:"🐟", calories:351, protein:47, carbs:0, fat:18,  fiber:0, sugar:0, sodium:96  },
    { name:"Salmon (8 oz)",    emoji:"🐟", calories:468, protein:62, carbs:0, fat:24,  fiber:0, sugar:0, sodium:128 },
    { name:"Tuna can (water)", emoji:"🐟", calories:109, protein:25, carbs:0, fat:1,   fiber:0, sugar:0, sodium:303 },
    { name:"Tuna can (oil)",   emoji:"🐟", calories:191, protein:26, carbs:0, fat:9,   fiber:0, sugar:0, sodium:300 },
    { name:"Shrimp (4 oz)",    emoji:"🦐", calories:112, protein:24, carbs:0, fat:1.5, fiber:0, sugar:0, sodium:190 },
    { name:"Shrimp (6 oz)",    emoji:"🦐", calories:168, protein:36, carbs:0, fat:2,   fiber:0, sugar:0, sodium:285 },
    { name:"Tilapia (4 oz)",   emoji:"🐟", calories:145, protein:30, carbs:0, fat:2.5, fiber:0, sugar:0, sodium:75  },
    { name:"Tilapia (6 oz)",   emoji:"🐟", calories:218, protein:45, carbs:0, fat:3.5, fiber:0, sugar:0, sodium:113 },
    { name:"Cod (4 oz)",       emoji:"🐟", calories:96,  protein:21, carbs:0, fat:0.8, fiber:0, sugar:0, sodium:62  },
    { name:"Sardines (1 can)", emoji:"🐟", calories:191, protein:23, carbs:0, fat:11,  fiber:0, sugar:0, sodium:465 },
    { name:"Scallops (4 oz)",  emoji:"🦪", calories:100, protein:19, carbs:3, fat:0.8, fiber:0, sugar:0, sodium:310 },
    { name:"Shrimp (8 oz)",    emoji:"🦐", calories:224, protein:48, carbs:0, fat:2.5, fiber:0, sugar:0, sodium:380 },
  ]},
  { label:"🍚 Grains & Carbs", foods:[
    { name:"White Rice (1/2 cup)",       emoji:"🍚", calories:103, protein:2,  carbs:22, fat:0.2, fiber:0.3, sugar:0,   sodium:1   },
    { name:"White Rice (1 cup)",         emoji:"🍚", calories:206, protein:4,  carbs:45, fat:0.4, fiber:0.6, sugar:0,   sodium:2   },
    { name:"White Rice (1.5 cups)",      emoji:"🍚", calories:309, protein:6,  carbs:67, fat:0.6, fiber:0.9, sugar:0,   sodium:3   },
    { name:"Brown Rice (1 cup)",         emoji:"🍚", calories:216, protein:5,  carbs:45, fat:1.8, fiber:3.5, sugar:0,   sodium:10  },
    { name:"Quinoa (1 cup)",             emoji:"🌾", calories:222, protein:8,  carbs:39, fat:4,   fiber:5,   sugar:1.6, sodium:13  },
    { name:"Oatmeal dry (1/2 cup)",      emoji:"🥣", calories:150, protein:5,  carbs:27, fat:3,   fiber:4,   sugar:0,   sodium:0   },
    { name:"Oatmeal cooked (1 cup)",     emoji:"🥣", calories:158, protein:6,  carbs:27, fat:3,   fiber:4,   sugar:0,   sodium:115 },
    { name:"Sweet Potato small",         emoji:"🍠", calories:60,  protein:1,  carbs:14, fat:0,   fiber:2,   sugar:4,   sodium:24  },
    { name:"Sweet Potato medium",        emoji:"🍠", calories:103, protein:2,  carbs:24, fat:0.1, fiber:3.8, sugar:7,   sodium:41  },
    { name:"Sweet Potato large",         emoji:"🍠", calories:162, protein:3,  carbs:37, fat:0.2, fiber:5.9, sugar:12,  sodium:65  },
    { name:"White Potato medium",        emoji:"🥔", calories:163, protein:4,  carbs:37, fat:0.2, fiber:3.8, sugar:1.7, sodium:13  },
    { name:"Bread WW (1 slice)",         emoji:"🍞", calories:81,  protein:4,  carbs:14, fat:1,   fiber:1.9, sugar:1.4, sodium:147 },
    { name:"Bread white (1 slice)",      emoji:"🍞", calories:67,  protein:2,  carbs:13, fat:0.8, fiber:0.6, sugar:1.4, sodium:119 },
    { name:"Bagel plain",                emoji:"🥯", calories:270, protein:11, carbs:53, fat:1.5, fiber:2,   sugar:6,   sodium:430 },
    { name:"English Muffin",             emoji:"🥯", calories:134, protein:5,  carbs:26, fat:1,   fiber:2,   sugar:3,   sodium:265 },
    { name:"Pasta (1 cup cooked)",       emoji:"🍝", calories:220, protein:8,  carbs:43, fat:1.3, fiber:2.5, sugar:0.6, sodium:1   },
    { name:"Pasta (2 cups cooked)",      emoji:"🍝", calories:440, protein:16, carbs:86, fat:2.6, fiber:5,   sugar:1.2, sodium:2   },
    { name:"Tortilla large flour",       emoji:"🫓", calories:218, protein:6,  carbs:36, fat:5,   fiber:2,   sugar:1,   sodium:440 },
    { name:"Carb Balance Tortilla",      emoji:"🫓", calories:110, protein:5,  carbs:22, fat:3,   fiber:11,  sugar:0,   sodium:380 },
    { name:"Corn Tortilla (2)",          emoji:"🫓", calories:100, protein:3,  carbs:22, fat:1.5, fiber:3,   sugar:0.5, sodium:40  },
    { name:"Rice Cakes (2)",             emoji:"🍘", calories:70,  protein:1,  carbs:15, fat:0.5, fiber:0.3, sugar:0,   sodium:58  },
  ]},
  { label:"🥗 Vegetables", foods:[
    { name:"Broccoli (1 cup)",      emoji:"🥦", calories:55,  protein:4,   carbs:11, fat:0.6, fiber:5,   sugar:2,   sodium:64 },
    { name:"Broccoli (2 cups)",     emoji:"🥦", calories:110, protein:8,   carbs:22, fat:1.2, fiber:10,  sugar:4,   sodium:128},
    { name:"Spinach (2 cups raw)",  emoji:"🥬", calories:14,  protein:1.7, carbs:2,  fat:0.2, fiber:1.3, sugar:0.2, sodium:48 },
    { name:"Kale (2 cups raw)",     emoji:"🥬", calories:67,  protein:4.4, carbs:12, fat:0.9, fiber:2.6, sugar:0,   sodium:58 },
    { name:"Mixed Greens (2 cups)", emoji:"🥗", calories:18,  protein:1.5, carbs:3,  fat:0.2, fiber:1.5, sugar:1,   sodium:35 },
    { name:"Romaine (2 cups)",      emoji:"🥬", calories:16,  protein:1.2, carbs:3,  fat:0.3, fiber:2,   sugar:1.5, sodium:9  },
    { name:"Avocado (1/4)",         emoji:"🥑", calories:60,  protein:0.8, carbs:3,  fat:5.5, fiber:2.5, sugar:0.2, sodium:3  },
    { name:"Avocado (1/2)",         emoji:"🥑", calories:120, protein:1.5, carbs:6,  fat:11,  fiber:5,   sugar:0.5, sodium:5  },
    { name:"Avocado (whole)",       emoji:"🥑", calories:240, protein:3,   carbs:12, fat:22,  fiber:10,  sugar:1,   sodium:10 },
    { name:"Bell Pepper (1 med)",   emoji:"🫑", calories:31,  protein:1,   carbs:7,  fat:0.3, fiber:2.5, sugar:3.7, sodium:4  },
    { name:"Asparagus (6 spears)",  emoji:"🌿", calories:20,  protein:2,   carbs:3,  fat:0.2, fiber:2,   sugar:1,   sodium:13 },
    { name:"Green Beans (1 cup)",   emoji:"🫛", calories:44,  protein:2,   carbs:10, fat:0.4, fiber:4,   sugar:5,   sodium:1  },
    { name:"Cucumber (1 cup)",      emoji:"🥒", calories:16,  protein:0.7, carbs:3.8,fat:0.1, fiber:0.5, sugar:2,   sodium:2  },
    { name:"Tomato (1 med)",        emoji:"🍅", calories:22,  protein:1.1, carbs:4.8,fat:0.2, fiber:1.5, sugar:3.2, sodium:6  },
    { name:"Mushrooms (1 cup)",     emoji:"🍄", calories:21,  protein:3,   carbs:3,  fat:0.3, fiber:1,   sugar:2,   sodium:4  },
    { name:"Carrots (1 cup)",       emoji:"🥕", calories:52,  protein:1.2, carbs:12, fat:0.3, fiber:3.6, sugar:6,   sodium:88 },
    { name:"Corn (1 ear)",          emoji:"🌽", calories:132, protein:4.9, carbs:29, fat:1.8, fiber:3.6, sugar:9,   sodium:21 },
    { name:"Edamame (1/2 cup)",     emoji:"🫘", calories:94,  protein:9,   carbs:8,  fat:4,   fiber:4,   sugar:2,   sodium:9  },
  ]},
  { label:"🍎 Fruits", foods:[
    { name:"Banana medium",        emoji:"🍌", calories:105, protein:1.3, carbs:27, fat:0.4, fiber:3.1, sugar:14, sodium:1  },
    { name:"Apple medium",         emoji:"🍎", calories:95,  protein:0.5, carbs:25, fat:0.3, fiber:4.4, sugar:19, sodium:2  },
    { name:"Strawberries (1 cup)", emoji:"🍓", calories:49,  protein:1,   carbs:12, fat:0.5, fiber:3,   sugar:7,  sodium:2  },
    { name:"Blueberries (1 cup)",  emoji:"🫐", calories:84,  protein:1.1, carbs:21, fat:0.5, fiber:3.6, sugar:15, sodium:1  },
    { name:"Orange medium",        emoji:"🍊", calories:62,  protein:1.2, carbs:15, fat:0.2, fiber:3.1, sugar:12, sodium:0  },
    { name:"Mango (1 cup)",        emoji:"🥭", calories:99,  protein:1.4, carbs:25, fat:0.6, fiber:2.6, sugar:23, sodium:2  },
    { name:"Pineapple (1 cup)",    emoji:"🍍", calories:82,  protein:0.9, carbs:22, fat:0.2, fiber:2.3, sugar:16, sodium:2  },
    { name:"Grapes (1 cup)",       emoji:"🍇", calories:104, protein:1.1, carbs:27, fat:0.2, fiber:1.4, sugar:23, sodium:3  },
    { name:"Watermelon (2 cups)",  emoji:"🍉", calories:86,  protein:1.7, carbs:22, fat:0.4, fiber:1.1, sugar:18, sodium:4  },
    { name:"Raspberries (1 cup)",  emoji:"🫐", calories:64,  protein:1.5, carbs:15, fat:0.8, fiber:8,   sugar:5,  sodium:1  },
    { name:"Peach medium",         emoji:"🍑", calories:59,  protein:1.4, carbs:14, fat:0.4, fiber:2.3, sugar:13, sodium:0  },
    { name:"Kiwi medium",          emoji:"🥝", calories:42,  protein:0.8, carbs:10, fat:0.4, fiber:2.1, sugar:6,  sodium:2  },
    { name:"Cherries (1 cup)",     emoji:"🍒", calories:87,  protein:1.5, carbs:22, fat:0.3, fiber:3,   sugar:18, sodium:0  },
  ]},
  { label:"🥜 Nuts & Seeds", foods:[
    { name:"Almonds (1 oz)",        emoji:"🌰", calories:164, protein:6,   carbs:6,  fat:14,  fiber:3.5, sugar:1.2, sodium:0   },
    { name:"Walnuts (1 oz)",        emoji:"🌰", calories:185, protein:4.3, carbs:4,  fat:18,  fiber:1.9, sugar:0.7, sodium:1   },
    { name:"Cashews (1 oz)",        emoji:"🌰", calories:157, protein:5,   carbs:9,  fat:12,  fiber:0.9, sugar:1.7, sodium:3   },
    { name:"Peanuts (1 oz)",        emoji:"🥜", calories:161, protein:7,   carbs:5,  fat:14,  fiber:2.4, sugar:1.3, sodium:114 },
    { name:"Peanut Butter (1 tbsp)",emoji:"🥜", calories:94,  protein:4,   carbs:3,  fat:8,   fiber:1,   sugar:1.5, sodium:76  },
    { name:"Peanut Butter (2 tbsp)",emoji:"🥜", calories:188, protein:8,   carbs:6,  fat:16,  fiber:2,   sugar:3,   sodium:152 },
    { name:"Almond Butter (2 tbsp)",emoji:"🌰", calories:196, protein:7,   carbs:6,  fat:18,  fiber:3.3, sugar:1.7, sodium:72  },
    { name:"Sunflower Seeds (1 oz)",emoji:"🌻", calories:165, protein:5.5, carbs:7,  fat:14,  fiber:3,   sugar:1,   sodium:1   },
    { name:"Chia Seeds (2 tbsp)",   emoji:"🌱", calories:138, protein:4.7, carbs:12, fat:8.7, fiber:9.8, sugar:0,   sodium:5   },
    { name:"Pistachios (1 oz)",     emoji:"🌰", calories:159, protein:6,   carbs:8,  fat:13,  fiber:3,   sugar:2,   sodium:0   },
    { name:"Mixed Nuts (1 oz)",     emoji:"🌰", calories:173, protein:5,   carbs:6,  fat:16,  fiber:2,   sugar:1.3, sodium:110 },
  ]},
  { label:"💪 Protein Bars & Shakes", foods:[
    { name:"Quest Bar avg",              emoji:"💪", calories:200, protein:21, carbs:22, fat:8,   fiber:14, sugar:1,   sodium:250 },
    { name:"RXBar avg",                  emoji:"💪", calories:210, protein:12, carbs:24, fat:9,   fiber:5,  sugar:13,  sodium:260 },
    { name:"Clif Bar",                   emoji:"💪", calories:250, protein:9,  carbs:45, fat:5,   fiber:5,  sugar:21,  sodium:150 },
    { name:"Kind Bar avg",               emoji:"💪", calories:200, protein:6,  carbs:20, fat:12,  fiber:3,  sugar:8,   sodium:95  },
    { name:"ONE Bar avg",                emoji:"💪", calories:220, protein:20, carbs:23, fat:7,   fiber:10, sugar:1,   sodium:220 },
    { name:"Barebells Protein Bar",      emoji:"💪", calories:200, protein:20, carbs:20, fat:7,   fiber:6,  sugar:2,   sodium:150 },
    { name:"Premier Protein Shake",      emoji:"🥤", calories:160, protein:30, carbs:6,  fat:3,   fiber:1,  sugar:1,   sodium:390 },
    { name:"Fairlife Core Power",        emoji:"🥤", calories:230, protein:42, carbs:13, fat:3.5, fiber:0,  sugar:11,  sodium:280 },
    { name:"Muscle Milk (11 oz)",        emoji:"🥤", calories:160, protein:25, carbs:9,  fat:3,   fiber:2,  sugar:2,   sodium:250 },
    { name:"Protein Shake 1 scoop avg",  emoji:"🥤", calories:120, protein:25, carbs:5,  fat:2,   fiber:1,  sugar:2,   sodium:150 },
    { name:"Isopure Zero Carb (1 scoop)",emoji:"🥤", calories:110, protein:25, carbs:0,  fat:0.5, fiber:0,  sugar:0,   sodium:140 },
    { name:"ON Gold Standard (1 scoop)", emoji:"🥤", calories:120, protein:24, carbs:3,  fat:1,   fiber:1,  sugar:1,   sodium:130 },
  ]},
  { label:"🥣 Breakfast Foods", foods:[
    { name:"Pancakes (3 med)",        emoji:"🥞", calories:345, protein:9,  carbs:57, fat:10,  fiber:1.5, sugar:8,  sodium:730 },
    { name:"Waffle (1 large)",        emoji:"🧇", calories:220, protein:6,  carbs:25, fat:11,  fiber:1,   sugar:4,  sodium:380 },
    { name:"French Toast (2 slices)", emoji:"🍞", calories:308, protein:10, carbs:34, fat:15,  fiber:1.5, sugar:8,  sodium:370 },
    { name:"Cheerios (1 cup)",        emoji:"🥣", calories:100, protein:3,  carbs:20, fat:2,   fiber:3,   sugar:1,  sodium:140 },
    { name:"Granola (1/2 cup)",       emoji:"🥣", calories:209, protein:5,  carbs:36, fat:6,   fiber:3,   sugar:12, sodium:14  },
    { name:"Frosted Flakes (1 cup)",  emoji:"🥣", calories:130, protein:2,  carbs:31, fat:0,   fiber:0.5, sugar:11, sodium:190 },
    { name:"Raisin Bran (1 cup)",     emoji:"🥣", calories:190, protein:5,  carbs:46, fat:1.5, fiber:7,   sugar:18, sodium:350 },
    { name:"Pop-Tart (1)",            emoji:"🍰", calories:200, protein:2,  carbs:37, fat:5,   fiber:0.5, sugar:16, sodium:170 },
    { name:"Bagel + Cream Cheese",    emoji:"🥯", calories:369, protein:13, carbs:54, fat:12,  fiber:2,   sugar:7,  sodium:520 },
  ]},
  { label:"🍔 Fast Food", foods:[
    { name:"McDouble",                  emoji:"🍔", calories:400, protein:22, carbs:33, fat:20, fiber:2,  sugar:7,  sodium:840  },
    { name:"Big Mac",                   emoji:"🍔", calories:550, protein:25, carbs:46, fat:30, fiber:3,  sugar:9,  sodium:1010 },
    { name:"McChicken",                 emoji:"🍔", calories:400, protein:14, carbs:40, fat:21, fiber:1,  sugar:5,  sodium:660  },
    { name:"McD Fries Medium",          emoji:"🍟", calories:320, protein:4,  carbs:44, fat:15, fiber:3,  sugar:0,  sodium:400  },
    { name:"McD Fries Large",           emoji:"🍟", calories:490, protein:7,  carbs:66, fat:23, fiber:5,  sugar:0,  sodium:400  },
    { name:"Chick-fil-A Sandwich",      emoji:"🍔", calories:440, protein:28, carbs:40, fat:19, fiber:1,  sugar:5,  sodium:1350 },
    { name:"Chick-fil-A Grilled Sand.", emoji:"🍔", calories:320, protein:29, carbs:36, fat:6,  fiber:3,  sugar:7,  sodium:800  },
    { name:"Chick-fil-A Nuggets 8pc",   emoji:"🍗", calories:260, protein:26, carbs:11, fat:12, fiber:0,  sugar:1,  sodium:1010 },
    { name:"Chipotle Chicken Bowl",     emoji:"🥙", calories:655, protein:51, carbs:62, fat:21, fiber:11, sugar:5,  sodium:1810 },
    { name:"Subway 6in Turkey",         emoji:"🥖", calories:280, protein:18, carbs:46, fat:3.5,fiber:4,  sugar:7,  sodium:760  },
    { name:"Taco Bell Crunchy Taco",    emoji:"🌮", calories:170, protein:8,  carbs:13, fat:9,  fiber:3,  sugar:1,  sodium:310  },
    { name:"Raising Cane Chicken Fngr", emoji:"🍗", calories:145, protein:13, carbs:8,  fat:6,  fiber:0,  sugar:0,  sodium:360  },
    { name:"Raising Cane Sauce",        emoji:"🫙", calories:190, protein:0,  carbs:4,  fat:20, fiber:0,  sugar:3,  sodium:280  },
    { name:"Panda Orange Chicken",      emoji:"🍊", calories:490, protein:26, carbs:67, fat:14, fiber:2,  sugar:35, sodium:820  },
  ]},
  { label:"🍕 Pizza & Sandwiches", foods:[
    { name:"Pizza Cheese (1 slice)",    emoji:"🍕", calories:285, protein:12, carbs:36, fat:10, fiber:2, sugar:3, sodium:640  },
    { name:"Pizza Pepperoni (1 slice)", emoji:"🍕", calories:313, protein:14, carbs:34, fat:13, fiber:2, sugar:3, sodium:760  },
    { name:"Grilled Cheese",            emoji:"🥪", calories:390, protein:15, carbs:32, fat:23, fiber:1, sugar:4, sodium:800  },
    { name:"Turkey Sandwich",           emoji:"🥪", calories:320, protein:22, carbs:34, fat:8,  fiber:3, sugar:5, sodium:980  },
    { name:"Chicken Caesar Wrap",       emoji:"🌯", calories:450, protein:32, carbs:38, fat:18, fiber:3, sugar:3, sodium:920  },
    { name:"Burrito Bowl homemade",     emoji:"🥙", calories:520, protein:38, carbs:55, fat:16, fiber:9, sugar:4, sodium:880  },
  ]},
  { label:"🍿 Snacks", foods:[
    { name:"Popcorn air-popped (3 cups)",emoji:"🍿", calories:93,  protein:3,   carbs:19, fat:1,   fiber:3.6, sugar:0.2, sodium:2   },
    { name:"Chips potato (1 oz)",        emoji:"🥔", calories:152, protein:2,   carbs:15, fat:10,  fiber:1,   sugar:0.1, sodium:148 },
    { name:"Doritos (1 oz)",             emoji:"🌽", calories:140, protein:2,   carbs:18, fat:7,   fiber:1,   sugar:1,   sodium:210 },
    { name:"Pretzels (1 oz)",            emoji:"🥨", calories:108, protein:2.6, carbs:23, fat:0.7, fiber:0.8, sugar:0.8, sodium:385 },
    { name:"Goldfish (55 crackers)",     emoji:"🐟", calories:140, protein:3,   carbs:20, fat:5,   fiber:1,   sugar:0,   sodium:250 },
    { name:"Granola Bar avg",            emoji:"🍫", calories:193, protein:4,   carbs:28, fat:7,   fiber:2,   sugar:13,  sodium:100 },
    { name:"Trail Mix (1/4 cup)",        emoji:"🌰", calories:173, protein:5,   carbs:17, fat:11,  fiber:2,   sugar:8,   sodium:72  },
    { name:"Beef Jerky (1 oz)",          emoji:"🥩", calories:116, protein:9.4, carbs:3.1,fat:7.3, fiber:0.5, sugar:2.6, sodium:506 },
    { name:"Cheese Stick (1)",           emoji:"🧀", calories:80,  protein:7,   carbs:1,  fat:5,   fiber:0,   sugar:0,   sodium:200 },
    { name:"Hummus (2 tbsp)",            emoji:"🫘", calories:50,  protein:2,   carbs:6,  fat:3,   fiber:1.6, sugar:0.3, sodium:115 },
    { name:"Apple + PB",                 emoji:"🍎", calories:283, protein:8.5, carbs:31, fat:16.3,fiber:6.4, sugar:22,  sodium:154 },
    { name:"Rice Cakes (2)",             emoji:"🍘", calories:70,  protein:1,   carbs:15, fat:0.5, fiber:0.3, sugar:0,   sodium:58  },
  ]},
  { label:"🍰 Sweets & Treats", foods:[
    { name:"Dark Chocolate (1 oz)",  emoji:"🍫", calories:170, protein:2,   carbs:13, fat:12, fiber:3,  sugar:7,  sodium:5   },
    { name:"Milk Chocolate (1 oz)",  emoji:"🍫", calories:153, protein:2.2, carbs:17, fat:9,  fiber:1,  sugar:14, sodium:24  },
    { name:"Ice Cream (1/2 cup)",    emoji:"🍦", calories:207, protein:3.5, carbs:24, fat:11, fiber:0.7,sugar:21, sodium:80  },
    { name:"Cookie choc chip (1)",   emoji:"🍪", calories:148, protein:2,   carbs:19, fat:7,  fiber:1,  sugar:10, sodium:109 },
    { name:"Brownie (2 inch sq)",    emoji:"🍫", calories:112, protein:1.6, carbs:18, fat:4.5,fiber:0.6,sugar:11, sodium:82  },
    { name:"Donut glazed",           emoji:"🍩", calories:269, protein:3,   carbs:31, fat:15, fiber:1,  sugar:14, sodium:319 },
    { name:"Cheesecake (1 slice)",   emoji:"🍰", calories:401, protein:7,   carbs:35, fat:26, fiber:0.5,sugar:26, sodium:325 },
    { name:"Gummy Bears (10 pcs)",   emoji:"🍬", calories:87,  protein:2,   carbs:21, fat:0,  fiber:0,  sugar:15, sodium:15  },
  ]},
  { label:"🥤 Drinks", foods:[
    { name:"OJ (8 oz)",                emoji:"🍊", calories:112, protein:1.7, carbs:26, fat:0.5,fiber:0.5,sugar:21,sodium:2  },
    { name:"Coconut Water (1 cup)",    emoji:"🥥", calories:46,  protein:1.7, carbs:9,  fat:0.5,fiber:2.6,sugar:6, sodium:252 },
    { name:"Gatorade (20 oz)",         emoji:"🥤", calories:140, protein:0,   carbs:36, fat:0,  fiber:0, sugar:34, sodium:270 },
    { name:"Monster Energy (16 oz)",   emoji:"🥤", calories:210, protein:0,   carbs:54, fat:0,  fiber:0, sugar:54, sodium:370 },
    { name:"Red Bull (8.4 oz)",        emoji:"🥤", calories:110, protein:1,   carbs:28, fat:0,  fiber:0, sugar:27, sodium:105 },
    { name:"Coffee black (8 oz)",      emoji:"☕", calories:5,   protein:0.3, carbs:0.7,fat:0.1,fiber:0, sugar:0,  sodium:5  },
    { name:"Latte 16oz 2% milk",       emoji:"☕", calories:190, protein:13,  carbs:19, fat:7,  fiber:0, sugar:17, sodium:150 },
    { name:"Protein Smoothie (16 oz)", emoji:"🥤", calories:320, protein:30,  carbs:40, fat:5,  fiber:3, sugar:25, sodium:200 },
    { name:"Beer regular (12 oz)",     emoji:"🍺", calories:153, protein:1.6, carbs:13, fat:0,  fiber:0, sugar:0,  sodium:14  },
    { name:"Wine red (5 oz)",          emoji:"🍷", calories:125, protein:0.1, carbs:4,  fat:0,  fiber:0, sugar:1,  sodium:6  },
  ]},
  { label:"🫘 Legumes & Tofu", foods:[
    { name:"Black Beans (1/2 cup)",   emoji:"🫘", calories:114, protein:7.6, carbs:20, fat:0.5, fiber:7.5, sugar:0.3, sodium:1   },
    { name:"Black Beans (1 cup)",     emoji:"🫘", calories:228, protein:15,  carbs:40, fat:1,   fiber:15,  sugar:0.6, sodium:2   },
    { name:"Chickpeas (1/2 cup)",     emoji:"🫘", calories:134, protein:7,   carbs:22, fat:2.1, fiber:6,   sugar:3.9, sodium:5   },
    { name:"Lentils (1/2 cup)",       emoji:"🫘", calories:115, protein:9,   carbs:20, fat:0.4, fiber:7.8, sugar:1.8, sodium:2   },
    { name:"Kidney Beans (1/2 cup)",  emoji:"🫘", calories:112, protein:7.7, carbs:20, fat:0.4, fiber:5.5, sugar:0.3, sodium:1   },
    { name:"Tofu firm (4 oz)",        emoji:"🟦", calories:94,  protein:10,  carbs:2.3,fat:5,   fiber:0.3, sugar:0.5, sodium:94  },
    { name:"Tempeh (4 oz)",           emoji:"🟫", calories:222, protein:21,  carbs:11, fat:12,  fiber:7.3, sugar:0,   sodium:9   },
  ]},
  { label:"🫙 Sauces & Condiments", foods:[
    { name:"Olive Oil (1 tbsp)",     emoji:"🫒", calories:119, protein:0,   carbs:0,   fat:13.5, fiber:0, sugar:0,   sodium:0   },
    { name:"Olive Oil (2 tbsp)",     emoji:"🫒", calories:238, protein:0,   carbs:0,   fat:27,   fiber:0, sugar:0,   sodium:0   },
    { name:"Butter (1 tbsp)",        emoji:"🧈", calories:102, protein:0.1, carbs:0,   fat:11.5, fiber:0, sugar:0,   sodium:82  },
    { name:"Mayo (1 tbsp)",          emoji:"🥛", calories:94,  protein:0.1, carbs:0.1, fat:10,   fiber:0, sugar:0.1, sodium:88  },
    { name:"Ketchup (1 tbsp)",       emoji:"🍅", calories:17,  protein:0.2, carbs:4.6, fat:0,    fiber:0, sugar:3.7, sodium:154 },
    { name:"Mustard (1 tsp)",        emoji:"🟡", calories:3,   protein:0.2, carbs:0.3, fat:0.2,  fiber:0, sugar:0.1, sodium:56  },
    { name:"Hot Sauce (1 tsp)",      emoji:"🌶️", calories:0,   protein:0,   carbs:0.1, fat:0,    fiber:0, sugar:0,   sodium:124 },
    { name:"Soy Sauce (1 tbsp)",     emoji:"🫙", calories:11,  protein:1.3, carbs:1,   fat:0,    fiber:0, sugar:0,   sodium:879 },
    { name:"Sriracha (1 tsp)",       emoji:"🌶️", calories:5,   protein:0.1, carbs:1,   fat:0.1,  fiber:0, sugar:0.7, sodium:80  },
    { name:"BBQ Sauce (2 tbsp)",     emoji:"🫙", calories:58,  protein:0.5, carbs:14,  fat:0.1,  fiber:0, sugar:11,  sodium:340 },
    { name:"Ranch (2 tbsp)",         emoji:"🥛", calories:73,  protein:0.4, carbs:1.4, fat:7.7,  fiber:0, sugar:1,   sodium:122 },
    { name:"Honey (1 tbsp)",         emoji:"🍯", calories:64,  protein:0.1, carbs:17,  fat:0,    fiber:0, sugar:17,  sodium:0   },
    { name:"Maple Syrup (1 tbsp)",   emoji:"🍁", calories:52,  protein:0,   carbs:13,  fat:0,    fiber:0, sugar:12,  sodium:2   },
    { name:"Salsa (2 tbsp)",         emoji:"🍅", calories:10,  protein:0.5, carbs:2,   fat:0,    fiber:0.5,sugar:1,  sodium:230 },
    { name:"Guacamole (2 tbsp)",     emoji:"🥑", calories:45,  protein:0.5, carbs:2.5, fat:4,    fiber:1.5,sugar:0,  sodium:115 },
    { name:"Tahini (1 tbsp)",        emoji:"🫙", calories:89,  protein:2.6, carbs:3.2, fat:8,    fiber:1.4,sugar:0.1,sodium:17  },
    { name:"Teriyaki Sauce (1 tbsp)",emoji:"🫙", calories:16,  protein:0.5, carbs:3,   fat:0,    fiber:0, sugar:2.5, sodium:690 },
  ]},
];

const THEMES = [
  { id:"obsidian", label:"Obsidian", swatch:"#030712", bg:"#030712", card:"#0a0f1a", card2:"#0f172a", border:"#1e293b", text:"#f1f5f9", textSub:"#94a3b8", textFaint:"#475569" },
  { id:"midnight", label:"Midnight", swatch:"#0d0d20", bg:"#0d0d20", card:"#14142e", card2:"#1a1a3d", border:"#2d2d60", text:"#e8e8ff", textSub:"#9090c0", textFaint:"#4a4a80" },
  { id:"forest",   label:"Forest",   swatch:"#041a08", bg:"#041a08", card:"#081f0c", card2:"#0d2a12", border:"#1a4a22", text:"#e0f5e5", textSub:"#80b890", textFaint:"#3a6a45" },
  { id:"navy",     label:"Navy",     swatch:"#030a1a", bg:"#030a1a", card:"#071428", card2:"#0a1c38", border:"#1a3560", text:"#ddeeff", textSub:"#7aaad0", textFaint:"#2a5080" },
  { id:"espresso", label:"Espresso", swatch:"#1a0f05", bg:"#1a0f05", card:"#241508", card2:"#2e1c0c", border:"#5a3018", text:"#f5e8d8", textSub:"#c0956a", textFaint:"#7a5030" },
  { id:"crimson",  label:"Crimson",  swatch:"#1a0208", bg:"#1a0208", card:"#22040c", card2:"#2c0610", border:"#5a1022", text:"#ffe0e8", textSub:"#c07080", textFaint:"#7a2030" },
  { id:"storm",    label:"Storm",    swatch:"#081018", bg:"#081018", card:"#0f1a24", card2:"#16222e", border:"#2a4055", text:"#d8eaf8", textSub:"#7aaac8", textFaint:"#2a5070" },
  { id:"grape",    label:"Grape",    swatch:"#120820", bg:"#120820", card:"#1a0c2e", card2:"#22103c", border:"#3d1f6e", text:"#eeddff", textSub:"#a87ed0", textFaint:"#5a3080" },
  { id:"snow",     label:"Snow",     swatch:"#c8d4e8", bg:"#e8edf5", card:"#f8fafc", card2:"#dde3ef", border:"#b0bdd0", text:"#0f172a", textSub:"#3a4a60", textFaint:"#6b7a90" },
  { id:"cream",    label:"Cream",    swatch:"#c8a86a", bg:"#f0e6c8", card:"#faf0d8", card2:"#e4d0a0", border:"#c8a86a", text:"#2c1a06", textSub:"#6b4010", textFaint:"#9a6830" },
  { id:"blush",    label:"Blush",    swatch:"#f48fb1", bg:"#fce4ec", card:"#fbb6ca", card2:"#f48fb1", border:"#e06090", text:"#3b0018", textSub:"#880040", textFaint:"#c0406a" },
  { id:"sky",      label:"Sky",      swatch:"#93c5fd", bg:"#dbeafe", card:"#bfdbfe", card2:"#93c5fd", border:"#3b82f6", text:"#072060", textSub:"#1d4ed8", textFaint:"#3b82f6" },
  { id:"sage",     label:"Sage",     swatch:"#86efac", bg:"#dcfce7", card:"#bbf7d0", card2:"#86efac", border:"#22c55e", text:"#052e16", textSub:"#15803d", textFaint:"#16a34a" },
  { id:"lavender", label:"Lavender", swatch:"#c4b5fd", bg:"#ede9fe", card:"#ddd6fe", card2:"#c4b5fd", border:"#7c3aed", text:"#1e0050", textSub:"#5b21b6", textFaint:"#7c3aed" },
  { id:"peach",    label:"Peach",    swatch:"#fdba74", bg:"#fff7ed", card:"#fed7aa", card2:"#fdba74", border:"#ea580c", text:"#3a0e00", textSub:"#9a3412", textFaint:"#c2410c" },
  { id:"ocean",    label:"Ocean",    swatch:"#0077b6", bg:"#0077b6", card:"#0096c7", card2:"#00b4d8", border:"#48cae4", text:"#ffffff", textSub:"#caf0f8", textFaint:"#90e0ef" },
  { id:"emerald",  label:"Emerald",  swatch:"#065f46", bg:"#065f46", card:"#047857", card2:"#059669", border:"#34d399", text:"#ffffff", textSub:"#a7f3d0", textFaint:"#6ee7b7" },
  { id:"royal",    label:"Royal",    swatch:"#3730a3", bg:"#3730a3", card:"#4338ca", card2:"#4f46e5", border:"#818cf8", text:"#ffffff", textSub:"#c7d2fe", textFaint:"#a5b4fc" },
  { id:"rose",     label:"Rose",     swatch:"#9f1239", bg:"#9f1239", card:"#be123c", card2:"#e11d48", border:"#fb7185", text:"#ffffff", textSub:"#fecdd3", textFaint:"#fda4af" },
  { id:"amber",    label:"Amber",    swatch:"#92400e", bg:"#92400e", card:"#b45309", card2:"#d97706", border:"#fbbf24", text:"#ffffff", textSub:"#fde68a", textFaint:"#fcd34d" },
  { id:"slate",    label:"Slate",    swatch:"#334155", bg:"#334155", card:"#475569", card2:"#64748b", border:"#94a3b8", text:"#ffffff", textSub:"#e2e8f0", textFaint:"#cbd5e1" },
  { id:"teal",     label:"Teal",     swatch:"#134e4a", bg:"#134e4a", card:"#115e59", card2:"#0f766e", border:"#2dd4bf", text:"#ffffff", textSub:"#99f6e4", textFaint:"#5eead4" },
  { id:"sunset",   label:"Sunset",   swatch:"#c2410c", bg:"#c2410c", card:"#ea580c", card2:"#f97316", border:"#fdba74", text:"#ffffff", textSub:"#fed7aa", textFaint:"#fdba74" },
];

const MIME_MAP = {"image/jpeg":"image/jpeg","image/jpg":"image/jpeg","image/png":"image/png","image/webp":"image/webp","image/gif":"image/gif"};
function safeNum(v){const x=parseFloat(v);return isNaN(x)?0:x;}
function round1(x){return Math.round(safeNum(x)*10)/10;}
function extractJSON(text){
  if(!text||typeof text!=="string")return{parsed:null,error:"Empty"};
  let s=text.trim().replace(/```(?:json)?/gi,"").trim();
  const start=s.indexOf("{"),end=s.lastIndexOf("}");
  if(start===-1||end===-1||end<=start)return{parsed:null,error:"No JSON"};
  try{return{parsed:JSON.parse(s.slice(start,end+1)),error:null};}
  catch(e){return{parsed:null,error:"Parse failed"};}
}
function hasClaudeStorage(){return typeof window!=="undefined"&&window.storage!=null&&typeof window.storage.set==="function";}
async function storageSave(key,value){try{if(hasClaudeStorage()){await window.storage.set(key,JSON.stringify(value));}else{localStorage.setItem(key,JSON.stringify(value));}}catch{}}
async function storageLoad(key){if(hasClaudeStorage()){try{const r=await window.storage.get(key);return r&&r.value?JSON.parse(r.value):null;}catch{return null;}}try{const str=localStorage.getItem(key);return str?JSON.parse(str):null;}catch{return null;}}
async function searchFood(query){try{const res=await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=6&api_key=DEMO_KEY`);const data=await res.json();if(!data.foods||!data.foods.length)return[];return data.foods.map(food=>{const n=food.foodNutrients||[];const get=(id)=>{const f=n.find(x=>x.nutrientId===id||x.nutrientNumber===String(id));return f?Math.round(f.value*10)/10:0;};return{name:food.description,emoji:"🔍",brand:food.brandOwner||"",calories:get(1008)||get("208"),protein:get(1003)||get("203"),carbs:get(1005)||get("205"),fat:get(1004)||get("204"),fiber:get(1079)||get("291"),sugar:get(2000)||get("269"),sodium:get(1093)||get("307")};});}catch{return[];}}

function CalRing({eaten,goal,T}){
  const pct=Math.min(eaten/goal,1),over=eaten>goal;
  const radius=58,circ=2*Math.PI*radius,fill=pct*circ;
  const color=over?"#f87171":pct>=0.9?"#fbbf24":"#34d399";
  return(<div style={{display:"flex",alignItems:"center",gap:24}}><div style={{position:"relative",width:136,height:136,flexShrink:0}}><svg width="136" height="136" style={{transform:"rotate(-90deg)",display:"block"}}><circle cx="68" cy="68" r={radius} fill="none" stroke={T.border} strokeWidth="11"/><circle cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${fill} ${circ-fill}`} style={{transition:"stroke-dasharray .6s ease,stroke .4s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:700,color,lineHeight:1}}>{eaten}</span><span style={{fontSize:11,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>/{goal}</span></div></div><div><div style={{fontSize:11,color:T.textSub,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>CALORIES TODAY</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:700,color,lineHeight:1,marginBottom:8}}>{over?`+${eaten-goal} OVER`:`${goal-eaten} LEFT`}</div><div style={{width:160,height:5,background:T.border,borderRadius:99,overflow:"hidden"}}><div style={{width:`${Math.min(pct*100,100)}%`,height:"100%",background:color,borderRadius:99,transition:"width .6s ease"}}/></div><div style={{fontSize:11,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginTop:5}}>{Math.round(pct*100)}% of {goal} kcal</div></div></div>);
}
function MacroBar({label,value,max,unit,color,T}){
  const over=value>max,pct=Math.min((value/max)*100,100);
  return(<div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:T.textSub,fontFamily:"'DM Mono',monospace"}}>{label}</span><span style={{fontSize:13,fontWeight:700,color:over?"#f87171":T.text,fontFamily:"'DM Mono',monospace"}}>{value}{unit} <span style={{color:T.textFaint,fontWeight:400}}>/ {max}{unit}</span></span></div><div style={{height:6,background:T.border,borderRadius:99,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:over?"#f87171":color,borderRadius:99,transition:"width .5s ease"}}/></div></div>);
}
function StatPill({label,value,unit,color,T}){
  return(<div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:10,padding:"10px 14px",textAlign:"center",minWidth:72}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:T.textFaint,letterSpacing:"0.12em",marginBottom:3}}>{label}</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color}}>{value}<span style={{fontSize:13,fontWeight:400}}>{unit}</span></div></div>);
}

export default function App(){
  const [meals,setMeals]=useState([]);
  const [savedTemplates,setSavedTemplates]=useState([]);
  const [goals,setGoals]=useState(DEFAULT_GOALS);
  const [tab,setTab]=useState("log");
  const [confirm,setConfirm]=useState(false);
  const [themeId,setThemeId]=useState("obsidian");
  const [showTheme,setShowTheme]=useState(false);
  const [showGoals,setShowGoals]=useState(false);
  const [goalsForm,setGoalsForm]=useState(DEFAULT_GOALS);
  const [showSaved,setShowSaved]=useState(false);
  const [delSaved,setDelSaved]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [showSplash,setShowSplash]=useState(true);
  const [mealName,setMealName]=useState("");
  const [ingredients,setIngredients]=useState([]);
  const [mealErr,setMealErr]=useState("");
  const [activeCat,setActiveCat]=useState(0);
  const [searchQ,setSearchQ]=useState("");
  const [searchRes,setSearchRes]=useState([]);
  const [searching,setSearching]=useState(false);
  const [searchErr,setSearchErr]=useState("");
  const [dragOver,setDragOver]=useState(false);
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

  useEffect(()=>{
    (async()=>{
      try{
        const m=await storageLoad("ft-meals");
        const th=await storageLoad("ft-theme");
        const tmpl=await storageLoad("ft-templates");
        const g=await storageLoad("ft-goals");
        if(Array.isArray(m)&&m.length)setMeals(m);
        if(th&&THEMES.find(t=>t.id===th))setThemeId(th);
        if(Array.isArray(tmpl))setSavedTemplates(tmpl);
        if(g&&typeof g==="object"){setGoals(g);setGoalsForm(g);}
      }catch{}
      setLoaded(true);
      setTimeout(()=>setShowSplash(false),2200);
    })();
  },[]);
  useEffect(()=>{if(loaded)storageSave("ft-meals",meals);},[meals,loaded]);
  useEffect(()=>{if(loaded)storageSave("ft-theme",themeId);},[themeId,loaded]);
  useEffect(()=>{if(loaded)storageSave("ft-templates",savedTemplates);},[savedTemplates,loaded]);
  useEffect(()=>{if(loaded)storageSave("ft-goals",goals);},[goals,loaded]);

  const totals=meals.reduce((a,m)=>{a.calories+=safeNum(m.calories);a.protein+=safeNum(m.protein);a.carbs+=safeNum(m.carbs);a.fat+=safeNum(m.fat);a.fiber+=safeNum(m.fiber);a.sugar+=safeNum(m.sugar);a.sodium+=safeNum(m.sodium);return a;},{calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});
  const ingTotals=ingredients.reduce((a,i)=>{const s=safeNum(i.servings);a.calories+=Math.round(safeNum(i.calories)*s);a.protein+=round1(safeNum(i.protein)*s);a.carbs+=round1(safeNum(i.carbs)*s);a.fat+=round1(safeNum(i.fat)*s);a.fiber+=round1(safeNum(i.fiber)*s);a.sugar+=round1(safeNum(i.sugar)*s);a.sodium+=Math.round(safeNum(i.sodium)*s);return a;},{calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0});

  function saveGoals(){const g={calories:safeNum(goalsForm.calories)||DEFAULT_GOALS.calories,protein:safeNum(goalsForm.protein)||DEFAULT_GOALS.protein,carbs:safeNum(goalsForm.carbs)||DEFAULT_GOALS.carbs,fat:safeNum(goalsForm.fat)||DEFAULT_GOALS.fat,fiber:safeNum(goalsForm.fiber)||DEFAULT_GOALS.fiber,sugar:safeNum(goalsForm.sugar)||DEFAULT_GOALS.sugar,sodium:safeNum(goalsForm.sodium)||DEFAULT_GOALS.sodium};setGoals(g);setShowGoals(false);}
  function addIng(food){setIngredients(prev=>{const ex=prev.find(i=>i.name===food.name);if(ex)return prev.map(i=>i.name===food.name?{...i,servings:String(safeNum(i.servings)+1)}:i);return[...prev,{...food,id:Date.now()+Math.random(),servings:"1"}];});setMealErr("");}
  function updServ(id,val){setIngredients(prev=>prev.map(i=>i.id===id?{...i,servings:val}:i));}
  function removeIng(id){setIngredients(prev=>prev.filter(i=>i.id!==id));}
  function dragStart(e,food){e.dataTransfer.setData("food",JSON.stringify(food));}
  function drop(e){e.preventDefault();setDragOver(false);try{addIng(JSON.parse(e.dataTransfer.getData("food")));}catch{}}
  async function doSearch(){if(!searchQ.trim())return;setSearching(true);setSearchErr("");setSearchRes([]);const r=await searchFood(searchQ);if(!r.length)setSearchErr("No results. Try simpler terms.");setSearchRes(r);setSearching(false);}
  function saveTmpl(){if(!mealName.trim()||!ingredients.length){setMealErr("Name your meal and add ingredients first.");return;}setSavedTemplates(prev=>[...prev,{id:Date.now(),name:mealName.trim(),ingredients:ingredients.map(i=>({...i})),calories:ingTotals.calories,protein:ingTotals.protein,carbs:ingTotals.carbs,fat:ingTotals.fat}]);setMealErr("");alert(`"${mealName}" saved!`);}
  function loadTmpl(t){setMealName(t.name);setIngredients(t.ingredients.map(i=>({...i,id:Date.now()+Math.random()})));setShowSaved(false);setTab("add");setMealErr("");}
  function delTmpl(id){setSavedTemplates(prev=>prev.filter(t=>t.id!==id));setDelSaved(null);}
  function logMeal(){if(!mealName.trim()){setMealErr("Give your meal a name.");return;}if(!ingredients.length){setMealErr("Add at least one ingredient.");return;}setMeals(prev=>[...prev,{id:Date.now(),name:mealName.trim(),calories:ingTotals.calories,protein:ingTotals.protein,carbs:ingTotals.carbs,fat:ingTotals.fat,fiber:ingTotals.fiber,sugar:ingTotals.sugar,sodium:ingTotals.sodium,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),ingredientCount:ingredients.length}]);setMealName("");setIngredients([]);setMealErr("");clearPhoto();setTab("log");}
  function photoFile(file){if(!file||!file.type.startsWith("image/"))return;const mime=MIME_MAP[file.type]||"image/jpeg";const r=new FileReader();r.onload=e=>{const d=e.target.result;setPhotoSrc(d);setPhotoB64(d.split(",")[1]);setPhotoMime(mime);setScanErr("");};r.readAsDataURL(file);}
  function clearPhoto(){setPhotoSrc(null);setPhotoB64(null);setScanErr("");}
  async function scan(){if(!photoB64)return;setScanning(true);setScanErr("");try{const k=import.meta.env.VITE_ANTHROPIC_KEY;const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true","x-api-key":k},body:JSON.stringify({model:"claude-opus-4-5",max_tokens:512,system:"Output only raw JSON.",messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:photoMime,data:photoB64}},{type:"text",text:"JSON keys: name,calories,protein,carbs,fat,fiber,sugar,sodium."}]})});if(!res.ok){const b=await res.text();throw new Error(`HTTP ${res.status}: ${b.slice(0,200)}`);}const data=await res.json();const tb=data.content?.find(b=>b.type==="text");if(!tb?.text)throw new Error("Empty");const{parsed,error:pe}=extractJSON(tb.text);if(!parsed)throw new Error(pe||"Could not read.");addIng({name:String(parsed.name||"Scanned food"),emoji:"📸",calories:parsed.calories||0,protein:parsed.protein||0,carbs:parsed.carbs||0,fat:parsed.fat||0,fiber:parsed.fiber||0,sugar:parsed.sugar||0,sodium:parsed.sodium||0,brand:""});}catch(e){setScanErr(e.message||"Error.");}finally{setScanning(false);}}
  function delMeal(id){setMeals(prev=>prev.filter(m=>m.id!==id));}
  function newDay(){setMeals([]);setMealName("");setIngredients([]);setMealErr("");clearPhoto();setConfirm(false);setTab("log");setShowSaved(false);}
  const calOver=totals.calories>goals.calories;
  const prevCal=totals.calories+ingTotals.calories;
  function tabSt(active){return{flex:1,padding:"11px 0",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:600,letterSpacing:"0.05em",background:active?"#34d399":"transparent",color:active?"#030712":T.textSub,borderRadius:active?8:0,transition:"all .2s"};}
  const displayFoods=searchRes.length>0?searchRes:PRESET_CATEGORIES[activeCat].foods;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'DM Sans',sans-serif",transition:"background .4s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
        .del-btn{opacity:0!important;transition:opacity .2s!important;}
        .meal-card:hover .del-btn{opacity:1!important;}
        .food-card{cursor:grab;transition:all .15s;user-select:none;}
        .food-card:hover{border-color:#34d399!important;transform:translateY(-2px);}
        .food-card:active{transform:scale(0.97);}
        .ing-row:hover .ing-del{opacity:1!important;}
        .ing-del{opacity:0!important;transition:opacity .2s!important;}
        .cat-btn{cursor:pointer;white-space:nowrap;transition:all .2s;}
        @keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-10px);}}
        @keyframes loadbar{from{width:0%;}to{width:100%;}}
      `}</style>

      {showSplash&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"#030712",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:64,fontWeight:700,letterSpacing:"0.08em",lineHeight:1,marginBottom:8}}>
            <span style={{color:"#34d399"}}>FUEL</span><span style={{color:"#f1f5f9"}}> TRACK</span>
          </div>
          <div style={{fontSize:12,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:40}}>DAILY MACRO TRACKER</div>
          <div style={{display:"flex",gap:10,marginBottom:40}}>
            {["🥩","🍗","🥦","🍚","💪","🥚","🐟"].map((e,i)=>(
              <div key={i} style={{fontSize:26,animation:`bounce 1s ease-in-out ${i*0.12}s infinite alternate`}}>{e}</div>
            ))}
          </div>
          <div style={{width:180,height:3,background:"#1e293b",borderRadius:99,overflow:"hidden",marginBottom:12}}>
            <div style={{height:"100%",background:"#34d399",borderRadius:99,animation:"loadbar 2s ease-out forwards"}}/>
          </div>
          <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>LOADING...</div>
        </div>
      )}

      <header style={{padding:"14px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:"#34d399",letterSpacing:"0.06em"}}>FUEL</span>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:T.text,letterSpacing:"0.06em"}}>TRACK</span>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>{setGoalsForm({...goals});setShowGoals(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🎯</button>
          <button onClick={()=>setShowTheme(v=>!v)} style={{background:showTheme?"#34d399":"transparent",border:"1px solid "+(showTheme?"#34d399":T.border),color:showTheme?"#030712":T.text,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🎨</button>
          {meals.length>0&&<button onClick={()=>setConfirm(true)} style={{background:"transparent",border:"1px solid "+T.border,color:T.textSub,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>🌅</button>}
        </div>
      </header>

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
        <div style={{background:T.card,borderBottom:"2px solid "+T.border,padding:"18px 20px",zIndex:55,position:"relative"}}>
          {[["DARK",0,8],["LIGHT",8,15],["VIBRANT",15,23]].map(([lbl,from,to])=>(
            <div key={lbl}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:6,marginTop:from>0?12:0}}>{lbl}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:4}}>
                {THEMES.slice(from,to).map(th=>(
                  <button key={th.id} onClick={()=>{setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===th.id?"2px solid #34d399":"1px solid "+(from>=8&&from<15?th.border:T.border),background:th.card,transition:"all .2s"}}>
                    <div style={{width:14,height:14,borderRadius:3,background:th.swatch,border:"1px solid rgba(128,128,128,0.3)",flexShrink:0}}/>
                    <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===th.id?"#34d399":th.text,whiteSpace:"nowrap"}}>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(3,7,18,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:32,maxWidth:340,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🌅</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,marginBottom:8,color:T.text}}>New Day?</div>
            <p style={{color:T.textSub,fontSize:13,lineHeight:1.6,marginBottom:24}}>Clears {meals.length} meal{meals.length!==1?"s":""} and resets totals.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirm(false)} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.textSub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CANCEL</button>
              <button onClick={newDay} style={{flex:1,padding:"12px 0",background:"#7f1d1d",border:"1px solid #991b1b",color:"#fca5a5",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>RESET</button>
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
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:2}}>{tmpl.name}</div>
                        <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{tmpl.calories} kcal · P{tmpl.protein}g · C{tmpl.carbs}g · F{tmpl.fat}g</div>
                        <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginTop:2}}>{tmpl.ingredients.length} ingredients</div>
                      </div>
                      <div style={{display:"flex",gap:6,marginLeft:8}}>
                        <button onClick={()=>loadTmpl(tmpl)} style={{padding:"7px 12px",background:"#065f46",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>LOAD</button>
                        {delSaved===tmpl.id?(
                          <button onClick={()=>delTmpl(tmpl.id)} style={{padding:"7px 12px",background:"#7f1d1d",border:"none",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>CONFIRM?</button>
                        ):(
                          <button onClick={()=>setDelSaved(tmpl.id)} style={{padding:"7px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.textFaint,fontSize:13,cursor:"pointer"}}>×</button>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {tmpl.ingredients.slice(0,5).map((ing,i)=>(
                        <span key={i} style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.textSub,background:T.card,border:"1px solid "+T.border,borderRadius:4,padding:"2px 6px"}}>{ing.emoji} {ing.name.split("(")[0].trim()}</span>
                      ))}
                      {tmpl.ingredients.length>5&&<span style={{fontSize:10,color:T.textFaint,padding:"2px 6px"}}>+{tmpl.ingredients.length-5} more</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{maxWidth:520,margin:"0 auto",padding:"20px 16px 60px"}}>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"20px 22px",marginBottom:16}}>
          <CalRing eaten={Math.round(totals.calories)} goal={goals.calories} T={T}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
            <StatPill label="PROTEIN" value={round1(totals.protein)} unit="g"  color="#34d399" T={T}/>
            <StatPill label="CARBS"   value={round1(totals.carbs)}   unit="g"  color="#60a5fa" T={T}/>
            <StatPill label="FAT"     value={round1(totals.fat)}     unit="g"  color="#fbbf24" T={T}/>
            <StatPill label="FIBER"   value={round1(totals.fiber)}   unit="g"  color="#a78bfa" T={T}/>
            <StatPill label="SUGAR"   value={round1(totals.sugar)}   unit="g"  color="#f472b6" T={T}/>
            <StatPill label="SODIUM"  value={Math.round(totals.sodium)} unit="mg" color="#fb923c" T={T}/>
          </div>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px",marginBottom:16}}>
          <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>MACRO BREAKDOWN</div>
          {MACROS.map(m=><MacroBar key={m.key} label={m.label} value={round1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T}/>)}
        </div>

        <div style={{display:"flex",background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:4,marginBottom:16,gap:4}}>
          <button style={tabSt(tab==="log")} onClick={()=>setTab("log")}>📋 LOG{meals.length>0&&` (${meals.length})`}</button>
          <button style={tabSt(tab==="add")} onClick={()=>setTab("add")}>🍳 BUILD</button>
          <button onClick={()=>setShowSaved(true)} style={{flex:1,padding:"11px 0",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:600,background:"transparent",color:T.textSub,borderRadius:8}}>⭐ SAVED{savedTemplates.length>0&&` (${savedTemplates.length})`}</button>
          <button style={tabSt(tab==="info")} onClick={()=>setTab("info")}>ℹ️ HOW TO</button>
        </div>

        {tab==="add"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>MEAL NAME</div>
              <input type="text" value={mealName} onChange={e=>{setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Post-Workout Lunch"
                style={{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:15,padding:"11px 14px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
              />
            </div>

            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>🍽️ FOOD BROWSER — tap to add · 200+ foods</div>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <input type="text" value={searchQ} onChange={e=>{setSearchQ(e.target.value);if(!e.target.value)setSearchRes([]);}} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Search any food..."
                  style={{flex:1,background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"9px 12px",fontFamily:"'DM Sans',sans-serif",outline:"none"}}
                />
                <button onClick={doSearch} disabled={searching} style={{padding:"9px 14px",background:"#0891b2",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"SEARCH"}</button>
                {searchRes.length>0&&<button onClick={()=>{setSearchRes([]);setSearchQ("");}} style={{padding:"9px 10px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.textSub,fontSize:12,cursor:"pointer"}}>✕</button>}
              </div>
              {searchErr&&<div style={{fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace",marginBottom:8}}>⚠ {searchErr}</div>}
              {!searchRes.length&&(
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:12,scrollbarWidth:"none"}}>
                  {PRESET_CATEGORIES.map((cat,i)=>(
                    <button key={i} className="cat-btn" onClick={()=>setActiveCat(i)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid "+(activeCat===i?"#34d399":T.border),background:activeCat===i?"#34d399":T.card2,color:activeCat===i?"#030712":T.textSub,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{cat.label}</button>
                  ))}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {displayFoods.map((food,i)=>(
                  <div key={i} className="food-card" draggable onDragStart={e=>dragStart(e,food)} onClick={()=>addIng(food)} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"12px",cursor:"pointer"}}>
                    <div style={{fontSize:26,marginBottom:5,lineHeight:1}}>{food.emoji}</div>
                    <div style={{fontSize:11,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:5}}>{food.name}</div>
                    {food.brand&&<div style={{fontSize:10,color:T.textFaint,marginBottom:3}}>{food.brand}</div>}
                    <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#34d399",fontWeight:700}}>{food.calories} kcal</div>
                    <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.textSub}}>P{food.protein}g · C{food.carbs}g · F{food.fat}g</div>
                  </div>
                ))}
              </div>
            </div>

            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={drop}
              style={{background:T.card,border:`2px ${dragOver?"solid #34d399":"dashed "+T.border}`,borderRadius:16,padding:"16px 18px",minHeight:90,transition:"all .2s",boxShadow:dragOver?"0 0 20px rgba(52,211,153,0.2)":"none"}}>
              {!ingredients.length?(
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:26,marginBottom:6}}>🧺</div>
                  <div style={{color:dragOver?"#34d399":T.textSub,fontSize:14,fontWeight:600,marginBottom:3}}>{dragOver?"Drop it!":"Your Meal"}</div>
                  <div style={{color:T.textFaint,fontSize:12,fontFamily:"'DM Mono',monospace"}}>Tap foods above to add them</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>🧺 {ingredients.length} INGREDIENT{ingredients.length!==1?"S":""}{dragOver&&<span style={{color:"#34d399",marginLeft:8}}>DROP TO ADD</span>}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {ingredients.map(ing=>(
                      <div key={ing.id} className="ing-row" style={{display:"flex",alignItems:"center",gap:10,background:T.card2,borderRadius:10,padding:"10px 12px",border:"1px solid "+T.border}}>
                        <span style={{fontSize:20,flexShrink:0}}>{ing.emoji||"🍽️"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                          <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:"#34d399"}}>{Math.round(safeNum(ing.calories)*safeNum(ing.servings))} kcal · P{round1(safeNum(ing.protein)*safeNum(ing.servings))}g</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                          <button onClick={()=>updServ(ing.id,String(Math.max(0.25,safeNum(ing.servings)-0.25)))} style={{width:26,height:26,borderRadius:6,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                          <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:T.text,minWidth:28,textAlign:"center"}}>{ing.servings}x</span>
                          <button onClick={()=>updServ(ing.id,String(safeNum(ing.servings)+0.25))} style={{width:26,height:26,borderRadius:6,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          <button className="ing-del" onClick={()=>removeIng(ing.id)} style={{width:26,height:26,borderRadius:6,background:"transparent",border:"1px solid "+T.border,color:T.textFaint,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>×</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:12,padding:"12px 14px",background:prevCal>goals.calories?"#1a0505":"#061a0f",border:`1px solid ${prevCal>goals.calories?"#7f1d1d":"#14532d"}`,borderRadius:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                      <span style={{fontSize:10,color:prevCal>goals.calories?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace"}}>MEAL TOTAL</span>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:prevCal>goals.calories?"#f87171":"#4ade80"}}>{ingTotals.calories} kcal</span>
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {[["P",ingTotals.protein,"g","#34d399"],["C",ingTotals.carbs,"g","#60a5fa"],["F",ingTotals.fat,"g","#fbbf24"],["Fi",ingTotals.fiber,"g","#a78bfa"],["Su",ingTotals.sugar,"g","#f472b6"],["Na",ingTotals.sodium,"mg","#fb923c"]].map(([l,v,u,c])=>(
                        <span key={l} style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:c}}>{l} {v}{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>📸 ADD FROM PHOTO — needs API credits</div>
              {!photoSrc?(
                <div onClick={()=>{if(fileRef.current)fileRef.current.click();}} style={{border:"2px dashed "+T.border,borderRadius:10,padding:"14px",textAlign:"center",cursor:"pointer"}}>
                  <div style={{fontSize:22,marginBottom:4}}>📷</div>
                  <div style={{color:"#60a5fa",fontWeight:600,fontSize:13}}>Take or choose a photo</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])photoFile(e.target.files[0]);e.target.value="";}}/>
                </div>
              ):(
                <div>
                  <div style={{position:"relative",borderRadius:10,overflow:"hidden",marginBottom:10}}>
                    <img src={photoSrc} alt="food" style={{width:"100%",maxHeight:160,objectFit:"cover",display:"block"}}/>
                    <button onClick={clearPhoto} style={{position:"absolute",top:8,right:8,background:"rgba(3,7,18,.85)",border:"1px solid #334155",color:"#94a3b8",borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer"}}>✕</button>
                  </div>
                  <button onClick={scan} disabled={scanning} style={{width:"100%",padding:"11px 0",background:"#1d4ed8",border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",cursor:"pointer",opacity:scanning?0.5:1}}>
                    {scanning?"🔍 ANALYZING…":"🔍 SCAN & ADD INGREDIENT"}
                  </button>
                  {scanErr&&<div style={{marginTop:8,padding:"8px 12px",background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:8,fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace"}}>⚠ {scanErr}</div>}
                </div>
              )}
            </div>

            {mealErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center"}}>⚠ {mealErr}</div>}
            <div style={{display:"flex",gap:10}}>
              <button onClick={saveTmpl} disabled={!mealName.trim()||!ingredients.length}
                style={{flex:1,padding:"14px 0",background:"#0c4a6e",border:"1px solid #0369a1",borderRadius:12,color:"#7dd3fc",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ingredients.length)?0.4:1}}>
                ⭐ SAVE
              </button>
              <button onClick={logMeal} disabled={!mealName.trim()||!ingredients.length}
                style={{flex:2,padding:"14px 0",background:"#34d399",border:"none",borderRadius:12,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ingredients.length)?0.4:1}}>
                + LOG {ingredients.length>0&&`· ${ingTotals.calories} kcal`}
              </button>
            </div>
          </div>
        )}

        {tab==="log"&&(
          <div>
            {!meals.length?(
              <div style={{background:T.card,border:"1px dashed "+T.border,borderRadius:16,padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:12}}>🍽️</div>
                <div style={{color:T.textSub,fontSize:14,marginBottom:6}}>No meals logged yet</div>
                <div style={{color:T.textFaint,fontSize:12,fontFamily:"'DM Mono',monospace"}}>Tap 🍳 BUILD to get started</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {meals.map((meal,idx)=>(
                  <div key={meal.id} className="meal-card" style={{background:T.card,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:28,height:28,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'DM Mono',monospace",fontSize:11,color:T.textFaint}}>{idx+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                        <span style={{fontWeight:600,fontSize:14,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.textSub,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                      </div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#34d399",lineHeight:1,marginBottom:6}}>{meal.calories} <span style={{fontSize:13,fontWeight:400,color:T.textSub}}>kcal</span></div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {[{l:"P",v:meal.protein,u:"g",c:"#34d399"},{l:"C",v:meal.carbs,u:"g",c:"#60a5fa"},{l:"F",v:meal.fat,u:"g",c:"#fbbf24"},{l:"Fi",v:meal.fiber,u:"g",c:"#a78bfa"},{l:"Su",v:meal.sugar,u:"g",c:"#f472b6"},{l:"Na",v:meal.sodium,u:"mg",c:"#fb923c"}].filter(x=>x.v>0).map(chip=>(
                          <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:5,padding:"2px 7px",fontSize:11,fontFamily:"'DM Mono',monospace",color:chip.c}}>{chip.l} {round1(chip.v)}{chip.u}</span>
                        ))}
                      </div>
                      {meal.ingredientCount>0&&<div style={{fontSize:10,color:T.textFaint,fontFamily:"'DM Mono',monospace",marginTop:4}}>{meal.ingredientCount} ingredients</div>}
                    </div>
                    <button className="del-btn" onClick={()=>delMeal(meal.id)} style={{background:"transparent",border:"1px solid "+T.border,color:T.textFaint,borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                  </div>
                ))}
                <div style={{background:calOver?"#1a0505":"#061a0f",border:`1px solid ${calOver?"#7f1d1d":"#14532d"}`,borderRadius:12,padding:"12px 16px",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:calOver?"#f87171":"#4ade80",fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:2}}>{calOver?"⚠ OVER GOAL":"✓ DAILY TOTAL"}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:calOver?"#f87171":"#4ade80",lineHeight:1}}>{Math.round(totals.calories)} / {goals.calories} kcal</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                    <div style={{fontSize:13,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{round1(totals.protein)}g / {goals.protein}g protein</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="info"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"20px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:"#34d399",marginBottom:6}}>Welcome to FUEL TRACK 👋</div>
              <div style={{fontSize:13,color:T.textSub,lineHeight:1.7}}>Your personal daily macro tracker. Log meals, track nutrition, and hit your goals — completely free.</div>
            </div>
            {[
              {icon:"🍳",title:"BUILD MEAL",color:"#34d399",steps:["Tap the BUILD tab","Give your meal a name","Browse 17 food categories with 200+ preset foods","Tap any food card to add it instantly","Use +/− buttons to adjust servings (0.25x increments)","Search any food not in the presets using SEARCH","Watch the live calorie total update as you add","Tap + LOG to add the meal to today"]},
              {icon:"⭐",title:"SAVE MEALS",color:"#fbbf24",steps:["Build a meal then tap ⭐ SAVE to store it","Tap the ⭐ SAVED button to see all saved meals","Tap LOAD on any saved meal to reload it","Edit it and log it again — perfect for routine meals","Tap × then CONFIRM to delete a saved meal"]},
              {icon:"🎯",title:"SET YOUR GOALS",color:"#60a5fa",steps:["Tap the 🎯 button in the header","Set your own targets for all 7 nutrients","Tap SAVE GOALS — saved forever","Tap RESET to go back to defaults anytime"]},
              {icon:"📋",title:"MEAL LOG",color:"#a78bfa",steps:["The LOG tab shows everything eaten today","Each meal shows calories and all macros","Hover (desktop) to reveal the delete button","Footer shows your daily total vs goal","Green = on track, yellow = near limit, red = over"]},
              {icon:"🌅",title:"NEW DAY",color:"#fb923c",steps:["Tap 🌅 in the header each morning","Clears today's meals and resets all totals","Saved meals and goals are NOT deleted"]},
              {icon:"🎨",title:"THEMES",color:"#94a3b8",steps:["Tap 🎨 in the header","Choose from 23 themes: dark, light, and vibrant","Your choice is saved automatically"]},
            ].map(({icon,title,color,steps})=>(
              <div key={title} style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{fontSize:22}}>{icon}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color}}>{title}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {steps.map((step,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:18,height:18,borderRadius:99,background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:"#030712",fontFamily:"'DM Mono',monospace",marginTop:2}}>{i+1}</div>
                      <div style={{fontSize:13,color:T.textSub,lineHeight:1.5}}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"18px 20px"}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.textFaint,letterSpacing:"0.08em",marginBottom:10}}>💡 PRO TIPS</div>
              {["Tap a food twice to add 2 servings instantly","Search works for brand names — try Quest, Chobani, Fairlife","The USDA database has millions of foods","Saved meals are perfect for meal prep routines","Set your protein goal first — everything else follows"].map((tip,i)=>(
                <div key={i} style={{fontSize:12,color:T.textSub,padding:"8px 12px",background:T.card2,borderRadius:8,marginBottom:6}}>💡 {tip}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
