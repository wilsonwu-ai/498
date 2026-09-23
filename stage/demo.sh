#!/usr/bin/env bash
# Running-code beats for the talk, in talk order.
#   bash stage/demo.sh talk    the talk order: 1, 2, (switch to the stage view), 5, 7, 8
#   bash stage/demo.sh all     every beat 1-8, for rehearsal
#   bash stage/demo.sh <n>     run one beat
#
#   1  harness: replay MBPP's own answer key through smoleval        -> 498/500
#   2  bare Python, the dataset's own code + asserts for task 180     -> FAIL by 1 ulp
#   3  same file on the Intel code path via Rosetta                    -> still FAIL (not the chip)
#   4  same math in two JavaScript engines on this laptop              -> node PASS, bun FAIL
#   5  the obvious fix: grade floats with a tolerance                  -> 499/500, 493 still fails
#   6  why: task 493's hexagon grid                                     -> 12 hexagons vs the key's 10
#   7  the twist: task 180's answer key forgot radians                 -> 12,179 km vs 300.7 km
#   8  the gate: fingerprint this Mac, compare with the Linux CI run    -> ENVIRONMENT CHANGED, exit 3
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
SMOLEVAL="${SMOLEVAL:-$HOME/Desktop/github-projects/smoleval}"

beat() {
  case "$1" in
    1) (cd "${TMPDIR:-/tmp}" && PYTHONPATH="$SMOLEVAL" "$SMOLEVAL/.venv/bin/python" -m smoleval.cli run \
          --backend dryrun --model canonical --tasks mbpp --n-samples 1 --k 1 --out talk-mac 2>/dev/null) ;;
    2) python3 "$HERE/stage/mbpp.py" 180 ;;
    3) arch -x86_64 /usr/bin/python3 "$HERE/stage/mbpp.py" 180 ;;
    4) echo; echo "  ---- node: V8, the engine in Chrome and Android ----"; node "$HERE/stage/probe-cli.cjs"
       echo "  ---- bun: JavaScriptCore, the engine in Safari and every iPhone browser ----"; bun "$HERE/stage/probe-cli.cjs" ;;
    5) python3 "$HERE/stage/tolgrade.py" ;;
    6) python3 "$HERE/stage/mbpp.py" 493 ;;
    7) python3 "$HERE/stage/key180.py" ;;
    8) SE() { PYTHONPATH="$SMOLEVAL" "$SMOLEVAL/.venv/bin/python" -m smoleval.cli "$@"; }
       [ -f "${TMPDIR:-/tmp}/results/talk-mac/summary.json" ] || beat 1 >/dev/null
       SE fingerprint 2>/dev/null | head -4 || true; echo
       R="${TMPDIR:-/tmp}/results"; rm -rf "$R/linux-ci"; cp -R "$HERE/stage/linux-replay" "$R/linux-ci"
       (cd "$R" && SE compare linux-ci talk-mac) || echo "  (exit code $?)" ;;
    *) sed -n '2,15p' "$0"; exit 1 ;;
  esac
}

if [ "${1:-}" = "all" ] || [ "${1:-}" = "talk" ]; then
  SEQ="1 2 3 4 5 6 7 8"; [ "$1" = "talk" ] && SEQ="1 2 STAGE 5 7 8"
  for n in $SEQ; do
    if [ "$n" = "STAGE" ]; then
      clear; printf '\n\n  \033[36mCmd-Tab to Safari: the stage view. Phones, then come back.\033[0m\n\n'
      read -r -p "  (Enter when you are back) " _; continue
    fi
    clear; printf '\n  \033[36m[beat %s]\033[0m  ' "$n"; grep -m1 "^#   $n  " "$0" | sed -e 's/^#   [0-9]  //' -e 's/ *->.*//'
    beat "$n"
    read -r -p "  (Enter for next beat) " _
  done
else
  beat "${1:-}"
fi
