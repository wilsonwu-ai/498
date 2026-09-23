"""Replay MBPP's own answer key twice: once with the benchmark's exact ==, once with a
float tolerance (EvalPlus-style rtol=1e-7, atol=1e-6, applied by rewriting each
`assert A == B` into `assert close(A, B)`). Shows that a tolerance rescues task 180
but not task 493, because 493's failure is a different *count* of hexagons.

    python3 stage/tolgrade.py
"""
import ast, json, os, subprocess, sys, concurrent.futures as cf

HELPER = '''
import math as __m
def __close(a, b, rtol=1e-07, atol=1e-06):
    if isinstance(a, bool) or isinstance(b, bool):
        return a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)) and (isinstance(a, float) or isinstance(b, float)):
        return a == b or __m.isclose(a, b, rel_tol=rtol, abs_tol=atol)
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)) and type(a) == type(b):
        return len(a) == len(b) and all(__close(x, y, rtol, atol) for x, y in zip(a, b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(__close(a[k], b[k], rtol, atol) for k in a)
    return a == b
'''

class Rw(ast.NodeTransformer):
    def visit_Assert(self, node):
        t = node.test
        if isinstance(t, ast.Compare) and len(t.ops) == 1 and isinstance(t.ops[0], ast.Eq):
            node.test = ast.Call(func=ast.Name('__close', ast.Load()), args=[t.left, t.comparators[0]], keywords=[])
        return node

def rewrite(src):
    tree = Rw().visit(ast.parse(src)); ast.fix_missing_locations(tree); return ast.unparse(tree)

def program(raw, tol):
    tests = "\n".join(raw["test_list"])
    parts = [raw["code"]]
    if (raw.get("test_setup_code") or "").strip(): parts.append(raw["test_setup_code"])
    parts.append(rewrite(tests) if tol else tests)
    return (HELPER if tol else "") + "\n".join(parts) + "\n"

def run(prog):
    try:
        r = subprocess.run([sys.executable, "-c", prog], capture_output=True, timeout=10)
        return r.returncode == 0
    except subprocess.TimeoutExpired:
        return False


rows = [json.loads(l) for l in open(os.path.expanduser("~/.cache/smoleval/mbpp.jsonl"))]
rows = [r for r in rows if 11 <= r["task_id"] <= 510]
print()
for tol in (False, True):
    with cf.ThreadPoolExecutor(8) as ex:
        res = list(ex.map(lambda r: run(program(r, tol)), rows))
    fails = [r["task_id"] for r, ok in zip(rows, res) if not ok]
    name = "tolerant grader (rtol 1e-7, atol 1e-6)" if tol else "exact grader (==)"
    print(f"  {name:40s} {sum(res)}/{len(rows)}   fails: {', '.join(f'Mbpp/{t}' for t in fails) or 'none'}")
print()
