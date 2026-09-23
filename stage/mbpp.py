"""Run MBPP's own reference solution for a task against its own asserts.

    python3 stage/mbpp.py 180
    arch -x86_64 /usr/bin/python3 stage/mbpp.py 180     # Intel code path via Rosetta

Reads the dataset from smoleval's sha256-pinned cache (~/.cache/smoleval/mbpp.jsonl),
so the code and the answer key are the benchmark's, not a re-implementation.
"""
import json, math, os, platform, sys

task = int(sys.argv[1]) if len(sys.argv) > 1 else 180
rows = [json.loads(l) for l in open(os.path.expanduser("~/.cache/smoleval/mbpp.jsonl"))]
t = next(r for r in rows if r["task_id"] == task)

print(f"\n  python {platform.python_version()} on {platform.system()} {platform.machine()}")
print(f"  Mbpp/{task}: {t['text']}\n")
ns = {}
exec(t["code"], ns)
exec(t.get("test_setup_code") or "", ns)

passed = 0
for a in t["test_list"]:
    call, expected = a[len("assert "):].split("==", 1)
    got, key = eval(call, ns), eval(expected, ns)
    ok = got == key
    passed += ok
    if isinstance(got, float):
        print(f"  {call.strip()}")
        print(f"      answer key   {key!r}")
        print(f"      this machine {got!r}   {'PASS' if ok else 'FAIL'}\n")
    else:
        n = len(got) if isinstance(got, list) else "?"
        m = len(key) if isinstance(key, list) else "?"
        print(f"  {call.strip()}")
        print(f"      answer key   {m} hexagons")
        print(f"      this machine {n} hexagons   {'PASS' if ok else 'FAIL'}\n")

print(f"  Mbpp/{task}: {passed}/{len(t['test_list'])} asserts pass")
print(f"  tan(pi/6) here = {math.tan(math.pi / 6)!r}\n")
