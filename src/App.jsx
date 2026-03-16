import { useState, useEffect, useRef } from "react";

const DEFAULT_GOALS = { calories:2000, protein:150, carbs:225, fat:65, fiber:25, water:8 };

const THEMES = [
  { id:"obsidian", label:"Obsidian",  bg:"#030712", card:"#0d1117", card2:"#161b22", border:"#21262d", text:"#e6edf3", sub:"#8b949e", faint:"#484f58", accent:"#3fb950" },
  { id:"midnight", label:"Midnight",  bg:"#0d0d20", card:"#14142e", card2:"#1a1a3d", border:"#2d2d60", text:"#e8e8ff", sub:"#9090c0", faint:"#4a4a80", accent:"#818cf8" },
  { id:"forest",   label:"Forest",    bg:"#0a1a0a", card:"#0f230f", card2:"#142e14", border:"#1e4a1e", text:"#d4edda", sub:"#78c87e", faint:"#2d6b33", accent:"#56d364" },
  { id:"navy",     label:"Navy",      bg:"#030a1a", card:"#071428", card2:"#0a1c38", border:"#1a3560", text:"#cce5ff", sub:"#6ba3d6", faint:"#1a4a80", accent:"#58a6ff" },
  { id:"charcoal", label:"Charcoal",  bg:"#1a1a1a", card:"#242424", card2:"#2e2e2e", border:"#3d3d3d", text:"#e8e8e8", sub:"#aaaaaa", faint:"#666666", accent:"#ff9f43" },
  { id:"plum",     label:"Plum",      bg:"#120820", card:"#1a0c2e", card2:"#22103c", border:"#3d1f6e", text:"#eeddff", sub:"#a87ed0", faint:"#5a3080", accent:"#c084fc" },
  { id:"snow",     label:"Snow",      bg:"#f0f4f8", card:"#ffffff", card2:"#e8eef4", border:"#cbd5e1", text:"#0f172a", sub:"#475569", faint:"#94a3b8", accent:"#0ea5e9" },
  { id:"warm",     label:"Warm",      bg:"#faf7f0", card:"#ffffff", card2:"#f5efe0", border:"#e2d5b0", text:"#2c1a06", sub:"#7a5c2e", faint:"#b08040", accent:"#d97706" },
  { id:"mint",     label:"Mint",      bg:"#f0faf5", card:"#ffffff", card2:"#e0f5ea", border:"#a8dfc0", text:"#0a2e1a", sub:"#2d7a50", faint:"#6abf8a", accent:"#10b981" },
  { id:"lavender", label:"Lavender",  bg:"#f5f0ff", card:"#ffffff", card2:"#ede0ff", border:"#c4a8ff", text:"#1e0050", sub:"#6030a0", faint:"#9060d0", accent:"#7c3aed" },
  { id:"ocean",    label:"Ocean",     bg:"#003554", card:"#004e7c", card2:"#006494", border:"#0582ca", text:"#e0f4ff", sub:"#90cbf0", faint:"#2070a0", accent:"#00b4d8" },
  { id:"emerald",  label:"Emerald",   bg:"#064e3b", card:"#065f46", card2:"#047857", border:"#059669", text:"#d1fae5", sub:"#6ee7b7", faint:"#2d6a4f", accent:"#34d399" },
  { id:"dusk",     label:"Dusk",      bg:"#1a0a2e", card:"#2a1040", card2:"#341450", border:"#6030a0", text:"#f0e0ff", sub:"#c090e0", faint:"#7040b0", accent:"#e040fb" },
  { id:"slate",    label:"Slate",     bg:"#0f172a", card:"#1e293b", card2:"#334155", border:"#475569", text:"#f1f5f9", sub:"#94a3b8", faint:"#64748b", accent:"#38bdf8" },
  { id:"rose",     label:"Rose",      bg:"#fff1f2", card:"#ffffff", card2:"#ffe4e6", border:"#fecdd3", text:"#3b0014", sub:"#9f1239", faint:"#e11d48", accent:"#f43f5e" },
];

const PETS = [
  { id:"dog",     name:"Buddy",   color:"#f59e0b", stages:[
    { level:1,  form:"Tiny Pup",        emoji:"🐶", desc:"Just waking up and ready to cheer you on!" },
    { level:3,  form:"Playful Pup",     emoji:"🐕", desc:"Bounding with energy, wagging at every meal!" },
    { level:5,  form:"Young Dog",       emoji:"🦮", desc:"Loyal and strong, growing with every goal." },
    { level:7,  form:"Guardian",        emoji:"🐕‍🦺", desc:"A steadfast protector of your health journey." },
    { level:10, form:"Legendary Hound", emoji:"🐺", desc:"A mythic companion. You two are unstoppable." },
  ]},
  { id:"dragon",  name:"Ember",   color:"#ef4444", stages:[
    { level:1,  form:"Dragon Egg",   emoji:"🥚", desc:"Ancient power sleeps within..." },
    { level:3,  form:"Baby Drake",   emoji:"🐍", desc:"Hatched! First flames flicker with potential." },
    { level:5,  form:"Young Drake",  emoji:"🦎", desc:"Wings spread, fire growing stronger each day." },
    { level:7,  form:"Fire Drake",   emoji:"🐲", desc:"A formidable drake, your dedication is legendary." },
    { level:10, form:"Mega Dragon",  emoji:"🐉", desc:"Fully awakened. The pinnacle of power and health." },
  ]},
  { id:"unicorn", name:"Luna",    color:"#ec4899", stages:[
    { level:1,  form:"Magic Foal",      emoji:"🐴", desc:"A spark of magic waiting to shine." },
    { level:3,  form:"Young Unicorn",   emoji:"🦄", desc:"Horn glowing with every healthy choice." },
    { level:5,  form:"Shining Unicorn", emoji:"✨🦄", desc:"Radiating light and leaving stardust behind." },
    { level:7,  form:"Celestial Steed", emoji:"🌟🦄", desc:"Galloping between stars, nothing holds you back." },
    { level:10, form:"Divine Unicorn",  emoji:"🌈🦄", desc:"Pure magic. Your journey has become legendary." },
  ]},
  { id:"kraken",  name:"Ink",     color:"#06b6d4", stages:[
    { level:1,  form:"Tiny Squid",    emoji:"🦑", desc:"Small but mighty, just like your first steps." },
    { level:3,  form:"Young Octopus", emoji:"🐙", desc:"Growing arms reach for new goals every day." },
    { level:5,  form:"Sea Beast",     emoji:"🦈", desc:"The deep recognizes your growing strength." },
    { level:7,  form:"Deep Terror",   emoji:"🌊🦑", desc:"Commands respect across all the seas." },
    { level:10, form:"Kraken Lord",   emoji:"🦑", desc:"The ancient Kraken rises. Legends are made of this." },
  ]},
  { id:"phoenix", name:"Blaze",   color:"#ff7043", stages:[
    { level:1,  form:"Tiny Ember",     emoji:"🔥", desc:"A tiny flame that refuses to go out." },
    { level:3,  form:"Fire Chick",     emoji:"🐣", desc:"Born from fire, stronger than before." },
    { level:5,  form:"Young Phoenix",  emoji:"🦅", desc:"Rising higher with every healthy choice." },
    { level:7,  form:"Blazing Phoenix",emoji:"🦜", desc:"Transformed by dedication. Unstoppable." },
    { level:10, form:"Eternal Phoenix",emoji:"⭐🦅", desc:"Immortal and radiant. Your journey is eternal." },
  ]},
  { id:"turtle",  name:"Shell",   color:"#22c55e", stages:[
    { level:1,  form:"Hatchling",   emoji:"🐣", desc:"Small steps lead to the greatest journeys." },
    { level:3,  form:"Baby Turtle", emoji:"🐢", desc:"Steady and sure, building strength every day." },
    { level:5,  form:"Sea Turtle",  emoji:"🌊🐢", desc:"Gliding gracefully, nothing can stop you now." },
    { level:7,  form:"Ocean Elder", emoji:"🏝️🐢", desc:"Ancient wisdom guiding every choice." },
    { level:10, form:"Titan Turtle",emoji:"⛰️🐢", desc:"A living legend. Mountains respect your journey." },
  ]},
  { id:"koi",     name:"Ripple",  color:"#f97316", stages:[
    { level:1,  form:"Baby Fish",    emoji:"🐟", desc:"A tiny spark of color in the water." },
    { level:3,  form:"Young Koi",    emoji:"🐠", desc:"Colors brightening with every good day." },
    { level:5,  form:"Dragon Koi",   emoji:"🐡", desc:"Rare and beautiful, just like your dedication." },
    { level:7,  form:"River Spirit", emoji:"🌊🐟", desc:"Revered by all who see your transformation." },
    { level:10, form:"Celestial Koi",emoji:"🐉🐟", desc:"The mythic Celestial Koi. You did it." },
  ]},
  { id:"cat",     name:"Whisper", color:"#8b5cf6", stages:[
    { level:1,  form:"Tiny Kitten",  emoji:"🐱", desc:"Curious and full of potential." },
    { level:3,  form:"Playful Cat",  emoji:"🐈", desc:"Quick, clever, always one step ahead." },
    { level:5,  form:"Sleek Cat",    emoji:"🐈‍⬛", desc:"Graceful and precise in every choice." },
    { level:7,  form:"Panther",      emoji:"🐆", desc:"Silent power. Your dedication is absolute." },
    { level:10, form:"Shadow Legend",emoji:"🌑🐈‍⬛", desc:"A being of pure strength and mystery." },
  ]},
  { id:"wolf",    name:"Storm",   color:"#94a3b8", stages:[
    { level:1,  form:"Wolf Pup",  emoji:"🐺", desc:"Ice-blue eyes full of fierce determination." },
    { level:3,  form:"Young Wolf",emoji:"🐺", desc:"Running with purpose, learning the way." },
    { level:5,  form:"Ice Wolf",  emoji:"❄️🐺", desc:"Frost follows your footsteps now." },
    { level:7,  form:"Alpha Wolf",emoji:"🌕🐺", desc:"The pack follows your strength and wisdom." },
    { level:10, form:"Dire Wolf", emoji:"⚡🐺", desc:"A force of nature. Nothing can stop you." },
  ]},
  { id:"bear",    name:"Kodiak",  color:"#78716c", stages:[
    { level:1,  form:"Tiny Cub",   emoji:"🐻", desc:"Fluffy and full of energy, ready to grow!" },
    { level:3,  form:"Young Bear", emoji:"🐻", desc:"Growing strong with every step forward." },
    { level:5,  form:"Grizzly",    emoji:"🐻‍❄️", desc:"Powerful and steady. Built to last." },
    { level:7,  form:"War Bear",   emoji:"🦬", desc:"Legendary strength earned through real effort." },
    { level:10, form:"Titan Bear", emoji:"⛰️🐻", desc:"A living mountain. Your journey is complete." },
  ]},
];

const PET_LEVELS = [
  { level:1,  name:"Newborn",  xpReq:0    },
  { level:2,  name:"Baby",     xpReq:100  },
  { level:3,  name:"Young",    xpReq:250  },
  { level:4,  name:"Growing",  xpReq:500  },
  { level:5,  name:"Evolved",  xpReq:900  },
  { level:6,  name:"Strong",   xpReq:1400 },
  { level:7,  name:"Powerful", xpReq:2100 },
  { level:8,  name:"Champion", xpReq:3000 },
  { level:9,  name:"Legend",   xpReq:4200 },
  { level:10, name:"GOD MODE", xpReq:6000 },
];

function getLvl(xp){
  var cur=PET_LEVELS[0];
  for(var i=0;i<PET_LEVELS.length;i++){if(xp>=PET_LEVELS[i].xpReq)cur=PET_LEVELS[i];else break;}
  var nxt=null;
  for(var j=0;j<PET_LEVELS.length;j++){if(PET_LEVELS[j].xpReq>xp){nxt=PET_LEVELS[j];break;}}
  var prog=nxt?((xp-cur.xpReq)/(nxt.xpReq-cur.xpReq))*100:100;
  return Object.assign({},cur,{nxt:nxt,prog:prog,xp:xp});
}
function getStage(pet,lvl){
  if(!pet)return null;
  var s=pet.stages[0];
  for(var i=0;i<pet.stages.length;i++){if(lvl>=pet.stages[i].level)s=pet.stages[i];else break;}
  return s;
}

function sn(v){var x=parseFloat(v);return isNaN(x)?0:x;}
function r1(x){return Math.round(sn(x)*10)/10;}
function hasCS(){return typeof window!=="undefined"&&window.storage!=null&&typeof window.storage.set==="function";}
async function kset(k,v){try{if(hasCS())await window.storage.set(k,JSON.stringify(v));else localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
async function kget(k){if(hasCS()){try{var r=await window.storage.get(k);return r&&r.value?JSON.parse(r.value):null;}catch(e){return null;}}try{var s=localStorage.getItem(k);return s?JSON.parse(s):null;}catch(e){return null;}}

async function searchUSDA(q){
  try{
    var res=await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?query="+encodeURIComponent(q)+"&pageSize=8&api_key=DEMO_KEY");
    var data=await res.json();
    if(!data.foods||!data.foods.length)return[];
    return data.foods.map(function(f){
      var ns=f.foodNutrients||[];
      function g(id){var x=ns.find(function(y){return y.nutrientId===id||y.nutrientNumber===String(id);});return x?Math.round(x.value*10)/10:0;}
      return{name:f.description,emoji:"🔍",brand:f.brandOwner||"",calories:g(1008)||g("208"),protein:g(1003)||g("203"),carbs:g(1005)||g("205"),fat:g(1004)||g("204"),fiber:g(1079)||g("291"),sugar:g(2000)||g("269"),sodium:g(1093)||g("307")};
    });
  }catch(e){return[];}
}

var QUICK_FOODS=[
  {keywords:["chicken breast","grilled chicken","chicken"],name:"Chicken Breast",emoji:"🍗",calories:185,protein:35,carbs:0,fat:4,fiber:0,sugar:0,sodium:75,perOz:185/4},
  {keywords:["salmon"],name:"Salmon",emoji:"🐟",calories:234,protein:31,carbs:0,fat:12,fiber:0,sugar:0,sodium:64,perOz:234/4},
  {keywords:["ground beef","beef"],name:"Ground Beef",emoji:"🥩",calories:196,protein:24,carbs:0,fat:11,fiber:0,sugar:0,sodium:75,perOz:196/4},
  {keywords:["egg white"],name:"Egg Whites",emoji:"🥚",calories:17,protein:3.6,carbs:0.2,fat:0.1,fiber:0,sugar:0.2,sodium:55},
  {keywords:["egg"],name:"Egg",emoji:"🥚",calories:72,protein:6,carbs:0.4,fat:5,fiber:0,sugar:0.4,sodium:71},
  {keywords:["greek yogurt","yogurt"],name:"Greek Yogurt",emoji:"🫙",calories:100,protein:17,carbs:6,fat:0,fiber:0,sugar:6,sodium:65,perCup:1},
  {keywords:["cottage cheese"],name:"Cottage Cheese",emoji:"🫙",calories:90,protein:12,carbs:5,fat:2.5,fiber:0,sugar:4,sodium:360},
  {keywords:["white rice","jasmine rice","rice"],name:"White Rice",emoji:"🍚",calories:206,protein:4,carbs:45,fat:0.4,fiber:0.6,sugar:0,sodium:2,perCup:1},
  {keywords:["brown rice"],name:"Brown Rice",emoji:"🍚",calories:216,protein:5,carbs:45,fat:1.8,fiber:3.5,sugar:0,sodium:10,perCup:1},
  {keywords:["oatmeal","oats"],name:"Oatmeal",emoji:"🥣",calories:158,protein:6,carbs:27,fat:3,fiber:4,sugar:0,sodium:115,perCup:1},
  {keywords:["sweet potato"],name:"Sweet Potato",emoji:"🍠",calories:103,protein:2,carbs:24,fat:0.1,fiber:3.8,sugar:7,sodium:41},
  {keywords:["broccoli"],name:"Broccoli",emoji:"🥦",calories:55,protein:4,carbs:11,fat:0.6,fiber:5,sugar:2,sodium:64,perCup:1},
  {keywords:["banana"],name:"Banana",emoji:"🍌",calories:105,protein:1.3,carbs:27,fat:0.4,fiber:3.1,sugar:14,sodium:1},
  {keywords:["apple"],name:"Apple",emoji:"🍎",calories:95,protein:0.5,carbs:25,fat:0.3,fiber:4.4,sugar:19,sodium:2},
  {keywords:["peanut butter","pb"],name:"Peanut Butter",emoji:"🥜",calories:188,protein:8,carbs:6,fat:16,fiber:2,sugar:3,sodium:152},
  {keywords:["protein shake","protein powder","whey","protein"],name:"Protein Shake",emoji:"🥤",calories:120,protein:25,carbs:5,fat:2,fiber:1,sugar:2,sodium:150},
  {keywords:["quest bar","protein bar"],name:"Quest Bar",emoji:"💪",calories:200,protein:21,carbs:22,fat:8,fiber:14,sugar:1,sodium:250},
  {keywords:["fairlife","core power"],name:"Fairlife Core Power",emoji:"🥤",calories:230,protein:42,carbs:13,fat:3.5,fiber:0,sugar:11,sodium:280},
  {keywords:["premier protein"],name:"Premier Protein",emoji:"🥤",calories:160,protein:30,carbs:6,fat:3,fiber:1,sugar:1,sodium:390},
  {keywords:["avocado","avo"],name:"Avocado",emoji:"🥑",calories:120,protein:1.5,carbs:6,fat:11,fiber:5,sugar:0.5,sodium:5},
  {keywords:["black beans","beans"],name:"Black Beans",emoji:"🫘",calories:114,protein:7.6,carbs:20,fat:0.5,fiber:7.5,sugar:0.3,sodium:1,perCup:228/1},
  {keywords:["pasta","spaghetti","noodles"],name:"Pasta",emoji:"🍝",calories:220,protein:8,carbs:43,fat:1.3,fiber:2.5,sugar:0.6,sodium:1,perCup:1},
  {keywords:["bread","toast"],name:"Bread",emoji:"🍞",calories:81,protein:4,carbs:14,fat:1,fiber:1.9,sugar:1.4,sodium:147},
  {keywords:["tortilla","wrap"],name:"Tortilla",emoji:"🫓",calories:110,protein:5,carbs:22,fat:3,fiber:11,sugar:0,sodium:380},
  {keywords:["milk"],name:"Milk",emoji:"🥛",calories:122,protein:8,carbs:12,fat:5,fiber:0,sugar:12,sodium:115,perCup:1},
  {keywords:["cheese"],name:"Cheddar Cheese",emoji:"🧀",calories:115,protein:7,carbs:0.4,fat:9,fiber:0,sugar:0.1,sodium:185},
  {keywords:["almonds","almond"],name:"Almonds",emoji:"🌰",calories:164,protein:6,carbs:6,fat:14,fiber:3.5,sugar:1.2,sodium:0},
  {keywords:["olive oil","oil"],name:"Olive Oil",emoji:"🫒",calories:119,protein:0,carbs:0,fat:13.5,fiber:0,sugar:0,sodium:0},
  {keywords:["butter"],name:"Butter",emoji:"🧈",calories:102,protein:0.1,carbs:0,fat:11.5,fiber:0,sugar:0,sodium:82},
  {keywords:["shrimp","prawn"],name:"Shrimp",emoji:"🦐",calories:112,protein:24,carbs:0,fat:1.5,fiber:0,sugar:0,sodium:190,perOz:112/4},
  {keywords:["tuna"],name:"Tuna",emoji:"🐟",calories:109,protein:25,carbs:0,fat:1,fiber:0,sugar:0,sodium:303},
  {keywords:["turkey"],name:"Ground Turkey",emoji:"🦃",calories:170,protein:22,carbs:0,fat:9,fiber:0,sugar:0,sodium:75,perOz:170/4},
  {keywords:["bacon"],name:"Bacon",emoji:"🥓",calories:86,protein:6,carbs:0.1,fat:7,fiber:0,sugar:0,sodium:368},
  {keywords:["tilapia","cod","fish"],name:"White Fish",emoji:"🐟",calories:145,protein:30,carbs:0,fat:2.5,fiber:0,sugar:0,sodium:75,perOz:145/4},
  {keywords:["spinach"],name:"Spinach",emoji:"🥬",calories:14,protein:1.7,carbs:2,fat:0.2,fiber:1.3,sugar:0.2,sodium:48,perCup:1},
  {keywords:["strawberr"],name:"Strawberries",emoji:"🍓",calories:49,protein:1,carbs:12,fat:0.5,fiber:3,sugar:7,sodium:2,perCup:1},
  {keywords:["blueberr"],name:"Blueberries",emoji:"🫐",calories:84,protein:1.1,carbs:21,fat:0.5,fiber:3.6,sugar:15,sodium:1,perCup:1},
  {keywords:["orange"],name:"Orange",emoji:"🍊",calories:62,protein:1.2,carbs:15,fat:0.2,fiber:3.1,sugar:12,sodium:0},
  {keywords:["mango"],name:"Mango",emoji:"🥭",calories:99,protein:1.4,carbs:25,fat:0.6,fiber:2.6,sugar:23,sodium:2,perCup:1},
  {keywords:["coffee","latte"],name:"Coffee",emoji:"☕",calories:5,protein:0.3,carbs:0.7,fat:0.1,fiber:0,sugar:0,sodium:5},
  {keywords:["pizza"],name:"Pizza Slice",emoji:"🍕",calories:285,protein:12,carbs:36,fat:10,fiber:2,sugar:3,sodium:640},
  {keywords:["burger","hamburger","big mac"],name:"Burger",emoji:"🍔",calories:450,protein:23,carbs:40,fat:20,fiber:2,sugar:7,sodium:900},
  {keywords:["fries","french fries"],name:"Fries",emoji:"🍟",calories:320,protein:4,carbs:44,fat:15,fiber:3,sugar:0,sodium:400},
  {keywords:["chipotle","burrito bowl"],name:"Chipotle Chicken Bowl",emoji:"🥙",calories:655,protein:51,carbs:62,fat:21,fiber:11,sugar:5,sodium:1810},
  {keywords:["salad"],name:"Salad",emoji:"🥗",calories:150,protein:8,carbs:12,fat:7,fiber:4,sugar:4,sodium:300},
  {keywords:["soup"],name:"Soup",emoji:"🍲",calories:120,protein:8,carbs:15,fat:3,fiber:1,sugar:2,sodium:890},
  {keywords:["quinoa"],name:"Quinoa",emoji:"🌾",calories:222,protein:8,carbs:39,fat:4,fiber:5,sugar:1.6,sodium:13,perCup:1},
  {keywords:["hummus"],name:"Hummus",emoji:"🫘",calories:50,protein:2,carbs:6,fat:3,fiber:1.6,sugar:0.3,sodium:115},
  {keywords:["chocolate"],name:"Dark Chocolate",emoji:"🍫",calories:170,protein:2,carbs:13,fat:12,fiber:3,sugar:7,sodium:5},
  {keywords:["ice cream"],name:"Ice Cream",emoji:"🍦",calories:207,protein:3.5,carbs:24,fat:11,fiber:0.7,sugar:21,sodium:80},
  {keywords:["gatorade","sports drink"],name:"Gatorade",emoji:"🥤",calories:140,protein:0,carbs:36,fat:0,fiber:0,sugar:34,sodium:270},
];

function parseVoiceEntry(text){
  var foods=[];
  var lower=text.toLowerCase();
  var lines=lower.split(/\band\b|,|then|plus|with|also/);
  for(var i=0;i<lines.length;i++){
    var line=lines[i].trim();
    if(!line||line.length<2)continue;
    var item={name:line,emoji:"🎤",calories:0,protein:0,carbs:0,fat:0,fiber:0,sugar:0,sodium:0};
    var matched=false;
    for(var j=0;j<QUICK_FOODS.length;j++){
      var qf=QUICK_FOODS[j];
      for(var k=0;k<qf.keywords.length;k++){
        if(lower.indexOf(qf.keywords[k])!==-1){
          var mult=1;
          var ozMatch=line.match(/(\d+(?:\.\d+)?)\s*oz/);
          var cupMatch=line.match(/(\d+(?:\.\d+)?)\s*cup/);
          var numMatch=line.match(/^(\d+)\s/);
          if(ozMatch&&qf.perOz)mult=parseFloat(ozMatch[1])/qf.perOz;
          else if(cupMatch&&qf.perCup)mult=parseFloat(cupMatch[1])/qf.perCup;
          else if(numMatch)mult=parseInt(numMatch[1]);
          item=Object.assign({},item,{
            name:qf.name,emoji:qf.emoji,
            calories:Math.round(qf.calories*mult),protein:r1(qf.protein*mult),
            carbs:r1(qf.carbs*mult),fat:r1(qf.fat*mult),
            fiber:r1(qf.fiber*mult),sugar:r1((qf.sugar||0)*mult),sodium:Math.round((qf.sodium||0)*mult),
          });
          matched=true;break;
        }
      }
      if(matched)break;
    }
    foods.push(Object.assign({},item,{id:Date.now()+Math.random(),servings:"1"}));
  }
  return foods;
}

function scoreMeal(meal,goals,calsBefore){
  var score=0;var details=[];var tips=[];
  var pp=meal.calories>0?(meal.protein/meal.calories)*100:0;
  var ps=Math.min(40,Math.round(pp*2.5));score+=ps;
  if(ps>=25)details.push({t:"Great protein for this meal",pos:true});
  else if(ps>=12)details.push({t:"Good protein in this one",pos:true});
  else{details.push({t:"Light on protein this meal",pos:false});tips.push("Add a protein source next time — chicken, eggs, Greek yogurt, or a shake work great");}
  var rem=goals.calories-calsBefore;
  var cs=meal.calories<=rem?Math.min(25,Math.round(25*(1-meal.calories/goals.calories))):5;
  score+=cs;
  if(meal.calories>rem+300)tips.push("This put you a bit over today — totally fine, just go lighter at the next meal");
  var fs=Math.min(15,Math.round((meal.fiber/Math.max(goals.fiber,1))*100*0.15));
  score+=fs;
  if(fs>=8)details.push({t:"Nice fiber content",pos:true});
  var sodRatio=meal.sodium/Math.max(2300,1);
  if(sodRatio>0.6)tips.push("A bit high on sodium — try going easy on sauces or deli meats next time");
  else score+=8;
  var sr=meal.sugar/Math.max(50,1);
  if(sr<=0.3)score+=10;else if(sr<=0.6)score+=5;
  var final=Math.max(20,Math.min(100,score));
  var label="Keep Going";var lcolor="#94a3b8";var icon="🌱";
  if(final>=85){label="Amazing";lcolor="#fbbf24";icon="🌟";}
  else if(final>=70){label="Great";lcolor="#34d399";icon="💪";}
  else if(final>=55){label="Good";lcolor="#60a5fa";icon="👍";}
  var encs=["Every meal is progress — you showed up!","Look at you building those healthy habits!","Consistency is what makes the difference.","Your body thanks you for every good choice.","You are further along than you were yesterday.","Small steps every day add up to big change.","This is what dedication looks like."];
  var enc=encs[Math.floor(Math.random()*encs.length)];
  if(tips.length===0)tips.push("You are doing great — keep this up!");
  return{score:final,label:label,labelColor:lcolor,icon:icon,details:details,tips:tips,encouragement:enc};
}

function CalRing(p){
  var pct=Math.min(p.eaten/p.goal,1),over=p.eaten>p.goal;
  var R=52,C=2*Math.PI*R,F=pct*C;
  var col=over?"#fb923c":pct>=0.9?"#34d399":p.T.accent;
  return(
    <div style={{display:"flex",alignItems:"center",gap:20}}>
      <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
        <svg width="120" height="120" style={{transform:"rotate(-90deg)",display:"block"}}>
          <circle cx="60" cy="60" r={R} fill="none" stroke={p.T.border} strokeWidth="10"/>
          <circle cx="60" cy="60" r={R} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={F+" "+(C-F)} style={{transition:"stroke-dasharray .6s"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:col,lineHeight:1}}>{p.eaten}</span>
          <span style={{fontSize:10,color:p.T.sub,fontFamily:"'DM Mono',monospace"}}>/{p.goal}</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:10,color:p.T.sub,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>CALORIES TODAY</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:700,color:col,lineHeight:1,marginBottom:6}}>{over?"+"+(p.eaten-p.goal)+" over":(p.goal-p.eaten)+" to go"}</div>
        <div style={{width:140,height:4,background:p.T.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{width:Math.min(pct*100,100)+"%",height:"100%",background:col,borderRadius:99,transition:"width .6s"}}/>
        </div>
        <div style={{fontSize:10,color:p.T.faint,fontFamily:"'DM Mono',monospace",marginTop:4}}>{Math.round(pct*100)}% of {p.goal} kcal</div>
      </div>
    </div>
  );
}
function MBar(p){
  var pct=Math.min((p.value/p.max)*100,100);
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:11,color:p.T.sub,fontFamily:"'DM Mono',monospace"}}>{p.label}</span>
        <span style={{fontSize:12,fontWeight:600,color:p.T.text,fontFamily:"'DM Mono',monospace"}}>{p.value}{p.unit} <span style={{color:p.T.faint,fontWeight:400}}>/ {p.max}{p.unit}</span></span>
      </div>
      <div style={{height:5,background:p.T.border,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:pct>=100?"#fb923c":p.color,borderRadius:99,transition:"width .5s"}}/>
      </div>
    </div>
  );
}
function Pill(p){
  return(
    <div style={{background:p.T.card2,border:"1px solid "+p.T.border,borderRadius:10,padding:"8px 12px",textAlign:"center",minWidth:62}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:p.T.faint,letterSpacing:"0.1em",marginBottom:2}}>{p.label}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:p.color}}>{p.value}<span style={{fontSize:11,fontWeight:400}}>{p.unit}</span></div>
    </div>
  );
}

var CSS="@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;} input[type=number]{-moz-appearance:textfield;} .delbtn{opacity:0!important;transition:opacity .2s!important;} .mcard:hover .delbtn{opacity:1!important;} .fc{transition:all .15s;cursor:pointer;} .fc:hover{transform:translateY(-2px);} .pf{animation:floatPet 3s ease-in-out infinite;} .xpa{animation:xpA 2.5s ease-out forwards;} @keyframes floatPet{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}} @keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}} @keyframes loadbar{from{width:0%;}to{width:100%;}} @keyframes xpA{0%{opacity:0;transform:translateY(0) scale(.5);}20%{opacity:1;transform:translateY(-20px) scale(1.2);}80%{opacity:1;transform:translateY(-40px);}100%{opacity:0;transform:translateY(-60px);}} .voice-pulse{animation:vp 1s ease-in-out infinite;} @keyframes vp{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}";

export default function App(){
  var [users,setUsers]=useState({});
  var [cu,setCu]=useState(null);
  var [authScreen,setAuthScreen]=useState("login");
  var [authU,setAuthU]=useState("");
  var [authP,setAuthP]=useState("");
  var [authP2,setAuthP2]=useState("");
  var [authErr,setAuthErr]=useState("");
  var [meals,setMeals]=useState([]);
  var [saved,setSaved]=useState([]);
  var [goals,setGoals]=useState(DEFAULT_GOALS);
  var [goalsF,setGoalsF]=useState(DEFAULT_GOALS);
  var [waterGlasses,setWaterGlasses]=useState(0);
  var [weightLog,setWeightLog]=useState([]);
  var [totalDaysLogged,setTotalDaysLogged]=useState(0);
  var [lastLogDate,setLastLogDate]=useState(null);
  var [tab,setTab]=useState("home");
  var [themeId,setThemeId]=useState("obsidian");
  var [loaded,setLoaded]=useState(false);
  var [splash,setSplash]=useState(true);
  var [activePetId,setActivePetId]=useState(null);
  var [petData,setPetData]=useState({});
  var [zoo,setZoo]=useState([]);
  var [xpPop,setXpPop]=useState(null);
  var [showGoals,setShowGoals]=useState(false);
  var [showTheme,setShowTheme]=useState(false);
  var [showSaved,setShowSaved]=useState(false);
  var [showPetPick,setShowPetPick]=useState(false);
  var [showZoo,setShowZoo]=useState(false);
  var [confirmNewDay,setConfirmNewDay]=useState(false);
  var [scoredMeal,setScoredMeal]=useState(null);
  var [showWeightModal,setShowWeightModal]=useState(false);
  var [weightInput,setWeightInput]=useState("");
  var [delSaved,setDelSaved]=useState(null);
  var [mealName,setMealName]=useState("");
  var [ings,setIngs]=useState([]);
  var [mealErr,setMealErr]=useState("");
  var [catIdx,setCatIdx]=useState(0);
  var [searchQ,setSearchQ]=useState("");
  var [searchR,setSearchR]=useState([]);
  var [searching,setSearching]=useState(false);
  var [searchErr,setSearchErr]=useState("");
  var [dragOver,setDragOver]=useState(false);
  var [voiceText,setVoiceText]=useState("");
  var [voiceListening,setVoiceListening]=useState(false);
  var [voiceErr,setVoiceErr]=useState("");
  var [voiceModal,setVoiceModal]=useState(false);
  var [voiceParsed,setVoiceParsed]=useState([]);
  var recogRef=useRef(null);

  var T=THEMES.find(function(t){return t.id===themeId;})||THEMES[0];
  var MACROS=[
    {key:"protein",label:"Protein",unit:"g",color:"#34d399",max:goals.protein},
    {key:"carbs",  label:"Carbs",  unit:"g",color:"#60a5fa",max:goals.carbs},
    {key:"fat",    label:"Fat",    unit:"g",color:"#fbbf24",max:goals.fat},
    {key:"fiber",  label:"Fiber",  unit:"g",color:"#a78bfa",max:goals.fiber},
  ];
  var activePet=activePetId?PETS.find(function(p){return p.id===activePetId;}):null;
  var activePetXP=(petData[activePetId]||{}).xp||0;
  var activePetName=(petData[activePetId]||{}).name||(activePet?activePet.name:"");
  var petLvl=getLvl(activePetXP);
  var petStage=activePet?getStage(activePet,petLvl.level):null;

  var QUICK_CATS=[
    {label:"Protein",emoji:"💪",items:QUICK_FOODS.slice(0,12)},
    {label:"Carbs",emoji:"🍚",items:QUICK_FOODS.slice(12,22)},
    {label:"Veggies & Fruit",emoji:"🥦",items:QUICK_FOODS.slice(22,32)},
    {label:"Snacks",emoji:"🍎",items:QUICK_FOODS.slice(32,42)},
    {label:"Drinks",emoji:"☕",items:QUICK_FOODS.slice(42,46)},
    {label:"Fast Food",emoji:"🍔",items:QUICK_FOODS.slice(46)},
  ];

  useEffect(function(){
    (async function(){
      try{
        var u=await kget("ft-users");
        var c=await kget("ft-cu");
        if(u&&typeof u==="object")setUsers(u);
        if(c)setCu(c);
      }catch(e){}
      setLoaded(true);
      setTimeout(function(){setSplash(false);},2000);
    })();
  },[]);

  useEffect(function(){
    if(!loaded||!cu)return;
    (async function(){
      var k="ft-"+cu+"-";
      try{
        var m=await kget(k+"meals");var th=await kget(k+"theme");
        var sv=await kget(k+"saved");var g=await kget(k+"goals");
        var ap=await kget(k+"apid");var pd=await kget(k+"pd");
        var z=await kget(k+"zoo");var w=await kget(k+"water");
        var wl=await kget(k+"weights");var td=await kget(k+"totaldays");
        var ll=await kget(k+"lastlogdate");
        if(Array.isArray(m)&&m.length)setMeals(m);else setMeals([]);
        if(th&&THEMES.find(function(t){return t.id===th;}))setThemeId(th);else setThemeId("obsidian");
        if(Array.isArray(sv))setSaved(sv);else setSaved([]);
        if(g&&typeof g==="object"){setGoals(g);setGoalsF(g);}else{setGoals(DEFAULT_GOALS);setGoalsF(DEFAULT_GOALS);}
        if(ap)setActivePetId(ap);else setActivePetId(null);
        if(pd&&typeof pd==="object")setPetData(pd);else setPetData({});
        if(Array.isArray(z))setZoo(z);else setZoo([]);
        if(typeof w==="number")setWaterGlasses(w);else setWaterGlasses(0);
        if(Array.isArray(wl))setWeightLog(wl);else setWeightLog([]);
        if(typeof td==="number")setTotalDaysLogged(td);else setTotalDaysLogged(0);
        if(ll)setLastLogDate(ll);else setLastLogDate(null);
      }catch(e){}
    })();
  },[cu,loaded]);

  useEffect(function(){if(loaded)kset("ft-users",users);},[users,loaded]);
  useEffect(function(){if(loaded)kset("ft-cu",cu);},[cu,loaded]);
  function usd(f,v){if(cu)kset("ft-"+cu+"-"+f,v);}
  useEffect(function(){if(loaded&&cu)usd("meals",meals);},[meals,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("theme",themeId);},[themeId,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("saved",saved);},[saved,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("goals",goals);},[goals,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("apid",activePetId);},[activePetId,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("pd",petData);},[petData,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("zoo",zoo);},[zoo,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("water",waterGlasses);},[waterGlasses,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("weights",weightLog);},[weightLog,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("totaldays",totalDaysLogged);},[totalDaysLogged,loaded,cu]);
  useEffect(function(){if(loaded&&cu)usd("lastlogdate",lastLogDate);},[lastLogDate,loaded,cu]);

  var totals=meals.reduce(function(a,m){a.calories+=sn(m.calories);a.protein+=sn(m.protein);a.carbs+=sn(m.carbs);a.fat+=sn(m.fat);a.fiber+=sn(m.fiber);return a;},{calories:0,protein:0,carbs:0,fat:0,fiber:0});
  var ingTots=ings.reduce(function(a,i){var s=sn(i.servings);a.calories+=Math.round(sn(i.calories)*s);a.protein+=r1(sn(i.protein)*s);a.carbs+=r1(sn(i.carbs)*s);a.fat+=r1(sn(i.fat)*s);a.fiber+=r1(sn(i.fiber)*s);return a;},{calories:0,protein:0,carbs:0,fat:0,fiber:0});
  var avgScore=meals.length>0?Math.round(meals.reduce(function(a,m){return a+(m.score||0);},0)/meals.length):null;
  var calOver=totals.calories>goals.calories;

  function awardXP(amt){
    if(!activePetId)return;
    setPetData(function(prev){
      var cur=prev[activePetId]||{xp:0,name:activePet?activePet.name:"",maxed:false};
      var nXP=cur.xp+amt;var nMaxed=nXP>=6000;
      if(nMaxed&&!cur.maxed)setZoo(function(z){return z.includes(activePetId)?z:z.concat([activePetId]);});
      var upd=Object.assign({},prev);
      upd[activePetId]=Object.assign({},cur,{xp:Math.min(nXP,6000),maxed:nMaxed});
      return upd;
    });
    setXpPop(amt);setTimeout(function(){setXpPop(null);},2500);
  }
  function trackDay(){
    var today=new Date().toDateString();
    if(lastLogDate===today)return;
    setLastLogDate(today);
    setTotalDaysLogged(function(d){return d+1;});
    awardXP(5);
  }
  function doLogin(){
    setAuthErr("");
    var u=authU.trim().toLowerCase();
    if(!u){setAuthErr("Enter a username.");return;}
    if(!authP){setAuthErr("Enter a password.");return;}
    if(!users[u]){setAuthErr("No account found. Sign up below.");return;}
    if(users[u]!==authP){setAuthErr("Wrong password. Try again.");return;}
    setCu(u);setAuthU("");setAuthP("");
  }
  function doSignup(){
    setAuthErr("");
    var u=authU.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
    if(!u||u.length<3){setAuthErr("Username needs 3+ letters or numbers.");return;}
    if(!authP||authP.length<4){setAuthErr("Password needs to be 4+ characters.");return;}
    if(authP!==authP2){setAuthErr("Passwords do not match.");return;}
    if(users[u]){setAuthErr("That username is taken.");return;}
    var upd=Object.assign({},users);upd[u]=authP;
    setUsers(upd);setCu(u);setAuthU("");setAuthP("");setAuthP2("");
  }
  function doLogout(){
    setCu(null);setMeals([]);setSaved([]);setGoals(DEFAULT_GOALS);setGoalsF(DEFAULT_GOALS);
    setActivePetId(null);setPetData({});setZoo([]);setWaterGlasses(0);setWeightLog([]);
    setTotalDaysLogged(0);setLastLogDate(null);setTab("home");setScoredMeal(null);
  }
  function addIng(food){
    setIngs(function(prev){
      var ex=prev.find(function(i){return i.name===food.name;});
      if(ex)return prev.map(function(i){return i.name===food.name?Object.assign({},i,{servings:String(sn(i.servings)+1)}):i;});
      return prev.concat([Object.assign({},food,{id:Date.now()+Math.random(),servings:"1"})]);
    });
    setMealErr("");
  }
  function updServ(id,val){setIngs(function(p){return p.map(function(i){return i.id===id?Object.assign({},i,{servings:val}):i;});});}
  function removeIng(id){setIngs(function(p){return p.filter(function(i){return i.id!==id;});});}
  async function doSearch(){
    if(!searchQ.trim())return;
    setSearching(true);setSearchErr("");setSearchR([]);
    var r=await searchUSDA(searchQ);
    if(!r.length)setSearchErr("No results — try different wording.");
    setSearchR(r);setSearching(false);
  }
  function startVoice(){
    setVoiceErr("");setVoiceText("");setVoiceParsed([]);
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setVoiceErr("Voice not supported here. Type below instead.");return;}
    var recog=new SR();
    recog.continuous=false;recog.interimResults=true;recog.lang="en-US";
    recog.onstart=function(){setVoiceListening(true);};
    recog.onresult=function(e){var t="";for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;setVoiceText(t);};
    recog.onend=function(){
      setVoiceListening(false);
      setVoiceText(function(t){if(t.trim())setVoiceParsed(parseVoiceEntry(t));return t;});
    };
    recog.onerror=function(){setVoiceListening(false);setVoiceErr("Could not hear you. Try typing below.");};
    recogRef.current=recog;recog.start();
  }
  function stopVoice(){if(recogRef.current)recogRef.current.stop();}
  function confirmVoice(){
    if(!voiceParsed.length){setVoiceErr("No foods detected. Try again or type.");return;}
    voiceParsed.forEach(function(f){addIng(f);});
    setVoiceModal(false);setVoiceText("");setVoiceParsed([]);
    if(!mealName.trim())setMealName("Voice Meal "+new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));
  }
  function logMeal(){
    if(!mealName.trim()){setMealErr("Give this meal a name.");return;}
    if(!ings.length){setMealErr("Add at least one food.");return;}
    var meal={id:Date.now(),name:mealName.trim(),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat,fiber:ingTots.fiber,sugar:0,sodium:0,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
    var sc=scoreMeal(meal,goals,totals.calories);
    meal.score=sc.score;meal.label=sc.label;meal.labelColor=sc.labelColor;meal.icon=sc.icon;
    setMeals(function(p){return p.concat([meal]);});
    setScoredMeal(Object.assign({},meal,sc));
    var xp=10;if(sc.score>=85)xp+=15;else if(sc.score>=70)xp+=8;else if(sc.score>=55)xp+=4;
    awardXP(xp);trackDay();
    setMealName("");setIngs([]);setMealErr("");setTab("log");
  }
  function saveMealTmpl(){
    if(!mealName.trim()||!ings.length){setMealErr("Name and add ingredients first.");return;}
    setSaved(function(p){return p.concat([{id:Date.now(),name:mealName.trim(),ings:ings.map(function(i){return Object.assign({},i);}),calories:ingTots.calories,protein:ingTots.protein,carbs:ingTots.carbs,fat:ingTots.fat}]);});
    setMealErr("");alert(mealName+" saved!");
  }
  function loadTmpl(m){setMealName(m.name);setIngs(m.ings.map(function(i){return Object.assign({},i,{id:Date.now()+Math.random()});}));setShowSaved(false);setTab("build");setMealErr("");}
  function newDay(){
    if(activePetId&&meals.length>0){
      var xp=0;if(meals.length>=3)xp+=10;
      var cp=totals.calories/Math.max(goals.calories,1);
      if(cp>=0.8&&cp<=1.1)xp+=15;
      if(totals.protein/Math.max(goals.protein,1)>=0.85)xp+=20;
      if(waterGlasses>=goals.water)xp+=10;
      if(xp>0)awardXP(xp);
    }
    setMeals([]);setWaterGlasses(0);setMealName("");setIngs([]);setMealErr("");
    setConfirmNewDay(false);setTab("home");setScoredMeal(null);
  }
  function selectPet(id){
    if(!petData[id]){var pet=PETS.find(function(p){return p.id===id;});setPetData(function(prev){var u=Object.assign({},prev);u[id]={xp:0,name:pet?pet.name:"",maxed:false};return u;});}
    setActivePetId(id);setShowPetPick(false);
  }
  function saveGoals(){
    var g={calories:sn(goalsF.calories)||DEFAULT_GOALS.calories,protein:sn(goalsF.protein)||DEFAULT_GOALS.protein,carbs:sn(goalsF.carbs)||DEFAULT_GOALS.carbs,fat:sn(goalsF.fat)||DEFAULT_GOALS.fat,fiber:sn(goalsF.fiber)||DEFAULT_GOALS.fiber,water:sn(goalsF.water)||DEFAULT_GOALS.water};
    setGoals(g);setShowGoals(false);
  }
  function navSt(active){return{flex:1,padding:"9px 0 7px",border:"none",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:9,fontWeight:600,background:"transparent",color:active?T.accent:T.faint,transition:"color .2s",display:"flex",flexDirection:"column",alignItems:"center",gap:2};}
  function inp(ex){return Object.assign({},{width:"100%",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.text,fontSize:14,padding:"11px 14px",fontFamily:"'DM Sans',sans-serif",outline:"none"},ex||{});}

  if(splash)return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"#030712",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:56,fontWeight:700,letterSpacing:"0.08em",lineHeight:1,marginBottom:8}}>
        <span style={{color:"#34d399"}}>FUEL</span><span style={{color:"#f1f5f9"}}> TRACK</span>
      </div>
      <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",letterSpacing:"0.15em",marginBottom:32}}>YOUR HEALTH COMPANION</div>
      <div style={{display:"flex",gap:8,marginBottom:32}}>
        {["🐶","🥚","🦄","🦑","🔥","🐢","🐉","🐺","🐱"].map(function(e,i){return(<div key={i} style={{fontSize:22,animation:"bounce 1s ease-in-out "+i*0.1+"s infinite alternate"}}>{e}</div>);})}
      </div>
      <div style={{width:160,height:3,background:"#1e293b",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",background:"#34d399",borderRadius:99,animation:"loadbar 1.8s ease-out forwards"}}/>
      </div>
    </div>
  );

  if(!cu)return(
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:700,letterSpacing:"0.06em",lineHeight:1,marginBottom:6}}>
            <span style={{color:T.accent}}>FUEL</span><span style={{color:T.text}}> TRACK</span>
          </div>
          <div style={{fontSize:12,color:T.sub,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>YOUR HEALTH COMPANION</div>
        </div>
        <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:28}}>
          <div style={{display:"flex",marginBottom:20,background:T.card2,borderRadius:10,padding:3}}>
            <button onClick={function(){setAuthScreen("login");setAuthErr("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,background:authScreen==="login"?T.accent:"transparent",color:authScreen==="login"?"#030712":T.sub,fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>LOG IN</button>
            <button onClick={function(){setAuthScreen("signup");setAuthErr("");}} style={{flex:1,padding:"10px 0",border:"none",borderRadius:8,background:authScreen==="signup"?T.accent:"transparent",color:authScreen==="signup"?"#030712":T.sub,fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>SIGN UP</button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>USERNAME</label>
              <input type="text" value={authU} onChange={function(e){setAuthU(e.target.value);setAuthErr("");}} onKeyDown={function(e){if(e.key==="Enter")authScreen==="login"?doLogin():doSignup();}} placeholder="your_username" autoCapitalize="none" autoCorrect="off" style={inp({borderLeft:"3px solid "+T.accent})}/>
            </div>
            <div>
              <label style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>PASSWORD</label>
              <input type="password" value={authP} onChange={function(e){setAuthP(e.target.value);setAuthErr("");}} onKeyDown={function(e){if(e.key==="Enter")authScreen==="login"?doLogin():doSignup();}} placeholder="password" style={inp({borderLeft:"3px solid "+T.accent})}/>
            </div>
            {authScreen==="signup"&&(
              <div>
                <label style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>CONFIRM PASSWORD</label>
                <input type="password" value={authP2} onChange={function(e){setAuthP2(e.target.value);setAuthErr("");}} onKeyDown={function(e){if(e.key==="Enter")doSignup();}} placeholder="confirm password" style={inp({borderLeft:"3px solid "+T.accent})}/>
              </div>
            )}
            {authErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",padding:"8px 12px",background:"rgba(127,29,29,0.3)",border:"1px solid rgba(127,29,29,0.6)",borderRadius:8}}>⚠ {authErr}</div>}
            <button onClick={authScreen==="login"?doLogin:doSignup} style={{padding:"14px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",marginTop:4}}>
              {authScreen==="login"?"LOG IN":"CREATE ACCOUNT"}
            </button>
          </div>
          {authScreen==="login"&&(
            <div style={{textAlign:"center",marginTop:16,fontSize:12,color:T.faint}}>
              New here?{" "}<button onClick={function(){setAuthScreen("signup");setAuthErr("");}} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontSize:12,fontFamily:"'DM Mono',monospace"}}>Sign up free</button>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={function(){setShowTheme(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Change Theme</button>
        </div>
        {showTheme&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowTheme(false);}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"70vh",overflowY:"auto"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:16}}>Choose a Theme</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {THEMES.map(function(th){return(
                  <button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===th.id?"2px solid "+T.accent:"1px solid "+T.border,background:th.card}}>
                    <div style={{width:14,height:14,borderRadius:3,background:th.bg,border:"1px solid rgba(128,128,128,.3)",flexShrink:0}}/>
                    <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===th.id?T.accent:th.text,whiteSpace:"nowrap"}}>{th.label}</span>
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
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'DM Sans',sans-serif",transition:"background .3s",paddingBottom:68}}>
      <style>{CSS}</style>
      {xpPop!=null&&<div className="xpa" style={{position:"fixed",top:80,right:20,zIndex:150,background:"#fbbf24",color:"#030712",borderRadius:12,padding:"8px 16px",fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(251,191,36,.4)",pointerEvents:"none"}}>+{xpPop} XP ⚡</div>}

      {scoredMeal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:24,padding:28,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52,marginBottom:8}}>{scoredMeal.icon}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:700,color:scoredMeal.labelColor,lineHeight:1,marginBottom:4}}>{scoredMeal.label}</div>
              <div style={{fontSize:13,color:T.sub,fontStyle:"italic",marginBottom:8}}>{scoredMeal.encouragement}</div>
              <div style={{fontSize:11,color:T.faint,fontFamily:"'DM Mono',monospace"}}>{scoredMeal.score}/100 quality score</div>
            </div>
            {scoredMeal.details.length>0&&(
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                {scoredMeal.details.map(function(d,i){return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:T.card2,borderRadius:8}}>
                    <span style={{fontSize:14}}>{d.pos?"✅":"💡"}</span>
                    <span style={{fontSize:12,color:T.sub}}>{d.t}</span>
                  </div>
                );})}
              </div>
            )}
            {scoredMeal.tips&&scoredMeal.tips.length>0&&(
              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>NEXT TIME, TRY THIS</div>
                {scoredMeal.tips.map(function(tip,i){return(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:7}}>
                    <span style={{fontSize:14,flexShrink:0}}>💡</span>
                    <div style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{tip}</div>
                  </div>
                );})}
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[["CAL",scoredMeal.calories,"kcal"],["PROTEIN",scoredMeal.protein,"g"],["CARBS",scoredMeal.carbs,"g"]].map(function(x){return(
                <div key={x[0]} style={{background:T.card2,borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace",marginBottom:2}}>{x[0]}</div>
                  <div style={{fontSize:16,fontWeight:700,color:T.text,fontFamily:"'Barlow Condensed',sans-serif"}}>{x[1]}<span style={{fontSize:11,fontWeight:400}}>{x[2]}</span></div>
                </div>
              );})}
            </div>
            <button onClick={function(){setScoredMeal(null);}} style={{width:"100%",padding:"13px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Keep it up!</button>
          </div>
        </div>
      )}

      {voiceModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setVoiceModal(false);}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"24px 24px 0 0",padding:28,width:"100%",maxWidth:520,maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4}}>Voice Entry</div>
            <div style={{fontSize:13,color:T.sub,marginBottom:20}}>Say what you ate — like "grilled chicken, cup of rice, and broccoli"</div>
            <div style={{textAlign:"center",marginBottom:20}}>
              <button onClick={voiceListening?stopVoice:startVoice} className={voiceListening?"voice-pulse":""} style={{width:80,height:80,borderRadius:99,background:voiceListening?"#ef4444":T.accent,border:"none",cursor:"pointer",fontSize:32,boxShadow:voiceListening?"0 0 30px rgba(239,68,68,0.5)":"0 0 20px rgba(52,211,153,0.3)",transition:"all .2s"}}>
                {voiceListening?"⏹":"🎤"}
              </button>
              <div style={{fontSize:12,color:T.sub,marginTop:10,fontFamily:"'DM Mono',monospace"}}>{voiceListening?"Listening... tap to stop":"Tap mic to speak"}</div>
            </div>
            {voiceText&&(
              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:10,padding:"12px 16px",marginBottom:16}}>
                <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>YOU SAID</div>
                <div style={{fontSize:14,color:T.text,lineHeight:1.5}}>{voiceText}</div>
              </div>
            )}
            {voiceParsed.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:10,color:T.accent,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>FOODS DETECTED</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {voiceParsed.map(function(f,i){return(
                    <div key={i} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:22}}>{f.emoji}</span>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:T.text}}>{f.name}</div>
                          <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.accent}}>{f.calories} kcal · P{f.protein}g</div>
                        </div>
                      </div>
                      <button onClick={function(){setVoiceParsed(function(p){return p.filter(function(_,j){return j!==i;});});}} style={{background:"transparent",border:"none",color:T.faint,cursor:"pointer",fontSize:18,padding:"0 4px"}}>x</button>
                    </div>
                  );})}
                </div>
              </div>
            )}
            {voiceErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",marginBottom:12,padding:"8px 12px",background:"rgba(127,29,29,0.3)",borderRadius:8}}>⚠ {voiceErr}</div>}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginBottom:6}}>OR TYPE WHAT YOU ATE</div>
              <div style={{display:"flex",gap:8}}>
                <input type="text" value={voiceText} onChange={function(e){setVoiceText(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&voiceText.trim())setVoiceParsed(parseVoiceEntry(voiceText));}} placeholder="e.g. chicken breast and a cup of rice..." style={inp({flex:1,fontSize:13,padding:"9px 12px"})}/>
                <button onClick={function(){if(voiceText.trim())setVoiceParsed(parseVoiceEntry(voiceText));}} style={{padding:"9px 14px",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Parse</button>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={function(){setVoiceModal(false);}} style={{flex:1,padding:"13px 0",background:T.card2,border:"1px solid "+T.border,borderRadius:10,color:T.sub,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Cancel</button>
              <button onClick={confirmVoice} disabled={voiceParsed.length===0} style={{flex:2,padding:"13px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:voiceParsed.length===0?0.4:1}}>
                Add {voiceParsed.length>0&&voiceParsed.reduce(function(a,f){return a+f.calories;},0)+" kcal"} to Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {showGoals&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:400,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>Your Daily Goals</div>
              <button onClick={function(){setShowGoals(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Cancel</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[{key:"calories",label:"Calories (kcal)",color:"#34d399"},{key:"protein",label:"Protein (g)",color:"#34d399"},{key:"carbs",label:"Carbs (g)",color:"#60a5fa"},{key:"fat",label:"Fat (g)",color:"#fbbf24"},{key:"fiber",label:"Fiber (g)",color:"#a78bfa"},{key:"water",label:"Water (glasses/day)",color:"#38bdf8"}].map(function(item){return(
                <div key={item.key}>
                  <label style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",display:"block",marginBottom:5}}>{item.label}</label>
                  <input type="number" min="0" value={goalsF[item.key]} onChange={function(e){var v=e.target.value;setGoalsF(function(f){var u=Object.assign({},f);u[item.key]=v;return u;});}} style={inp({borderLeft:"3px solid "+item.color})}/>
                </div>
              );})}
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={function(){setGoalsF(DEFAULT_GOALS);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Reset</button>
              <button onClick={saveGoals} style={{flex:2,padding:"12px 0",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Save Goals</button>
            </div>
          </div>
        </div>
      )}

      {showTheme&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowTheme(false);}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"70vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:16}}>Choose a Theme</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {THEMES.map(function(th){return(
                <button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",borderRadius:8,cursor:"pointer",border:themeId===th.id?"2px solid "+T.accent:"1px solid "+T.border,background:th.card,transition:"all .2s"}}>
                  <div style={{width:14,height:14,borderRadius:3,background:th.bg,border:"1px solid rgba(128,128,128,.3)",flexShrink:0}}/>
                  <span style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",color:themeId===th.id?T.accent:th.text,whiteSpace:"nowrap"}}>{th.label}</span>
                </button>
              );})}
            </div>
          </div>
        </div>
      )}

      {confirmNewDay&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:32,maxWidth:340,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🌅</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,marginBottom:8,color:T.text}}>Start Fresh?</div>
            <p style={{color:T.sub,fontSize:13,lineHeight:1.6,marginBottom:24}}>Clears today's meals and water. Your pet earns XP for everything you hit today first!</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){setConfirmNewDay(false);}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Cancel</button>
              <button onClick={newDay} style={{flex:1,padding:"12px 0",background:T.accent,border:"none",color:"#030712",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>New Day</button>
            </div>
          </div>
        </div>
      )}

      {showSaved&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setShowSaved(false);}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:520,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text}}>Your Saved Meals</div>
              <button onClick={function(){setShowSaved(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Close</button>
            </div>
            {!saved.length?(
              <div style={{textAlign:"center",padding:"30px 0",color:T.faint,fontSize:13}}>No saved meals yet. Build a meal and tap Save.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {saved.map(function(m){return(
                  <div key={m.id} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{m.name}</div>
                      <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.accent}}>{m.calories} kcal · P{m.protein}g · C{m.carbs}g</div>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={function(){loadTmpl(m);}} style={{padding:"6px 12px",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Load</button>
                      {delSaved===m.id?(
                        <button onClick={function(){setSaved(function(p){return p.filter(function(x){return x.id!==m.id;});});setDelSaved(null);}} style={{padding:"6px 10px",background:"rgba(127,29,29,0.4)",border:"1px solid rgba(127,29,29,0.6)",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>Sure?</button>
                      ):(
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

      {showPetPick&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:24,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>Choose Your Companion</div>
            <div style={{fontSize:13,color:T.sub,textAlign:"center",marginBottom:20}}>Your pet grows with you through 5 evolution stages. Max one out to add it to your Zoo!</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {PETS.map(function(pet){
                var pd=petData[pet.id]||{};
                var isActive=activePetId===pet.id;
                var lvl=getLvl(pd.xp||0);
                var stage=getStage(pet,lvl.level);
                return(
                  <button key={pet.id} onClick={function(){selectPet(pet.id);}} style={{background:isActive?pet.color+"22":T.card2,border:"2px solid "+(isActive?pet.color:T.border),borderRadius:14,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all .2s",display:"flex",alignItems:"center",gap:14}}>
                    <div style={{fontSize:40,flexShrink:0,width:50,textAlign:"center"}}>{stage?stage.emoji:pet.stages[0].emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15,color:isActive?pet.color:T.text,marginBottom:1}}>{pd.name||pet.name}</div>
                      <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>EVOLVES:</span>
                        {pet.stages.map(function(s,i){return(<span key={i} style={{fontSize:14}}>{s.emoji}</span>);})}
                      </div>
                      {(pd.xp||0)>0&&(
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{flex:1,height:3,background:T.border,borderRadius:99,overflow:"hidden"}}>
                            <div style={{width:Math.min((pd.xp||0)/60,100)+"%",height:"100%",background:pet.color,borderRadius:99}}/>
                          </div>
                          <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace",whiteSpace:"nowrap"}}>Lv{lvl.level}{pd.maxed?" MAXED":""}</span>
                        </div>
                      )}
                    </div>
                    {isActive&&<span style={{fontSize:10,color:pet.color,fontFamily:"'DM Mono',monospace",fontWeight:700,flexShrink:0}}>ACTIVE</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={function(){setShowPetPick(false);}} style={{width:"100%",marginTop:16,padding:"12px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Done</button>
          </div>
        </div>
      )}

      {showZoo&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:24,padding:24,width:"100%",maxWidth:440,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:4,textAlign:"center"}}>Your Pet Zoo</div>
            <div style={{fontSize:13,color:T.sub,textAlign:"center",marginBottom:20}}>{zoo.length}/{PETS.length} companions at max level</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {PETS.map(function(pet){
                var unlocked=zoo.includes(pet.id);
                var pd=petData[pet.id]||{};
                var maxStage=pet.stages[pet.stages.length-1];
                if(unlocked)return(
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
                    <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",marginTop:2}}>Not yet maxed</div>
                  </div>
                );
              })}
            </div>
            <button onClick={function(){setShowZoo(false);}} style={{width:"100%",marginTop:16,padding:"12px 0",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Close</button>
          </div>
        </div>
      )}

      {showWeightModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:20,padding:24,width:"100%",maxWidth:340}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.text,marginBottom:16}}>Log Your Weight</div>
            <input type="number" value={weightInput} onChange={function(e){setWeightInput(e.target.value);}} placeholder="Weight in lbs" style={inp({marginBottom:16,fontSize:18,padding:"14px",textAlign:"center"})}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={function(){setShowWeightModal(false);setWeightInput("");}} style={{flex:1,padding:"12px 0",background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,fontSize:13,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Cancel</button>
              <button onClick={function(){if(!weightInput)return;setWeightLog(function(w){return w.concat([{weight:parseFloat(weightInput),date:new Date().toLocaleDateString()}]);});setShowWeightModal(false);setWeightInput("");}} style={{flex:2,padding:"12px 0",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Save</button>
            </div>
          </div>
        </div>
      )}

      <header style={{padding:"12px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.accent,letterSpacing:"0.06em"}}>FUEL TRACK</span>
          <span style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>@{cu}</span>
        </div>
        <div style={{display:"flex",gap:5}}>
          <button onClick={function(){setGoalsF(Object.assign({},goals));setShowGoals(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:12,cursor:"pointer"}}>🎯</button>
          <button onClick={function(){setShowTheme(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:12,cursor:"pointer"}}>🎨</button>
          {meals.length>0&&<button onClick={function(){setConfirmNewDay(true);}} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:12,cursor:"pointer"}}>🌅</button>}
          <button onClick={doLogout} style={{background:"transparent",border:"1px solid "+T.border,color:T.sub,borderRadius:7,padding:"5px 8px",fontSize:11,cursor:"pointer",fontFamily:"'DM Mono',monospace"}}>out</button>
        </div>
      </header>

      <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 0"}}>

        {tab==="home"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"18px 20px"}}>
              <CalRing eaten={Math.round(totals.calories)} goal={goals.calories} T={T}/>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>
                <Pill label="PROTEIN" value={r1(totals.protein)} unit="g"  color="#34d399" T={T}/>
                <Pill label="CARBS"   value={r1(totals.carbs)}   unit="g"  color="#60a5fa" T={T}/>
                <Pill label="FAT"     value={r1(totals.fat)}     unit="g"  color="#fbbf24" T={T}/>
                <Pill label="FIBER"   value={r1(totals.fiber)}   unit="g"  color="#a78bfa" T={T}/>
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>MACROS</div>
              {MACROS.map(function(m){return <MBar key={m.key} label={m.label} value={r1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T}/>;  })}
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>WATER TODAY</div>
                <div style={{fontSize:12,color:T.sub,fontFamily:"'DM Mono',monospace"}}>{waterGlasses}/{goals.water} glasses</div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Array.from({length:goals.water},function(_,i){return(
                  <button key={i} onClick={function(){setWaterGlasses(function(w){return i<w?i:i+1;});}} style={{width:36,height:36,borderRadius:8,border:"1px solid "+T.border,background:i<waterGlasses?T.accent:T.card2,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
                    {i<waterGlasses?"💧":"○"}
                  </button>
                );})}
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em"}}>WEIGHT TRACKER</div>
                <button onClick={function(){setShowWeightModal(true);}} style={{padding:"5px 12px",background:T.accent,border:"none",borderRadius:6,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>+ Log</button>
              </div>
              {weightLog.length===0?(
                <div style={{fontSize:13,color:T.faint,textAlign:"center",padding:"12px 0"}}>No weight logged yet — tap + Log to start tracking</div>
              ):(
                <div>
                  <div style={{display:"flex",gap:4,alignItems:"flex-end",height:60,marginBottom:8}}>
                    {weightLog.slice(-14).map(function(entry,i,arr){
                      var weights=arr.map(function(e){return e.weight;});
                      var mn=Math.min.apply(null,weights);var mx=Math.max.apply(null,weights);
                      var range=Math.max(mx-mn,5);
                      var h=mx===mn?30:Math.round(((entry.weight-mn)/range)*50+10);
                      return(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                          <div style={{width:"100%",background:i===arr.length-1?T.accent:T.border,borderRadius:3,height:h+"px",transition:"height .5s"}}/>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:"'DM Mono',monospace",color:T.faint}}>
                    <span>{weightLog.length>=2&&weightLog[weightLog.length-2].weight+" lbs"}</span>
                    <span style={{color:T.text,fontWeight:700}}>{weightLog[weightLog.length-1].weight} lbs now</span>
                  </div>
                </div>
              )}
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"16px 18px"}}>
              {!activePetId?(
                <div style={{textAlign:"center",padding:"10px 0"}}>
                  <div style={{fontSize:40,marginBottom:10}}>🥚</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.text,marginBottom:6}}>Choose a companion!</div>
                  <div style={{fontSize:13,color:T.sub,marginBottom:16}}>Your pet grows alongside your health journey.</div>
                  <button onClick={function(){setShowPetPick(true);}} style={{padding:"12px 24px",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Meet the Pets</button>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div className="pf" style={{fontSize:52,lineHeight:1,cursor:"pointer"}} onClick={function(){setShowPetPick(true);}}>{petStage?petStage.emoji:activePet.stages[0].emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:activePet.color,marginBottom:1}}>{activePetName}</div>
                      <div style={{fontSize:11,color:activePet.color,fontFamily:"'DM Mono',monospace",marginBottom:3}}>{petStage?petStage.form:"Newborn"}</div>
                      <div style={{fontSize:12,color:T.sub,fontStyle:"italic",marginBottom:6}}>{petStage?petStage.desc:activePet.stages[0].desc}</div>
                      <div style={{height:5,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:3}}>
                        <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width .8s"}}/>
                      </div>
                      <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>
                        {(petData[activePetId]||{}).maxed?"Maxed — visit your Zoo!":petLvl.nxt?"→ "+(petLvl.nxt.xpReq-activePetXP)+" XP to next level":""}
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:10,padding:"10px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>YOUR JOURNEY</div>
                      <div style={{fontSize:11,color:T.accent,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{totalDaysLogged} days logged</div>
                    </div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      {[{i:"🍽️",v:meals.length,l:"meals today"},{i:"💧",v:waterGlasses+"/"+goals.water,l:"water"},{i:"⚡",v:activePetXP+" XP",l:"earned"}].map(function(x){return(
                        <div key={x.l} style={{display:"flex",alignItems:"center",gap:4}}>
                          <span style={{fontSize:12}}>{x.i}</span>
                          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.text}}>{x.v}</span>
                          <span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>{x.l}</span>
                        </div>
                      );})}
                    </div>
                  </div>
                  {zoo.length>0&&(
                    <button onClick={function(){setShowZoo(true);}} style={{width:"100%",marginTop:10,padding:"8px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.accent,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
                      🏆 Pet Zoo ({zoo.length}/{PETS.length} collected)
                    </button>
                  )}
                </div>
              )}
            </div>
            {avgScore!=null&&(
              <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{textAlign:"center",flexShrink:0}}>
                  <div style={{fontSize:34,lineHeight:1,marginBottom:4}}>{avgScore>=85?"🌟":avgScore>=70?"💪":avgScore>=55?"👍":"🌱"}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:avgScore>=85?"#fbbf24":avgScore>=70?"#34d399":avgScore>=55?"#60a5fa":"#94a3b8"}}>{avgScore>=85?"Amazing":avgScore>=70?"Great":avgScore>=55?"Good":"Keep Going"}</div>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:4}}>Today's nutrition quality</div>
                  <div style={{fontSize:12,color:T.sub}}>{meals.length} meal{meals.length!==1?"s":""} logged · keep it up!</div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="log"&&(
          <div style={{marginTop:8}}>
            {!meals.length?(
              <div style={{background:T.card,border:"1px dashed "+T.border,borderRadius:18,padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🌱</div>
                <div style={{color:T.text,fontSize:16,fontWeight:600,marginBottom:6}}>Ready to log your first meal?</div>
                <div style={{color:T.sub,fontSize:13,marginBottom:20}}>Every meal you log is a step forward.</div>
                <button onClick={function(){setTab("build");}} style={{padding:"12px 24px",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Log a Meal</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {meals.map(function(meal,idx){return(
                  <div key={meal.id} className="mcard" style={{background:T.card,border:"1px solid "+T.border,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{width:28,height:28,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'DM Mono',monospace",fontSize:11,color:T.faint}}>{idx+1}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                        <span style={{fontWeight:600,fontSize:14,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:T.sub,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.accent}}>{meal.calories} <span style={{fontSize:13,fontWeight:400,color:T.sub}}>kcal</span></div>
                        {meal.label&&<div style={{fontSize:13,fontWeight:700,color:meal.labelColor,background:meal.labelColor+"22",borderRadius:8,padding:"2px 8px"}}>{meal.icon} {meal.label}</div>}
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {[{l:"P",v:meal.protein,u:"g",c:"#34d399"},{l:"C",v:meal.carbs,u:"g",c:"#60a5fa"},{l:"F",v:meal.fat,u:"g",c:"#fbbf24"},{l:"Fi",v:meal.fiber,u:"g",c:"#a78bfa"}].filter(function(x){return x.v>0;}).map(function(chip){return(
                          <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:5,padding:"2px 7px",fontSize:10,fontFamily:"'DM Mono',monospace",color:chip.c}}>{chip.l} {r1(chip.v)}{chip.u}</span>
                        );})}
                      </div>
                    </div>
                    <button className="delbtn" onClick={function(){setMeals(function(p){return p.filter(function(m){return m.id!==meal.id;});});}} style={{background:"transparent",border:"1px solid "+T.border,color:T.faint,borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:14,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
                  </div>
                );})}
                <div style={{background:calOver?"rgba(251,146,60,0.1)":"rgba(52,211,153,0.08)",border:"1px solid "+(calOver?"rgba(251,146,60,0.4)":"rgba(52,211,153,0.3)"),borderRadius:14,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:10,color:calOver?"#fb923c":"#34d399",fontFamily:"'DM Mono',monospace",marginBottom:2}}>{calOver?"A little over today — that is okay!":"Today's total"}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:calOver?"#fb923c":"#34d399",lineHeight:1}}>{Math.round(totals.calories)} / {goals.calories} kcal</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11,color:T.sub,fontFamily:"'DM Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                    <div style={{fontSize:12,color:"#34d399",fontFamily:"'DM Mono',monospace",fontWeight:600}}>{r1(totals.protein)}g protein</div>
                    {avgScore!=null&&<div style={{fontSize:11,color:T.accent,fontFamily:"'DM Mono',monospace",fontWeight:600}}>{avgScore>=85?"🌟 Amazing":avgScore>=70?"💪 Great":avgScore>=55?"👍 Good":"🌱 Keep Going"}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="build"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:8}}>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"16px"}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>MEAL NAME</div>
              <input type="text" value={mealName} onChange={function(e){setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Lunch, Post-Workout..." style={inp({})}/>
            </div>
            <div style={{background:T.card,border:"2px solid "+T.accent,borderRadius:18,padding:"16px",cursor:"pointer"}} onClick={function(){setVoiceModal(true);}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:36}}>🎤</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:T.accent,marginBottom:2}}>Voice Entry</div>
                  <div style={{fontSize:12,color:T.sub}}>Say what you ate — we will figure out the rest</div>
                </div>
                <div style={{fontSize:20,color:T.accent}}>→</div>
              </div>
            </div>
            <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>OR BROWSE FOODS</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input type="text" value={searchQ} onChange={function(e){setSearchQ(e.target.value);if(!e.target.value)setSearchR([]);}} onKeyDown={function(e){if(e.key==="Enter")doSearch();}} placeholder="Search any food..." style={inp({flex:1,fontSize:13,padding:"9px 12px"})}/>
                <button onClick={doSearch} disabled={searching} style={{padding:"9px 14px",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"Search"}</button>
                {searchR.length>0&&<button onClick={function(){setSearchR([]);setSearchQ("");}} style={{padding:"9px 10px",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.sub,fontSize:12,cursor:"pointer"}}>X</button>}
              </div>
              {searchErr&&<div style={{fontSize:12,color:"#fca5a5",fontFamily:"'DM Mono',monospace",marginBottom:8}}>⚠ {searchErr}</div>}
              {!searchR.length&&(
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:10}}>
                  {QUICK_CATS.map(function(c,i){return(
                    <button key={i} onClick={function(){setCatIdx(i);}} style={{padding:"5px 12px",borderRadius:18,border:"1px solid "+(catIdx===i?T.accent:T.border),background:catIdx===i?T.accent:T.card2,color:catIdx===i?"#030712":T.sub,fontSize:10,fontWeight:600,fontFamily:"'DM Mono',monospace",flexShrink:0,cursor:"pointer",whiteSpace:"nowrap"}}>{c.emoji} {c.label}</button>
                  );})}
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {(searchR.length>0?searchR:QUICK_CATS[catIdx].items).map(function(food,i){return(
                  <div key={i} className="fc" onClick={function(){addIng(food);}} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"10px",cursor:"pointer"}}>
                    <div style={{fontSize:22,marginBottom:4,lineHeight:1}}>{food.emoji}</div>
                    <div style={{fontSize:10,fontWeight:600,color:T.text,lineHeight:1.3,marginBottom:4}}>{food.name}</div>
                    {food.brand&&<div style={{fontSize:9,color:T.faint,marginBottom:3}}>{food.brand.slice(0,20)}</div>}
                    <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.accent,fontWeight:700}}>{food.calories} kcal</div>
                    <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:T.sub}}>P{food.protein}g C{food.carbs}g F{food.fat}g</div>
                  </div>
                );})}
              </div>
            </div>
            <div onDragOver={function(e){e.preventDefault();setDragOver(true);}} onDragLeave={function(){setDragOver(false);}} onDrop={function(e){e.preventDefault();setDragOver(false);try{addIng(JSON.parse(e.dataTransfer.getData("food")));}catch(er){}}}
              style={{background:T.card,border:"2px "+(dragOver?"solid "+T.accent:"dashed "+T.border),borderRadius:18,padding:"14px 16px",minHeight:80,transition:"all .2s"}}>
              {!ings.length?(
                <div style={{textAlign:"center",padding:"12px 0"}}>
                  <div style={{fontSize:24,marginBottom:5}}>🧺</div>
                  <div style={{color:dragOver?T.accent:T.sub,fontSize:13,fontWeight:600,marginBottom:2}}>Your meal basket</div>
                  <div style={{color:T.faint,fontSize:11}}>Tap foods or use voice to add them</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:8}}>🧺 {ings.length} item{ings.length!==1?"s":""} added</div>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {ings.map(function(ing){return(
                      <div key={ing.id} style={{display:"flex",alignItems:"center",gap:8,background:T.card2,borderRadius:10,padding:"8px 10px",border:"1px solid "+T.border}}>
                        <span style={{fontSize:18,flexShrink:0}}>{ing.emoji||"🍽️"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:600,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                          <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:T.accent}}>{Math.round(sn(ing.calories)*sn(ing.servings))} kcal · P{r1(sn(ing.protein)*sn(ing.servings))}g</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
                          <button onClick={function(){updServ(ing.id,String(Math.max(0.25,sn(ing.servings)-0.25)));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:T.text,minWidth:24,textAlign:"center"}}>{ing.servings}x</span>
                          <button onClick={function(){updServ(ing.id,String(sn(ing.servings)+0.25));}} style={{width:24,height:24,borderRadius:5,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                          <button onClick={function(){removeIng(ing.id);}} style={{width:24,height:24,borderRadius:5,background:"transparent",border:"1px solid "+T.border,color:T.faint,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}>x</button>
                        </div>
                      </div>
                    );})}
                  </div>
                  <div style={{marginTop:10,padding:"10px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:3}}>
                      <span style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>Meal total</span>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:700,color:T.accent}}>{ingTots.calories} kcal</span>
                    </div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[["P",ingTots.protein,"g","#34d399"],["C",ingTots.carbs,"g","#60a5fa"],["F",ingTots.fat,"g","#fbbf24"],["Fi",ingTots.fiber,"g","#a78bfa"]].map(function(x){return(<span key={x[0]} style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:x[3]}}>{x[0]} {x[1]}{x[2]}</span>);})}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {mealErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center",padding:"8px",background:"rgba(127,29,29,0.2)",borderRadius:8}}>⚠ {mealErr}</div>}
            <div style={{display:"flex",gap:8}}>
              <button onClick={saveMealTmpl} disabled={!mealName.trim()||!ings.length} style={{flex:1,padding:"13px 0",background:"transparent",border:"1px solid "+T.accent,borderRadius:12,color:T.accent,fontSize:12,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>Save</button>
              <button onClick={logMeal} disabled={!mealName.trim()||!ings.length} style={{flex:2,padding:"13px 0",background:T.accent,border:"none",borderRadius:12,color:"#030712",fontSize:13,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer",opacity:(!mealName.trim()||!ings.length)?0.4:1}}>
                Log it! {ings.length>0&&"· "+ingTots.calories+" kcal"}
              </button>
            </div>
            <button onClick={function(){setShowSaved(true);}} style={{padding:"10px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:12,color:T.sub,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
              Saved Meals {saved.length>0&&"("+saved.length+")"}
            </button>
          </div>
        )}

        {tab==="pet"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:8}}>
            {!activePetId?(
              <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"40px 20px",textAlign:"center"}}>
                <div style={{fontSize:60,marginBottom:16}}>🥚</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:T.text,marginBottom:8}}>Meet your companion!</div>
                <div style={{fontSize:13,color:T.sub,marginBottom:20,lineHeight:1.6}}>Choose a pet that will grow alongside your health journey. Every meal logged, every goal hit — your companion evolves.</div>
                <button onClick={function(){setShowPetPick(true);}} style={{padding:"14px 32px",background:T.accent,border:"none",borderRadius:12,color:"#030712",fontSize:14,fontWeight:700,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Choose Your Companion</button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"24px 20px",textAlign:"center"}}>
                  <div className="pf" style={{fontSize:90,lineHeight:1,marginBottom:10}}>{petStage?petStage.emoji:activePet.stages[0].emoji}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:activePet.color,marginBottom:2}}>{activePetName}</div>
                  <div style={{fontSize:14,fontWeight:600,color:activePet.color,opacity:0.8,marginBottom:4}}>{petStage?petStage.form:"Newborn"}</div>
                  <div style={{fontSize:13,color:T.sub,marginBottom:16,lineHeight:1.5,fontStyle:"italic"}}>{petStage?petStage.desc:activePet.stages[0].desc}</div>
                  <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px",marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:T.text}}>Level {petLvl.level} — {petLvl.name}</span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:T.sub}}>{activePetXP} XP</span>
                    </div>
                    <div style={{height:7,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:5}}>
                      <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width 1s"}}/>
                    </div>
                    <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>
                      {(petData[activePetId]||{}).maxed?"Maxed out — check your Zoo!":petLvl.nxt?"→ "+(petLvl.nxt.xpReq-activePetXP)+" XP to next level":""}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={function(){setShowPetPick(true);}} style={{flex:1,padding:"10px 0",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.sub,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Switch Pet</button>
                    <button onClick={function(){setShowZoo(true);}} style={{flex:1,padding:"10px 0",background:T.card2,border:"1px solid "+T.border,borderRadius:8,color:T.accent,fontSize:12,fontWeight:600,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>Zoo ({zoo.length})</button>
                  </div>
                </div>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"18px 20px"}}>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:14}}>EVOLUTION PATH</div>
                  {activePet.stages.map(function(stage,i){
                    var unlocked=petLvl.level>=stage.level;
                    var isCur=petLvl.level>=stage.level&&(i===activePet.stages.length-1||petLvl.level<activePet.stages[i+1].level);
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<activePet.stages.length-1?"1px solid "+T.border:"none",opacity:unlocked?1:0.35}}>
                        <div style={{fontSize:32,flexShrink:0,width:42,textAlign:"center"}}>{stage.emoji}</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                            <span style={{fontSize:13,fontWeight:700,color:isCur?activePet.color:unlocked?T.text:T.faint}}>{stage.form}</span>
                            {isCur&&<span style={{fontSize:9,background:activePet.color,color:"#030712",borderRadius:4,padding:"1px 6px",fontFamily:"'DM Mono',monospace",fontWeight:700}}>YOU ARE HERE</span>}
                            {!unlocked&&<span style={{fontSize:9,color:T.faint,fontFamily:"'DM Mono',monospace"}}>Level {stage.level} required</span>}
                          </div>
                          <div style={{fontSize:11,color:T.faint,fontStyle:"italic"}}>{stage.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{background:T.card,border:"1px solid "+T.border,borderRadius:18,padding:"18px 20px"}}>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:12}}>YOUR JOURNEY</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                    {[{label:"Days Logged",value:totalDaysLogged,icon:"📅"},{label:"Total XP",value:activePetXP,icon:"⚡"},{label:"Meals Today",value:meals.length,icon:"🍽️"},{label:"Water Today",value:waterGlasses+"/"+goals.water,icon:"💧"}].map(function(s){return(
                      <div key={s.label} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:10,padding:"12px",textAlign:"center"}}>
                        <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:T.accent,lineHeight:1,marginBottom:2}}>{s.value}</div>
                        <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace"}}>{s.label}</div>
                      </div>
                    );})}
                  </div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'DM Mono',monospace",letterSpacing:"0.1em",marginBottom:10}}>XP GUIDE</div>
                  {[["🍽️","Log any meal","+10 XP"],["💧","Hit your water goal","+10 XP"],["🔥","Hit calorie goal","+15 XP"],["💪","Hit protein goal","+20 XP"],["🍽️x3","Log 3+ meals in a day","+10 XP"],["🌟","Amazing quality meal","+15 XP"],["💪","Great quality meal","+8 XP"]].map(function(x){return(
                    <div key={x[1]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid "+T.border}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13}}>{x[0]}</span><span style={{fontSize:12,color:T.sub}}>{x[1]}</span></div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#fbbf24",fontWeight:700}}>{x[2]}</span>
                    </div>
                  );})}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:T.bg,borderTop:"1px solid "+T.border,display:"flex",zIndex:60,maxWidth:520,margin:"0 auto"}}>
        {[
          {id:"home",  icon:"🏠",  label:"HOME", big:false},
          {id:"log",   icon:"📋",  label:"LOG",  big:false},
          {id:"build", icon:"+",   label:"LOG MEAL", big:true},
          {id:"pet",   icon:activePetId&&petStage?petStage.emoji:"🐾", label:"PET", big:false},
        ].map(function(nav){
          if(nav.big)return(
            <button key={nav.id} style={{flex:1,padding:"6px 0",border:"none",cursor:"pointer",background:"transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:2}} onClick={function(){setTab(nav.id);}}>
              <div style={{width:46,height:46,borderRadius:14,background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#030712",boxShadow:"0 4px 16px "+T.accent+"44",transform:tab===nav.id?"scale(0.95)":"scale(1)",transition:"transform .2s"}}>{nav.icon}</div>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:8,fontWeight:600,color:tab===nav.id?T.accent:T.faint,letterSpacing:"0.04em"}}>LOG MEAL</span>
            </button>
          );
          return(
            <button key={nav.id} style={navSt(tab===nav.id)} onClick={function(){setTab(nav.id);}}>
              <span style={{fontSize:17}}>{nav.icon}</span>
              <span>{nav.label}</span>
              {nav.id==="log"&&meals.length>0&&<span style={{position:"absolute",top:6,background:T.accent,color:"#030712",borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 5px",fontFamily:"'DM Mono',monospace"}}>{meals.length}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
