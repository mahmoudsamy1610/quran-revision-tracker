import { useState, useEffect, useMemo } from "react";

// ---------- Surah data: [number, arabic, english, ayah count] (Hafs) ----------
const SURAHS = [
  [1,"الفاتحة","Al-Fatiha",7],[2,"البقرة","Al-Baqarah",286],[3,"آل عمران","Aal-Imran",200],
  [4,"النساء","An-Nisa",176],[5,"المائدة","Al-Ma'idah",120],[6,"الأنعام","Al-An'am",165],
  [7,"الأعراف","Al-A'raf",206],[8,"الأنفال","Al-Anfal",75],[9,"التوبة","At-Tawbah",129],
  [10,"يونس","Yunus",109],[11,"هود","Hud",123],[12,"يوسف","Yusuf",111],
  [13,"الرعد","Ar-Ra'd",43],[14,"إبراهيم","Ibrahim",52],[15,"الحجر","Al-Hijr",99],
  [16,"النحل","An-Nahl",128],[17,"الإسراء","Al-Isra",111],[18,"الكهف","Al-Kahf",110],
  [19,"مريم","Maryam",98],[20,"طه","Ta-Ha",135],[21,"الأنبياء","Al-Anbiya",112],
  [22,"الحج","Al-Hajj",78],[23,"المؤمنون","Al-Mu'minun",118],[24,"النور","An-Nur",64],
  [25,"الفرقان","Al-Furqan",77],[26,"الشعراء","Ash-Shu'ara",227],[27,"النمل","An-Naml",93],
  [28,"القصص","Al-Qasas",88],[29,"العنكبوت","Al-Ankabut",69],[30,"الروم","Ar-Rum",60],
  [31,"لقمان","Luqman",34],[32,"السجدة","As-Sajdah",30],[33,"الأحزاب","Al-Ahzab",73],
  [34,"سبأ","Saba",54],[35,"فاطر","Fatir",45],[36,"يس","Ya-Sin",83],
  [37,"الصافات","As-Saffat",182],[38,"ص","Sad",88],[39,"الزمر","Az-Zumar",75],
  [40,"غافر","Ghafir",85],[41,"فصلت","Fussilat",54],[42,"الشورى","Ash-Shura",53],
  [43,"الزخرف","Az-Zukhruf",89],[44,"الدخان","Ad-Dukhan",59],[45,"الجاثية","Al-Jathiyah",37],
  [46,"الأحقاف","Al-Ahqaf",35],[47,"محمد","Muhammad",38],[48,"الفتح","Al-Fath",29],
  [49,"الحجرات","Al-Hujurat",18],[50,"ق","Qaf",45],[51,"الذاريات","Adh-Dhariyat",60],
  [52,"الطور","At-Tur",49],[53,"النجم","An-Najm",62],[54,"القمر","Al-Qamar",55],
  [55,"الرحمن","Ar-Rahman",78],[56,"الواقعة","Al-Waqi'ah",96],[57,"الحديد","Al-Hadid",29],
  [58,"المجادلة","Al-Mujadila",22],[59,"الحشر","Al-Hashr",24],[60,"الممتحنة","Al-Mumtahanah",13],
  [61,"الصف","As-Saff",14],[62,"الجمعة","Al-Jumu'ah",11],[63,"المنافقون","Al-Munafiqun",11],
  [64,"التغابن","At-Taghabun",18],[65,"الطلاق","At-Talaq",12],[66,"التحريم","At-Tahrim",12],
  [67,"الملك","Al-Mulk",30],[68,"القلم","Al-Qalam",52],[69,"الحاقة","Al-Haqqah",52],
  [70,"المعارج","Al-Ma'arij",44],[71,"نوح","Nuh",28],[72,"الجن","Al-Jinn",28],
  [73,"المزمل","Al-Muzzammil",20],[74,"المدثر","Al-Muddaththir",56],[75,"القيامة","Al-Qiyamah",40],
  [76,"الإنسان","Al-Insan",31],[77,"المرسلات","Al-Mursalat",50],[78,"النبأ","An-Naba",40],
  [79,"النازعات","An-Nazi'at",46],[80,"عبس","Abasa",42],[81,"التكوير","At-Takwir",29],
  [82,"الانفطار","Al-Infitar",19],[83,"المطففين","Al-Mutaffifin",36],[84,"الانشقاق","Al-Inshiqaq",25],
  [85,"البروج","Al-Buruj",22],[86,"الطارق","At-Tariq",17],[87,"الأعلى","Al-A'la",19],
  [88,"الغاشية","Al-Ghashiyah",26],[89,"الفجر","Al-Fajr",30],[90,"البلد","Al-Balad",20],
  [91,"الشمس","Ash-Shams",15],[92,"الليل","Al-Layl",21],[93,"الضحى","Ad-Duha",11],
  [94,"الشرح","Ash-Sharh",8],[95,"التين","At-Tin",8],[96,"العلق","Al-Alaq",19],
  [97,"القدر","Al-Qadr",5],[98,"البينة","Al-Bayyinah",8],[99,"الزلزلة","Az-Zalzalah",8],
  [100,"العاديات","Al-Adiyat",11],[101,"القارعة","Al-Qari'ah",11],[102,"التكاثر","At-Takathur",8],
  [103,"العصر","Al-Asr",3],[104,"الهمزة","Al-Humazah",9],[105,"الفيل","Al-Fil",5],
  [106,"قريش","Quraysh",4],[107,"الماعون","Al-Ma'un",7],[108,"الكوثر","Al-Kawthar",3],
  [109,"الكافرون","Al-Kafirun",6],[110,"النصر","An-Nasr",3],[111,"المسد","Al-Masad",5],
  [112,"الإخلاص","Al-Ikhlas",4],[113,"الفلق","Al-Falaq",5],[114,"الناس","An-Nas",6],
];
const ALL_SURAH_NUMS = SURAHS.map((s) => s[0]);
const TOTAL_AYAHS = SURAHS.reduce((s, x) => s + x[3], 0); // 6236
const SURAH_MAP = Object.fromEntries(SURAHS.map((s) => [s[0], s]));

// ---------- Palette (mushaf-inspired) ----------
const C = {
  ink: "#173B2C",        // deep mushaf green
  inkSoft: "#2E5C46",
  gold: "#B98A2F",
  goldSoft: "#E8D9B0",
  paper: "#FBF8F1",      // mushaf paper
  card: "#FFFFFF",
  line: "#E6DfCE",
  faint: "#8A8273",
  danger: "#A4392C",
  done: "#1E7A4F",
};

const STORAGE_KEY = "quran-revision-cycles-v1";
const DAY_MS = 86400000;

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Local-date key like "2026-06-10" (NOT UTC, so the day flips at local midnight)
const dayKey = (ts = Date.now()) => {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

// Surahs included in a cycle (backwards-compatible: old cycles = full Quran)
const cycleSurahs = (cycle) =>
  cycle.surahs && cycle.surahs.length ? cycle.surahs : ALL_SURAH_NUMS;

const cycleTotalAyahs = (cycle) =>
  cycleSurahs(cycle).reduce((s, n) => s + SURAH_MAP[n][3], 0);

function cycleStats(cycle) {
  const nums = cycleSurahs(cycle);
  const total = cycleTotalAyahs(cycle);
  let done = 0, completed = 0, inProgress = 0;
  for (const n of nums) {
    const count = SURAH_MAP[n][3];
    const p = Math.min(cycle.progress?.[n] || 0, count);
    done += p;
    if (p === count) completed++;
    else if (p > 0) inProgress++;
  }

  // ---- Daily pace (avg ayahs per day) ----
  // Days are counted from the cycle start (or last reset), inclusive of today.
  const start = cycle.resetAt || cycle.createdAt;
  const days = Math.max(1, Math.floor((Date.now() - start) / DAY_MS) + 1);
  const avgPerDay = Math.round((done / days) * 10) / 10;
  const today = cycle.log?.[dayKey()] || 0;
  const activeDays = Object.values(cycle.log || {}).filter((v) => v > 0).length;

  return {
    done,
    total,
    surahCount: nums.length,
    pct: total ? Math.round((done / total) * 1000) / 10 : 0,
    completed,
    inProgress,
    notStarted: nums.length - completed - inProgress,
    days,
    avgPerDay,
    today,
    activeDays,
  };
}

// ---------- Storage adapter (localStorage, works in browser & Capacitor WebView) ----------
const storage = {
  get: async (key) => {
    const value = localStorage.getItem(key);
    return { value };
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
  },
};

export default function QuranRevisionTracker() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [openCycleId, setOpenCycleId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmResetId, setConfirmResetId] = useState(null);
  const [search, setSearch] = useState("");
  const [editSurah, setEditSurah] = useState(null);
  const [editValue, setEditValue] = useState(0);

  // ---- New cycle wizard state ----
  const [creating, setCreating] = useState(false);     // step 1: name + scope
  const [newName, setNewName] = useState("");
  const [scope, setScope] = useState("full");          // "full" | "custom"
  const [picking, setPicking] = useState(false);       // step 2: surah picker
  const [picked, setPicked] = useState(new Set());
  const [pickSearch, setPickSearch] = useState("");

  // Amiri font for Arabic
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res?.value) setCycles(JSON.parse(res.value));
      } catch {
        // no data yet — first run
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next) => {
    setCycles(next);
    try {
      await storage.set(STORAGE_KEY, JSON.stringify(next));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  };

  const resetWizard = () => {
    setCreating(false);
    setPicking(false);
    setNewName("");
    setScope("full");
    setPicked(new Set());
    setPickSearch("");
  };

  // ---------- Cycle CRUD ----------
  const createCycle = (surahNums) => {
    const name = newName.trim() || `Cycle ${cycles.length + 1}`;
    const c = {
      id: Date.now().toString(36),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      progress: {},
      log: {},           // daily ayah log: { "YYYY-MM-DD": ayahsDoneThatDay }
      surahs: surahNums, // null = full Quran
    };
    persist([c, ...cycles]);
    resetWizard();
  };

  const handleCreateContinue = () => {
    if (scope === "full") {
      createCycle(null);
    } else {
      setPicking(true);
    }
  };

  const togglePick = (n) => {
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  const renameCycle = (id) => {
    if (!renameText.trim()) return setRenamingId(null);
    persist(cycles.map((c) => (c.id === id ? { ...c, name: renameText.trim(), updatedAt: Date.now() } : c)));
    setRenamingId(null);
  };
  const deleteCycle = (id) => {
    persist(cycles.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
    if (openCycleId === id) setOpenCycleId(null);
  };
  const resetCycleProgress = (id) => {
    persist(
      cycles.map((c) =>
        c.id === id
          ? { ...c, progress: {}, log: {}, resetAt: Date.now(), updatedAt: Date.now() }
          : c
      )
    );
    setConfirmResetId(null);
  };
  const duplicateCycle = (id) => {
    const src = cycles.find((c) => c.id === id);
    if (!src) return;
    const copy = {
      id: Date.now().toString(36),
      name: `${src.name} (copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      progress: {}, // fresh start — same surah selection, zero progress
      log: {},
      surahs: src.surahs ? [...src.surahs] : null,
    };
    persist([copy, ...cycles]);
  };

  // Updates progress AND logs the day's ayah delta for pace tracking
  const setProgress = (cycleId, surahNum, ayah) => {
    persist(
      cycles.map((c) => {
        if (c.id !== cycleId) return c;
        const max = SURAH_MAP[surahNum][3];
        const prev = Math.min(c.progress?.[surahNum] || 0, max);
        const delta = ayah - prev;
        const k = dayKey();
        const log = { ...(c.log || {}) };
        if (delta !== 0) {
          // Corrections (negative delta) reduce today's count but never below 0
          log[k] = Math.max(0, (log[k] || 0) + delta);
        }
        return {
          ...c,
          updatedAt: Date.now(),
          progress: { ...c.progress, [surahNum]: ayah },
          log,
        };
      })
    );
  };

  const openCycle = cycles.find((c) => c.id === openCycleId);

  const filteredSurahs = useMemo(() => {
    if (!openCycle) return [];
    const nums = new Set(cycleSurahs(openCycle));
    const list = SURAHS.filter(([n]) => nums.has(n));
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(([n, ar, en]) => en.toLowerCase().includes(q) || ar.includes(q) || String(n) === q);
  }, [search, openCycle]);

  const pickerList = useMemo(() => {
    const q = pickSearch.trim().toLowerCase();
    if (!q) return SURAHS;
    return SURAHS.filter(([n, ar, en]) => en.toLowerCase().includes(q) || ar.includes(q) || String(n) === q);
  }, [pickSearch]);

  const pickedAyahs = useMemo(
    () => [...picked].reduce((s, n) => s + SURAH_MAP[n][3], 0),
    [picked]
  );

  // ---------- Shared bits ----------
  const ProgressBar = ({ value, max, height = 6, color = C.gold }) => (
    <div style={{ background: C.line, borderRadius: 99, height, overflow: "hidden" }}>
      <div
        style={{
          width: `${max ? Math.min(100, (value / max) * 100) : 0}%`,
          background: value >= max && max > 0 ? C.done : color,
          height: "100%",
          borderRadius: 99,
          transition: "width .25s ease",
        }}
      />
    </div>
  );

  const page = {
    minHeight: "100vh",
    background: C.paper,
    color: C.ink,
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  };
  const wrap = { maxWidth: 560, margin: "0 auto", padding: "20px 16px 48px" };
  const arabic = { fontFamily: "'Amiri', 'Traditional Arabic', serif" };
  const card = {
    background: C.card,
    border: `1px solid ${C.line}`,
    borderRadius: 14,
    padding: 16,
  };
  const btn = (bg = C.ink, fg = "#fff") => ({
    background: bg,
    color: fg,
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  });
  const ghostBtn = {
    background: "transparent",
    color: C.inkSoft,
    border: `1px solid ${C.line}`,
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    cursor: "pointer",
  };
  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${C.line}`,
    background: "#fff",
    fontSize: 15,
    color: C.ink,
    outline: "none",
  };

  if (loading) {
    return (
      <div style={{ ...page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.faint, fontSize: 14 }}>Loading your cycles…</div>
      </div>
    );
  }

  // =====================================================================
  // SURAH PICKER VIEW (step 2 of new cycle)
  // =====================================================================
  if (picking) {
    return (
      <div style={page}>
        <div style={{ ...wrap, paddingBottom: 110 }}>
          <button onClick={() => setPicking(false)} style={{ ...ghostBtn, marginBottom: 14 }}>
            ← Back
          </button>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>
              Pick surahs for "{newName.trim() || `Cycle ${cycles.length + 1}`}"
            </div>
            <div style={{ fontSize: 13, color: C.faint, marginTop: 2 }}>
              Tap to select. Only chosen surahs will appear in this cycle.
            </div>
          </div>

          <input
            placeholder="Search surah (name or number)…"
            value={pickSearch}
            onChange={(e) => setPickSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: 10 }}
          />

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <button onClick={() => setPicked(new Set(ALL_SURAH_NUMS))} style={ghostBtn}>Select all</button>
            <button onClick={() => setPicked(new Set(SURAHS.filter(([n]) => n >= 78).map(([n]) => n)))} style={ghostBtn}>
              Juz' Amma (78–114)
            </button>
            <button onClick={() => setPicked(new Set())} style={ghostBtn}>Clear</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pickerList.map(([n, ar, en, count]) => {
              const sel = picked.has(n);
              return (
                <div
                  key={n}
                  onClick={() => togglePick(n)}
                  style={{
                    ...card,
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    border: `1px solid ${sel ? C.ink : C.line}`,
                    background: sel ? "#F1F6F2" : C.card,
                  }}
                >
                  <div
                    style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700,
                      background: sel ? C.ink : "transparent",
                      color: "#fff",
                      border: `2px solid ${sel ? C.ink : C.line}`,
                    }}
                  >
                    {sel ? "✓" : ""}
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "baseline", minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>
                      {n}. {en} <span style={{ color: C.faint, fontWeight: 400, fontSize: 12 }}>· {count} ayahs</span>
                    </span>
                    <span style={{ ...arabic, fontSize: 18, color: C.inkSoft }}>{ar}</span>
                  </div>
                </div>
              );
            })}
            {pickerList.length === 0 && (
              <div style={{ textAlign: "center", color: C.faint, fontSize: 14, padding: 24 }}>
                No surah matches "{pickSearch}".
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div
            style={{
              position: "fixed", left: 0, right: 0, bottom: 0,
              background: C.card, borderTop: `1px solid ${C.line}`,
              padding: "12px 16px",
            }}
          >
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ fontSize: 12, color: C.faint, marginBottom: 8, textAlign: "center" }}>
                {picked.size} surah{picked.size === 1 ? "" : "s"} selected · {pickedAyahs.toLocaleString()} ayahs
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={resetWizard} style={ghostBtn}>Cancel</button>
                <button
                  onClick={() => picked.size > 0 && createCycle([...picked].sort((a, b) => a - b))}
                  disabled={picked.size === 0}
                  style={{
                    ...btn(picked.size === 0 ? C.line : C.ink, picked.size === 0 ? C.faint : "#fff"),
                    flex: 1,
                    cursor: picked.size === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Create cycle with {picked.size || "no"} surah{picked.size === 1 ? "" : "s"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // CYCLE DETAIL VIEW
  // =====================================================================
  if (openCycle) {
    const st = cycleStats(openCycle);
    const isFull = st.surahCount === 114;
    return (
      <div style={page}>
        <div style={wrap}>
          <button onClick={() => { setOpenCycleId(null); setEditSurah(null); setSearch(""); }} style={{ ...ghostBtn, marginBottom: 14 }}>
            ← All cycles
          </button>

          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{openCycle.name}</div>
              <span
                style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 99,
                  background: isFull ? "#EAF3ED" : C.goldSoft,
                  color: isFull ? C.done : "#7A5A14",
                }}
              >
                {isFull ? "Full Quran" : `${st.surahCount} surahs`}
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>
              Started {fmtDate(openCycle.resetAt || openCycle.createdAt)} · Updated {fmtDate(openCycle.updatedAt)}
            </div>
          </div>

          {/* Stats */}
          <div style={{ ...card, marginBottom: 16, borderTop: `3px solid ${C.gold}` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{st.pct}%</div>
              <div style={{ fontSize: 13, color: C.faint }}>
                {st.done.toLocaleString()} / {st.total.toLocaleString()} ayahs
              </div>
            </div>
            <div style={{ margin: "10px 0 14px" }}>
              <ProgressBar value={st.done} max={st.total} height={8} />
            </div>
            <div style={{ display: "flex", gap: 8, textAlign: "center", marginBottom: 8 }}>
              {[
                ["Completed", st.completed, C.done],
                ["In progress", st.inProgress, C.gold],
                ["Not started", st.notStarted, C.faint],
              ].map(([label, val, color]) => (
                <div key={label} style={{ flex: 1, background: C.paper, borderRadius: 10, padding: "8px 4px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: C.faint }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Daily pace */}
            <div style={{ display: "flex", gap: 8, textAlign: "center" }}>
              <div style={{ flex: 1, background: "#F1F6F2", borderRadius: 10, padding: "8px 4px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.inkSoft }}>
                  {st.avgPerDay.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: C.faint }}>avg ayahs / day</div>
              </div>
              <div style={{ flex: 1, background: "#F1F6F2", borderRadius: 10, padding: "8px 4px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.inkSoft }}>
                  {st.today.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: C.faint }}>ayahs today</div>
              </div>
              <div style={{ flex: 1, background: "#F1F6F2", borderRadius: 10, padding: "8px 4px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.inkSoft }}>
                  {st.days}
                </div>
                <div style={{ fontSize: 11, color: C.faint }}>day{st.days === 1 ? "" : "s"} elapsed</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <input
            placeholder="Search surah (name or number)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          {/* Surah list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredSurahs.map(([n, ar, en, count]) => {
              const p = Math.min(openCycle.progress?.[n] || 0, count);
              const isOpen = editSurah === n;
              const isDone = p === count;
              return (
                <div key={n} style={{ ...card, padding: 12 }}>
                  <div
                    onClick={() => {
                      setEditSurah(isOpen ? null : n);
                      setEditValue(p);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                  >
                    <div
                      style={{
                        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700,
                        background: isDone ? C.done : C.paper,
                        color: isDone ? "#fff" : C.inkSoft,
                        border: `1px solid ${isDone ? C.done : C.line}`,
                      }}
                    >
                      {isDone ? "✓" : n}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{en}</span>
                        <span style={{ ...arabic, fontSize: 19, color: C.inkSoft }}>{ar}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                        <div style={{ flex: 1 }}>
                          <ProgressBar value={p} max={count} height={5} />
                        </div>
                        <span style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap" }}>
                          {p} / {count}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.line}` }}>
                      <div style={{ fontSize: 12, color: C.faint, marginBottom: 6 }}>
                        Revised up to ayah:
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="range"
                          min={0}
                          max={count}
                          value={editValue}
                          onChange={(e) => setEditValue(Number(e.target.value))}
                          style={{ flex: 1, accentColor: C.ink }}
                        />
                        <input
                          type="number"
                          min={0}
                          max={count}
                          value={editValue}
                          onChange={(e) =>
                            setEditValue(Math.max(0, Math.min(count, Number(e.target.value) || 0)))
                          }
                          style={{ ...inputStyle, width: 72, padding: "8px 8px", textAlign: "center" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                          onClick={() => { setProgress(openCycle.id, n, editValue); setEditSurah(null); }}
                          style={{ ...btn(), flex: 1 }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setProgress(openCycle.id, n, count); setEditSurah(null); }}
                          style={{ ...btn(C.done), flex: 1 }}
                        >
                          Mark complete
                        </button>
                        <button
                          onClick={() => { setProgress(openCycle.id, n, 0); setEditSurah(null); }}
                          style={ghostBtn}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredSurahs.length === 0 && (
              <div style={{ textAlign: "center", color: C.faint, fontSize: 14, padding: 24 }}>
                No surah matches "{search}".
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =====================================================================
  // HOME — CYCLES LIST
  // =====================================================================
  return (
    <div style={page}>
      <div style={wrap}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ ...arabic, fontSize: 30, color: C.ink }}>متابعة المراجعة</div>
          <div style={{ fontSize: 13, color: C.faint, marginTop: 2 }}>
            Quran Revision Tracker
          </div>
          <div style={{ width: 56, height: 3, background: C.gold, borderRadius: 2, margin: "12px auto 0" }} />
        </div>

        {saveError && (
          <div style={{ background: "#FDF0EE", border: `1px solid ${C.danger}`, color: C.danger, borderRadius: 10, padding: "10px 12px", fontSize: 13, marginBottom: 12 }}>
            Couldn't save your last change. It will retry on your next edit.
          </div>
        )}

        {/* Dashboard — cycle progress at a glance */}
        {cycles.length > 0 && (
          <div style={{ ...card, marginBottom: 16, borderTop: `3px solid ${C.gold}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, marginBottom: 12 }}>
              Progress overview
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
                gap: 12,
              }}
            >
              {cycles.map((c) => {
                const st = cycleStats(c);
                const size = 76, stroke = 9;
                const r = (size - stroke) / 2;
                const circ = 2 * Math.PI * r;
                const frac = Math.min(st.pct, 100) / 100;
                const ringColor = st.pct >= 100 ? C.done : C.gold;
                return (
                  <div
                    key={c.id}
                    onClick={() => setOpenCycleId(c.id)}
                    style={{ textAlign: "center", cursor: "pointer" }}
                  >
                    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
                      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx={size / 2} cy={size / 2} r={r}
                          fill="none" stroke={C.line} strokeWidth={stroke}
                        />
                        <circle
                          cx={size / 2} cy={size / 2} r={r}
                          fill="none" stroke={ringColor} strokeWidth={stroke}
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={circ * (1 - frac)}
                          style={{ transition: "stroke-dashoffset .4s ease" }}
                        />
                      </svg>
                      <div
                        style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 700,
                          color: st.pct >= 100 ? C.done : C.ink,
                        }}
                      >
                        {st.pct >= 100 ? "✓" : `${Math.round(st.pct)}%`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 11, fontWeight: 600, color: C.inkSoft, marginTop: 6,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 10, color: C.faint, marginTop: 1 }}>
                      ~{st.avgPerDay} ayahs/day
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New cycle — step 1: name + scope */}
        {creating ? (
          <div style={{ ...card, marginBottom: 16 }}>
            <input
              autoFocus
              placeholder={`Cycle name (e.g. Cycle ${cycles.length + 1}, Ramadan revision)`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={inputStyle}
            />

            <div style={{ fontSize: 13, fontWeight: 600, margin: "14px 0 8px", color: C.inkSoft }}>
              What does this cycle cover?
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["full", "Full Quran", `All 114 surahs · ${TOTAL_AYAHS.toLocaleString()} ayahs`],
                ["custom", "Pick surahs", "Choose specific surahs for this cycle"],
              ].map(([val, title, sub]) => {
                const sel = scope === val;
                return (
                  <div
                    key={val}
                    onClick={() => setScope(val)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px", borderRadius: 12, cursor: "pointer",
                      border: `2px solid ${sel ? C.ink : C.line}`,
                      background: sel ? "#F1F6F2" : "#fff",
                    }}
                  >
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${sel ? C.ink : C.line}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {sel && <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.ink }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                      <div style={{ fontSize: 12, color: C.faint }}>{sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={handleCreateContinue} style={{ ...btn(), flex: 1 }}>
                {scope === "full" ? "Create cycle" : "Choose surahs →"}
              </button>
              <button onClick={resetWizard} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreating(true)} style={{ ...btn(), width: "100%", padding: "13px", marginBottom: 16 }}>
            + New revision cycle
          </button>
        )}

        {/* Cycles */}
        {cycles.length === 0 && !creating && (
          <div style={{ textAlign: "center", color: C.faint, fontSize: 14, padding: "40px 16px" }}>
            No cycles yet. Create your first revision cycle to begin tracking, in shaa Allah.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cycles.map((c) => {
            const st = cycleStats(c);
            const isFull = st.surahCount === 114;
            return (
              <div key={c.id} style={{ ...card, borderRight: `3px solid ${C.gold}` }}>
                {renamingId === c.id ? (
                  <div>
                    <input
                      autoFocus
                      value={renameText}
                      onChange={(e) => setRenameText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && renameCycle(c.id)}
                      style={inputStyle}
                    />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button onClick={() => renameCycle(c.id)} style={btn()}>Save name</button>
                      <button onClick={() => setRenamingId(null)} style={ghostBtn}>Cancel</button>
                    </div>
                  </div>
                ) : confirmResetId === c.id ? (
                  <div>
                    <div style={{ fontSize: 14, marginBottom: 10 }}>
                      Reset all progress in <b>{c.name}</b> back to zero? The surah selection stays the same, and the daily pace counter restarts.
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => resetCycleProgress(c.id)} style={btn(C.gold)}>Reset progress</button>
                      <button onClick={() => setConfirmResetId(null)} style={ghostBtn}>Keep it</button>
                    </div>
                  </div>
                ) : confirmDeleteId === c.id ? (
                  <div>
                    <div style={{ fontSize: 14, marginBottom: 10 }}>
                      Delete <b>{c.name}</b> and all its progress? This can't be undone.
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => deleteCycle(c.id)} style={btn(C.danger)}>Delete</button>
                      <button onClick={() => setConfirmDeleteId(null)} style={ghostBtn}>Keep it</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => setOpenCycleId(c.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</div>
                          <span
                            style={{
                              fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap",
                              background: isFull ? "#EAF3ED" : C.goldSoft,
                              color: isFull ? C.done : "#7A5A14",
                            }}
                          >
                            {isFull ? "Full Quran" : `${st.surahCount} surahs`}
                          </span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: st.pct >= 100 ? C.done : C.gold }}>
                          {st.pct}%
                        </div>
                      </div>
                      <div style={{ margin: "8px 0" }}>
                        <ProgressBar value={st.done} max={st.total} />
                      </div>
                      <div style={{ fontSize: 12, color: C.faint }}>
                        {st.done.toLocaleString()} of {st.total.toLocaleString()} ayahs · {st.completed} of {st.surahCount} surahs · ~{st.avgPerDay} ayahs/day · updated {fmtDate(c.updatedAt)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                      <button onClick={() => setOpenCycleId(c.id)} style={{ ...btn(C.inkSoft), flex: 1, padding: "8px 12px", fontSize: 13, minWidth: 70 }}>
                        Open
                      </button>
                      <button onClick={() => { setRenamingId(c.id); setRenameText(c.name); }} style={ghostBtn}>
                        Rename
                      </button>
                      <button onClick={() => duplicateCycle(c.id)} style={ghostBtn}>
                        Duplicate
                      </button>
                      <button onClick={() => setConfirmResetId(c.id)} style={{ ...ghostBtn, color: "#7A5A14", borderColor: C.goldSoft }}>
                        Reset
                      </button>
                      <button onClick={() => setConfirmDeleteId(c.id)} style={{ ...ghostBtn, color: C.danger, borderColor: "#E8C7C2" }}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
