#!/bin/bash
.PHONY: install test smoke demo lint

V := $(shell if [ -d .venv ]; then echo .venv/bin/python; else echo python3; fi)

install: venv

venv:
	python3 -m venv .venv
	.venv/bin/pip install -r requirements.txt

test:
	$(V) -m pytest -q

# Smoke — smoke CLI (voir README)
smoke:
	$(V) src/rgpd_l19_05_main.py --url http://127.0.0.1:3000 --json

demo: install smoke

lint:
	$(V) -m ruff check src tests 2>/dev/null || true
