"use client";
import { useState } from "react";

/* Critères réels de check_compliance() dans src/rgpd_l19_05_main.py */
const CRITERIA = [
  { n: "01", label: "Chiffrement (HTTPS)", pts: 20, art: "Art. 32", ok: true },
  { n: "02", label: "Mentions légales", pts: 15, art: "Art. 12-14", ok: true },
  { n: "03", label: "Complexité mots de passe", pts: 20, art: "Art. 8", ok: true },
  { n: "04", label: "Gestion des cookies", pts: 10, art: "Art. 5(1)(b)", ok: false },
  { n: "05", label: "Cookies de session", pts: 0, art: "ASVS / OWASP", ok: false },
];

export default function ComplianceMeter() {
  const [run, setRun] = useState(false);
  const total = run ? CRITERIA.reduce((a, c) => a + c.pts, 0) : 0;
  const note = total >= 90 ? "RGPD-Safe" : "À renforcer";

  return (
    <div className="dossier-sheet p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="coord text-gold">Audit · 5 critères</span>
          <h3 className="mt-1 font-display text-3xl font-semibold">Évaluation de conformité</h3>
          <p className="mt-1 font-mono text-xs text-muted">app_url = http://127.0.0.1:3000</p>
        </div>
        <div className="seal shrink-0">
          <span className="font-display text-[10px] font-bold leading-tight text-gold">RGPD<br />L19-05<br />AUDIT</span>
        </div>
      </div>

      <div className="gold-rule my-6" />

      <div className="space-y-4">
        {CRITERIA.map((c) => (
          <div key={c.n}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-sm text-ink">
                <span className="mr-2 font-mono text-gold">{c.n}</span>{c.label}
                <span className="ml-2 coord text-muted">{c.art}</span>
              </span>
              <span className={`font-mono text-xs ${run ? (c.ok ? "text-emerald-700" : "text-red-700") : "text-muted"}`}>
                {run ? `${c.pts}/20` : "—/20"}
              </span>
            </div>
            <div className="h-2 w-full bg-ink/10">
              <div className="bar-fill h-full bg-gold" style={{ width: `${run ? c.pts / 20 * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-end justify-between border-t border-ink/15 pt-5">
        <div>
          <div className="coord text-muted">Score global</div>
          <div className="font-display text-5xl font-bold">{total}<span className="text-2xl text-muted">/100</span></div>
        </div>
        <div className="text-right">
          <div className="coord text-muted">Note certificative</div>
          <div className={`font-display text-2xl font-semibold ${run && total < 90 ? "text-red-700" : "text-ink"}`}>{run ? note : "—"}</div>
        </div>
      </div>

      <button
        onClick={() => setRun(!run)}
        className="mt-6 w-full border-2 border-navy bg-navy px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-cream transition hover:bg-gold hover:border-gold hover:text-navy"
      >
        {run ? "↺ Réinitialiser l'audit" : "◆ Lancer l'audit de conformité"}
      </button>
      <p className="mt-3 text-center font-mono text-[10px] text-muted">scores illustratifs · logique réelle dans src/rgpd_l19_05_main.py</p>
    </div>
  );
}
