import ComplianceMeter from "@/components/ComplianceMeter";
import Reveal from "@/components/Reveal";

const CRITERIA = [
  ["01", "Chiffrement (HTTPS)", "GET https valide + certificat — 20 pts (RGPD Art. 32)"],
  ["02", "Mentions légales", "/privacy, /terms, /mentions, /policy — 20 pts (Art. 12-14)"],
  ["03", "Complexité des mots de passe", "Endpoint /api/Users — 20 pts (Art. 8)"],
  ["04", "Gestion des cookies", "Set-Cookie & consentement — 15 pts (Art. 5(1)(b))"],
  ["05", "Cookies de session", "Secure + HttpOnly sur /rest/user/authentication-details — 20 pts"],
];

export default function Page() {
  return (
    <main className="min-h-screen bg-cream">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-navy/15 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border-2 border-navy font-mono text-xs font-bold">P2</span>
            <span className="coord text-navy/70">CONFORMITÉ · RGPD / LOI 19-05</span>
          </a>
          <div className="hidden gap-7 md:flex">
            {[["#criteres","Critères"],["#audit","Audit"],["#demo","Démo"],["#ethique","Éthique"]].map(([h,l]) => (
              <a key={h} href={h} className="coord text-navy/55 hover:text-gold">{l}</a>
            ))}
          </div>
          <a href="https://github.com/LaidiMohammed/aegis-p2-rgpd-l19-05" target="_blank" rel="noreferrer" className="border border-navy/40 px-3 py-1.5 font-mono text-[11px] hover:bg-navy hover:text-cream">GitHub ↗</a>
        </div>
      </nav>

      {/* TICKER */}
      <div className="border-b border-navy/15 bg-navy py-2 text-cream">
        <div className="tick-track coord">
          {Array.from({length:2}).map((_,k)=>(
            <span key={k} className="flex shrink-0 gap-10 px-5"><span>RGPD</span><span>✦</span><span>LOI 19-05</span><span>✦</span><span>5 CRITÈRES</span><span>✦</span><span>SCORE 0-100</span><span>✦</span><span>M1 PFE · 2026</span><span>✦</span></span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section id="top" className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
        <div>
          <Reveal><div className="mb-5 flex items-center gap-3"><span className="h-px w-12 bg-gold"/><span className="coord text-gold">Fiche technique · P2</span></div></Reveal>
          <Reveal delay={70}>
            <h1 className="font-display text-6xl font-bold leading-[0.95] sm:text-7xl">
              Conformité<br/><span className="text-gold italic">RGPD</span><br/>&amp; Loi 19-05
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/75">
              Audit de conformité d'une application web locale (Juice Shop / DVWA) selon <b className="text-navy">5 critères vérifiables</b>,
              chacun noté sur 20 — pour un score global sur 100.
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#audit" className="bg-navy px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-cream hover:bg-gold hover:text-navy">Lancer l'audit ↓</a>
              <a href="#criteres" className="border border-navy/50 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-gold hover:text-gold">Les 5 critères</a>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-10 flex flex-wrap gap-8 border-t border-navy/20 pt-6">
              {[["05","critères"],["20","pts / critère"],["100","score max"],["00","GPU"]].map(([n,l])=><div key={l}><div className="font-display text-2xl font-bold">{n}</div><div className="coord text-navy/45">{l}</div></div>)}
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}><ComplianceMeter /></Reveal>
      </section>

      {/* CRITERES */}
      <section id="criteres" className="mx-auto max-w-7xl px-5 py-14">
        <Reveal><span className="coord text-gold">01 / Grille d'audit</span><h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Cinq articles vérifiables</h2><p className="mt-3 max-w-2xl text-navy/65">Chaque fonction d'évaluation est indépendante, mockable et testée hermétiquement.</p></Reveal>
        <div className="mt-10 space-y-0">
          {CRITERIA.map(([n,t,d],i)=>(
            <Reveal key={n} delay={i*70}>
              <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-navy/15 py-5 sm:grid-cols-[90px_1fr_1fr] sm:items-center">
                <span className="article-num">{n}</span>
                <h3 className="font-display text-2xl font-semibold">{t}</h3>
                <p className="font-mono text-xs leading-relaxed text-navy/60 sm:text-right">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AUDIT / ARCHITECTURE */}
      <section id="audit" className="mx-auto max-w-7xl px-5 py-14">
        <Reveal><span className="coord text-gold">02 / Architecture</span><h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl"> scoring déterministe</h2></Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal><div className="dossier-sheet p-7">
            <span className="coord text-gold">check_compliance()</span>
            <pre className="mt-4 whitespace-pre-wrap font-mono text-xs leading-loose text-navy/80">
{`criteria = [
  evaluate_encryption(...),        # 20
  evaluate_legal_mentions(...),    # 20
  evaluate_password_complexity(...),# 20
  evaluate_cookie_consent(...),    # 15
  evaluate_session_cookies_encryption(...) # 20
]
score = sum(c["points"] for c in criteria)
note = "RGPD-Safe" if score >= 90 else "À renforcer"`}
            </pre>
          </div></Reveal>
          <Reveal delay={100}><div className="border-l-2 border-gold pl-6">
            <span className="coord text-gold">Sortie</span>
            <p className="mt-3 font-mono text-sm leading-relaxed text-navy/75">&#123; app_url, score, note_certificative, criteria_total, details &#125;</p>
            <div className="gold-rule my-6"/>
            <p className="text-sm leading-relaxed text-navy/70">Requêtes HTTP enveloppées dans des <b>try/except</b>, mocks HTTP via <b>unittest.mock</b> — aucun appel réseau réel dans les tests.</p>
          </div></Reveal>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="mx-auto max-w-7xl px-5 py-14">
        <Reveal><span className="coord text-gold">03 / Démonstration</span><h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Commandes à présenter</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["make smoke   # ou scripts/run_smoke.sh","make test     # tests mocks HTTP",".venv/bin/python -m src.rgpd_l19_05_main --url http://127.0.0.1:3000","python -m src.rgpd_l19_05_main --json"].map((c)=>(
            <div key={c} className="border-l-2 border-gold bg-white/50 px-4 py-3 font-mono text-[12px] text-navy"><span className="text-gold">$</span> {c}</div>
          ))}
        </div>
        <Reveal delay={100}><p className="mt-6 font-mono text-xs text-navy/50">[SUMMARY] app_url=… score=…/100 (RGPD-Safe | À renforcer) · 5 critères détaillés</p></Reveal>
      </section>

      {/* ETHIQUE */}
      <section id="ethique" className="mx-auto max-w-7xl px-5 py-14">
        <Reveal><span className="coord text-gold">04 / Éthique</span><h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Cadre du projet</h2></Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[["Labo local","Application locale (Juice Shop/DVWA), aucune cible tiers."],["Anti-GPU / anti-cloud","Stand-alone, dépendances légères (requests)."],["Tests hermétiques","Mocks HTTP — reproductibles sans réseau."]].map(([t,d],i)=>(
            <Reveal key={t} delay={i*80}><div className="dossier-sheet h-full p-6"><h3 className="font-display text-xl font-semibold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-navy/70">{d}</p></div></Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-navy bg-navy text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-10">
          <div><div className="font-display text-2xl font-bold">P2 <span className="text-gold italic">/ CONFORMITÉ</span></div><div className="coord mt-1 text-cream/50">Master 1 PFE · Laidi Mohammed · 2026</div></div>
          <div className="flex gap-5 font-mono text-xs text-cream/70"><a href="https://github.com/LaidiMohammed/aegis-p2-rgpd-l19-05" target="_blank" rel="noreferrer" className="hover:text-gold">GitHub ↗</a><a href="https://aegis-p2-rgpd-l19-05.vercel.app" className="hover:text-gold">Vercel ↗</a></div>
        </div>
      </footer>
    </main>
  );
}
