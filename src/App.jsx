import { useState, useEffect, useCallback } from "react";

const CARD_COLORS = [
  "#FF6B6B","#4ECDC4","#FFE66D","#A78BFA",
  "#6EE7B7","#F97316","#60A5FA","#FB7185",
];

const FALLBACK_PEOPLE = [
  { name: "Albert Einstein", description: "Theoretical physicist", emoji: "🧪" },
  { name: "Marie Curie", description: "Scientist & Nobel laureate", emoji: "⚗️" },
  { name: "Leonardo da Vinci", description: "Artist & inventor", emoji: "🎨" },
  { name: "Cleopatra", description: "Queen of Egypt", emoji: "👑" },
  { name: "Isaac Newton", description: "Mathematician & physicist", emoji: "🍎" },
  { name: "Frida Kahlo", description: "Mexican artist", emoji: "🌺" },
  { name: "Nelson Mandela", description: "South African leader", emoji: "✊" },
  { name: "Amelia Earhart", description: "Aviation pioneer", emoji: "✈️" },
];

const OCCUPATION_EMOJIS = {
  physicist: "⚛️", scientist: "🔬", mathematician: "🔢", inventor: "💡",
  artist: "🎨", painter: "🖌️", writer: "✍️", author: "📚", poet: "🪶",
  musician: "🎵", composer: "🎼", singer: "🎤",
  politician: "🏛️", president: "🎖️", king: "👑", queen: "👑", emperor: "👑",
  explorer: "🧭", astronaut: "🚀", aviator: "✈️", pilot: "✈️",
  philosopher: "💭", theologian: "⛪", religious: "🙏",
  athlete: "🏅", footballer: "⚽", tennis: "🎾", basketball: "🏀",
  actor: "🎭", director: "🎬", filmmaker: "🎥",
  architect: "🏗️", engineer: "⚙️",
  doctor: "🩺", biologist: "🧬", chemist: "⚗️", astronomer: "🔭",
  general: "⚔️", military: "🎖️", admiral: "⚓",
};

function getEmoji(description = "") {
  const lower = description.toLowerCase();
  for (const [key, emoji] of Object.entries(OCCUPATION_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "⭐";
}

const FALLBACK_QUOTES = [
  { content: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { content: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { content: "I have a dream that one day this nation will rise up.", author: "Martin Luther King Jr." },
  { content: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

function StarField() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          animation: `twinkle 2s ${s.delay}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function PersonCard({ person, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const emoji = person.emoji || getEmoji(person.description);
  return (
    <button
      onClick={() => onClick(person.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${color}ee, ${color}88)`
          : `linear-gradient(135deg, ${color}55, ${color}22)`,
        border: `3px solid ${color}`,
        borderRadius: 20,
        padding: "16px 12px",
        cursor: "pointer",
        transform: hovered ? "scale(1.08) rotate(-1deg)" : "scale(1)",
        transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        boxShadow: hovered ? `0 8px 30px ${color}66` : `0 2px 10px ${color}33`,
        animation: `fadeUp 0.4s ${index * 0.07}s both`,
      }}
    >
      <span style={{ fontSize: 32 }}>{emoji}</span>
      <span style={{
        fontFamily: "'Fredoka One', cursive", fontSize: 13,
        color: "#fff", textAlign: "center", lineHeight: 1.2,
        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
      }}>{person.name}</span>
      {person.year && (
        <span style={{
          background: `${color}44`, borderRadius: 20,
          padding: "2px 10px", fontSize: 11,
          color: "#ffffffcc", fontWeight: 700,
        }}>Born {person.year}</span>
      )}
      {person.description && (
        <span style={{
          fontSize: 10, color: "#ffffff99",
          textAlign: "center", lineHeight: 1.3,
          fontFamily: "'Nunito', sans-serif",
        }}>{person.description.length > 30
            ? person.description.slice(0, 30) + "…"
            : person.description}</span>
      )}
    </button>
  );
}

function BioCard({ data, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

  const simplify = (text) => {
    if (!text) return "";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 4).join(" ");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(10,10,30,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        opacity: visible ? 1 : 0, transition: "opacity 0.3s",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg, #1a1a3e 0%, #0d1b4b 100%)",
          border: "3px solid #a78bfa", borderRadius: 28,
          maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto",
          padding: "28px 24px",
          boxShadow: "0 20px 60px rgba(167,139,250,0.3)",
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          transition: "transform 0.35s cubic-bezier(.34,1.2,.64,1)",
          position: "relative",
        }}
      >
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "#a78bfa33", border: "2px solid #a78bfa",
          borderRadius: 12, color: "#fff", fontSize: 18,
          width: 36, height: 36, cursor: "pointer",
          fontFamily: "'Fredoka One', cursive",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        {data.thumbnail && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img src={data.thumbnail.source} alt={data.title} style={{
              width: 120, height: 120, objectFit: "cover",
              borderRadius: "50%", border: "4px solid #a78bfa",
              boxShadow: "0 0 24px #a78bfa66",
            }} />
          </div>
        )}

        <h2 style={{
          fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#e0d4ff",
          textAlign: "center", margin: "0 0 4px",
          textShadow: "0 0 20px #a78bfa88",
        }}>{data.title}</h2>

        {data.description && (
          <p style={{
            textAlign: "center", color: "#a78bfa",
            fontFamily: "'Nunito', sans-serif",
            fontSize: 14, margin: "0 0 16px", fontStyle: "italic",
          }}>{data.description}</p>
        )}

        <div style={{
          background: "rgba(167,139,250,0.1)", borderRadius: 16, padding: 16,
          border: "1px solid rgba(167,139,250,0.2)", marginBottom: 16,
        }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 16,
            color: "#ddd6fe", lineHeight: 1.7, margin: 0,
          }}>{simplify(data.extract)}</p>
        </div>

        {data.content_urls?.desktop?.page && (
          <div style={{ textAlign: "center" }}>
            <a href={data.content_urls.desktop.page} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                color: "#fff", textDecoration: "none",
                padding: "10px 22px", borderRadius: 50,
                fontFamily: "'Fredoka One', cursive", fontSize: 15,
                boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
              }}>
              📖 Read More on Wikipedia
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [bioData, setBioData] = useState(null);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [quoteFading, setQuoteFading] = useState(false);
  const [featured, setFeatured] = useState([]);
  const [bdayLoading, setBdayLoading] = useState(true);
  const [todayLabel, setTodayLabel] = useState("");

  // Fetch a real quote, rotate every 8s
  useEffect(() => {
    let cancelled = false;
    const fetchQuote = async () => {
      setQuoteFading(true);
      setTimeout(async () => {
        if (cancelled) return;
        try {
          const res = await fetch("https://api.quotable.io/random?tags=history|education|knowledge|wisdom&maxLength=120");
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (!cancelled) setQuote({ content: data.content, author: data.author });
        } catch {
          // fallback to random local quote
          if (!cancelled) setQuote(q => {
            const next = FALLBACK_QUOTES[(FALLBACK_QUOTES.indexOf(q) + 1) % FALLBACK_QUOTES.length];
            return next;
          });
        } finally {
          if (!cancelled) setQuoteFading(false);
        }
      }, 400);
    };
    fetchQuote();
    const t = setInterval(fetchQuote, 30000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  // Load "On This Day" birthdays from Wikipedia
  useEffect(() => {
    const loadBirthdays = async () => {
      setBdayLoading(true);
      try {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const monthNames = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"];
        setTodayLabel(`${monthNames[now.getMonth()]} ${now.getDate()}`);

        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const births = data.births || [];

        // Filter: must have a pages entry with a description and not be a redirect
        const valid = births.filter(b => {
          const page = b.pages?.[0];
          return page && page.description && !page.description.toLowerCase().includes("disambiguation");
        });

        // Sort by notability proxy: prefer those with a thumbnail
        const withThumb = valid.filter(b => b.pages?.[0]?.thumbnail);
        const withoutThumb = valid.filter(b => !b.pages?.[0]?.thumbnail);
        const sorted = [...withThumb, ...withoutThumb];

        // Pick 8, spread across the list for variety (not just most recent year)
        const step = Math.max(1, Math.floor(sorted.length / 8));
        const picked = [];
        for (let i = 0; i < sorted.length && picked.length < 8; i += step) {
          picked.push(sorted[i]);
        }
        // Fill up to 8 if needed
        for (let i = 0; i < sorted.length && picked.length < 8; i++) {
          if (!picked.includes(sorted[i])) picked.push(sorted[i]);
        }

        const result = picked.slice(0, 8).map(b => ({
          name: b.pages[0].normalizedtitle || b.pages[0].title,
          description: b.pages[0].description,
          year: b.year,
          emoji: null,
        }));

        setFeatured(result.length >= 4 ? result : FALLBACK_PEOPLE);
      } catch {
        setFeatured(FALLBACK_PEOPLE);
      } finally {
        setBdayLoading(false);
      }
    };
    loadBirthdays();
  }, []);

  const fetchBio = useCallback(async (name) => {
    setLoading(true);
    setError("");
    setBioData(null);
    try {
      // Step 1: try direct summary lookup
      const slug = encodeURIComponent(name.trim().replace(/ /g, "_"));
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`);

      if (res.ok) {
        const data = await res.json();
        if (data.type !== "disambiguation") {
          setBioData(data);
          return;
        }
      }

      // Step 2: fallback — use Wikipedia opensearch to find the best matching title
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=5&format=json&origin=*`
      );
      const searchData = await searchRes.json();
      const titles = searchData[1]; // array of matching titles
      if (!titles || titles.length === 0) throw new Error("Person not found! Try their full name.");

      // Step 3: fetch summary for the best match
      const bestSlug = encodeURIComponent(titles[0].replace(/ /g, "_"));
      const finalRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${bestSlug}`);
      if (!finalRes.ok) throw new Error("Person not found! Try their full name.");
      const finalData = await finalRes.json();
      if (finalData.type === "disambiguation") throw new Error("Too many results! Try a more specific name.");
      setBioData(finalData);

    } catch (e) {
      setError(e.message || "Oops! Couldn't find that person.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) fetchBio(search.trim());
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080820; }
        @keyframes twinkle { from { opacity: 0.2; } to { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinEarth { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1a1a3e; }
        ::-webkit-scrollbar-thumb { background: #a78bfa; border-radius: 3px; }
        input::placeholder { color: rgba(167,139,250,0.6); }
      `}</style>

      <StarField />

      <div style={{
        minHeight: "100vh", fontFamily: "'Nunito', sans-serif",
        position: "relative", zIndex: 1, padding: "20px 16px 40px",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 52, animation: "float 3s ease-in-out infinite", display: "inline-block", marginBottom: 8 }}>🔭</div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(28px, 7vw, 44px)", color: "#e0d4ff",
            textShadow: "0 0 30px #a78bfa, 0 0 60px #7c3aed55",
            lineHeight: 1.1, letterSpacing: 1,
          }}>History Heroes</h1>
          <p style={{ color: "#a78bfa", fontSize: 16, marginTop: 6, fontWeight: 600 }}>
            Discover amazing people who changed the world!{" "}<span style={{ display: "inline-block", animation: "spinEarth 4s linear infinite" }}>🌍</span>
          </p>
        </div>

        {/* Quote Ticker */}
        <div style={{
          background: "linear-gradient(135deg, #fbbf2422, #f59e0b22)",
          border: "2px solid #fbbf24", borderRadius: 16,
          padding: "12px 20px", textAlign: "center",
          maxWidth: 500, margin: "0 auto 24px",
          opacity: quoteFading ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}>
          <span style={{ fontSize: 14, color: "#fde68a", fontWeight: 700, fontStyle: "italic", display: "block" }}>
            💡 "{quote.content}"
          </span>
          <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginTop: 4, display: "block" }}>
            — {quote.author}
          </span>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: 480, margin: "0 auto 32px" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="🔍 Type a famous person's name..."
              style={{
                flex: 1, padding: "14px 20px", borderRadius: 50,
                border: "3px solid #a78bfa",
                background: "rgba(167,139,250,0.1)",
                color: "#fff", fontSize: 16,
                fontFamily: "'Nunito', sans-serif", outline: "none",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: "14px 22px", borderRadius: 50, border: "none",
                background: loading ? "#4c1d95" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                color: "#fff", fontSize: 20,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(124,58,237,0.4)",
                transition: "transform 0.15s",
                transform: loading ? "scale(0.95)" : "scale(1)",
              }}
            >
              {loading
                ? <span style={{ animation: "pulse 1s infinite", display: "inline-block" }}>⏳</span>
                : "🚀"}
            </button>
          </div>
          {error && (
            <p style={{ color: "#fca5a5", textAlign: "center", marginTop: 10, fontWeight: 700, fontSize: 15 }}>
              😬 {error}
            </p>
          )}
        </div>

        {/* Birthday Section */}
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <h2 style={{
              fontFamily: "'Fredoka One', cursive", color: "#c4b5fd",
              fontSize: 20, display: "inline",
            }}>
              🎂 Born on {todayLabel || "Today"}
            </h2>
            <p style={{ color: "#7c6aad", fontSize: 13, marginTop: 4 }}>
              These amazing people share today's birthday!
            </p>
          </div>

          {bdayLoading ? (
            <div style={{ textAlign: "center", padding: "30px 0" }}>
              <div style={{
                display: "inline-block", width: 36, height: 36,
                border: "4px solid #a78bfa44",
                borderTop: "4px solid #a78bfa",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <p style={{ color: "#a78bfa", marginTop: 12, fontFamily: "'Fredoka One', cursive" }}>
                Loading birthday heroes...
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: 12,
            }}>
              {featured.map((p, i) => (
                <PersonCard key={p.name} person={p} index={i} onClick={fetchBio} />
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <p style={{ color: "#6d5bae", fontSize: 13, fontWeight: 600 }}>
            Built with ❤️ by Helen Wang
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a
              href="https://linkedin.com/in/helenyixuanwang"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(10,102,194,0.2)",
                border: "1px solid rgba(10,102,194,0.5)",
                borderRadius: 20, padding: "6px 14px",
                color: "#60a5fa", fontSize: 13, fontWeight: 700,
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(10,102,194,0.4)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(10,102,194,0.2)"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/Helenyixuanwang/history-heroes"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20, padding: "6px 14px",
                color: "#e0d4ff", fontSize: 13, fontWeight: 700,
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#e0d4ff">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {bioData && <BioCard data={bioData} onClose={() => setBioData(null)} />}
    </>
  );
}
