/* ===== CONFIG — edit these ===== */
const CONFIG = {
  // RSVP is sent to this WhatsApp number (country code + number, digits only). Leave '' to just show a thank-you.
  whatsappNumber: '',
  // Or paste a Google Apps Script / Supabase / Formspree endpoint here to POST the RSVP as JSON.
  endpoint: ''
};

/* ===== background images from data-img ===== */
document.querySelectorAll('[data-img]').forEach(el => {
  el.style.backgroundImage = `url("${el.dataset.img}")`;
});

/* ===== wreath monogram ===== */
function buildWreath(el) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('fill', 'currentColor');
  const rings = [{ r: 78, n: 30, len: 15, w: 4.6, off: 0 }, { r: 70, n: 30, len: 12, w: 3.6, off: 6 }];
  rings.forEach(({ r, n, len, w, off }, ri) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 360 + off;
      const leaf = document.createElementNS(NS, 'ellipse');
      leaf.setAttribute('cx', 100);
      leaf.setAttribute('cy', 100 - r);
      leaf.setAttribute('rx', w);
      leaf.setAttribute('ry', len / 2);
      leaf.setAttribute('transform', `rotate(${a} 100 100) rotate(${ri ? -32 : 32} 100 ${100 - r})`);
      leaf.setAttribute('opacity', ri ? .75 : .95);
      g.appendChild(leaf);
    }
  });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360 + 8;
    const d = document.createElementNS(NS, 'circle');
    d.setAttribute('cx', 100); d.setAttribute('cy', 100 - 87); d.setAttribute('r', 2.4);
    d.setAttribute('transform', `rotate(${a} 100 100)`);
    g.appendChild(d);
  }
  const ring = document.createElementNS(NS, 'circle');
  ring.setAttribute('cx', 100); ring.setAttribute('cy', 100); ring.setAttribute('r', 62);
  ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', 'currentColor'); ring.setAttribute('stroke-width', '1');
  const t = document.createElementNS(NS, 'text');
  t.setAttribute('x', 100); t.setAttribute('y', 120); t.setAttribute('text-anchor', 'middle');
  t.setAttribute('font-family', "'Allura', cursive"); t.setAttribute('font-size', '64');
  t.setAttribute('fill', 'currentColor');
  const [a, b] = el.dataset.mono.split('');
  t.innerHTML = `${a}<tspan dx="-6" dy="6">${b}</tspan>`;
  svg.append(g, ring, t);
  el.appendChild(svg);
}
document.querySelectorAll('[data-mono]').forEach(buildWreath);

/* ===== calendar ===== */
const heart = '<svg viewBox="0 0 40 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M20 33 C6 24 2 15 7 8 C12 2 19 5 20 11 C21 4 29 1 34 8 C39 15 33 25 18 34 C12 30 8 26 7 22"/></svg>';
document.querySelectorAll('.calendar').forEach(cal => {
  const [y, m] = cal.dataset.month.split('-').map(Number);
  const mark = Number(cal.dataset.mark);
  const grid = cal.querySelector('.cal-grid');
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => grid.insertAdjacentHTML('beforeend', `<span class="dow">${d}</span>`));
  const first = new Date(y, m - 1, 1).getDay();
  const days = new Date(y, m, 0).getDate();
  for (let i = 0; i < first; i++) grid.insertAdjacentHTML('beforeend', '<span></span>');
  for (let d = 1; d <= days; d++) {
    const on = d === mark;
    grid.insertAdjacentHTML('beforeend', `<span class="day${on ? ' mark' : ''}">${on ? heart : ''}${d}</span>`);
  }
});

/* ===== countdown ===== */
const pad = n => String(n).padStart(2, '0');
const timers = [...document.querySelectorAll('.countdown')];
function tick() {
  timers.forEach(box => {
    let diff = Math.max(0, new Date(box.dataset.target) - Date.now());
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4); const s = Math.floor((diff % 6e4) / 1e3);
    box.querySelector('[data-u=d]').textContent = pad(d);
    box.querySelector('[data-u=h]').textContent = pad(h);
    box.querySelector('[data-u=m]').textContent = pad(m);
    box.querySelector('[data-u=s]').textContent = pad(s);
  });
}
tick(); setInterval(tick, 1000);

/* ===== torn paper edges ===== */
function tear(el) {
  const pts = [];
  const steps = 46;
  const jag = (base, amp) => base + (Math.random() * amp);
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${jag(0, 4.5).toFixed(2)}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${(100 - jag(0, 4.5)).toFixed(2)}%`);
  el.style.clipPath = `polygon(${pts.join(',')})`;
}
document.querySelectorAll('[data-torn]').forEach(tear);

/* ===== music ===== */
const player = document.getElementById('player');
const audio = document.getElementById('bgm');
const vinyl = document.getElementById('vinyl');
const label = document.getElementById('playLabel');
let playing = false;
function setPlaying(on) {
  playing = on;
  player.classList.toggle('playing', on);
  vinyl.classList.toggle('spin', on);
  label.firstChild.textContent = on ? 'CLICK TO PAUSE ' : 'CLICK TO PLAY ';
}
player.addEventListener('click', () => {
  if (playing) { audio.pause(); setPlaying(false); return; }
  audio.play().then(() => setPlaying(true)).catch(() => { label.firstChild.textContent = 'ADD music.mp3 TO PLAY '; });
});

/* ===== scroll reveal ===== */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== RSVP (no arrival-time question) ===== */
const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const attending = form.querySelector('input[name=attending]:checked');
  status.className = 'status';
  form.name.classList.toggle('invalid', !name);
  if (!name || !attending) {
    status.textContent = 'Please enter your name and let us know if you can join.';
    status.classList.add('err');
    return;
  }
  const events = [...form.querySelectorAll('input[name=event]:checked')].map(i => i.value);
  const data = { name, attending: attending.value, events, count: form.count.value || '' };

  try {
    if (CONFIG.endpoint) {
      await fetch(CONFIG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    } else if (CONFIG.whatsappNumber) {
      const msg = `RSVP — Steve & Susan%0AName: ${encodeURIComponent(data.name)}%0A${encodeURIComponent(data.attending)}` +
        (events.length ? `%0AEvents: ${encodeURIComponent(events.join(', '))}` : '') +
        (data.count ? `%0AGuests: ${data.count}` : '');
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
    }
    status.textContent = attending.value.startsWith('Joy')
      ? `Thank you, ${name}! We can't wait to celebrate with you.`
      : `Thank you, ${name}. You will be missed — we're grateful for your blessings.`;
    form.reset();
  } catch (err) {
    status.textContent = 'Something went wrong. Please try again.';
    status.classList.add('err');
  }
});
