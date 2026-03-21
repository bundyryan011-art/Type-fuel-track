import { useState, useEffect, useRef } from “react”;

const DEFAULT_GOALS = { calories:2000, protein:150, carbs:225, fat:65, fiber:25, water:8 };

const THEMES = [
{ id:“obsidian”, label:“Obsidian”,  bg:”#030712”, card:”#0d1117”, card2:”#161b22”, border:”#21262d”, text:”#e6edf3”, sub:”#8b949e”, faint:”#484f58”, accent:”#3fb950” },
{ id:“midnight”, label:“Midnight”,  bg:”#0d0d20”, card:”#14142e”, card2:”#1a1a3d”, border:”#2d2d60”, text:”#e8e8ff”, sub:”#9090c0”, faint:”#4a4a80”, accent:”#818cf8” },
{ id:“forest”,   label:“Forest”,    bg:”#0a1a0a”, card:”#0f230f”, card2:”#142e14”, border:”#1e4a1e”, text:”#d4edda”, sub:”#78c87e”, faint:”#2d6b33”, accent:”#56d364” },
{ id:“navy”,     label:“Navy”,      bg:”#030a1a”, card:”#071428”, card2:”#0a1c38”, border:”#1a3560”, text:”#cce5ff”, sub:”#6ba3d6”, faint:”#1a4a80”, accent:”#58a6ff” },
{ id:“charcoal”, label:“Charcoal”,  bg:”#1a1a1a”, card:”#242424”, card2:”#2e2e2e”, border:”#3d3d3d”, text:”#e8e8e8”, sub:”#aaaaaa”, faint:”#666666”, accent:”#ff9f43” },
{ id:“plum”,     label:“Plum”,      bg:”#120820”, card:”#1a0c2e”, card2:”#22103c”, border:”#3d1f6e”, text:”#eeddff”, sub:”#a87ed0”, faint:”#5a3080”, accent:”#c084fc” },
{ id:“snow”,     label:“Snow”,      bg:”#f0f4f8”, card:”#ffffff”, card2:”#e8eef4”, border:”#cbd5e1”, text:”#0f172a”, sub:”#475569”, faint:”#94a3b8”, accent:”#0ea5e9” },
{ id:“warm”,     label:“Warm”,      bg:”#faf7f0”, card:”#ffffff”, card2:”#f5efe0”, border:”#e2d5b0”, text:”#2c1a06”, sub:”#7a5c2e”, faint:”#b08040”, accent:”#d97706” },
{ id:“mint”,     label:“Mint”,      bg:”#f0faf5”, card:”#ffffff”, card2:”#e0f5ea”, border:”#a8dfc0”, text:”#0a2e1a”, sub:”#2d7a50”, faint:”#6abf8a”, accent:”#10b981” },
{ id:“rose”,     label:“Rose”,      bg:”#fff1f2”, card:”#ffffff”, card2:”#ffe4e6”, border:”#fecdd3”, text:”#3b0014”, sub:”#9f1239”, faint:”#e11d48”, accent:”#f43f5e” },
{ id:“ocean”,    label:“Ocean”,     bg:”#003554”, card:”#004e7c”, card2:”#006494”, border:”#0582ca”, text:”#e0f4ff”, sub:”#90cbf0”, faint:”#2070a0”, accent:”#00b4d8” },
{ id:“emerald”,  label:“Emerald”,   bg:”#064e3b”, card:”#065f46”, card2:”#047857”, border:”#059669”, text:”#d1fae5”, sub:”#6ee7b7”, faint:”#2d6a4f”, accent:”#34d399” },
{ id:“slate”,    label:“Slate”,     bg:”#0f172a”, card:”#1e293b”, card2:”#334155”, border:”#475569”, text:”#f1f5f9”, sub:”#94a3b8”, faint:”#64748b”, accent:”#38bdf8” },
{ id:“dusk”,     label:“Dusk”,      bg:”#1a0a2e”, card:”#2a1040”, card2:”#341450”, border:”#6030a0”, text:”#f0e0ff”, sub:”#c090e0”, faint:”#7040b0”, accent:”#e040fb” },
{ id:“golden”,   label:“Golden”,    bg:”#1a1200”, card:”#2a1e00”, card2:”#3a2c00”, border:”#7a5a00”, text:”#fff7d6”, sub:”#d4aa40”, faint:”#6a4800”, accent:”#fbbf24” },
];

function EmberS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em1g" cx="50%" cy="70%" r="50%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><ellipse cx="50" cy="62" rx="18" ry="14" fill="url(#em1g)"/><path d="M50 20 Q44 38 50 48 Q56 38 50 20Z" fill="#f97316"/><path d="M50 28 Q46 40 50 48 Q54 40 50 28Z" fill="#fbbf24"/><circle cx="50" cy="50" r="4" fill="#fef3c7"/></svg>);}
function EmberS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em2g" cx="50%" cy="60%" r="55%"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><ellipse cx="50" cy="65" rx="22" ry="16" fill="url(#em2g)"/><path d="M50 15 Q40 35 44 52 Q50 44 56 52 Q60 35 50 15Z" fill="#f97316"/><path d="M50 22 Q46 38 50 48 Q54 38 50 22Z" fill="#fbbf24"/><circle cx="50" cy="50" r="5" fill="#fef3c7"/></svg>);}
function EmberS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em3g" cx="50%" cy="55%" r="55%"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#431407"/></radialGradient></defs><circle cx="50" cy="55" r="28" fill="url(#em3g)"/><path d="M50 10 Q40 30 44 48 Q50 40 56 48 Q60 30 50 10Z" fill="#fb923c"/><path d="M50 16 Q46 34 50 46 Q54 34 50 16Z" fill="#fbbf24"/><circle cx="50" cy="50" r="9" fill="#fef3c7"/><circle cx="50" cy="50" r="5" fill="white"/></svg>);}
function EmberS4(p){var s=p.size||80;var rays=[0,45,90,135,180,225,270,315];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="50%" stopColor="#f97316"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#em4g)"/>{rays.map(function(deg,i){var r=deg*Math.PI/180;var l=i%2===0?16:10;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke=”#fbbf24” strokeWidth={i%2===0?3:2} strokeLinecap=“round”/>;})}<circle cx="50" cy="50" r="14" fill="#fef3c7"/><circle cx="50" cy="50" r="7" fill="white"/><circle cx="44" cy="46" r="3" fill="#7c2d12"/><circle cx="56" cy="46" r="3" fill="#7c2d12"/><path d="M42 56 Q50 62 58 56" stroke="#f97316" strokeWidth="2" fill="none"/></svg>);}
function EmberS5(p){var s=p.size||80;var rays=Array.from({length:16},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="em5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#fef3c7"/><stop offset="60%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#7c2d12"/></radialGradient></defs><circle cx="50" cy="50" r="28" fill="url(#em5g)"/>{rays.map(function(i){var r=i*22.5*Math.PI/180;var l=i%4===0?22:i%2===0?15:10;return <line key={i} x1={50+Math.cos(r)*26} y1={50+Math.sin(r)*26} x2={50+Math.cos(r)*(26+l)} y2={50+Math.sin(r)*(26+l)} stroke={i%2===0?”#fbbf24”:”#fb923c”} strokeWidth={i%4===0?3.5:2} strokeLinecap=“round”/>;})}<circle cx="50" cy="50" r="13" fill="white"/><circle cx="44" cy="46" r="4" fill="#92400e"/><circle cx="56" cy="46" r="4" fill="#92400e"/><path d="M40 57 Q50 65 60 57" stroke="#f97316" strokeWidth="2.5" fill="none"/></svg>);}
function VoidS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><circle cx="50" cy="50" r="20" fill="url(#vo1g)"/><circle cx="50" cy="50" r="8" fill="#0a0010"/></svg>);}
function VoidS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="60%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="36" ry="12" fill="none" stroke="#7c3aed" strokeWidth="1.5"/><circle cx="50" cy="50" r="22" fill="url(#vo2g)"/><circle cx="50" cy="50" r="10" fill="#0a0010"/></svg>);}
function VoidS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="50%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="#7c3aed" strokeWidth="2"/><circle cx="50" cy="50" r="26" fill="url(#vo3g)"/><circle cx="50" cy="50" r="14" fill="#0a0010"/><circle cx="44" cy="46" r="3" fill="#c4b5fd" opacity="0.9"/><circle cx="56" cy="46" r="3" fill="#c4b5fd" opacity="0.9"/></svg>);}
function VoidS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#a78bfa"/><stop offset="40%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke="#8b5cf6" strokeWidth="2.5"/><circle cx="50" cy="50" r="28" fill="url(#vo4g)"/><circle cx="50" cy="50" r="16" fill="#0a0010"/><circle cx="43" cy="45" r="4" fill="#ddd6fe"/><circle cx="57" cy="45" r="4" fill="#ddd6fe"/><circle cx="43" cy="45" r="2" fill="#0a0010"/><circle cx="57" cy="45" r="2" fill="#0a0010"/></svg>);}
function VoidS5(p){var s=p.size||80;var pts=[[14,26],[86,26],[8,50],[92,50],[14,74],[86,74],[30,10],[70,10]];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vo5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="30%" stopColor="#8b5cf6"/><stop offset="70%" stopColor="#4c1d95"/><stop offset="100%" stopColor="#0a0010"/></radialGradient></defs><ellipse cx="50" cy="50" rx="48" ry="18" fill="none" stroke="#a78bfa" strokeWidth="3"/><circle cx="50" cy="50" r="30" fill="url(#vo5g)"/><circle cx="50" cy="50" r="18" fill="#0a0010"/>{pts.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r={i<4?2:1.5} fill=”#c4b5fd” opacity={0.8-i*0.05}/>;})}<circle cx="43" cy="44" r="5" fill="#ede9fe"/><circle cx="57" cy="44" r="5" fill="#ede9fe"/><circle cx="43" cy="44" r="2.5" fill="#0a0010"/><circle cx="57" cy="44" r="2.5" fill="#0a0010"/><path d="M40 57 Q50 65 60 57" stroke="#c4b5fd" strokeWidth="2.5" fill="none"/></svg>);}
function IronS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><rect x="34" y="30" width="32" height="40" rx="3" fill="#374151" stroke="#6b7280" strokeWidth="1.5"/><rect x="34" y="30" width="32" height="10" rx="2" fill="#4b5563"/><rect x="38" y="44" width="10" height="10" rx="1" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><rect x="52" y="44" width="10" height="10" rx="1" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><rect x="26" y="34" width="10" height="24" rx="2" fill="#374151" stroke="#6b7280" strokeWidth="1"/><rect x="64" y="34" width="10" height="24" rx="2" fill="#374151" stroke="#6b7280" strokeWidth="1"/></svg>);}
function IronS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><rect x="28" y="24" width="44" height="54" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="2"/><rect x="28" y="24" width="44" height="12" rx="3" fill="#4b5563"/><circle cx="40" cy="47" r="4" fill="#6b7280"/><circle cx="60" cy="47" r="4" fill="#6b7280"/><circle cx="40" cy="47" r="2" fill="#9ca3af"/><circle cx="60" cy="47" r="2" fill="#9ca3af"/><rect x="18" y="28" width="12" height="34" rx="3" fill="#4b5563" stroke="#6b7280" strokeWidth="1.5"/><rect x="70" y="28" width="12" height="34" rx="3" fill="#4b5563" stroke="#6b7280" strokeWidth="1.5"/></svg>);}
function IronS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir3g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4b5563"/><stop offset="100%" stopColor="#1f2937"/></linearGradient></defs><rect x="22" y="18" width="56" height="66" rx="6" fill="url(#ir3g)" stroke="#9ca3af" strokeWidth="2"/><rect x="28" y="36" width="18" height="18" rx="3" fill="#111827" stroke="#6b7280" strokeWidth="1.5"/><rect x="54" y="36" width="18" height="18" rx="3" fill="#111827" stroke="#6b7280" strokeWidth="1.5"/><circle cx="37" cy="45" r="6" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="63" cy="45" r="6" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="37" cy="45" r="3" fill="#d1d5db"/><circle cx="63" cy="45" r="3" fill="#d1d5db"/><rect x="10" y="22" width="14" height="44" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/><rect x="76" y="22" width="14" height="44" rx="4" fill="#374151" stroke="#9ca3af" strokeWidth="1.5"/></svg>);}
function IronS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir4g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6b7280"/><stop offset="100%" stopColor="#111827"/></linearGradient></defs><polygon points="50,8 78,22 82,55 65,80 35,80 18,55 22,22" fill="url(#ir4g)" stroke="#d1d5db" strokeWidth="2"/><polygon points="50,16 72,27 76,55 62,74 38,74 24,55 28,27" fill="#1f2937" stroke="#6b7280" strokeWidth="1"/><circle cx="41" cy="39" r="5" fill="#374151" stroke="#d1d5db" strokeWidth="1.5"/><circle cx="59" cy="39" r="5" fill="#374151" stroke="#d1d5db" strokeWidth="1.5"/><circle cx="41" cy="39" r="2.5" fill="#f3f4f6"/><circle cx="59" cy="39" r="2.5" fill="#f3f4f6"/></svg>);}
function IronS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ir5g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9ca3af"/><stop offset="50%" stopColor="#374151"/><stop offset="100%" stopColor="#111827"/></linearGradient></defs><polygon points="50,4 82,18 88,52 70,84 30,84 12,52 18,18" fill="url(#ir5g)" stroke="#f3f4f6" strokeWidth="2.5"/><polygon points="50,12 76,24 82,54 66,80 34,80 18,54 24,24" fill="#1f2937" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="40" cy="38" r="6" fill="#374151" stroke="#f3f4f6" strokeWidth="2"/><circle cx="60" cy="38" r="6" fill="#374151" stroke="#f3f4f6" strokeWidth="2"/><circle cx="40" cy="38" r="3" fill="white"/><circle cx="60" cy="38" r="3" fill="white"/><circle cx="40" cy="38" r="1.5" fill="#111827"/><circle cx="60" cy="38" r="1.5" fill="#111827"/><rect x="30" y="52" width="40" height="16" rx="3" fill="#0a0a0a" stroke="#9ca3af" strokeWidth="1.5"/></svg>);}
function AuroraS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,22 62,44 50,66 38,44" fill="url(#au1g)"/></svg>);}
function AuroraS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><polygon points="50,14 70,36 70,64 50,78 30,64 30,36" fill="url(#au2g)"/><polygon points="50,14 70,36 70,64 50,78 30,64 30,36" fill="none" stroke="#bae6fd" strokeWidth="1.5"/><circle cx="44" cy="44" r="3" fill="#0284c7" opacity="0.8"/><circle cx="56" cy="44" r="3" fill="#0284c7" opacity="0.8"/></svg>);}
function AuroraS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0f9ff"/><stop offset="50%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,10 72,28 80,54 66,76 34,76 20,54 28,28" fill="url(#au3g)"/><polygon points="50,10 72,28 80,54 66,76 34,76 20,54 28,28" fill="none" stroke="#e0f2fe" strokeWidth="2"/><circle cx="43" cy="42" r="4" fill="#0369a1"/><circle cx="57" cy="42" r="4" fill="#0369a1"/><circle cx="43" cy="42" r="2" fill="#e0f2fe"/><circle cx="57" cy="42" r="2" fill="#e0f2fe"/></svg>);}
function AuroraS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0284c7"/></radialGradient></defs><polygon points="50,6 76,22 84,50 76,78 50,88 24,78 16,50 24,22" fill="url(#au4g)"/><polygon points="50,6 76,22 84,50 76,78 50,88 24,78 16,50 24,22" fill="none" stroke="#e0f2fe" strokeWidth="2"/><circle cx="42" cy="42" r="5" fill="#0284c7"/><circle cx="58" cy="42" r="5" fill="#0284c7"/><circle cx="42" cy="42" r="2.5" fill="white"/><circle cx="58" cy="42" r="2.5" fill="white"/><path d="M40 58 Q50 66 60 58" stroke="#7dd3fc" strokeWidth="2.5" fill="none"/></svg>);}
function AuroraS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="au5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#bae6fd"/><stop offset="70%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#0369a1"/></radialGradient></defs><polygon points="50,4 80,20 88,50 80,80 50,92 20,80 12,50 20,20" fill="url(#au5g)"/><polygon points="50,4 80,20 88,50 80,80 50,92 20,80 12,50 20,20" fill="none" stroke="#e0f2fe" strokeWidth="2.5"/><circle cx="42" cy="42" r="6" fill="#0284c7"/><circle cx="58" cy="42" r="6" fill="#0284c7"/><circle cx="42" cy="42" r="3" fill="white"/><circle cx="58" cy="42" r="3" fill="white"/><path d="M38 60 Q50 70 62 60" stroke="#bae6fd" strokeWidth="3" fill="none"/></svg>);}
function VenomS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 20 Q58 32 60 48 Q58 62 50 70 Q42 62 40 48 Q42 32 50 20Z" fill="url(#vn1g)"/></svg>);}
function VenomS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#86efac"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 14 Q64 26 68 44 Q68 62 56 74 Q50 80 44 74 Q32 62 32 44 Q36 26 50 14Z" fill="url(#vn2g)"/><circle cx="43" cy="40" r="4" fill="#14532d"/><circle cx="57" cy="40" r="4" fill="#14532d"/><circle cx="43" cy="40" r="2" fill="#86efac"/><circle cx="57" cy="40" r="2" fill="#86efac"/></svg>);}
function VenomS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn3g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#bbf7d0"/><stop offset="50%" stopColor="#22c55e"/><stop offset="100%" stopColor="#14532d"/></radialGradient></defs><path d="M50 10 Q68 20 74 40 Q78 60 64 76 Q57 84 50 86 Q43 84 36 76 Q22 60 26 40 Q32 20 50 10Z" fill="url(#vn3g)"/><circle cx="42" cy="36" r="5" fill="#14532d"/><circle cx="58" cy="36" r="5" fill="#14532d"/><circle cx="42" cy="36" r="2.5" fill="#dcfce7"/><circle cx="58" cy="36" r="2.5" fill="#dcfce7"/><path d="M47 62 L44 70 M53 62 L56 70" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/></svg>);}
function VenomS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn4g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#dcfce7"/><stop offset="40%" stopColor="#4ade80"/><stop offset="100%" stopColor="#052e16"/></radialGradient></defs><path d="M50 6 Q72 14 80 36 Q86 56 74 74 Q65 86 50 88 Q35 86 26 74 Q14 56 20 36 Q28 14 50 6Z" fill="url(#vn4g)"/><circle cx="41" cy="34" r="6" fill="#052e16"/><circle cx="59" cy="34" r="6" fill="#052e16"/><circle cx="41" cy="34" r="3" fill="#bbf7d0"/><circle cx="59" cy="34" r="3" fill="#bbf7d0"/><path d="M46 64 L42 74 M54 64 L58 74" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"/></svg>);}
function VenomS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="vn5g" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#bbf7d0"/><stop offset="50%" stopColor="#22c55e"/><stop offset="100%" stopColor="#052e16"/></radialGradient></defs><path d="M50 4 Q76 10 86 32 Q94 56 80 76 Q68 92 50 94 Q32 92 20 76 Q6 56 14 32 Q24 10 50 4Z" fill="url(#vn5g)"/><circle cx="40" cy="32" r="8" fill="#052e16"/><circle cx="60" cy="32" r="8" fill="#052e16"/><circle cx="40" cy="32" r="4.5" fill="#dcfce7"/><circle cx="60" cy="32" r="4.5" fill="#dcfce7"/><path d="M38 54 Q50 64 62 54" stroke="#bbf7d0" strokeWidth="3" fill="none"/><path d="M44 66 L40 78 M56 66 L60 78" stroke="#4ade80" strokeWidth="3" strokeLinecap="round"/></svg>);}
function PhantomS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph1g" cx="50%" cy="40%" r="50%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="100%" stopColor="#4338ca" stopOpacity="0.3"/></radialGradient></defs><path d="M30 70 Q30 30 50 22 Q70 30 70 70 Q64 64 58 70 Q52 64 50 70 Q48 64 42 70 Q36 64 30 70Z" fill="url(#ph1g)" opacity="0.9"/><circle cx="42" cy="46" r="3" fill="#312e81" opacity="0.6"/><circle cx="58" cy="46" r="3" fill="#312e81" opacity="0.6"/></svg>);}
function PhantomS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="70%" stopColor="#6366f1" stopOpacity="0.5"/><stop offset="100%" stopColor="#312e81" stopOpacity="0.2"/></radialGradient></defs><path d="M26 72 Q26 26 50 18 Q74 26 74 72 Q67 64 62 72 Q57 64 54 72 Q52 66 50 72 Q48 66 46 72 Q43 64 38 72 Q33 64 26 72Z" fill="url(#ph2g)"/><circle cx="42" cy="44" r="4" fill="#312e81" opacity="0.8"/><circle cx="58" cy="44" r="4" fill="#312e81" opacity="0.8"/><circle cx="42" cy="44" r="2" fill="#e0e7ff"/><circle cx="58" cy="44" r="2" fill="#e0e7ff"/></svg>);}
function PhantomS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph3g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="50%" stopColor="#818cf8" stopOpacity="0.7"/><stop offset="100%" stopColor="#312e81" stopOpacity="0.3"/></radialGradient></defs><path d="M22 74 Q22 22 50 14 Q78 22 78 74 Q70 64 65 74 Q60 64 57 74 Q54 66 50 74 Q46 66 43 74 Q40 64 35 74 Q30 64 22 74Z" fill="url(#ph3g)"/><circle cx="40" cy="42" r="5" fill="#312e81"/><circle cx="60" cy="42" r="5" fill="#312e81"/><circle cx="40" cy="42" r="2.5" fill="#e0e7ff"/><circle cx="60" cy="42" r="2.5" fill="#e0e7ff"/></svg>);}
function PhantomS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph4g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#a5b4fc"/><stop offset="80%" stopColor="#4f46e5" stopOpacity="0.6"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3"/></radialGradient></defs><path d="M18 76 Q18 18 50 10 Q82 18 82 76 Q73 64 68 76 Q63 64 60 76 Q57 66 50 76 Q43 66 40 76 Q37 64 32 76 Q27 64 18 76Z" fill="url(#ph4g)"/><circle cx="38" cy="40" r="6" fill="#312e81"/><circle cx="62" cy="40" r="6" fill="#312e81"/><circle cx="38" cy="40" r="3" fill="white"/><circle cx="62" cy="40" r="3" fill="white"/></svg>);}
function PhantomS5(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ph5g" cx="50%" cy="35%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#c7d2fe"/><stop offset="70%" stopColor="#6366f1" stopOpacity="0.7"/><stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3"/></radialGradient></defs><path d="M14 78 Q14 14 50 6 Q86 14 86 78 Q76 64 71 78 Q66 64 63 78 Q60 66 50 78 Q40 66 37 78 Q34 64 29 78 Q24 64 14 78Z" fill="url(#ph5g)"/><circle cx="36" cy="38" r="7" fill="#1e1b4b"/><circle cx="64" cy="38" r="7" fill="#1e1b4b"/><circle cx="36" cy="38" r="4" fill="white"/><circle cx="64" cy="38" r="4" fill="white"/><circle cx="36" cy="37" r="2" fill="#312e81"/><circle cx="64" cy="37" r="2" fill="#312e81"/><path d="M38 60 Q50 72 62 60" stroke="#c7d2fe" strokeWidth="3" fill="none"/></svg>);}
function TitanS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#78350f"/></radialGradient></defs><polygon points="50,20 65,50 50,75 35,50" fill="url(#ti1g)"/></svg>);}
function TitanS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#92400e"/></radialGradient></defs><polygon points="50,14 68,32 74,56 58,76 42,76 26,56 32,32" fill="url(#ti2g)"/><polygon points="50,14 68,32 74,56 58,76 42,76 26,56 32,32" fill="none" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="42" cy="46" r="4" fill="#78350f"/><circle cx="58" cy="46" r="4" fill="#78350f"/><circle cx="42" cy="46" r="2" fill="#fef3c7"/><circle cx="58" cy="46" r="2" fill="#fef3c7"/></svg>);}
function TitanS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ti3g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fde68a"/><stop offset="100%" stopColor="#b45309"/></linearGradient></defs><polygon points="50,10 72,24 80,50 72,76 50,84 28,76 20,50 28,24" fill="url(#ti3g)"/><polygon points="50,10 72,24 80,50 72,76 50,84 28,76 20,50 28,24" fill="none" stroke="#fbbf24" strokeWidth="2"/><circle cx="41" cy="43" r="5" fill="#78350f"/><circle cx="59" cy="43" r="5" fill="#78350f"/><circle cx="41" cy="43" r="2.5" fill="#fef3c7"/><circle cx="59" cy="43" r="2.5" fill="#fef3c7"/></svg>);}
function TitanS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><linearGradient id="ti4g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/></linearGradient></defs><polygon points="50,6 76,18 86,46 76,74 50,86 24,74 14,46 24,18" fill="url(#ti4g)"/><polygon points="50,6 76,18 86,46 76,74 50,86 24,74 14,46 24,18" fill="none" stroke="#fbbf24" strokeWidth="2.5"/><circle cx="40" cy="45" r="5" fill="#92400e" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="60" cy="45" r="5" fill="#92400e" stroke="#fbbf24" strokeWidth="1.5"/><circle cx="40" cy="45" r="2.5" fill="#fef3c7"/><circle cx="60" cy="45" r="2.5" fill="#fef3c7"/></svg>);}
function TitanS5(p){var s=p.size||80;var pts=[[50,4],[78,16],[88,46],[78,76],[50,88],[22,76],[12,46],[22,16]];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="ti5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#fef3c7"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="80%" stopColor="#d97706"/><stop offset="100%" stopColor="#78350f"/></radialGradient></defs><polygon points="50,4 78,16 88,46 78,76 50,88 22,76 12,46 22,16" fill="url(#ti5g)"/><polygon points="50,4 78,16 88,46 78,76 50,88 22,76 12,46 22,16" fill="none" stroke="#fef3c7" strokeWidth="3"/>{pts.map(function(pt,i){return <circle key={i} cx={pt[0]} cy={pt[1]} r="2" fill="#fbbf24"/>;})}<circle cx="40" cy="42" r="7" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5"/><circle cx="60" cy="42" r="7" fill="#78350f" stroke="#fef3c7" strokeWidth="1.5"/><circle cx="40" cy="42" r="4" fill="#fef3c7"/><circle cx="60" cy="42" r="4" fill="#fef3c7"/><path d="M38 60 Q50 72 62 60" stroke="#fef3c7" strokeWidth="3" fill="none"/></svg>);}
function StormS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef08a"/><stop offset="100%" stopColor="#713f12"/></radialGradient></defs><polygon points="56,18 46,46 54,46 44,80 62,44 52,44" fill="url(#st1g)"/></svg>);}
function StormS2(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef9c3"/><stop offset="100%" stopColor="#854d0e"/></radialGradient></defs><circle cx="50" cy="50" r="24" fill="#1c1917" stroke="#ca8a04" strokeWidth="1.5"/><polygon points="57,22 45,48 55,48 43,78 65,44 53,44" fill="url(#st2g)"/></svg>);}
function StormS3(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#92400e"/><stop offset="100%" stopColor="#0a0a00"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#st3g)"/><circle cx="50" cy="50" r="30" fill="none" stroke="#ca8a04" strokeWidth="1.5"/><polygon points="58,18 44,46 56,46 42,82 68,42 54,42" fill="#fef08a"/><circle cx="42" cy="40" r="4" fill="#fef08a" opacity="0.9"/><circle cx="58" cy="40" r="4" fill="#fef08a" opacity="0.9"/><circle cx="42" cy="40" r="2" fill="#78350f"/><circle cx="58" cy="40" r="2" fill="#78350f"/></svg>);}
function StormS4(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#b45309"/><stop offset="100%" stopColor="#0a0500"/></radialGradient></defs><circle cx="50" cy="50" r="38" fill="url(#st4g)"/><polygon points="60,14 44,46 58,46 40,86 72,40 56,40" fill="#fef08a"/><circle cx="40" cy="38" r="5" fill="#fef08a"/><circle cx="58" cy="38" r="5" fill="#fef08a"/><circle cx="40" cy="38" r="2.5" fill="#78350f"/><circle cx="58" cy="38" r="2.5" fill="#78350f"/></svg>);}
function StormS5(p){var s=p.size||80;var bolts=Array.from({length:6},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="st5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fef9c3"/><stop offset="30%" stopColor="#eab308"/><stop offset="70%" stopColor="#92400e"/><stop offset="100%" stopColor="#0a0500"/></radialGradient></defs><circle cx="50" cy="50" r="42" fill="url(#st5g)"/><circle cx="50" cy="50" r="42" fill="none" stroke="#fef08a" strokeWidth="2"/>{bolts.map(function(i){var angle=i*60*Math.PI/180;var x1=50+Math.cos(angle)*28;var y1=50+Math.sin(angle)*28;var x2=50+Math.cos(angle)*42;var y2=50+Math.sin(angle)*42;return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fef9c3" strokeWidth="2" strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="22" fill="#0a0500"/><polygon points="58,28 42,52 56,52 38,76 70,46 54,46" fill="#fef08a"/><circle cx="40" cy="38" r="6" fill="#fef08a" stroke="#0a0500" strokeWidth="1.5"/><circle cx="60" cy="38" r="6" fill="#fef08a" stroke="#0a0500" strokeWidth="1.5"/><circle cx="40" cy="38" r="3" fill="#78350f"/><circle cx="60" cy="38" r="3" fill="#78350f"/></svg>);}
function NovaS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="18" fill="url(#nv1g)"/><circle cx="50" cy="50" r="6" fill="#fdf4ff"/></svg>);}
function NovaS2(p){var s=p.size||80;var spikes=[0,72,144,216,288];return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f0abfc"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="22" fill="url(#nv2g)"/>{spikes.map(function(deg,i){var r=deg*Math.PI/180;return <line key={i} x1={50+Math.cos(r)*20} y1={50+Math.sin(r)*20} x2={50+Math.cos(r)*32} y2={50+Math.sin(r)*32} stroke="#e879f9" strokeWidth="3" strokeLinecap="round"/>;})}<circle cx="50" cy="50" r="10" fill="#fdf4ff"/><circle cx="44" cy="46" r="3" fill="#701a75"/><circle cx="56" cy="46" r="3" fill="#701a75"/></svg>);}
function NovaS3(p){var s=p.size||80;var spikes=Array.from({length:8},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fdf4ff"/><stop offset="40%" stopColor="#d946ef"/><stop offset="100%" stopColor="#701a75"/></radialGradient></defs><circle cx="50" cy="50" r="26" fill="url(#nv3g)"/>{spikes.map(function(i){var r=i*45*Math.PI/180;var l=i%2===0?14:9;return <line key={i} x1={50+Math.cos(r)*24} y1={50+Math.sin(r)*24} x2={50+Math.cos(r)*(24+l)} y2={50+Math.sin(r)*(24+l)} stroke=”#f0abfc” strokeWidth={i%2===0?3:2} strokeLinecap=“round”/>;})}<circle cx="50" cy="50" r="12" fill="#fdf4ff"/><circle cx="43" cy="46" r="4" fill="#701a75"/><circle cx="57" cy="46" r="4" fill="#701a75"/></svg>);}
function NovaS4(p){var s=p.size||80;var spikes=Array.from({length:12},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#f0abfc"/><stop offset="70%" stopColor="#a21caf"/><stop offset="100%" stopColor="#4a044e"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#nv4g)"/>{spikes.map(function(i){var r=i*30*Math.PI/180;var l=i%3===0?18:i%3===1?12:8;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke={i%2===0?”#f0abfc”:”#e879f9”} strokeWidth={i%3===0?3:2} strokeLinecap=“round”/>;})}<circle cx="50" cy="50" r="14" fill="#fdf4ff"/><circle cx="42" cy="46" r="5" fill="#701a75"/><circle cx="58" cy="46" r="5" fill="#701a75"/><circle cx="42" cy="46" r="2.5" fill="white"/><circle cx="58" cy="46" r="2.5" fill="white"/></svg>);}
function NovaS5(p){var s=p.size||80;var spikes=Array.from({length:16},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="nv5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="white"/><stop offset="20%" stopColor="#fdf4ff"/><stop offset="50%" stopColor="#d946ef"/><stop offset="80%" stopColor="#86198f"/><stop offset="100%" stopColor="#2e1065"/></radialGradient></defs><circle cx="50" cy="50" r="30" fill="url(#nv5g)"/>{spikes.map(function(i){var r=i*22.5*Math.PI/180;var l=i%4===0?22:i%2===0?15:10;return <line key={i} x1={50+Math.cos(r)*28} y1={50+Math.sin(r)*28} x2={50+Math.cos(r)*(28+l)} y2={50+Math.sin(r)*(28+l)} stroke={i%2===0?”#f0abfc”:”#d946ef”} strokeWidth={i%4===0?3.5:2} strokeLinecap=“round”/>;})}<circle cx="50" cy="50" r="14" fill="white"/><circle cx="42" cy="46" r="6" fill="#701a75"/><circle cx="58" cy="46" r="6" fill="#701a75"/><circle cx="42" cy="46" r="3" fill="white"/><circle cx="58" cy="46" r="3" fill="white"/><path d="M38 60 Q50 72 62 60" stroke="#f0abfc" strokeWidth="3" fill="none"/></svg>);}
function ReefS1(p){var s=p.size||80;return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#67e8f9"/><stop offset="100%" stopColor="#0e7490"/></radialGradient></defs><ellipse cx="50" cy="52" rx="20" ry="24" fill="url(#rf1g)"/><circle cx="44" cy="48" r="3" fill="#0e7490" opacity="0.7"/><circle cx="56" cy="48" r="3" fill="#0e7490" opacity="0.7"/></svg>);}
function ReefS2(p){var s=p.size||80;var t=Array.from({length:6},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf2g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#a5f3fc"/><stop offset="100%" stopColor="#0891b2"/></radialGradient></defs><ellipse cx="50" cy="46" rx="26" ry="28" fill="url(#rf2g)"/>{t.map(function(i){var x=30+i*8;var wave=i%2===0?8:-8;return <path key={i} d={“M”+x+” 68 Q”+(x+wave)+” 76 “+x+” 84”} stroke=”#0891b2” strokeWidth=“3” fill=“none” strokeLinecap=“round”/>;})}<circle cx="42" cy="42" r="4" fill="#0e7490"/><circle cx="58" cy="42" r="4" fill="#0e7490"/><circle cx="42" cy="42" r="2" fill="#e0f2fe"/><circle cx="58" cy="42" r="2" fill="#e0f2fe"/></svg>);}
function ReefS3(p){var s=p.size||80;var t=Array.from({length:8},function(*,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf3g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="50%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#0e7490"/></radialGradient></defs><ellipse cx="50" cy="44" rx="30" ry="30" fill="url(#rf3g)"/>{t.map(function(i){var x=26+i*7;var wave=i%2===0?10:-10;return <path key={i} d={“M”+x+” 68 Q”+(x+wave)+” 78 “+x+” 88”} stroke=”#0284c7” strokeWidth={i%2===0?3.5:2.5} fill=“none” strokeLinecap=“round”/>;})}<circle cx="41" cy="40" r="5" fill="#0e7490"/><circle cx="59" cy="40" r="5" fill="#0e7490"/><circle cx="41" cy="40" r="2.5" fill="#e0f2fe"/><circle cx="59" cy="40" r="2.5" fill="#e0f2fe"/></svg>);}
function ReefS4(p){var s=p.size||80;var t=Array.from({length:10},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf4g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="40%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0c4a6e"/></radialGradient></defs><ellipse cx="50" cy="42" rx="34" ry="32" fill="url(#rf4g)"/>{t.map(function(i){var x=18+i*7;var wave=i%2===0?12:-12;return <path key={i} d={“M”+x+” 66 Q”+(x+wave/2)+” 76 “+x+” 86”} stroke=”#0284c7” strokeWidth={i%3===0?4:3} fill=“none” strokeLinecap=“round”/>;})}<circle cx="40" cy="38" r="6" fill="#0c4a6e"/><circle cx="60" cy="38" r="6" fill="#0c4a6e"/><circle cx="40" cy="38" r="3" fill="#e0f2fe"/><circle cx="60" cy="38" r="3" fill="#e0f2fe"/></svg>);}
function ReefS5(p){var s=p.size||80;var t=Array.from({length:12},function(_,i){return i;});return(<svg width={s} height={s} viewBox="0 0 100 100"><defs><radialGradient id="rf5g" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="white"/><stop offset="30%" stopColor="#bae6fd"/><stop offset="70%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#082f49"/></radialGradient></defs><ellipse cx="50" cy="40" rx="38" ry="34" fill="url(#rf5g)"/>{t.map(function(i){var x=14+i*6.5;var wave=i%2===0?14:-14;return <path key={i} d={“M”+x+” 64 Q”+(x+wave/2)+” 74 “+x+” 82”} stroke=”#0284c7” strokeWidth={i%4===0?4.5:3} fill=“none” strokeLinecap=“round”/>;})}<circle cx="40" cy="34" r="8" fill="#082f49"/><circle cx="60" cy="34" r="8" fill="#082f49"/><circle cx="40" cy="34" r="4.5" fill="#e0f2fe"/><circle cx="60" cy="34" r="4.5" fill="#e0f2fe"/><path d="M38 56 Q50 68 62 56" stroke="#bae6fd" strokeWidth="3" fill="none"/></svg>);}

function renderArt(A,size){if(!A)return null;return <A size={size}/>;}

const PETS=[
{id:“ember”,  name:“Ember”,   color:”#f97316”,desc:“Born from a dying coal. Grows into a star that cannot be extinguished.”,stages:[
{level:1, form:“Dying Ember”,     Art:EmberS1,desc:“Almost out. But not yet.”},
{level:3, form:“Rising Flame”,    Art:EmberS2,desc:“Something caught. Not stopping.”},
{level:5, form:“Burning Core”,    Art:EmberS3,desc:“Solid fire. Warms everything near it.”},
{level:7, form:“Solar Bloom”,     Art:EmberS4,desc:“Expanded past what contained it.”},
{level:10,form:“The Undying Sun”, Art:EmberS5,desc:“Burns forever. Cannot be put out.”},
]},
{id:“void”,   name:“Void”,    color:”#8b5cf6”,desc:“A black hole that learned to think.”,stages:[
{level:1, form:“Dark Point”,      Art:VoidS1,desc:“Nothing to see. Everything to fear.”},
{level:3, form:“Event Horizon”,   Art:VoidS2,desc:“The ring forms. Things do not leave.”},
{level:5, form:“Collapsing Star”, Art:VoidS3,desc:“Consuming itself to become greater.”},
{level:7, form:“Singularity”,     Art:VoidS4,desc:“Space bends. Time bends. It does not.”},
{level:10,form:“The Absolute”,    Art:VoidS5,desc:“There is no outside of it anymore.”},
]},
{id:“iron”,   name:“Ironclad”,color:”#9ca3af”,desc:“Forged in fire. Tested by everything. Still standing.”,stages:[
{level:1, form:“Raw Frame”,       Art:IronS1,desc:“Bolted together. Functional.”},
{level:3, form:“First Armor”,     Art:IronS2,desc:“Shape emerging.”},
{level:5, form:“War Machine”,     Art:IronS3,desc:“All systems operational.”},
{level:7, form:“Iron Fortress”,   Art:IronS4,desc:“Has absorbed every hit.”},
{level:10,form:“Indestructible”,  Art:IronS5,desc:“Cannot break what survived everything.”},
]},
{id:“aurora”, name:“Aurora”,  color:”#38bdf8”,desc:“A crystal being grown from pure arctic silence.”,stages:[
{level:1, form:“Ice Shard”,       Art:AuroraS1,desc:“One perfect cut. One perfect edge.”},
{level:3, form:“Frost Prism”,     Art:AuroraS2,desc:“Light bends through it.”},
{level:5, form:“Crystal Form”,    Art:AuroraS3,desc:“Many faces. One being.”},
{level:7, form:“Glacial Crown”,   Art:AuroraS4,desc:“The tundra grows where it walks.”},
{level:10,form:“The Eternal Ice”, Art:AuroraS5,desc:“Nothing melts it.”},
]},
{id:“venom”,  name:“Venom”,   color:”#4ade80”,desc:“A serpent that grew larger every time something tried to stop it.”,stages:[
{level:1, form:“Hatchling”,       Art:VenomS1,desc:“Tiny. Already dangerous.”},
{level:3, form:“Fang”,            Art:VenomS2,desc:“The bite is faster.”},
{level:5, form:“River Serpent”,   Art:VenomS3,desc:“Moves without sound.”},
{level:7, form:“Apex Predator”,   Art:VenomS4,desc:“Top of every food chain.”},
{level:10,form:“The Ancient One”, Art:VenomS5,desc:“Older than the forest.”},
]},
{id:“phantom”,name:“Phantom”, color:”#818cf8”,desc:“Neither here nor gone. Passes through walls. Passes through time.”,stages:[
{level:1, form:“Wisp”,            Art:PhantomS1,desc:“Gone if you look directly.”},
{level:3, form:“Specter”,         Art:PhantomS2,desc:“Visible now. Still not real.”},
{level:5, form:“Haunt”,           Art:PhantomS3,desc:“It has chosen you.”},
{level:7, form:“Revenant”,        Art:PhantomS4,desc:“Returned from somewhere worse.”},
{level:10,form:“The Undying”,     Art:PhantomS5,desc:“Death already tried.”},
]},
{id:“titan”,  name:“Titan”,   color:”#fbbf24”,desc:“A golden warrior growing more legendary with every challenge.”,stages:[
{level:1, form:“Warriors Oath”,   Art:TitanS1,desc:“The promise before battle.”},
{level:3, form:“Bronze Guard”,    Art:TitanS2,desc:“First victories won.”},
{level:5, form:“Golden Knight”,   Art:TitanS3,desc:“The legend forming.”},
{level:7, form:“Warlord”,         Art:TitanS4,desc:“Armies step aside.”},
{level:10,form:“Eternal Champion”,Art:TitanS5,desc:“Songs are still being written.”},
]},
{id:“storm”,  name:“Storm”,   color:”#eab308”,desc:“Pure electrical fury wearing the shape of a living thing.”,stages:[
{level:1, form:“Static”,          Art:StormS1,desc:“A charge in the air.”},
{level:3, form:“Spark”,           Art:StormS2,desc:“The first bolt thrown.”},
{level:5, form:“Thunderhead”,     Art:StormS3,desc:“Weather patterns change.”},
{level:7, form:“Lightning Lord”,  Art:StormS4,desc:“Controls the storm. Is the storm.”},
{level:10,form:“The Tempest”,     Art:StormS5,desc:“The sky obeys.”},
]},
{id:“nova”,   name:“Nova”,    color:”#d946ef”,desc:“An explosion that refuses to fade. Gets brighter every moment.”,stages:[
{level:1, form:“Pinpoint”,        Art:NovaS1,desc:“Compressed. Extremely dangerous.”},
{level:3, form:“Burst”,           Art:NovaS2,desc:“First expansion. Cannot be contained.”},
{level:5, form:“Radiant”,         Art:NovaS3,desc:“Visible from far away now.”},
{level:7, form:“Supernova”,       Art:NovaS4,desc:“Growing from the wreckage.”},
{level:10,form:“Eternal Bloom”,   Art:NovaS5,desc:“The explosion became everything.”},
]},
{id:“reef”,   name:“Reef”,    color:”#22d3ee”,desc:“An ocean hunter. Patient as the tide. Inevitable as the sea.”,stages:[
{level:1, form:“Larvae”,          Art:ReefS1,desc:“Almost invisible. Learning.”},
{level:3, form:“Jellyfish”,       Art:ReefS2,desc:“Stings without warning.”},
{level:5, form:“Kraken Pup”,      Art:ReefS3,desc:“The tentacles have opinions.”},
{level:7, form:“Deep Hunter”,     Art:ReefS4,desc:“The deep belongs to it.”},
{level:10,form:“The Leviathan”,   Art:ReefS5,desc:“Older than the ocean.”},
]},
];

const PET_LEVELS=[
{level:1, name:“Newborn”, xpReq:0},
{level:2, name:“Waking”,  xpReq:100},
{level:3, name:“Growing”, xpReq:250},
{level:4, name:“Learning”,xpReq:500},
{level:5, name:“Evolved”, xpReq:900},
{level:6, name:“Strong”,  xpReq:1400},
{level:7, name:“Powerful”,xpReq:2100},
{level:8, name:“Champion”,xpReq:3000},
{level:9, name:“Legend”,  xpReq:4200},
{level:10,name:“Eternal”, xpReq:6000},
];

const WORKOUT_TYPES=[
{id:“run”,         label:“Running”,      emoji:“🏃”,met:9.8},
{id:“walk”,        label:“Walking”,      emoji:“🚶”,met:3.5},
{id:“bike”,        label:“Cycling”,      emoji:“🚴”,met:8.0},
{id:“swim”,        label:“Swimming”,     emoji:“🏊”,met:7.0},
{id:“lift”,        label:“Weights”,      emoji:“🏋️”,met:5.0},
{id:“hiit”,        label:“HIIT”,         emoji:“⚡”,met:10.0},
{id:“calisthenics”,label:“Calisthenics”, emoji:“🤸”,met:8.0},
{id:“pullups”,     label:“Pull-ups”,     emoji:“💪”,met:6.0},
{id:“pushups”,     label:“Push-ups”,     emoji:“🔼”,met:5.5},
{id:“yoga”,        label:“Yoga”,         emoji:“🧘”,met:2.5},
{id:“pilates”,     label:“Pilates”,      emoji:“🩰”,met:3.0},
{id:“jump_rope”,   label:“Jump Rope”,    emoji:“🔁”,met:12.0},
{id:“sport”,       label:“Sports”,       emoji:“⚽”,met:7.5},
{id:“climb”,       label:“Climbing”,     emoji:“🧗”,met:8.0},
{id:“dance”,       label:“Dancing”,      emoji:“💃”,met:5.5},
{id:“row”,         label:“Rowing”,       emoji:“🚣”,met:7.0},
{id:“elliptic”,    label:“Elliptical”,   emoji:“🔄”,met:6.5},
{id:“boxing”,      label:“Boxing”,       emoji:“🥊”,met:9.0},
{id:“martial”,     label:“Martial Arts”, emoji:“🥋”,met:10.0},
{id:“hike”,        label:“Hiking”,       emoji:“🥾”,met:6.0},
{id:“skating”,     label:“Skating”,      emoji:“🛼”,met:7.0},
{id:“other”,       label:“Other”,        emoji:“🔥”,met:5.0},
];

const QUICK_FOODS=[
{kw:[“chicken breast”,“grilled chicken”,“baked chicken”,“chicken”],name:“Chicken Breast”,      emoji:“🍗”,cal:185,pro:35,car:0,  fat:4,  fib:0},
{kw:[“salmon”,“salmon fillet”],                                     name:“Salmon”,              emoji:“🐟”,cal:234,pro:31,car:0,  fat:12, fib:0},
{kw:[“ground beef”,“beef”,“burger patty”],                         name:“Ground Beef 90/10”,   emoji:“🥩”,cal:196,pro:24,car:0,  fat:11, fib:0},
{kw:[“ground turkey”,“turkey”],                                     name:“Ground Turkey”,       emoji:“🦃”,cal:170,pro:22,car:0,  fat:9,  fib:0},
{kw:[“tuna”,“tuna can”],                                           name:“Canned Tuna”,         emoji:“🐟”,cal:109,pro:25,car:0,  fat:1,  fib:0},
{kw:[“shrimp”,“prawns”],                                           name:“Shrimp”,              emoji:“🦐”,cal:112,pro:24,car:0,  fat:1.5,fib:0},
{kw:[“tilapia”,“white fish”],                                      name:“Tilapia”,             emoji:“🐠”,cal:111,pro:23,car:0,  fat:2,  fib:0},
{kw:[“egg white”,“egg whites”],                                    name:“Egg Whites x3”,       emoji:“🥚”,cal:51, pro:11,car:0.6,fat:0.3,fib:0},
{kw:[“egg”,“eggs”,“whole egg”],                                    name:“Whole Egg”,           emoji:“🥚”,cal:72, pro:6, car:0.4,fat:5,  fib:0},
{kw:[“greek yogurt”,“yogurt”],                                     name:“Greek Yogurt”,        emoji:“🫙”,cal:100,pro:17,car:6,  fat:0,  fib:0},
{kw:[“cottage cheese”],                                            name:“Cottage Cheese”,      emoji:“🫙”,cal:90, pro:12,car:5,  fat:2.5,fib:0},
{kw:[“protein shake”,“protein powder”,“whey”,“protein”],           name:“Protein Shake”,       emoji:“🥤”,cal:120,pro:25,car:5,  fat:2,  fib:1},
{kw:[“quest bar”,“protein bar”,“bar”],                             name:“Quest Bar”,           emoji:“💪”,cal:200,pro:21,car:22, fat:8,  fib:14},
{kw:[“fairlife”,“core power”],                                     name:“Fairlife Core Power”, emoji:“🥤”,cal:230,pro:42,car:13, fat:3.5,fib:0},
{kw:[“premier protein”],                                           name:“Premier Protein”,     emoji:“🥤”,cal:160,pro:30,car:6,  fat:3,  fib:1},
{kw:[“beef jerky”,“jerky”],                                        name:“Beef Jerky 1oz”,      emoji:“🥩”,cal:116,pro:9, car:3,  fat:7,  fib:0},
{kw:[“deli turkey”,“turkey breast”,“deli meat”],                   name:“Deli Turkey 2oz”,     emoji:“🦃”,cal:60, pro:11,car:1,  fat:1,  fib:0},
{kw:[“tofu”,“firm tofu”],                                          name:“Firm Tofu”,           emoji:“⬜”,cal:144,pro:17,car:4,  fat:8,  fib:2},
{kw:[“white rice”,“jasmine rice”],                                 name:“White Rice”,          emoji:“🍚”,cal:206,pro:4, car:45, fat:0.4,fib:0.6},
{kw:[“brown rice”],                                                 name:“Brown Rice”,          emoji:“🍚”,cal:216,pro:5, car:45, fat:1.8,fib:3.5},
{kw:[“rice”],                                                       name:“White Rice”,          emoji:“🍚”,cal:206,pro:4, car:45, fat:0.4,fib:0.6},
{kw:[“oatmeal”,“oats”],                                            name:“Oatmeal”,             emoji:“🥣”,cal:158,pro:6, car:27, fat:3,  fib:4},
{kw:[“sweet potato”,“yam”],                                        name:“Sweet Potato”,        emoji:“🍠”,cal:103,pro:2, car:24, fat:0.1,fib:3.8},
{kw:[“pasta”,“spaghetti”,“noodles”],                                name:“Pasta”,               emoji:“🍝”,cal:220,pro:8, car:43, fat:1.3,fib:2.5},
{kw:[“bread”,“toast”],                                             name:“Bread 1 slice”,       emoji:“🍞”,cal:81, pro:4, car:14, fat:1,  fib:1.9},
{kw:[“ezekiel bread”,“sprouted bread”],                            name:“Ezekiel Bread”,       emoji:“🍞”,cal:80, pro:4, car:15, fat:0.5,fib:3},
{kw:[“quinoa”],                                                     name:“Quinoa”,              emoji:“🌾”,cal:222,pro:8, car:39, fat:4,  fib:5},
{kw:[“potato”,“white potato”],                                     name:“Potato”,              emoji:“🥔”,cal:161,pro:4, car:37, fat:0.2,fib:3.8},
{kw:[“broccoli”],                                                   name:“Broccoli”,            emoji:“🥦”,cal:55, pro:4, car:11, fat:0.6,fib:5},
{kw:[“spinach”],                                                    name:“Spinach”,             emoji:“🥬”,cal:14, pro:1.7,car:2, fat:0.2,fib:1.3},
{kw:[“asparagus”],                                                  name:“Asparagus”,           emoji:“🌿”,cal:27, pro:3, car:5,  fat:0.2,fib:2.8},
{kw:[“bell pepper”,“pepper”],                                      name:“Bell Pepper”,         emoji:“🫑”,cal:31, pro:1, car:7,  fat:0.3,fib:2.5},
{kw:[“zucchini”,“courgette”],                                      name:“Zucchini”,            emoji:“🥒”,cal:33, pro:2.4,car:6, fat:0.6,fib:2},
{kw:[“kale”],                                                       name:“Kale”,                emoji:“🥬”,cal:33, pro:2.9,car:6, fat:0.6,fib:1.3},
{kw:[“cucumber”],                                                   name:“Cucumber”,            emoji:“🥒”,cal:16, pro:0.7,car:3.8,fat:0.1,fib:0.5},
{kw:[“tomato”],                                                     name:“Tomato”,              emoji:“🍅”,cal:35, pro:1.7,car:7, fat:0.4,fib:2.2},
{kw:[“avocado”,“avo”],                                             name:“Avocado half”,        emoji:“🥑”,cal:120,pro:1.5,car:6, fat:11, fib:5},
{kw:[“banana”],                                                     name:“Banana”,              emoji:“🍌”,cal:105,pro:1.3,car:27, fat:0.4,fib:3.1},
{kw:[“apple”],                                                      name:“Apple”,               emoji:“🍎”,cal:95, pro:0.5,car:25, fat:0.3,fib:4.4},
{kw:[“blueberries”,“blueberry”],                                   name:“Blueberries”,         emoji:“🫐”,cal:84, pro:1.1,car:21, fat:0.5,fib:3.6},
{kw:[“strawberries”,“strawberry”],                                 name:“Strawberries”,        emoji:“🍓”,cal:49, pro:1,  car:12, fat:0.5,fib:3},
{kw:[“mango”],                                                      name:“Mango 1 cup”,         emoji:“🥭”,cal:107,pro:0.8,car:28, fat:0.4,fib:3},
{kw:[“orange”],                                                     name:“Orange”,              emoji:“🍊”,cal:62, pro:1.2,car:15, fat:0.2,fib:3.1},
{kw:[“peanut butter”,“pb”],                                        name:“Peanut Butter 2tbsp”, emoji:“🥜”,cal:188,pro:8,  car:6,  fat:16, fib:2},
{kw:[“almond butter”],                                             name:“Almond Butter 2tbsp”, emoji:“🌰”,cal:196,pro:7,  car:6,  fat:18, fib:3.3},
{kw:[“almonds”,“almond”],                                          name:“Almonds 1oz”,         emoji:“🌰”,cal:164,pro:6,  car:6,  fat:14, fib:3.5},
{kw:[“olive oil”],                                                 name:“Olive Oil 1tbsp”,     emoji:“🫒”,cal:119,pro:0,  car:0,  fat:13.5,fib:0},
{kw:[“mixed nuts”,“nuts”],                                         name:“Mixed Nuts 1oz”,      emoji:“🥜”,cal:173,pro:5,  car:8,  fat:16, fib:2},
{kw:[“milk”,“whole milk”],                                         name:“Whole Milk 1 cup”,    emoji:“🥛”,cal:149,pro:8,  car:12, fat:8,  fib:0},
{kw:[“skim milk”,“low fat milk”],                                  name:“Skim Milk 1 cup”,     emoji:“🥛”,cal:83, pro:8,  car:12, fat:0.2,fib:0},
{kw:[“cheese”,“cheddar”],                                          name:“Cheddar 1oz”,         emoji:“🧀”,cal:115,pro:7,  car:0.4,fat:9,  fib:0},
{kw:[“mozzarella”],                                                 name:“Mozzarella 1oz”,      emoji:“🧀”,cal:85, pro:6,  car:1,  fat:6,  fib:0},
{kw:[“butter”],                                                     name:“Butter 1tbsp”,        emoji:“🧈”,cal:102,pro:0.1,car:0, fat:11.5,fib:0},
{kw:[“black beans”,“beans”],                                       name:“Black Beans half cup”,emoji:“🫘”,cal:114,pro:7.6,car:20, fat:0.5,fib:7.5},
{kw:[“low carb tortilla”,“low carb wrap”,“mission carb balance”,“carb balance”],name:“Low Carb Tortilla”,emoji:“🫓”,cal:70,pro:5,car:18,fat:3,fib:11},
{kw:[“flour tortilla”,“tortilla”,“wrap”],                          name:“Flour Tortilla”,      emoji:“🫓”,cal:213,pro:6,  car:36, fat:5,  fib:2},
{kw:[“corn tortilla”],                                             name:“Corn Tortilla x2”,    emoji:“🌮”,cal:104,pro:2.7,car:22, fat:1.3,fib:3},
{kw:[“whole wheat tortilla”,“wheat tortilla”],                     name:“Wheat Tortilla”,      emoji:“🫓”,cal:140,pro:4,  car:22, fat:4,  fib:3},
{kw:[“black coffee”,“plain coffee”],                               name:“Black Coffee”,        emoji:“☕”,cal:2,  pro:0.3,car:0,  fat:0,  fib:0},
{kw:[“coffee with creamer”,“creamer coffee”,“coffee creamer”,“coffee cream”],name:“Coffee with Creamer”,emoji:“☕”,cal:50,pro:0.5,car:7,fat:2,fib:0},
{kw:[“cinnamon coffee”,“coffee cinnamon”,“coffee with cinnamon”],  name:“Coffee Cream Cinnamon”,emoji:“☕”,cal:55,pro:0.5,car:7,fat:2.5,fib:0.5},
{kw:[“bulletproof coffee”,“butter coffee”],                        name:“Bulletproof Coffee”,  emoji:“☕”,cal:230,pro:0.3,car:0,  fat:25, fib:0},
{kw:[“latte”,“cafe latte”],                                        name:“Latte oat milk”,      emoji:“☕”,cal:130,pro:3,  car:22, fat:3,  fib:1},
{kw:[“espresso”],                                                   name:“Espresso double”,     emoji:“☕”,cal:10, pro:0.7,car:1.5,fat:0.2,fib:0},
{kw:[“cold brew”],                                                  name:“Cold Brew 12oz”,      emoji:“☕”,cal:15, pro:0.5,car:3,  fat:0,  fib:0},
{kw:[“coffee”],                                                     name:“Black Coffee”,        emoji:“☕”,cal:2,  pro:0.3,car:0,  fat:0,  fib:0},
{kw:[“pizza”],                                                      name:“Pizza Slice”,         emoji:“🍕”,cal:285,pro:12, car:36, fat:10, fib:2},
{kw:[“burger”,“hamburger”,“big mac”],                              name:“Burger”,              emoji:“🍔”,cal:450,pro:23, car:40, fat:20, fib:2},
{kw:[“fries”,“french fries”],                                      name:“Fries medium”,        emoji:“🍟”,cal:320,pro:4,  car:44, fat:15, fib:3},
{kw:[“chipotle”,“burrito bowl”],                                   name:“Chipotle Bowl”,       emoji:“🥙”,cal:655,pro:51, car:62, fat:21, fib:11},
{kw:[“chick fil a”,“chicken sandwich”],                            name:“Chick-fil-A”,         emoji:“🍗”,cal:440,pro:28, car:40, fat:19, fib:1},
{kw:[“subway”,“footlong”,“sub sandwich”],                          name:“Subway 6in Turkey”,   emoji:“🥖”,cal:280,pro:18, car:46, fat:4.5,fib:3},
{kw:[“salad”],                                                      name:“Side Salad”,          emoji:“🥗”,cal:150,pro:8,  car:12, fat:7,  fib:4},
{kw:[“sushi”,“sushi roll”],                                        name:“Sushi Roll 8pc”,      emoji:“🍱”,cal:320,pro:14, car:56, fat:5,  fib:2},
{kw:[“rice cakes”,“rice cake”],                                    name:“Rice Cakes x2”,       emoji:“🫓”,cal:70, pro:1.4,car:15, fat:0.4,fib:0.4},
{kw:[“hummus”],                                                     name:“Hummus 2tbsp”,        emoji:“🫘”,cal:50, pro:2,  car:6,  fat:3,  fib:1.6},
{kw:[“soup”,“chicken soup”],                                       name:“Soup 1 cup”,          emoji:“🍲”,cal:120,pro:8,  car:15, fat:3,  fib:1},
{kw:[“bacon”],                                                      name:“Bacon 2 strips”,      emoji:“🥓”,cal:86, pro:6,  car:0.1,fat:7,  fib:0},
{kw:[“gatorade”,“sports drink”],                                   name:“Gatorade 20oz”,       emoji:“🥤”,cal:140,pro:0,  car:36, fat:0,  fib:0},
{kw:[“dark chocolate”,“chocolate”],                                name:“Dark Chocolate 1oz”,  emoji:“🍫”,cal:170,pro:2,  car:13, fat:12, fib:3},
{kw:[“ice cream”],                                                  name:“Ice Cream half cup”,  emoji:“🍦”,cal:207,pro:3.5,car:24, fat:11, fib:0.7},
{kw:[“protein pancakes”,“pancake”],                                name:“Protein Pancakes”,    emoji:“🥞”,cal:180,pro:16, car:22, fat:4,  fib:2},
{kw:[“overnight oats”],                                            name:“Overnight Oats”,      emoji:“🥣”,cal:215,pro:10, car:35, fat:4,  fib:5},
{kw:[“granola bar”,“nature valley”],                               name:“Granola Bar”,         emoji:“🍫”,cal:190,pro:4,  car:29, fat:7,  fib:2},
];

const QUICK_CATS=[
{label:“Protein”,  emoji:“💪”,items:QUICK_FOODS.slice(0,18)},
{label:“Carbs”,    emoji:“🍚”,items:QUICK_FOODS.slice(18,28)},
{label:“Veggies”,  emoji:“🥦”,items:QUICK_FOODS.slice(28,36)},
{label:“Fruits”,   emoji:“🍎”,items:QUICK_FOODS.slice(36,43)},
{label:“Fats”,     emoji:“🥑”,items:QUICK_FOODS.slice(43,53)},
{label:“Tortillas”,emoji:“🫓”,items:QUICK_FOODS.slice(53,57)},
{label:“Coffee”,   emoji:“☕”,items:QUICK_FOODS.slice(57,65)},
{label:“Fast Food”,emoji:“🍔”,items:QUICK_FOODS.slice(65,73)},
{label:“Snacks”,   emoji:“🍫”,items:QUICK_FOODS.slice(73)},
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
var res=await fetch(“https://api.nal.usda.gov/fdc/v1/foods/search?query=”+encodeURIComponent(q)+”&pageSize=8&api_key=DEMO_KEY”);
var data=await res.json();
if(!data.foods||!data.foods.length)return[];
return data.foods.map(function(f){
var ns=f.foodNutrients||[];
function g(id){var x=ns.find(function(y){return y.nutrientId===id||y.nutrientNumber===String(id);});return x?Math.round(x.value*10)/10:0;}
return{name:f.description.slice(0,40),emoji:“🔍”,brand:f.brandOwner||””,cal:g(1008)||g(“208”),pro:g(1003)||g(“203”),car:g(1005)||g(“205”),fat:g(1004)||g(“204”),fib:g(1079)||g(“291”)};
});
}catch(e){return[];}
}

function parseVoice(text){
if(!text||!text.trim())return[];
var lower=text.toLowerCase();
var results=[];
var segments=lower.split(/\s+and\s+|\s+,\s+|,\s+|,|\s+then\s+|\s+plus\s+|\s+also\s+/);
segments.forEach(function(seg){
seg=seg.trim();if(seg.length<2)return;
var qty=1;
var qMatch=seg.match(/^(\d+(?:.\d+)?)\s+/);
var ozMatch=seg.match(/(\d+(?:.\d+)?)\s*(?:oz|ounce)/);
if(qMatch)qty=parseFloat(qMatch[1]);
var matched=null;
for(var i=0;i<QUICK_FOODS.length;i++){
var qf=QUICK_FOODS[i];var found=false;
for(var j=0;j<qf.kw.length;j++){if(seg.indexOf(qf.kw[j])!==-1){found=true;break;}}
if(found){matched=qf;break;}
}
if(!matched){results.push({id:Date.now()+Math.random(),name:seg,emoji:“🎤”,cal:0,pro:0,car:0,fat:0,fib:0,servings:“1”});return;}
var mult=ozMatch?parseFloat(ozMatch[1])*2:qty;
mult=Math.max(0.25,Math.min(10,mult));
results.push({id:Date.now()+Math.random(),name:matched.name,emoji:matched.emoji,cal:Math.round(matched.cal*mult),pro:r1(matched.pro*mult),car:r1(matched.car*mult),fat:r1(matched.fat*mult),fib:r1(matched.fib*mult),servings:“1”});
});
return results;
}

function calcBurn(lbs,min,met){return Math.round((met*lbs*0.453592*min)/60);}

function scoreMeal(meal,goals,calsBefore){
var score=0;var details=[];var tips=[];
var pp=meal.cal>0?(meal.pro/meal.cal)*100:0;
var ps=Math.min(40,Math.round(pp*2.5));score+=ps;
if(ps>=25)details.push({t:“Great protein density”,pos:true});
else if(ps>=12)details.push({t:“Decent protein here”,pos:true});
else{details.push({t:“Light on protein this meal”,pos:false});tips.push(“Try adding chicken, eggs, Greek yogurt, or a protein shake”);}
var rem=goals.calories-calsBefore;
var cs=meal.cal<=rem?Math.min(25,Math.round(25*(1-meal.cal/goals.calories))):5;
score+=cs;
if(meal.cal>rem+400)tips.push(“A little over today. No big deal, just go lighter next meal”);
var fs=Math.min(15,Math.round((meal.fib/Math.max(goals.fiber,1))*150));
score+=fs;
if(fs>=8)details.push({t:“Good fiber in this one”,pos:true});
else if(meal.fib<2)tips.push(“Adding veggies or beans would boost the fiber and the score”);
score+=8;
var final=Math.max(20,Math.min(100,score));
var label=“Keep Going”;var lc=”#94a3b8”;var icon=“🌱”;
if(final>=85){label=“Amazing”;lc=”#fbbf24”;icon=“🌟”;}
else if(final>=70){label=“Great”;lc=”#34d399”;icon=“💪”;}
else if(final>=55){label=“Good”;lc=”#60a5fa”;icon=“👍”;}
var encs=[“Every meal is a step forward.”,“You showed up. That is what matters.”,“Consistency beats perfection.”,“Your body is working with every good choice.”,“Progress lives in the ordinary moments.”,“This is what building something real looks like.”,“Further along than yesterday.”];
if(tips.length===0)tips.push(“Solid meal. Keep this up!”);
return{score:final,label:label,lc:lc,icon:icon,details:details,tips:tips,enc:encs[Math.floor(Math.random()*encs.length)]};
}

var CSS=”@import url(‘https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap’);*{box-sizing:border-box;margin:0;padding:0;}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}input[type=number]{-moz-appearance:textfield;}.delbtn{opacity:0!important;transition:opacity .2s!important;}.mcard:hover .delbtn{opacity:1!important;}.fc{transition:transform .12s;cursor:pointer;}.fc:hover{transform:translateY(-3px);}.pf{animation:petfloat 3.5s ease-in-out infinite;}@keyframes petfloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}@keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-12px);}}@keyframes loadbar{from{width:0%;}to{width:100%;}}@keyframes xpPop{0%{opacity:0;transform:translateY(0) scale(0.4);}15%{opacity:1;transform:translateY(-24px) scale(1.3);}70%{opacity:1;transform:translateY(-50px);}100%{opacity:0;transform:translateY(-70px);}}.xpa{animation:xpPop 2.8s ease-out forwards;}@keyframes vpa{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}.vp{animation:vpa 1s ease-in-out infinite;}@keyframes slideUp{from{transform:translateY(30px);opacity:0;}to{transform:translateY(0);opacity:1;}}.su{animation:slideUp .3s ease-out;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.2);border-radius:99px;}”;

export default function App(){
var [userName,setUserName]=useState(””);
var [nameInput,setNameInput]=useState(””);
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
var [tab,setTab]=useState(“home”);
var [themeId,setThemeId]=useState(“obsidian”);
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
var [weightInput,setWeightInput]=useState(””);
var [delSaved,setDelSaved]=useState(null);
var [mealName,setMealName]=useState(””);
var [ings,setIngs]=useState([]);
var [mealErr,setMealErr]=useState(””);
var [catIdx,setCatIdx]=useState(0);
var [searchQ,setSearchQ]=useState(””);
var [searchR,setSearchR]=useState([]);
var [searching,setSearching]=useState(false);
var [searchErr,setSearchErr]=useState(””);
var [voiceText,setVoiceText]=useState(””);
var [voiceListening,setVoiceListening]=useState(false);
var [voiceErr,setVoiceErr]=useState(””);
var [voiceModal,setVoiceModal]=useState(false);
var [voiceParsed,setVoiceParsed]=useState([]);
var [showWorkoutModal,setShowWorkoutModal]=useState(false);
var [wkType,setWkType]=useState(WORKOUT_TYPES[0]);
var [wkDuration,setWkDuration]=useState(“30”);
var [wkNotes,setWkNotes]=useState(””);
var [wkIntensity,setWkIntensity]=useState(“moderate”);
var recogRef=useRef(null);

var T=THEMES.find(function(t){return t.id===themeId;})||THEMES[0];
var activePet=activePetId?PETS.find(function(p){return p.id===activePetId;}):null;
var activePetXP=(petData[activePetId]||{}).xp||0;
var activePetName=(petData[activePetId]||{}).name||(activePet?activePet.name:””);
var petLvl=getLvl(activePetXP);
var petStage=activePet?getStage(activePet,petLvl.level):null;
var petMaxed=(petData[activePetId]||{}).maxed||false;

useEffect(function(){
var n=kget(“ft-name”);var th=kget(“ft-theme”);
var m=kget(“ft-meals”);var sv=kget(“ft-saved”);var g=kget(“ft-goals”);
var ap=kget(“ft-apid”);var pd=kget(“ft-pd”);var z=kget(“ft-zoo”);
var w=kget(“ft-water”);var wl=kget(“ft-weights”);var td=kget(“ft-totaldays”);
var ll=kget(“ft-lastdate”);var bw=kget(“ft-bw”);var wk=kget(“ft-workouts”);
if(n){setUserName(n);setShowNameScreen(false);}
if(th&&THEMES.find(function(t){return t.id===th;}))setThemeId(th);
if(Array.isArray(m)&&m.length)setMeals(m);
if(Array.isArray(sv))setSaved(sv);
if(g&&typeof g===“object”){setGoals(g);setGoalsF(g);}
if(ap)setActivePetId(ap);
if(pd&&typeof pd===“object”)setPetData(pd);
if(Array.isArray(z))setZoo(z);
if(typeof w===“number”)setWaterGlasses(w);
if(Array.isArray(wl))setWeightLog(wl);
if(typeof td===“number”)setTotalDays(td);
if(ll)setLastDate(ll);
if(typeof bw===“number”)setBodyWeightLbs(bw);
if(Array.isArray(wk))setWorkouts(wk);
setLoaded(true);
setTimeout(function(){setSplash(false);},1800);
},[]);

useEffect(function(){
if(loaded){
kset(“ft-name”,userName);kset(“ft-theme”,themeId);kset(“ft-meals”,meals);
kset(“ft-saved”,saved);kset(“ft-goals”,goals);kset(“ft-apid”,activePetId);
kset(“ft-pd”,petData);kset(“ft-zoo”,zoo);kset(“ft-water”,waterGlasses);
kset(“ft-weights”,weightLog);kset(“ft-totaldays”,totalDays);kset(“ft-lastdate”,lastDate);
kset(“ft-bw”,bodyWeightLbs);kset(“ft-workouts”,workouts);
}
},[userName,themeId,meals,saved,goals,activePetId,petData,zoo,waterGlasses,weightLog,totalDays,lastDate,bodyWeightLbs,workouts,loaded]);

var mealTots=meals.reduce(function(a,m){a.cal+=sn(m.cal);a.pro+=sn(m.pro);a.car+=sn(m.car);a.fat+=sn(m.fat);a.fib+=sn(m.fib);return a;},{cal:0,pro:0,car:0,fat:0,fib:0});
var totalBurned=workouts.reduce(function(a,w){return a+sn(w.burned);},0);
var ingTots=ings.reduce(function(a,i){var s=sn(i.servings);a.cal+=Math.round(sn(i.cal)*s);a.pro+=r1(sn(i.pro)*s);a.car+=r1(sn(i.car)*s);a.fat+=r1(sn(i.fat)*s);a.fib+=r1(sn(i.fib)*s);return a;},{cal:0,pro:0,car:0,fat:0,fib:0});
var avgScore=meals.length>0?Math.round(meals.reduce(function(a,m){return a+(m.score||0);},0)/meals.length):null;
var netCal=mealTots.cal-totalBurned;

function awardXP(amt){
if(!activePetId)return;
setPetData(function(prev){
var cur=prev[activePetId]||{xp:0,name:activePet?activePet.name:””,maxed:false};
var nXP=cur.xp+amt;var nMaxed=nXP>=6000;
if(nMaxed&&!cur.maxed)setZoo(function(z){return z.includes(activePetId)?z:z.concat([activePetId]);});
var upd=Object.assign({},prev);
upd[activePetId]=Object.assign({},cur,{xp:Math.min(nXP,6000),maxed:nMaxed});
return upd;
});
setXpPop(amt);setTimeout(function(){setXpPop(null);},2800);
}

function trackDay(){
var today=new Date().toDateString();
if(lastDate===today)return;
setLastDate(today);setTotalDays(function(d){return d+1;});awardXP(5);
}

function addIng(food){
setIngs(function(prev){
var ex=prev.find(function(i){return i.name===food.name;});
if(ex)return prev.map(function(i){return i.name===food.name?Object.assign({},i,{servings:String(sn(i.servings)+1)}):i;});
return prev.concat([Object.assign({},food,{id:Date.now()+Math.random(),servings:“1”})]);
});setMealErr(””);
}

function updServ(id,val){setIngs(function(p){return p.map(function(i){return i.id===id?Object.assign({},i,{servings:val}):i;});});}
function removeIng(id){setIngs(function(p){return p.filter(function(i){return i.id!==id;});});}

async function doSearch(){
if(!searchQ.trim())return;
setSearching(true);setSearchErr(””);setSearchR([]);
var r=await searchUSDA(searchQ);
if(!r.length)setSearchErr(“No results. Try simpler terms.”);
setSearchR(r);setSearching(false);
}

function startVoice(){
setVoiceErr(””);setVoiceText(””);setVoiceParsed([]);
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR){setVoiceErr(“Voice not supported. Type below.”);return;}
var recog=new SR();
recog.continuous=false;recog.interimResults=true;recog.lang=“en-US”;
recog.onstart=function(){setVoiceListening(true);};
recog.onresult=function(e){var t=””;for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;setVoiceText(t);};
recog.onend=function(){setVoiceListening(false);setVoiceText(function(t){if(t.trim())setVoiceParsed(parseVoice(t));return t;});};
recog.onerror=function(){setVoiceListening(false);setVoiceErr(“Could not hear. Try typing below.”);};
recogRef.current=recog;recog.start();
}
function stopVoice(){if(recogRef.current)recogRef.current.stop();}

function confirmVoice(){
if(!voiceParsed.length){setVoiceErr(“No foods detected. Try typing.”);return;}
voiceParsed.forEach(function(f){addIng(f);});
setVoiceModal(false);setVoiceText(””);setVoiceParsed([]);
if(!mealName.trim())setMealName(“Meal “+new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”}));
}

function logMeal(){
if(!mealName.trim()){setMealErr(“Give this meal a name.”);return;}
if(!ings.length){setMealErr(“Add at least one food.”);return;}
var meal={id:Date.now(),name:mealName.trim(),cal:ingTots.cal,pro:ingTots.pro,car:ingTots.car,fat:ingTots.fat,fib:ingTots.fib,time:new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”})};
var sc=scoreMeal(meal,goals,mealTots.cal);
meal.score=sc.score;meal.label=sc.label;meal.lc=sc.lc;meal.icon=sc.icon;
setMeals(function(p){return p.concat([meal]);});
setScoredMeal(Object.assign({},meal,sc));
var xp=10;if(sc.score>=85)xp+=15;else if(sc.score>=70)xp+=8;else if(sc.score>=55)xp+=4;
awardXP(xp);trackDay();
setMealName(””);setIngs([]);setMealErr(””);setTab(“log”);
}

function saveMealTmpl(){
if(!mealName.trim()||!ings.length){setMealErr(“Name and add ingredients first.”);return;}
setSaved(function(p){return p.concat([{id:Date.now(),name:mealName.trim(),ings:ings.map(function(i){return Object.assign({},i);}),cal:ingTots.cal,pro:ingTots.pro,car:ingTots.car,fat:ingTots.fat}]);});
setMealErr(””);alert(mealName+” saved!”);
}

function loadTmpl(m){
setMealName(m.name);
setIngs(m.ings.map(function(i){return Object.assign({},i,{id:Date.now()+Math.random()});}));
setShowSaved(false);setTab(“build”);setMealErr(””);
}

function logWorkout(){
var im={light:wkType.met*0.7,moderate:wkType.met,hard:wkType.met*1.3};
var met=im[wkIntensity]||wkType.met;
var burned=calcBurn(bodyWeightLbs,sn(wkDuration),met);
var wk={id:Date.now(),type:wkType.id,label:wkType.label,emoji:wkType.emoji,duration:sn(wkDuration),burned:burned,intensity:wkIntensity,notes:wkNotes.trim(),time:new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”})};
setWorkouts(function(p){return p.concat([wk]);});
awardXP(12);trackDay();
setShowWorkoutModal(false);setWkNotes(””);setWkDuration(“30”);setTab(“log”);
}

function newDay(){
if(activePetId&&(meals.length>0||workouts.length>0)){
var xp=0;
if(meals.length>=3)xp+=10;
var cp=mealTots.cal/Math.max(goals.calories,1);
if(cp>=0.8&&cp<=1.1)xp+=15;
if(mealTots.pro/Math.max(goals.protein,1)>=0.85)xp+=20;
if(waterGlasses>=goals.water)xp+=10;
if(workouts.length>0)xp+=15;
if(xp>0)awardXP(xp);
}
setMeals([]);setWorkouts([]);setWaterGlasses(0);
setMealName(””);setIngs([]);setMealErr(””);
setConfirmNewDay(false);setTab(“home”);setScoredMeal(null);
}

function selectPet(id){
if(!petData[id]){
var pet=PETS.find(function(p){return p.id===id;});
setPetData(function(prev){var u=Object.assign({},prev);u[id]={xp:0,name:pet?pet.name:””,maxed:false};return u;});
}
setActivePetId(id);setShowPetPick(false);
}

function saveGoals(){
var g={calories:sn(goalsF.calories)||2000,protein:sn(goalsF.protein)||150,carbs:sn(goalsF.carbs)||225,fat:sn(goalsF.fat)||65,fiber:sn(goalsF.fiber)||25,water:sn(goalsF.water)||8};
setGoals(g);setShowGoals(false);
}

function card(ex){return Object.assign({background:T.card,border:“1px solid “+T.border,borderRadius:20,padding:“18px 20px”},ex||{});}
function inp(ex){return Object.assign({width:“100%”,background:T.card2,border:“1px solid “+T.border,borderRadius:10,color:T.text,fontSize:15,padding:“12px 16px”,fontFamily:”‘DM Sans’,sans-serif”,outline:“none”},ex||{});}
function pBtn(ex){return Object.assign({padding:“14px 0”,background:T.accent,border:“none”,borderRadius:12,color:[“snow”,“warm”,“mint”,“rose”].includes(themeId)?”#fff”:”#030712”,fontSize:13,fontWeight:700,fontFamily:”‘Space Mono’,monospace”,cursor:“pointer”,width:“100%”,letterSpacing:“0.04em”},ex||{});}
function gBtn(ex){return Object.assign({padding:“12px 0”,background:“transparent”,border:“1px solid “+T.border,borderRadius:12,color:T.sub,fontSize:12,fontWeight:600,fontFamily:”‘Space Mono’,monospace”,cursor:“pointer”,width:“100%”},ex||{});}
function sBtn(ex){return Object.assign({padding:“12px 0”,background:T.card2,border:“1px solid “+T.border,borderRadius:12,color:T.sub,fontSize:12,fontWeight:600,fontFamily:”‘Space Mono’,monospace”,cursor:“pointer”},ex||{});}
function navB(active){return{flex:1,padding:“10px 0 8px”,border:“none”,cursor:“pointer”,background:“transparent”,color:active?T.accent:T.faint,transition:“color .2s”,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:2,position:“relative”,fontFamily:”‘Space Mono’,monospace”,fontSize:9,fontWeight:700,letterSpacing:“0.05em”};}
function modal(ch){return <div style={{position:“fixed”,inset:0,background:“rgba(0,0,0,.92)”,zIndex:100,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20}}>{ch}</div>;}
function mBox(ch,ex){return <div style={Object.assign({background:T.card,border:“1px solid “+T.border,borderRadius:24,padding:28,width:“100%”,maxWidth:420,maxHeight:“92vh”,overflowY:“auto”},ex||{})}>{ch}</div>;}
function sheet(ch){return <div style={{position:“fixed”,inset:0,background:“rgba(0,0,0,.88)”,zIndex:100,display:“flex”,alignItems:“flex-end”,justifyContent:“center”}} onClick={function(e){if(e.target===e.currentTarget){setShowSaved(false);setShowTheme(false);setShowZoo(false);setShowPetPick(false);}}}>{ch}</div>;}
function sBox(ch){return <div style={{background:T.card,border:“1px solid “+T.border,borderTop:“2px solid “+T.accent,borderRadius:“24px 24px 0 0”,padding:“24px 20px”,width:“100%”,maxWidth:520,maxHeight:“88vh”,overflowY:“auto”}} className=“su”>{ch}</div>;}
function sLbl(t){return <div style={{fontSize:10,color:T.faint,fontFamily:”‘Space Mono’,monospace”,letterSpacing:“0.12em”,marginBottom:10}}>{t}</div>;}
function pgTtl(t){return <div style={{fontFamily:”‘Syne’,sans-serif”,fontSize:26,fontWeight:800,color:T.text,marginBottom:20,letterSpacing:”-0.02em”}}>{t}</div>;}

if(splash)return(
<div style={{position:“fixed”,inset:0,zIndex:200,background:”#030712”,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,overflow:“hidden”}}>
<style>{CSS}</style>
<div style={{position:“absolute”,inset:0,background:“radial-gradient(ellipse at 50% 60%, rgba(63,185,80,0.1) 0%, transparent 70%)”,pointerEvents:“none”}}/>
<div style={{textAlign:“center”,position:“relative”}}>
<div style={{fontFamily:”‘Syne’,sans-serif”,fontSize:58,fontWeight:800,letterSpacing:”-0.04em”,lineHeight:0.9,marginBottom:10}}>
<span style={{color:”#3fb950”}}>FUEL</span><br/>
<span style={{color:”#e6edf3”,fontSize:40}}>TRACK</span>
</div>
<div style={{fontSize:10,color:”#484f58”,fontFamily:”‘Space Mono’,monospace”,letterSpacing:“0.2em”,marginBottom:40}}>HEALTH - GROWTH - EVOLUTION</div>
<div style={{display:“flex”,gap:10,justifyContent:“center”,marginBottom:40}}>
{[“🔥”,“⚡”,“❄️”,“🌊”,“🌀”,“👻”,“🏆”,“💥”,“🐙”,“🐍”].map(function(e,i){return(
<div key={i} style={{fontSize:18,animation:“bounce 0.8s ease-in-out “+i*0.07+“s infinite alternate”}}>{e}</div>
);})}
</div>
<div style={{width:180,height:2,background:”#1a1a2e”,borderRadius:99,overflow:“hidden”,margin:“0 auto”}}>
<div style={{height:“100%”,background:“linear-gradient(90deg,#3fb950,#56d364)”,borderRadius:99,animation:“loadbar 1.6s ease-out forwards”}}/>
</div>
</div>
</div>
);

if(showNameScreen)return(
<div style={{minHeight:“100vh”,background:T.bg,color:T.text,fontFamily:”‘DM Sans’,sans-serif”,display:“flex”,alignItems:“center”,justifyContent:“center”,padding:20,position:“relative”,overflow:“hidden”}}>
<style>{CSS}</style>
<div style={{position:“absolute”,inset:0,background:“radial-gradient(ellipse at 50% 30%, “+T.accent+“18 0%, transparent 60%)”,pointerEvents:“none”}}/>
{showTheme&&sheet(sBox(
<div>
<div style={{fontFamily:”‘Syne’,sans-serif”,fontSize:22,fontWeight:800,marginBottom:16}}>Theme</div>
<div style={{display:“flex”,flexWrap:“wrap”,gap:8}}>
{THEMES.map(function(th){return(
<button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:“flex”,alignItems:“center”,gap:8,padding:“8px 14px”,borderRadius:10,cursor:“pointer”,border:themeId===th.id?“2px solid “+T.accent:“1px solid “+T.border,background:th.card,transition:“all .15s”}}>
<div style={{width:12,height:12,borderRadius:3,background:th.accent}}/>
<span style={{fontSize:11,fontWeight:700,fontFamily:”‘Space Mono’,monospace”,color:themeId===th.id?T.accent:th.text,whiteSpace:“nowrap”}}>{th.label}</span>
</button>
);})}
</div>
</div>
))}
<div style={{width:“100%”,maxWidth:380,position:“relative”}}>
<div style={{textAlign:“center”,marginBottom:36}}>
<div style={{fontFamily:”‘Syne’,sans-serif”,fontSize:54,fontWeight:800,letterSpacing:”-0.04em”,lineHeight:0.9,marginBottom:10}}>
<span style={{color:T.accent}}>FUEL</span><br/>
<span style={{color:T.text,fontSize:38}}>TRACK</span>
</div>
<div style={{fontSize:11,color:T.sub,fontFamily:”‘Space Mono’,monospace”,letterSpacing:“0.14em”,marginTop:8}}>YOUR COMPANION AWAITS</div>
</div>
<div style={Object.assign({},card(),{marginBottom:14,borderTop:“2px solid “+T.accent})}>
<div style={{fontSize:17,fontWeight:700,color:T.text,fontFamily:”‘Syne’,sans-serif”,marginBottom:6}}>What should we call you?</div>
<div style={{fontSize:13,color:T.sub,marginBottom:20,lineHeight:1.5}}>Stays on your device. No account. No data collected.</div>
<input type=“text” value={nameInput} onChange={function(e){setNameInput(e.target.value);}} onKeyDown={function(e){if(e.key===“Enter”&&nameInput.trim()){setUserName(nameInput.trim());setShowNameScreen(false);}}} placeholder=“Your name…” style={inp({marginBottom:14,borderLeft:“3px solid “+T.accent})} autoFocus/>
<button onClick={function(){if(nameInput.trim()){setUserName(nameInput.trim());setShowNameScreen(false);}}} style={pBtn()}>Get Started</button>
</div>
<div style={{textAlign:“center”}}>
<button onClick={function(){setShowTheme(true);}} style={{background:“transparent”,border:“1px solid “+T.border,color:T.sub,borderRadius:8,padding:“7px 16px”,fontSize:11,cursor:“pointer”,fontFamily:”‘Space Mono’,monospace”,letterSpacing:“0.06em”}}>THEME</button>
</div>
</div>
</div>
);

return(
<div style={{minHeight:“100vh”,background:T.bg,color:T.text,fontFamily:”‘DM Sans’,sans-serif”,transition:“background .3s”,paddingBottom:76}}>
<style>{CSS}</style>

```
  {xpPop!=null&&<div className="xpa" style={{position:"fixed",top:72,right:20,zIndex:200,background:"linear-gradient(135deg,#fbbf24,#f97316)",color:"#030712",borderRadius:14,padding:"8px 18px",fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,pointerEvents:"none",boxShadow:"0 4px 20px rgba(251,191,36,0.5)"}}>+{xpPop} XP</div>}

  {scoredMeal&&modal(mBox(
    <div>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:52,marginBottom:10,lineHeight:1}}>{scoredMeal.icon}</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:42,fontWeight:800,color:scoredMeal.lc,lineHeight:1,marginBottom:6}}>{scoredMeal.label}</div>
        <div style={{fontSize:13,color:T.sub,fontStyle:"italic",marginBottom:8,lineHeight:1.5}}>{scoredMeal.enc}</div>
        <div style={{display:"inline-block",background:scoredMeal.lc+"22",color:scoredMeal.lc,borderRadius:20,padding:"3px 12px",fontSize:11,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{scoredMeal.score}/100</div>
      </div>
      {scoredMeal.details.length>0&&<div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
        {scoredMeal.details.map(function(d,i){return(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card2,borderRadius:12,border:"1px solid "+T.border}}>
            <span style={{fontSize:15}}>{d.pos?"ok":"hint"}</span>
            <span style={{fontSize:13,color:T.sub,lineHeight:1.4}}>{d.t}</span>
          </div>
        );})}
      </div>}
      {scoredMeal.tips&&scoredMeal.tips.length>0&&(
        <div style={{background:T.accent+"12",border:"1px solid "+T.accent+"44",borderRadius:14,padding:"14px 16px",marginBottom:16}}>
          {sLbl("NEXT TIME TRY THIS")}
          {scoredMeal.tips.map(function(t,i){return(
            <div key={i} style={{display:"flex",gap:10,marginBottom:6}}><span>hint</span><div style={{fontSize:13,color:T.sub,lineHeight:1.5}}>{t}</div></div>
          );})}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18}}>
        {[["CAL",scoredMeal.cal,"kcal","#3fb950"],["PRO",scoredMeal.pro,"g","#34d399"],["CARBS",scoredMeal.car,"g","#60a5fa"]].map(function(x){return(
          <div key={x[0]} style={{background:T.card2,borderRadius:12,padding:"10px 6px",textAlign:"center",border:"1px solid "+T.border}}>
            <div style={{fontSize:9,color:T.faint,fontFamily:"'Space Mono',monospace",marginBottom:3}}>{x[0]}</div>
            <div style={{fontSize:18,fontWeight:800,color:x[3],fontFamily:"'Syne',sans-serif"}}>{x[1]}<span style={{fontSize:10,fontWeight:400}}>{x[2]}</span></div>
          </div>
        );})}
      </div>
      <button onClick={function(){setScoredMeal(null);}} style={pBtn()}>Keep going!</button>
    </div>
  ))}

  {voiceModal&&(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={function(e){if(e.target===e.currentTarget)setVoiceModal(false);}}>
      {sBox(
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,marginBottom:4}}>Voice Entry</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:24,lineHeight:1.5}}>Say what you ate and we will figure out the rest</div>
          <div style={{textAlign:"center",marginBottom:24}}>
            <button onClick={voiceListening?stopVoice:startVoice} className={voiceListening?"vp":""} style={{width:88,height:88,borderRadius:99,background:voiceListening?"#ef4444":T.accent,border:"none",cursor:"pointer",fontSize:32,transition:"all .2s",boxShadow:voiceListening?"0 0 30px rgba(239,68,68,0.5)":"0 0 30px "+T.accent+"66"}}>
              {voiceListening?"X":"mic"}
            </button>
            <div style={{fontSize:11,color:T.sub,marginTop:12,fontFamily:"'Space Mono',monospace",letterSpacing:"0.06em"}}>{voiceListening?"LISTENING - TAP TO STOP":"TAP MIC TO START"}</div>
          </div>
          {voiceText&&(
            <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"14px",marginBottom:16}}>
              {sLbl("YOU SAID")}
              <div style={{fontSize:15,color:T.text,lineHeight:1.6,fontStyle:"italic"}}>"{voiceText}"</div>
            </div>
          )}
          {voiceParsed.length>0&&(
            <div style={{marginBottom:16}}>
              {sLbl("FOODS DETECTED")}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {voiceParsed.map(function(f,i){return(
                  <div key={i} style={{background:T.card2,border:"1px solid "+T.accent+"44",borderRadius:12,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span style={{fontSize:24}}>{f.emoji}</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:T.text,fontFamily:"'Syne',sans-serif"}}>{f.name}</div>
                        <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:T.accent}}>{f.cal} kcal P{f.pro}g</div>
                      </div>
                    </div>
                    <button onClick={function(){setVoiceParsed(function(p){return p.filter(function(_,j){return j!==i;});});}} style={{background:"transparent",border:"1px solid "+T.border,color:T.faint,cursor:"pointer",fontSize:15,width:28,height:28,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
                  </div>
                );})}
              </div>
            </div>
          )}
          {voiceErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'Space Mono',monospace",marginBottom:12,padding:"10px 14px",background:"rgba(127,29,29,0.3)",borderRadius:10}}>{voiceErr}</div>}
          <div style={{marginBottom:16}}>
            {sLbl("OR TYPE WHAT YOU ATE")}
            <div style={{display:"flex",gap:8}}>
              <input type="text" value={voiceText} onChange={function(e){setVoiceText(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&voiceText.trim())setVoiceParsed(parseVoice(voiceText));}} placeholder="e.g. 2 eggs and oatmeal..." style={inp({flex:1,fontSize:14,padding:"10px 14px"})}/>
              <button onClick={function(){if(voiceText.trim())setVoiceParsed(parseVoice(voiceText));}} style={{padding:"10px 16px",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>Parse</button>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={function(){setVoiceModal(false);}} style={gBtn({flex:1})}>Cancel</button>
            <button onClick={confirmVoice} disabled={voiceParsed.length===0} style={pBtn({flex:2,opacity:voiceParsed.length===0?0.4:1})}>
              Add {voiceParsed.length>0?voiceParsed.reduce(function(a,f){return a+f.cal;},0)+" kcal":""} to Meal
            </button>
          </div>
        </div>
      )}
    </div>
  )}

  {showWorkoutModal&&modal(mBox(
    <div>
      {pgTtl("Log Workout")}
      {sLbl("WORKOUT TYPE")}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:20}}>
        {WORKOUT_TYPES.map(function(wt){var active=wkType.id===wt.id;return(
          <button key={wt.id} onClick={function(){setWkType(wt);}} style={{padding:"10px 4px",border:"1px solid "+(active?T.accent:T.border),borderRadius:10,background:active?T.accent+"1a":T.card2,cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
            <div style={{fontSize:20,marginBottom:3}}>{wt.emoji}</div>
            <div style={{fontSize:8,color:active?T.accent:T.sub,fontFamily:"'Space Mono',monospace",fontWeight:700,lineHeight:1.2}}>{wt.label}</div>
          </button>
        );})}
      </div>
      {sLbl("DURATION MIN")}
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {["15","20","30","45","60","90"].map(function(d){var active=wkDuration===d;return(
          <button key={d} onClick={function(){setWkDuration(d);}} style={{flex:1,padding:"11px 0",border:"1px solid "+(active?T.accent:T.border),borderRadius:10,background:active?T.accent+"1a":T.card2,color:active?T.accent:T.sub,fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,cursor:"pointer"}}>{d}</button>
        );})}
      </div>
      {sLbl("INTENSITY")}
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"light",label:"EASY",emoji:"ok"},{id:"moderate",label:"MEDIUM",emoji:"go"},{id:"hard",label:"HARD",emoji:"fire"}].map(function(lvl){var active=wkIntensity===lvl.id;return(
          <button key={lvl.id} onClick={function(){setWkIntensity(lvl.id);}} style={{flex:1,padding:"12px 4px",border:"1px solid "+(active?T.accent:T.border),borderRadius:10,background:active?T.accent+"1a":T.card2,cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{lvl.emoji}</div>
            <div style={{fontSize:9,color:active?T.accent:T.sub,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{lvl.label}</div>
          </button>
        );})}
      </div>
      <div style={{padding:"16px",background:T.card2,border:"1px solid #f9731644",borderRadius:16,marginBottom:20,textAlign:"center"}}>
        {sLbl("CALORIES BURNED")}
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:48,fontWeight:800,color:"#f97316",lineHeight:1}}>
          {(function(){var im={light:wkType.met*0.7,moderate:wkType.met,hard:wkType.met*1.3};return calcBurn(bodyWeightLbs,sn(wkDuration),im[wkIntensity]||wkType.met);})()}
        </div>
        <div style={{fontSize:11,color:T.faint,fontFamily:"'Space Mono',monospace",marginTop:4}}>{bodyWeightLbs} lbs - {wkDuration} min - {wkType.label}</div>
      </div>
      {sLbl("NOTES optional")}
      <input type="text" value={wkNotes} onChange={function(e){setWkNotes(e.target.value);}} placeholder="e.g. New PR, felt strong..." style={inp({marginBottom:16})}/>
      {sLbl("YOUR WEIGHT lbs")}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <input type="number" value={bodyWeightLbs} onChange={function(e){setBodyWeightLbs(sn(e.target.value));}} style={inp({flex:1})}/>
        <span style={{color:T.sub,fontSize:13,fontFamily:"'Space Mono',monospace",flexShrink:0}}>lbs</span>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={function(){setShowWorkoutModal(false);}} style={gBtn({flex:1})}>Cancel</button>
        <button onClick={logWorkout} style={pBtn({flex:2})}>Log Workout</button>
      </div>
    </div>
  ))}

  {showGoals&&modal(mBox(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        {pgTtl("Daily Goals")}
        <button onClick={function(){setShowGoals(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>CANCEL</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[{key:"calories",label:"Calories kcal"},{key:"protein",label:"Protein g"},{key:"carbs",label:"Carbs g"},{key:"fat",label:"Fat g"},{key:"fiber",label:"Fiber g"},{key:"water",label:"Water glasses"}].map(function(item){return(
          <div key={item.key}>
            <div style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace",letterSpacing:"0.08em",marginBottom:6}}>{item.label.toUpperCase()}</div>
            <input type="number" min="0" value={goalsF[item.key]} onChange={function(e){var v=e.target.value;setGoalsF(function(f){var u=Object.assign({},f);u[item.key]=v;return u;});}} style={inp({borderLeft:"3px solid "+T.accent})}/>
          </div>
        );})}
      </div>
      <div style={{display:"flex",gap:10,marginTop:24}}>
        <button onClick={function(){setGoalsF(DEFAULT_GOALS);}} style={sBtn({flex:1})}>Reset</button>
        <button onClick={saveGoals} style={pBtn({flex:2})}>Save Goals</button>
      </div>
    </div>
  ))}

  {showTheme&&sheet(sBox(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:16}}>Choose Theme</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {THEMES.map(function(th){return(
          <button key={th.id} onClick={function(){setThemeId(th.id);setShowTheme(false);}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,cursor:"pointer",border:themeId===th.id?"2px solid "+T.accent:"1px solid "+T.border,background:th.card,transition:"all .15s"}}>
            <div style={{width:12,height:12,borderRadius:3,background:th.accent}}/>
            <span style={{fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",color:themeId===th.id?T.accent:th.text,whiteSpace:"nowrap"}}>{th.label}</span>
          </button>
        );})}
      </div>
    </div>
  ))}

  {confirmNewDay&&modal(
    <div style={{background:T.card,border:"1px solid "+T.border,borderTop:"2px solid "+T.accent,borderRadius:24,padding:36,maxWidth:340,width:"90%",textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:14}}>sunrise</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,marginBottom:10,color:T.text}}>Start Fresh?</div>
      <p style={{color:T.sub,fontSize:14,lineHeight:1.6,marginBottom:28}}>Your companion earns XP for everything you hit today before the reset.</p>
      <div style={{display:"flex",gap:10}}>
        <button onClick={function(){setConfirmNewDay(false);}} style={sBtn({flex:1})}>Cancel</button>
        <button onClick={newDay} style={pBtn({flex:1})}>New Day</button>
      </div>
    </div>
  )}

  {showSaved&&sheet(sBox(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800}}>Saved Meals</div>
        <button onClick={function(){setShowSaved(false);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 14px",fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>CLOSE</button>
      </div>
      {!saved.length?(
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:36,marginBottom:12}}>folder</div>
          <div style={{color:T.faint,fontSize:14}}>No saved meals yet. Build a meal and tap Save.</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {saved.map(function(m){return(
            <div key={m.id} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:T.text,fontFamily:"'Syne',sans-serif",marginBottom:3}}>{m.name}</div>
                <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:T.accent}}>{m.cal} kcal P{m.pro}g C{m.car}g</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={function(){loadTmpl(m);}} style={{padding:"7px 14px",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer"}}>LOAD</button>
                {delSaved===m.id?(
                  <button onClick={function(){setSaved(function(p){return p.filter(function(x){return x.id!==m.id;});});setDelSaved(null);}} style={{padding:"7px 12px",background:"rgba(127,29,29,0.4)",border:"1px solid rgba(127,29,29,0.6)",borderRadius:8,color:"#fca5a5",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>Sure?</button>
                ):(
                  <button onClick={function(){setDelSaved(m.id);}} style={{padding:"7px 10px",background:"transparent",border:"1px solid "+T.border,borderRadius:8,color:T.faint,fontSize:15,cursor:"pointer"}}>X</button>
                )}
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  ))}

  {showPetPick&&sheet(sBox(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,textAlign:"center",marginBottom:4}}>Choose Companion</div>
      <div style={{fontSize:11,color:T.sub,textAlign:"center",fontFamily:"'Space Mono',monospace",marginBottom:20,letterSpacing:"0.04em"}}>10 CREATURES - 5 EVOLUTION STAGES EACH</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {PETS.map(function(pet){
          var pd=petData[pet.id]||{};
          var isActive=activePetId===pet.id;
          var lvl=getLvl(pd.xp||0);
          var stage=getStage(pet,lvl.level);
          return(
            <button key={pet.id} onClick={function(){selectPet(pet.id);}} style={{background:isActive?pet.color+"18":T.card2,border:"1px solid "+(isActive?pet.color:T.border),borderRadius:16,padding:"14px 16px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .15s"}}>
              <div style={{flexShrink:0,width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,borderRadius:14,border:"1px solid "+T.border}}>
                {renderArt(stage?stage.Art:pet.stages[0].Art,44)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:16,color:isActive?pet.color:T.text,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{pd.name||pet.name}</div>
                <div style={{fontSize:12,color:T.sub,lineHeight:1.4,marginBottom:(pd.xp||0)>0?6:0}}>{pet.desc}</div>
                {(pd.xp||0)>0&&(
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{flex:1,height:3,background:T.border,borderRadius:99,overflow:"hidden"}}>
                      <div style={{width:Math.min((pd.xp||0)/60,100)+"%",height:"100%",background:pet.color,borderRadius:99}}/>
                    </div>
                    <span style={{fontSize:9,color:T.faint,fontFamily:"'Space Mono',monospace",whiteSpace:"nowrap"}}>Lv{lvl.level}{pd.maxed?" MAX":""}</span>
                  </div>
                )}
              </div>
              {isActive&&<span style={{fontSize:9,color:pet.color,fontFamily:"'Space Mono',monospace",fontWeight:700,flexShrink:0,background:pet.color+"22",borderRadius:6,padding:"3px 8px"}}>ACTIVE</span>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:16}}><button onClick={function(){setShowPetPick(false);}} style={pBtn()}>Done</button></div>
    </div>
  ))}

  {showZoo&&sheet(sBox(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,textAlign:"center",marginBottom:4}}>Companion Zoo</div>
      <div style={{fontSize:11,color:T.sub,textAlign:"center",fontFamily:"'Space Mono',monospace",marginBottom:20}}>{zoo.length}/{PETS.length} AT MAX LEVEL</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {PETS.map(function(pet){
          var unlocked=zoo.includes(pet.id);
          var pd=petData[pet.id]||{};
          var maxStage=pet.stages[pet.stages.length-1];
          if(unlocked)return(
            <div key={pet.id} style={{background:pet.color+"15",border:"1px solid "+pet.color+"44",borderRadius:16,padding:"16px 12px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",background:T.bg,borderRadius:12,padding:8,marginBottom:8}}>{renderArt(maxStage.Art,52)}</div>
              <div style={{fontWeight:800,fontSize:13,color:pet.color,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{pd.name||pet.name}</div>
              <div style={{fontSize:9,color:T.sub,fontFamily:"'Space Mono',monospace",marginBottom:2}}>{maxStage.form}</div>
              <div style={{fontSize:9,color:pet.color,fontFamily:"'Space Mono',monospace",opacity:0.7}}>ETERNAL</div>
            </div>
          );
          return(
            <div key={pet.id} style={{background:T.card2,border:"1px dashed "+T.border,borderRadius:16,padding:"16px 12px",textAlign:"center",opacity:0.35}}>
              <div style={{fontSize:32,marginBottom:8}}>?</div>
              <div style={{fontWeight:700,fontSize:12,color:T.faint,fontFamily:"'Syne',sans-serif"}}>???</div>
              <div style={{fontSize:9,color:T.faint,fontFamily:"'Space Mono',monospace",marginTop:4}}>Max a pet to unlock</div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:16}}><button onClick={function(){setShowZoo(false);}} style={pBtn()}>Close</button></div>
    </div>
  ))}

  {showWeightModal&&modal(
    <div style={{background:T.card,border:"1px solid "+T.border,borderTop:"2px solid "+T.accent,borderRadius:24,padding:28,width:"100%",maxWidth:320}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,marginBottom:20}}>Log Weight</div>
      <input type="number" value={weightInput} onChange={function(e){setWeightInput(e.target.value);}} placeholder="Weight in lbs" style={inp({marginBottom:16,fontSize:22,padding:"16px",textAlign:"center",fontFamily:"'Syne',sans-serif",fontWeight:700})} autoFocus/>
      <div style={{display:"flex",gap:10}}>
        <button onClick={function(){setShowWeightModal(false);setWeightInput("");}} style={sBtn({flex:1})}>Cancel</button>
        <button onClick={function(){if(!weightInput)return;setWeightLog(function(w){return w.concat([{weight:parseFloat(weightInput),date:new Date().toLocaleDateString()}]);});setShowWeightModal(false);setWeightInput("");}} style={pBtn({flex:2})}>Save</button>
      </div>
    </div>
  )}

  <header style={{padding:"14px 20px",borderBottom:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:60,background:T.bg}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:T.accent,letterSpacing:"-0.02em"}}>FUEL</span>
      <span style={{width:1,height:18,background:T.border,display:"inline-block"}}/>
      <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>TRACK</span>
      {userName&&<span style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace",marginLeft:4}}>- {userName}</span>}
    </div>
    <div style={{display:"flex",gap:6}}>
      <button onClick={function(){setGoalsF(Object.assign({},goals));setShowGoals(true);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>goals</button>
      <button onClick={function(){setShowTheme(true);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>theme</button>
      {(meals.length>0||workouts.length>0)&&<button onClick={function(){setConfirmNewDay(true);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 10px",fontSize:13,cursor:"pointer"}}>new day</button>}
      <button onClick={function(){setUserName("");setShowNameScreen(true);}} style={{background:T.card2,border:"1px solid "+T.border,color:T.sub,borderRadius:8,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"'Space Mono',monospace"}}>edit</button>
    </div>
  </header>

  <div style={{maxWidth:520,margin:"0 auto",padding:"16px 16px 0"}}>

    {tab==="home"&&(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={card()}>
          {(function(){
            var net=mealTots.cal-totalBurned;
            var pct=Math.min(Math.max(net,0)/goals.calories,1);
            var over=net>goals.calories;
            var R=52,C=2*Math.PI*R,F=pct*C;
            var col=over?"#fb923c":pct>=0.9?"#34d399":T.accent;
            var bpct=Math.min(totalBurned/Math.max(goals.calories*0.3,1),1);
            return(
              <div style={{display:"flex",alignItems:"center",gap:20}}>
                <div style={{position:"relative",width:120,height:120,flexShrink:0}}>
                  <svg width="120" height="120" style={{transform:"rotate(-90deg)",display:"block"}}>
                    <circle cx="60" cy="60" r={R} fill="none" stroke={T.border} strokeWidth="10"/>
                    <circle cx="60" cy="60" r={R} fill="none" stroke={col} strokeWidth="10" strokeLinecap="round" strokeDasharray={F+" "+(C-F)} style={{transition:"stroke-dasharray .6s"}}/>
                    {totalBurned>0&&<circle cx="60" cy="60" r={R-12} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeDasharray={bpct*2*Math.PI*(R-12)+" "+(2*Math.PI*(R-12))} style={{transition:"stroke-dasharray .6s"}}/>}
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:col,lineHeight:1}}>{Math.max(net,0)}</span>
                    <span style={{fontSize:9,color:T.sub,fontFamily:"'Space Mono',monospace"}}>/{goals.calories}</span>
                  </div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:T.sub,fontFamily:"'Space Mono',monospace",letterSpacing:"0.1em",marginBottom:4}}>NET CALORIES</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:col,lineHeight:1,marginBottom:6}}>{over?"+"+(net-goals.calories)+" over":(goals.calories-net)+" to go"}</div>
                  <div style={{width:"100%",height:3,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:6}}>
                    <div style={{width:Math.min(pct*100,100)+"%",height:"100%",background:col,borderRadius:99,transition:"width .6s"}}/>
                  </div>
                  <div style={{display:"flex",gap:14}}>
                    <div style={{fontSize:11,color:T.faint,fontFamily:"'Space Mono',monospace"}}><span style={{color:T.text}}>{Math.round(mealTots.cal)}</span> eaten</div>
                    {totalBurned>0&&<div style={{fontSize:11,color:T.faint,fontFamily:"'Space Mono',monospace"}}><span style={{color:"#f97316"}}>-{totalBurned}</span> burned</div>}
                  </div>
                </div>
              </div>
            );
          })()}
          <div style={{height:1,background:T.border,margin:"16px 0"}}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[{label:"PROTEIN",value:r1(mealTots.pro),unit:"g",color:"#34d399"},{label:"CARBS",value:r1(mealTots.car),unit:"g",color:"#60a5fa"},{label:"FAT",value:r1(mealTots.fat),unit:"g",color:"#fbbf24"},{label:"FIBER",value:r1(mealTots.fib),unit:"g",color:"#a78bfa"}].map(function(x){return(
              <div key={x.label} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"10px 12px",textAlign:"center",flex:1,minWidth:58}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:T.faint,letterSpacing:"0.12em",marginBottom:3}}>{x.label}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:x.color,lineHeight:1}}>{x.value}<span style={{fontSize:10,fontWeight:400}}>{x.unit}</span></div>
              </div>
            );})}
            {totalBurned>0&&(
              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"10px 12px",textAlign:"center",flex:1,minWidth:58}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:T.faint,letterSpacing:"0.12em",marginBottom:3}}>BURNED</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"#f97316",lineHeight:1}}>{totalBurned}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <button onClick={function(){setTab("build");}} style={{padding:"18px 14px",background:T.accent,border:"none",borderRadius:18,color:"#030712",cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:26,marginBottom:6}}>meal</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:19,fontWeight:800,lineHeight:1,marginBottom:4}}>Log Meal</div>
            <div style={{fontSize:10,opacity:0.7,fontFamily:"'Space Mono',monospace"}}>{meals.length} today</div>
          </button>
          <button onClick={function(){setShowWorkoutModal(true);}} style={{padding:"18px 14px",background:"linear-gradient(135deg,#f97316,#ea580c)",border:"none",borderRadius:18,color:"white",cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:26,marginBottom:6}}>lift</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:19,fontWeight:800,lineHeight:1,marginBottom:4}}>Log Workout</div>
            <div style={{fontSize:10,opacity:0.8,fontFamily:"'Space Mono',monospace"}}>{workouts.length} today - -{totalBurned} kcal</div>
          </button>
        </div>

        <div style={card()}>
          {sLbl("MACROS TODAY")}
          {[{key:"pro",label:"PROTEIN",unit:"g",color:"#34d399",max:goals.protein},{key:"car",label:"CARBS",unit:"g",color:"#60a5fa",max:goals.carbs},{key:"fat",label:"FAT",unit:"g",color:"#fbbf24",max:goals.fat},{key:"fib",label:"FIBER",unit:"g",color:"#a78bfa",max:goals.fiber}].map(function(m){
            var pct=Math.min((r1(mealTots[m.key])/m.max)*100,100);
            return(
              <div key={m.key} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:11,color:T.sub,fontFamily:"'Space Mono',monospace",letterSpacing:"0.05em"}}>{m.label}</span>
                  <span style={{fontSize:11,fontWeight:700,color:T.text,fontFamily:"'Space Mono',monospace"}}>{r1(mealTots[m.key])}{m.unit}<span style={{color:T.faint,fontWeight:400}}>/{m.max}{m.unit}</span></span>
                </div>
                <div style={{height:4,background:T.border,borderRadius:99,overflow:"hidden"}}>
                  <div style={{width:pct+"%",height:"100%",background:pct>=100?"#fb923c":m.color,borderRadius:99,transition:"width .5s"}}/>
                </div>
              </div>
            );
          })}
        </div>

        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            {sLbl("HYDRATION")}
            <span style={{fontSize:12,color:T.sub,fontFamily:"'Space Mono',monospace"}}>{waterGlasses}/{goals.water}</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {Array.from({length:goals.water},function(_,i){return(
              <button key={i} onClick={function(){setWaterGlasses(function(w){return i<w?i:i+1;});}} style={{width:38,height:38,borderRadius:10,border:"1px solid "+(i<waterGlasses?T.accent:T.border),background:i<waterGlasses?T.accent+"22":T.card2,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",color:i<waterGlasses?T.accent:T.faint}}>
                {i<waterGlasses?"drop":"o"}
              </button>
            );})}
          </div>
        </div>

        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            {sLbl("WEIGHT")}
            <button onClick={function(){setShowWeightModal(true);}} style={{padding:"5px 14px",background:T.accent,border:"none",borderRadius:8,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer"}}>+ LOG</button>
          </div>
          {weightLog.length===0?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:28,marginBottom:8}}>scale</div>
              <div style={{color:T.faint,fontSize:13}}>Tap + Log to start tracking</div>
            </div>
          ):(
            <div>
              <div style={{display:"flex",gap:3,alignItems:"flex-end",height:60,marginBottom:8}}>
                {weightLog.slice(-14).map(function(entry,i,arr){
                  var ws=arr.map(function(e){return e.weight;});
                  var mn=Math.min.apply(null,ws);var mx=Math.max.apply(null,ws);
                  var range=Math.max(mx-mn,5);
                  var h=Math.round(((entry.weight-mn)/range)*48+12);
                  var isLast=i===arr.length-1;
                  return <div key={i} style={{flex:1,background:isLast?T.accent:T.border,borderRadius:"4px 4px 2px 2px",height:h+"px",transition:"height .5s"}}/>;
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,fontFamily:"'Space Mono',monospace"}}>
                <span style={{color:T.faint}}>{weightLog.length>=2?weightLog[weightLog.length-2].weight+" lbs":""}</span>
                <span style={{color:T.accent,fontWeight:700}}>{weightLog[weightLog.length-1].weight} lbs</span>
              </div>
            </div>
          )}
        </div>

        <div style={card()}>
          {!activePetId?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>star</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:T.text,marginBottom:8}}>Choose your companion</div>
              <div style={{fontSize:14,color:T.sub,marginBottom:20,lineHeight:1.6}}>10 creatures. 5 evolution stages. All free.</div>
              <button onClick={function(){setShowPetPick(true);}} style={pBtn({width:"auto",padding:"12px 28px"})}>Meet the Companions</button>
            </div>
          ):(
            <div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div className="pf" style={{cursor:"pointer",flexShrink:0,background:T.bg,borderRadius:16,padding:10,border:"1px solid "+T.border}} onClick={function(){setShowPetPick(true);}}>
                  {renderArt(petStage?petStage.Art:activePet.stages[0].Art,54)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:activePet.color,letterSpacing:"-0.02em",marginBottom:2}}>{activePetName}</div>
                  <div style={{fontSize:12,color:activePet.color,fontFamily:"'Space Mono',monospace",opacity:0.8,marginBottom:4}}>{petStage?petStage.form:"Newborn"}</div>
                  <div style={{fontSize:13,color:T.sub,fontStyle:"italic",marginBottom:8,lineHeight:1.4}}>{petStage?petStage.desc:activePet.stages[0].desc}</div>
                  <div style={{height:4,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:4}}>
                    <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width 1s"}}/>
                  </div>
                  <div style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace"}}>
                    {petMaxed?"MAX LEVEL - visit the Zoo":petLvl.nxt?(petLvl.nxt.xpReq-activePetXP)+" XP to next form":""}
                  </div>
                </div>
              </div>
              <div style={{marginTop:14,padding:"12px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace",letterSpacing:"0.1em"}}>YOUR JOURNEY</span>
                  <span style={{fontSize:11,color:T.accent,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{totalDays} DAYS</span>
                </div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  {[{i:"meal",v:meals.length,l:"meals"},{i:"lift",v:workouts.length,l:"workouts"},{i:"drop",v:waterGlasses+"/"+goals.water,l:"water"},{i:"xp",v:activePetXP,l:"XP"}].map(function(x){return(
                    <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13}}>{x.i}</span>
                      <span style={{fontSize:12,fontFamily:"'Space Mono',monospace",color:T.text,fontWeight:700}}>{x.v}</span>
                      <span style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace"}}>{x.l}</span>
                    </div>
                  );})}
                </div>
              </div>
              {zoo.length>0&&<button onClick={function(){setShowZoo(true);}} style={{width:"100%",marginTop:10,padding:"9px 0",background:"transparent",border:"1px solid "+T.border,borderRadius:10,color:T.accent,fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer",letterSpacing:"0.06em"}}>ZOO ({zoo.length}/{PETS.length})</button>}
            </div>
          )}
        </div>

        {avgScore!=null&&(
          <div style={Object.assign({},card(),{display:"flex",alignItems:"center",gap:16})}>
            <div style={{textAlign:"center",flexShrink:0,width:64}}>
              <div style={{fontSize:36,lineHeight:1,marginBottom:4}}>{avgScore>=85?"star":avgScore>=70?"strong":avgScore>=55?"good":"grow"}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:avgScore>=85?"#fbbf24":avgScore>=70?"#34d399":avgScore>=55?"#60a5fa":"#94a3b8"}}>{avgScore>=85?"Amazing":avgScore>=70?"Great":avgScore>=55?"Good":"Keep Going"}</div>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:T.text,fontFamily:"'Syne',sans-serif",marginBottom:4}}>Today's quality score</div>
              <div style={{fontSize:12,color:T.sub}}>{meals.length} meal{meals.length!==1?"s":""} - {workouts.length} workout{workouts.length!==1?"s":""}{userName?" - great work "+userName:""}!</div>
            </div>
          </div>
        )}
      </div>
    )}

    {tab==="log"&&(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={function(){setTab("build");}} style={{padding:"13px 14px",background:T.accent,border:"none",borderRadius:14,color:"#030712",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,letterSpacing:"0.04em"}}>
            <span style={{fontSize:20}}>meal</span> LOG MEAL
          </button>
          <button onClick={function(){setShowWorkoutModal(true);}} style={{padding:"13px 14px",background:"#f97316",border:"none",borderRadius:14,color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,letterSpacing:"0.04em"}}>
            <span style={{fontSize:20}}>lift</span> LOG WORKOUT
          </button>
        </div>

        {!meals.length&&!workouts.length?(
          <div style={Object.assign({},card(),{textAlign:"center",padding:"48px 20px"})}>
            <div style={{fontSize:48,marginBottom:14}}>grow</div>
            <div style={{color:T.text,fontSize:18,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:8}}>Nothing logged yet today</div>
            <div style={{color:T.sub,fontSize:13,lineHeight:1.5}}>Use the buttons above to get started.</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {workouts.map(function(wk){return(
              <div key={wk.id} className="mcard" style={{background:T.card,border:"1px solid #f9731644",borderLeft:"3px solid #f97316",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:42,borderRadius:12,background:"rgba(249,115,22,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>{wk.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:800,fontSize:15,color:T.text,fontFamily:"'Syne',sans-serif"}}>{wk.label}</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:T.faint}}>{wk.time}</span>
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:12,fontFamily:"'Space Mono',monospace",color:"#f97316",fontWeight:700}}>-{wk.burned} kcal</span>
                    <span style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:T.sub}}>{wk.duration} min - {wk.intensity}</span>
                  </div>
                  {wk.notes&&<div style={{fontSize:12,color:T.faint,fontStyle:"italic",marginTop:4}}>{wk.notes}</div>}
                </div>
                <button className="delbtn" onClick={function(){setWorkouts(function(p){return p.filter(function(w){return w.id!==wk.id;});});}} style={{background:"transparent",border:"1px solid "+T.border,color:T.faint,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
              </div>
            );})}

            {meals.map(function(meal,idx){return(
              <div key={meal.id} className="mcard" style={{background:T.card,border:"1px solid "+T.border,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:12}}>
                <div style={{width:30,height:30,borderRadius:8,background:T.card2,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Space Mono',monospace",fontSize:11,color:T.faint,fontWeight:700}}>{idx+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:800,fontSize:15,color:T.text,fontFamily:"'Syne',sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{meal.name}</span>
                    <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:T.faint,marginLeft:8,flexShrink:0}}>{meal.time}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:T.accent}}>{meal.cal}<span style={{fontSize:11,fontWeight:400,color:T.faint}}> kcal</span></span>
                    {meal.label&&<span style={{fontSize:12,fontWeight:700,color:meal.lc,background:meal.lc+"22",borderRadius:20,padding:"2px 10px"}}>{meal.icon} {meal.label}</span>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {[{l:"P",v:meal.pro,c:"#34d399"},{l:"C",v:meal.car,c:"#60a5fa"},{l:"F",v:meal.fat,c:"#fbbf24"},{l:"Fi",v:meal.fib,c:"#a78bfa"}].filter(function(x){return x.v>0;}).map(function(chip){return(
                      <span key={chip.l} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:6,padding:"2px 8px",fontSize:10,fontFamily:"'Space Mono',monospace",color:chip.c}}>{chip.l} {r1(chip.v)}g</span>
                    );})}
                  </div>
                </div>
                <button className="delbtn" onClick={function(){setMeals(function(p){return p.filter(function(m){return m.id!==meal.id;});});}} style={{background:"transparent",border:"1px solid "+T.border,color:T.faint,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>X</button>
              </div>
            );})}

            <div style={{background:netCal>goals.calories?"rgba(251,146,60,0.08)":"rgba(52,211,153,0.06)",border:"1px solid "+(netCal>goals.calories?"rgba(251,146,60,0.3)":"rgba(52,211,153,0.25)"),borderRadius:16,padding:"14px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:10,color:netCal>goals.calories?"#fb923c":"#34d399",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{netCal>goals.calories?"SLIGHTLY OVER":"TODAY TOTAL"}</span>
                {avgScore!=null&&<span style={{fontSize:11,color:T.accent,fontFamily:"'Space Mono',monospace",fontWeight:700}}>{avgScore>=85?"AMAZING":avgScore>=70?"GREAT":avgScore>=55?"GOOD":"KEEP GOING"}</span>}
              </div>
              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:netCal>goals.calories?"#fb923c":"#34d399",lineHeight:1}}>{mealTots.cal} kcal</div>
                  {totalBurned>0&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:"#f97316",lineHeight:1}}>-{totalBurned} burned</div>}
                </div>
                <div>
                  <div style={{fontSize:11,color:T.sub,fontFamily:"'Space Mono',monospace"}}>{meals.length} meal{meals.length!==1?"s":""}</div>
                  <div style={{fontSize:13,color:"#34d399",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{r1(mealTots.pro)}g protein</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {tab==="build"&&(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={card()}>
          {sLbl("MEAL NAME")}
          <input type="text" value={mealName} onChange={function(e){setMealName(e.target.value);setMealErr("");}} placeholder="e.g. Breakfast, Post-Workout, Dinner..." style={inp({borderLeft:"3px solid "+T.accent})} autoFocus/>
        </div>

        <button onClick={function(){setVoiceModal(true);}} style={{background:T.card,border:"2px solid "+T.accent,borderRadius:18,padding:"16px 20px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .15s"}}>
          <div style={{width:48,height:48,borderRadius:14,background:T.accent+"22",border:"1px solid "+T.accent+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>mic</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:T.accent,marginBottom:2}}>Voice Entry</div>
            <div style={{fontSize:13,color:T.sub}}>Just say what you ate - we figure out the rest</div>
          </div>
        </button>

        <div style={card()}>
          {sLbl("BROWSE FOODS")}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <input type="text" value={searchQ} onChange={function(e){setSearchQ(e.target.value);if(!e.target.value)setSearchR([]);}} onKeyDown={function(e){if(e.key==="Enter")doSearch();}} placeholder="Search USDA database..." style={inp({flex:1,fontSize:14,padding:"10px 14px"})}/>
            <button onClick={doSearch} disabled={searching} style={{padding:"10px 16px",background:T.accent,border:"none",borderRadius:10,color:"#030712",fontSize:11,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer",whiteSpace:"nowrap"}}>{searching?"...":"SEARCH"}</button>
            {searchR.length>0&&<button onClick={function(){setSearchR([]);setSearchQ("");}} style={{padding:"10px 12px",background:T.card2,border:"1px solid "+T.border,borderRadius:10,color:T.sub,fontSize:14,cursor:"pointer"}}>X</button>}
          </div>
          {searchErr&&<div style={{fontSize:12,color:"#fca5a5",fontFamily:"'Space Mono',monospace",marginBottom:10,padding:"8px 12px",background:"rgba(127,29,29,0.2)",borderRadius:8}}>{searchErr}</div>}
          {!searchR.length&&(
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:12}}>
              {QUICK_CATS.map(function(c,i){return(
                <button key={i} onClick={function(){setCatIdx(i);}} style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+(catIdx===i?T.accent:T.border),background:catIdx===i?T.accent:T.card2,color:catIdx===i?"#030712":T.sub,fontSize:10,fontWeight:700,fontFamily:"'Space Mono',monospace",flexShrink:0,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>{c.emoji} {c.label}</button>
              );})}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {(searchR.length>0?searchR:QUICK_CATS[catIdx].items).map(function(food,i){return(
              <div key={i} className="fc" onClick={function(){addIng({name:food.name,emoji:food.emoji||"food",cal:food.cal,pro:food.pro,car:food.car,fat:food.fat,fib:food.fib});}} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:14,padding:"12px"}}>
                <div style={{fontSize:24,marginBottom:5,lineHeight:1}}>{food.emoji||"food"}</div>
                <div style={{fontSize:11,fontWeight:700,color:T.text,lineHeight:1.3,marginBottom:5}}>{food.name}</div>
                {food.brand&&<div style={{fontSize:9,color:T.faint,marginBottom:4,fontFamily:"'Space Mono',monospace"}}>{(food.brand||"").slice(0,16)}</div>}
                <div style={{fontSize:13,fontFamily:"'Syne',sans-serif",color:T.accent,fontWeight:800}}>{food.cal}<span style={{fontSize:10,fontWeight:400}}> kcal</span></div>
                <div style={{fontSize:9,fontFamily:"'Space Mono',monospace",color:T.faint,marginTop:2}}>P{food.pro}g C{food.car}g F{food.fat}g</div>
              </div>
            );})}
          </div>
        </div>

        <div style={{background:T.card,border:ings.length?"2px solid "+T.accent+"44":"2px dashed "+T.border,borderRadius:18,padding:"16px",minHeight:90,transition:"border-color .3s"}}>
          {!ings.length?(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:28,marginBottom:6}}>basket</div>
              <div style={{color:T.sub,fontSize:14,fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:4}}>Your meal basket</div>
              <div style={{color:T.faint,fontSize:12}}>Use voice or tap foods above</div>
            </div>
          ):(
            <div>
              {sLbl(ings.length+" item"+(ings.length!==1?"s":"")+" - "+ingTots.cal+" kcal")}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {ings.map(function(ing){return(
                  <div key={ing.id} style={{display:"flex",alignItems:"center",gap:10,background:T.card2,borderRadius:12,padding:"10px 12px",border:"1px solid "+T.border}}>
                    <span style={{fontSize:20,flexShrink:0}}>{ing.emoji||"food"}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ing.name}</div>
                      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",color:T.accent}}>{Math.round(sn(ing.cal)*sn(ing.servings))} kcal P{r1(sn(ing.pro)*sn(ing.servings))}g</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                      <button onClick={function(){updServ(ing.id,String(Math.max(0.25,sn(ing.servings)-0.25)));}} style={{width:26,height:26,borderRadius:7,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800}}>-</button>
                      <span style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:T.text,minWidth:26,textAlign:"center",fontWeight:700}}>{ing.servings}x</span>
                      <button onClick={function(){updServ(ing.id,String(sn(ing.servings)+0.25));}} style={{width:26,height:26,borderRadius:7,background:T.card,border:"1px solid "+T.border,color:T.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800}}>+</button>
                      <button onClick={function(){removeIng(ing.id);}} style={{width:26,height:26,borderRadius:7,background:"transparent",border:"1px solid "+T.border,color:T.faint,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:3}}>X</button>
                    </div>
                  </div>
                );})}
              </div>
              <div style={{marginTop:12,padding:"12px 14px",background:T.card2,border:"1px solid "+T.border,borderRadius:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,color:T.faint,fontFamily:"'Space Mono',monospace"}}>Meal total</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:T.accent}}>{ingTots.cal}<span style={{fontSize:12,fontWeight:400}}> kcal</span></span>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[["P",ingTots.pro,"#34d399"],["C",ingTots.car,"#60a5fa"],["F",ingTots.fat,"#fbbf24"],["Fi",ingTots.fib,"#a78bfa"]].map(function(x){return <span key={x[0]} style={{fontSize:12,fontFamily:"'Space Mono',monospace",color:x[2],fontWeight:700}}>{x[0]} {x[1]}g</span>;})}
                </div>
              </div>
            </div>
          )}
        </div>

        {mealErr&&<div style={{color:"#fca5a5",fontSize:12,fontFamily:"'Space Mono',monospace",textAlign:"center",padding:"10px",background:"rgba(127,29,29,0.2)",borderRadius:10}}>{mealErr}</div>}
        <div style={{display:"flex",gap:8}}>
          <button onClick={saveMealTmpl} disabled={!mealName.trim()||!ings.length} style={gBtn({flex:1,opacity:(!mealName.trim()||!ings.length)?0.35:1})}>Save</button>
          <button onClick={logMeal} disabled={!mealName.trim()||!ings.length} style={pBtn({flex:2,opacity:(!mealName.trim()||!ings.length)?0.35:1})}>
            Log It {ings.length>0?"- "+ingTots.cal+" kcal":""}
          </button>
        </div>
        <button onClick={function(){setShowSaved(true);}} style={gBtn()}>Saved Meals {saved.length>0?"("+saved.length+")":""}</button>
      </div>
    )}

    {tab==="pet"&&(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {!activePetId?(
          <div style={Object.assign({},card(),{textAlign:"center",padding:"48px 20px"})}>
            <div style={{fontSize:56,marginBottom:16}}>star</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:T.text,marginBottom:10}}>Choose a companion</div>
            <div style={{fontSize:14,color:T.sub,marginBottom:24,lineHeight:1.7}}>10 unique creatures. 5 evolution stages each. Every form earned by showing up.</div>
            <button onClick={function(){setShowPetPick(true);}} style={pBtn({width:"auto",padding:"14px 32px"})}>Meet the Companions</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={Object.assign({},card(),{textAlign:"center"})}>
              <div className="pf" style={{width:100,height:100,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",background:T.card2,borderRadius:24,border:"1px solid "+T.border}}>
                {renderArt(petStage?petStage.Art:activePet.stages[0].Art,82)}
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:30,fontWeight:800,color:activePet.color,letterSpacing:"-0.02em",marginBottom:4}}>{activePetName}</div>
              <div style={{fontSize:14,color:activePet.color,fontFamily:"'Space Mono',monospace",opacity:0.8,marginBottom:8}}>{petStage?petStage.form:"Newborn"}</div>
              <div style={{fontSize:14,color:T.sub,marginBottom:20,lineHeight:1.5,fontStyle:"italic",maxWidth:280,margin:"0 auto 20px"}}>{petStage?petStage.desc:activePet.stages[0].desc}</div>
              <div style={{background:T.card2,border:"1px solid "+T.border,borderRadius:14,padding:"14px",marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:T.text}}>Level {petLvl.level} - {petLvl.name}</span>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:T.sub}}>{activePetXP} XP</span>
                </div>
                <div style={{height:6,background:T.border,borderRadius:99,overflow:"hidden",marginBottom:6}}>
                  <div style={{width:petLvl.prog+"%",height:"100%",background:activePet.color,borderRadius:99,transition:"width 1.2s"}}/>
                </div>
                <div style={{fontSize:11,color:T.faint,fontFamily:"'Space Mono',monospace"}}>
                  {petMaxed?"MAX LEVEL - check the Zoo":petLvl.nxt?(petLvl.nxt.xpReq-activePetXP)+" XP to unlock next form":""}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={function(){setShowPetPick(true);}} style={sBtn({flex:1})}>Switch</button>
                <button onClick={function(){setShowZoo(true);}} style={sBtn({flex:1,color:T.accent})}>Zoo ({zoo.length})</button>
              </div>
            </div>

            <div style={card()}>
              {sLbl("EVOLUTION PATH")}
              {activePet.stages.map(function(stage,i){
                var unlocked=petLvl.level>=stage.level;
                var isCur=petLvl.level>=stage.level&&(i===activePet.stages.length-1||petLvl.level<activePet.stages[i+1].level);
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<activePet.stages.length-1?"1px solid "+T.border:"none",opacity:unlocked?1:0.3}}>
                    <div style={{flexShrink:0,width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",background:isCur?activePet.color+"18":T.card2,borderRadius:14,border:"1px solid "+(isCur?activePet.color:T.border)}}>
                      {renderArt(stage.Art,44)}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontSize:14,fontWeight:800,color:isCur?activePet.color:unlocked?T.text:T.faint,fontFamily:"'Syne',sans-serif"}}>{stage.form}</span>
                        {isCur&&<span style={{fontSize:9,background:activePet.color,color:"#030712",borderRadius:6,padding:"2px 8px",fontFamily:"'Space Mono',monospace",fontWeight:700}}>NOW</span>}
                        {!unlocked&&<span style={{fontSize:9,color:T.faint,fontFamily:"'Space Mono',monospace"}}>Lv{stage.level}</span>}
                      </div>
                      <div style={{fontSize:12,color:T.faint,fontStyle:"italic",lineHeight:1.4}}>{stage.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={card()}>
              {sLbl("YOUR JOURNEY")}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                {[{label:"Days Logged",value:totalDays,icon:"cal"},{label:"Total XP",value:activePetXP,icon:"xp"},{label:"Meals Today",value:meals.length,icon:"meal"},{label:"Workouts",value:workouts.length,icon:"lift"}].map(function(s){return(
                  <div key={s.label} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:14,padding:"14px",textAlign:"center"}}>
                    <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:T.accent,lineHeight:1,marginBottom:4}}>{s.value}</div>
                    <div style={{fontSize:10,color:T.faint,fontFamily:"'Space Mono',monospace",letterSpacing:"0.06em"}}>{s.label.toUpperCase()}</div>
                  </div>
                );})}
              </div>
              {sLbl("XP GUIDE")}
              {[["meal","Log any meal","+10 XP"],["lift","Log a workout","+12 XP"],["drop","Hit water goal","+10 XP"],["fire","Hit calorie goal","+15 XP"],["strong","Hit protein goal","+20 XP"],["star","Amazing meal score","+15 XP"],["day","Full day complete","Bonus XP"]].map(function(x){return(
                <div key={x[1]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid "+T.border}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14}}>{x[0]}</span>
                    <span style={{fontSize:13,color:T.sub}}>{x[1]}</span>
                  </div>
                  <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#fbbf24",fontWeight:700}}>{x[2]}</span>
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
      {id:"home",  label:"HOME",  icon:"home"},
      {id:"log",   label:"LOG",   icon:"log"},
      {id:"build", label:"MEAL",  icon:"+",big:true},
      {id:"pet",   label:"PET",   icon:null},
    ].map(function(nav){
      if(nav.big)return(
        <div key="build" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 0"}}>
          <button onClick={function(){setTab("build");}} style={{width:46,height:46,borderRadius:16,background:T.accent,border:"none",fontSize:22,fontWeight:800,color:"#030712",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",boxShadow:"0 4px 18px "+T.accent+"55",transform:tab==="build"?"scale(0.92)":"scale(1)",transition:"all .15s"}}>+</button>
          <span style={{fontSize:8,fontFamily:"'Space Mono',monospace",fontWeight:700,color:tab==="build"?T.accent:T.faint,letterSpacing:"0.08em"}}>MEAL</span>
        </div>
      );
      if(nav.id==="pet")return(
        <button key="pet" style={navB(tab==="pet")} onClick={function(){setTab("pet");}}>
          <span style={{display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24}}>
            {activePetId&&petStage?renderArt(petStage.Art,22):<span style={{fontSize:16,opacity:0.6}}>o</span>}
          </span>
          <span>PET</span>
        </button>
      );
      return(
        <button key={nav.id} style={navB(tab===nav.id)} onClick={function(){setTab(nav.id);}}>
          <span style={{fontSize:18,lineHeight:1.2,marginBottom:1}}>{nav.icon}</span>
          <span>{nav.label}</span>
          {nav.id==="log"&&(meals.length+workouts.length)>0&&<span style={{position:"absolute",top:6,right:"18%",background:T.accent,color:"#030712",borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 5px",fontFamily:"'Space Mono',monospace",lineHeight:1.4}}>{meals.length+workouts.length}</span>}
        </button>
      );
    })}
  </div>
</div>
```

);
}
