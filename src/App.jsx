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

function EmberS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em1g" cx="50%" cy="70%" r="50%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><ellipse cx="50" cy="62" rx="18" ry="14" fill="url(#em1g)"/><path d="M50 20 Q44 38 50 48 Q56 38 50 20Z" fill="#f97316"/><path d="M50 28 Q46 40 50 48 Q54 40 50 28Z" fill="#fbbf24"/><circle cx="50" cy="50" r="4" fill="#fef3c7"/></svg>);}
function EmberS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em2g" cx="50%" cy="60%" r="55%"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><ellipse cx="50" cy="65" rx="22" ry="16" fill="url(#em2g)"/><path d="M50 15 Q40 35 44 52 Q50 44 56 52 Q60 35 50 15Z" fill="#f97316"/><path d="M38 28 Q34 44 40 54 Q44 46 48 54 Q44 36 38 28Z" fill="#fb923c" opacity="0.8"/><path d="M62 28 Q66 44 60 54 Q56 46 52 54 Q56 36 62 28Z" fill="#fb923c" opacity="0.8"/><path d="M50 22 Q46 38 50 48 Q54 38 50 22Z" fill="#fbbf24"/><circle cx="50" cy="50" r="5" fill="#fef3c7"/></svg>);}
function EmberS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em3g" cx="50%" cy="55%" r="55%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#431407"/></radialGradient></defs><circle cx="50" cy="55" r="28" fill="url(#em3g)"/><path d="M50 10 Q40 30 44 48 Q50 40 56 48 Q60 30 50 10Z" fill="#fb923c"/><path d="M32 22 Q24 40 30 56 Q36 48 40 56 Q34 36 32 22Z" fill="#f97316" opacity="0.9"/><path d="M68 22 Q76 40 70 56 Q64 48 60 56 Q66 36 68 22Z" fill="#f97316" opacity="0.9"/><path d="M50 16 Q46 34 50 46 Q54 34 50 16Z" fill="#fbbf24"/><circle cx="50" cy="50" r="9" fill="#fef3c7"/><circle cx="50" cy="50" r="5" fill="white"/></svg>);}
function EmberS4(p){var s=p.size||80;var rays=[0,45,90,135,180,225,270,315];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="50%" stopColor="#f97316"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#em4g)"/>{rays.map(function(deg,i){var r=deg*Math.PI/180;var l=i%2===0?16:10;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke="#fbbf24" strokeWidth={i%2===0?3:2} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="14" fill="#fef3c7"/><circle cx="50" cy="50" r="7" fill="white"/><circle cx="44" cy="46" r="3" fill="#7c2d12"/><circle cx="56" cy="46" r="3" fill="#7c2d12"/><path d="M42 56 Q50 62 58 56" stroke="#f97316" strokeWidth="2" fill="none"/></svg>);}
function EmberS5(p){var s=p.size||80;var rays=Array.from({length:16},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#fef3c7"/><stop offset="60%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="36" fill="url(#em5g)" opacity="0.3"/><circle cx="50" cy="50" r="28" fill="url(#em5g)"/>{rays.map(function(i){var r=i*22.5*Math.PI/180;var l=i%4===0?22:i%2===0?15:10;return <line key={i} x1={50+Math.cos(r)*26} y1={50+Math.sin(r)*26} x2={50+Math.cos(r)*(26+l)} y2={50+Math.sin(r)*(26+l)} stroke={i%2===0?"#fbbf24":"#fb923c"} strokeWidth={i%4===0?3.5:2} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="13" fill="white"/><circle cx="44" cy="46" r="4" fill="#92400e"/><circle cx="56" cy="46" r="4" fill="#92400e"/><circle cx="44.5" cy="45.5" r="1.5" fill="white"/><circle cx="56.5" cy="45.5" r="1.5" fill="white"/><path d="M40 57 Q50 65 60 57" stroke="#f97316" strokeWidth="2.5" fill="none"/></svg>);}
function VoidS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><circle cx="50" cy="50" r="20" fill="url(#vo1g)"/><circle cx="50" cy="50" r="8" fill="#0a0010"/><circle cx="50" cy="50" r="20" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.5"/></svg>);}
function VoidS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="60%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="36" ry="12" fill="url(#vo2g)" opacity="0.6"/><circle cx="50" cy="50" r="22" fill="url(#vo2g)"/><ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#7c3aed" strokeWidth="1.5"/><circle cx="50" cy="50" r="10" fill="#0a0010"/><circle cx="50" cy="50" r="4" fill="#4c1d95"/></svg>);}
function VoidS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="50%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="44" ry="14" fill="#4c1d95" opacity="0.4"/><ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="#7c3aed" strokeWidth="2"/><circle cx="50" cy="50" r="26" fill="url(#vo3g)"/><circle cx="50" cy="50" r="14" fill="#0a0010"/><circle cx="50" cy="50" r="6" fill="#6d28d9"/><circle cx="44" cy="46" r="3" fill="#c4b5fd" opacity="0.9"/><circle cx="56" cy="46" r="3" fill="#c4b5fd" opacity="0.9"/></svg>);}
function VoidS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="40%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="46" ry="16" fill="#3b0764" opacity="0.5"/><ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke="#8b5cf6" strokeWidth="2.5"/><circle cx="50" cy="50" r="28" fill="url(#vo4g)"/><circle cx="50" cy="50" r="16" fill="#0a0010"/><circle cx="43" cy="45" r="4" fill="#ddd6fe"/><circle cx="57" cy="45" r="4" fill="#ddd6fe"/><circle cx="43" cy="45" r="2" fill="#0a0010"/><circle cx="57" cy="45" r="2" fill="#0a0010"/></svg>);}
function VoidS5(p){var s=p.size||80;var particles=[[14,26],[86,26],[8,50],[92,50],[14,74],[86,74],[30,10],[70,10]];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="30%" stopColor="#8b5cf6"/><stop offset="70%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="48" ry="18" fill="#2e1065" opacity="0.6"/><ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#a78bfa" strokeWidth="3"/><circle cx="50" cy="50" r="30" fill="url(#vo5g)"/><circle cx="50" cy="50" r="18" fill="#0a0010"/>{particles.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r={i<4?2:1.5} fill="#c4b5fd" opacity={0.8-i*0.05}/>;})}<circle cx="43" cy="44" r="5" fill="#ede9fe"/><circle cx="57" cy="44" r="5" fill="#ede9fe"/><circle cx="43" cy="44" r="2.5" fill="#0a0010"/><circle cx="57" cy="44" r="2.5" fill="#0a0010"/><path d="M40 57 Q50 65 60 57" stroke="#c4b5fd" strokeWidth="2.5" fill="none"/></svg>);}
function IronS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><rect x="34" y="30" width="32" height="40" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1.5"/><rect x="34" y="30" width="32" height="10" rx="2" fill="#4b5563"/><rect x="38" y="44" width="10" height="10" rx="1" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><rect x="52" y="44" width="10" height="10" rx="1" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><rect x="40" y="62" width="20" height="6" rx="1" fill="#4b5563"/><rect x="26" y="34" width="10" height="24" rx="2" fill="#374151" stroke="#6b7280" strokeWidth="1"/><rect x="64" y="34" width="10" height="24" rx="2" fill="#374151" stroke="#6b7280" strokeWidth="1"/></svg>);}
function IronS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><rect x="28" y="24" width="44" height="54" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="2"/><rect x="28" y="24" width="44" height="12" rx="3" fill="#4b5563" stroke="#6b7280" strokeWidth="1"/><rect x="33" y="40" width="14" height="14" rx="2" fill="#1f2937" stroke="#6b7280" strokeWidth="1.2"/><rect x="53" y="40" width="14" height="14" rx="2" fill="#1f2937" stroke="#6b7280" strokeWidth="1.2"/><circle cx="40" cy="47" r="4" fill="#6b7280"/><circle cx="60" cy="47" r="4" fill="#6b7280"/><circle cx="40" cy="47" r="2" fill="#9ca3af"/><circle cx="60" cy="47" r="2" fill="#9ca3af"/><rect x="18" y="28" width="12" height="34" rx="3" fill="#4b5563" stroke="#6b7280" strokeWidth="1.5"/><rect x="70" y="28" width="12" height="34" rx="3" fill="#4b5563" stroke="#6b7280" strokeWidth="1.5"/></svg>);}
function IronS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir3g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4b5563"/><stop offset="100%" stopColor="#1f2937"/></linearGradient></defs><rect x="22" y="18" width="56" height="66" rx="6" fill="url(#ir3g)" stroke="#9ca3af" strokeWidth="2"/><rect x="22" y="18" width="56" height="14" rx="5" fill="#374151" stroke="#6b7280" strokeWidth="1"/><rect x="28" y="36" width="18" height="18" rx="3" fill="#111827" stroke="#6b7280" strokeWidth="1.5"/><rect x="54" y="36" width="18" height="18" rx="3" fill="#111827" stroke="#6b7280" strokeWidth="1.5"/><circle cx="37" cy="45" r="6" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="63" cy="45" r="6" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="37" cy="45" r="3" fill="#d1d5db"/><circle cx="63" cy="45" r="3" fill="#d1d5db"/><rect x="10" y="22" width="14" height="44" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><rect x="76" y="22" width="14" height="44" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/></svg>);}
function IronS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir4g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6b7280"/><stop offset="100%" stopColor="#111827"/></linearGradient></defs><polygon points="50,8 78,22 82,55 65,80 35,80 18,55 22,22" fill="url(#ir4g)" stroke="#d1d5db" strokeWidth="2"/><polygon points="50,16 72,27 76,55 62,74 38,74 24,55 28,27" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><circle cx="41" cy="39" r="5" fill="#374151" stroke="#d1d5db" strokeWidth="1.5"/><circle cx="59" cy="39" r="5" fill="#374151" stroke="#d1d5db" strokeWidth="1.5"/><circle cx="41" cy="39" r="2.5" fill="#f3f4f6"/><circle cx="59" cy="39" r="2.5" fill="#f3f4f6"/><rect x="32" y="52" width="36" height="14" rx="2" fill="#111827"/></svg>);}
function IronS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir5g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9ca3af"/><stop offset="50%" stopColor="#374151"/><stop offset="100%" stopColor="#111827"/></linearGradient></defs><polygon points="50,4 82,18 88,52 70,84 30,84 12,52 18,18" fill="url(#ir5g)" stroke="#f3f4f6" strokeWidth="2.5"/><polygon points="50,12 76,24 82,54 66,80 34,80 18,54 24,24" fill="#1f2937" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="40" cy="38" r="6" fill="#374151" stroke="#f3f4f6" strokeWidth="2"/><circle cx="60" cy="38" r="6" fill="#374151" stroke="#f3f4f6" strokeWidth="2"/><circle cx="40" cy="38" r="3" fill="white"/><circle cx="60" cy="38" r="3" fill="white"/><circle cx="40" cy="38" r="1.5" fill="#111827"/><circle cx="60" cy="38" r="1.5" fill="#111827"/><rect x="30" y="52" width="40" height="16" rx="3" fill="#0a0a0a" stroke="#9ca3af" strokeWidth="1.5"/></svg>);}
function AuroraS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,22 62,44 50,66 38,44" fill="url(#au1g)"/><polygon points="50,22 62,44 50,66 38,44" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.7"/></svg>);}
function AuroraS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><polygon points="50,14 70,36 70,64 50,78 30,64 30,36" fill="url(#au2g)"/><polygon points="50,14 70,36 70,64 50,78 30,64 30,36" fill="none" stroke="#bae6fd" strokeWidth="1.5"/><circle cx="44" cy="44" r="3" fill="#0284c7" opacity="0.8"/><circle cx="56" cy="44" r="3" fill="#0284c7" opacity="0.8"/></svg>);}
function AuroraS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0f9ff"/><stop offset="50%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,10 72,28 80,54 66,76 34,76 20,54 28,28" fill="url(#au3g)"/><polygon points="50,10 72,28 80,54 66,76 34,76 20,54 28,28" fill="none" stroke="#e0f2fe" strokeWidth="2"/><circle cx="43" cy="42" r="4" fill="#0369a1"/><circle cx="57" cy="42" r="4" fill="#0369a1"/><circle cx="43" cy="42" r="2" fill="#e0f2fe"/><circle cx="57" cy="42" r="2" fill="#e0f2fe"/></svg>);}
function AuroraS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><polygon points="50,6 76,22 84,50 76,78 50,88 24,78 16,50 24,22" fill="url(#au4g)"/><polygon points="50,6 76,22 84,50 76,78 50,88 24,78 16,50 24,22" fill="none" stroke="#e0f2fe" strokeWidth="2"/><circle cx="42" cy="42" r="5" fill="#0284c7"/><circle cx="58" cy="42" r="5" fill="#0284c7"/><circle cx="42" cy="42" r="2.5" fill="white"/><circle cx="58" cy="42" r="2.5" fill="white"/><path d="M40 58 Q50 66 60 58" stroke="#7dd3fc" strokeWidth="2.5" fill="none"/></svg>);}
function AuroraS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#bae6fd"/><stop offset="70%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,4 80,20 88,50 80,80 50,92 20,80 12,50 20,20" fill="url(#au5g)"/><polygon points="50,4 80,20 88,50 80,80 50,92 20,80 12,50 20,20" fill="none" stroke="#e0f2fe" strokeWidth="2.5"/><circle cx="42" cy="42" r="6" fill="#0284c7"/><circle cx="58" cy="42" r="6" fill="#0284c7"/><circle cx="42" cy="42" r="3" fill="white"/><circle cx="58" cy="42" r="3" fill="white"/><path d="M38 60 Q50 70 62 60" stroke="#bae6fd" strokeWidth="3" fill="none"/></svg>);}
function VenomS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 20 Q58 32 60 48 Q58 62 50 70 Q42 62 40 48 Q42 32 50 20Z" fill="url(#vn1g)"/><circle cx="44" cy="44" r="2.5" fill="#14532d"/><circle cx="56" cy="44" r="2.5" fill="#14532d"/></svg>);}
function VenomS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#86efac"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 14 Q64 26 68 44 Q68 62 56 74 Q50 80 44 74 Q32 62 32 44 Q36 26 50 14Z" fill="url(#vn2g)"/><circle cx="43" cy="40" r="4" fill="#14532d"/><circle cx="57" cy="40" r="4" fill="#14532d"/><circle cx="43" cy="40" r="2" fill="#86efac"/><circle cx="57" cy="40" r="2" fill="#86efac"/><path d="M48 62 L46 68 M52 62 L54 68" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/></svg>);}
function VenomS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn3g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#bbf7d0"/><stop offset="50%" stopColor="#22c55e"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 10 Q68 20 74 40 Q78 60 64 76 Q57 84 50 86 Q43 84 36 76 Q22 60 26 40 Q32 20 50 10Z" fill="url(#vn3g)"/><circle cx="42" cy="36" r="5" fill="#14532d"/><circle cx="58" cy="36" r="5" fill="#14532d"/><circle cx="42" cy="36" r="2.5" fill="#dcfce7"/><circle cx="58" cy="36" r="2.5" fill="#dcfce7"/><path d="M42 54 Q50 60 58 54" stroke="#4ade80" strokeWidth="2" fill="none"/><path d="M47 62 L44 70 M53 62 L56 70" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>);}
function VenomS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn4g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#dcfce7"/><stop offset="40%" stopColor="#4ade80"/><stop offset="100%" stopColor="#052e16"/></radialGradient></defs><path d="M50 6 Q72 14 80 36 Q86 56 74 74 Q65 86 50 88 Q35 86 26 74 Q14 56 20 36 Q28 14 50 6Z" fill="url(#vn4g)"/><circle cx="41" cy="34" r="6" fill="#052e16"/><circle cx="59" cy="34" r="6" fill="#052e16"/><circle cx="41" cy="34" r="3" fill="#bbf7d0"/><circle cx="59" cy="34" r="3" fill="#bbf7d0"/><path d="M40 54 Q50 62 60 54" stroke="#86efac" strokeWidth="2.5" fill="none"/><path d="M46 64 L42 74 M54 64 L58 74" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/></svg>);}
function VenomS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn5g" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#bbf7d0"/><stop offset="50%" stopColor="#22c55e"/><stop offset="100%" stopColor="#052e16"/></radialGradient></defs><path d="M50 4 Q76 10 86 32 Q94 56 80 76 Q68 92 50 94 Q32 92 20 76 Q6 56 14 32 Q24 10 50 4Z" fill="url(#vn5g)"/><circle cx="40" cy="32" r="8" fill="#052e16"/><circle cx="60" cy="32" r="8" fill="#052e16"/><circle cx="40" cy="32" r="4.5" fill="#dcfce7"/><circle cx="60" cy="32" r="4.5" fill="#dcfce7"/><path d="M38 54 Q50 64 62 54" stroke="#bbf7d0" strokeWidth="3" fill="none"/><path d="M44 66 L40 78 M56 66 L60 78" stroke="#4ade80" strokeWidth="3" strokeLinecap="round"/></svg>);}
function PhantomS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph1g" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="100%" stopColor="#4338ca" stopOpacity="0.3"/></radialGradient></defs><path d="M30 70 Q30 30 50 22 Q70 30 70 70 Q64 64 58 70 Q52 64 50 70 Q48 64 42 70 Q36 64 30 70Z" fill="url(#ph1g)" opacity="0.9"/><circle cx="42" cy="46" r="3" fill="#312e81" opacity="0.6"/><circle cx="58" cy="46" r="3" fill="#312e81" opacity="0.6"/></svg>);}
function PhantomS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="70%" stopColor="#6366f1" stopOpacity="0.5"/><stop offset="100%" stopColor="#312e81" stopOpacity="0.2"/></radialGradient></defs><path d="M26 72 Q26 26 50 18 Q74 26 74 72 Q67 64 62 72 Q57 64 54 72 Q52 66 50 72 Q48 66 46 72 Q43 64 38 72 Q33 64 26 72Z" fill="url(#ph2g)"/><circle cx="42" cy="44" r="4" fill="#312e81" opacity="0.8"/><circle cx="58" cy="44" r="4" fill="#312e81" opacity="0.8"/><circle cx="42" cy="44" r="2" fill="#e0e7ff"/><circle cx="58" cy="44" r="2" fill="#e0e7ff"/></svg>);}
function PhantomS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph3g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="50%" stopColor="#818cf8" stopOpacity="0.7"/><stop offset="100%" stopColor="#312e81" stopOpacity="0.3"/></radialGradient></defs><path d="M22 74 Q22 22 50 14 Q78 22 78 74 Q70 64 65 74 Q60 64 57 74 Q54 66 50 74 Q46 66 43 74 Q40 64 35 74 Q30 64 22 74Z" fill="url(#ph3g)"/><circle cx="40" cy="42" r="5" fill="#312e81"/><circle cx="60" cy="42" r="5" fill="#312e81"/><circle cx="40" cy="42" r="2.5" fill="#e0e7ff"/><circle cx="60" cy="42" r="2.5" fill="#e0e7ff"/><path d="M42 58 Q50 65 58 58" stroke="#818cf8" strokeWidth="2" fill="none"/></svg>);}
function PhantomS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph4g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#a5b4fc"/><stop offset="80%" stopColor="#4f46e5" stopOpacity="0.6"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3"/></radialGradient></defs><path d="M18 76 Q18 18 50 10 Q82 18 82 76 Q73 64 68 76 Q63 64 60 76 Q57 66 50 76 Q43 66 40 76 Q37 64 32 76 Q27 64 18 76Z" fill="url(#ph4g)"/><circle cx="38" cy="40" r="6" fill="#312e81"/><circle cx="62" cy="40" r="6" fill="#312e81"/><circle cx="38" cy="40" r="3" fill="white"/><circle cx="62" cy="40" r="3" fill="white"/><path d="M40 58 Q50 67 60 58" stroke="#a5b4fc" strokeWidth="2.5" fill="none"/></svg>);}
function PhantomS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph5g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#c7d2fe"/><stop offset="70%" stopColor="#6366f1" stopOpacity="0.7"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3"/></radialGradient></defs><path d="M14 78 Q14 14 50 6 Q86 14 86 78 Q76 64 71 78 Q66 64 63 78 Q60 66 50 78 Q40 66 37 78 Q34 64 29 78 Q24 64 14 78Z" fill="url(#ph5g)"/><circle cx="36" cy="38" r="7" fill="#1e1b4b"/><circle cx="64" cy="38" r="7" fill="#1e1b4b"/><circle cx="36" cy="38" r="4" fill="white"/><circle cx="64" cy="38" r="4" fill="white"/><circle cx="36" cy="37" r="2" fill="#312e81"/><circle cx="64" cy="37" r="2" fill="#312e81"/><path d="M38 60 Q50 72 62 60" stroke="#c7d2fe" strokeWidth="3" fill="none"/></svg>);}
function TitanS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#78350f"/></radialGradient></defs><polygon points="50,20 65,50 50,75 35,50" fill="url(#ti1g)"/><polygon points="50,20 65,50 50,75 35,50" fill="none" stroke="#fde68a" strokeWidth="1"/></svg>);}
function TitanS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#92400e"/></radialGradient></defs><polygon points="50,14 68,32 74,56 58,76 42,76 26,56 32,32" fill="url(#ti2g)"/><polygon points="50,14 68,32 74,56 58,76 42,76 26,56 32,32" fill="none" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="42" cy="46" r="4" fill="#78350f"/><circle cx="58" cy="46" r="4" fill="#78350f"/><circle cx="42" cy="46" r="2" fill="#fef3c7"/><circle cx="58" cy="46" r="2" fill="#fef3c7"/></svg>);}
function TitanS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ti3g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/></linearGradient></defs><polygon points="50,10 72,24 80,50 72,76 50,84 28,76 20,50 28,24" fill="url(#ti3g)"/><polygon points="50,10 72,24 80,50 72,76 50,84 28,76 20,50 28,24" fill="none" stroke="#fbbf24" strokeWidth="2"/><circle cx="41" cy="43" r="5" fill="#78350f"/><circle cx="59" cy="43" r="5" fill="#78350f"/><circle cx="41" cy="43" r="2.5" fill="#fef3c7"/><circle cx="59" cy="43" r="2.5" fill="#fef3c7"/><path d="M40 58 Q50 66 60 58" stroke="#fbbf24" strokeWidth="2" fill="none"/></svg>);}
function TitanS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ti4g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/></linearGradient></defs><polygon points="50,6 76,18 86,46 76,74 50,86 24,74 14,46 24,18" fill="url(#ti4g)"/><polygon points="50,6 76,18 86,46 76,74 50,86 24,74 14,46 24,18" fill="none" stroke="#fbbf24" strokeWidth="2.5"/><circle cx="40" cy="45" r="5" fill="#92400e" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="60" cy="45" r="5" fill="#92400e" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="40" cy="45" r="2.5" fill="#fef3c7"/><circle cx="60" cy="45" r="2.5" fill="#fef3c7"/><path d="M38 60 Q50 70 62 60" stroke="#fde68a" strokeWidth="2.5" fill="none"/></svg>);}
function TitanS5(p){var s=p.size||80;var pts=[[50,4],[78,16],[88,46],[78,76],[50,88],[22,76],[12,46],[22,16]];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="80%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/></radialGradient></defs><polygon points="50,4 78,16 88,46 78,76 50,88 22,76 12,46 22,16" fill="url(#ti5g)"/><polygon points="50,4 78,16 88,46 78,76 50,88 22,76 12,46 22,16" fill="none" stroke="#fef3c7" strokeWidth="3"/>{pts.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r="2" fill="#fbbf24"/>;})}<circle cx="40" cy="42" r="7" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5"/><circle cx="60" cy="42" r="7" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5"/><circle cx="40" cy="42" r="4" fill="#fef3c7"/><circle cx="60" cy="42" r="4" fill="#fef3c7"/><path d="M38 60 Q50 72 62 60" stroke="#fef3c7" strokeWidth="3" fill="none"/></svg>);}
function StormS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef08a"/><stop offset="100%" stopColor="#713f12"/></radialGradient></defs><polygon points="56,18 46,46 54,46 44,80 62,44 52,44" fill="url(#st1g)"/></svg>);}
function StormS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef9c3"/><stop offset="100%" stopColor="#854d0e"/></radialGradient></defs><circle cx="50" cy="50" r="24" fill="#1c1917" stroke="#ca8a04" strokeWidth="1.5"/><polygon points="57,22 45,48 55,48 43,78 65,44 53,44" fill="url(#st2g)"/><circle cx="44" cy="42" r="3" fill="#fef08a" opacity="0.7"/><circle cx="56" cy="42" r="3" fill="#fef08a" opacity="0.7"/></svg>);}
function StormS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#92400e"/><stop offset="100%" stopColor="#0a0a00"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#st3g)"/><circle cx="50" cy="50" r="30" fill="none" stroke="#ca8a04" strokeWidth="1.5"/><polygon points="58,18 44,46 56,46 42,82 68,42 54,42" fill="#fef08a"/><circle cx="42" cy="40" r="4" fill="#fef08a" opacity="0.9"/><circle cx="58" cy="40" r="4" fill="#fef08a" opacity="0.9"/><circle cx="42" cy="40" r="2" fill="#78350f"/><circle cx="58" cy="40" r="2" fill="#78350f"/></svg>);}
function StormS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#b45309"/><stop offset="100%" stopColor="#0a0500"/></radialGradient></defs><circle cx="50" cy="50" r="38" fill="url(#st4g)"/><circle cx="50" cy="50" r="28" fill="none" stroke="#ca8a04" strokeWidth="0.8" opacity="0.8"/><circle cx="50" cy="50" r="20" fill="none" stroke="#ca8a04" strokeWidth="0.8" opacity="0.5"/><polygon points="60,14 44,46 58,46 40,86 72,40 56,40" fill="#fef08a"/><circle cx="40" cy="38" r="5" fill="#fef08a"/><circle cx="58" cy="38" r="5" fill="#fef08a"/><circle cx="40" cy="38" r="2.5" fill="#78350f"/><circle cx="58" cy="38" r="2.5" fill="#78350f"/></svg>);}
function StormS5(p){var s=p.size||80;var bolts=Array.from({length:6},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef9c3"/><stop offset="30%" stopColor="#eab308"/><stop offset="70%" stopColor="#92400e"/><stop offset="100%" stopColor="#0a0500"/></radialGradient></defs><circle cx="50" cy="50" r="42" fill="url(#st5g)"/><circle cx="50" cy="50" r="42" fill="none" stroke="#fef08a" strokeWidth="2"/>{bolts.map(function(i){var angle=(i*60)*Math.PI/180;var x1=50+Math.cos(angle)*28;var y1=50+Math.sin(angle)*28;var x2=50+Math.cos(angle)*42;var y2=50+Math.sin(angle)*42;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fef9c3" strokeWidth="2" strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="22" fill="#0a0500"/><polygon points="58,28 42,52 56,52 38,76 70,46 54,46" fill="#fef08a"/><circle cx="40" cy="38" r="6" fill="#fef08a" stroke="#0a0500" strokeWidth="1.5"/><circle cx="60" cy="38" r="6" fill="#fef08a" stroke="#0a0500" strokeWidth="1.5"/><circle cx="40" cy="38" r="3" fill="#78350f"/><circle cx="60" cy="38" r="3" fill="#78350f"/></svg>);}
function NovaS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="18" fill="url(#nv1g)"/><circle cx="50" cy="50" r="6" fill="#fdf4ff"/></svg>);}
function NovaS2(p){var s=p.size||80;var spikes=[0,72,144,216,288];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="22" fill="url(#nv2g)"/>{spikes.map(function(deg,i){var r=deg*Math.PI/180;return <line key={i} x1={50+Math.cos(r)*20} y1={50+Math.sin(r)*20} x2={50+Math.cos(r)*32} y2={50+Math.sin(r)*32} stroke="#e879f9" strokeWidth="3" strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="10" fill="#fdf4ff"/><circle cx="44" cy="46" r="3" fill="#701a75"/><circle cx="56" cy="46" r="3" fill="#701a75"/></svg>);}
function NovaS3(p){var s=p.size||80;var spikes=Array.from({length:8},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fdf4ff"/><stop offset="40%" stopColor="#d946ef"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="26" fill="url(#nv3g)"/>{spikes.map(function(i){var r=i*45*Math.PI/180;var l=i%2===0?14:9;return <line key={i} x1={50+Math.cos(r)*24} y1={50+Math.sin(r)*24} x2={50+Math.cos(r)*(24+l)} y2={50+Math.sin(r)*(24+l)} stroke="#f0abfc" strokeWidth={i%2===0?3:2} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="12" fill="#fdf4ff"/><circle cx="43" cy="46" r="4" fill="#701a75"/><circle cx="57" cy="46" r="4" fill="#701a75"/></svg>);}
function NovaS4(p){var s=p.size||80;var spikes=Array.from({length:12},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#f0abfc"/><stop offset="70%" stopColor="#a21caf"/><stop offset="100%" stopColor="#4a044e"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#nv4g)"/>{spikes.map(function(i){var r=i*30*Math.PI/180;var l=i%3===0?18:i%3===1?12:8;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke={i%2===0?"#f0abfc":"#e879f9"} strokeWidth={i%3===0?3:2} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="14" fill="#fdf4ff"/><circle cx="42" cy="46" r="5" fill="#701a75"/><circle cx="58" cy="46" r="5" fill="#701a75"/><circle cx="42" cy="46" r="2.5" fill="white"/><circle cx="58" cy="46" r="2.5" fill="white"/></svg>);}
function NovaS5(p){var s=p.size||80;var spikes=Array.from({length:16},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#fdf4ff"/><stop offset="50%" stopColor="#d946ef"/><stop offset="80%" stopColor="#86198f"/><stop offset="100%" stopColor="#2e1065"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#nv5g)"/>{spikes.map(function(i){var r=i*22.5*Math.PI/180;var l=i%4===0?22:i%2===0?15:10;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke={i%2===0?"#f0abfc":"#d946ef"} strokeWidth={i%4===0?3.5:2} strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="14" fill="white"/><circle cx="42" cy="46" r="6" fill="#701a75"/><circle cx="58" cy="46" r="6" fill="#701a75"/><circle cx="42" cy="46" r="3" fill="white"/><circle cx="58" cy="46" r="3" fill="white"/><path d="M38 60 Q50 72 62 60" stroke="#f0abfc" strokeWidth="3" fill="none"/></svg>);}
function ReefS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0e7490"/></radialGradient></defs><ellipse cx="50" cy="52" rx="20" ry="24" fill="url(#rf1g)"/><circle cx="44" cy="48" r="3" fill="#0e7490" opacity="0.7"/><circle cx="56" cy="48" r="3" fill="#0e7490" opacity="0.7"/></svg>);}
function ReefS2(p){var s=p.size||80;var tentacles=Array.from({length:6},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#a5f3fc"/><stop offset="100%" stopColor="#0891b2"/></radialGradient></defs><ellipse cx="50" cy="46" rx="26" ry="28" fill="url(#rf2g)"/>{tentacles.map(function(i){var x=30+i*8;var wave=i%2===0?8:-8;return <path key={i} d={"M"+x+" 68 Q"+(x+wave)+" 76 "+x+" 84"} stroke="#0891b2" strokeWidth="3" fill="none" strokeLinecap="round"/>;})}<circle cx="42" cy="42" r="4" fill="#0e7490"/><circle cx="58" cy="42" r="4" fill="#0e7490"/><circle cx="42" cy="42" r="2" fill="#e0f2fe"/><circle cx="58" cy="42" r="2" fill="#e0f2fe"/></svg>);}
function ReefS3(p){var s=p.size||80;var tentacles=Array.from({length:8},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf3g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="50%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#0e7490"/></radialGradient></defs><ellipse cx="50" cy="44" rx="30" ry="30" fill="url(#rf3g)"/>{tentacles.map(function(i){var x=26+i*7;var wave=i%2===0?10:-10;return <path key={i} d={"M"+x+" 68 Q"+(x+wave)+" 78 "+x+" 88"} stroke="#0284c7" strokeWidth={i%2===0?3.5:2.5} fill="none" strokeLinecap="round"/>;})}<circle cx="41" cy="40" r="5" fill="#0e7490"/><circle cx="59" cy="40" r="5" fill="#0e7490"/><circle cx="41" cy="40" r="2.5" fill="#e0f2fe"/><circle cx="59" cy="40" r="2.5" fill="#e0f2fe"/></svg>);}
function ReefS4(p){var s=p.size||80;var tentacles=Array.from({length:10},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf4g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0c4a6e"/></radialGradient></defs><ellipse cx="50" cy="42" rx="34" ry="32" fill="url(#rf4g)"/>{tentacles.map(function(i){var x=18+i*7;var wave=i%2===0?12:-12;return <path key={i} d={"M"+x+" 66 Q"+(x+wave/2)+" 76 "+x+" 86"} stroke="#0284c7" strokeWidth={i%3===0?4:3} fill="none" strokeLinecap="round"/>;})}<circle cx="40" cy="38" r="6" fill="#0c4a6e"/><circle cx="60" cy="38" r="6" fill="#0c4a6e"/><circle cx="40" cy="38" r="3" fill="#e0f2fe"/><circle cx="60" cy="38" r="3" fill="#e0f2fe"/></svg>);}
function ReefS5(p){var s=p.size||80;var tentacles=Array.from({length:12},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf5g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#bae6fd"/><stop offset="70%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#082f49"/></radialGradient></defs><ellipse cx="50" cy="40" rx="38" ry="34" fill="url(#rf5g)"/>{tentacles.map(function(i){var x=14+i*6.5;var wave=i%2===0?14:-14;return <path key={i} d={"M"+x+" 64 Q"+(x+wave/2)+" 74 "+x+" 82"} stroke="#0284c7" strokeWidth={i%4===0?4.5:3} fill="none" strokeLinecap="round"/>;})}<circle cx="40" cy="34" r="8" fill="#082f49"/><circle cx="60" cy="34" r="8" fill="#082f49"/><circle cx="40" cy="34" r="4.5" fill="#e0f2fe"/><circle cx="60" cy="34" r="4.5" fill="#e0f2fe"/><path d="M38 56 Q50 68 62 56" stroke="#bae6fd" strokeWidth="3" fill="none"/></svg>);}
function ShadowS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><polygon points="50,20 60,46 50,56 40,46" fill="#1e1b4b"/><polygon points="50,20 60,46 50,56 40,46" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.6"/><circle cx="44" cy="40" r="2" fill="#818cf8" opacity="0.8"/><circle cx="56" cy="40" r="2" fill="#818cf8" opacity="0.8"/></svg>);}
function ShadowS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="sh2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#312e81"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><polygon points="50,16 66,34 70,56 60,74 40,74 30,56 34,34" fill="url(#sh2g)"/><polygon points="50,16 66,34 70,56 60,74 40,74 30,56 34,34" fill="none" stroke="#6366f1" strokeWidth="1.5"/><circle cx="42" cy="44" r="3.5" fill="#818cf8"/><circle cx="58" cy="44" r="3.5" fill="#818cf8"/><circle cx="42" cy="44" r="1.5" fill="white" opacity="0.9"/><circle cx="58" cy="44" r="1.5" fill="white" opacity="0.9"/></svg>);}
function ShadowS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="sh3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4338ca"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><polygon points="50,10 70,26 76,50 70,74 50,84 30,74 24,50 30,26" fill="url(#sh3g)"/><polygon points="50,10 70,26 76,50 70,74 50,84 30,74 24,50 30,26" fill="none" stroke="#818cf8" strokeWidth="2"/><circle cx="40" cy="42" r="5" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5"/><circle cx="60" cy="42" r="5" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5"/><circle cx="40" cy="42" r="2.5" fill="#c7d2fe"/><circle cx="60" cy="42" r="2.5" fill="#c7d2fe"/></svg>);}
function ShadowS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="sh4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6366f1"/><stop offset="60%" stopColor="#312e81"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><polygon points="50,6 74,20 82,48 74,76 50,86 26,76 18,48 26,20" fill="url(#sh4g)"/><polygon points="50,6 74,20 82,48 74,76 50,86 26,76 18,48 26,20" fill="none" stroke="#818cf8" strokeWidth="2"/><circle cx="38" cy="40" r="6" fill="#0a0014" stroke="#a5b4fc" strokeWidth="2"/><circle cx="62" cy="40" r="6" fill="#0a0014" stroke="#a5b4fc" strokeWidth="2"/><circle cx="38" cy="40" r="3" fill="#c7d2fe"/><circle cx="62" cy="40" r="3" fill="#c7d2fe"/><path d="M38 58 Q50 68 62 58" stroke="#a5b4fc" strokeWidth="2.5" fill="none"/></svg>);}
function ShadowS5(p){var s=p.size||80;var shards=[[50,4],[82,20],[90,50],[82,80],[50,92],[18,80],[10,50],[18,20]];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="sh5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a5b4fc"/><stop offset="30%" stopColor="#6366f1"/><stop offset="70%" stopColor="#312e81"/><stop offset="100%" stopColor="#0a0014"/></radialGradient></defs><polygon points="50,4 82,20 90,50 82,80 50,92 18,80 10,50 18,20" fill="url(#sh5g)"/><polygon points="50,4 82,20 90,50 82,80 50,92 18,80 10,50 18,20" fill="none" stroke="#c7d2fe" strokeWidth="2.5"/>{shards.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r="2.5" fill="#818cf8"/>;})}<circle cx="36" cy="38" r="7" fill="#0a0014" stroke="#c7d2fe" strokeWidth="2"/><circle cx="64" cy="38" r="7" fill="#0a0014" stroke="#c7d2fe" strokeWidth="2"/><circle cx="36" cy="38" r="4" fill="#e0e7ff"/><circle cx="64" cy="38" r="4" fill="#e0e7ff"/><path d="M36 60 Q50 74 64 60" stroke="#c7d2fe" strokeWidth="3" fill="none"/></svg>);}

function renderArt(A,size){if(!A)return null;return <A size={size}/>;}

const PETS = [
  { id:"ember",   name:"Ember",   color:"#f97316", desc:"Born from a dying coal. Grows into a star that cannot be extinguished.", stages:[
    {level:1,  form:"Dying Ember",      Art:EmberS1, desc:"Almost out. But not yet."},
    {level:3,  form:"Rising Flame",     Art:EmberS2, desc:"Something caught. It is not stopping."},
    {level:5,  form:"Burning Core",     Art:EmberS3, desc:"Solid fire. It warms everything near it."},
    {level:7,  form:"Solar Bloom",      Art:EmberS4, desc:"Expanded past what contained it."},
    {level:10, form:"The Undying Sun",  Art:EmberS5, desc:"Burns cold. Burns forever. Cannot be put out."},
  ]},
  { id:"void",    name:"Void",    color:"#8b5cf6", desc:"A black hole that learned to think. Pulls everything toward its gravity.", stages:[
    {level:1,  form:"Dark Point",       Art:VoidS1, desc:"Nothing to see. Everything to fear."},
    {level:3,  form:"Event Horizon",    Art:VoidS2, desc:"The ring forms. Things get close and don't leave."},
    {level:5,  form:"Collapsing Star",  Art:VoidS3, desc:"Consuming itself to become something greater."},
    {level:7,  form:"Singularity",      Art:VoidS4, desc:"Space bends. Time bends. It does not."},
    {level:10, form:"The Absolute",     Art:VoidS5, desc:"There is no outside of it anymore."},
  ]},
  { id:"iron",    name:"Ironclad",color:"#9ca3af", desc:"Forged in fire. Tested by everything. Still standing.", stages:[
    {level:1,  form:"Raw Frame",        Art:IronS1, desc:"Bolted together. Not pretty. Functional."},
    {level:3,  form:"First Armor",      Art:IronS2, desc:"The plates are setting. Shape emerging."},
    {level:5,  form:"War Machine",      Art:IronS3, desc:"All systems operational. Purpose: withstand."},
    {level:7,  form:"Iron Fortress",    Art:IronS4, desc:"Has absorbed every hit. Has not moved."},
    {level:10, form:"The Indestructible",Art:IronS5, desc:"You cannot break what has survived everything."},
  ]},
  { id:"aurora",  name:"Aurora",  color:"#38bdf8", desc:"A crystal being grown from pure arctic silence.", stages:[
    {level:1,  form:"Ice Shard",        Art:AuroraS1, desc:"One perfect cut. One perfect edge."},
    {level:3,  form:"Frost Prism",      Art:AuroraS2, desc:"Light bends through it. Colors appear."},
    {level:5,  form:"Crystal Form",     Art:AuroraS3, desc:"Many faces. One being. Perfectly cold."},
    {level:7,  form:"Glacial Crown",    Art:AuroraS4, desc:"The tundra grows where it walks."},
    {level:10, form:"The Eternal Ice",  Art:AuroraS5, desc:"Nothing melts it."},
  ]},
  { id:"venom",   name:"Venom",   color:"#4ade80", desc:"A serpent that got larger every time something tried to stop it.", stages:[
    {level:1,  form:"Hatchling",        Art:VenomS1, desc:"Tiny. Already dangerous."},
    {level:3,  form:"Fang",             Art:VenomS2, desc:"The venom works fast. The bite is faster."},
    {level:5,  form:"River Serpent",    Art:VenomS3, desc:"Moves without sound. Strikes without warning."},
    {level:7,  form:"Apex Predator",    Art:VenomS4, desc:"At the top of every food chain it entered."},
    {level:10, form:"The Ancient One",  Art:VenomS5, desc:"Older than the forest. Larger than the river."},
  ]},
  { id:"phantom", name:"Phantom", color:"#818cf8", desc:"Neither here nor gone. Passes through walls. Passes through time.", stages:[
    {level:1,  form:"Wisp",             Art:PhantomS1, desc:"A breath of something. Gone if you look."},
    {level:3,  form:"Specter",          Art:PhantomS2, desc:"Visible now. Still not quite real."},
    {level:5,  form:"Haunt",            Art:PhantomS3, desc:"It has chosen this place. And this person."},
    {level:7,  form:"Revenant",         Art:PhantomS4, desc:"Has returned from somewhere worse. Is fine now."},
    {level:10, form:"The Undying",      Art:PhantomS5, desc:"Death already tried. Did not stick."},
  ]},
  { id:"titan",   name:"Titan",   color:"#fbbf24", desc:"A golden warrior that grows more legendary with every challenge.", stages:[
    {level:1,  form:"Warrior's Oath",   Art:TitanS1, desc:"The promise made before the battle."},
    {level:3,  form:"Bronze Guard",     Art:TitanS2, desc:"The first victories have been won."},
    {level:5,  form:"Golden Knight",    Art:TitanS3, desc:"The legend is beginning to form."},
    {level:7,  form:"Warlord",          Art:TitanS4, desc:"Armies step aside. No contest necessary."},
    {level:10, form:"Eternal Champion", Art:TitanS5, desc:"Songs are written. The warrior has not finished."},
  ]},
  { id:"storm",   name:"Storm",   color:"#eab308", desc:"Pure electrical fury wearing the shape of a living thing.", stages:[
    {level:1,  form:"Static",           Art:StormS1, desc:"A charge in the air. Hair stands up."},
    {level:3,  form:"Spark",            Art:StormS2, desc:"The first bolt has been thrown."},
    {level:5,  form:"Thunderhead",      Art:StormS3, desc:"Weather patterns change when it moves."},
    {level:7,  form:"Lightning Lord",   Art:StormS4, desc:"Controls the storm. Is the storm."},
    {level:10, form:"The Tempest",      Art:StormS5, desc:"The sky obeys. The thunder is its voice."},
  ]},
  { id:"nova",    name:"Nova",    color:"#d946ef", desc:"An explosion that refuses to fade. Gets brighter every moment.", stages:[
    {level:1,  form:"Pinpoint",         Art:NovaS1, desc:"Compressed to almost nothing. Extremely dangerous."},
    {level:3,  form:"Burst",            Art:NovaS2, desc:"The first expansion. Cannot be contained."},
    {level:5,  form:"Radiant",          Art:NovaS3, desc:"Visible from far away now. Getting closer."},
    {level:7,  form:"Supernova",        Art:NovaS4, desc:"Exploded once. Growing from the wreckage."},
    {level:10, form:"The Eternal Bloom",Art:NovaS5, desc:"The explosion never ended. It became everything."},
  ]},
  { id:"reef",    name:"Reef",    color:"#22d3ee", desc:"An ocean hunter. Patient as the tide. Inevitable as the sea.", stages:[
    {level:1,  form:"Larvae",           Art:ReefS1, desc:"Translucent. Almost invisible. Learning."},
    {level:3,  form:"Jellyfish",        Art:ReefS2, desc:"Floats with purpose. Stings without warning."},
    {level:5,  form:"Kraken Pup",       Art:ReefS3, desc:"The tentacles have opinions now."},
    {level:7,  form:"Deep Hunter",      Art:ReefS4, desc:"The deep water belongs to it."},
    {level:10, form:"The Leviathan",    Art:ReefS5, desc:"Older than the ocean. The ocean knows."},
  ]},
];

const PET_LEVELS = [
  {level:1,  name:"Newborn",  xpReq:0},
  {level:2,  name:"Waking",   xpReq:100},
  {level:3,  name:"Growing",  xpReq:250},
  {level:4,  name:"Learning", xpReq:500},
  {level:5,  name:"Evolved",  xpReq:900},
  {level:6,  name:"Strong",   xpReq:1400},
  {level:7,  name:"Powerful", xpReq:2100},
  {level:8,  name:"Champion", xpReq:3000},
  {level:9,  name:"Legend",   xpReq:4200},
  {level:10, name:"Eternal",  xpReq:6000},
];

const WORKOUT_TYPES = [
  {id:"run",        label:"Running",        emoji:"🏃",  met:9.8 },
  {id:"walk",       label:"Walking",        emoji:"🚶",  met:3.5 },
  {id:"bike",       label:"Cycling",        emoji:"🚴",  met:8.0 },
  {id:"swim",       label:"Swimming",       emoji:"🏊",  met:7.0 },
  {id:"lift",       label:"Weight Training",emoji:"🏋️", met:5.0 },
  {id:"hiit",       label:"HIIT",           emoji:"⚡",  met:10.0},
  {id:"calisthenics",label:"Calisthenics",  emoji:"🤸",  met:8.0 },
  {id:"pullups",    label:"Pull-ups",       emoji:"💪",  met:6.0 },
  {id:"pushups",    label:"Push-ups",       emoji:"⬆️",  met:5.5 },
  {id:"yoga",       label:"Yoga",           emoji:"🧘",  met:2.5 },
  {id:"pilates",    label:"Pilates",        emoji:"🩰",  met:3.0 },
  {id:"jump_rope",  label:"Jump Rope",      emoji:"⭕",  met:12.0},
  {id:"sport",      label:"Sports",         emoji:"⚽",  met:7.5 },
  {id:"climb",      label:"Climbing",       emoji:"🧗",  met:8.0 },
  {id:"dance",      label:"Dancing",        emoji:"💃",  met:5.5 },
  {id:"row",        label:"Rowing",         emoji:"🚣",  met:7.0 },
  {id:"elliptic",   label:"Elliptical",     emoji:"🔄",  met:6.5 },
  {id:"boxing",     label:"Boxing",         emoji:"🥊",  met:9.0 },
  {id:"martial",    label:"Martial Arts",   emoji:"🥋",  met:10.0},
  {id:"hike",       label:"Hiking",         emoji:"🥾",  met:6.0 },
  {id:"skating",    label:"Skating",        emoji:"⛸️",  met:7.0 },
  {id:"other",      label:"Other",          emoji:"🔥",  met:5.0 },
];

const QUICK_FOODS = [
  // ── PROTEINS ──
  {kw:["chicken breast","grilled chicken","baked chicken","chicken"],  name:"Chicken Breast",         emoji:"🍗", cal:185, pro:35, car:0,   fat:4,   fib:0,  perOz:46.25},
  {kw:["salmon","salmon fillet"],                                       name:"Salmon",                 emoji:"🐟", cal:234, pro:31, car:0,   fat:12,  fib:0,  perOz:58.5},
  {kw:["ground beef","beef","burger patty"],                           name:"Ground Beef (90/10)",    emoji:"🥩", cal:196, pro:24, car:0,   fat:11,  fib:0,  perOz:49.0},
  {kw:["ground turkey","turkey"],                                       name:"Ground Turkey",          emoji:"🦃", cal:170, pro:22, car:0,   fat:9,   fib:0,  perOz:42.5},
  {kw:["tuna","tuna can"],                                             name:"Canned Tuna",            emoji:"🐟", cal:109, pro:25, car:0,   fat:1,   fib:0},
  {kw:["shrimp","prawns"],                                             name:"Shrimp",                 emoji:"🦐", cal:112, pro:24, car:0,   fat:1.5, fib:0,  perOz:28.0},
  {kw:["tilapia","white fish"],                                        name:"Tilapia",                emoji:"🐠", cal:111, pro:23, car:0,   fat:2,   fib:0,  perOz:27.8},
  {kw:["egg white","egg whites"],                                      name:"Egg Whites (3)",         emoji:"🥚", cal:51,  pro:11, car:0.6, fat:0.3, fib:0},
  {kw:["egg","eggs","whole egg"],                                      name:"Egg (whole)",            emoji:"🥚", cal:72,  pro:6,  car:0.4, fat:5,   fib:0},
  {kw:["greek yogurt","yogurt"],                                       name:"Greek Yogurt",           emoji:"🫙", cal:100, pro:17, car:6,   fat:0,   fib:0,  perCup:1},
  {kw:["cottage cheese"],                                              name:"Cottage Cheese",         emoji:"🫙", cal:90,  pro:12, car:5,   fat:2.5, fib:0},
  {kw:["protein shake","protein powder","whey","protein"],             name:"Protein Shake",          emoji:"🥤", cal:120, pro:25, car:5,   fat:2,   fib:1},
  {kw:["quest bar","protein bar","bar"],                               name:"Quest Bar",              emoji:"💪", cal:200, pro:21, car:22,  fat:8,   fib:14},
  {kw:["fairlife","core power"],                                       name:"Fairlife Core Power",    emoji:"🥤", cal:230, pro:42, car:13,  fat:3.5, fib:0},
  {kw:["premier protein"],                                             name:"Premier Protein",        emoji:"🥤", cal:160, pro:30, car:6,   fat:3,   fib:1},
  {kw:["beef jerky","jerky"],                                          name:"Beef Jerky",             emoji:"🥩", cal:116, pro:9,  car:3,   fat:7,   fib:0},
  {kw:["deli turkey","turkey breast"],                                 name:"Deli Turkey",            emoji:"🦃", cal:60,  pro:11, car:1,   fat:1,   fib:0},
  {kw:["tofu","firm tofu"],                                            name:"Firm Tofu",              emoji:"⬜", cal:144, pro:17, car:4,   fat:8,   fib:2,  perCup:1},
  // ── CARBS ──
  {kw:["white rice","jasmine rice"],                                   name:"White Rice",             emoji:"🍚", cal:206, pro:4,  car:45,  fat:0.4, fib:0.6,perCup:1},
  {kw:["brown rice"],                                                   name:"Brown Rice",             emoji:"🍚", cal:216, pro:5,  car:45,  fat:1.8, fib:3.5,perCup:1},
  {kw:["rice"],                                                         name:"White Rice",             emoji:"🍚", cal:206, pro:4,  car:45,  fat:0.4, fib:0.6,perCup:1},
  {kw:["oatmeal","oats"],                                              name:"Oatmeal",                emoji:"🥣", cal:158, pro:6,  car:27,  fat:3,   fib:4,  perCup:1},
  {kw:["sweet potato","yam"],                                          name:"Sweet Potato",           emoji:"🍠", cal:103, pro:2,  car:24,  fat:0.1, fib:3.8},
  {kw:["pasta","spaghetti","noodles"],                                  name:"Pasta",                  emoji:"🍝", cal:220, pro:8,  car:43,  fat:1.3, fib:2.5,perCup:1},
  {kw:["bread","toast","slice of bread"],                              name:"Bread (1 slice)",        emoji:"🍞", cal:81,  pro:4,  car:14,  fat:1,   fib:1.9},
  {kw:["ezekiel bread","sprouted bread"],                              name:"Ezekiel Bread",          emoji:"🍞", cal:80,  pro:4,  car:15,  fat:0.5, fib:3},
  {kw:["quinoa"],                                                       name:"Quinoa",                 emoji:"🌾", cal:222, pro:8,  car:39,  fat:4,   fib:5,  perCup:1},
  {kw:["potato","white potato"],                                       name:"Potato (medium)",        emoji:"🥔", cal:161, pro:4,  car:37,  fat:0.2, fib:3.8},
  // ── VEGGIES ──
  {kw:["broccoli"],                                                     name:"Broccoli",               emoji:"🥦", cal:55,  pro:4,  car:11,  fat:0.6, fib:5,  perCup:1},
  {kw:["spinach"],                                                      name:"Spinach",                emoji:"🥬", cal:14,  pro:1.7,car:2,   fat:0.2, fib:1.3,perCup:1},
  {kw:["asparagus"],                                                    name:"Asparagus",              emoji:"🌿", cal:27,  pro:3,  car:5,   fat:0.2, fib:2.8},
  {kw:["bell pepper","pepper"],                                        name:"Bell Pepper",            emoji:"🫑", cal:31,  pro:1,  car:7,   fat:0.3, fib:2.5},
  {kw:["zucchini","courgette"],                                        name:"Zucchini",               emoji:"🥒", cal:33,  pro:2.4,car:6,   fat:0.6, fib:2},
  {kw:["kale"],                                                         name:"Kale",                   emoji:"🥬", cal:33,  pro:2.9,car:6,   fat:0.6, fib:1.3,perCup:1},
  {kw:["cucumber"],                                                     name:"Cucumber",               emoji:"🥒", cal:16,  pro:0.7,car:3.8, fat:0.1, fib:0.5},
  {kw:["tomato"],                                                       name:"Tomato",                 emoji:"🍅", cal:35,  pro:1.7,car:7,   fat:0.4, fib:2.2},
  // ── FRUITS ──
  {kw:["avocado","avo"],                                               name:"Avocado (half)",         emoji:"🥑", cal:120, pro:1.5,car:6,   fat:11,  fib:5},
  {kw:["banana"],                                                       name:"Banana",                 emoji:"🍌", cal:105, pro:1.3,car:27,  fat:0.4, fib:3.1},
  {kw:["apple"],                                                        name:"Apple",                  emoji:"🍎", cal:95,  pro:0.5,car:25,  fat:0.3, fib:4.4},
  {kw:["blueberries","blueberry"],                                     name:"Blueberries",            emoji:"🫐", cal:84,  pro:1.1,car:21,  fat:0.5, fib:3.6,perCup:1},
  {kw:["strawberries","strawberry"],                                   name:"Strawberries",           emoji:"🍓", cal:49,  pro:1,  car:12,  fat:0.5, fib:3,  perCup:1},
  {kw:["mango"],                                                        name:"Mango (1 cup)",          emoji:"🥭", cal:107, pro:0.8,car:28,  fat:0.4, fib:3},
  {kw:["orange"],                                                       name:"Orange",                 emoji:"🍊", cal:62,  pro:1.2,car:15,  fat:0.2, fib:3.1},
  // ── FATS ──
  {kw:["peanut butter","pb"],                                          name:"Peanut Butter (2 tbsp)", emoji:"🥜", cal:188, pro:8,  car:6,   fat:16,  fib:2},
  {kw:["almond butter"],                                               name:"Almond Butter (2 tbsp)", emoji:"🌰", cal:196, pro:7,  car:6,   fat:18,  fib:3.3},
  {kw:["almonds","almond"],                                            name:"Almonds (1 oz)",         emoji:"🌰", cal:164, pro:6,  car:6,   fat:14,  fib:3.5},
  {kw:["olive oil","oil"],                                             name:"Olive Oil (1 tbsp)",     emoji:"🫒", cal:119, pro:0,  car:0,   fat:13.5,fib:0},
  {kw:["mixed nuts","nuts"],                                           name:"Mixed Nuts (1 oz)",      emoji:"🥜", cal:173, pro:5,  car:8,   fat:16,  fib:2},
  {kw:["black beans","beans"],                                         name:"Black Beans",            emoji:"🫘", cal:114, pro:7.6,car:20,  fat:0.5, fib:7.5,perCup:228},
  // ── DAIRY ──
  {kw:["milk","whole milk"],                                           name:"Milk (1 cup)",           emoji:"🥛", cal:149, pro:8,  car:12,  fat:8,   fib:0},
  {kw:["skim milk","low fat milk"],                                    name:"Skim Milk (1 cup)",      emoji:"🥛", cal:83,  pro:8,  car:12,  fat:0.2, fib:0},
  {kw:["cheese","cheddar"],                                            name:"Cheddar Cheese (1 oz)",  emoji:"🧀", cal:115, pro:7,  car:0.4, fat:9,   fib:0},
  {kw:["mozzarella"],                                                   name:"Mozzarella (1 oz)",      emoji:"🧀", cal:85,  pro:6,  car:1,   fat:6,   fib:0},
  {kw:["butter"],                                                       name:"Butter (1 tbsp)",        emoji:"🧈", cal:102, pro:0.1,car:0,   fat:11.5,fib:0},
  // ── TORTILLAS & WRAPS ──
  {kw:["low carb tortilla","low carb wrap","mission carb balance"],    name:"Low Carb Tortilla",      emoji:"🫓", cal:70,  pro:5,  car:18,  fat:3,   fib:11},
  {kw:["flour tortilla","tortilla","wrap"],                            name:"Flour Tortilla (10\")",  emoji:"🫓", cal:213, pro:6,  car:36,  fat:5,   fib:2},
  {kw:["corn tortilla"],                                               name:"Corn Tortilla (2)",      emoji:"🌮", cal:104, pro:2.7,car:22,  fat:1.3, fib:3},
  {kw:["whole wheat tortilla","wheat tortilla"],                       name:"Whole Wheat Tortilla",   emoji:"🫓", cal:140, pro:4,  car:22,  fat:4,   fib:3},
  // ── COFFEE VARIATIONS ──
  {kw:["black coffee","plain coffee"],                                 name:"Black Coffee",           emoji:"☕", cal:2,   pro:0.3,car:0,   fat:0,   fib:0},
  {kw:["coffee with creamer","creamer coffee","homemade coffee","coffee creamer"], name:"Coffee + Creamer",       emoji:"☕", cal:50,  pro:0.5,car:7,   fat:2,   fib:0},
  {kw:["cinnamon coffee","coffee cinnamon","spiced coffee"],           name:"Coffee + Cream + Cinnamon",emoji:"☕",cal:55,  pro:0.5,car:7,   fat:2.5, fib:0.5},
  {kw:["bulletproof coffee","butter coffee"],                          name:"Bulletproof Coffee",     emoji:"☕", cal:230, pro:0.3,car:0,   fat:25,  fib:0},
  {kw:["latte","cafe latte"],                                          name:"Latte (12oz oat milk)",  emoji:"☕", cal:130, pro:3,  car:22,  fat:3,   fib:1},
  {kw:["espresso"],                                                     name:"Espresso (double)",      emoji:"☕", cal:10,  pro:0.7,car:1.5, fat:0.2, fib:0},
  {kw:["cold brew","cold brew coffee"],                                name:"Cold Brew (12oz)",       emoji:"☕", cal:15,  pro:0.5,car:3,   fat:0,   fib:0},
  // ── FAST FOOD ──
  {kw:["pizza"],                                                        name:"Pizza Slice",            emoji:"🍕", cal:285, pro:12, car:36,  fat:10,  fib:2},
  {kw:["burger","hamburger","big mac","mcdouble"],                     name:"Burger",                 emoji:"🍔", cal:450, pro:23, car:40,  fat:20,  fib:2},
  {kw:["fries","french fries"],                                        name:"Fries (medium)",         emoji:"🍟", cal:320, pro:4,  car:44,  fat:15,  fib:3},
  {kw:["chipotle","burrito bowl"],                                     name:"Chipotle Bowl",          emoji:"🥙", cal:655, pro:51, car:62,  fat:21,  fib:11},
  {kw:["chick fil a","chicken sandwich"],                              name:"Chick-fil-A Sandwich",   emoji:"🍗", cal:440, pro:28, car:40,  fat:19,  fib:1},
  {kw:["subway","footlong"],                                           name:"Subway 6\" Turkey",      emoji:"🥖", cal:280, pro:18, car:46,  fat:4.5, fib:3},
  {kw:["salad"],                                                        name:"Side Salad",             emoji:"🥗", cal:150, pro:8,  car:12,  fat:7,   fib:4},
  {kw:["sushi","sushi roll"],                                          name:"Sushi Roll (8pc)",       emoji:"🍱", cal:320, pro:14, car:56,  fat:5,   fib:2},
  // ── SNACKS & OTHER ──
  {kw:["rice cakes","rice cake"],                                      name:"Rice Cakes (2)",         emoji:"⭕", cal:70,  pro:1.4,car:15,  fat:0.4, fib:0.4},
  {kw:["hummus"],                                                       name:"Hummus (2 tbsp)",        emoji:"🫘", cal:50,  pro:2,  car:6,   fat:3,   fib:1.6},
  {kw:["soup","chicken soup","tomato soup"],                           name:"Soup (1 cup)",           emoji:"🍲", cal:120, pro:8,  car:15,  fat:3,   fib:1},
  {kw:["bacon"],                                                        name:"Bacon (2 strips)",       emoji:"🥓", cal:86,  pro:6,  car:0.1, fat:7,   fib:0},
  {kw:["gatorade","sports drink"],                                     name:"Gatorade (20oz)",        emoji:"🥤", cal:140, pro:0,  car:36,  fat:0,   fib:0},
  {kw:["chocolate","dark chocolate"],                                  name:"Dark Chocolate (1oz)",   emoji:"🍫", cal:170, pro:2,  car:13,  fat:12,  fib:3},
  {kw:["ice cream"],                                                    name:"Ice Cream (1/2 cup)",    emoji:"🍦", cal:207, pro:3.5,car:24,  fat:11,  fib:0.7},
  {kw:["orange juice","oj"],                                           name:"Orange Juice (8oz)",     emoji:"🍊", cal:112, pro:1.7,car:26,  fat:0.5, fib:0.5,perCup:1},
  {kw:["protein pancakes","pancake mix"],                              name:"Protein Pancakes",       emoji:"🥞", cal:180, pro:16, car:22,  fat:4,   fib:2},
  {kw:["overnight oats"],                                              name:"Overnight Oats",         emoji:"🥣", cal:215, pro:10, car:35,  fat:4,   fib:5},
  {kw:["granola bar","nature valley"],                                 name:"Granola Bar",            emoji:"🍫", cal:190, pro:4,  car:29,  fat:7,   fib:2},
];

const QUICK_CATS = [
  {label:"Protein",   emoji:"💪", items:QUICK_FOODS.slice(0,18)},
  {label:"Carbs",     emoji:"🍚", items:QUICK_FOODS.slice(18,26)},
  {label:"Veggies",   emoji:"🥦", items:QUICK_FOODS.slice(26,34)},
  {label:"Fruits",    emoji:"🍎", items:QUICK_FOODS.slice(34,40)},
  {label:"Fats",      emoji:"🥑", items:QUICK_FOODS.slice(40,46)},
  {label:"Dairy",     emoji:"🥛", items:QUICK_FOODS.slice(46,51)},
  {label:"Tortillas", emoji:"🫓", items:QUICK_FOODS.slice(51,55)},
  {label:"Coffee",    emoji:"☕", items:QUICK_FOODS.slice(55,62)},
  {label:"Fast Food", emoji:"🍔", items:QUICK_FOODS.slice(62,70)},
  {label:"Snacks",    emoji:"🍫", items:QUICK_FOODS.slice(70)},
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
      var qf=QUICK_FOODS[i];var found=false;
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

function calcBurn(lbs,min,met){return Math.round((met*lbs*0.453592*min)/60);}

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
  if(meal.cal>rem+400)tips.push("This put you over today — no big deal, just go lighter at your next meal");
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
  var encs=["Every meal is a step forward.","You showed up — that is what matters.","Consistency beats perfection.","Your body is working with every good choice.","Progress lives in the ordinary moments.","This is what building something real looks like.","Further along than yesterday."];
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
    {key:"pro",label:"Protein",unit:"g",color:"#34d399",max:goals.protein},
    {key:"car",label:"Carbs",  unit:"g",color:"#60a5fa",max:goals.carbs},
    {key:"fat",label:"Fat",    unit:"g",color:"#fbbf24",max:goals.fat},
    {key:"fib",label:"Fiber",  unit:"g",color:"#a78bfa",max:goals.fiber},
  ];
  var activePet=activePetId?PETS.find(function(p){return p.id===activePetId;}):null;
  var activePetXP=(petData[activePetId]||{}).xp||0;
  var activePetName=(petData[activePetId]||{}).name||(activePet?activePet.name:"");
  var petLvl=getLvl(activePetXP);
  var petStage=activePet?getStage(activePet,petLvl.level):null;

  useEffect(function(){
    var n=kget("ft-name");var th=kget("ft-theme");
    var m=kget("ft-meals");var sv=kget("ft-saved");var g=kget("ft-goals");
    var ap=kget("ft-apid");var pd=kget("ft-pd");var z=kget("ft-zoo");
    var w=kget("ft-water");var wl=kget("ft-weights");var td=kget("ft-totaldays");
    var ll=kget("ft-lastdate");var bw=kget("ft-bw");var wk=kget("ft-workouts");
    if(n){setUserName(n);setShowNameScreen(false);}
    if(th&&THEMES.find(function(t){return t.id===th;}))setThemeId(th);
    if(Array.isArray(m)&&m.length)setMeals(m);
    if(Array.isArray(sv))setSaved(sv);
    if(g&&typeof g==="object"){setGoals(g);setGoalsF(g);}
    if(ap)setActivePetId(ap);
    if(pd&&typeof pd==="object")setPetData(pd);
    if(Array.isArray(z))setZoo(z);
    if(typeof w==="number")setWaterGlasses(w);
    if(Array.isArray(wl))setWeightLog(wl);
    if(typeof td==="number")setTotalDays(td);
    if(ll)setLastDate(ll);
    if(typeof bw==="number")setBodyWeightLbs(bw);
    if(Array.isArray(wk))setWorkouts(wk);
    setLoaded(true);
    setTimeout(function(){setSplash(false);},1800);
  },[]);

  useEffect(function(){
    if(loaded){
      kset("ft-name",userName);kset("ft-theme",themeId);kset("ft-meals",meals);
      kset("ft-saved",saved);kset("ft-goals",goals);kset("ft-apid",activePetId);
      kset("ft-pd",petData);kset("ft-zoo",zoo);kset("ft-water",waterGlasses);
      kset("ft-weights",weightLog);kset("ft-totaldays",totalDays);kset("ft-lastdate",lastDate);
      kset("ft-bw",bodyWeightLbs);kset("ft-workouts",workouts);
    }
  },[userName,themeId,meals,saved,goals,activePetId,petData,zoo,waterGlasses,weightLog,totalDays,lastDate,bodyWeightLbs,workouts,loaded]);

  var mealTots=meals.reduce(function(a,m){a.cal+=sn(m.cal);a.pro+=sn(m.pro);a.car+=sn(m.car);a.fat+=sn(m.fat);a.fib+=sn(m.fib);return a;},{cal:0,pro:0,car:0,fat:0,fib:0});
  var totalBurned=workouts.reduce(function(a,w){return a+sn(w.burned);},0);
  var ingTots=ings.reduce(function(a,i){var s=sn(i.servings);a.cal+=Math.round(sn(i.cal)*s);a.pro+=r1(sn(i.pro)*s);a.car+=r1(sn(i.car)*s);a.fat+=r1(sn(i.fat)*s);a.fib+=r1(sn(i.fib)*s);return a;},{cal:0,pro:0,car:0,fat:0,fib:0});
  var avgScore=meals.length>0?Math.round(meals.reduce(function(a,m){return a+(m.score||0);},0)/meals.length):null;
  var netCal=mealTots.cal​​​​​​​​​​​​​​​​
