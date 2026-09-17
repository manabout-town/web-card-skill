# 공통 부품

전부 바닐라 JS, IIFE 하나 안에 둔다. 전체 맥락은 `assets/example/index.html`.

## 토큰

```css
:root{
  --bg:#F3F3F1; --paper:#FAFAF8;                 /* 순백·순검정 금지 */
  --ink-1:rgba(20,22,26,.94); --ink-2:rgba(20,22,26,.7); --ink-3:rgba(20,22,26,.5); --ink-4:rgba(20,22,26,.3);
  --line:rgba(20,22,26,.14); --line-soft:rgba(20,22,26,.07);
  --accent:#B3261E;                               /* 1색 */
  --ease:cubic-bezier(0,0,.2,1); --ease-expo:cubic-bezier(.16,1,.3,1);
  --r1:6px; --nav:56px; --g:clamp(16px,4.4vw,56px);
}
html{font-synthesis:none}
body{font-size:14.5px;line-height:1.7;letter-spacing:-.01em;word-break:keep-all;overflow-x:hidden}
```

## 공통 JS 머리

```js
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(id){ return document.getElementById(id); }
function clamp(v,a,b){ return Math.min(b, Math.max(a, v)); }
function smooth(t){ return t*t*(3-2*t); }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
```

## 진입 (건너뛰기 · 강제 개봉 · RM 생략)

```js
var opened = false;
function openIntro(){ if(opened) return; opened = true; document.body.classList.add('open');
  setTimeout(() => { document.body.classList.add('done'); document.documentElement.classList.remove('lock'); }, 520); }
if(RM){ opened = true; document.body.classList.add('open','done'); document.documentElement.classList.remove('lock'); }
else {
  const arm = () => setTimeout(openIntro, 1100);            // 사진·폰트가 뜬 뒤 잠깐 보여주고
  document.readyState === 'complete' ? arm() : addEventListener('load', arm, {once:true});
  setTimeout(openIntro, 4000);                               // 느린 망에서도 4초면 열림
  ['wheel','touchstart','keydown','click'].forEach(ev => addEventListener(ev, openIntro, {once:true, passive:true}));
}
```
`html.lock{overflow:hidden}`을 초기 클래스로 두고, 진입 레이어는 `body.done`에서 `visibility:hidden`.

## 사진 (페이드인 · 실패 폴백)

```html
<div class="ph"><img src="img/lawyer.jpg" alt="…" onload="this.classList.add('ok')" onerror="this.remove()"></div>
```
```css
.ph{background:linear-gradient(160deg,#E4E7E8,#D6DADC);overflow:hidden}
.ph img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 480ms var(--ease)}
.ph img.ok{opacity:1}
```

## 리빌

```css
.rv{opacity:0;transform:translateY(22px);transition:opacity 700ms var(--ease-expo),transform 700ms var(--ease-expo);transition-delay:var(--d,0ms)}
.rv.lit{opacity:1;transform:none}
```
```js
var io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('lit'); io.unobserve(e.target); } }),
  {threshold:.12, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(el => RM ? el.classList.add('lit') : io.observe(el));
```

## 핀 스크롤 센터피스 (N컷 사진 크로스페이드)

```css
#flow{height:520vh}                                   /* 컷당 약 100vh */
.fl-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;display:flex;flex-direction:column;
  padding-top:calc(var(--nav) + env(safe-area-inset-top))}   /* 가운데 정렬 금지 — 넘치면 헤더 밑으로 샌다 */
.shots{position:relative;aspect-ratio:4/3;max-height:100%}
.shots .ph{position:absolute;inset:0;opacity:0} .shots .ph:first-child{opacity:1}
.fl-static{display:none}                              /* RM이면 핀 대신 정적 목록 */
@media (prefers-reduced-motion:reduce){#flow{height:auto}.fl-stage{display:none}.fl-static{display:block}}
@media (max-width:860px){.shots{width:min(100%,calc(34svh * 4 / 3))}}
```
```js
function flow(p){                                     // p: 0~1
  var N = STEPS.length, P = p * N, k = Math.min(N - 1, Math.floor(P));
  phs.forEach((ph, i) => { if(i) ph.style.opacity = smooth(clamp((P - i + .2) / .25, 0, 1)).toFixed(3); });
  if(k !== cur){ cur = k; setStep(k); }               // 카피·진행 표시 교체
}
var tick = false, sec = $('flow');
function render(){
  tick = false;
  var h = document.documentElement.scrollHeight - innerHeight;
  $('progress').style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  if(RM) return;
  var r = sec.getBoundingClientRect();
  if(r.bottom < -innerHeight || r.top > innerHeight * 2) return;   // 화면 밖이면 계산 안 함
  flow(clamp(((-r.top) / (sec.offsetHeight - innerHeight) - .03) / .92, 0, 1));
}
addEventListener('scroll', () => { if(!tick){ tick = true; requestAnimationFrame(render); } }, {passive:true});
addEventListener('resize', render); render();
```

## 명함 사물 (뒤집기 + 틸트)

```css
.nc{perspective:1200px}
.nc-in{position:relative;transform-style:preserve-3d;transition:transform 800ms var(--ease-expo);
  transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) + var(--flip,0deg)))}
.nc.flipped{--flip:180deg}
.nc.tilting .nc-in{transition:transform 120ms var(--ease)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.face.b{transform:rotateY(180deg)}
```
```js
nc.addEventListener('click', () => nc.setAttribute('aria-pressed', nc.classList.toggle('flipped')));
if(!RM && matchMedia('(hover:hover)').matches){
  nc.addEventListener('pointermove', e => { const r = nc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    nc.classList.add('tilting'); nc.style.setProperty('--ry', (x - .5) * 10 + 'deg'); nc.style.setProperty('--rx', (.5 - y) * 8 + 'deg'); });
  nc.addEventListener('pointerleave', () => { nc.classList.remove('tilting'); nc.style.setProperty('--ry','0deg'); nc.style.setProperty('--rx','0deg'); });
}
```
`role="button" tabindex="0" aria-pressed="false"` + Enter/Space 처리. 화면에 처음 들어올 때 한 번 저절로 반응(흔들림·도장)하면 "만질 수 있다"가 전해진다.

## 연락처 저장 (vCard)

```js
function saveVcf(){
  var v = ['BEGIN:VCARD','VERSION:3.0','N:윤;재원;;;','FN:윤재원','ORG:법률사무소 단정','TITLE:대표변호사',
    'TEL;TYPE=WORK,VOICE:+82-2-000-0000','EMAIL;TYPE=WORK:office@brand.example',
    'ADR;TYPE=WORK:;7층;단정로 88;서초구;서울;;KR','URL:https://brand.example','NOTE:웹 제작 예시용 가상 연락처','END:VCARD'].join('\r\n');
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([v], {type:'text/vcard;charset=utf-8'}));
  a.download = 'brand.vcf'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('연락처 파일을 내려받았어요');
}
```
나머지 버튼은 링크로: `tel:`, `sms:`, 카카오 채널 URL, 지도(`https://map.naver.com/p/search/<주소>`), 인스타.

## 예약 리마인더 (.ics) — 치과 검진·PT 회차 등

```js
var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//web-card//KO','BEGIN:VEVENT',
  'UID:' + Date.now() + '@brand.example','DTSTAMP:' + new Date().toISOString().replace(/[-:]/g,'').slice(0,15) + 'Z',
  'DTSTART;VALUE=DATE:20270317','SUMMARY:정기 검진 (6개월)','END:VEVENT','END:VCALENDAR'].join('\r\n');
// Blob type 'text/calendar;charset=utf-8', 저장은 vCard와 같음
```

## 토스트

```html
<div id="toast" role="status" aria-live="polite"></div>
```
