// verify.mjs — web-card 검사: 뷰포트별 진입→히어로, 핀 섹션 진행도 0/.25/.5/.75/1, 풀페이지
// 판정: 가로넘침, 콘솔 오류, 핀 안 글자가 화면 아래로 잘림, 진입이 5초 안에 안 걷힘
// 사용: node verify.mjs <url> <출력폴더> [핀선택자=#flow] [리빌표시클래스=lit]
// 필요: playwright
import { chromium } from 'playwright';
const [,, url, out = '.', pinSel = '#flow', litCls = 'lit'] = process.argv;
if (!url) { console.error('usage: node verify.mjs <url> <outdir> [pinSelector] [revealClass]'); process.exit(1); }
const VP = [[320, 568], [375, 600], [390, 664], [430, 740], [1024, 640], [1280, 560], [1440, 900]];
const b = await chromium.launch();
const log = [];
for (const [w, h] of VP) {
  const p = await b.newPage({ viewport: { width: w, height: h }, hasTouch: w < 800 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('response', r => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${out}/${w}x${h}-0intro.png` });
  await p.waitForTimeout(5000);                                   // 진입은 4초 안에 스스로 열려야 함
  await p.screenshot({ path: `${out}/${w}x${h}-1hero.png` });
  const r = { hscroll: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) };
  const locked = await p.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden' || getComputedStyle(document.body).overflow === 'hidden');
  if (locked) r.stillLocked = true;
  const pin = await p.$(pinSel);
  if (pin) {
    r.pinClip = [];
    for (const t of [0, .25, .5, .75, 1]) {
      await p.evaluate(([sel, t]) => { const el = document.querySelector(sel); const top = el.getBoundingClientRect().top + scrollY;
        scrollTo(0, top + (el.offsetHeight - innerHeight) * t); }, [pinSel, t]);
      await p.waitForTimeout(450);
      const clip = await p.evaluate(sel => {                     // 핀 안 글자 요소가 화면 아래로 나갔는지
        const st = [...document.querySelector(sel).querySelectorAll('*')].find(e => getComputedStyle(e).position === 'sticky');
        if (!st) return null;
        return [...st.querySelectorAll('h2,h3,p,li')].filter(e => { const b = e.getBoundingClientRect(); return b.height && b.bottom > innerHeight + 1 && b.top < innerHeight; })
          .map(e => e.textContent.trim().slice(0, 16));
      }, pinSel);
      if (clip?.length) r.pinClip.push(`${t}:${clip.join('|')}`);
      await p.screenshot({ path: `${out}/${w}x${h}-2pin-${t}.png` });
    }
    if (!r.pinClip.length) delete r.pinClip;
  } else r.noPin = pinSel;
  await p.evaluate(c => document.querySelectorAll('.rv').forEach(e => e.classList.add(c, 'in')), litCls);
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${out}/${w}x${h}-3full.png`, fullPage: true });
  const ok = !r.hscroll && !r.stillLocked && !r.pinClip && !errs.length;
  log.push(`${w}x${h} ${ok ? 'OK' : 'CHECK'} ${JSON.stringify(r)}${errs.length ? ' errors=' + JSON.stringify(errs.slice(0, 5)) : ''}`);
  await p.close();
}
const rm = await b.newPage({ viewport: { width: 390, height: 664 }, reducedMotion: 'reduce' });
await rm.goto(url, { waitUntil: 'networkidle' }); await rm.waitForTimeout(500);
await rm.screenshot({ path: `${out}/rm-390.png` });
log.push(`reduced-motion: 첫 화면 스크린샷 rm-390.png 확인 (진입이 생략돼 히어로가 보여야 함)`);
console.log(log.join('\n'));
await b.close();
