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
  { id:"rose",     label:"Rose",      bg:"#fff1f2", card:"#ffffff", card2:"#ffe4e6", border:"#fecdd3", text:"#3b0014", sub:"#9f1239", faint:"#e11d48", accent:"#f43f5e" },
  { id:"ocean",    label:"Ocean",     bg:"#003554", card:"#004e7c", card2:"#006494", border:"#0582ca", text:"#e0f4ff", sub:"#90cbf0", faint:"#2070a0", accent:"#00b4d8" },
  { id:"emerald",  label:"Emerald",   bg:"#064e3b", card:"#065f46", card2:"#047857", border:"#059669", text:"#d1fae5", sub:"#6ee7b7", faint:"#2d6a4f", accent:"#34d399" },
  { id:"slate",    label:"Slate",     bg:"#0f172a", card:"#1e293b", card2:"#334155", border:"#475569", text:"#f1f5f9", sub:"#94a3b8", faint:"#64748b", accent:"#38bdf8" },
  { id:"dusk",     label:"Dusk",      bg:"#1a0a2e", card:"#2a1040", card2:"#341450", border:"#6030a0", text:"#f0e0ff", sub:"#c090e0", faint:"#7040b0", accent:"#e040fb" },
  { id:"golden",   label:"Golden",    bg:"#1a1200", card:"#2a1e00", card2:"#3a2c00", border:"#7a5a00", text:"#fff7d6", sub:"#d4aa40", faint:"#6a4800", accent:"#fbbf24" },
];

function NovusStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="nv1a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><circle cx="50" cy="52" r="26" fill="url(#nv1a)"/><circle cx="50" cy="52" r="26" fill="none" stroke="#6d28d9" strokeWidth="1" opacity="0.5"/><circle cx="43" cy="46" r="3" fill="#a78bfa" opacity="0.7"/><circle cx="57" cy="46" r="3" fill="#a78bfa" opacity="0.7"/><ellipse cx="50" cy="58" rx="8" ry="3" fill="#7c3aed" opacity="0.3"/></svg>);}
function NovusStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="nv2a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#5b21b6"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><circle cx="50" cy="52" r="26" fill="url(#nv2a)"/><circle cx="43" cy="46" r="3.5" fill="#c4b5fd" opacity="0.9"/><circle cx="57" cy="46" r="3.5" fill="#c4b5fd" opacity="0.9"/><path d="M30 52 Q20 44 24 36 Q30 46 50 48 Q70 46 76 36 Q80 44 70 52" fill="#4c1d95" opacity="0.6"/><ellipse cx="50" cy="60" rx="6" ry="2" fill="#7c3aed" opacity="0.4"/><circle cx="50" cy="38" r="2" fill="#ddd6fe" opacity="0.5"/></svg>);}
function NovusStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="nv3a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#1e1035"/></radialGradient></defs><path d="M50 52 Q20 30 10 48 Q16 62 50 58 Q84 62 90 48 Q80 30 50 52Z" fill="#3b0764" opacity="0.8"/><circle cx="50" cy="50" r="18" fill="url(#nv3a)"/><circle cx="43" cy="45" r="4" fill="#ddd6fe"/><circle cx="57" cy="45" r="4" fill="#ddd6fe"/><path d="M42 55 Q50 60 58 55" stroke="#a78bfa" strokeWidth="1.5" fill="none"/><circle cx="30" cy="40" r="2" fill="#7c3aed" opacity="0.6"/><circle cx="70" cy="40" r="2" fill="#7c3aed" opacity="0.6"/><line x1="50" y1="32" x2="46" y2="26" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/><line x1="50" y1="32" x2="54" y2="26" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/></svg>);}
function NovusStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="nv4a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="60%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0014"/></radialGradient><radialGradient id="nv4b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ede9fe"/><stop offset="100%" stopColor="#7c3aed"/></radialGradient></defs><path d="M50 50 Q10 18 4 44 Q10 72 50 68 Q90 72 96 44 Q90 18 50 50Z" fill="#2e1065" opacity="0.9"/><path d="M50 50 Q22 30 18 50 Q22 64 50 62 Q78 64 82 50 Q78 30 50 50Z" fill="#4c1d95" opacity="0.7"/><circle cx="50" cy="50" r="16" fill="url(#nv4a)"/><circle cx="50" cy="50" r="7" fill="url(#nv4b)"/><circle cx="43" cy="45" r="4.5" fill="white" opacity="0.9"/><circle cx="57" cy="45" r="4.5" fill="white" opacity="0.9"/><circle cx="44" cy="45" r="2" fill="#4c1d95"/><circle cx="58" cy="45" r="2" fill="#4c1d95"/><circle cx="20" cy="36" r="1.5" fill="#a78bfa" opacity="0.8"/><circle cx="80" cy="36" r="1.5" fill="#a78bfa" opacity="0.8"/></svg>);}
function NovusStage5(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="nv5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ede9fe"/><stop offset="40%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#0a0014"/></radialGradient><radialGradient id="nv5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="#a78bfa"/></radialGradient></defs><path d="M50 48 Q4 8 2 44 Q6 76 50 72 Q94 76 98 44 Q96 8 50 48Z" fill="#1e1b4b" opacity="0.95"/><path d="M50 48 Q16 20 12 46 Q16 68 50 65 Q84 68 88 46 Q84 20 50 48Z" fill="#3730a3" opacity="0.7"/><path d="M50 48 Q28 28 26 48 Q28 62 50 60 Q72 62 74 48 Q72 28 50 48Z" fill="#4f46e5" opacity="0.6"/><circle cx="50" cy="48" r="14" fill="url(#nv5a)"/><circle cx="50" cy="48" r="6" fill="url(#nv5b)"/><circle cx="43" cy="43" r="5" fill="white"/><circle cx="57" cy="43" r="5" fill="white"/><circle cx="44" cy="43" r="2.5" fill="#3730a3"/><circle cx="58" cy="43" r="2.5" fill="#3730a3"/><circle cx="44.5" cy="42" r="1" fill="white"/><circle cx="58.5" cy="42" r="1" fill="white"/><circle cx="10" cy="30" r="0.8" fill="#a78bfa" opacity="0.7"/><circle cx="86" cy="26" r="0.8" fill="#a78bfa" opacity="0.7"/><circle cx="6" cy="46" r="0.8" fill="#c4b5fd" opacity="0.6"/><circle cx="94" cy="44" r="0.8" fill="#c4b5fd" opacity="0.6"/></svg>);}
function KhaosStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><circle cx="50" cy="50" r="24" fill="#0c1a2e" stroke="#1e3a5f" strokeWidth="1"/><circle cx="50" cy="50" r="4" fill="#38bdf8" opacity="0.8"/><line x1="50" y1="28" x2="50" y2="34" stroke="#38bdf8" strokeWidth="1" opacity="0.3"/><line x1="50" y1="66" x2="50" y2="72" stroke="#38bdf8" strokeWidth="1" opacity="0.3"/><line x1="28" y1="50" x2="34" y2="50" stroke="#38bdf8" strokeWidth="1" opacity="0.3"/><line x1="66" y1="50" x2="72" y2="50" stroke="#38bdf8" strokeWidth="1" opacity="0.3"/></svg>);}
function KhaosStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="kh2a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#075985"/><stop offset="100%" stopColor="#0c1a2e"/></radialGradient></defs><circle cx="50" cy="50" r="28" fill="url(#kh2a)"/><circle cx="50" cy="50" r="7" fill="#0ea5e9" opacity="0.9"/><path d="M50 22 L46 34 L50 32 L54 34Z" fill="#7dd3fc" opacity="0.8"/><path d="M50 78 L46 66 L50 68 L54 66Z" fill="#7dd3fc" opacity="0.8"/><path d="M22 50 L34 46 L32 50 L34 54Z" fill="#7dd3fc" opacity="0.8"/><path d="M78 50 L66 46 L68 50 L66 54Z" fill="#7dd3fc" opacity="0.8"/></svg>);}
function KhaosStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="kh3a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0369a1"/><stop offset="100%" stopColor="#082f49"/></radialGradient></defs><path d="M50 18 Q72 18 78 36 Q90 46 82 62 Q78 78 60 80 Q50 86 40 80 Q22 78 18 62 Q10 46 22 36 Q28 18 50 18Z" fill="url(#kh3a)"/><path d="M50 28 Q64 30 68 44 Q74 54 66 64 Q60 72 50 73 Q40 72 34 64 Q26 54 32 44 Q36 30 50 28Z" fill="#075985" opacity="0.8"/><circle cx="50" cy="50" r="11" fill="#0ea5e9" opacity="0.9"/><circle cx="50" cy="50" r="6" fill="#bae6fd"/><path d="M50 20 L47 30 L50 28 L53 30Z" fill="#38bdf8"/><path d="M50 80 L47 70 L50 72 L53 70Z" fill="#38bdf8"/><path d="M20 50 L30 47 L28 50 L30 53Z" fill="#38bdf8"/><path d="M80 50 L70 47 L72 50 L70 53Z" fill="#38bdf8"/></svg>);}
function KhaosStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="kh4a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0284c7"/><stop offset="60%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs><ellipse cx="50" cy="50" rx="44" ry="38" fill="url(#kh4a)"/><path d="M50 16 Q80 26 82 50 Q80 74 50 84 Q20 74 18 50 Q20 26 50 16Z" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.5"/><path d="M50 24 Q72 32 74 50 Q72 68 50 76 Q28 68 26 50 Q28 32 50 24Z" fill="none" stroke="#38bdf8" strokeWidth="0.7" opacity="0.7"/><circle cx="50" cy="50" r="16" fill="#0369a1" opacity="0.9"/><circle cx="50" cy="50" r="9" fill="#0ea5e9"/><circle cx="50" cy="50" r="5" fill="#e0f2fe"/><path d="M50 16 L47 22 L50 20 L53 22Z" fill="#7dd3fc"/><path d="M84 50 L78 47 L80 50 L78 53Z" fill="#7dd3fc"/><path d="M50 84 L47 78 L50 80 L53 78Z" fill="#7dd3fc"/><path d="M16 50 L22 47 L20 50 L22 53Z" fill="#7dd3fc"/></svg>);}
function KhaosStage5(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="kh5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#155e75"/><stop offset="50%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#020617"/></radialGradient><radialGradient id="kh5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><path d="M50 10 Q90 20 92 50 Q90 80 50 92 Q10 80 8 50 Q10 20 50 10Z" fill="url(#kh5a)"/><path d="M50 18 Q82 27 84 50 Q82 74 50 82 Q18 74 16 50 Q18 27 50 18Z" fill="none" stroke="#0ea5e9" strokeWidth="0.7" opacity="0.6"/><path d="M50 26 Q74 34 76 50 Q74 67 50 74 Q26 67 24 50 Q26 34 50 26Z" fill="none" stroke="#38bdf8" strokeWidth="0.7" opacity="0.7"/><path d="M50 34 Q66 40 68 50 Q66 60 50 66 Q34 60 32 50 Q34 40 50 34Z" fill="none" stroke="#7dd3fc" strokeWidth="0.7" opacity="0.8"/><circle cx="50" cy="50" r="14" fill="#0369a1"/><circle cx="50" cy="50" r="8" fill="url(#kh5b)"/><circle cx="50" cy="50" r="3" fill="#020617"/><path d="M50 10 L46 16 L50 14 L54 16Z" fill="#38bdf8"/><path d="M92 50 L86 46 L88 50 L86 54Z" fill="#38bdf8"/><path d="M50 92 L46 86 L50 88 L54 86Z" fill="#38bdf8"/><path d="M8 50 L14 46 L12 50 L14 54Z" fill="#38bdf8"/><path d="M84 26 L79 33 L82 27 L77 32Z" fill="#7dd3fc" opacity="0.8"/><path d="M16 26 L21 33 L18 27 L23 32Z" fill="#7dd3fc" opacity="0.8"/></svg>);}
function YokaiStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="35" y="38" width="30" height="24" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1"/><rect x="42" y="44" width="16" height="12" rx="1" fill="#022c22" stroke="#10b981" strokeWidth="0.5"/><rect x="47" y="47" width="6" height="6" rx="0.5" fill="#34d399" opacity="0.9"/><rect x="36" y="64" width="4" height="8" fill="#064e3b" stroke="#34d399" strokeWidth="0.5"/><rect x="60" y="64" width="4" height="8" fill="#064e3b" stroke="#34d399" strokeWidth="0.5"/></svg>);}
function YokaiStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="28" y="28" width="44" height="44" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1.2"/><rect x="28" y="28" width="44" height="8" rx="2" fill="#065f46" opacity="0.8"/><rect x="34" y="40" width="14" height="10" rx="1" fill="#022c22" stroke="#10b981" strokeWidth="0.7"/><rect x="52" y="40" width="14" height="10" rx="1" fill="#022c22" stroke="#10b981" strokeWidth="0.7"/><rect x="38" y="43" width="6" height="4" rx="0.5" fill="#34d399"/><rect x="56" y="43" width="6" height="4" rx="0.5" fill="#34d399"/><rect x="36" y="56" width="28" height="4" rx="1" fill="#065f46"/><rect x="40" y="57" width="4" height="2" fill="#34d399" opacity="0.8"/><rect x="47" y="57" width="4" height="2" fill="#34d399" opacity="0.8"/><rect x="54" y="57" width="4" height="2" fill="#34d399" opacity="0.8"/><rect x="30" y="72" width="6" height="10" fill="#064e3b" stroke="#34d399" strokeWidth="0.7"/><rect x="64" y="72" width="6" height="10" fill="#064e3b" stroke="#34d399" strokeWidth="0.7"/></svg>);}
function YokaiStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="22" y="22" width="56" height="56" rx="6" fill="#064e3b" stroke="#34d399" strokeWidth="1.5"/><rect x="22" y="22" width="56" height="10" rx="4" fill="#065f46"/><circle cx="34" cy="27" r="2" fill="#34d399" opacity="0.7"/><circle cx="40" cy="27" r="2" fill="#fbbf24" opacity="0.7"/><circle cx="46" cy="27" r="2" fill="#ef4444" opacity="0.7"/><rect x="28" y="38" width="18" height="14" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1"/><rect x="54" y="38" width="18" height="14" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1"/><rect x="33" y="42" width="8" height="6" rx="1" fill="#34d399" opacity="0.9"/><rect x="59" y="42" width="8" height="6" rx="1" fill="#34d399" opacity="0.9"/><rect x="28" y="58" width="44" height="6" rx="2" fill="#065f46"/><rect x="32" y="59" width="4" height="4" fill="#34d399" opacity="0.8"/><rect x="40" y="59" width="4" height="4" fill="#34d399" opacity="0.8"/><rect x="48" y="59" width="4" height="4" fill="#34d399" opacity="0.4"/><rect x="56" y="59" width="4" height="4" fill="#34d399" opacity="0.8"/><rect x="64" y="59" width="4" height="4" fill="#34d399" opacity="0.8"/><rect x="24" y="78" width="8" height="12" fill="#064e3b" stroke="#34d399" strokeWidth="0.8"/><rect x="68" y="78" width="8" height="12" fill="#064e3b" stroke="#34d399" strokeWidth="0.8"/></svg>);}
function YokaiStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><linearGradient id="yk4a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#064e3b"/><stop offset="100%" stopColor="#022c22"/></linearGradient></defs><rect x="16" y="16" width="68" height="68" rx="8" fill="url(#yk4a)" stroke="#34d399" strokeWidth="1.5"/><rect x="16" y="16" width="68" height="12" rx="6" fill="#065f46"/><circle cx="24" cy="22" r="1.5" fill="#34d399" opacity="0.9"/><circle cx="30" cy="22" r="1.5" fill="#10b981" opacity="0.9"/><circle cx="36" cy="22" r="1.5" fill="#064e3b" opacity="0.9"/><rect x="22" y="34" width="24" height="18" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.2"/><rect x="54" y="34" width="24" height="18" rx="3" fill="#022c22" stroke="#34d399" strokeWidth="1.2"/><rect x="28" y="38" width="12" height="10" rx="1" fill="#34d399" opacity="0.95"/><rect x="60" y="38" width="12" height="10" rx="1" fill="#34d399" opacity="0.95"/><rect x="31" y="40" width="4" height="4" fill="#022c22"/><rect x="63" y="40" width="4" height="4" fill="#022c22"/><rect x="22" y="58" width="56" height="8" rx="2" fill="#065f46"/><rect x="26" y="60" width="2" height="4" fill="#34d399" opacity="0.9"/><rect x="30" y="60" width="2" height="4" fill="#34d399" opacity="0.3"/><rect x="34" y="60" width="2" height="4" fill="#34d399" opacity="0.8"/><rect x="38" y="60" width="2" height="4" fill="#34d399" opacity="1"/><rect x="42" y="60" width="2" height="4" fill="#34d399" opacity="0.4"/><rect x="46" y="60" width="2" height="4" fill="#34d399" opacity="0.8"/><rect x="50" y="60" width="2" height="4" fill="#34d399" opacity="0.2"/><rect x="54" y="60" width="2" height="4" fill="#34d399" opacity="0.9"/><rect x="58" y="60" width="2" height="4" fill="#34d399" opacity="0.6"/><rect x="62" y="60" width="2" height="4" fill="#34d399" opacity="1"/><rect x="66" y="60" width="2" height="4" fill="#34d399" opacity="0.3"/><rect x="70" y="60" width="2" height="4" fill="#34d399" opacity="0.8"/><rect x="20" y="80" width="12" height="16" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1"/><rect x="68" y="80" width="12" height="16" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1"/></svg>);}
function YokaiStage5(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><linearGradient id="yk5a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#022c22"/><stop offset="50%" stopColor="#064e3b"/><stop offset="100%" stopColor="#022c22"/></linearGradient></defs><rect x="10" y="10" width="80" height="80" rx="10" fill="url(#yk5a)" stroke="#34d399" strokeWidth="2"/><rect x="10" y="10" width="80" height="14" rx="8" fill="#065f46"/><text x="50" y="22" textAnchor="middle" fill="#34d399" fontSize="6" fontFamily="monospace" opacity="0.9">SYS::ONLINE</text><rect x="16" y="30" width="30" height="22" rx="3" fill="#011a13" stroke="#34d399" strokeWidth="1.2"/><rect x="54" y="30" width="30" height="22" rx="3" fill="#011a13" stroke="#34d399" strokeWidth="1.2"/><rect x="22" y="35" width="18" height="12" rx="1" fill="#34d399" opacity="0.95"/><rect x="60" y="35" width="18" height="12" rx="1" fill="#34d399" opacity="0.95"/><rect x="27" y="38" width="6" height="6" fill="#011a13"/><rect x="65" y="38" width="6" height="6" fill="#011a13"/><rect x="16" y="56" width="68" height="10" rx="2" fill="#065f46"/><rect x="20" y="58" width="2" height="6" fill="#34d399" opacity="0.9"/><rect x="24" y="58" width="2" height="6" fill="#34d399" opacity="0.3"/><rect x="28" y="58" width="2" height="6" fill="#34d399" opacity="0.7"/><rect x="32" y="58" width="2" height="6" fill="#34d399" opacity="1"/><rect x="36" y="58" width="2" height="6" fill="#34d399" opacity="0.4"/><rect x="40" y="58" width="2" height="6" fill="#34d399" opacity="0.8"/><rect x="44" y="58" width="2" height="6" fill="#34d399" opacity="0.2"/><rect x="48" y="58" width="2" height="6" fill="#34d399" opacity="0.9"/><rect x="52" y="58" width="2" height="6" fill="#34d399" opacity="0.6"/><rect x="56" y="58" width="2" height="6" fill="#34d399" opacity="1"/><rect x="60" y="58" width="2" height="6" fill="#34d399" opacity="0.3"/><rect x="64" y="58" width="2" height="6" fill="#34d399" opacity="0.8"/><rect x="68" y="58" width="2" height="6" fill="#34d399" opacity="0.5"/><rect x="72" y="58" width="2" height="6" fill="#34d399" opacity="0.9"/><rect x="16" y="68" width="68" height="4" rx="1" fill="#011a13" stroke="#10b981" strokeWidth="0.5"/><text x="50" y="76" textAnchor="middle" fill="#34d399" fontSize="5" fontFamily="monospace" opacity="0.7">YKÄI::v7.final</text><rect x="14" y="82" width="16" height="18" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="1.2"/><rect x="70" y="82" width="16" height="18" rx="3" fill="#064e3b" stroke="#34d399" strokeWidth="1.2"/></svg>);}
function VerdantStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><line x1="50" y1="80" x2="50" y2="55" stroke="#78350f" strokeWidth="3" strokeLinecap="round"/><path d="M50 55 Q42 46 44 38 Q50 42 50 55Z" fill="#16a34a"/><path d="M50 55 Q58 46 56 38 Q50 42 50 55Z" fill="#15803d"/><path d="M50 48 Q43 40 46 32 Q50 38 50 48Z" fill="#22c55e" opacity="0.8"/><circle cx="50" cy="82" r="4" fill="#92400e" opacity="0.6"/></svg>);}
function VerdantStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><ellipse cx="50" cy="84" rx="14" ry="5" fill="#78350f" opacity="0.5"/><line x1="50" y1="80" x2="50" y2="50" stroke="#92400e" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="66" x2="36" y2="58" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/><line x1="50" y1="60" x2="64" y2="52" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"/><path d="M36 58 Q26 50 30 40 Q36 48 44 52 Q36 58 36 58Z" fill="#16a34a"/><path d="M64 52 Q74 44 70 34 Q64 42 56 46 Q64 52 64 52Z" fill="#15803d"/><path d="M50 50 Q40 40 44 28 Q50 38 56 28 Q60 40 50 50Z" fill="#22c55e"/><path d="M50 42 Q44 34 48 24 Q52 34 50 42Z" fill="#4ade80" opacity="0.8"/></svg>);}
function VerdantStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><ellipse cx="50" cy="88" rx="22" ry="6" fill="#78350f" opacity="0.4"/><rect x="46" y="56" width="8" height="32" rx="3" fill="#92400e"/><line x1="50" y1="68" x2="28" y2="58" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="62" x2="72" y2="52" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="74" x2="32" y2="76" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/><line x1="50" y1="74" x2="68" y2="76" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/><path d="M28 58 Q10 48 16 32 Q26 44 38 50 Q28 58 28 58Z" fill="#16a34a"/><path d="M72 52 Q90 42 84 26 Q74 38 62 44 Q72 52 72 52Z" fill="#15803d"/><path d="M32 76 Q18 68 22 56 Q30 62 38 66 Q32 76 32 76Z" fill="#22c55e" opacity="0.9"/><path d="M68 76 Q82 68 78 56 Q70 62 62 66 Q68 76 68 76Z" fill="#22c55e" opacity="0.9"/><path d="M50 56 Q36 44 42 26 Q50 38 58 26 Q64 44 50 56Z" fill="#4ade80"/><circle cx="50" cy="30" r="5" fill="#86efac" opacity="0.9"/></svg>);}
function VerdantStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><ellipse cx="50" cy="92" rx="30" ry="7" fill="#78350f" opacity="0.3"/><rect x="46" y="52" width="8" height="40" rx="3" fill="#92400e"/><line x1="50" y1="64" x2="20" y2="52" stroke="#a16207" strokeWidth="3.5" strokeLinecap="round"/><line x1="50" y1="58" x2="80" y2="46" stroke="#a16207" strokeWidth="3.5" strokeLinecap="round"/><line x1="50" y1="72" x2="22" y2="72" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round"/><line x1="50" y1="72" x2="78" y2="72" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round"/><path d="M20 52 Q2 38 10 18 Q22 36 36 46 Q20 52 20 52Z" fill="#15803d"/><path d="M80 46 Q98 32 90 12 Q78 30 64 40 Q80 46 80 46Z" fill="#16a34a"/><path d="M22 72 Q6 62 12 48 Q22 58 34 64 Q22 72 22 72Z" fill="#22c55e"/><path d="M78 72 Q94 62 88 48 Q78 58 66 64 Q78 72 78 72Z" fill="#22c55e"/><path d="M50 52 Q32 38 40 14 Q50 34 60 14 Q68 38 50 52Z" fill="#4ade80"/><circle cx="50" cy="22" r="7" fill="#86efac"/><circle cx="50" cy="22" r="3" fill="white" opacity="0.5"/></svg>);}
function VerdantStage5(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="46" y="48" width="8" height="46" rx="3" fill="#92400e"/><line x1="50" y1="62" x2="14" y2="48" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="56" x2="86" y2="42" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/><line x1="50" y1="70" x2="16" y2="70" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="70" x2="84" y2="70" stroke="#a16207" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="78" x2="24" y2="84" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/><line x1="50" y1="78" x2="76" y2="84" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/><path d="M14 48 Q-8 30 2 6 Q16 28 34 42 Q14 48 14 48Z" fill="#14532d"/><path d="M86 42 Q108 24 98 0 Q84 22 66 36 Q86 42 86 42Z" fill="#166534"/><path d="M16 70 Q-4 56 4 40 Q16 54 32 62 Q16 70 16 70Z" fill="#15803d"/><path d="M84 70 Q104 56 96 40 Q84 54 68 62 Q84 70 84 70Z" fill="#15803d"/><path d="M24 84 Q8 74 14 60 Q26 70 38 76 Q24 84 24 84Z" fill="#16a34a"/><path d="M76 84 Q92 74 86 60 Q74 70 62 76 Q76 84 76 84Z" fill="#16a34a"/><path d="M50 48 Q26 30 36 4 Q50 26 64 4 Q74 30 50 48Z" fill="#22c55e"/><circle cx="50" cy="14" r="9" fill="#4ade80"/><circle cx="50" cy="14" r="5" fill="#86efac"/><circle cx="50" cy="14" r="2" fill="white" opacity="0.8"/><circle cx="14" cy="26" r="3" fill="#4ade80" opacity="0.8"/><circle cx="86" cy="20" r="3" fill="#4ade80" opacity="0.8"/><circle cx="8" cy="50" r="3" fill="#4ade80" opacity="0.8"/><circle cx="92" cy="44" r="3" fill="#4ade80" opacity="0.8"/></svg>);}
function AbyssusStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ab1a" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs><path d="M50 30 Q62 46 62 56 Q62 68 50 72 Q38 68 38 56 Q38 46 50 30Z" fill="url(#ab1a)"/><circle cx="44" cy="54" r="3" fill="#0ea5e9" opacity="0.6"/><circle cx="56" cy="54" r="3" fill="#0ea5e9" opacity="0.6"/></svg>);}
function AbyssusStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ab2a" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#075985"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs><path d="M50 22 Q70 42 70 58 Q70 76 50 80 Q30 76 30 58 Q30 42 50 22Z" fill="url(#ab2a)"/><path d="M30 58 Q18 54 16 64 Q22 70 32 66 Q30 58 30 58Z" fill="#0c4a6e" opacity="0.9"/><path d="M70 58 Q82 54 84 64 Q78 70 68 66 Q70 58 70 58Z" fill="#0c4a6e" opacity="0.9"/><path d="M38 78 Q34 88 40 92 Q44 86 42 80 Q38 78 38 78Z" fill="#0c4a6e" opacity="0.8"/><path d="M62 78 Q66 88 60 92 Q56 86 58 80 Q62 78 62 78Z" fill="#0c4a6e" opacity="0.8"/><ellipse cx="42" cy="52" rx="5" ry="5" fill="#0284c7" opacity="0.7"/><ellipse cx="58" cy="52" rx="5" ry="5" fill="#0284c7" opacity="0.7"/><ellipse cx="42" cy="52" rx="2.5" ry="2.5" fill="#bae6fd"/><ellipse cx="58" cy="52" rx="2.5" ry="2.5" fill="#bae6fd"/></svg>);}
function AbyssusStage3(p){var sz=p.size||80;var pairs=[[-1,0],[1,0],[0,-1],[0,1],[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ab3a" cx="50%" cy="45%" r="55%"><stop offset="0%" stopColor="#0369a1"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs><ellipse cx="50" cy="52" rx="28" ry="32" fill="url(#ab3a)"/>{pairs.map(function(d,i){var angle=i*45*Math.PI/180;var len=20+i%2*8;var x2=50+Math.cos(angle)*len;var y2=52+Math.sin(angle)*len;var cx1=50+Math.cos(angle)*8;var cy1=52+Math.sin(angle)*8;return <path key={i} d={"M50 52 Q"+cx1+" "+cy1+" "+x2+" "+y2} stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>;})}<ellipse cx="40" cy="46" rx="6" ry="7" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.8"/><ellipse cx="60" cy="46" rx="6" ry="7" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="0.8"/><ellipse cx="40" cy="46" rx="3" ry="3.5" fill="#38bdf8"/><ellipse cx="60" cy="46" rx="3" ry="3.5" fill="#38bdf8"/><path d="M38 60 Q50 66 62 60" stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.7"/></svg>);}
function AbyssusStage4(p){var sz=p.size||80;var t=Array.from({length:10},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ab4a" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#020617"/></radialGradient></defs><ellipse cx="50" cy="50" rx="32" ry="36" fill="url(#ab4a)"/>{t.map(function(i){var angle=i*36*Math.PI/180;var len=26+i%3*6;var curveX=50+Math.cos(angle-0.3)*16;var curveY=50+Math.sin(angle-0.3)*16;var endX=50+Math.cos(angle)*len;var endY=50+Math.sin(angle)*len;return <path key={i} d={"M50 50 Q"+curveX+" "+curveY+" "+endX+" "+endY} stroke="#0284c7" strokeWidth={i%2===0?2.5:2} fill="none" strokeLinecap="round" opacity="0.85"/>;})}<ellipse cx="40" cy="44" rx="8" ry="9" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="1"/><ellipse cx="60" cy="44" rx="8" ry="9" fill="#0c4a6e" stroke="#0ea5e9" strokeWidth="1"/><ellipse cx="40" cy="44" rx="4.5" ry="5" fill="#0ea5e9"/><ellipse cx="60" cy="44" rx="4.5" ry="5" fill="#0ea5e9"/><ellipse cx="40" cy="44" rx="2" ry="2.5" fill="#020617"/><ellipse cx="60" cy="44" rx="2" ry="2.5" fill="#020617"/><path d="M36 60 Q50 70 64 60" stroke="#0ea5e9" strokeWidth="2" fill="none"/><circle cx="36" cy="60" r="2" fill="#38bdf8"/><circle cx="64" cy="60" r="2" fill="#38bdf8"/></svg>);}
function AbyssusStage5(p){var sz=p.size||80;var t=Array.from({length:12},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ab5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0c4a6e"/><stop offset="40%" stopColor="#0a1628"/><stop offset="100%" stopColor="#020617"/></radialGradient><radialGradient id="ab5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><circle cx="50" cy="50" r="42" fill="url(#ab5a)"/>{t.map(function(i){var angle=i*30*Math.PI/180;var len=34+i%4*5;var cx1=50+Math.cos(angle-0.4)*18;var cy1=50+Math.sin(angle-0.4)*18;var cx2=50+Math.cos(angle-0.1)*28;var cy2=50+Math.sin(angle-0.1)*28;var endX=50+Math.cos(angle)*len;var endY=50+Math.sin(angle)*len;return <path key={i} d={"M50 50 C"+cx1+" "+cy1+" "+cx2+" "+cy2+" "+endX+" "+endY} stroke="#0284c7" strokeWidth={2.5-i%3*0.3} fill="none" strokeLinecap="round" opacity="0.9"/>;})}<circle cx="50" cy="50" r="18" fill="#020617"/><circle cx="50" cy="50" r="12" fill="url(#ab5b)"/><ellipse cx="43" cy="46" rx="6" ry="7" fill="#020617" stroke="#38bdf8" strokeWidth="1.2"/><ellipse cx="57" cy="46" rx="6" ry="7" fill="#020617" stroke="#38bdf8" strokeWidth="1.2"/><ellipse cx="43" cy="46" rx="3" ry="3.5" fill="#7dd3fc"/><ellipse cx="57" cy="46" rx="3" ry="3.5" fill="#7dd3fc"/><ellipse cx="43" cy="46" rx="1.2" ry="1.5" fill="white"/><ellipse cx="57" cy="46" rx="1.2" ry="1.5" fill="white"/><path d="M38 60 Q50 72 62 60" stroke="#38bdf8" strokeWidth="2.5" fill="none"/><circle cx="38" cy="60" r="2.5" fill="#7dd3fc"/><circle cx="62" cy="60" r="2.5" fill="#7dd3fc"/></svg>);}
function SolarisStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="sl1a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#92400e"/><stop offset="100%" stopColor="#1c0a00"/></radialGradient></defs><circle cx="50" cy="50" r="20" fill="url(#sl1a)"/><circle cx="50" cy="50" r="20" fill="none" stroke="#d97706" strokeWidth="0.5" opacity="0.4"/><circle cx="44" cy="46" r="2" fill="#fbbf24" opacity="0.5"/><circle cx="56" cy="46" r="2" fill="#fbbf24" opacity="0.5"/></svg>);}
function SolarisStage2(p){var sz=p.size||80;var rays=[0,60,120,180,240,300];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="sl2a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d97706"/><stop offset="60%" stopColor="#92400e"/><stop offset="100%" stopColor="#1c0a00"/></radialGradient></defs><circle cx="50" cy="50" r="24" fill="url(#sl2a)"/>{rays.map(function(deg,i){var r=deg*Math.PI/180;return <line key={i} x1={50+Math.cos(r)*22} y1={50+Math.sin(r)*22} x2={50+Math.cos(r)*30} y2={50+Math.sin(r)*30} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>;})}<circle cx="44" cy="46" r="3" fill="#fde68a" opacity="0.7"/><circle cx="56" cy="46" r="3" fill="#fde68a" opacity="0.7"/></svg>);}
function SolarisStage3(p){var sz=p.size||80;var rays=Array.from({length:8},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="sl3a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="50%" stopColor="#d97706"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="26" fill="url(#sl3a)"/>{rays.map(function(i){var deg=i*45;var r=deg*Math.PI/180;var len=i%2===0?16:12;return <line key={i} x1={50+Math.cos(r)*24} y1={50+Math.sin(r)*24} x2={50+Math.cos(r)*(24+len)} y2={50+Math.sin(r)*(24+len)} stroke="#fde68a" strokeWidth={i%2===0?3:2} strokeLinecap="round" opacity="0.9"/>;})}<circle cx="50" cy="50" r="10" fill="#fef3c7" opacity="0.8"/><circle cx="43" cy="46" r="3.5" fill="#7c2d12"/><circle cx="57" cy="46" r="3.5" fill="#7c2d12"/><path d="M40 56 Q50 62 60 56" stroke="#92400e" strokeWidth="2" fill="none"/></svg>);}
function SolarisStage4(p){var sz=p.size||80;var rays=Array.from({length:12},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="sl4a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef3c7"/><stop offset="30%" stopColor="#fbbf24"/><stop offset="70%" stopColor="#d97706"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#sl4a)"/>{rays.map(function(i){var deg=i*30;var r=deg*Math.PI/180;var len=i%3===0?20:i%3===1?14:10;var width=i%3===0?3.5:i%3===1?2.5:1.5;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+len)} y2={50+Math.sin(r)*(28+len)} stroke="#fde68a" strokeWidth={width} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="14" fill="#fff" opacity="0.6"/><circle cx="50" cy="50" r="7" fill="white"/><circle cx="43" cy="46" r="4" fill="#92400e"/><circle cx="57" cy="46" r="4" fill="#92400e"/><path d="M39 56 Q50 64 61 56" stroke="#7c2d12" strokeWidth="2.5" fill="none"/></svg>);}
function SolarisStage5(p){var sz=p.size||80;var rays=Array.from({length:16},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="sl5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="80%" stopColor="#d97706"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient><radialGradient id="sl5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="#fbbf24"/></radialGradient></defs><circle cx="50" cy="50" r="38" fill="url(#sl5a)" opacity="0.3"/><circle cx="50" cy="50" r="30" fill="url(#sl5a)"/>{rays.map(function(i){var deg=i*22.5;var r=deg*Math.PI/180;var len=i%4===0?26:i%4===1?18:i%4===2?14:10;var w=i%4===0?4:i%4===1?3:2;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+len)} y2={50+Math.sin(r)*(28+len)} stroke={i%2===0?"#fde68a":"#fbbf24"} strokeWidth={w} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="16" fill="url(#sl5b)"/><circle cx="50" cy="50" r="8" fill="white"/><circle cx="43" cy="45" r="4.5" fill="#d97706"/><circle cx="57" cy="45" r="4.5" fill="#d97706"/><circle cx="43.5" cy="44.5" r="2" fill="white"/><circle cx="57.5" cy="44.5" r="2" fill="white"/><path d="M38 56 Q50 66 62 56" stroke="#92400e" strokeWidth="3" fill="none"/><circle cx="38" cy="56" r="2" fill="#fbbf24"/><circle cx="62" cy="56" r="2" fill="#fbbf24"/></svg>);}
function FerrusStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><polygon points="50,22 68,38 64,58 50,68 36,58 32,38" fill="#292524" stroke="#78716c" strokeWidth="1.5"/><polygon points="50,32 60,42 58,54 50,60 42,54 40,42" fill="#44403c" opacity="0.7"/><line x1="44" y1="42" x2="56" y2="42" stroke="#78716c" strokeWidth="1" opacity="0.6"/><line x1="42" y1="50" x2="58" y2="50" stroke="#78716c" strokeWidth="1" opacity="0.6"/></svg>);}
function FerrusStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="32" y="36" width="36" height="40" rx="2" fill="#292524" stroke="#78716c" strokeWidth="1.5"/><rect x="36" y="40" width="28" height="6" rx="1" fill="#44403c"/><circle cx="42" cy="54" r="5" fill="#44403c" stroke="#a8a29e" strokeWidth="1"/><circle cx="58" cy="54" r="5" fill="#44403c" stroke="#a8a29e" strokeWidth="1"/><circle cx="42" cy="54" r="2" fill="#78716c"/><circle cx="58" cy="54" r="2" fill="#78716c"/><rect x="42" y="66" width="16" height="10" rx="1" fill="#3c3836" stroke="#78716c" strokeWidth="0.8"/><rect x="34" y="28" width="32" height="10" rx="1" fill="#3c3836" stroke="#a8a29e" strokeWidth="1"/></svg>);}
function FerrusStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="28" y="30" width="44" height="54" rx="3" fill="#1c1917" stroke="#78716c" strokeWidth="2"/><rect x="28" y="30" width="44" height="10" rx="2" fill="#292524" stroke="#a8a29e" strokeWidth="1"/><circle cx="38" cy="42" r="6" fill="#292524" stroke="#78716c" strokeWidth="1.2"/><circle cx="62" cy="42" r="6" fill="#292524" stroke="#78716c" strokeWidth="1.2"/><circle cx="38" cy="42" r="3" fill="#a8a29e" opacity="0.8"/><circle cx="62" cy="42" r="3" fill="#a8a29e" opacity="0.8"/><rect x="34" y="52" width="32" height="5" rx="1" fill="#292524" stroke="#78716c" strokeWidth="0.8"/><rect x="36" y="60" width="28" height="16" rx="2" fill="#292524"/><rect x="40" y="63" width="6" height="10" fill="#44403c" stroke="#78716c" strokeWidth="0.5"/><rect x="48" y="63" width="6" height="10" fill="#44403c" stroke="#78716c" strokeWidth="0.5"/><rect x="56" y="63" width="6" height="10" fill="#44403c" stroke="#78716c" strokeWidth="0.5"/><rect x="20" y="34" width="10" height="36" rx="2" fill="#292524" stroke="#78716c" strokeWidth="1.2"/><rect x="70" y="34" width="10" height="36" rx="2" fill="#292524" stroke="#78716c" strokeWidth="1.2"/></svg>);}
function FerrusStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><rect x="22" y="24" width="56" height="66" rx="4" fill="#1c1917" stroke="#a8a29e" strokeWidth="2"/><rect x="22" y="24" width="56" height="12" rx="3" fill="#292524"/><circle cx="38" cy="30" r="3" fill="#78716c"/><circle cx="50" cy="30" r="3" fill="#78716c"/><circle cx="62" cy="30" r="3" fill="#78716c"/><rect x="28" y="40" width="18" height="20" rx="2" fill="#292524" stroke="#78716c" strokeWidth="1.2"/><rect x="54" y="40" width="18" height="20" rx="2" fill="#292524" stroke="#78716c" strokeWidth="1.2"/><circle cx="37" cy="50" r="6" fill="#0d0d0d" stroke="#a8a29e" strokeWidth="1"/><circle cx="63" cy="50" r="6" fill="#0d0d0d" stroke="#a8a29e" strokeWidth="1"/><circle cx="37" cy="50" r="3" fill="#d6d3d1" opacity="0.7"/><circle cx="63" cy="50" r="3" fill="#d6d3d1" opacity="0.7"/><rect x="28" y="64" width="44" height="6" rx="1" fill="#292524" stroke="#78716c" strokeWidth="0.8"/><rect x="32" y="72" width="36" height="14" rx="2" fill="#292524"/><rect x="36" y="74" width="4" height="10" fill="#3c3836" stroke="#78716c" strokeWidth="0.5"/><rect x="44" y="74" width="4" height="10" fill="#3c3836" stroke="#78716c" strokeWidth="0.5"/><rect x="52" y="74" width="4" height="10" fill="#3c3836" stroke="#78716c" strokeWidth="0.5"/><rect x="60" y="74" width="4" height="10" fill="#3c3836" stroke="#78716c" strokeWidth="0.5"/><rect x="12" y="28" width="12" height="46" rx="3" fill="#292524" stroke="#a8a29e" strokeWidth="1.5"/><rect x="76" y="28" width="12" height="46" rx="3" fill="#292524" stroke="#a8a29e" strokeWidth="1.5"/></svg>);}
function FerrusStage5(p){var sz=p.size||80;var barYs=[28,38,48,58];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><linearGradient id="fe5a" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#44403c"/><stop offset="100%" stopColor="#0c0a09"/></linearGradient></defs><rect x="18" y="16" width="64" height="74" rx="6" fill="url(#fe5a)" stroke="#d6d3d1" strokeWidth="2"/><rect x="18" y="16" width="64" height="14" rx="5" fill="#292524" stroke="#a8a29e" strokeWidth="1.5"/><text x="50" y="27" textAnchor="middle" fill="#d6d3d1" fontSize="5" fontFamily="monospace" letterSpacing="1">FERRUS</text><rect x="24" y="34" width="22" height="26" rx="3" fill="#1c1917" stroke="#a8a29e" strokeWidth="1.5"/><rect x="54" y="34" width="22" height="26" rx="3" fill="#1c1917" stroke="#a8a29e" strokeWidth="1.5"/><circle cx="35" cy="47" r="8" fill="#0a0908" stroke="#d6d3d1" strokeWidth="1.2"/><circle cx="65" cy="47" r="8" fill="#0a0908" stroke="#d6d3d1" strokeWidth="1.2"/><circle cx="35" cy="47" r="4" fill="#78716c" opacity="0.9"/><circle cx="65" cy="47" r="4" fill="#78716c" opacity="0.9"/><circle cx="35" cy="47" r="1.5" fill="#e7e5e4"/><circle cx="65" cy="47" r="1.5" fill="#e7e5e4"/><rect x="24" y="64" width="52" height="8" rx="2" fill="#1c1917" stroke="#78716c" strokeWidth="0.8"/><rect x="28" y="66" width="3" height="4" fill="#78716c" opacity="0.7"/><rect x="33" y="66" width="3" height="4" fill="#78716c" opacity="0.3"/><rect x="38" y="66" width="3" height="4" fill="#78716c" opacity="0.7"/><rect x="43" y="66" width="3" height="4" fill="#78716c" opacity="1"/><rect x="48" y="66" width="3" height="4" fill="#78716c" opacity="0.4"/><rect x="53" y="66" width="3" height="4" fill="#78716c" opacity="0.8"/><rect x="58" y="66" width="3" height="4" fill="#78716c" opacity="0.2"/><rect x="63" y="66" width="3" height="4" fill="#78716c" opacity="0.9"/><rect x="68" y="66" width="3" height="4" fill="#78716c" opacity="0.6"/><rect x="24" y="74" width="52" height="12" rx="2" fill="#1c1917"/><rect x="28" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="36" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="44" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="52" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="60" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="68" y="76" width="4" height="8" fill="#292524" stroke="#78716c" strokeWidth="0.5"/><rect x="6" y="20" width="14" height="56" rx="4" fill="#292524" stroke="#d6d3d1" strokeWidth="1.5"/><rect x="80" y="20" width="14" height="56" rx="4" fill="#292524" stroke="#d6d3d1" strokeWidth="1.5"/>{barYs.map(function(y){return [<rect key={"l"+y} x="8" y={y} width="10" height="5" fill="#44403c"/>,<rect key={"r"+y} x="82" y={y} width="10" height="5" fill="#44403c"/>];})}</svg>);}
function LumisStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><circle cx="50" cy="50" r="6" fill="#fbbf24" opacity="0.9"/><circle cx="50" cy="50" r="10" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.3"/></svg>);}
function LumisStage2(p){var sz=p.size||80;var dots=[[50,30],[50,70],[30,50],[70,50],[36,36],[64,36],[36,64],[64,64]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><circle cx="50" cy="50" r="6" fill="#fbbf24"/>{dots.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r={i<4?3:2} fill="#fbbf24" opacity={i<4?0.7:0.5}/>;})}</svg>);}
function LumisStage3(p){var sz=p.size||80;var outer=[[50,26],[50,74],[26,50],[74,50],[32,32],[68,32],[32,68],[68,68],[50,18],[50,82]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="lm3a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#92400e" stopOpacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="40" fill="url(#lm3a)" opacity="0.2"/><circle cx="50" cy="50" r="9" fill="#fbbf24"/><circle cx="44" cy="44" r="4" fill="#fde68a" opacity="0.8"/><circle cx="56" cy="44" r="4" fill="#fde68a" opacity="0.8"/>{outer.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r={i<4?3.5:i<8?2.5:1.5} fill="#fbbf24" opacity={0.8-i*0.04}/>;})}</svg>);}
function LumisStage4(p){var sz=p.size||80;var orbs=Array.from({length:20},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="lm4a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#92400e" stopOpacity="0"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="url(#lm4a)" opacity="0.15"/><circle cx="50" cy="50" r="12" fill="#fbbf24"/><circle cx="50" cy="50" r="7" fill="#fef3c7"/><circle cx="43" cy="46" r="4.5" fill="#92400e"/><circle cx="57" cy="46" r="4.5" fill="#92400e"/><circle cx="44" cy="45" r="1.5" fill="#fef3c7"/><circle cx="58" cy="45" r="1.5" fill="#fef3c7"/><path d="M40 56 Q50 64 60 56" stroke="#92400e" strokeWidth="2" fill="none"/>{orbs.map(function(i){var angle=i*18*Math.PI/180;var dist=22+i%3*8;return <circle key={i} cx={50+Math.cos(angle)*dist} cy={50+Math.sin(angle)*dist} r={i%4===0?3:i%4===1?2:1.5} fill="#fbbf24" opacity={0.9-i*0.02}/>;})}</svg>);}
function LumisStage5(p){var sz=p.size||80;var spikes=Array.from({length:16},function(_,i){return i;});var orbs=Array.from({length:30},function(_,i){return i;});return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="lm5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef3c7"/><stop offset="40%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#92400e" stopOpacity="0"/></radialGradient><radialGradient id="lm5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="100%" stopColor="#fbbf24"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#lm5a)" opacity="0.25"/><circle cx="50" cy="50" r="34" fill="url(#lm5a)" opacity="0.3"/>{spikes.map(function(i){var deg=i*22.5;var angle=deg*Math.PI/180;var len=i%4===0?20:i%4===2?16:12;return <line key={i} x1={50+Math.cos(angle)*14} y1={50+Math.sin(angle)*14} x2={50+Math.cos(angle)*(14+len)} y2={50+Math.sin(angle)*(14+len)} stroke="#fbbf24" strokeWidth={i%4===0?2:1} opacity="0.6"/>;})}<circle cx="50" cy="50" r="16" fill="url(#lm5b)"/><circle cx="50" cy="50" r="9" fill="white"/><circle cx="43" cy="46" r="5" fill="#92400e"/><circle cx="57" cy="46" r="5" fill="#92400e"/><circle cx="44" cy="45" r="2" fill="white"/><circle cx="58" cy="45" r="2" fill="white"/><path d="M38 56 Q50 66 62 56" stroke="#92400e" strokeWidth="2.5" fill="none"/>{orbs.map(function(i){var angle=i*12*Math.PI/180;var dist=20+i%5*6;return <circle key={i} cx={50+Math.cos(angle)*dist} cy={50+Math.sin(angle)*dist} r={i%5===0?2.5:1.2} fill={i%3===0?"#fef3c7":"#fbbf24"} opacity={0.9-i*0.015}/>;})}</svg>);}
function OkamiStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><ellipse cx="50" cy="58" rx="20" ry="16" fill="#1e293b"/><ellipse cx="50" cy="44" rx="14" ry="12" fill="#1e293b"/><polygon points="38,36 34,22 44,34" fill="#1e293b"/><polygon points="62,36 66,22 56,34" fill="#1e293b"/><circle cx="44" cy="43" r="3" fill="#94a3b8" opacity="0.6"/><circle cx="56" cy="43" r="3" fill="#94a3b8" opacity="0.6"/><ellipse cx="50" cy="52" rx="4" ry="2" fill="#475569"/></svg>);}
function OkamiStage2(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><ellipse cx="50" cy="60" rx="24" ry="18" fill="#1e293b"/><ellipse cx="50" cy="44" rx="16" ry="14" fill="#1e293b"/><polygon points="36,34 30,16 46,32" fill="#334155"/><polygon points="64,34 70,16 54,32" fill="#334155"/><circle cx="43" cy="42" r="4" fill="#cbd5e1" opacity="0.8"/><circle cx="57" cy="42" r="4" fill="#cbd5e1" opacity="0.8"/><circle cx="43" cy="42" r="2" fill="#0f172a"/><circle cx="57" cy="42" r="2" fill="#0f172a"/><ellipse cx="50" cy="52" rx="5" ry="2.5" fill="#334155"/><path d="M50 70 Q70 68 80 78" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round"/></svg>);}
function OkamiStage3(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ok3a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#334155"/><stop offset="100%" stopColor="#0f172a"/></radialGradient></defs><ellipse cx="50" cy="62" rx="26" ry="20" fill="url(#ok3a)"/><ellipse cx="50" cy="44" rx="18" ry="15" fill="url(#ok3a)"/><polygon points="34,32 26,10 46,30" fill="#475569"/><polygon points="66,32 74,10 54,30" fill="#475569"/><circle cx="42" cy="41" r="5" fill="#e2e8f0" opacity="0.9"/><circle cx="58" cy="41" r="5" fill="#e2e8f0" opacity="0.9"/><circle cx="42" cy="41" r="2.5" fill="#0f172a"/><circle cx="58" cy="41" r="2.5" fill="#0f172a"/><circle cx="43" cy="40" r="1" fill="white" opacity="0.8"/><circle cx="59" cy="40" r="1" fill="white" opacity="0.8"/><ellipse cx="50" cy="52" rx="6" ry="3" fill="#475569"/><path d="M50 74 Q72 70 86 82" stroke="#334155" strokeWidth="6" fill="none" strokeLinecap="round"/><circle cx="46" cy="28" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="0.5" opacity="0.3"/><circle cx="46" cy="28" r="5" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.5"/></svg>);}
function OkamiStage4(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ok4a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#475569"/><stop offset="100%" stopColor="#0f172a"/></radialGradient></defs><ellipse cx="50" cy="64" rx="28" ry="22" fill="url(#ok4a)"/><ellipse cx="50" cy="44" rx="20" ry="17" fill="url(#ok4a)"/><polygon points="32,30 22,6 46,28" fill="#64748b"/><polygon points="68,30 78,6 54,28" fill="#64748b"/><circle cx="41" cy="40" r="6" fill="white" opacity="0.95"/><circle cx="59" cy="40" r="6" fill="white" opacity="0.95"/><circle cx="41" cy="40" r="3" fill="#0f172a"/><circle cx="59" cy="40" r="3" fill="#0f172a"/><circle cx="42" cy="39" r="1.2" fill="white"/><circle cx="60" cy="39" r="1.2" fill="white"/><ellipse cx="50" cy="53" rx="7" ry="3.5" fill="#64748b"/><path d="M50 78 Q76 72 92 86" stroke="#475569" strokeWidth="7" fill="none" strokeLinecap="round"/><line x1="50" y1="16" x2="50" y2="6" stroke="#94a3b8" strokeWidth="1" opacity="0.6"/><line x1="42" y1="18" x2="38" y2="10" stroke="#94a3b8" strokeWidth="1" opacity="0.5"/><line x1="58" y1="18" x2="62" y2="10" stroke="#94a3b8" strokeWidth="1" opacity="0.5"/><circle cx="50" cy="4" r="2" fill="#e2e8f0" opacity="0.8"/><circle cx="36" cy="8" r="1.5" fill="#e2e8f0" opacity="0.6"/><circle cx="64" cy="8" r="1.5" fill="#e2e8f0" opacity="0.6"/></svg>);}
function OkamiStage5(p){var sz=p.size||80;var stars=[[50,4],[38,10],[62,10],[30,18],[70,18],[22,26],[78,26],[14,34],[86,34]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ok5a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#64748b"/><stop offset="60%" stopColor="#1e293b"/><stop offset="100%" stopColor="#0f172a"/></radialGradient></defs><ellipse cx="50" cy="66" rx="30" ry="24" fill="url(#ok5a)"/><ellipse cx="50" cy="44" rx="22" ry="18" fill="url(#ok5a)"/><polygon points="30,28 18,2 46,26" fill="#94a3b8"/><polygon points="70,28 82,2 54,26" fill="#94a3b8"/><circle cx="40" cy="39" r="7" fill="white"/><circle cx="60" cy="39" r="7" fill="white"/><circle cx="40" cy="39" r="3.5" fill="#1e293b"/><circle cx="60" cy="39" r="3.5" fill="#1e293b"/><circle cx="41" cy="38" r="1.5" fill="white"/><circle cx="61" cy="38" r="1.5" fill="white"/><ellipse cx="50" cy="54" rx="8" ry="4" fill="#94a3b8"/><path d="M50 82 Q80 74 96 90" stroke="#64748b" strokeWidth="8" fill="none" strokeLinecap="round"/>{stars.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r={i<2?2.5:i<4?2:1.5} fill="#e2e8f0" opacity={0.9-i*0.06}/>;})}<line x1="50" y1="4" x2="38" y2="10" stroke="#94a3b8" strokeWidth="0.6" opacity="0.4"/><line x1="38" y1="10" x2="62" y2="10" stroke="#94a3b8" strokeWidth="0.6" opacity="0.4"/></svg>);}
function RyuStage1(p){var sz=p.size||80;return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ry1a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#166534"/><stop offset="100%" stopColor="#052e16"/></radialGradient></defs><ellipse cx="50" cy="54" rx="22" ry="26" fill="url(#ry1a)" stroke="#15803d" strokeWidth="1"/><ellipse cx="50" cy="54" rx="14" ry="18" fill="none" stroke="#4ade80" strokeWidth="0.5" opacity="0.4"/><ellipse cx="50" cy="54" rx="7" ry="9" fill="none" stroke="#86efac" strokeWidth="0.4" opacity="0.3"/><circle cx="44" cy="50" r="2" fill="#4ade80" opacity="0.5"/><circle cx="56" cy="50" r="2" fill="#4ade80" opacity="0.5"/><path d="M42 60 Q50 64 58 60" stroke="#15803d" strokeWidth="1" fill="none" opacity="0.6"/></svg>);}
function RyuStage2(p){var sz=p.size||80;var scales=[[32,52],[68,52],[30,62],[70,62]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ry2a" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#166534"/></radialGradient></defs><path d="M50 20 Q60 30 64 44 Q68 60 60 72 Q54 82 50 84 Q46 82 40 72 Q32 60 36 44 Q40 30 50 20Z" fill="url(#ry2a)" opacity="0.9"/><circle cx="43" cy="38" r="4" fill="#052e16" stroke="#86efac" strokeWidth="0.8"/><circle cx="57" cy="38" r="4" fill="#052e16" stroke="#86efac" strokeWidth="0.8"/><circle cx="43" cy="38" r="2" fill="#4ade80" opacity="0.8"/><circle cx="57" cy="38" r="2" fill="#4ade80" opacity="0.8"/><path d="M44 48 Q50 54 56 48" stroke="#166534" strokeWidth="1.5" fill="none"/>{scales.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r="2.5" fill="#4ade80" opacity="0.4"/>;})}</svg>);}
function RyuStage3(p){var sz=p.size||80;var finPts=[[26,36,"M26 36 L18 32 L20 36 L18 40Z"],[74,36,"M74 36 L82 32 L80 36 L82 40Z"],[22,52,"M22 52 L14 48 L16 52 L14 56Z"],[78,52,"M78 52 L86 48 L84 52 L86 56Z"]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><linearGradient id="ry3a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#15803d"/><stop offset="100%" stopColor="#166534"/></linearGradient></defs><path d="M50 16 Q70 22 76 40 Q82 60 70 76 Q62 86 50 88 Q38 86 30 76 Q18 60 24 40 Q30 22 50 16Z" fill="url(#ry3a)"/><path d="M50 16 Q68 24 72 40 Q76 58 66 72 Q58 82 50 84 Q42 82 34 72 Q24 58 28 40 Q32 24 50 16Z" fill="#16a34a" opacity="0.5"/><path d="M50 16 Q56 10 62 14 Q58 20 50 18Z" fill="#15803d"/><path d="M50 16 Q44 10 38 14 Q42 20 50 18Z" fill="#15803d"/><circle cx="42" cy="40" r="5.5" fill="#052e16" stroke="#4ade80" strokeWidth="1"/><circle cx="58" cy="40" r="5.5" fill="#052e16" stroke="#4ade80" strokeWidth="1"/><circle cx="42" cy="40" r="3" fill="#86efac"/><circle cx="58" cy="40" r="3" fill="#86efac"/><circle cx="42" cy="40" r="1.2" fill="#052e16"/><circle cx="58" cy="40" r="1.2" fill="#052e16"/><path d="M38 55 Q50 64 62 55" stroke="#4ade80" strokeWidth="2" fill="none"/><path d="M50 78 Q66 76 80 86" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round"/>{finPts.map(function(fin,i){return <path key={i} d={fin[2]} fill="#22c55e" opacity="0.7"/>;})}</svg>);}
function RyuStage4(p){var sz=p.size||80;var fins=[[18,28,true],[82,28,false],[12,48,true],[88,48,false],[16,68,true],[84,68,false]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><linearGradient id="ry4a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#14532d"/></linearGradient></defs><path d="M50 10 Q74 16 82 36 Q90 58 78 78 Q68 92 50 94 Q32 92 22 78 Q10 58 18 36 Q26 16 50 10Z" fill="url(#ry4a)"/><path d="M50 10 Q62 6 70 12 Q64 18 56 14 Q50 12 50 10Z" fill="#22c55e"/><path d="M50 10 Q38 6 30 12 Q36 18 44 14 Q50 12 50 10Z" fill="#22c55e"/><circle cx="40" cy="36" r="7" fill="#052e16" stroke="#86efac" strokeWidth="1.2"/><circle cx="60" cy="36" r="7" fill="#052e16" stroke="#86efac" strokeWidth="1.2"/><circle cx="40" cy="36" r="4" fill="#4ade80"/><circle cx="60" cy="36" r="4" fill="#4ade80"/><circle cx="40" cy="35" r="1.5" fill="#052e16"/><circle cx="60" cy="35" r="1.5" fill="#052e16"/><path d="M36 52 Q50 62 64 52" stroke="#86efac" strokeWidth="2.5" fill="none"/><circle cx="36" cy="52" r="2" fill="#4ade80"/><circle cx="64" cy="52" r="2" fill="#4ade80"/><path d="M50 86 Q72 80 90 92" stroke="#22c55e" strokeWidth="7" fill="none" strokeLinecap="round"/>{fins.map(function(fin,i){var x=fin[0];var y=fin[1];var flip=fin[2];return <path key={i} d={"M"+x+" "+y+" L"+(x+(flip?-12:12))+" "+(y-6)+" L"+(x+(flip?-10:10))+" "+y+" L"+(x+(flip?-12:12))+" "+(y+6)+"Z"} fill="#16a34a" opacity="0.8"/>;})}</svg>);}
function RyuStage5(p){var sz=p.size||80;var fins=[[12,24,true],[88,24,false],[6,46,true],[94,46,false],[10,68,true],[90,68,false]];return(<svg width={sz} height={sz} viewBox="0 0 100 100" style={{overflow:"visible"}}><defs><radialGradient id="ry5a" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#4ade80"/><stop offset="40%" stopColor="#16a34a"/><stop offset="100%" stopColor="#052e16"/></radialGradient><radialGradient id="ry5b" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#dcfce7"/><stop offset="100%" stopColor="#4ade80"/></radialGradient></defs><path d="M50 6 Q78 12 88 34 Q98 58 84 80 Q72 96 50 98 Q28 96 16 80 Q2 58 12 34 Q22 12 50 6Z" fill="url(#ry5a)"/><path d="M50 6 Q66 0 76 8 Q68 16 58 10 Q50 8 50 6Z" fill="#22c55e"/><path d="M50 6 Q34 0 24 8 Q32 16 42 10 Q50 8 50 6Z" fill="#22c55e"/><path d="M50 6 Q52 -2 58 2 Q56 8 50 6Z" fill="#86efac" opacity="0.8"/><path d="M50 6 Q48 -2 42 2 Q44 8 50 6Z" fill="#86efac" opacity="0.8"/><circle cx="38" cy="32" r="9" fill="#052e16" stroke="#86efac" strokeWidth="1.5"/><circle cx="62" cy="32" r="9" fill="#052e16" stroke="#86efac" strokeWidth="1.5"/><circle cx="38" cy="32" r="5.5" fill="url(#ry5b)"/><circle cx="62" cy="32" r="5.5" fill="url(#ry5b)"/><circle cx="38" cy="31" r="2.5" fill="#052e16"/><circle cx="62" cy="31" r="2.5" fill="#052e16"/><circle cx="39" cy="30" r="1" fill="white"/><circle cx="63" cy="30" r="1" fill="white"/><path d="M34 50 Q50 62 66 50" stroke="#86efac" strokeWidth="3" fill="none"/><circle cx="34" cy="50" r="2.5" fill="#4ade80"/><circle cx="66" cy="50" r="2.5" fill="#4ade80"/><circle cx="50" cy="60" r="2" fill="#86efac" opacity="0.7"/><path d="M50 90 Q76 82 96 96" stroke="#22c55e" strokeWidth="9" fill="none" strokeLinecap="round"/>{fins.map(function(fin,i){var x=fin[0];var y=fin[1];var flip=fin[2];return <path key={i} d={"M"+x+" "+y+" L"+(x+(flip?-16:16))+" "+(y-8)+" L"+(x+(flip?-13:13))+" "+y+" L"+(x+(flip?-16:16))+" "+(y+8)+"Z"} fill="#22c55e" opacity="0.9"/>;})}</svg>);}

function renderArt(ArtComponent, size) {
  if (!ArtComponent) return null;
  return <ArtComponent size={size} />;
}

const PETS = [
  { id:"novus", name:"Novus", color:"#a78bfa", desc:"A cosmic moth born from the space between stars. Starts as a point of light. Ends as something that eclipses galaxies.", stages:[
    { level:1,  form:"Dormant Speck",    Art:NovusStage1, desc:"A single dark point. You would not notice it. It has already noticed you." },
    { level:3,  form:"Waking Mote",      Art:NovusStage2, desc:"Something flickers. Not quite light. More like the idea of light." },
    { level:5,  form:"Soft Cocoon",      Art:NovusStage3, desc:"Folded away. The transformation is happening. Trust it." },
    { level:7,  form:"Cracked Chrysalis",Art:NovusStage4, desc:"The shell is breaking. What is inside has outgrown what contained it." },
    { level:10, form:"The Cosmic Moth",  Art:NovusStage5, desc:"Navigates by starlight. Leaves trails of nebula dust wherever it goes." },
  ]},
  { id:"khaos", name:"Khaos", color:"#38bdf8", desc:"A storm entity. Never fully solid. Never fully gone. The atmosphere itself bends around it as it grows.", stages:[
    { level:1,  form:"Static Breath",    Art:KhaosStage1, desc:"A charge in the air. Hair stands up. Something is building." },
    { level:3,  form:"First Charge",     Art:KhaosStage2, desc:"The electricity has found a shape. Not stable yet. Getting there." },
    { level:5,  form:"Storm Core",       Art:KhaosStage3, desc:"A dense center of pressure. The calm inside the lightning." },
    { level:7,  form:"Pressure Front",   Art:KhaosStage4, desc:"It arrives before it arrives. The air pressure drops." },
    { level:10, form:"Eye of All Things",Art:KhaosStage5, desc:"Total stillness at the center. Absolute fury at every edge. It reigns." },
  ]},
  { id:"yokai", name:"YKÄI-7", color:"#34d399", desc:"A corrupted signal that became conscious. Exists between data and myth. It chose you as its anchor.", stages:[
    { level:1,  form:"Null Signal",      Art:YokaiStage1, desc:"A single eye in static. Receiving. Watching. Deciding." },
    { level:3,  form:"Ghost Ping",       Art:YokaiStage2, desc:"Found a frequency. Flickers in and out of visibility." },
    { level:5,  form:"Signal Breach",    Art:YokaiStage3, desc:"Fully materialized. Unstable. Brilliant. Not supposed to exist." },
    { level:7,  form:"Sentient Glitch",  Art:YokaiStage4, desc:"The errors are features now. Rewritten from the ground up." },
    { level:10, form:"The Corrupted",    Art:YokaiStage5, desc:"Does not run on servers. Runs on belief." },
  ]},
  { id:"verdant", name:"Verdant", color:"#4ade80", desc:"The living forest. Starts as a single seed pushed into soil. Ends as an ecosystem entire civilizations shelter inside.", stages:[
    { level:1,  form:"Single Seed",      Art:VerdantStage1, desc:"Pressed into dark soil. No light yet. Still, it pushes." },
    { level:3,  form:"First Shoot",      Art:VerdantStage2, desc:"Pale and determined. The world above is unfamiliar. It goes anyway." },
    { level:5,  form:"Young Grove",      Art:VerdantStage3, desc:"Roots have met roots. Something like a network is forming." },
    { level:7,  form:"Ancient Wood",     Art:VerdantStage4, desc:"Old enough to have survived. Old enough to offer shelter." },
    { level:10, form:"World Root",       Art:VerdantStage5, desc:"The roots reach every continent. Every forest whispers its name." },
  ]},
  { id:"abyssus", name:"Abyssus", color:"#0ea5e9", desc:"Something that lives where light does not reach. The pressure would crush anything. It is not anything.", stages:[
    { level:1,  form:"Pressure Point",   Art:AbyssusStage1, desc:"A single drop from the deepest trench. Cold. Dense. Patient." },
    { level:3,  form:"First Tendril",    Art:AbyssusStage2, desc:"Something extends upward. Curious. The surface is a long way up." },
    { level:5,  form:"Deep Crawler",     Art:AbyssusStage3, desc:"Never seen light. Heard it described. On its way." },
    { level:7,  form:"Tide Sovereign",   Art:AbyssusStage4, desc:"The ocean does not move without its permission now." },
    { level:10, form:"The Abyss Itself", Art:AbyssusStage5, desc:"There is no bottom anymore. The bottom is it." },
  ]},
  { id:"solaris", name:"Solaris", color:"#fbbf24", desc:"A dying star that refused. Collapsed into something small and rebuilt itself into something the universe had never seen.", stages:[
    { level:1,  form:"Cooling Remnant",  Art:SolarisStage1, desc:"Almost out. Still spinning. A coal that has not decided to go dark." },
    { level:3,  form:"Ignition Shard",   Art:SolarisStage2, desc:"Something catches. One particle of hydrogen. Then everything." },
    { level:5,  form:"Rekindled Core",   Art:SolarisStage3, desc:"Burning again. Smaller than before. Hotter than it has ever been." },
    { level:7,  form:"Stellar Bloom",    Art:SolarisStage4, desc:"Expanded past its old boundaries. The star is bigger than its grief." },
    { level:10, form:"Supernova Born",   Art:SolarisStage5, desc:"Exploded once and survived. Now seeds new stars wherever it goes." },
  ]},
  { id:"ferrus", name:"Ferrus", color:"#94a3b8", desc:"Built by someone who needed something that could not break. Forged, not born. Every dent is a record of what tried.", stages:[
    { level:1,  form:"Raw Ore",          Art:FerrusStage1, desc:"Unrefined. Heavy. No shine yet. The potential is entirely invisible." },
    { level:3,  form:"First Cast",       Art:FerrusStage2, desc:"Still cooling. Shape emerging. Something is being made deliberately." },
    { level:5,  form:"The Machine",      Art:FerrusStage3, desc:"All parts accounted for. All systems running. Purpose: protect." },
    { level:7,  form:"Iron Sentinel",    Art:FerrusStage4, desc:"Has absorbed every impact. Has not moved. Has not considered it." },
    { level:10, form:"The Unbroken",     Art:FerrusStage5, desc:"It is the fortress now. Not inside it. It is the fortress." },
  ]},
  { id:"lumis", name:"Lumis", color:"#fbbf24", desc:"A swarm mind. Thousands of tiny lights that share one thought. Grows not by getting bigger but by getting more.", stages:[
    { level:1,  form:"Single Mote",      Art:LumisStage1, desc:"One point of warm light. Looking for something. Looking for you." },
    { level:3,  form:"Cluster Birth",    Art:LumisStage2, desc:"Others have been called. Arriving from different directions." },
    { level:5,  form:"The Gathering",    Art:LumisStage3, desc:"Thousands now. One mind. They have agreed: you are worth it." },
    { level:7,  form:"Convergence",      Art:LumisStage4, desc:"The lights have learned to speak in patterns. The patterns have a voice." },
    { level:10, form:"The Singular",     Art:LumisStage5, desc:"So many lights gathered they have become a star. By choice." },
  ]},
  { id:"okami", name:"Okami", color:"#e2e8f0", desc:"Not a wolf. The idea of a wolf — the version that exists in the oldest stories. Becoming the legend others tell about you.", stages:[
    { level:1,  form:"Shadow Pup",       Art:OkamiStage1, desc:"New. Uncertain. Eyes too large for its face. Watching everything." },
    { level:3,  form:"Moonbound",        Art:OkamiStage2, desc:"Found its frequency. Howls to confirm it exists. The moon answers." },
    { level:5,  form:"Howling Gate",     Art:OkamiStage3, desc:"Two moons rise when it calls. Or perhaps they always did." },
    { level:7,  form:"The Thunder Walk", Art:OkamiStage4, desc:"Its footsteps do not make sound. They make weather." },
    { level:10, form:"Myth Made Real",   Art:OkamiStage5, desc:"The world arranges itself around its path." },
  ]},
  { id:"ryu", name:"Ryu", color:"#4ade80", desc:"The ascending dragon. Does not start with fire. Earns it. Every form is a promise of what comes next if you keep going.", stages:[
    { level:1,  form:"The Dreaming Egg", Art:RyuStage1, desc:"Cold and perfect and full of something the world is not ready for yet." },
    { level:3,  form:"Jade Hatchling",   Art:RyuStage2, desc:"Scales like polished jade. Eyes older than the egg it came from." },
    { level:5,  form:"River Drake",      Art:RyuStage3, desc:"Moves through water like thought moves through mind. Inevitable." },
    { level:7,  form:"Mountain Warden",  Art:RyuStage4, desc:"Claimed the peaks. Not because it conquered them. Because they recognized it." },
    { level:10, form:"Heaven Piercer",   Art:RyuStage5, desc:"The first breath of fire took ten years to earn. Worth every day." },
  ]},
];

const PET_LEVELS = [
  { level:1,  name:"Newborn",  xpReq:0    },
  { level:2,  name:"Waking",   xpReq:100  },
  { level:3,  name:"Growing",  xpReq:250  },
  { level:4,  name:"Learning", xpReq:500  },
  { level:5,  name:"Evolved",  xpReq:900  },
  { level:6,  name:"Strong",   xpReq:1400 },
  { level:7,  name:"Powerful", xpReq:2100 },
  { level:8,  name:"Champion", xpReq:3000 },
  { level:9,  name:"Legend",   xpReq:4200 },
  { level:10, name:"Eternal",  xpReq:6000 },
];

const WORKOUT_TYPES = [
  { id:"run",      label:"Running",        emoji:"🏃",  met:9.8  },
  { id:"walk",     label:"Walking",        emoji:"🚶",  met:3.5  },
  { id:"bike",     label:"Cycling",        emoji:"🚴",  met:8.0  },
  { id:"swim",     label:"Swimming",       emoji:"🏊",  met:7.0  },
  { id:"lift",     label:"Weight Training",emoji:"🏋️", met:5.0  },
  { id:"hiit",     label:"HIIT",           emoji:"⚡",  met:10.0 },
  { id:"yoga",     label:"Yoga",           emoji:"🧘",  met:2.5  },
  { id:"pilates",  label:"Pilates",        emoji:"🤸",  met:3.0  },
  { id:"sport",    label:"Sports",         emoji:"⚽",  met:7.5  },
  { id:"climb",    label:"Climbing",       emoji:"🧗",  met:8.0  },
  { id:"dance",    label:"Dancing",        emoji:"💃",  met:5.5  },
  { id:"row",      label:"Rowing",         emoji:"🚣",  met:7.0  },
  { id:"elliptic", label:"Elliptical",     emoji:"🔄",  met:6.5  },
  { id:"boxing",   label:"Boxing",         emoji:"🥊",  met:9.0  },
  { id:"hike",     label:"Hiking",         emoji:"🥾",  met:6.0  },
  { id:"other",    label:"Other",          emoji:"💪",  met:5.0  },
];

const QUICK_FOODS = [
  {kw:["chicken breast","grilled chicken","baked chicken","chicken"],  name:"Chicken Breast",     emoji:"🍗", cal:185, pro:35, car:0,   fat:4,   fib:0,  perOz:46.25},
  {kw:["salmon","salmon fillet"],                                       name:"Salmon",             emoji:"🐟", cal:234, pro:31, car:0,   fat:12,  fib:0,  perOz:58.5},
  {kw:["ground beef","beef","burger patty"],                           name:"Ground Beef",        emoji:"🥩", cal:196, pro:24, car:0,   fat:11,  fib:0,  perOz:49.0},
  {kw:["ground turkey","turkey"],                                       name:"Ground Turkey",      emoji:"🦃", cal:170, pro:22, car:0,   fat:9,   fib:0,  perOz:42.5},
  {kw:["tuna","tuna can"],                                             name:"Canned Tuna",        emoji:"🐟", cal:109, pro:25, car:0,   fat:1,   fib:0},
  {kw:["shrimp","prawns"],                                             name:"Shrimp",             emoji:"🦐", cal:112, pro:24, car:0,   fat:1.5, fib:0,  perOz:28.0},
  {kw:["egg white","egg whites"],                                      name:"Egg Whites",         emoji:"🥚", cal:17,  pro:3.6,car:0.2, fat:0.1, fib:0},
  {kw:["egg","eggs","whole egg"],                                      name:"Egg",                emoji:"🥚", cal:72,  pro:6,  car:0.4, fat:5,   fib:0},
  {kw:["greek yogurt","yogurt"],                                       name:"Greek Yogurt",       emoji:"🫙", cal:100, pro:17, car:6,   fat:0,   fib:0,  perCup:1},
  {kw:["cottage cheese"],                                              name:"Cottage Cheese",     emoji:"🫙", cal:90,  pro:12, car:5,   fat:2.5, fib:0},
  {kw:["protein shake","protein powder","whey","protein"],             name:"Protein Shake",      emoji:"🥤", cal:120, pro:25, car:5,   fat:2,   fib:1},
  {kw:["quest bar","protein bar","bar"],                               name:"Quest Bar",          emoji:"💪", cal:200, pro:21, car:22,  fat:8,   fib:14},
  {kw:["fairlife","core power"],                                       name:"Fairlife Core Power",emoji:"🥤", cal:230, pro:42, car:13,  fat:3.5, fib:0},
  {kw:["premier protein"],                                             name:"Premier Protein",    emoji:"🥤", cal:160, pro:30, car:6,   fat:3,   fib:1},
  {kw:["white rice","jasmine rice"],                                   name:"White Rice",         emoji:"🍚", cal:206, pro:4,  car:45,  fat:0.4, fib:0.6,perCup:1},
  {kw:["brown rice"],                                                   name:"Brown Rice",         emoji:"🍚", cal:216, pro:5,  car:45,  fat:1.8, fib:3.5,perCup:1},
  {kw:["rice"],                                                         name:"White Rice",         emoji:"🍚", cal:206, pro:4,  car:45,  fat:0.4, fib:0.6,perCup:1},
  {kw:["oatmeal","oats"],                                              name:"Oatmeal",            emoji:"🥣", cal:158, pro:6,  car:27,  fat:3,   fib:4,  perCup:1},
  {kw:["sweet potato","yam"],                                          name:"Sweet Potato",       emoji:"🍠", cal:103, pro:2,  car:24,  fat:0.1, fib:3.8},
  {kw:["pasta","spaghetti","noodles"],                                  name:"Pasta",              emoji:"🍝", cal:220, pro:8,  car:43,  fat:1.3, fib:2.5,perCup:1},
  {kw:["bread","toast","slice of bread"],                              name:"Bread",              emoji:"🍞", cal:81,  pro:4,  car:14,  fat:1,   fib:1.9},
  {kw:["quinoa"],                                                       name:"Quinoa",             emoji:"🌾", cal:222, pro:8,  car:39,  fat:4,   fib:5,  perCup:1},
  {kw:["broccoli"],                                                     name:"Broccoli",           emoji:"🥦", cal:55,  pro:4,  car:11,  fat:0.6, fib:5,  perCup:1},
  {kw:["spinach"],                                                      name:"Spinach",            emoji:"🥬", cal:14,  pro:1.7,car:2,   fat:0.2, fib:1.3,perCup:1},
  {kw:["avocado","avo"],                                               name:"Avocado",            emoji:"🥑", cal:120, pro:1.5,car:6,   fat:11,  fib:5},
  {kw:["banana"],                                                       name:"Banana",             emoji:"🍌", cal:105, pro:1.3,car:27,  fat:0.4, fib:3.1},
  {kw:["apple"],                                                        name:"Apple",              emoji:"🍎", cal:95,  pro:0.5,car:25,  fat:0.3, fib:4.4},
  {kw:["blueberries","blueberry"],                                     name:"Blueberries",        emoji:"🫐", cal:84,  pro:1.1,car:21,  fat:0.5, fib:3.6,perCup:1},
  {kw:["strawberries","strawberry"],                                   name:"Strawberries",       emoji:"🍓", cal:49,  pro:1,  car:12,  fat:0.5, fib:3,  perCup:1},
  {kw:["peanut butter","pb"],                                          name:"Peanut Butter",      emoji:"🥜", cal:188, pro:8,  car:6,   fat:16,  fib:2},
  {kw:["almonds","almond"],                                            name:"Almonds",            emoji:"🌰", cal:164, pro:6,  car:6,   fat:14,  fib:3.5},
  {kw:["olive oil","oil"],                                             name:"Olive Oil",          emoji:"🫒", cal:119, pro:0,  car:0,   fat:13.5,fib:0},
  {kw:["black beans","beans"],                                         name:"Black Beans",        emoji:"🫘", cal:114, pro:7.6,car:20,  fat:0.5, fib:7.5,perCup:228},
  {kw:["pizza"],                                                        name:"Pizza Slice",        emoji:"🍕", cal:285, pro:12, car:36,  fat:10,  fib:2},
  {kw:["burger","hamburger","big mac","mcdouble"],                     name:"Burger",             emoji:"🍔", cal:450, pro:23, car:40,  fat:20,  fib:2},
  {kw:["fries","french fries"],                                        name:"Fries",              emoji:"🍟", cal:320, pro:4,  car:44,  fat:15,  fib:3},
  {kw:["chipotle","burrito bowl"],                                     name:"Chipotle Bowl",      emoji:"🥙", cal:655, pro:51, car:62,  fat:21,  fib:11},
  {kw:["salad"],                                                        name:"Salad",              emoji:"🥗", cal:150, pro:8,  car:12,  fat:7,   fib:4},
  {kw:["coffee","latte","espresso"],                                   name:"Coffee",             emoji:"☕", cal:5,   pro:0.3,car:0.7, fat:0.1, fib:0},
  {kw:["milk"],                                                         name:"Milk",               emoji:"🥛", cal:122, pro:8,  car:12,  fat:5,   fib:0,  perCup:1},
  {kw:["cheese"],                                                       name:"Cheese",             emoji:"🧀", cal:115, pro:7,  car:0.4, fat:9,   fib:0},
  {kw:["butter"],                                                       name:"Butter",             emoji:"🧈", cal:102, pro:0.1,car:0,   fat:11.5,fib:0},
  {kw:["orange juice","oj"],                                           name:"Orange Juice",       emoji:"🍊", cal:112, pro:1.7,car:26,  fat:0.5, fib:0.5,perCup:1},
  {kw:["gatorade","sports drink"],                                     name:"Gatorade",           emoji:"🥤", cal:140, pro:0,  car:36,  fat:0,   fib:0},
  {kw:["chocolate","dark chocolate"],                                  name:"Dark Chocolate",     emoji:"🍫", cal:170, pro:2,  car:13,  fat:12,  fib:3},
  {kw:["ice cream"],                                                    name:"Ice Cream",          emoji:"🍦", cal:207, pro:3.5,car:24,  fat:11,  fib:0.7},
  {kw:["tortilla","wrap"],                                             name:"Tortilla",           emoji:"🫓", cal:110, pro:5,  car:22,  fat:3,   fib:11},
  {kw:["hummus"],                                                       name:"Hummus",             emoji:"🫘", cal:50,  pro:2,  car:6,   fat:3,   fib:1.6},
  {kw:["soup"],                                                         name:"Soup",               emoji:"🍲", cal:120, pro:8,  car:15,  fat:3,   fib:1},
  {kw:["bacon"],                                                        name:"Bacon",              emoji:"🥓", cal:86,  pro:6,  car:0.1, fat:7,   fib:0},
];

const QUICK_CATS = [
  { label:"Protein",  emoji:"💪", items:QUICK_FOODS.slice(0,14)  },
  { label:"Carbs",    emoji:"🍚", items:QUICK_FOODS.slice(14,22) },
  { label:"Veggies",  emoji:"🥦", items:QUICK_FOODS.slice(22,26) },
  { label:"Fruits",   emoji:"🍎", items:QUICK_FOODS.slice(26,30) },
  { label:"Fats",     emoji:"🥑", items:QUICK_FOODS.slice(30,34) },
  { label:"Fast Food",emoji:"🍔", items:QUICK_FOODS.slice(34,42) },
  { label:"Other",    emoji:"☕", items:QUICK_FOODS.slice(42)    },
];

function sn(v){var x=parseFloat(v);return isNaN(x)?0:x;}
function r1(x){return Math.round(sn(x)*10)/10;}
function kset(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function kget(k){try{var s=localStorage.getItem(k);return s?JSON.parse(s):null;}catch(e){return null;}}

function getLvl(xp){
  var cur=PET_LEVELS[0];
  for(var i=0;i<PET_LEVELS.length;i++){if(xp>=PET_LEVELS[i].xpReq)cur=PET_LEVELS[i];else break;}
  var nxt=null;
  for(var j=0;j<PET_LEVELS.length;j++){if(PET_LEVELS[j].xpReq>xp){nxt=PET_LEVELS[j];break;}}
  var prog=nxt?((xp-cur.xpReq)/(nxt.xpReq-cur.xpReq))*100:100;
  return Object.assign({},cur,{nxt:nxt,prog:prog});
}
function getStage(pet,lvl){
  if(!pet)return null;
  var s=pet.stages[0];
  for(var i=0;i<pet.stages.length;i++){if(lvl>=pet.stages[i].level)s=pet.stages[i];else break;}
  return s;
}

async function searchUSDA(q){
  try{
    var res=await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?query="+encodeURIComponent(q)+"&pageSize=8&api_key=DEMO_KEY");
    var data=await res.json();
    if(!data.foods||!data.foods.length)return[];
    return data.foods.map(function(f){
      var ns=f.foodNutrients||[];
      function g(id){var x=ns.find(function(y){return y.nutrientId===id||y.nutrientNumber===String(id);});return x?Math.round(x.value*10)/10:0;}
      return{name:f.description.slice(0,40),emoji:"🔍",brand:f.brandOwner||"",cal:g(1008)||g("208"),pro:g(1003)||g("203"),car:g(1005)||g("205"),fat:g(1004)||g("204"),fib:g(1079)||g("291")};
    });
  }catch(e){return[];}
}

function parseVoice(text){
  if(!text||!text.trim())return[];
  var lower=text.toLowerCase();
  var results=[];
  var segments=lower.split(/\s+and\s+|\s+,\s+|,\s+|,|\s+then\s+|\s+plus\s+|\s+also\s+/);
  segments.forEach(function(seg){
    seg=seg.trim();
    if(seg.length<2)return;
    var qty=1;
    var qMatch=seg.match(/^(\d+(?:\.\d+)?)\s+/);
    var ozMatch=seg.match(/(\d+(?:\.\d+)?)\s*(?:oz|ounce)/);
    var cupMatch=seg.match(/(\d+(?:\.\d+)?)\s*cup/);
    if(qMatch)qty=parseFloat(qMatch[1]);
    var matched=null;
    for(var i=0;i<QUICK_FOODS.length;i++){
      var qf=QUICK_FOODS[i];
      var found=false;
      for(var j=0;j<qf.kw.length;j++){if(seg.indexOf(qf.kw[j])!==-1){found=true;break;}}
      if(found){matched=qf;break;}
    }
    if(!matched){results.push({id:Date.now()+Math.random(),name:seg,emoji:"🎤",cal:0,pro:0,car:0,fat:0,fib:0,servings:"1"});return;}
    var mult=qty;
    if(ozMatch&&matched.perOz)mult=parseFloat(ozMatch[1])/matched.perOz;
    else if(cupMatch&&matched.perCup)mult=parseFloat(cupMatch[1]);
    mult=Math.max(0.25,Math.min(10,mult));
    results.push({id:Date.now()+Math.random(),name:matched.name,emoji:matched.emoji,cal:Math.round(matched.cal*mult),pro:r1(matched.pro*mult),car:r1(matched.car*mult),fat:r1(matched.fat*mult),fib:r1(matched.fib*mult),servings:"1"});
  });
  return results;
}

function calcBurn(weightLbs,durationMin,met){
  var weightKg=weightLbs*0.453592;
  return Math.round((met*weightKg*durationMin)/60);
}

function scoreMeal(meal,goals,calsBefore){
  var score=0;var details=[];var tips=[];
  var pp=meal.cal>0?(meal.pro/meal.cal)*100:0;
  var ps=Math.min(40,Math.round(pp*2.5));score+=ps;
  if(ps>=25)details.push({t:"Great protein density",pos:true});
  else if(ps>=12)details.push({t:"Decent protein here",pos:true});
  else{details.push({t:"Light on protein this meal",pos:false});tips.push("Try adding chicken, eggs, Greek yogurt, or a protein shake next time");}
  var rem=goals.calories-calsBefore;
  var cs=meal.cal<=rem?Math.min(25,Math.round(25*(1-meal.cal/goals.calories))):5;
  score+=cs;
  if(meal.cal>rem+400)tips.push("This put you over today — no big deal, just go a little lighter at your next meal");
  var fs=Math.min(15,Math.round((meal.fib/Math.max(goals.fiber,1))*150));
  score+=fs;
  if(fs>=8)details.push({t:"Good fiber in this one",pos:true});
  else if(meal.fib<2)tips.push("Adding veggies or beans would bump the fiber and the score");
  score+=8;
  var final=Math.max(20,Math.min(100,score));
  var label="Keep Going";var lc="#94a3b8";var icon="🌱";
  if(final>=85){label="Amazing";lc="#fbbf24";icon="🌟";}
  else if(final>=70){label="Great";lc="#34d399";icon="💪";}
  else if(final>=55){label="Good";lc="#60a5fa";icon="👍";}
  var encs=["Every meal is a step forward.","You showed up — that is what matters.","Consistency beats perfection every single time.","Your body is working with every good choice you make.","Progress lives in the ordinary moments, not just the big ones.","This is what building something real looks like.","You are further along than you were yesterday."];
  if(tips.length===0)tips.push("That is a solid meal — keep this up!");
  return{score:final,label:label,lc:lc,icon:icon,details:details,tips:tips,enc:encs[Math.floor(Math.random()*encs.length)]};
}

function CalRing(p){
  var net=p.eaten-p.burned;
  var pct=Math.min(Math.max(net,0)/p.goal,1);
  var over=net>p.goal;
  var R=52,C=2*Math.PI*R,F=pct*C;
  var col=over?"#fb923c":pct>=0.9?"#34d399":p.T.accent;
  var bpct=Math.min(p.burned/Math.max(p.goal*0.3,1),1);
  return(
    <div style={{display:"flex",alignItems:"center",gap:20}}>
      <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
        <svg width="120" height="120" style={{transform:"rotate(-90deg)",display:"block"}}>
          <circle cx="60" cy="60" r={R} fill="none" stroke={p.T.border} strokeWidth="10"/>
          <circle cx="60" cy="60" r={R} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={F+" "+(C-F)} style={{transition:"stroke-dasharray .6s"}}/>
          {p.burned>0&&<circle cx="60" cy="60" r={R-12} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeDasharray={bpct*2*Math.PI*(R-12)+" "+(2*Math.PI*(R-12))} style={{transition:"stroke-dasharray .6s"}}/>}
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:col,lineHeight:1}}>{Math.max(net,0)}</span>
          <span style={{fontSize:9,color:p.T.sub,fontFamily:"'DM Mono',monospace"}}>/{p.goal}</span>
        </div>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:p.T.sub,fontFamily:"'DM Mono',monospace",letterSpacing:"0.08em",marginBottom:4}}>NET CALORIES</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,color:col,lineHeight:1,marginBottom:4}}>{over?"+"+(net-p.goal)+" over":(p.goal-net)+" to go"}</div>
        <div style={{width:"100%",height:4,background:p.T.border,borderRadius:99,overflow:"hidden",marginBottom:4}}>
          <div style={{width:Math.min(pct*100,100)+"%",height:"100%",background:col,borderRadius:99,transition:"width .6s"}}/>
        </div>
        <div style={{display:"flex",gap:12}}>
          <div style={{fontSize:10,color:p.T.faint,fontFamily:"'DM Mono',monospace"}}><span style={{color:p.T.text}}>{p.eaten}</span> eaten</div>
          {p.burned>0&&<div style={{fontSize:10,color:p.T.faint,fontFamily:"'DM Mono',monospace"}}><span style={{color:"#f97316"}}>-{p.burned}</span> burned</div>}
        </div>
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
        <span style={{fontSize:12,fontWeight:600,color:p.T.text,fontFamily:"'DM Mono',monospace"}}>{p.value}{p.unit}<span style={{color:p.T.faint,fontWeight:400}}>/{p.max}{p.unit}</span></span>
      </div>
      <div style={{height:5,background:p.T.border,borderRadius:99,overflow:"hidden"}}>
        <div style={{width:pct+"%",height:"100%",background:pct>=100?"#fb923c":p.color,borderRadius:99,transition:"width .5s"}}/>
      </div>
    </div>
  );
}
function Pill(p){
  return(
    <div style={{background:p.T.card2,border:"1px solid "+p.T.border,borderRadius:10,padding:"8px 10px",textAlign:"center",minWidth:60}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:p.T.faint,letterSpacing:"0.1em",marginBottom:2}}>{p.label}</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:19,fontWeight:700,color:p.color,lineHeight:1}}>{p.value}<span style={{fontSize:10,fontWeight:400}}>{p.unit}</span></div>
    </div>
  );
}

var CSS="@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}input[type=number]{-moz-appearance:textfield;}.delbtn{opacity:0!important;transition:opacity .2s!important;}.mcard:hover .delbtn{opacity:1!important;}.fc{transition:transform .15s;cursor:pointer;}.fc:hover{transform:translateY(-2px);}.pf{animation:fp 3s ease-in-out infinite;}@keyframes fp{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}@keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-10px);}}@keyframes loadbar{from{width:0%;}to{width:100%;}}@keyframes xpA{0%{opacity:0;transform:translateY(0) scale(.5);}20%{opacity:1;transform:translateY(-20px) scale(1.2);}80%{opacity:1;transform:translateY(-40px);}100%{opacity:0;transform:translateY(-60px);}}.xpa{animation:xpA 2.5s ease-out forwards;}.vp{animation:vpa 1s ease-in-out infinite;}@keyframes vpa{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}";

export default function App(){
  var [userName,setUserName]=useState("");
  var [nameInput,setNameInput]=useState("");
  var [showNameScreen,setShowNameScreen]=useState(true);
  var [meals,setMeals]=useState([]);
  var [workouts,setWorkouts]=useState([]);
  var [saved,setSaved]=useState([]);
  var [goals,setGoals]=useState(DEFAULT_GOALS);
  var [goalsF,setGoalsF]=useState(DEFAULT_GOALS);
  var [waterGlasses,setWaterGlasses]=useState(0);
  var [weightLog,setWeightLog]=useState([]);
  var [totalDays,setTotalDays]=useState(0);
  var [lastDate,setLastDate]=useState(null);
  var [tab,setTab]=useState("home");
  var [themeId,setThemeId]=useState("obsidian");
  var [loaded,setLoaded]=useState(false);
  var [splash,setSplash]=useState(true);
  var [activePetId,setActivePetId]=useState(null);
  var [petData,setPetData]=useState({});
  var [zoo,setZoo]=useState([]);
  var [xpPop,setXpPop]=useState(null);
  var [bodyWeightLbs,setBodyWeightLbs]=useState(170);
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
  var [voiceText,setVoiceText]=useState("");
  var [voiceListening,setVoiceListening]=useState(false);
  var [voiceErr,setVoiceErr]=useState("");
  var [voiceModal,setVoiceModal]=useState(false);
  var [voiceParsed,setVoiceParsed]=useState([]);
  var [showWorkoutModal,setShowWorkoutModal]=useState(false);
  var [wkType,setWkType]=useState(WORKOUT_TYPES[0]);
  var [wkDuration,setWkDuration]=useState("30");
  var [wkNotes,setWkNotes]=useState("");
  var [wkIntensity,setWkIntensity]=useState("moderate");
  var recogRef=useRef(null);

  var T=THEMES.find(function(t){return t.id===themeId;})||THEMES[0];
  var MACROS=[
    {key:"pro",label:"Protein",unit:"g",color:"#34d399",max:goals.protein},​​​​​​​​​​​​​​​​
