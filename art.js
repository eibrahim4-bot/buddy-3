// Cute full-body animal buddies drawn as SVG (no image files needed).
// Moods: happy, okay, sad, panic, fainted, sleeping.  buddySVG(id, mood, {acc, hue}) returns an <svg> string.
// To add an animal: draw it with mam({...}) or write a small function, add it to ANIMALS and ANIMAL_IDS (shared.js).

const E = (x, y, rx, ry, f, a) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '" ' + (a || '') + '/>';
const Ci = (x, y, r, f, a) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '" ' + (a || '') + '/>';
const Pa = (d, f, a) => '<path d="' + d + '" fill="' + f + '" ' + (a || '') + '/>';
const St = (d, c, w) => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
const P = c => 'fill="none" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"';
const WH = c => St('M44 76 L26 72 M44 79 L26 82 M76 76 L94 72 M76 79 L94 82', c, 1.3);

function face(m, o) {
  const x1 = 60 - o.d, x2 = 60 + o.d, y = o.y, e = o.ec, b = o.bc || e;
  let t = '';
  if (m === 'happy' || m === 'sleeping') {
    const c = m === 'happy' ? y - 6 : y + 6;
    t += '<path d="M' + (x1 - 5) + ' ' + (y + 1) + ' Q' + x1 + ' ' + c + ' ' + (x1 + 5) + ' ' + (y + 1) + ' M' + (x2 - 5) + ' ' + (y + 1) + ' Q' + x2 + ' ' + c + ' ' + (x2 + 5) + ' ' + (y + 1) + '" ' + P(e) + '/>';
  } else if (m === 'fainted') {
    t += '<path d="M' + (x1 - 4) + ' ' + (y - 4) + ' L' + (x1 + 4) + ' ' + (y + 4) + ' M' + (x1 + 4) + ' ' + (y - 4) + ' L' + (x1 - 4) + ' ' + (y + 4) + ' M' + (x2 - 4) + ' ' + (y - 4) + ' L' + (x2 + 4) + ' ' + (y + 4) + ' M' + (x2 + 4) + ' ' + (y - 4) + ' L' + (x2 - 4) + ' ' + (y + 4) + '" ' + P(e) + '/>';
  } else if (m === 'panic') {
    const ring = 'stroke="' + e + '" stroke-width="1.2"';
    t += Ci(x1, y + 1, 5, '#fff', ring) + Ci(x2, y + 1, 5, '#fff', ring) + Ci(x1, y + 1, 2.2, '#2b2b2b') + Ci(x2, y + 1, 2.2, '#2b2b2b');
    t += '<path d="M' + (x1 - 6) + ' ' + (y - 6) + ' L' + (x1 + 6) + ' ' + (y - 11) + ' M' + (x2 - 6) + ' ' + (y - 11) + ' L' + (x2 + 6) + ' ' + (y - 6) + '" ' + P(b) + '/>';
    t += Pa('M' + (x2 + 13) + ' ' + (y - 8) + ' Q' + (x2 + 18) + ' ' + (y - 1) + ' ' + (x2 + 13) + ' ' + (y + 3) + ' Q' + (x2 + 8) + ' ' + (y - 1) + ' ' + (x2 + 13) + ' ' + (y - 8) + 'Z', '#85B7EB');
  } else {
    t += Ci(x1, y + 1, 3.3, e) + Ci(x2, y + 1, 3.3, e);
    if (m === 'okay') t += '<path d="M' + (x1 - 5) + ' ' + (y - 6) + ' L' + (x1 + 5) + ' ' + (y - 6) + ' M' + (x2 - 5) + ' ' + (y - 6) + ' L' + (x2 + 5) + ' ' + (y - 6) + '" ' + P(b) + '/>';
    if (m === 'sad') t += '<path d="M' + (x1 - 6) + ' ' + (y - 5) + ' L' + (x1 + 6) + ' ' + (y - 10) + ' M' + (x2 - 6) + ' ' + (y - 10) + ' L' + (x2 + 6) + ' ' + (y - 5) + '" ' + P(b) + '/>' + E(x1 - 5, y + 11, 2.2, 3.4, '#85B7EB');
  }
  if (o.mouth === false) return t;
  const my = o.my, w = o.mw, c = o.mc, a = 60 - w, d = 60 + w, pk = '#F28CA0';
  if (m === 'happy') t += '<path d="M' + a + ' ' + my + ' Q60 ' + (my + 9) + ' ' + d + ' ' + my + '" ' + P(c) + '/>' + E(60, my + 6, 4.2, 5, pk);
  if (m === 'okay') t += '<path d="M' + a + ' ' + my + ' L' + d + ' ' + my + '" ' + P(c) + '/>';
  if (m === 'sad') t += '<path d="M' + a + ' ' + (my + 5) + ' Q60 ' + (my - 3) + ' ' + d + ' ' + (my + 5) + '" ' + P(c) + '/>';
  if (m === 'panic') t += E(60, my + 3, 4.5, 6, '#7a2c3a', 'stroke="' + c + '" stroke-width="1.4"');
  if (m === 'fainted') t += '<path d="M' + a + ' ' + my + ' L' + d + ' ' + my + '" ' + P(c) + '/>' + E(66, my + 5, 4, 5, pk);
  if (m === 'sleeping') t += '<path d="M54 ' + my + ' Q60 ' + (my + 4) + ' 66 ' + my + '" ' + P(c) + '/>';
  return t;
}

function ears(o, m) {
  const e = o.e, i = o.ei || e, ol = o.ol ? 'stroke="' + o.ol + '" stroke-width="1.5"' : '', d = m === 'sad' ? 7 : 0;
  switch (o.et) {
    case 'round': return Ci(38, 40, 10, e, ol) + Ci(82, 40, 10, e, ol) + Ci(38, 40, 5, i) + Ci(82, 40, 5, i);
    case 'sm': return Ci(37, 42, 6.5, e, ol) + Ci(83, 42, 6.5, e, ol);
    case 'big': return Ci(32, 44, 14, e, ol) + Ci(88, 44, 14, e, ol) + Ci(32, 44, 8, i) + Ci(88, 44, 8, i);
    case 'point': return Pa('M38 50 L33 14 L58 38Z', e, ol) + Pa('M82 50 L87 14 L62 38Z', e, ol) + Pa('M40 44 L37 24 L50 38Z', i) + Pa('M80 44 L83 24 L70 38Z', i);
    case 'cat': return Pa('M38 48 L35 22 L57 38Z', e, ol) + Pa('M82 48 L85 22 L63 38Z', e, ol) + Pa('M40 44 L38 29 L51 38Z', i) + Pa('M80 44 L82 29 L69 38Z', i);
    case 'float': return Pa('M36 46 Q20 56 27 ' + (82 + d) + ' Q38 ' + (86 + d) + ' 42 66Z', e, ol) + Pa('M84 46 Q100 56 93 ' + (82 + d) + ' Q82 ' + (86 + d) + ' 78 66Z', e, ol);
    case 'fold': return Pa('M40 42 Q26 38 30 58 Q40 58 46 50Z', e, ol) + Pa('M80 42 Q94 38 90 58 Q80 58 74 50Z', e, ol);
    case 'long': return E(46, 22, 8, 25, e, ol + ' transform="rotate(-8 46 22)"') + E(74, 22, 8, 25, e, ol + ' transform="rotate(8 74 22)"') + E(46, 24, 4, 17, i, 'transform="rotate(-8 46 24)"') + E(74, 24, 4, 17, i, 'transform="rotate(8 74 24)"');
  }
  return '';
}

function tail(o) {
  const c = o.tc || o.b, bp = 'M84 116 Q116 112 108 74';
  switch (o.tail) {
    case 'dog': return St('M84 112 Q112 102 106 76', c, 12);
    case 'cat': return St('M86 118 Q114 118 110 84', c, 8);
    case 'bushy': return St(bp, c, 17) + (o.tt ? Ci(108, 76, 8.5, o.tt) : '');
    case 'ring': return St(bp, c, 16) + '<path d="' + bp + '" fill="none" stroke="' + o.rc + '" stroke-width="16" stroke-dasharray="5 8"/>';
    case 'puff': return Ci(88, 122, 9, c);
    case 'nub': return Ci(88, 124, 5.5, c);
    case 'lion': return St('M86 118 Q112 120 110 92', c, 6) + Ci(110, 90, 7, o.tt);
  }
  return '';
}

function nose(o) {
  const n = o.nc;
  switch (o.nt) {
    case 'tri': return Pa('M55.5 66 L64.5 66 L60 72Z', n);
    case 'big': return E(60, 66, 9, 6.5, n);
    case 'snout': return '<rect x="47" y="62" width="26" height="15" rx="7.5" fill="' + n + '"/>';
    case 'pig': return E(60, 77, 13, 9, n) + E(55, 77, 2, 3.2, '#B5586C') + E(65, 77, 2, 3.2, '#B5586C');
    case 'monkey': return E(57, 70, 1.4, 2, n) + E(63, 70, 1.4, 2, n);
  }
  return E(60, 68, 5.5, 3.8, n);
}

// Generic sitting four-legged animal: tail, body, legs, ears, head, muzzle, nose, face.
function mam(o, m) {
  const ol = o.ol ? 'stroke="' + o.ol + '" stroke-width="1.5"' : '', h = o.h || o.b, lc = o.lc || o.b, pc = o.pc || o.bl || o.b;
  const z = { sm: [73, 11, 8], md: [74, 15, 11], lg: [76, 17, 13] }[o.mzs || 'md'];
  return '<g class="' + (m === 'happy' ? 'wag' : '') + '">' + tail(o) + '</g>' +
    E(60, 108, 28, 26, o.b, ol) + (o.bodyX || '') + E(60, 116, 16, 17, o.bl || o.b) +
    '<rect x="46" y="112" width="9" height="22" rx="4.5" fill="' + lc + '"/><rect x="65" y="112" width="9" height="22" rx="4.5" fill="' + lc + '"/>' + E(50.5, 134, 8, 5, pc) + E(69.5, 134, 8, 5, pc) +
    (o.behind || '') + ears(o, m) + Ci(60, 62, 28, h, ol) + (o.headX || '') +
    (o.mz ? E(60, z[0], z[1], z[2], o.mz) : '') + nose(o) +
    face(m, { y: o.fy || 58, d: 11, my: o.my || 78, mw: 8, ec: o.ec || '#3b2a20', bc: o.bc, mc: o.mc || '#3b2a20' }) + (o.fx || '');
}

const bump = (m, x, y) => m === 'happy' ? Pa('M' + (x - 5) + ' ' + y + ' L' + (x + 5) + ' ' + y + ' L' + x + ' ' + (y + 8) + 'Z', '#E08A1A') : '';
function penguin(m) {
  return E(46, 138, 10, 5, '#F0A030') + E(74, 138, 10, 5, '#F0A030') + E(60, 102, 31, 35, '#2B2F3A') + E(60, 108, 20, 27, '#F4F4F2') +
    E(30, 104, 8, 20, '#2B2F3A', 'transform="rotate(12 30 104)"') + E(90, 104, 8, 20, '#2B2F3A', 'transform="rotate(-12 90 104)"') +
    Ci(60, 58, 24, '#2B2F3A') + E(50, 60, 9, 11, '#F4F4F2') + E(70, 60, 9, 11, '#F4F4F2') + Pa('M53 64 L67 64 L60 74Z', '#F0A030') + bump(m, 60, 71) +
    face(m, { y: 55, d: 10, ec: '#2b1d14', bc: '#9AA0B0', mouth: false });
}
function owl(m) {
  return E(50, 140, 7, 4, '#F0A030') + E(70, 140, 7, 4, '#F0A030') + E(60, 104, 32, 32, '#9A6B45') + E(60, 110, 21, 24, '#E9D3B4') +
    St('M52 98 Q55 101 58 98 M62 98 Q65 101 68 98 M52 108 Q55 111 58 108 M62 108 Q65 111 68 108 M57 118 Q60 121 63 118', '#B79A78', 1.6) +
    E(30, 106, 9, 22, '#7A5233', 'transform="rotate(10 30 106)"') + E(90, 106, 9, 22, '#7A5233', 'transform="rotate(-10 90 106)"') +
    Pa('M36 44 L32 22 L52 36Z', '#9A6B45') + Pa('M84 44 L88 22 L68 36Z', '#9A6B45') + Ci(60, 62, 28, '#9A6B45') +
    Ci(47, 60, 13, '#E9D3B4') + Ci(73, 60, 13, '#E9D3B4') + Ci(47, 60, 8, '#F0A030') + Ci(73, 60, 8, '#F0A030') + Pa('M56 68 L64 68 L60 77Z', '#D98A1E') +
    face(m, { y: 59, d: 13, ec: '#2b1d14', bc: '#7A5233', mouth: false });
}
function chicken(m) {
  const f = m === 'happy';
  return St('M88 96 Q110 84 104 60 M90 106 Q114 100 112 80', '#E9D9B8', 9) + St('M50 128 L50 141 M43 142 L57 142 M70 128 L70 141 M63 142 L77 142', '#F0A030', 3.5) +
    Ci(52, 35, 6, '#E24B4A') + Ci(60, 31, 7, '#E24B4A') + Ci(68, 35, 6, '#E24B4A') +
    E(60, 100, 31, 30, '#FFF1D6', 'stroke="#E4D6BC" stroke-width="2"') + E(60, 56, 23, 23, '#FFF1D6', 'stroke="#E4D6BC" stroke-width="2"') + E(60, 78, 15, 8, '#FFF1D6') +
    '<g class="' + (f ? 'fl' : '') + '">' + E(34, 102, 9, 17, '#F2E2BE', 'stroke="#E4D6BC" stroke-width="1.5"') + '</g><g class="' + (f ? 'fr' : '') + '">' + E(86, 102, 9, 17, '#F2E2BE', 'stroke="#E4D6BC" stroke-width="1.5"') + '</g>' +
    E(60, 79, 4, 5, '#E24B4A') + (f ? Pa('M55 71 L65 71 L60 79Z', '#E08A1A') : '') + Pa('M53 62 L67 62 L60 72Z', '#F0A030') +
    (f ? E(42, 63, 5, 3, '#F4B6B6', 'opacity=".8"') + E(78, 63, 5, 3, '#F4B6B6', 'opacity=".8"') : '') +
    face(m, { y: 51, d: 10, ec: '#2b1d14', mouth: false });
}
function duck(m) {
  const f = m === 'happy';
  return Pa('M40 140 L48 128 L58 140Z', '#F59B2B') + Pa('M62 140 L72 128 L80 140Z', '#F59B2B') + E(60, 104, 30, 28, '#FFD84A') +
    E(34, 106, 8, 15, '#F2C230', 'transform="rotate(10 34 106)"') + E(86, 106, 8, 15, '#F2C230', 'transform="rotate(-10 86 106)"') +
    St('M60 38 Q54 28 63 26', '#FFD84A', 4) + Ci(60, 60, 24, '#FFD84A') + E(60, 72, 15, 7.5, '#F59B2B') +
    (f ? E(60, 76, 10, 4, '#E08A1A') + E(42, 66, 5, 3, '#F4A0A0', 'opacity=".8"') + E(78, 66, 5, 3, '#F4A0A0', 'opacity=".8"') : '') +
    face(m, { y: 55, d: 11, ec: '#2b1d14', mouth: false });
}
function frog(m) {
  return E(32, 128, 12, 9, '#5BAE4A') + E(88, 128, 12, 9, '#5BAE4A') + E(26, 138, 11, 4.5, '#5BAE4A') + E(94, 138, 11, 4.5, '#5BAE4A') +
    E(60, 106, 30, 26, '#6BBF59') + E(60, 112, 19, 18, '#D6EDB0') + E(60, 64, 33, 25, '#6BBF59') + Ci(44, 44, 12, '#6BBF59') + Ci(76, 44, 12, '#6BBF59') + Ci(44, 44, 9, '#fff') + Ci(76, 44, 9, '#fff') +
    face(m, { y: 43, d: 16, ec: '#2b1d14', my: 73, mw: 17, mc: '#2F6B2A' });
}

const WOOL = 'stroke="#D9D3C7" stroke-width="1.5"';
// [id, name, sound, drawFn, accessory anchors {t: top of head, e: eye y, d: half eye distance}]
const ANIMALS = [
['retriever', 'Golden retriever', 'Woof!', m => mam({ b: '#E8A94A', h: '#EDB052', bl: '#F3C77A', e: '#C9812F', et: 'float', mz: '#F6D9A0', nc: '#3b2a20', tail: 'dog', tc: '#D9923A' }, m)],
['shepherd', 'German shepherd', 'Bark!', m => mam({ b: '#C98A3E', bl: '#D9A15A', pc: '#B8772F', e: '#C98A3E', ei: '#2E2A28', et: 'point', mz: '#4A3A30', nc: '#0f0b09', tail: 'dog', tc: '#2E2A28', bodyX: Pa('M36 100 Q60 80 84 100 Q82 118 60 120 Q38 118 36 100Z', '#2E2A28'), ec: '#2A1B12', mc: '#F6D9A0', my: 80 }, m)],
['corgi', 'Corgi', 'Yip!', m => mam({ b: '#E39A45', bl: '#fff', pc: '#fff', e: '#E39A45', ei: '#F3B0A0', et: 'point', mz: '#fff', nc: '#2b2b2b', tail: 'nub', headX: Pa('M60 36 Q50 54 53 66 L67 66 Q70 54 60 36Z', '#fff'), mc: '#2b2b2b' }, m)],
['husky', 'Husky', 'Awoo!', m => mam({ b: '#8E96A3', h: '#7C8491', bl: '#fff', pc: '#fff', e: '#7C8491', ei: '#3A3F47', et: 'point', mz: '#fff', nc: '#1f1f22', tail: 'bushy', tc: '#8E96A3', tt: '#fff', headX: Pa('M60 48 Q36 52 35 74 Q36 90 60 90 Q84 90 85 74 Q84 52 60 48Z', '#fff') }, m)],
['dalmatian', 'Dalmatian', 'Woof!', m => mam({ b: '#F4F1EA', ol: '#D9D3C7', e: '#2b2b2b', et: 'float', mz: '#F4F1EA', nc: '#1f1f22', tail: 'dog', tc: '#E8E2D6', bodyX: Ci(44, 98, 4, '#2b2b2b') + Ci(76, 96, 5, '#2b2b2b') + Ci(66, 106, 3.5, '#2b2b2b') + Ci(50, 112, 3, '#2b2b2b'), headX: Ci(46, 44, 4, '#2b2b2b') + Ci(76, 48, 5, '#2b2b2b') + Ci(66, 40, 3, '#2b2b2b') }, m)],
['pug', 'Pug', 'Snort!', m => mam({ b: '#D9B382', bl: '#EAD2AB', e: '#2e2622', et: 'fold', mz: '#3A3330', mzs: 'lg', nc: '#0a0a0a', tail: 'nub', mc: '#EAD2AB', my: 80, headX: St('M48 44 Q60 37 72 44', '#B58E5B', 2) + St('M51 50 Q60 45 69 50', '#B58E5B', 2) }, m)],
['tabby', 'Orange tabby', 'Meow!', m => mam({ b: '#EC9A4A', bl: '#FBE3C0', e: '#EC9A4A', ei: '#F2A9A0', et: 'cat', mz: '#FBE3C0', mzs: 'sm', nt: 'tri', nc: '#E58A8A', tail: 'cat', mc: '#7a3b1f', bodyX: St('M36 96 L45 99 M35 106 L44 107 M84 96 L75 99 M85 106 L76 107', '#C9702A', 3), headX: St('M60 36 L60 46 M52 38 L54 47 M68 38 L66 47', '#C9702A', 2.6), fx: WH('#fff') }, m)],
['blackcat', 'Black cat', 'Mrrp!', m => mam({ b: '#34303A', h: '#3B3643', bl: '#4A4552', e: '#34303A', ei: '#C98A9A', et: 'cat', mz: '#4A4552', mzs: 'sm', nt: 'tri', nc: '#C98A9A', tail: 'cat', ec: '#F6E27F', bc: '#8E889A', mc: '#8E889A', fx: WH('#9A94A6') }, m)],
['bunny', 'Bunny', 'Squeak!', m => mam({ b: '#F4EFEA', ol: '#D9D3C7', bl: '#fff', e: '#F4EFEA', ei: '#F4B6C2', et: 'long', mz: '#fff', mzs: 'sm', nc: '#F29AAE', tail: 'puff', tc: '#fff' }, m), { t: 38 }],
['fox', 'Fox', 'Yip yip!', m => mam({ b: '#E8742A', bl: '#fff', pc: '#3B2A22', e: '#E8742A', ei: '#2b2b2b', et: 'point', mz: '#fff', nc: '#1a1a1a', tail: 'bushy', tc: '#E8742A', tt: '#fff', headX: E(41, 73, 13, 10, '#fff') + E(79, 73, 13, 10, '#fff') }, m)],
['wolf', 'Wolf', 'Howl!', m => mam({ b: '#8C8F96', bl: '#D9D6CF', e: '#7E8189', ei: '#3a3a3f', et: 'point', mz: '#D9D6CF', mzs: 'lg', nc: '#111', tail: 'bushy', tc: '#7E8189', tt: '#B9B6B0' }, m)],
['panda', 'Panda', 'Munch!', m => mam({ b: '#F7F5F0', ol: '#D9D3C7', lc: '#2b2b2b', pc: '#2b2b2b', e: '#2b2b2b', et: 'round', mz: '#F7F5F0', mzs: 'sm', nc: '#2b2b2b', tail: 'nub', tc: '#F7F5F0', bodyX: Pa('M33 100 Q60 90 87 100 L86 112 Q60 103 34 112Z', '#2b2b2b'), headX: E(47, 59, 7.5, 9.5, '#2b2b2b', 'transform="rotate(22 47 59)"') + E(73, 59, 7.5, 9.5, '#2b2b2b', 'transform="rotate(-22 73 59)"'), ec: '#fff', bc: '#2b2b2b', mc: '#2b2b2b' }, m)],
['polarbear', 'Polar bear', 'Roar!', m => mam({ b: '#F4F8FB', ol: '#CFDCE6', bl: '#EAF1F6', e: '#F4F8FB', ei: '#DCE8F0', et: 'round', mz: '#EAF1F6', nc: '#1c1c1c', tail: 'nub' }, m)],
['brownbear', 'Brown bear', 'Grr!', m => mam({ b: '#8A5A3A', bl: '#B58560', e: '#8A5A3A', ei: '#B58560', et: 'round', mz: '#C9A27A', nc: '#1c1c1c', tail: 'nub', ec: '#1c1c1c' }, m)],
['koala', 'Koala', 'Zzz!', m => mam({ b: '#A7A9AD', h: '#B4B6BA', bl: '#E9E9EA', e: '#A7A9AD', ei: '#F2F2F2', et: 'big', nt: 'big', nc: '#2b2b2b', my: 81, mc: '#4a4a4a', ec: '#2b2b2b' }, m)],
['raccoon', 'Raccoon', 'Chitter!', m => mam({ b: '#8E8E96', bl: '#BDBDC4', e: '#8E8E96', ei: '#3B3B40', et: 'round', mz: '#EDEDF0', nc: '#1c1c1c', tail: 'ring', rc: '#3B3B40', headX: Pa('M33 54 Q60 42 87 54 L85 67 Q60 57 35 67Z', '#34343A'), ec: '#fff', bc: '#3B3B40', mc: '#3B3B40' }, m)],
['redpanda', 'Red panda', 'Chirp!', m => mam({ b: '#C4552B', h: '#C9602F', bl: '#3B2A22', lc: '#3B2A22', pc: '#3B2A22', e: '#C4552B', ei: '#fff', et: 'round', mz: '#fff', mzs: 'sm', nc: '#1c1c1c', tail: 'ring', rc: '#8E3A1C', headX: E(38, 69, 10, 8, '#fff') + E(82, 69, 10, 8, '#fff') + St('M47 63 L45 72 M73 63 L75 72', '#8E3A1C', 2.4), ec: '#2b1d14' }, m)],
['otter', 'Sea otter', 'Eek!', m => mam({ b: '#8B5E3C', h: '#9A6B45', bl: '#C9A27A', e: '#8B5E3C', et: 'sm', mz: '#E9D3B4', mzs: 'lg', nc: '#2b2b2b', tail: 'bushy', tc: '#7A5233', pc: '#7A5233', my: 79, mc: '#5a3f2a', fx: Ci(52, 73, 1, '#B79A78') + Ci(56, 75, 1, '#B79A78') + Ci(64, 75, 1, '#B79A78') + Ci(68, 73, 1, '#B79A78') }, m)],
['capybara', 'Capybara', 'Chill!', m => mam({ b: '#A97F58', h: '#B28A62', bl: '#C9A27A', e: '#8E6A48', et: 'sm', nt: 'snout', nc: '#5A4230', my: 83, mc: '#E9D3B4', fy: 56 }, m), { e: 57 }],
['pig', 'Pig', 'Oink!', m => mam({ b: '#F2A6B5', bl: '#F8C3CC', e: '#E88FA2', et: 'fold', nt: 'pig', nc: '#EE8FA3', tail: 'nub', my: 88, mc: '#B5586C' }, m)],
['cow', 'Cow', 'Moo!', m => mam({ b: '#F5F3EE', ol: '#D9D3C7', e: '#2b2b2b', et: 'float', mz: '#F8C3CC', mzs: 'lg', nc: '#C26B7C', tail: 'lion', tc: '#E5E0D6', tt: '#2b2b2b', behind: Pa('M42 46 Q34 28 46 24 Q47 36 52 42Z', '#E8D6A8') + Pa('M78 46 Q86 28 74 24 Q73 36 68 42Z', '#E8D6A8'), bodyX: E(42, 100, 9, 7, '#2b2b2b') + E(80, 108, 8, 9, '#2b2b2b'), headX: E(78, 46, 11, 8, '#2b2b2b'), mc: '#8E5560' }, m)],
['sheep', 'Sheep', 'Baa!', m => mam({ b: '#FAFAF7', h: '#4A4540', lc: '#4A4540', pc: '#4A4540', e: '#4A4540', et: 'fold', mz: '#5A544E', mzs: 'sm', nc: '#2b2b2b', tail: 'nub', tc: '#FAFAF7', bodyX: [[34, 104, 12], [86, 104, 12], [40, 90, 13], [80, 90, 13], [60, 86, 14], [44, 118, 10], [76, 118, 10]].map(c => Ci(c[0], c[1], c[2], '#FAFAF7', WOOL)).join(''), fx: Ci(50, 37, 9, '#FAFAF7', WOOL) + Ci(62, 33, 10, '#FAFAF7', WOOL) + Ci(73, 38, 9, '#FAFAF7', WOOL), ec: '#fff', bc: '#9A948C', mc: '#9A948C' }, m), { t: 27 }],
['lion', 'Lion', 'Roar!', m => mam({ b: '#E3A94E', bl: '#F3D08E', e: '#E3A94E', ei: '#C9812F', et: 'sm', mz: '#F3D08E', nt: 'tri', nc: '#5a3a2a', tail: 'lion', tc: '#E3A94E', tt: '#8C4F1F', behind: Ci(60, 62, 40, '#A8642A') + Ci(60, 62, 34, '#B8742F') }, m), { t: 24 }],
['tiger', 'Tiger', 'Rawr!', m => mam({ b: '#EE8B2C', bl: '#fff', e: '#EE8B2C', ei: '#fff', et: 'round', mz: '#fff', nt: 'tri', nc: '#E58A8A', tail: 'ring', rc: '#2b2b2b', bodyX: St('M36 96 L46 99 M35 106 L45 108 M84 96 L74 99 M85 106 L75 108', '#2b2b2b', 3.2), headX: St('M60 36 L60 46 M52 38 L54 46 M68 38 L66 46 M34 62 L42 64 M34 70 L42 70 M86 62 L78 64 M86 70 L78 70', '#2b2b2b', 2.6), fx: WH('#fff') }, m)],
['monkey', 'Monkey', 'Ooh ooh!', m => mam({ b: '#8B5A3C', bl: '#D9B48F', e: '#8B5A3C', ei: '#D9B48F', et: 'big', nt: 'monkey', nc: '#5a3a2a', tail: 'cat', my: 80, mc: '#5a3a2a', headX: E(50, 65, 13, 12, '#E3C6A0') + E(70, 65, 13, 12, '#E3C6A0') + E(60, 77, 15, 11, '#E3C6A0') }, m)],
['penguin', 'Penguin', 'Honk!', penguin, { e: 56, d: 10 }],
['owl', 'Owl', 'Hoo!', owl, { e: 60, d: 13 }],
['chicken', 'Chicken', 'Bawk!', chicken, { t: 32, e: 52, d: 10 }],
['duck', 'Duck', 'Quack!', duck, { e: 56 }],
['frog', 'Frog', 'Ribbit!', frog, { t: 32, e: 44, d: 16 }]
];

function accessory(id, g) {
  const t = g.t, e = g.e, d = g.d;
  if (id === 'bow') return '<g transform="rotate(-10 60 ' + t + ')">' + Pa('M60 ' + (t + 1) + ' L44 ' + (t - 8) + ' L44 ' + (t + 10) + 'Z', '#FF6F91') + Pa('M60 ' + (t + 1) + ' L76 ' + (t - 8) + ' L76 ' + (t + 10) + 'Z', '#FF6F91') + Ci(60, t + 1, 4.5, '#E0446E') + '</g>';
  if (id === 'glasses') { const f = 'rgba(255,255,255,.35)', s = 'stroke="#2b2b2b" stroke-width="2"'; return Ci(60 - d, e, 7.5, f, s) + Ci(60 + d, e, 7.5, f, s) + St('M' + (60 - d + 7.5) + ' ' + e + ' L' + (60 + d - 7.5) + ' ' + e, '#2b2b2b', 2); }
  if (id === 'hat') return '<g transform="rotate(-8 60 ' + t + ')"><rect x="49" y="' + (t - 17) + '" width="22" height="21" rx="3" fill="#2f2f3a"/><rect x="49" y="' + (t - 2) + '" width="22" height="5" fill="#E24B4A"/>' + E(60, t + 4, 17, 4.5, '#2f2f3a') + '</g>';
  return '';
}

function buddySVG(id, mood, opt) {
  opt = opt || {};
  const a = ANIMALS.find(x => x[0] === id) || ANIMALS[0], g = Object.assign({ t: 36, e: 59, d: 11 }, a[4] || {});
  const hue = opt.hue ? ' style="filter:hue-rotate(' + opt.hue + 'deg) saturate(1.15)"' : '';
  const z = mood === 'sleeping' ? '<text x="94" y="38" font-size="15" fill="#8a7f9e">z</text><text x="104" y="24" font-size="12" fill="#8a7f9e">z</text>' : '';
  return '<svg viewBox="0 0 130 150" width="100%" role="img" aria-label="' + a[1] + ', ' + mood + '"><g' + (mood === 'fainted' ? ' transform="rotate(90 60 95)"' : '') + '><g' + hue + '>' + a[3](mood) + '</g>' + (opt.acc ? accessory(opt.acc, g) : '') + '</g>' + z + '</svg>';
}
