// node stage/probe-cli.cjs   |   bun stage/probe-cli.cjs
const M = require('../probe.js');
const r = M.run();
const eng = typeof Bun !== 'undefined' ? `bun ${Bun.version} (JavaScriptCore)` : `node ${process.version} (V8)`;
const pad = s => String(s).padEnd(22);
console.log(`\n  runtime      ${eng}`);
console.log(`  tan(pi/6)    ${r.tan_pi_6}`);
const c = r.t180.cases[0];
console.log(`\n  Mbpp/180     distance_lat_long(${c.args.join(', ')})`);
console.log(`  answer key   ${c.key}`);
console.log(`  this runtime ${c.got}`);
console.log(`\n  task 180     ${r.t180.passed}/${r.t180.of} asserts   ${r.t180.passed === r.t180.of ? 'PASS' : 'FAIL'}`);
console.log(`  task 493     ${r.t493.passed}/${r.t493.of} asserts   ${r.t493.passed === r.t493.of ? 'PASS' : 'FAIL'}\n`);
