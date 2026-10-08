// Georgian headings in Mtavruli: browsers do not upper-case Georgian via CSS,
// so swap Mkhedruli (U+10D0..10FA) for Mtavruli (U+1C90..1CBA) in the DOM.
const mt = s => s.replace(/[ა-ჺ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xBC0));
document.querySelectorAll('h1,h2,h3,.mt').forEach(el => {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());)
    n.data = n.data.replace(/[ა-ჺ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xBC0));
});

// ?y=1200 opens the page already scrolled there (handy for screenshots and recordings)
const y = new URLSearchParams(location.search).get('y');
if (y) addEventListener('load', () => scrollTo({ top: +y, behavior: 'instant' }));

// highlight today's row in opening-hours lists
document.querySelectorAll('[data-d="' + new Date().getDay() + '"]').forEach(e => e.classList.add('today'));

// live "open now" badge, from the clinic's real opening hours
const HRS = { 0: [10, 16], 6: [10, 18] }, hm = h => String(Math.floor(h)).padStart(2, '0') + ':' + (h % 1 ? '30' : '00');
{
  const n = new Date(), [a, b] = HRS[n.getDay()] || [9, 20.5], h = n.getHours() + n.getMinutes() / 60, open = h >= a && h < b;
  document.querySelectorAll('[data-open]').forEach(e => {
    e.classList.toggle('closed', !open);
    e.querySelector('span').textContent = mt(open ? 'ახლა ღიაა, ' + hm(b) + '-მდე' : 'ახლა დაკეტილია, ჩაეწერე ონლაინ');
  });
}

// marquee rows drift on their own, speed up with the scroll and lean into it
{
  const rows = [...document.querySelectorAll('.tick>div')], p = rows.map(() => 0);
  let last = scrollY, v = 0;
  if (rows.length) (function tk() {
    const dy = scrollY - last; last = scrollY; v += (dy - v) * .12;
    rows.forEach((r, i) => {
      const w = r.scrollWidth / 2, dir = (i % 2 ? -1 : 1) * (v < -.5 ? -1 : 1);
      p[i] = ((p[i] + dir * (.5 + Math.min(Math.abs(v), 40) * .4)) % w + w) % w;
      r.style.transform = `translateX(${-p[i]}px) skewX(${Math.max(-10, Math.min(10, -v * .4))}deg)`;
    });
    requestAnimationFrame(tk);
  })();
}

// any query string (?y=, ?f=, ?x) skips the intro sheet, so screenshots and recordings can start mid-page
if (location.search) document.documentElement.classList.add('noin');
