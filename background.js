// Service worker: the single source of truth. The side panel only sends actions and renders state.
importScripts('shared.js');

let queue = Promise.resolve();                       // run actions one at a time so saves never race
const enqueue = m => { queue = queue.then(() => act(m)).catch(e => console.error(e)); return queue; };

async function currentTab() {
  try { const [t] = await chrome.tabs.query({ active: true, lastFocusedWindow: true }); return t || null; }
  catch (e) { return null; }
}

function applyTab(st, tab) {
  const s = st.session;
  if (!s) return;
  const was = s.cat;
  s.host = tab && tab.url ? hostOf(tab.url) : '';
  s.cat = classify(s.host, st);
  if (s.cat === 'distracting' && was !== 'distracting') { s.graceLeft = GRACE; evt(st, 'warn', 'Your buddy is getting distracted!'); }
}

function cleanDomain(x) { return String(x).toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }

function commit(st) {
  const fresh = (st.events || []).filter(e => e.id > st.notified);
  for (const e of fresh) {                           // only 3 kinds of notification: distracted, 5 min left, finished/fainted
    if (['warn', 'five', 'complete', 'faint'].includes(e.type))
      chrome.notifications.create('', { type: 'basic', iconUrl: 'icons/icon128.png', title: 'Focus Friend', message: e.text });
  }
  if (fresh.length) st.notified = fresh[fresh.length - 1].id;
  return saveState(st);
}

async function act(m) {
  const st = await loadState(), now = Date.now();
  if (m.type === 'startup') {                        // closing Chrome pauses the session
    if (st.session && st.session.status === 'running') st.session.status = 'paused';
    return commit(st);
  }
  if (!st.session && (m.type === 'tick' || m.type === 'refresh')) return;
  advance(st, now);
  const s = st.session;
  switch (m.type) {
    case 'start': {
      if (s) break;
      const mins = Math.round(Number(m.mins)), min = st.settings.demo ? 1 : MIN_SESSION;
      if (!(mins >= min) || mins > 600) break;
      st.last = null; st.lastSessionDate = todayStr();
      st.session = { goal: String(m.goal || '').trim().slice(0, 80) || 'Focus session', plannedMs: mins * MIN, activeMs: 0, prodMs: 0,
        distMs: 0, graceLeft: GRACE, status: 'running', cat: 'neutral', host: '', lastTick: now, overrides: {}, rescued: false, fiveSent: false };
      evt(st, 'start', 'Session started');
      applyTab(st, await currentTab());
      break;
    }
    case 'pause': if (s && s.status === 'running') s.status = 'paused'; break;
    case 'resume': if (s && s.status === 'paused') { s.status = 'running'; s.lastTick = now; applyTab(st, await currentTab()); } break;
    case 'refresh': if (s) applyTab(st, await currentTab()); break;
    case 'end':     // emergency exit: no points (productive minutes already counted toward the daily streak stay)
      if (s) { st.last = { ok: false, goal: s.goal }; st.session = null; }
      break;
    case 'treat':
      if (s && s.status !== 'fainted' && st.points >= TREAT_COST && health(s) < 100) {
        st.points -= TREAT_COST; s.distMs = Math.max(0, s.distMs - TREAT_HEAL / 100 * allowedMs(s)); evt(st, 'treat', 'Yum! +20 health');
      }
      break;
    case 'rescue':
      if (s && s.status === 'fainted' && !s.rescued && st.points >= RESCUE_COST) {
        st.points -= RESCUE_COST; s.rescued = true; s.status = 'running'; s.lastTick = now; s.graceLeft = GRACE;
        s.distMs = allowedMs(s) * (1 - RESCUE_HEALTH / 100); evt(st, 'rescue', 'Buddy rescued!');
      }
      break;
    case 'override':
      if (s && m.host && ['productive', 'distracting', 'neutral'].includes(m.cat)) { s.overrides[m.host] = m.cat; applyTab(st, await currentTab()); }
      break;
    case 'item': {
      const it = ITEMS.find(i => i.id === m.id);
      if (!it) break;
      if (!st.items.includes(it.id)) {
        if (st.points < it.cost) break;
        st.points -= it.cost; st.items.push(it.id);
        if (it.type === 'acc') st.equipped = it.id; else st.color = it.id;
      } else if (it.type === 'acc') st.equipped = st.equipped === it.id ? null : it.id;
      else st.color = st.color === it.id ? null : it.id;
      break;
    }
    case 'animal': {
      if (!ANIMAL_IDS.includes(m.id)) break;
      if (!st.animals.includes(m.id)) { if (st.points < ANIMAL_COST) break; st.points -= ANIMAL_COST; st.animals.push(m.id); }
      st.animal = m.id;
      break;
    }
    case 'settings': {
      const c = m.settings || {};
      st.settings.sound = !!c.sound; st.settings.demo = !!c.demo;
      if (Array.isArray(c.productive)) st.settings.productive = [...new Set(c.productive.map(cleanDomain).filter(Boolean))];
      if (Array.isArray(c.distracting)) st.settings.distracting = [...new Set(c.distracting.map(cleanDomain).filter(Boolean))];
      if (st.session) applyTab(st, await currentTab());
      break;
    }
    case 'dismiss': st.last = null; break;
    case 'reset': await chrome.storage.local.clear(); return;
    case 'alarm':   // the only inactivity notification: it has been days since the last session
      if (!st.session && st.lastSessionDate && st.inactiveNotified !== todayStr() && daysBetween(st.lastSessionDate, todayStr()) >= 3) {
        st.inactiveNotified = todayStr();
        chrome.notifications.create('', { type: 'basic', iconUrl: 'icons/icon128.png', title: 'Focus Friend', message: 'Your buddy misses you! Ready for a study session?' });
      }
      break;
  }
  settle(st);
  return commit(st);
}

chrome.runtime.onMessage.addListener(m => { enqueue(m); });
chrome.tabs.onActivated.addListener(() => enqueue({ type: 'refresh' }));
chrome.tabs.onUpdated.addListener((id, ch, tab) => { if (tab.active && (ch.url || ch.status === 'complete')) enqueue({ type: 'refresh' }); });
chrome.windows.onFocusChanged.addListener(() => enqueue({ type: 'refresh' }));
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'tick') enqueue({ type: 'alarm' }); });
chrome.runtime.onStartup.addListener(() => { chrome.alarms.create('tick', { periodInMinutes: 0.5 }); enqueue({ type: 'startup' }); });
chrome.runtime.onInstalled.addListener(() => { chrome.alarms.create('tick', { periodInMinutes: 0.5 }); });
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
