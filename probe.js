/* probe.js: line-for-line JavaScript ports of the MBPP reference solutions for
 * tasks 180 and 493, graded against the dataset's own answer key with exact
 * equality, exactly as MBPP's asserts do in Python. No dependencies, no network.
 * Runs in browsers, node, bun, and the JavaScriptCore CLI.
 * Answer key: google-research MBPP (CC-BY-4.0), test_list of tasks 180 and 493.
 */
(function (root) {
  var KEYS = {"k180":[{"args":[23.5,67.5,25.5,69.5],"key":12179.372041317429},{"args":[10.5,20.5,30.5,40.5],"key":6069.397933300514},{"args":[10.0,20.0,30.0,40.0],"key":6783.751974994595}],"k493":[{"args":[1.0,1.0,4.0,4.0,3.0],"key":[[[-5.0,-4.196152422706632],[-5.0,-0.7320508075688767],[-2.0,1.0],[1.0,-0.7320508075688767],[1.0,-4.196152422706632],[-2.0,-5.928203230275509],[-5.0,-4.196152422706632]],[[1.0,-4.196152422706632],[1.0,-0.7320508075688767],[4.0,1.0],[7.0,-0.7320508075688767],[7.0,-4.196152422706632],[4.0,-5.928203230275509],[1.0,-4.196152422706632]],[[7.0,-4.196152422706632],[7.0,-0.7320508075688767],[10.0,1.0],[13.0,-0.7320508075688767],[13.0,-4.196152422706632],[10.0,-5.928203230275509],[7.0,-4.196152422706632]],[[-2.0,1.0000000000000004],[-2.0,4.464101615137755],[1.0,6.196152422706632],[4.0,4.464101615137755],[4.0,1.0000000000000004],[1.0,-0.7320508075688767],[-2.0,1.0000000000000004]],[[4.0,1.0000000000000004],[4.0,4.464101615137755],[7.0,6.196152422706632],[10.0,4.464101615137755],[10.0,1.0000000000000004],[7.0,-0.7320508075688767],[4.0,1.0000000000000004]],[[-5.0,6.196152422706632],[-5.0,9.660254037844387],[-2.0,11.392304845413264],[1.0,9.660254037844387],[1.0,6.196152422706632],[-2.0,4.464101615137755],[-5.0,6.196152422706632]],[[1.0,6.196152422706632],[1.0,9.660254037844387],[4.0,11.392304845413264],[7.0,9.660254037844387],[7.0,6.196152422706632],[4.0,4.464101615137755],[1.0,6.196152422706632]],[[7.0,6.196152422706632],[7.0,9.660254037844387],[10.0,11.392304845413264],[13.0,9.660254037844387],[13.0,6.196152422706632],[10.0,4.464101615137755],[7.0,6.196152422706632]],[[-2.0,11.392304845413264],[-2.0,14.85640646055102],[1.0,16.588457268119896],[4.0,14.85640646055102],[4.0,11.392304845413264],[1.0,9.660254037844387],[-2.0,11.392304845413264]],[[4.0,11.392304845413264],[4.0,14.85640646055102],[7.0,16.588457268119896],[10.0,14.85640646055102],[10.0,11.392304845413264],[7.0,9.660254037844387],[4.0,11.392304845413264]]]},{"args":[5.0,4.0,7.0,9.0,8.0],"key":[[[-11.0,-9.856406460551018],[-11.0,-0.6188021535170058],[-3.0,4.0],[5.0,-0.6188021535170058],[5.0,-9.856406460551018],[-3.0,-14.475208614068023],[-11.0,-9.856406460551018]],[[5.0,-9.856406460551018],[5.0,-0.6188021535170058],[13.0,4.0],[21.0,-0.6188021535170058],[21.0,-9.856406460551018],[13.0,-14.475208614068023],[5.0,-9.856406460551018]],[[21.0,-9.856406460551018],[21.0,-0.6188021535170058],[29.0,4.0],[37.0,-0.6188021535170058],[37.0,-9.856406460551018],[29.0,-14.475208614068023],[21.0,-9.856406460551018]],[[-3.0,4.0],[-3.0,13.237604307034012],[5.0,17.856406460551018],[13.0,13.237604307034012],[13.0,4.0],[5.0,-0.6188021535170058],[-3.0,4.0]],[[13.0,4.0],[13.0,13.237604307034012],[21.0,17.856406460551018],[29.0,13.237604307034012],[29.0,4.0],[21.0,-0.6188021535170058],[13.0,4.0]],[[-11.0,17.856406460551018],[-11.0,27.09401076758503],[-3.0,31.712812921102035],[5.0,27.09401076758503],[5.0,17.856406460551018],[-3.0,13.237604307034012],[-11.0,17.856406460551018]],[[5.0,17.856406460551018],[5.0,27.09401076758503],[13.0,31.712812921102035],[21.0,27.09401076758503],[21.0,17.856406460551018],[13.0,13.237604307034012],[5.0,17.856406460551018]],[[21.0,17.856406460551018],[21.0,27.09401076758503],[29.0,31.712812921102035],[37.0,27.09401076758503],[37.0,17.856406460551018],[29.0,13.237604307034012],[21.0,17.856406460551018]],[[-3.0,31.712812921102035],[-3.0,40.95041722813605],[5.0,45.569219381653056],[13.0,40.95041722813605],[13.0,31.712812921102035],[5.0,27.09401076758503],[-3.0,31.712812921102035]],[[13.0,31.712812921102035],[13.0,40.95041722813605],[21.0,45.569219381653056],[29.0,40.95041722813605],[29.0,31.712812921102035],[21.0,27.09401076758503],[13.0,31.712812921102035]]]},{"args":[9.0,6.0,4.0,3.0,2.0],"key":[[[5.0,2.5358983848622456],[5.0,4.8452994616207485],[7.0,6.0],[9.0,4.8452994616207485],[9.0,2.5358983848622456],[7.0,1.3811978464829942],[5.0,2.5358983848622456]],[[7.0,6.0],[7.0,8.309401076758503],[9.0,9.464101615137753],[11.0,8.309401076758503],[11.0,6.0],[9.0,4.8452994616207485],[7.0,6.0]]]}]};

  // Mbpp/180 reference (note: it imports radians but never calls it).
  //   dist = 6371.01 * acos(sin(slat)*sin(elat) + cos(slat)*cos(elat)*cos(slon - elon))
  function distance_lat_long(slat, slon, elat, elon) {
    return 6371.01 * Math.acos(Math.sin(slat) * Math.sin(elat) +
                               Math.cos(slat) * Math.cos(elat) * Math.cos(slon - elon));
  }

  // Mbpp/493 reference, same operation order as the Python.
  // Python's math.radians(x) is x * (pi / 180).
  function calculate_polygons(startx, starty, endx, endy, radius) {
    var sl = (2 * radius) * Math.tan(Math.PI / 6);
    var p = sl * 0.5;
    var b = sl * Math.cos(30 * (Math.PI / 180));
    var w = b * 2;
    var h = 2 * sl;
    startx = startx - w; starty = starty - h; endx = endx + w; endy = endy + h;
    var origx = startx, xoffset = b, yoffset = 3 * p, polygons = [], row = 1;
    while (starty < endy) {
      startx = (row % 2 === 0) ? origx + xoffset : origx;
      while (startx < endx) {
        var p1 = [startx, starty + p], p2 = [startx, starty + (3 * p)],
            p3 = [startx + b, starty + h], p4 = [startx + w, starty + (3 * p)],
            p5 = [startx + w, starty + p], p6 = [startx + b, starty];
        polygons.push([p1, p2, p3, p4, p5, p6, [p1[0], p1[1]]]);
        startx += w;
      }
      starty += yoffset;
      row += 1;
    }
    return polygons;
  }

  function sameExactly(a, b) {            // Python == on nested lists/tuples of floats
    if (typeof a === 'number') return a === b;
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (!sameExactly(a[i], b[i])) return false;
    return true;
  }
  function countDiffs(a, b) {            // coordinates that differ, counting missing/extra ones
    if (a === undefined || b === undefined) return leaves(a === undefined ? b : a);
    if (typeof a === 'number' || typeof b === 'number') return a === b ? 0 : 1;
    var n = 0;
    for (var i = 0; i < Math.max(a.length, b.length); i++) n += countDiffs(a[i], b[i]);
    return n;
  }
  function leaves(x) {
    if (typeof x === 'number') return 1;
    var n = 0; for (var i = 0; i < x.length; i++) n += leaves(x[i]); return n;
  }
  function ulps(a, b) {                   // how many representable doubles apart
    if (a === b) return 0;
    var e = Math.floor(Math.log(Math.abs(b)) / Math.LN2);
    return Math.round(Math.abs(a - b) / Math.pow(2, e - 52));
  }

  function run() {
    var t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    var r180 = KEYS.k180.map(function (c) {
      var got = distance_lat_long.apply(null, c.args);
      return { args: c.args, got: got, key: c.key, pass: got === c.key, ulps: ulps(got, c.key) };
    });
    var r493 = KEYS.k493.map(function (c) {
      var got = calculate_polygons.apply(null, c.args);
      return { args: c.args, pass: sameExactly(got, c.key), coords_off: countDiffs(got, c.key),
               hexagons: got.length, key_hexagons: c.key.length };
    });
    var p180 = r180.filter(function (x) { return x.pass; }).length;
    var p493 = r493.filter(function (x) { return x.pass; }).length;
    var tan = Math.tan(Math.PI / 6);
    return {
      t180: { passed: p180, of: r180.length, cases: r180 },
      t493: { passed: p493, of: r493.length, cases: r493 },
      all_pass: p180 === r180.length && p493 === r493.length,
      tan_pi_6: String(tan),
      // Behavioural fingerprint of the math library, not the user agent:
      // Apple libm returns ...256 for tan(pi/6); glibc and V8's fdlibm return ...257.
      libm: tan === 0.5773502691896256 ? 'apple' : (tan === 0.5773502691896257 ? 'fdlibm/glibc' : 'other'),
      ms: Math.round(((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0) * 100) / 100
    };
  }

  var api = { run: run, distance_lat_long: distance_lat_long, calculate_polygons: calculate_polygons, KEYS: KEYS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.MBPP = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
