(() => {
const root = document.documentElement;
const sysReduce = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => sysReduce.matches || root.classList.contains('force-still');
const shortMQ = matchMedia('(max-height: 520px), (max-width: 260px)');
const short = () => shortMQ.matches;
const tapeStill = () => still() || short();
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const themeMeta = $('meta[name="theme-color"]:not([media])'), NIGHT = themeMeta ? themeMeta.content : '#030d25';
let ground = '', lightGround = '', themeNow = '';
function setThemeColour(over, light) {
if (!themeMeta) return;
if (!ground) { ground = getComputedStyle(document.body).backgroundColor; const ls = $('.reveal[data-theme="light"]'); lightGround = ls ? getComputedStyle(ls).backgroundColor : ground; }
const c = over ? NIGHT : light ? lightGround : ground;
if (c !== themeNow) { themeMeta.content = c; themeNow = c; }
}
const nav = $('#nav'), mb = $('.menu-btn', nav), hero = $('.hero');
const lightScene = $('.reveal[data-theme="light"]');
const setNav = (hr = hero.getBoundingClientRect(), lr = lightScene && lightScene.getBoundingClientRect()) => {
const over = hr.bottom > 68, open = nav.classList.contains('open');
nav.classList.toggle('navy', over && !open);
const light = !!lr && !over && lr.top <= 68 && lr.bottom > 68;
if (light) nav.dataset.theme = 'light'; else delete nav.dataset.theme;
nav.classList.toggle('solid', !over || scrollY > 24);
setThemeColour(over && !open, light);
};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { ground = ''; setNav(); });
addEventListener('resize', () => setNav()); setNav();
mb.addEventListener('click', () => { const o = !nav.classList.contains('open'); nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Close menu' : 'Menu'); setNav(); });
$$('#menu a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Menu'); setNav(); }));
const chain = $('#chain'), hint = $('#hint'), stacked = matchMedia('(max-width: 1000px)');
const mark = (o, word) => { const s = document.createElement('span'); s.className = 'vh'; s.textContent = `, ${word}`; o.append(s); };
$$('.opt', chain).forEach(b => b.addEventListener('click', () => {
if (chain.classList.contains('answered')) return;
const ok = b.dataset.ok === '1', right = $('.opt[data-ok="1"]', chain);
b.classList.add(ok ? 'right' : 'wrong');
if (!ok) { right.classList.add('right'); mark(b, 'your answer, wrong'); }
mark(right, ok ? 'your answer, right' : 'the right answer');
chain.classList.add('answered');
$$('.opt', chain).forEach(o => o.setAttribute('aria-disabled', 'true'));
hint.textContent = 'Read why below.'; // the page never scrolls under the reader's thumb
}));
$$('.refrow', chain).forEach(r => r.addEventListener('click', () => r.setAttribute('aria-expanded', r.getAttribute('aria-expanded') !== 'true')));
$$('a[href="#try"]').forEach(a => a.addEventListener('click', () => {
if (!chain.classList.contains('answered')) requestAnimationFrame(() => $('.opt', chain).focus({ preventScroll: true }));
}));
const SLOTS = [], T = [], S = [];
const pad = k => { for (let n = 0; n < k; n++) SLOTS.push({ label: '', cls: 'tick' }); };
pad(3);
$$('#chapters > li').forEach((sl, k) => {
if (k > 0) SLOTS.push({ label: '', cls: 'gap' });
const sec = { name: sl.dataset.sec, q: +sl.dataset.q, a: T.length };
$$('ul > li', sl).forEach(li => { T.push({ n: li.dataset.n, name: li.childNodes[1].textContent.trim(), k, slot: SLOTS.length }); SLOTS.push({ label: li.dataset.n, stop: true }); });
sec.b = T.length - 1; S.push(sec);
});
pad(3);
const END = T.length - 1;
const slotAt = pos => { pos = Math.min(END, Math.max(0, pos)); const a = Math.min(END, Math.floor(pos)), b = Math.min(END, a + 1), f = pos - a; return T[a].slot + (T[b].slot - T[a].slot) * f; };
function drum(el) {
const ol = $('.drum', el); ol.textContent = '';
const items = SLOTS.map((s, i) => { const li = document.createElement('li'); li.textContent = s.label; if (s.cls) li.className = s.cls; ol.append(li); return { li, at: i, chapter: !!s.stop }; });
let mh = 0, mrad = 0, mstep = 0;
addEventListener('resize', () => { mh = 0; });
return pos => {
if (!mh) {
const oh = items.find(x => x.chapter).li.offsetHeight, hh = oh || 56;
mrad = Math.max((hh / 2) / Math.tan(10 * Math.PI / 180), Math.min(el.clientHeight, 640) * .46);
mstep = 2 * Math.atan((hh / 2) / mrad) * 180 / Math.PI; mh = oh;
}
const sp = slotAt(pos), rad = mrad, STEP = mstep;
for (const { li, at, chapter } of items) {
const a = (sp - at) * STEP;
if (Math.abs(a) > 84) { li.style.opacity = 0; li.style.transform = 'none'; li.classList.remove('on'); continue; }
li.style.transform = `perspective(900px) translateZ(${-rad}px) rotateX(${a}deg) translateZ(${rad}px)`;
li.style.opacity = (1 - Math.abs(a) / 96).toFixed(3);
li.classList.toggle('on', chapter && Math.abs(a) < STEP / 4);
}
};
}
const heroTape = $('#hero-tape'), hero22 = drum(heroTape), AP = T.findIndex(t => t.n === '22'), DOORS = T.findIndex(t => t.n === '52');
const line = $('.line', heroTape);
let rolling = false;
function rollHero() {
if (still()) { hero22(AP); return; }
const t0 = performance.now() + 350, D = 1500;
rolling = true;
const run = now => { const k = Math.min(1, Math.max(0, now - t0) / D); hero22(AP * (1 - Math.pow(1 - k, 4))); if (k < 1) requestAnimationFrame(run); else { rolling = false; descentFrame(); } };
hero22(0); requestAnimationFrame(run);
line.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 420, delay: D + 230, easing: 'cubic-bezier(.23, 1, .32, 1)', fill: 'backwards' });
}
if (navigator.connection && navigator.connection.saveData) root.classList.add('save-data');
const descent = $('.descent'), photo = $('.hero-photo img'), heroWords = $('.hero .text');
const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
const descentPos = (y, span) => AP + (DOORS - AP) * sm((y / span - .1) / .75);
function descentFrame(r) {
if (still() || root.classList.contains('save-data')) { photo.style.transform = heroWords.style.transform = heroWords.style.opacity = ''; return; }
r = r || descent.getBoundingClientRect(); const span = r.height - innerHeight;
if (span <= 0 || r.bottom < 0) return;
const p = Math.min(1, Math.max(0, -r.top / span));
photo.style.transform = `scale(${(1 + .3 * sm(p)).toFixed(4)})`;
heroWords.style.transform = `translateY(${(-60 * p).toFixed(1)}px)`;
heroWords.style.opacity = Math.max(0, 1 - p * 2).toFixed(3);
if (!rolling) hero22(descentPos(-r.top, span));
}
const rev = $('#how');
const pulse = scope => $$('.hl', scope).forEach(h => { h.classList.remove('on'); void h.offsetWidth; h.classList.add('on'); });
if ('IntersectionObserver' in window) {
const io = new IntersectionObserver(es => es.forEach(e => {
if (!e.isIntersecting) return;
io.unobserve(e.target);
if ($('.hl', e.target)) pulse(e.target);
}), { rootMargin: '0px 0px -12% 0px', threshold: .15 });
$$('.static li', rev).forEach(li => io.observe(li));
}
const pin = $('.pin', rev), film = $('.film', rev), fpl = $('.fpl', rev);
const ac = $('.ac', fpl), flown = $('.flown', fpl), wps = $$('.wp', fpl), minis = $$('.mini p', rev), filmHl = $('.hl', film);
const wide = matchMedia('(min-width: 701px)');
let hlLit = false, a0 = 0, a1 = 0;
const track = $('.track', fpl);
function layoutFpl() {
if (wide.matches) {
a0 = wps[0].offsetTop + 11.5; a1 = wps[3].offsetTop + 11.5;
for (const el of [track, flown]) { el.style.left = ''; el.style.width = ''; el.style.top = a0 + 'px'; el.style.bottom = 'auto'; el.style.height = (a1 - a0) + 'px'; }
} else {
a0 = wps[0].offsetLeft + 6.5; a1 = wps[3].offsetLeft + wps[3].offsetWidth - 6.5;
for (const el of [track, flown]) { el.style.top = ''; el.style.bottom = ''; el.style.height = ''; el.style.left = a0 + 'px'; el.style.right = 'auto'; el.style.width = (a1 - a0) + 'px'; }
}
}
addEventListener("resize", layoutFpl); addEventListener("load", layoutFpl); layoutFpl();
function revealFrame(r) {
if (root.classList.contains('save-data') || short()) return;
r = r || pin.getBoundingClientRect(); if (r.bottom < -50 || r.top > innerHeight + 50) return;
const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))), t = p * 3;
const pan = t;
film.style.transform = `translateX(${(-pan * 100).toFixed(2)}%)`;
const c = a0 + (a1 - a0) * p - 12;
if (wide.matches) { ac.style.transform = `translateY(${c.toFixed(1)}px)`; flown.style.transform = `scaleY(${p.toFixed(4)})`; }
else { ac.style.transform = `translateX(${c.toFixed(1)}px) rotate(-90deg)`; flown.style.transform = `scaleX(${p.toFixed(4)})`; }
const near = Math.round(t);
wps.forEach((w, i) => { w.classList.toggle('on', i === near); w.classList.toggle('past', i < near); w.classList.toggle('at', i === near && Math.abs(t - near) < .2); });
minis.forEach((m, i) => { const d = i - t; m.style.transform = `translateY(${(d * 70).toFixed(1)}px)`; m.style.opacity = Math.min(1, Math.max(0, 1 - Math.abs(d) * 1.8)).toFixed(3); });
if (Math.abs(pan - 2) < .02 && !hlLit) { pulse(film); hlLit = true; }
if (Math.abs(pan - 2) > .3 && hlLit) { hlLit = false; filmHl.classList.remove('on'); }
}
const ppPin = $('.pp-pin'), pair = $('.pp .pair'), BOX = JSON.parse(pair.dataset.boxes), ppBoxes = $$('.pp .box'), srcs = $$('.pp .srcs li');
let boxSize = [];
const measureBoxes = () => { boxSize = ppBoxes.map(b => [b.clientWidth, b.clientHeight]); };
const place = (k, r) => { const box = ppBoxes[k], [W, H] = boxSize[k]; box.firstElementChild.style.transform = `translate(${(r[0] / 100 * W).toFixed(1)}px, ${(r[1] / 100 * H).toFixed(1)}px) scale(${(r[2] / 100 * W / 100).toFixed(4)}, ${(r[3] / 100 * H / 100).toFixed(4)})`; };
function panelFrame(r) {
if (root.classList.contains('save-data') || short()) return;
r = r || ppPin.getBoundingClientRect(); if (r.bottom < -50 || r.top > innerHeight + 50) return;
if (!boxSize.length || !boxSize[0][0]) measureBoxes();
const t = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))) * 3, k = Math.min(2, Math.floor(t)), f = t - k;
const mix = (a, b) => a.map((v, i) => v + (b[i] - v) * f);
place(0, mix(BOX[k].photo, BOX[k + 1].photo)); place(1, mix(BOX[k].drawn, BOX[k + 1].drawn));
const on = Math.round(t); srcs.forEach((l, i) => l.classList.toggle('on', i === on));
}
const remeasure = () => { measureBoxes(); panelFrame(); };
addEventListener('load', remeasure); addEventListener('resize', remeasure); $$('.pp img').forEach(i => i.addEventListener('load', remeasure));
const feats = $$('.flist .feat-i'), slides = $$('.fframe .slide'), fbox = $('.idx .rb');
let fcur = -1;
function featFrame(tops = feats.map(li => li.getBoundingClientRect().top)) {
let k = 0; const mid = innerHeight / 2;
tops.forEach((t, i) => { if (t < mid) k = i; });
if (k === fcur) return;
const down = k > fcur; fcur = k;
feats.forEach((li, i) => li.classList.toggle('on', i === k));
slides.forEach((sl, i) => { sl.classList.toggle('on', i === k); sl.classList.toggle('up', i !== k && down && i < k); });
fbox.style.transform = `translateY(${k * 100}%)`;
}
addEventListener('resize', () => featFrame()); featFrame();
const devs = $('.acct .devs'), dlink = $('.link', devs);
if ('IntersectionObserver' in window && devs) {
const io2 = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io2.disconnect(); if (dlink) dlink.style.setProperty('--len', dlink.offsetWidth + 'px'); devs.classList.add('in'); }), { threshold: .4 });
io2.observe(devs);
} else if (devs) devs.classList.add('in');
const picks = $$('.picks .pick'), ring = $('.picks .ring'), cn = $('.chosen .cn'), cn2 = $('.chosen .cn2'), sub = $('.chosen a.sub');
let curPick = picks.find(p => p.getAttribute('aria-checked') === 'true');
const evenPicks = () => { picks.forEach(p => { p.style.minHeight = ''; }); const h = Math.max(...picks.map(p => p.offsetHeight)); picks.forEach(p => { p.style.minHeight = h + 'px'; }); };
const placeRing = () => { if (!curPick) return; ring.style.transform = `translateY(${curPick.offsetTop}px)`; ring.style.height = curPick.offsetHeight + 'px'; };
const choose = p => { curPick = p; picks.forEach(x => { x.setAttribute('aria-checked', x === p); x.tabIndex = x === p ? 0 : -1; }); placeRing(); cn.textContent = `${p.dataset.name}, ${p.dataset.price}`; if (cn2) cn2.textContent = p.dataset.name; if (sub) sub.href = sub.getAttribute('href').replace(/plan=\w+$/, `plan=${p.dataset.m}m`); };
picks.forEach((p, i) => {
p.tabIndex = p === curPick ? 0 : -1;
p.addEventListener('click', () => choose(p));
p.addEventListener('keydown', e => { const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return; e.preventDefault(); const n = picks[(i + d + picks.length) % picks.length]; choose(n); n.focus(); });
});
const layoutPicks = () => { evenPicks(); placeRing(); };
addEventListener('resize', layoutPicks); addEventListener('load', layoutPicks); if (document.fonts) document.fonts.ready.then(layoutPicks); layoutPicks();
const more6 = $('.plans .more6');
if (more6) more6.addEventListener('click', () => { const full = more6.closest('.full'); full.classList.add('all'); more6.setAttribute('aria-expanded', 'true'); const first = $('.incl .extra', full); if (first) { first.tabIndex = -1; first.focus({ preventScroll: true }); } });
const faqIx = $('.faq-ix'), faqItems = $$('.faq-list details');
if (faqIx && faqItems.length) {
const QA = faqItems.map(d => [d.querySelector('summary').textContent.trim(), d.querySelector('p').innerHTML]);
faqIx.innerHTML = `<div class="qsw"><span class="mk" aria-hidden="true"></span><ul class="qs" role="tablist" aria-label="Questions" aria-orientation="vertical">${QA.map((q, i) => `<li role="presentation"><button type="button" role="tab" id="faq-t${i}" aria-controls="faq-panel" aria-selected="${!i}" tabindex="${i ? -1 : 0}">${q[0]}</button></li>`).join('')}</ul></div>` +
`<div class="panel" id="faq-panel" role="tabpanel" aria-labelledby="faq-t0" tabindex="0"><div class="pg"><h3>${QA[0][0]}</h3><p>${QA[0][1]}</p></div></div>`;
faqIx.hidden = false;
const tabs = $$('button', faqIx), mk = $('.mk', faqIx), panel = $('.panel', faqIx), pg = $('.pg', faqIx);
let qi = 0;
const mark = () => { const b = tabs[qi]; mk.style.transform = `translateY(${b.parentNode.offsetTop}px)`; mk.style.height = b.offsetHeight + 'px'; };
const show = (i, focus) => {
if (i === qi) return; const dir = focus ? '' : i > qi ? 'from-down' : 'from-up'; qi = i;
tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
panel.setAttribute('aria-labelledby', tabs[i].id); mark();
pg.className = 'pg'; pg.innerHTML = `<h3>${QA[i][0]}</h3><p>${QA[i][1]}</p>`; void pg.offsetWidth; if (dir) pg.classList.add(dir);
if (focus) tabs[i].focus();
};
tabs.forEach((t, i) => {
t.addEventListener('click', () => show(i));
t.addEventListener('keydown', e => { const d = { ArrowDown: 1, ArrowUp: -1, ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); show((qi + d + tabs.length) % tabs.length, true); } if (e.key === 'Home') show(0, true); if (e.key === 'End') show(tabs.length - 1, true); });
});
addEventListener('resize', mark); addEventListener('load', mark); mark();
}
const closeSec = $('#close'), dawn = $('.dawn', closeSec);
function dawnFrame(r) {
if (root.classList.contains('save-data')) return;
r = r || closeSec.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return;
const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight * .3)));
dawn.style.opacity = (p * p).toFixed(3);
}
const sec = $('#topics'), ro = $('#readout'), cnt = $('#tape-count'), N = S.length;
const CODES = { 'Systems': 'ATA chapters, <span class="code">21</span> to <span class="code">70</span>', 'Limitations': 'FCOM part <span class="code">LIM</span>', 'Procedures': 'FCOM part <span class="code">PRO</span>', 'Weather': 'EASA ATPL subject <span class="code">050</span>', 'General aviation': 'Codes: <span class="code">PERF</span>, <span class="code">ATC</span>, <span class="code">ABBR</span>, <span class="code">MATH</span>', 'ATPL revision': 'EASA ATPL subject numbers' };
const num = n => n.toLocaleString('en-GB').replace(',', ' ');
const LEN = [], CUM = [0], KN = [];
const layoutTape = () => {
const ph = innerWidth <= 900 ? .75 : 1;
S.forEach((s, k) => { LEN[k] = Math.round(Math.max(180, 22 * (s.b - s.a + 1)) * ph); CUM[k + 1] = CUM[k] + LEN[k]; });
if (!tapeStill()) sec.style.height = `calc(100svh + ${CUM[S.length]}px)`; else sec.style.height = '';
KN.length = 0;
S.forEach((s, k) => { const n = s.b - s.a + 1; for (let j = 0; j < n; j++) KN.push([CUM[k] + LEN[k] * (.12 + (n > 1 ? .62 * j / (n - 1) : 0)), s.a + j]); });
sec.dataset.stops = JSON.stringify(CUM);
};
const tapePos = y => {
if (y <= KN[0][0]) return KN[0][1];
for (let i = 1; i < KN.length; i++) if (y <= KN[i][0]) { const [y0, p0] = KN[i - 1], [y1, p1] = KN[i]; return p0 + (p1 - p0) * (y - y0) / (y1 - y0); }
return KN[KN.length - 1][1];
};
S.forEach((s, k) => {
const n = s.b - s.a + 1;
ro.insertAdjacentHTML('beforeend', `<div class="t"><p class="sec"><b>${k + 1} of ${N}</b> · ${n === 1 ? '1 topic' : n + ' topics'}</p><p class="name">${s.name}</p>` +
`<p class="meta"><span class="qn"><b>${num(s.q)}</b> questions</span><span>${CODES[s.name] || ''}</span></p>` +
`<p class="tops">${T.slice(s.a, s.b + 1).map((t, j) => `<span data-i="${s.a + j}">${t.name.replace(/, /g, ' / ')}</span>`).join('')}</p>` +
`<p class="steps">${S.map((x, j) => `<i class="${j === k ? 'on' : ''}"></i>`).join('')}</p></div>`);
});
layoutTape(); addEventListener('resize', layoutTape);
const reads = $$('.t', ro), tops = $$('.tops span', ro), topics = drum($('#topics-tape'));
const ctr = $('.ctr', ro), digits = $('.digits', ctr), cols = [];
for (let i = 0; i < 4; i++) {
if (i === 1) { const g = document.createElement('span'); g.className = 'gap'; digits.append(g); }
const c = document.createElement('span'); c.className = 'col'; c.innerHTML = Array.from({ length: 10 }, (_, d) => `<span>${d}</span>`).join(''); digits.append(c); cols.push(c);
}
function counter(s) {
const v = String(s.q).padStart(4, '0'); ctr.dataset.value = s.q;
const t = reads[S.indexOf(s)], st = t && $('.steps', t);
ctr.style.transform = st && !matchMedia('(min-width: 901px)').matches ? `translateY(${st.offsetTop + st.offsetHeight + 14}px)` : '';
cols.forEach((c, i) => { c.style.transform = `translateY(${-(+v[i])}em)`; const hide = (i === 0 && s.q < 1000) || (i === 1 && s.q < 100); c.classList.toggle('off', hide); if (i === 0) $('.gap', digits).classList.toggle('off', hide); });
}
counter(S[0]);
if (document.fonts) document.fonts.ready.then(() => counter(S[Math.max(0, lastSec)]));
let last = -2, lastSec = -1, lit = -1;
function follow() { const el = tops[lit], box = el.parentNode, over = box.scrollHeight > box.clientHeight + 1; box.classList.toggle('clip', over); if (over) box.scrollTop = el.offsetTop - box.clientHeight / 2 + el.offsetHeight / 2; }
function tapeFrame(r) {
r = r || sec.getBoundingClientRect(); if (r.bottom < -50 || r.top > innerHeight + 50) return;
const y = Math.min(CUM[N] - 1e-3, Math.max(0, -r.top));
let k = 0; while (k < N - 1 && y >= CUM[k + 1]) k++;
const f = (y - CUM[k]) / LEN[k], nx = S[k + 1];
const pos = tapePos(y);
topics(pos);
const near = Math.round(pos), shown = f > .9 && nx ? k + 1 : k;
if (shown !== last) { reads.forEach((el, i) => { el.classList.toggle('on', i === shown); el.classList.toggle('up', i < shown); }); last = shown; }
if (T[near].k !== lastSec) { lastSec = T[near].k; cnt.textContent = `Section ${lastSec + 1} of ${N}`; counter(S[lastSec]); }
if (near !== lit) { tops.forEach(el => el.classList.toggle('lit', +el.dataset.i === near)); lit = near; follow(); }
}
const SCENES = [
{ el: descent, on: () => !root.classList.contains('save-data') && !rolling, pos: descentPos },
{ el: pin, on: () => !root.classList.contains('save-data') && !short(), pos: (y, span) => 3 * y / span },
{ el: ppPin, on: () => !root.classList.contains('save-data') && !short(), pos: (y, span) => 3 * y / span },
{ el: sec, on: () => !tapeStill(), span: () => CUM[N], pos: y => tapePos(y) },
];
const pick = (p, dir, eps = 1e-3) => { const lo = Math.floor(p + eps), hi = Math.ceil(p - eps); return hi <= lo ? null : dir > 0 ? hi : dir < 0 ? lo : p - lo < hi - p ? lo : hi; };
const spring = (t, response) => { const w = 2 * Math.PI / response; return 1 - (1 + w * t) * Math.exp(-w * t); };
let userAt = -1e9, touching = false, held = false, dir = 0, prevY = scrollY, quiet = 0, glide = 0;
const stopGlide = () => { if (glide) cancelAnimationFrame(glide); glide = 0; };
const input = () => { userAt = performance.now(); stopGlide(); clearTimeout(quiet); };
const own = () => performance.now() - userAt < 4000; // the scroll still follows the reader's own input (iOS momentum runs ~3 s)
const later = () => { clearTimeout(quiet); quiet = setTimeout(settle, 160); };
addEventListener('wheel', input, { passive: true });
addEventListener('touchstart', () => { touching = true; input(); }, { passive: true });
addEventListener('touchmove', () => { userAt = performance.now(); }, { passive: true });
const lift = e => { if (!e.touches.length) { touching = false; later(); } };
addEventListener('touchend', lift, { passive: true }); addEventListener('touchcancel', lift, { passive: true });
addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') held = true; input(); }, { passive: true });
addEventListener('pointerup', () => { if (held) { held = false; if (own()) later(); } }, { passive: true });
addEventListener('keydown', e => { stopGlide(); if (/^(Arrow(Up|Down)|Page(Up|Down)|Home|End| )$/.test(e.key)) userAt = performance.now(); });
addEventListener('scroll', () => {
const y = scrollY;
if (glide) { prevY = y; return; }
if (y !== prevY) { if (own()) dir = Math.sign(y - prevY); prevY = y; }
if (own() && !touching) later();
}, { passive: true });
function settle() {
quiet = 0;
if (still() || touching || held || glide) return;
const y = scrollY;
for (const s of SCENES) {
if (!s.on()) continue;
const r = s.el.getBoundingClientRect(), span = s.span ? s.span() : r.height - innerHeight, at = -r.top;
if (!(span > 0) || at <= 0 || at >= span) continue;
const p = s.pos(at, span), eps = Math.max(1e-3, Math.abs(s.pos(Math.min(span, at + 1.5), span) - s.pos(Math.max(0, at - 1.5), span)) / 2);
const want = pick(p, dir, eps);
if (want === null) return;
const up = want > p;
let a = 0, b = span;
for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (up ? s.pos(m, span) >= want - 1e-6 : s.pos(m, span) > want + 1e-6) b = m; else a = m; }
glideTo(y + (up ? b : a) - at);
return;
}
}
function glideTo(to) {
const from = scrollY, d = to - from;
if (Math.abs(d) < 1) return;
if (sysReduce.matches) { scrollTo(0, to); return; } // Reduce Motion: the page rests on the point at once
const response = Math.min(.55, .3 + Math.abs(d) / 1600), t0 = performance.now();
let set = from;
const step = now => {
if (Math.abs(scrollY - set) > 2) { glide = 0; return; } // the reader moved the page: it is theirs again
const k = spring((now - t0) / 1000, response), done = Math.abs(d) * (1 - k) < .5;
set = done ? to : from + d * k; scrollTo(0, set);
glide = done ? 0 : requestAnimationFrame(step);
};
glide = requestAnimationFrame(step);
}
let raf = 0, live = false;
const frame = () => {
raf = 0;
const run = !still(), rest = short();
const hr = hero.getBoundingClientRect(), lr = lightScene && lightScene.getBoundingClientRect(), ft = feats.map(li => li.getBoundingClientRect().top);
const dr = run && descent.getBoundingClientRect(), cr = run && closeSec.getBoundingClientRect();
const pr = run && !rest && pin.getBoundingClientRect(), ppr = run && !rest && ppPin.getBoundingClientRect(), tr = run && !rest && sec.getBoundingClientRect();
setNav(hr, lr); featFrame(ft);
if (!run) return;
descentFrame(dr); if (!rest) { revealFrame(pr); panelFrame(ppr); tapeFrame(tr); } dawnFrame(cr);
};
const req = () => { if (!raf) raf = requestAnimationFrame(frame); };
function setMode() {
const s = still();
root.classList.toggle('no-motion', s);
root.classList.toggle('short', short());
if (!live) { addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); live = true; }
layoutTape();
if (s) { hero22(AP); $$('.hl').forEach(h => h.classList.add('on')); descentFrame(); dawn.style.opacity = ''; }
else frame();
}
sysReduce.addEventListener('change', setMode); shortMQ.addEventListener('change', setMode);
setMode();
rollHero();
})();
