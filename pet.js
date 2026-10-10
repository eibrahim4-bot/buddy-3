// Floating on-page buddy. Uses the same buddySVG() artwork as the side panel.
(() => {
  if (window.__focusFriendPetLoaded) return;
  window.__focusFriendPetLoaded = true;
  const ROOT_ID = 'focus-friend-floating-pet';
  let state = null, dragging = false, moved = false, startX = 0, startY = 0, origX = 0, origY = 0;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const healthNow = s => {
    if (!s) return 100;
    if (s.status === 'fainted') return 0;
    const allowed = Math.max(1, s.plannedMs * 0.2);
    return Math.max(0, Math.min(100, Math.round(100 - 100 * s.distMs / allowed)));
  };
  const moodNow = s => {
    if (!s) return 'happy';
    if (s.status === 'fainted') return 'fainted';
    if (s.status === 'paused') return 'sleeping';
    const h = healthNow(s);
    return h >= 76 ? 'happy' : h >= 51 ? 'okay' : h >= 26 ? 'sad' : 'panic';
  };
  function make() {
    if (document.getElementById(ROOT_ID)) return document.getElementById(ROOT_ID);
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = `<div class="ff-pet-card" role="status" aria-label="Focus Friend study buddy">
      <div class="ff-pet-speech" id="ff-pet-speech"></div>
      <div class="ff-pet-art" id="ff-pet-art"></div>
      <div class="ff-pet-status" id="ff-pet-status">Ready to focus!</div>
      <div class="ff-pet-health"><i id="ff-pet-health-fill"></i></div>
      <div class="ff-pet-small" id="ff-pet-small">100% health</div>
      <button class="ff-pet-hide" type="button" title="Hide buddy" aria-label="Hide buddy">×</button>
    </div>`;
    document.documentElement.appendChild(root);
    root.querySelector('.ff-pet-hide').addEventListener('click', e => {
      e.stopPropagation(); root.style.display = 'none';
      try { chrome.storage.local.set({ ffPetHidden: true }); } catch (_) {}
    });
    const card = root.querySelector('.ff-pet-card');
    card.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      dragging = true; moved = false;
      const rect = root.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY; origX = rect.left; origY = rect.top;
      card.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      root.style.left = Math.max(0, Math.min(window.innerWidth - root.offsetWidth, origX + dx)) + 'px';
      root.style.top = Math.max(0, Math.min(window.innerHeight - root.offsetHeight, origY + dy)) + 'px';
      root.style.right = 'auto'; root.style.bottom = 'auto';
    });
    card.addEventListener('pointerup', () => { dragging = false; });
    card.addEventListener('pointercancel', () => { dragging = false; });
    return root;
  }
  function paint() {
    const root = make();
    if (!state) return;
    const hidden = state.petHidden === true;
    root.style.display = hidden ? 'none' : 'block';
    const s = state.ff?.session || null;
    const f = root.querySelector('#ff-pet-art');
    const hueItem = (typeof ITEMS !== 'undefined' ? ITEMS : []).find(i => i.id === state.ff?.color);
    const key = [state.ff?.animal, moodNow(s), state.ff?.equipped, state.ff?.color].join('|');
    if (f.dataset.key !== key && typeof buddySVG === 'function') {
      f.dataset.key = key;
      f.innerHTML = buddySVG(state.ff?.animal || 'retriever', moodNow(s), {
        acc: state.ff?.equipped || null, hue: hueItem ? hueItem.hue : 0
      });
    }
    const h = healthNow(s);
    const fill = root.querySelector('#ff-pet-health-fill');
    fill.style.width = h + '%';
    fill.style.background = h >= 76 ? '#5BC47A' : h >= 51 ? '#F2C94C' : h >= 26 ? '#F2994A' : '#EB5757';
    root.querySelector('#ff-pet-small').textContent = h + '% health';
    root.querySelector('#ff-pet-status').textContent = !s ? 'Ready to focus!' :
      s.status === 'fainted' ? 'Oh no! I fainted!' : s.status === 'paused' ? 'Taking a little break' :
      s.cat === 'distracting' ? 'Psst… back to studying!' : 'You’ve got this!';
    root.querySelector('#ff-pet-speech').textContent = !s ? 'Let’s study together!' :
      s.status === 'fainted' ? 'Help me! 💗' : s.status === 'paused' ? 'Zzz…' :
      s.cat === 'distracting' ? 'I’m getting distracted!' : 'You can do it!';
  }
  function getState() {
    try {
      chrome.storage.local.get(['ff','ffPetHidden'], data => {
        state = { ff: data.ff || {}, petHidden: !!data.ffPetHidden };
        paint();
      });
    } catch (_) {}
  }
  // Restore a default corner position; drag to move anywhere on the current webpage.
  make();
  getState();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.ff || changes.ffPetHidden)) getState();
  });
  // The background alarm updates session timing; repaint smoothly between saved updates.
  setInterval(getState, 3000);
})();
