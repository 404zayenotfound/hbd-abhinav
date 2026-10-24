(() => {
  const C = window.BDAY;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const COLORS = ['#ff5fa2', '#5b86ff', '#35d07f', '#ff8a3d', '#9b6bff', '#ffe14d', '#ffffff'];
  const isGrid = () => matchMedia('(max-width: 720px)').matches;
  let unlocked = false;

  $$('[data-name]').forEach((el) => (el.textContent = C.name));
  $$('[data-from]').forEach((el) => (el.textContent = C.from));
  document.title = `Happy Birthday ${C.name}!`;

  // ============================================================
  //  SOUND (all synthesized, no files)
  // ============================================================
  let actx = null, muted = false;
  function audio() {
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function tone(freq, dur = 0.15, type = 'square', vol = 0.08, when = 0, slideTo = null) {
    if (muted) return;
    const a = audio(); if (!a) return;
    const t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  const sfx = {
    pop: () => tone(rand(500, 900), 0.08, 'triangle', 0.12, 0, 1600),
    horn: () => { tone(290, 0.6, 'sawtooth', 0.05, 0, 620); tone(294, 0.6, 'sawtooth', 0.04, 0, 640); },
    boing: () => tone(140, 0.35, 'sine', 0.18, 0, 620),
    blip: (f) => tone(f, 0.1, 'square', 0.05),
    puff: () => tone(220, 0.2, 'sawtooth', 0.03, 0, 70),
    sad: () => { tone(392, 0.3, 'sawtooth', 0.05); tone(370, 0.3, 'sawtooth', 0.05, 0.3); tone(349, 0.8, 'sawtooth', 0.05, 0.6, 300); },
    quack: (w = 0) => { tone(720, 0.11, 'sawtooth', 0.08, w, 380); tone(660, 0.14, 'sawtooth', 0.08, w + 0.15, 320); },
    error: () => { tone(160, 0.5, 'square', 0.07); tone(120, 0.6, 'square', 0.07, 0.15); },
  };
  // happy birthday, slightly cursed (a couple of notes are a bit off. on purpose. for authenticity.)
  function playSong() {
    pauseMusic();   // so the tape doesn't drown out the cursed birthday song
    const N = { G4: 392, A4: 440, B4: 494, C5: 523, D5: 587, E5: 659, F5: 698, G5: 784 };
    const seq = [
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
      ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
      ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 2],
      ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 3],
    ];
    const beat = 0.32; let t = 0;
    seq.forEach(([n, b], i) => {
      const off = i % 7 === 4 ? rand(0.95, 1.05) : 1;
      tone(N[n] * off, b * beat * 0.92, 'square', 0.045, t);
      t += b * beat;
    });
  }
  $('#mute').addEventListener('click', () => {
    muted = !muted;
    $('#mute').textContent = muted ? '🔇' : '🔊';
    toast(muted ? 'sound off. coward.' : 'SOUND ON 📢');
  });

  // ============================================================
  //  CONFETTI
  // ============================================================
  const cv = $('#confetti'), cx = cv.getContext('2d');
  let parts = [], running = false;
  function resize() {
    const d = window.devicePixelRatio || 1;
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }
  addEventListener('resize', resize); resize();

  function confetti({ x = innerWidth / 2, y = innerHeight / 2, n = 120, angle = -90, spread = 360, power = 1 } = {}) {
    for (let i = 0; i < n; i++) {
      const a = (angle + rand(-spread / 2, spread / 2)) * Math.PI / 180;
      const s = rand(4, 13) * power;
      parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        r: rand(0, 6.28), vr: rand(-0.3, 0.3), w: rand(7, 12), h: rand(10, 17),
        c: pick(COLORS), life: rand(160, 240), round: Math.random() < 0.3,
      });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    for (const p of parts) {
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.25;
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c; cx.strokeStyle = '#141414'; cx.lineWidth = 1.5;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.w / 2, 0, 6.28); cx.fill(); cx.stroke(); }
      else { const sy = Math.cos(p.r * 2); cx.fillRect(-p.w / 2, -p.h / 2 * sy, p.w, p.h * sy); cx.strokeRect(-p.w / 2, -p.h / 2 * sy, p.w, p.h * sy); }
      cx.restore();
    }
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function party() {
    confetti({ x: 0, y: innerHeight, angle: -60, spread: 40, n: 130, power: 1.6 });
    confetti({ x: innerWidth, y: innerHeight, angle: -120, spread: 40, n: 130, power: 1.6 });
    sfx.horn();
  }
  const burstAt = (el, n = 40) => {
    const r = el.getBoundingClientRect();
    confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, n, power: 0.8 });
  };

  // ============================================================
  //  TOASTS + RAIN
  // ============================================================
  function toast(msg, ms = 3200) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    t.style.setProperty('--r', rand(-3, 3).toFixed(1) + 'deg');
    t.style.setProperty('--bg', pick(['#fff', '#ff5fa2', '#5b86ff', '#35d07f', '#ffe14d']));
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('bye'); setTimeout(() => t.remove(), 400); }, ms);
  }
  // items: emoji strings, or {src} for images
  function rain(items, n = 30) {
    for (let i = 0; i < n; i++) {
      const it = pick(items);
      const el = document.createElement(it.src ? 'img' : 'span');
      el.className = 'rain' + (it.src ? ' rain-img' : '');
      if (it.src) { el.src = it.src; el.alt = ''; } else el.textContent = it;
      el.style.left = rand(-4, 94) + 'vw';
      el.style.setProperty('--dur', rand(2.5, 5).toFixed(2) + 's');
      el.style.setProperty('--rot', rand(-360, 360).toFixed(0) + 'deg');
      el.style.animationDelay = rand(0, 1.8).toFixed(2) + 's';
      el.addEventListener('animationend', () => el.remove());
      document.body.appendChild(el);
    }
  }

  // ============================================================
  //  EASTER EGG TRACKER
  // ============================================================
  const words = C.secretWords || [];
  const EGGS = [
    { id: 'no', hint: 'say no to the security guard' },
    { id: 'konami', hint: '↑ ↑ ↓ ↓ … you know the rest' },
    { id: 'name', hint: 'type your own name. anywhere.' },
    { id: 'age', hint: 'question your age. repeatedly.' },
    { id: 'bsod', hint: 'do exactly what you were told not to' },
    { id: 'trick', hint: 'some candles have trust issues' },
    { id: 'idle', hint: 'do absolutely nothing for a while' },
    { id: 'context', hint: 'right-click. we dare you.' },
    { id: 'duck', hint: 'there is a duck. find the duck.' },
    { id: 'gravity', hint: "type the thing that keeps you on the ground" },
    { id: 'decor', hint: 'pop everything at the top' },
    ...words.map((w) => ({ id: 'w:' + w.word.toLowerCase(), hint: 'secret word: ' + (w.hint || w.word.length + ' letters') })),
  ];
  const found = new Set();
  $('#eggMax').textContent = EGGS.length;
  $('#eggTotal').textContent = EGGS.length;

  function egg(id) {
    if (found.has(id)) return;
    found.add(id);
    $('#eggCount').textContent = found.size;
    const b = $('#eggBadge');
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    renderEggs();
    setTimeout(() => {
      toast(`🥚 secret found! (${found.size}/${EGGS.length})`);
      if (!b.classList.contains('hidden')) burstAt(b, 30);
      if (found.size === EGGS.length) {
        setTimeout(() => { toast('🏆 YOU FOUND EVERY SECRET. you have too much free time. happy birthday.', 6000); party(); }, 900);
      }
    }, 700);
  }
  function renderEggs() {
    $('#eggList').innerHTML = '';
    EGGS.forEach((e) => {
      const li = document.createElement('li');
      const got = found.has(e.id);
      li.className = got ? 'got' : '';
      li.textContent = (got ? '✅ ' : '❓ ') + e.hint;
      $('#eggList').appendChild(li);
    });
  }
  renderEggs();
  $('#eggBadge').addEventListener('click', (e) => { e.stopPropagation(); $('#eggPanel').classList.toggle('hidden'); });
  document.addEventListener('click', (e) => { if (!e.target.closest('#eggPanel')) $('#eggPanel').classList.add('hidden'); });

  // ============================================================
  //  GATE
  // ============================================================
  const noBtn = $('#noBtn');
  const MAX_DODGE = C.noTaunts.length;
  let dodges = 0, lastDodge = 0;
  function dodge() {
    if (dodges >= MAX_DODGE) return;
    dodges++; lastDodge = Date.now();
    const r = noBtn.getBoundingClientRect();
    noBtn.style.position = 'fixed';
    noBtn.style.left = rand(16, innerWidth - r.width - 16) + 'px';
    noBtn.style.top = rand(16, innerHeight - r.height - 16) + 'px';
    $('#gateMsg').textContent = C.noTaunts[dodges - 1];
    sfx.boing();
    if (dodges >= MAX_DODGE) noBtn.textContent = 'ok fine, click me';
  }
  noBtn.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') dodge(); });
  noBtn.addEventListener('pointerdown', (e) => { if (dodges < MAX_DODGE) { e.preventDefault(); dodge(); } });
  noBtn.addEventListener('click', () => {
    if (dodges < MAX_DODGE || Date.now() - lastDodge < 350) return;
    egg('no');
    noBtn.disabled = true;
    $('#gateMsg').textContent = 'lying to a birthday website is a federal crime. proceeding anyway.';
    sfx.error();
    setTimeout(toPresent, 2200);
  });
  $('#yesBtn').addEventListener('click', () => {
    audio(); sfx.pop();
    $('#gateMsg').textContent = 'identity confirmed ✓';
    confetti({ n: 40, power: 0.7 });
    setTimeout(toPresent, 600);
  });
  function toPresent() {
    noBtn.style.display = 'none';
    $('#gate').classList.add('hidden');
    $('#present').classList.remove('hidden');
  }

  // ============================================================
  //  PRESENT
  // ============================================================
  const gift = $('#gift');
  const GIFT_HINTS = ['harder.', 'HARDER.', "ok it's coming loose", '🫨🫨🫨'];
  let hits = 0;
  gift.addEventListener('click', () => {
    if (hits >= GIFT_HINTS.length) return;
    audio();
    hits++;
    gift.style.setProperty('--amp', hits * 4 + 'deg');
    gift.classList.remove('shake'); void gift.offsetWidth; gift.classList.add('shake');
    sfx.blip(180 + hits * 140);
    $('#presentHint').textContent = GIFT_HINTS[hits - 1];
    burstAt(gift, hits * 8);
    if (hits === GIFT_HINTS.length) setTimeout(openGift, 450);
  });
  function openGift() {
    gift.classList.add('open');
    $('#presentHint').textContent = '!!!!!!!!';
    burstAt(gift, 200);
    party();
    setTimeout(() => {
      $('#present').classList.add('hidden');
      $('#main').classList.remove('hidden');
      $('#eggBadge').classList.remove('hidden');
      scrollTo(0, 0);
      unlocked = true;
      startMain();
      party();
    }, 1100);
  }

  // ============================================================
  //  MAIN
  // ============================================================
  function startMain() {
    buildHero();
    buildLetter();
    buildBoard();
    buildAwards();
    buildTape();
    buildCake();
    resetIdle();
    scheduleRandomRain();
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.block').forEach((b) => { b.classList.add('reveal'); io.observe(b); });
  }

  // ---------- hero ----------
  function buildHero() {
    const reps = [...C.marquee, ...C.marquee].map((s) => s.toUpperCase()).join('  ★  ') + '  ★  ';
    $('#marquee').textContent = reps + reps;

    const title = $('#title');
    let idx = 0;
    const line = (text, cls) => {
      const l = document.createElement('span');
      l.className = 'line ' + cls;
      // shrink long words so they never break mid-word (bungee is ~0.95em per letter)
      const longest = Math.max(...text.split(' ').map((w) => w.length));
      l.style.fontSize = `min(${cls === 'name' ? 13 : 10}vw, ${(90 / (longest * 0.95)).toFixed(2)}vw, ${cls === 'name' ? 170 : 130}px)`;
      text.split(' ').forEach((wordText, wi) => {
        if (wi) l.appendChild(document.createTextNode(' '));
        const word = document.createElement('span');
        word.className = 'word';
        l.appendChild(word);
        [...wordText].forEach((ch) => addLetter(word, ch));
      });
      title.appendChild(l);
    };
    const addLetter = (word, ch) => {
      const s = document.createElement('span');
      s.className = 'ltr';
      s.textContent = ch;
      s.style.color = COLORS[idx % COLORS.length];
      s.style.animationDelay = (idx * 0.05) + 's';
      const myIdx = idx;
      s.addEventListener('click', () => {
        s.classList.remove('spin'); void s.offsetWidth; s.classList.add('spin');
        sfx.blip(300 + (myIdx % 12) * 60);
      });
      word.appendChild(s);
      idx++;
    };
    line('HAPPY BIRTHDAY', 'hb');
    line(C.name.toUpperCase(), 'name');

    // age
    const ageBtn = $('#age');
    let age = C.age, clicks = 0;
    ageBtn.textContent = age;
    const STEPS = [
      [0, 'verified ✓'], [0, 'wait.'], [1, 'hold on, recounting'], [1, '+1 for that one time'],
      [3, '+3 for the vibes'], [5, '+5 for the back pain'], [11, 'that cannot be right'],
      [80, 'carbon dating in progress…'], [4000, 'fossil detected 🦴'],
    ];
    ageBtn.addEventListener('click', () => {
      ageBtn.classList.remove('bump'); void ageBtn.offsetWidth; ageBtn.classList.add('bump');
      if (clicks < STEPS.length) {
        const [add, note] = STEPS[clicks];
        age += add;
        $('#ageNote').textContent = note;
        sfx.blip(400 + clicks * 50);
        clicks++;
      } else {
        age = C.age; clicks = 0;
        $('#ageNote').textContent = `ok fine. you're ${C.age}. you don't look a day over ${C.age - 3}.`;
        sfx.boing();
        egg('age');
      }
      ageBtn.textContent = age;
    });

    // rotating subtitle
    const sub = $('#subtitle');
    let si = 0;
    sub.textContent = C.subtitles[0];
    setInterval(() => {
      sub.classList.add('fade');
      setTimeout(() => { si = (si + 1) % C.subtitles.length; sub.textContent = C.subtitles[si]; sub.classList.remove('fade'); }, 300);
    }, 2800);

    // poppable decorations
    const decor = $('#decor');
    const DEC = ['🎈', '🎂', '🥳', '🎁', '🎈', '🍕', '🎉', '🦖'];
    const spots = [[6, 22], [86, 18], [10, 70], [88, 66], [22, 88], [76, 86], [46, 12], [94, 42]];
    let popped = 0;
    DEC.forEach((e, i) => {
      const b = document.createElement('button');
      b.className = 'decor';
      b.textContent = e;
      b.setAttribute('aria-label', 'pop');
      b.style.left = spots[i][0] + '%';
      b.style.top = spots[i][1] + '%';
      b.style.animationDelay = rand(0, 2).toFixed(2) + 's';
      b.addEventListener('click', () => {
        b.classList.add('popped');
        sfx.pop(); burstAt(b, 25);
        if (++popped === DEC.length) { toast('you popped everything. are you proud of yourself?'); egg('decor'); }
      });
      decor.appendChild(b);
    });
  }

  // ---------- letter ----------
  let skipTyping = false;
  function buildLetter() {
    const body = $('#lBody');
    C.letter.paragraphs.forEach(() => body.appendChild(document.createElement('p')));
    $('#seal').addEventListener('click', openLetter);
    $('#skip').addEventListener('click', () => (skipTyping = true));
  }
  async function openLetter() {
    const env = $('#envelope');
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    sfx.pop();
    $('#envHint').textContent = 'oh no. feelings incoming.';
    await sleep(800);
    env.classList.add('gone');
    await sleep(450);
    env.classList.add('hidden');
    $('#letter').classList.remove('hidden');
    $('#envHint').textContent = '';
    const nodes = [
      [$('#lGreet'), C.letter.greeting],
      ...$$('#lBody p').map((p, i) => [p, C.letter.paragraphs[i]]),
      [$('#lSign'), C.letter.signoff],
    ];
    for (const [el, txt] of nodes) {
      el.classList.add('typing');
      for (let i = 0; i < txt.length; i++) {
        if (skipTyping) break;
        el.textContent = txt.slice(0, i + 1);
        await sleep(/[.,!?:]/.test(txt[i]) ? 110 : 22);
      }
      el.textContent = txt;
      el.classList.remove('typing');
      if (!skipTyping) await sleep(300);
    }
    $('#skip').classList.add('hidden');
  }

  // ---------- photo board ----------
  const loaded = [];
  function placeholder(p) {
    const d = document.createElement('div');
    if (p.emoji) {
      d.className = 'ph ph-emoji';
      d.textContent = p.emoji;
      return d;
    }
    d.className = 'ph';
    d.innerHTML = '<div><b>📸</b>put a photo at<br><code></code></div>';
    d.querySelector('code').textContent = p.src;
    return d;
  }
  function buildBoard() {
    const board = $('#board');
    C.photos.forEach((p, i) => {
      const el = document.createElement('figure');
      el.className = 'polaroid' + (p.wide ? ' wide' : '');
      el.style.setProperty('--r', rand(p.wide ? -5 : -10, p.wide ? 5 : 10).toFixed(1) + 'deg');
      el.style.setProperty('--tape', pick(['rgba(255,225,77,.8)', 'rgba(255,95,162,.6)', 'rgba(91,134,255,.55)', 'rgba(53,208,127,.6)']));
      let media;
      if (p.emoji) media = placeholder(p);
      else {
        media = document.createElement('img');
        media.alt = p.caption || '';
        media.draggable = false;
        if (p.fit === 'cover') media.classList.add('cover');
        media.onload = () => loaded.push(p);
        media.onerror = () => { p.failed = true; media.replaceWith(placeholder(p)); };
        media.src = p.src;
      }
      const cap = document.createElement('figcaption');
      cap.textContent = p.caption || '';
      if (cap.textContent.length > 26) cap.classList.add('long');
      el.append(media, cap);
      board.appendChild(el);
      makeDraggable(el, i);
    });
    layoutBoard();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layoutBoard, 200); });
  }
  function layoutBoard() {
    const board = $('#board');
    if (isGrid()) { board.style.height = ''; return; }
    // flow layout: fill rows left to right by each polaroid's real width, then jitter
    const W = board.clientWidth, GAP = 30;
    const rows = [[]];
    let x = 0;
    $$('.polaroid').forEach((el) => {
      const w = el.offsetWidth;
      if (x + w > W && rows.at(-1).length) { rows.push([]); x = 0; }
      rows.at(-1).push(el);
      x += w + GAP;
    });
    let y = 0;
    rows.forEach((row) => {
      const used = row.reduce((s, el) => s + el.offsetWidth, 0) + GAP * (row.length - 1);
      let cx = (W - used) / 2;
      row.forEach((el) => {
        if (!el.dataset.moved) {
          el.style.left = cx + 'px';
          el.style.top = y + rand(0, 30) + 'px';
        }
        cx += el.offsetWidth + GAP;
      });
      y += Math.max(...row.map((el) => el.offsetHeight)) + 50;
    });
    board.style.height = y + 'px';
  }
  let zTop = 10;
  function makeDraggable(el, i) {
    el.addEventListener('pointerdown', (e) => {
      if (isGrid() || e.button !== 0) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      let moved = false;
      el.style.zIndex = ++zTop;
      el.classList.add('lift');
      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        el.style.left = ox + dx + 'px';
        el.style.top = oy + dy + 'px';
      };
      const up = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('lift');
        if (moved) el.dataset.moved = '1';
        else openLightbox(i);
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
    el.addEventListener('click', () => { if (isGrid()) openLightbox(i); });
  }

  // ---------- lightbox ----------
  let lbIdx = 0;
  function openLightbox(i) {
    lbIdx = (i + C.photos.length) % C.photos.length;
    const p = C.photos[lbIdx];
    const media = $('.lb-media');
    media.innerHTML = '';
    if (p.failed || p.emoji) media.appendChild(placeholder(p));
    else {
      const img = document.createElement('img');
      img.src = p.src; img.alt = p.caption || '';
      if (p.wide) img.style.width = 'min(760px, 80vw)';   // blow up tiny chat screenshots
      media.appendChild(img);
    }
    $('.lb-cap').textContent = p.caption || '';
    $('#lightbox').classList.remove('hidden');
    sfx.pop();
  }
  const closeLb = () => $('#lightbox').classList.add('hidden');
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLb(); });
  $('.lb-close').addEventListener('click', closeLb);
  $('.lb-prev').addEventListener('click', () => openLightbox(lbIdx - 1));
  $('.lb-next').addEventListener('click', () => openLightbox(lbIdx + 1));

  // ---------- awards ----------
  function buildAwards() {
    const wrap = $('#awards');
    const BG = ['#ff5fa2', '#5b86ff', '#35d07f', '#ff8a3d', '#9b6bff', '#ffe14d'];
    C.awards.forEach((a, i) => {
      const b = document.createElement('button');
      b.className = 'award' + (a.featured ? ' featured' : '');
      b.style.setProperty('--c', a.color || (a.featured ? '#ffe14d' : BG[i % BG.length]));
      b.innerHTML = `
        <div class="award-inner">
          <div class="award-face award-front"><span class="emoji"></span><span class="label">OFFICIAL AWARD</span><span class="atitle"></span></div>
          <div class="award-face award-back"><span class="atext"></span><small>— the committee (me)</small></div>
        </div>`;
      b.querySelector('.emoji').textContent = a.emoji;
      b.querySelector('.atitle').textContent = a.title;
      b.querySelector('.atext').textContent = a.text;
      if (a.img) {
        const img = document.createElement('img');
        img.src = a.img; img.alt = a.title; img.className = 'award-img';
        b.querySelector('.award-front').appendChild(img);
      }
      if (a.caption) {
        const cap = document.createElement('span');
        cap.className = 'award-cap';
        cap.textContent = a.caption;
        b.querySelector('.award-front').appendChild(cap);
      }
      b.addEventListener('click', () => {
        b.classList.toggle('flipped');
        sfx.pop();
        if (b.classList.contains('flipped')) burstAt(b, 20);
      });
      wrap.appendChild(b);
    });
  }

  // ---------- mixtape ----------
  function buildTape() {
    const pl = C.playlist;
    if (!pl || !pl.tracks.length) { $('.tape-sec').classList.add('hidden'); return; }
    $('#tapeTitle').textContent = pl.title;
    const list = $('#tracks');
    pl.tracks.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = '<button class="trow"><span class="tnum"></span><span class="tname"><b></b><small></small></span><span class="tplay">▶</span></button><a class="text" target="_blank" rel="noopener" aria-label="Open on YouTube">↗</a>';
      li.querySelector('.tnum').textContent = String(i + 1).padStart(2, '0');
      li.querySelector('b').textContent = t.title;
      li.querySelector('small').textContent = t.artist || '';
      li.querySelector('.text').href = t.yt
        ? 'https://www.youtube.com/watch?v=' + t.yt
        : 'https://www.youtube.com/results?search_query=' + encodeURIComponent([t.title, t.artist].filter(Boolean).join(' '));
      li.querySelector('.trow').addEventListener('click', () => (cur === i && ytPlaying ? togglePlay() : playTrack(i)));
      list.appendChild(li);
    });
    $('#pPlay').addEventListener('click', togglePlay);
    $('#pPrev').addEventListener('click', () => playTrack(cur - 1));
    $('#pNext').addEventListener('click', () => playTrack(cur + 1));
    $('#pBar').addEventListener('click', (e) => {
      if (!yt || !yt.getDuration) return;
      const r = $('#pBar').getBoundingClientRect();
      yt.seekTo(((e.clientX - r.left) / r.width) * yt.getDuration(), true);
    });
    loadYT();
  }

  // hidden YouTube player = the tape deck. audio only, the video never shows.
  let yt = null, ytReady = false, ytPlaying = false, cur = 0, pendingPlay = null, ytFails = 0, wantsMusic = false;
  function loadYT() {
    window.onYouTubeIframeAPIReady = () => {
      yt = new YT.Player('ytPlayer', {
        width: 200, height: 200,
        playerVars: { playsinline: 1, controls: 0, disablekb: 1 },
        events: {
          onReady: () => { ytReady = true; if (pendingPlay !== null) playTrack(pendingPlay); },
          onStateChange: (e) => {
            ytPlaying = e.data === YT.PlayerState.PLAYING;
            if (ytPlaying) ytFails = 0;
            $('#cassette').classList.toggle('playing', ytPlaying);
            $('#pPlay').textContent = ytPlaying ? '⏸' : '▶';
            if (e.data === YT.PlayerState.ENDED) playTrack(cur + 1);
          },
          onError: () => {
            if (!wantsMusic) return;   // only complain if he actually pressed play
            // youtube refuses every embed when the page is opened as a plain file (no web address)
            if (location.protocol === 'file:' || ++ytFails >= 2) {
              ytFails = 0;
              $('#nowPlaying').textContent = 'tape jammed';
              return toast('the tape deck only works when the site is online. use the ↗ to listen on youtube.', 5000);
            }
            toast(`youtube won't play "${C.playlist.tracks[cur].title}" here. skipping. (the ↗ opens it)`);
            setTimeout(() => playTrack(cur + 1), 1200);
          },
        },
      });
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => toast("couldn't load the music player. are you offline?");
    document.head.appendChild(s);
    setInterval(updateProgress, 500);
  }
  function playTrack(i) {
    const tracks = C.playlist.tracks;
    cur = (i + tracks.length) % tracks.length;
    wantsMusic = true;
    $$('#tracks li').forEach((li, j) => li.classList.toggle('on', j === cur));
    $('#nowPlaying').textContent = `now playing: ${tracks[cur].title}`;
    tone(880, 0.06, 'square', 0.04);   // the satisfying cassette *click*
    if (!ytReady) { pendingPlay = cur; $('#nowPlaying').textContent = 'rewinding the tape…'; return; }
    pendingPlay = null;
    if (tracks[cur].yt) yt.loadVideoById(tracks[cur].yt);
    if (tracks[cur].title === 'Free Bird') toast('🦅 free bird. all 9 minutes of it. no skipping the solo.');
  }
  function togglePlay() {
    if (!ytReady || !yt.getPlayerState || yt.getPlayerState() === -1 || yt.getPlayerState() === 5) return playTrack(cur);
    ytPlaying ? yt.pauseVideo() : yt.playVideo();
  }
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  function updateProgress() {
    if (!ytReady || !yt.getDuration) return;
    const d = yt.getDuration() || 0, t = yt.getCurrentTime() || 0;
    $('#pFill').style.width = d ? (t / d) * 100 + '%' : '0';
    $('#pTime').textContent = d ? `${fmt(t)} / ${fmt(d)}` : '0:00';
  }
  const pauseMusic = () => { if (ytPlaying) yt.pauseVideo(); };

  // ---------- WHATS UP?? THE SKYYYY. ----------
  let skyUp = false, yCount = 0;
  function addY() {
    if (yCount >= 14) {
      $('#skyA').classList.remove('wobble'); void $('#skyA').offsetWidth; $('#skyA').classList.add('wobble');
      return toast('the sky is full. (it is not. the sky is infinite.)');
    }
    const y = document.createElement('span');
    y.className = 'sky-y';
    y.textContent = 'Y';
    // every Y floats a little higher and smaller, off into the sky
    y.style.fontSize = Math.pow(0.84, yCount).toFixed(3) + 'em';
    y.style.setProperty('--lift', -(yCount * 0.07).toFixed(2) + 'em');
    y.style.setProperty('--tilt', (yCount % 2 ? 6 : -6) + 'deg');
    y.style.animationDelay = (yCount * 0.12) + 's, ' + (0.5 + yCount * 0.12) + 's';
    const dot = $('#skyY .sky-dot');
    $('#skyY').insertBefore(y, dot);
    tone(300 + yCount * 70, 0.12, 'triangle', 0.09, 0, 500 + yCount * 90);
    yCount++;
  }
  function plane() {
    const p = document.createElement('div');
    p.className = 'plane';
    p.innerHTML = '<span class="banner">THE SKYYYY.</span><span class="rope"></span><span class="jet">✈️</span>';
    p.addEventListener('animationend', () => p.remove());
    document.body.appendChild(p);
  }
  function theSky() {
    if (skyUp) return;
    skyUp = true;
    const sec = $('#skySec');
    sec.classList.add('up');
    $('#skyBtn').classList.add('hidden');
    tone(180, 1.1, 'sine', 0.12, 0, 1400);   // whoooosh up
    setTimeout(() => {
      $('#skyQ').classList.add('hidden');
      $('.sky-label').classList.add('hidden');
      const a = $('#skyA');
      a.classList.remove('hidden');
      $('#skyY').innerHTML = '<span class="sky-dot">.</span>';
      for (let i = 0; i < 4; i++) setTimeout(addY, 250 + i * 160);
      setTimeout(() => {
        sfx.horn();
        const r = sec.getBoundingClientRect();
        confetti({ x: innerWidth / 2, y: Math.max(0, r.top), n: 160, angle: 90, spread: 160, power: 0.9 });
        rain(['☁️', '🐦', '☁️', '🌤️'], 20);
        plane();
        $('#skyHint').classList.remove('hidden');
      }, 1000);
    }, 650);
  }
  $('#skyBtn').addEventListener('click', theSky);
  $('#skyQ').addEventListener('click', theSky);
  $('#skyA').addEventListener('click', () => { addY(); burstAt($('#skyA'), 25); });

  // ---------- duck ----------
  $('#duck').addEventListener('click', () => {
    sfx.quack(); sfx.quack(1.5); sfx.quack(3.4);
    const d = document.createElement('div');
    d.className = 'duck-walk';
    d.innerHTML = '<span>🦆</span>';
    d.addEventListener('animationend', (e) => { if (e.animationName === 'waddle') d.remove(); });
    document.body.appendChild(d);
    toast('🦆 quack. (the duck says happy birthday)');
    egg('duck');
  });

  // ---------- cake ----------
  let candles = [], trickIdx = -1, trickLeft = 2, relightPending = false, wishDone = false;
  function buildCake() {
    const n = Math.min(C.age, C.maxCandles || 9);
    $('#cakeHint').textContent = C.age > n
      ? `we could only afford ${n} candles. please imagine the other ${C.age - n}. click to blow them out.`
      : 'click the candles to blow them out.';
    const wrap = $('#candles');
    for (let i = 0; i < n; i++) {
      const b = document.createElement('button');
      b.className = 'candle-btn';
      b.setAttribute('aria-label', 'candle');
      b.innerHTML = '<span class="candle"><span class="flame"></span></span>';
      b.addEventListener('click', () => blow(i));
      wrap.appendChild(b);
      candles.push(b);
    }
    trickIdx = Math.floor(Math.random() * n);
    $('#relight').addEventListener('click', relightAll);
  }
  function blow(i) {
    const c = candles[i];
    if (c.classList.contains('out')) return;
    c.classList.add('out');
    sfx.puff();
    if (i === trickIdx && trickLeft > 0) {
      relightPending = true;
      const lines = ["it relit. it's a trick candle. we're sorry. (we're not)", 'AGAIN??', 'ok that one was on purpose'];
      setTimeout(() => {
        c.classList.remove('out');
        trickLeft--;
        relightPending = false;
        toast(lines[1 - trickLeft] || lines[0]);
        sfx.boing();
      }, 900);
      return;
    }
    if (i === trickIdx && trickLeft === 0) { toast('the trick candle has given up. respect.'); egg('trick'); }
    if (!relightPending && candles.every((x) => x.classList.contains('out'))) setTimeout(openWish, 600);
  }
  function relightAll() {
    candles.forEach((c) => c.classList.remove('out'));
    trickLeft = 2;
    trickIdx = Math.floor(Math.random() * candles.length);
    $('#relight').classList.add('hidden');
    sfx.blip(600);
  }
  // microphone blowing
  $('#micBtn').addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const a = audio();
      const src = a.createMediaStreamSource(stream);
      const an = a.createAnalyser(); an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      $('#micBtn').textContent = '🎤 listening… blow!';
      let last = 0;
      const stopAt = Date.now() + 30000;
      const loop = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / buf.length);
        if (rms > 0.18 && Date.now() - last > 140) {
          const lit = candles.map((c, i) => i).filter((i) => !candles[i].classList.contains('out'));
          if (lit.length) { blow(pick(lit)); last = Date.now(); }
        }
        if (Date.now() < stopAt && !wishDone) requestAnimationFrame(loop);
        else { stream.getTracks().forEach((t) => t.stop()); $('#micBtn').textContent = '🎤 blow for real'; }
      };
      loop();
    } catch (e) {
      toast("couldn't hear you. just click them, grandpa.");
    }
  });

  // ---------- wish ----------
  function openWish() {
    $('#wish').classList.remove('hidden');
    $('#wishText').textContent = 'type it below. we will absolutely not read it.';
    $('#wishInput').value = '';
    setTimeout(() => $('#wishInput').focus(), 100);
  }
  $('#wishForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#wishText').textContent = 'wish received ✓\nforwarding to: the universe, the birthday council, your mom';
    $('#wishForm button').classList.add('hidden');
    $('#wishInput').classList.add('hidden');
    wishDone = true;
    party(); setTimeout(party, 700);
    playSong();
    setTimeout(() => {
      $('#wish').classList.add('hidden');
      $('#wishForm button').classList.remove('hidden');
      $('#wishInput').classList.remove('hidden');
      $('#relight').classList.remove('hidden');
      wishDone = false;
    }, 3600);
  });

  // ---------- do not press ----------
  const DNP_LABELS = ['DO NOT PRESS', 'SERIOUSLY.', 'WHY ARE YOU LIKE THIS', 'ok you can press it'];
  let dnpCount = 0;
  $('#dnp').addEventListener('click', async () => {
    dnpCount++;
    $('#dnpLabel').textContent = DNP_LABELS[Math.min(dnpCount, DNP_LABELS.length - 1)];
    sfx.error();
    const bs = $('#bsod'), pct = $('#bsodPct');
    pct.textContent = '0';
    bs.classList.remove('hidden');
    let p = 0;
    while (p < 100) {
      await sleep(rand(60, p > 60 && p < 70 ? 600 : 160));
      p = Math.min(100, p + Math.floor(rand(1, 12)));
      pct.textContent = p;
    }
    await sleep(500);
    bs.querySelector('.bsod-face').textContent = ':)';
    bs.querySelector('p').textContent = 'just kidding. happy birthday. please stop pressing things.';
    await sleep(1600);
    bs.classList.add('hidden');
    bs.querySelector('.bsod-face').textContent = ':(';
    bs.querySelector('p').textContent = "Your birthday ran into a problem and needs to restart. We're just collecting some cake, and then we'll restart for you.";
    party();
    egg('bsod');
  });

  // ---------- finale ----------
  $('#finaleBtn').addEventListener('click', async () => {
    const f = $('#finale'), lines = $('#finaleLines');
    lines.innerHTML = '';
    $('#finaleDone').classList.add('hidden');
    f.classList.remove('hidden');
    await sleep(1400);
    for (const l of C.finale) {
      const p = document.createElement('p');
      p.textContent = l;
      lines.appendChild(p);
      requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('show')));
      p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      tone(523 + rand(-4, 4), 1.4, 'sine', 0.025);
      await sleep(900 + l.length * 45);
    }
    await sleep(800);
    $('#finaleDone').classList.remove('hidden');
    $('#finaleDone').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  $('#finaleDone').addEventListener('click', () => {
    $('#finale').classList.add('hidden');
    toast('ok. that was weird. CONFETTI.', 3500);
    party(); setTimeout(party, 500); setTimeout(party, 1000);
    setTimeout(playSong, 400);
  });

  // ============================================================
  //  GLOBAL EASTER EGGS
  // ============================================================
  // --- typed words + konami ---
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let keyHist = [], typed = '';
  const nameKey = C.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  document.addEventListener('keydown', (e) => {
    resetIdle();
    if (e.key === 'Escape') { closeLb(); $('#ctx').classList.add('hidden'); }
    if (!$('#lightbox').classList.contains('hidden')) {
      if (e.key === 'ArrowLeft') openLightbox(lbIdx - 1);
      if (e.key === 'ArrowRight') openLightbox(lbIdx + 1);
    }
    if (!unlocked || e.target.closest('input, textarea')) return;
    const k = e.key.toLowerCase();
    keyHist = [...keyHist, k].slice(-KONAMI.length);
    if (keyHist.join() === KONAMI.join()) { keyHist = []; chaos(); }
    if (k.length !== 1) return;
    typed = (typed + k).replace(/['’]/g, '').slice(-40);   // "what's up" counts as "whats up"
    if (nameKey && typed.endsWith(nameKey)) { typed = ''; nameRain(); }
    if (typed.endsWith('gravity')) { typed = ''; gravity(); }
    words.forEach((w) => {
      if (typed.endsWith(w.word.toLowerCase())) {
        typed = '';
        rain(w.emoji || ['🎉'], 35);
        toast(w.message || '🤫', 5000);
        if (w.plane) plane();
        sfx.horn();
        egg('w:' + w.word.toLowerCase());
      }
    });
  });

  function chaos() {
    document.body.classList.add('chaos');
    toast('⚠ CHAOS MODE ENGAGED ⚠', 4000);
    party();
    for (let i = 0; i < 8; i++) tone(200 + i * 90, 0.1, 'square', 0.05, i * 0.08);
    egg('konami');
    setTimeout(() => { document.body.classList.remove('chaos'); toast('chaos mode disengaged. (for now)'); }, 12000);
  }
  function nameRain() {
    const items = loaded.length ? loaded.map((p) => ({ src: p.src })) : ['🥳', '🎉', '🎂', '👑'];
    rain(items, loaded.length ? 24 : 40);
    toast(`${C.name.toUpperCase()}!!! that's you!!!`);
    sfx.horn();
    egg('name');
  }
  function gravity() {
    const els = $$('#main > *');
    toast('gravity: ON. (sorry)');
    tone(600, 1.2, 'sine', 0.1, 0, 60);
    els.forEach((el) => {
      el.style.transition = `transform ${rand(0.8, 1.4).toFixed(2)}s cubic-bezier(.55,0,1,.45)`;
      el.style.transform = `translateY(${innerHeight * 1.4}px) rotate(${rand(-40, 40).toFixed(0)}deg)`;
    });
    setTimeout(() => {
      toast('ok gravity off. everything is fine.');
      els.forEach((el) => {
        el.style.transition = 'transform 1s cubic-bezier(.2,1.4,.4,1)';
        el.style.transform = '';
      });
      setTimeout(() => els.forEach((el) => (el.style.transition = '')), 1100);
    }, 2800);
    egg('gravity');
  }

  // --- random showers, for no reason ---
  function scheduleRandomRain() {
    const r = C.randomRain;
    if (!r) return;
    const [lo, hi] = r.everySeconds || [40, 80];
    setTimeout(() => {
      // don't interrupt the serious bit or a crash screen
      if ($('#finale').classList.contains('hidden') && $('#bsod').classList.contains('hidden')) {
        rain(r.emoji, 28);
        if (r.message) toast(r.message);
      }
      scheduleRandomRain();
    }, rand(lo, hi) * 1000);
  }

  // --- idle ---
  let idleT;
  function resetIdle() {
    clearTimeout(idleT);
    if (!unlocked || found.has('idle')) return;
    idleT = setTimeout(() => {
      toast("hello?? 👀 it's your birthday. do something.", 5000);
      sfx.boing();
      egg('idle');
    }, 40000);
  }
  ['pointermove', 'scroll', 'touchstart'].forEach((ev) => addEventListener(ev, resetIdle, { passive: true }));

  // --- right-click menu ---
  const CTX = [
    ['📋 Copy birthday', 'birthday copied. you now have two. you are twice as old.'],
    ['🔍 Inspect feelings', 'error: feelings too large to inspect'],
    ['🍝 View page sauce', 'the sauce is secret. (it is love.)'],
    ['💾 Save cake as…', 'cake cannot be saved. cake must be eaten.'],
    ['↩ Undo aging', 'feature not available in your region'],
  ];
  const ctxEl = $('#ctx');
  CTX.forEach(([label, msg]) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.addEventListener('click', () => { ctxEl.classList.add('hidden'); toast(msg); sfx.pop(); });
    ctxEl.appendChild(b);
  });
  document.addEventListener('contextmenu', (e) => {
    if (!unlocked) return;
    e.preventDefault();
    ctxEl.classList.remove('hidden');
    const r = ctxEl.getBoundingClientRect();
    ctxEl.style.left = Math.min(e.clientX, innerWidth - r.width - 8) + 'px';
    ctxEl.style.top = Math.min(e.clientY, innerHeight - r.height - 8) + 'px';
    egg('context');
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('#ctx')) ctxEl.classList.add('hidden'); });

  // --- cursor sparkle trail ---
  if (matchMedia('(pointer: fine)').matches) {
    let lastT = 0;
    addEventListener('pointermove', (e) => {
      if (!unlocked || Date.now() - lastT < 55) return;
      lastT = Date.now();
      const s = document.createElement('span');
      s.className = 'trail';
      s.textContent = pick(['✨', '⭐', '🎉', '💥', '🎈', '✨']);
      s.style.left = e.clientX - 9 + 'px';
      s.style.top = e.clientY - 9 + 'px';
      s.style.setProperty('--dx', rand(-30, 30).toFixed(0) + 'px');
      s.addEventListener('animationend', () => s.remove());
      document.body.appendChild(s);
    });
  }

  // --- for the snoops ---
  console.log('%c🎂 HAPPY BIRTHDAY ' + C.name.toUpperCase() + ' 🎂', 'font: 900 28px Impact; color: #ff5fa2; text-shadow: 3px 3px 0 #141414; background: #ffe14d; padding: 10px 16px;');
  console.log('%cwhy are you in the console. it is your BIRTHDAY. go outside. (hint: try typing "gravity" on the page)', 'font: 14px monospace;');
})();
