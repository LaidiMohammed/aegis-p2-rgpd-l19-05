"""generate_report.py — Génère le PDF du rapport P2 — Évaluation RGPD / Loi 19-05.

Contenu : score 0-100, détails par critère (5), recommandations, confiance (Rssi), sortie PDF pro.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

CRIT_W = {"Chiffrement (HTTPS)": 25,
          "Mentions légales (RGPD Art.12-14)": 15,
          "Complexité des mots de passe (RGPD Art.8)": 20,
          "Gestion des cookies (RGPD Art.5(1)(b))": 15,
          "Chiffrement des cookies de session (ASVS)": 25}


def build_markdown(data: dict) -> str:
    score = data["score"]
    lines = [
        "# P2 — Évaluation de conformité RGPD / Loi 19-05 (AEGIS)",
        "",
        f"- **Application :** {data['app_url']}",
        f"- **Délai évaluation :** {data.get('run_at', '-')}",
        f"- **Score RGPD/Loi 19-05 :** **{score}/100 — {data['note_certificative']}**",
        f"- **Criteria évalués :** {len(data['details'])} / {len(CRIT_W)}",
        "",
        "## 1. Matrice de conformité — Détail par critère",
        "",
    ]
    for c in data["details"]:
        w = CRIT_W.get(c["critère"], 0)
        lines.append(f"- **[{c['points']:>2d}/{w}] {c['critère']}** — {c['details']}")
    lines += [
        "",
        "## 2. Points clés (avec rythme du retour du prof — Analysé methode)",
        "- Chiffrement (HTTPS) : le site doit répondre sur HTTPS et serve cert valide (verifié sur test live si accessible).",
        "- Mentions légales : liens /privacy /terms /mentions reconnaissables (2/3 minimum sont considérés comme conformes).",
        "- Mots de passe : authentification backend accepte + complexité (≥8 caractères + maj+min+chiffre) — test manuel avec un mot de passe weak (today hari2020).",
        "- Cookies : consentement cookie (cookie name detecté / Set-Cookie /Cookies check EE) sur les pages publiques.",
        "- Cookies de session : Secure + HttpOnly sur /rest/user/authentication-details (login Honey de Juice Shop)",
        "",
        "## 3. Recommandations",
        "",
        "- Renforcer les mots de passe via pRéponses au back-office (boîte d'alerte) & politiques consistentes dans membres",
        "- Activer un cookie consentement conforme (pattern OWASP: consent avec cookiec categories et opt-out facile)",
        "- Renforcer Secure et HttpOnly sur tous les Set-Cookie de session",
        "- Verification periodique du SSL + certificate expiration (al arms cron ou régularité mensuelle)",
        "",
        f"## 4. Exécutions à montrer au prof :",
        f"- `python -m rgpd_l19_05 --url http://127.0.0.1:3000 --save-json outputs/results.json`",
        f"- `python -m generate_report --json outputs/results.json --pdf outputs/rapport-p2.pdf`",
    ]
    return "\n".join(lines)


def build_pdf(markdown: str, out_path: Path) -> None:
    from reportlab.lib.pagesizes import LETTER
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

    def esc(t: str) -> str:
        return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(out_path), pagesize=LETTER, topMargin=0.5 * inch, bottomMargin=0.5 * inch, leftMargin=0.75 * inch, rightMargin=0.75 * inch)
    styles = getSampleStyleSheet()
    story = []
    for line in markdown.split("\n"):
        if not line.strip():
            story.append(Spacer(1, 6))
            continue
        if line.startswith("# "):
            story.append(Paragraph(esc(line[2:]), styles["h1"]))
        elif line.startswith("## "):
            story.append(Paragraph(esc(line[3:]), styles["h2"]))
        else:
            story.append(Paragraph(esc(line), styles["Normal"]))
    doc.build(story)
    print(f"[OK] PDF écrit : {out_path} ({out_path.stat().st_size} octets)")


def _setup_utf8_stdout() -> None:
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:  # noqa: BLE001
            pass

def main(argv: list[str] | None = None) -> int:
    _setup_utf8_stdout()
    ap = argparse.ArgumentParser(prog="generate_report", description="Génère le rapport P2 — Évaluation RGPD/Loi 19-05")
    ap.add_argument("--json", type=Path, default=None, help="Fichier JSON du résultat (de rgpd_l19_05 --save-json)")
    ap.add_argument("--pdf", type=Path, default=Path("outputs/rapport-p2.pdf"), help="Chemin du PDF")
    args = ap.parse_args(argv)
    data = json.loads(args.json.read_text(encoding="utf-8")) if args.json else {
        "app_url": "n/a", "run_at": "-", "score": 0, "note_certificative": "n/a",
        "criteria_total": [], "details": [],
    }
    md = build_markdown(data)
    args.pdf.parent.mkdir(parents=True, exist_ok=True)
    (args.pdf.parent / "report.md").write_text(md, encoding="utf-8")
    build_pdf(md, args.pdf)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
