# ETHICS — P2 — Évaluation de conformité RGPD / Loi 19-05 (AEGIS)

Engagements éthiques du projet — stand-alone, labo local, GPU refused, anti-cloud.

- **Cible** : [AEGIS Évaluation de conformité RGPD / Loi 19-05](https://github.com/LaidiMohammed/aegis-p2-rgpd-l19-05)
- **Périmètre** : [AEGIS Évaluation de conformité RGPD / Loi 19-05](https://aegis-p2-rgpd-l19-05.vercel.app) — smoke + fonctions CLI.
- **GPU refused** : implementation uniquement CPU/pure Python.
- **Données locales** : sources acceptées : labo local (localhost, Juice Shop, DVWA, etc.).
- **Smoke au prof** : cmds à exécuter — voir README/scripts/run_smoke.sh.
- **Smoke clé de validation** : voir `smoke()` dans `src/rgpd-l19-05_main.py` — doit retourner `{"ok": true, ...}`.
- **Site statique Vercel** : disponible pour la démo statique (smoke uniquement).

See SPEC.md (avec use cases + tableaux attendus).
