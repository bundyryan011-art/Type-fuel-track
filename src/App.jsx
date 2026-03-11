import { useState, useRef, useEffect } from "react";

const CAL_GOAL = 1550;
const MACROS = [
  { key:"protein", label:"Protein", unit:"g",  color:"#34d399", max:180  },
  { key:"carbs",   label:"Carbs",   unit:"g",  color:"#60a5fa", max:200  },
  { key:"fat",     label:"Fat",     unit:"g",  color:"#fbbf24", max:70   },
  { key:"fiber",   label:"Fiber",   unit:"g",  color:"#a78bfa", max:38   },
  { key:"sugar",   label:"Sugar",   unit:"g",  color:"#f472b6", max:50   },
  { key:"sodium",  label:"Sodium",  unit:"mg", color:"#fb923c", max:2300 },
];
const EMPTY_FORM = { name:"", calories:"", protein:"", carbs:"", fat:"", fiber:"", sugar:"", sodium:"" };
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
const AI_SYSTEM = `You are a nutrition database. You only output raw JSON. Never use markdown, never use code fences, never explain anything. Output must start with { and end with } and be valid JSON.`;
const AI_USER_TEXT = `Analyze the food in this image. Return a single JSON object with these exact keys: name (string), calories (number), protein (number), carbs (number), fat (number), fiber (number), sugar (number), sodium (number), note (string with your confidence level). All nutrient values are per serving shown. Use USDA values. No markdown, no fences, just the JSON object.`;
const MIME_MAP = { "image/jpeg":"image/jpeg","image/jpg":"image/jpeg","image/png":"image/png","image/webp":"image/webp","image/gif":"image/gif" };
function safeNum(v) { const x = parseFloat(v); return isNaN(x) ? 0 : x; }
function round1(x) { return Math.round(safeNum(x) * 10) / 10; }
function extractJSON(text) {
  if (!text || typeof text !== "string") return { parsed:null, error:"Empty response" };
  let s = text.trim().replace(/```(?:json)?/gi, "").trim();
  const start = s.indexOf("{"); const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return { parsed:null, error:"No JSON found" };
  try { return { parsed:JSON.parse(s.slice(start, end+1)), error:null }; }
  catch(e) { return { parsed:null, error:"Parse failed: " + e.message }; }
}
function hasClaudeStorage() {
  return typeof window !== "undefined" && window.storage != null && typeof window.storage.set === "function" && typeof window.storage.get === "function";
}
async function storageSave(key, value) {
  try {
    if (hasClaudeStorage()) { await window.storage.set(key, JSON.stringify(value)); }
    else { localStorage.setItem(key, JSON.stringify(value)); }
  } catch {}
}
async function storageLoad(key) {
  if (hasClaudeStorage()) {
    try { const r = await window.storage.get(key); return r && r.value ? JSON.parse(r.value) : null; }
    catch { return null; }
  }
  try { const str = localStorage.getItem(key); return str ? JSON.parse(str) : null; }
  catch { return null; }
}
function CalRing({ eaten, goal, T }) {
  const pct = Math.min(eaten / goal, 1); const over = eaten > goal;
  const radius = 58; const circ = 2 * Math.PI * radius; const fill = pct * circ;
  const color = over ? "#f87171" : pct >= 0.9 ? "#fbbf24" : "#34d399";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:24 }}>
      <div style={{ position:"relative", width:136, height:136, flexShrink:0 }}>
        <svg width="136" height="136" style={{ transform:"rotate(-90deg)", display:"block" }}>
          <circle cx="68" cy="68" r={radius} fill="none" stroke={T.border} strokeWidth="11"/>
          <circle cx="68" cy="68" r={radius} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${fill} ${circ - fill}`} style={{ transition:"stroke-dasharray .6s ease, stroke .4s" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:30, fontWeight:700, color, lineHeight:1 }}>{eaten}</span>
          <span style={{ fontSize:11, color:T.textSub, fontFamily:"'DM Mono',monospace" }}>/{goal}</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize:11, color:T.textSub, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:4 }}>CALORIES TODAY</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:700, color, lineHeight:1, marginBottom:8 }}>{over ? `+${eaten - goal} OVER` : `${goal - eaten} LEFT`}</div>
        <div style={{ width:160, height:5, background:T.border, borderRadius:99, overflow:"hidden" }}>
          <div style={{ width:`${Math.min(pct*100,100)}%`, height:"100%", background:color, borderRadius:99, transition:"width .6s ease" }}/>
        </div>
        <div style={{ fontSize:11, color:T.textFaint, fontFamily:"'DM Mono',monospace", marginTop:5 }}>{Math.round(pct*100)}% of {goal} kcal goal</div>
      </div>
    </div>
  );
}
function MacroBar({ label, value, max, unit, color, T }) {
  const over = value > max; const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ fontSize:12, color:T.textSub, fontFamily:"'DM Mono',monospace", letterSpacing:"0.04em" }}>{label}</span>
        <span style={{ fontSize:13, fontWeight:700, color: over ? "#f87171" : T.text, fontFamily:"'DM Mono',monospace" }}>{value}{unit} <span style={{ color:T.textFaint, fontWeight:400 }}>/ {max}{unit}</span></span>
      </div>
      <div style={{ height:6, background:T.border, borderRadius:99, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background: over ? "#f87171" : color, borderRadius:99, transition:"width .5s ease" }}/>
      </div>
    </div>
  );
}
function StatPill({ label, value, unit, color, T }) {
  return (
    <div style={{ background:T.card2, border:"1px solid "+T.border, borderRadius:10, padding:"10px 14px", textAlign:"center", minWidth:72 }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:T.textFaint, letterSpacing:"0.12em", marginBottom:3 }}>{label}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, color }}>{value}<span style={{ fontSize:13, fontWeight:400 }}>{unit}</span></div>
    </div>
  );
}
function Field({ label, name, value, onChange, wide, T }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, flex: wide ? "1 1 100%" : "1 1 calc(50% - 6px)" }}>
      <label style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>{label}</label>
      <input type={name === "name" ? "text" : "number"} min="0" step="any" value={value} onChange={e => onChange(name, e.target.value)} placeholder={name === "name" ? "e.g. Grilled Chicken" : "0"}
        style={{ background:T.card2, border:"1px solid "+T.border, borderRadius:8, color:T.text, fontSize:14, padding:"10px 12px", fontFamily:"'DM Sans',sans-serif", outline:"none", transition:"border-color .2s", WebkitAppearance:"none", MozAppearance:"textfield" }}
        onFocus={e => { e.target.style.borderColor = "#34d399"; }}
        onBlur={e  => { e.target.style.borderColor = T.border; }}
      />
    </div>
  );
}
export default function App() {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tab, setTab] = useState("log");
  const [confirm, setConfirm] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [themeId, setThemeId] = useState("obsidian");
  const [showTheme, setShowTheme] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoB64, setPhotoB64] = useState(null);
  const [photoMime, setPhotoMime] = useState("image/jpeg");
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState("");
  const [scanErr, setScanErr] = useState("");
  const fileRef = useRef();
  const T = THEMES.find(t => t.id === themeId) || THEMES[0];
  useEffect(() => {
    (async () => {
      try {
        const savedMeals = await storageLoad("ft-meals");
        const savedTheme = await storageLoad("ft-theme");
        if (Array.isArray(savedMeals) && savedMeals.length > 0) setMeals(savedMeals);
        if (savedTheme && THEMES.find(t => t.id === savedTheme)) setThemeId(savedTheme);
      } catch {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) storageSave("ft-meals", meals); }, [meals, loaded]);
  useEffect(() => { if (loaded) storageSave("ft-theme", themeId); }, [themeId, loaded]);
  const totals = meals.reduce((acc, m) => {
    acc.calories += safeNum(m.calories); acc.protein += safeNum(m.protein); acc.carbs += safeNum(m.carbs);
    acc.fat += safeNum(m.fat); acc.fiber += safeNum(m.fiber); acc.sugar += safeNum(m.sugar); acc.sodium += safeNum(m.sodium);
    return acc;
  }, { calories:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, sodium:0 });
  function handlePhotoFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const mime = MIME_MAP[file.type] || "image/jpeg";
    const reader = new FileReader();
    reader.onload = e => { const d = e.target.result; setPhotoSrc(d); setPhotoB64(d.split(",")[1]); setPhotoMime(mime); setScanErr(""); setScanNote(""); };
    reader.readAsDataURL(file);
  }
  function clearPhoto() { setPhotoSrc(null); setPhotoB64(null); setScanErr(""); setScanNote(""); }
  async function scanPhoto() {
    if (!photoB64) return;
    setScanning(true); setScanErr(""); setScanNote("");
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "content-type":"application/json",
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
          "x-api-key": apiKey,
        },
        body:JSON.stringify({ model:"claude-opus-4-5", max_tokens:512, system:AI_SYSTEM, messages:[{ role:"user", content:[{ type:"image", source:{ type:"base64", media_type:photoMime, data:photoB64 } }, { type:"text", text:AI_USER_TEXT }] }] }),
      });
      if (!res.ok) { const b = await res.text(); throw new Error(`HTTP ${res.status}: ${b.slice(0,200)}`); }
      const data = await res.json();
      const textBlock = data.content?.find(b => b.type==="text");
      if (!textBlock?.text) throw new Error("Empty response from API");
      const { parsed, error:parseError } = extractJSON(textBlock.text);
      if (!parsed) throw new Error(parseError || "Could not read nutrition data.");
      setForm({ name:String(parsed.name||""), calories:parsed.calories!=null?String(parsed.calories):"", protein:parsed.protein!=null?String(parsed.protein):"", carbs:parsed.carbs!=null?String(parsed.carbs):"", fat:parsed.fat!=null?String(parsed.fat):"", fiber:parsed.fiber!=null?String(parsed.fiber):"", sugar:parsed.sugar!=null?String(parsed.sugar):"", sodium:parsed.sodium!=null?String(parsed.sodium):"" });
      if (parsed.note) setScanNote(parsed.note);
      setFormErr("");
    } catch(e) { setScanErr(e.message || "Something went wrong."); }
    finally { setScanning(false); }
  }
  function handleChange(field, val) { setForm(f => ({...f, [field]:val})); setFormErr(""); }
  function handleAdd() {
    if (!form.name.trim()) { setFormErr("Give this meal a name."); return; }
    if (!form.calories) { setFormErr("Calories are required."); return; }
    setMeals(prev => [...prev, { id:Date.now(), name:form.name.trim(), calories:safeNum(form.calories), protein:safeNum(form.protein), carbs:safeNum(form.carbs), fat:safeNum(form.fat), fiber:safeNum(form.fiber), sugar:safeNum(form.sugar), sodium:safeNum(form.sodium), time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), hasPhoto:!!photoSrc }]);
    setForm(EMPTY_FORM); setFormErr(""); clearPhoto(); setTab("log");
  }
  function handleDelete(id) { setMeals(prev => prev.filter(m => m.id !== id)); }
  function handleNewDay() { setMeals([]); setForm(EMPTY_FORM); setFormErr(""); clearPhoto(); setConfirm(false); setTab("log"); }
  function handleThemeSelect(id) { setThemeId(id); setShowTheme(false); }
  const calOver = totals.calories > CAL_GOAL;
  const previewCal = totals.calories + safeNum(form.calories);
  function tabStyle(active) {
    return { flex:1, padding:"11px 0", border:"none", cursor:"pointer", fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:600, letterSpacing:"0.08em", background:active?"#34d399":"transparent", color:active?"#030712":T.textSub, borderRadius:active?8:0, transition:"all .2s" };
  }
  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans',sans-serif", transition:"background .4s, color .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        .del-btn { opacity:0 !important; transition:opacity .2s !important; }
        .meal-card:hover .del-btn { opacity:1 !important; }
        .del-btn:hover { color:#f87171 !important; border-color:#f87171 !important; }
        .log-btn:hover:not(:disabled) { background:#059669 !important; transform:translateY(-1px); }
        .log-btn:disabled { opacity:.4; cursor:not-allowed; }
        .scan-btn:hover:not(:disabled) { background:#1d4ed8 !important; }
        .scan-btn:disabled { opacity:.5; cursor:not-allowed; }
        .drop-zone:hover { border-color:#60a5fa !important; }
        .theme-btn-item:hover { opacity:.85; }
        .newday-btn:hover { border-color:#f87171 !important; color:#f87171 !important; }
        .theme-toggle:hover { opacity:.8; }
      `}</style>
      <header style={{ padding:"14px 20px", borderBottom:"1px solid "+T.border, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:60, background:T.bg, transition:"background .4s" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:700, color:"#34d399", letterSpacing:"0.06em" }}>FUEL</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:700, letterSpacing:"0.06em", color:T.text }}>TRACK</span>
          <span style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", marginLeft:4 }}>DAILY MACRO TRACKER</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button className="theme-toggle" onClick={() => setShowTheme(v => !v)} style={{ background:showTheme?"#34d399":"transparent", border:"1px solid "+(showTheme?"#34d399":T.border), color:showTheme?"#030712":T.text, borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em", cursor:"pointer", transition:"all .2s" }}>🎨 THEME</button>
          {meals.length > 0 && <button className="newday-btn" onClick={() => setConfirm(true)} style={{ background:"transparent", border:"1px solid "+T.border, color:T.textSub, borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:600, fontFamily:"'DM Mono',monospace", letterSpacing:"0.06em", cursor:"pointer", transition:"all .2s" }}>🌅 NEW DAY</button>}
        </div>
      </header>
      {showTheme && (
        <div style={{ background:T.card, borderBottom:"2px solid "+T.border, padding:"18px 20px", zIndex:55, position:"relative" }}>
          <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:6 }}>DARK</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
            {THEMES.slice(0,8).map(theme => (
              <button key={theme.id} className="theme-btn-item" onClick={() => handleThemeSelect(theme.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:8, cursor:"pointer", border:themeId===theme.id?"2px solid #34d399":"1px solid "+T.border, background:theme.card, transition:"all .2s" }}>
                <div style={{ width:16, height:16, borderRadius:3, background:theme.swatch, border:"1px solid rgba(255,255,255,0.15)", flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600, fontFamily:"'DM Mono',monospace", color:themeId===theme.id?"#34d399":theme.text, whiteSpace:"nowrap" }}>{theme.label}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:6 }}>LIGHT</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
            {THEMES.slice(8,15).map(theme => (
              <button key={theme.id} className="theme-btn-item" onClick={() => handleThemeSelect(theme.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:8, cursor:"pointer", border:themeId===theme.id?"2px solid #34d399":"1px solid "+theme.border, background:theme.card, transition:"all .2s" }}>
                <div style={{ width:16, height:16, borderRadius:3, background:theme.swatch, border:"1px solid rgba(0,0,0,0.15)", flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600, fontFamily:"'DM Mono',monospace", color:themeId===theme.id?"#15803d":theme.text, whiteSpace:"nowrap" }}>{theme.label}</span>
              </button>
            ))}
          </div>
          <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:6 }}>VIBRANT</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {THEMES.slice(15).map(theme => (
              <button key={theme.id} className="theme-btn-item" onClick={() => handleThemeSelect(theme.id)} style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 12px", borderRadius:8, cursor:"pointer", border:themeId===theme.id?"2px solid #34d399":"1px solid "+theme.border, background:theme.card, transition:"all .2s" }}>
                <div style={{ width:16, height:16, borderRadius:3, background:theme.swatch, border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600, fontFamily:"'DM Mono',monospace", color:themeId===theme.id?"#34d399":theme.text, whiteSpace:"nowrap" }}>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(3,7,18,.88)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:16, padding:32, maxWidth:340, width:"90%", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🌅</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:700, marginBottom:8, color:T.text }}>New Day?</div>
            <p style={{ color:T.textSub, fontSize:13, lineHeight:1.6, marginBottom:24 }}>Clears {meals.length} meal{meals.length!==1?"s":""} and resets all totals.<br/><span style={{color:"#34d399"}}>{Math.round(totals.calories)} kcal</span>{" · "}<span style={{color:"#60a5fa"}}>{round1(totals.protein)}g protein</span>{" will be wiped."}</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setConfirm(false)} style={{ flex:1, padding:"12px 0", background:T.card2, border:"1px solid "+T.border, color:T.textSub, borderRadius:8, fontSize:13, fontWeight:600, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>CANCEL</button>
              <button onClick={handleNewDay} style={{ flex:1, padding:"12px 0", background:"#7f1d1d", border:"1px solid #991b1b", color:"#fca5a5", borderRadius:8, fontSize:13, fontWeight:700, fontFamily:"'DM Mono',monospace", cursor:"pointer" }}>RESET</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ maxWidth:520, margin:"0 auto", padding:"20px 16px 60px" }}>
        <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:16, padding:"20px 22px", marginBottom:16 }}>
          <CalRing eaten={Math.round(totals.calories)} goal={CAL_GOAL} T={T} />
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:18 }}>
            <StatPill label="PROTEIN" value={round1(totals.protein)} unit="g"  color="#34d399" T={T} />
            <StatPill label="CARBS"   value={round1(totals.carbs)}   unit="g"  color="#60a5fa" T={T} />
            <StatPill label="FAT"     value={round1(totals.fat)}     unit="g"  color="#fbbf24" T={T} />
            <StatPill label="FIBER"   value={round1(totals.fiber)}   unit="g"  color="#a78bfa" T={T} />
            <StatPill label="SUGAR"   value={round1(totals.sugar)}   unit="g"  color="#f472b6" T={T} />
            <StatPill label="SODIUM"  value={Math.round(totals.sodium)} unit="mg" color="#fb923c" T={T} />
          </div>
        </div>
        <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:16, padding:"18px 20px", marginBottom:16 }}>
          <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:14 }}>MACRO BREAKDOWN</div>
          {MACROS.map(m => <MacroBar key={m.key} label={m.label} value={round1(totals[m.key])} max={m.max} unit={m.unit} color={m.color} T={T} />)}
        </div>
        <div style={{ display:"flex", background:T.card, border:"1px solid "+T.border, borderRadius:12, padding:4, marginBottom:16, gap:4 }}>
          <button style={tabStyle(tab==="log")} onClick={() => setTab("log")}>📋 MEAL LOG {meals.length > 0 && `(${meals.length})`}</button>
          <button style={tabStyle(tab==="add")} onClick={() => setTab("add")}>➕ ADD MEAL</button>
        </div>
        {tab === "add" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:16, padding:"18px 20px" }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:14 }}>📸 SCAN WITH PHOTO <span style={{ fontWeight:400 }}>— optional</span></div>
              {!photoSrc ? (
                <div className="drop-zone" onClick={() => { if (fileRef.current) fileRef.current.click(); }} style={{ border:"2px dashed "+T.border, borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"border-color .2s" }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>📷</div>
                  <div style={{ color:"#60a5fa", fontWeight:600, fontSize:14, marginBottom:4 }}>Take a photo or choose from your library</div>
                  <div style={{ color:T.textFaint, fontSize:12, fontFamily:"'DM Mono',monospace" }}>JPG · PNG · WEBP</div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) handlePhotoFile(e.target.files[0]); e.target.value=""; }}/>
                </div>
              ) : (
                <div>
                  <div style={{ position:"relative", borderRadius:12, overflow:"hidden", marginBottom:12 }}>
                    <img src={photoSrc} alt="food" style={{ width:"100%", maxHeight:220, objectFit:"cover", display:"block" }}/>
                    <button onClick={clearPhoto} style={{ position:"absolute", top:8, right:8, background:"rgba(3,7,18,.85)", border:"1px solid #334155", color:"#94a3b8", borderRadius:6, padding:"4px 10px", fontSize:12, cursor:"pointer" }}>✕ Clear</button>
                  </div>
                  <button className="scan-btn" onClick={scanPhoto} disabled={scanning} style={{ width:"100%", padding:"13px 0", background:"#1d4ed8", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", cursor:"pointer", transition:"all .2s" }}>
                    {scanning ? "🔍  ANALYZING…" : "🔍  SCAN & FILL NUTRITION"}
                  </button>
                  {scanNote && <div style={{ marginTop:10, padding:"9px 13px", background:T.card2, border:"1px solid "+T.border, borderRadius:8, fontSize:12, color:"#60a5fa", fontFamily:"'DM Mono',monospace" }}>ℹ {scanNote}</div>}
                  {scanErr  && <div style={{ marginTop:10, padding:"9px 13px", background:"#1a0505", border:"1px solid #7f1d1d", borderRadius:8, fontSize:12, color:"#fca5a5", fontFamily:"'DM Mono',monospace" }}>⚠ {scanErr}</div>}
                </div>
              )}
            </div>
            <div style={{ background:T.card, border:"1px solid "+T.border, borderRadius:16, padding:"18px 20px" }}>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:14 }}>MEAL DETAILS <span style={{ fontWeight:400 }}>— review & edit before logging</span></div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                <Field label="FOOD NAME *"       name="name"     value={form.name}     onChange={handleChange} wide T={T} />
                <Field label="CALORIES (kcal) *" name="calories" value={form.calories} onChange={handleChange} wide T={T} />
              </div>
              <div style={{ fontSize:10, color:T.textFaint, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", marginBottom:10 }}>MACROS &amp; MICROS</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                <Field label="PROTEIN (g)"  name="protein" value={form.protein} onChange={handleChange} T={T} />
                <Field label="CARBS (g)"    name="carbs"   value={form.carbs}   onChange={handleChange} T={T} />
                <Field label="FAT (g)"      name="fat"     value={form.fat}     onChange={handleChange} T={T} />
                <Field label="FIBER (g)"    name="fiber"   value={form.fiber}   onChange={handleChange} T={T} />
                <Field label="SUGAR (g)"    name="sugar"   value={form.sugar}   onChange={handleChange} T={T} />
                <Field label="SODIUM (mg)"  name="sodium"  value={form.sodium}  onChange={handleChange} T={T} />
              </div>
              {form.calories && (
                <div style={{ marginTop:14, padding:"10px 14px", borderRadius:8, background:previewCal>CAL_GOAL?"#1a0505":"#061a0f", border:`1px solid ${previewCal>CAL_GOAL?"#7f1d1d":"#14532d"}`, fontSize:12, fontFamily:"'DM Mono',monospace", color:previewCal>CAL_GOAL?"#fca5a5":"#86efac" }}>
                  {previewCal>CAL_GOAL?`⚠ This puts you ${Math.round(previewCal-CAL_GOAL)} kcal over your ${CAL_GOAL} goal`:`✓ After adding: ${Math.round(previewCal)} / ${CAL_GOAL} kcal — ${Math.round(CAL_GOAL-previewCal)} remaining`}
                </div>
              )}
              {formErr && <div style={{ marginTop:10, color:"#fca5a5", fontSize:12, fontFamily:"'DM Mono',monospace" }}>⚠ {formErr}</div>}
              <button className="log-btn" onClick={handleAdd} disabled={!form.name.trim()||!form.calories} style={{ width:"100%", marginTop:16, padding:"14px 0", background:"#34d399", border:"none", borderRadius:10, color:"#030712", fontSize:14, fontWeight:700, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", cursor:"pointer", transition:"all .2s" }}>+ LOG MEAL</button>
            </div>
          </div>
        )}
        {tab === "log" && (
          <div>
            {meals.length === 0 ? (
              <div style={{ background:T.card, border:"1px dashed "+T.border, borderRadius:16, padding:"40px 20px", textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🍽️</div>
                <div style={{ color:T.textSub, fontSize:14, marginBottom:6 }}>No meals logged yet</div>
                <div style={{ color:T.textFaint, fontSize:12, fontFamily:"'DM Mono',monospace" }}>Tap ➕ ADD MEAL to get started</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {meals.map((meal, idx) => (
                  <div key={meal.id} className="meal-card" style={{ background:T.card, border:"1px solid "+T.border, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"flex-start", gap:12 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:T.card2, border:"1px solid "+T.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'DM Mono',monospace", fontSize:11, color:T.textFaint }}>{idx+1}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
                        <span style={{ fontWeight:600, fontSize:14, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{meal.hasPhoto && <span style={{ marginRight:5 }}>📸</span>}{meal.name}</span>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:T.textSub, marginLeft:8, flexShrink:0 }}>{meal.time}</span>
                      </div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, color:"#34d399", lineHeight:1, marginBottom:6 }}>{meal.calories} <span style={{ fontSize:13, fontWeight:400, color:T.textSub }}>kcal</span></div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                        {[{label:"P",val:meal.protein,unit:"g",col:"#34d399"},{label:"C",val:meal.carbs,unit:"g",col:"#60a5fa"},{label:"F",val:meal.fat,unit:"g",col:"#fbbf24"},{label:"Fi",val:meal.fiber,unit:"g",col:"#a78bfa"},{label:"Su",val:meal.sugar,unit:"g",col:"#f472b6"},{label:"Na",val:meal.sodium,unit:"mg",col:"#fb923c"}].filter(c => c.val > 0).map(chip => (
                          <span key={chip.label} style={{ background:T.card2, border:"1px solid "+T.border, borderRadius:5, padding:"2px 7px", fontSize:11, fontFamily:"'DM Mono',monospace", color:chip.col }}>{chip.label} {round1(chip.val)}{chip.unit}</span>
                        ))}
                      </div>
                    </div>
                    <button className="del-btn" onClick={() => handleDelete(meal.id)} style={{ background:"transparent", border:"1px solid "+T.border, color:T.textFaint, borderRadius:6, width:28, height:28, cursor:"pointer", fontSize:16, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                  </div>
                ))}
                <div style={{ background:calOver?"#1a0505":"#061a0f", border:`1px solid ${calOver?"#7f1d1d":"#14532d"}`, borderRadius:12, padding:"12px 16px", marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:10, color:calOver?"#f87171":"#4ade80", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", marginBottom:2 }}>{calOver?"⚠ OVER DAILY GOAL":"✓ DAILY TOTAL"}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:700, color:calOver?"#f87171":"#4ade80", lineHeight:1 }}>{Math.round(totals.calories)} / {CAL_GOAL} kcal</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11, color:"#64748b", fontFamily:"'DM Mono',monospace" }}>{meals.length} meal{meals.length!==1?"s":""}</div>
                    <div style={{ fontSize:13, color:"#34d399", fontFamily:"'DM Mono',monospace", fontWeight:600 }}>{round1(totals.protein)}g protein</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


