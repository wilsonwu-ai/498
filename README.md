# 498/500: your phone is an MBPP grader

A live demo for the talk **"498/500: The Two MBPP Problems That Only Fail on a Mac"**
(AI Tinkerers NYC, September 2026).

Open **https://wilsonwu-ai.github.io/498/** on any phone. The page runs line-for-line
JavaScript ports of the MBPP reference solutions for tasks 180 and 493, then grades them
against MBPP's own answer key with exact equality, the way the benchmark's asserts do.
Whether your phone passes depends on its math library.

| Engine | Where you meet it | Task 180 | Task 493 |
|---|---|---|---|
| V8 (ships its own fdlibm port) | Chrome, Android, Edge, node | PASS | PASS, 10 hexagons |
| JavaScriptCore (calls the OS libm) | Safari, every browser on iPhone, bun | FAIL | FAIL, 12 hexagons |

Measured on one Mac (macOS 26.6, arm64): node 22 passes both, bun 1.3 and the `jsc` CLI fail
both. Python on the same Mac fails both too, including x86 Python under Rosetta, so it is
the math library, not the chip.

## Why

`sin`, `cos`, `tan` and `acos` are not required by IEEE 754 to be correctly rounded, so
different math libraries may return different last bits. Both answers are within spec.
MBPP's tests compare floats with `==`, so one unit in the last place turns PASS into FAIL:

- **Task 180** (distance between two points): `12179.372041317427` vs the key's `12179.372041317429`.
- **Task 493** (hexagon grid): a 1-ulp difference in `tan(pi/6)` flips a `while` loop
  comparison, so the grid gains a column. The key has 10 hexagons; Apple's libm draws 12.
  A float tolerance cannot fix a different count.
- Bonus: task 180's reference solution imports `radians` and never calls it, so the answer
  key treats degrees as radians. For `(23.5, 67.5, 25.5, 69.5)` the key says 12,179 km; the
  real great-circle distance is about 300.7 km. Correct code fails it on every machine.

## Files

| File | What it is |
|---|---|
| `index.html` | The phone page. All math runs on the device; works offline once loaded. |
| `stage.html` | Presenter view: QR code, live tally, answer-key grid vs this browser's grid. Keys: `R` reset tally, `D` diagram, `F` fullscreen, `S` rehearsal mode (simulated data, loudly labelled). |
| `probe.js` | The ported reference solutions plus the embedded answer key. Runs in browsers, node, bun and `jsc`. |
| `diagram.svg` | One diagram: same code, three math libraries, three verdicts. |
| `stage/demo.sh` | Terminal beats for the talk (`bash stage/demo.sh all`). Needs [smoleval](https://github.com/wilsonwu-ai/smoleval) and its dataset cache for beat 1. |

## Math-library fingerprint

`probe.js` asks the device's math library 31 questions (`tan(pi/6)`, `acos(0.3)`, `hypot(3, 4.1)`...),
concatenates the exact IEEE-754 bits of every answer and hashes them with FNV-1a into 8 hex characters.
Same library, same fingerprint, whatever language is asking. The spec is shared byte for byte with
`smoleval fingerprint` ([smoleval, branch env-fingerprint](https://github.com/wilsonwu-ai/smoleval/tree/env-fingerprint)).

| Fingerprint | Library | Seen in |
|---|---|---|
| `260cb0bf` | Apple libm, arm64 | Python on an Apple silicon Mac, Safari's JavaScriptCore, bun |
| `a6233f19` | Apple libm, Intel build | x86 Python under Rosetta (differs from arm64 on 2 of 31 probes) |
| `44543bc6` | V8's fdlibm port | Chrome, Android, node |
| `1853a0cf` | glibc and musl | Linux (GitHub Actions ubuntu-latest, glibc 2.39), Pyodide |

`stage/linux-replay/` is the artifact of a real Linux replay: [GitHub Actions run 35866557239](https://github.com/wilsonwu-ai/smoleval/actions/runs/35866557239)
(ubuntu-latest, CPython 3.12.14, glibc 2.39): HumanEval 164/164, MBPP 500/500, fingerprint `1853a0cf`.
`smoleval compare` against a Mac replay reports `ENVIRONMENT CHANGED` (8 of 31 probes differ),
lists Mbpp/180 and Mbpp/493 as flipped, and exits 3 instead of attributing the drop to the model.

## The live tally and privacy

Each phone posts one small JSON message to a public [ntfy.sh](https://ntfy.sh) topic:
pass/fail per task, hexagon count, math-library fingerprint, device family (iPhone, Android,
Mac...), browser family, and a random per-browser id used to count each device once. It also
records the same fields as one anonymous PostHog event (no autocapture, no pageviews, no
session recording, memory-only persistence, so no cookies). No names. Add `?tally=off` to the
URL to send nothing. The stage view
only counts messages that match the expected shape.

## Credits

- MBPP: Austin et al., *Program Synthesis with Large Language Models* (2021),
  [google-research/mbpp](https://github.com/google-research/google-research/tree/master/mbpp), CC-BY-4.0.
  The answer-key values in `probe.js` are copied from tasks 180 and 493 of that dataset.
- Harness: [smoleval](https://github.com/wilsonwu-ai/smoleval).
