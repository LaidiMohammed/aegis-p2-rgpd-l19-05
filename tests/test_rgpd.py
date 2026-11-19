"""Tests unitaires — P2 Évaluation RGPD / Loi 19-05 (mocks — sans shell).

- evaluate_encryption, evaluate_legal_mentions, evaluate_password_complexity,
  evaluate_cookie_consent, evaluate_session_cookies_encryption : cas mock — ok.
- check_compliance : score = somme des 5 critères (patch des 5 evaluate_*).
- generate_report : PDF généré — lu existance.
- main : smoke — exit code 0.
"""
from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src import rgpd_l19_05_main as m
from src import generate_report as rep


def fake_get(status=200, text="", headers=None, url=None):
    return SimpleNamespace(status_code=status, text=text, headers=headers or {})


def test_evaluate_encryption():
    with patch.object(m, "_get", return_value=fake_get(status=200)):
        r = m.evaluate_encryption("https://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 20


def test_evaluate_encryption_fail():
    with patch.object(m, "_get", side_effect=Exception("refused")):
        r = m.evaluate_encryption("https://127.0.0.1:3000")
    assert r["ok"] is False and r["points"] == 0


def test_evaluate_legal_mentions():
    with patch.object(m, "_get", return_value=fake_get(text="See /privacy /terms and /mentions pages")):
        r = m.evaluate_legal_mentions("http://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 20


def test_evaluate_legal_mentions_partial():
    with patch.object(m, "_get", return_value=fake_get(text="See /privacy only")):
        r = m.evaluate_legal_mentions("http://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 10


def test_evaluate_password_complexity():
    with patch.object(m, "_get", return_value=fake_get(status=200)):
        r = m.evaluate_password_complexity("http://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 20


def test_evaluate_cookie_consent():
    with patch.object(m, "_get", return_value=fake_get(headers={"Set-Cookie": "consent_to=true; path=/; httponly"})):
        r = m.evaluate_cookie_consent("http://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 15


def test_evaluate_cookie_consent_none():
    with patch.object(m, "_get", return_value=fake_get(headers={"Set-Cookie": "session=abc"})):
        r = m.evaluate_cookie_consent("http://127.0.0.1:3000")
    assert r["ok"] is False and r["points"] == 10


def test_evaluate_session_cookies_encryption():
    with patch.object(m, "_get", return_value=fake_get(headers={"Set-Cookie": "session=abc; secure; httponly"})):
        r = m.evaluate_session_cookies_encryption("http://127.0.0.1:3000")
    assert r["ok"] is True and r["points"] == 20


def test_check_compliance_score():
    fake_criteria = [
        {"critère": "Chiffrement (HTTPS)", "points": 20, "ok": True, "details": "d0"},
        {"critère": "Mentions légales (RGPD Art.12-14)", "points": 15, "ok": True, "details": "d1"},
        {"critère": "Complexité des mots de passe (RGPD Art.8)", "points": 20, "ok": True, "details": "d2"},
        {"critère": "Gestion des cookies (RGPD Art.5(1)(b))", "points": 15, "ok": True, "details": "d3"},
        {"critère": "Chiffrement des cookies de session (ASVS, OWASP R)", "points": 10, "ok": False, "details": "d4"},
    ]
    with patch.object(m, "evaluate_encryption", return_value=fake_criteria[0]), \
         patch.object(m, "evaluate_legal_mentions", return_value=fake_criteria[1]), \
         patch.object(m, "evaluate_password_complexity", return_value=fake_criteria[2]), \
         patch.object(m, "evaluate_cookie_consent", return_value=fake_criteria[3]), \
         patch.object(m, "evaluate_session_cookies_encryption", return_value=fake_criteria[4]):
        out = m.check_compliance("http://127.0.0.1:3000")
    assert out["score"] == 80 and out["note_certificative"] == "À renforcer"


def test_generate_report_produces_files(tmp_path):
    data = {"app_url": "http://127.0.0.1:3000", "run_at": "2026-11-21T10:00:00", "score": 85,
            "note_certificative": "RGPD-Safe", "criteria_total": [],
            "details": [{"critère": "Chiffrement (HTTPS)", "points": 20, "ok": True, "details": "x"}]}
    md = rep.build_markdown(data)
    assert "85/100" in md and "Chiffrement (HTTPS)" in md
    out = tmp_path / "r.pdf"
    rep.build_pdf(md, out)
    assert out.exists() and out.stat().st_size > 500


def test_main_smoke():
    assert m.main(["--url", "http://127.0.0.1:3000", "--json"]) == 0


if __name__ == "__main__":
    pytest.main([__file__, "-q"])
