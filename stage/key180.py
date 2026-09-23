"""Mbpp/180's answer key is wrong on every machine: the reference solution imports
radians and never calls it, so it feeds degrees into sin/cos as if they were radians.

    python3 stage/key180.py
"""
import json, os
from math import radians, sin, cos, acos

t = next(json.loads(l) for l in open(os.path.expanduser("~/.cache/smoleval/mbpp.jsonl"))
         if json.loads(l)["task_id"] == 180)
code = t["code"]
print("\n  Mbpp/180 reference solution, as shipped:\n")
for line in code.splitlines():
    print("    " + line)
print(f"\n  'radians' imported: {code.count('radians') >= 1}   called: {'radians(' in code}\n")

def as_shipped(slat, slon, elat, elon):
    return 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))
def with_radians(slat, slon, elat, elon):
    slat, slon, elat, elon = map(radians, (slat, slon, elat, elon))
    return 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))

a = (23.5, 67.5, 25.5, 69.5)
print(f"  distance_lat_long{a}")
print(f"      answer key (degrees fed as radians)  {as_shipped(*a):>10,.1f} km")
print(f"      correct code (with radians())        {with_radians(*a):>10,.1f} km\n")
