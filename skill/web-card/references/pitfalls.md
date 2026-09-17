# 실제로 밟은 함정

## 모바일 · 낮은 화면
1. 핀(sticky 100svh) 섹션은 Safari 툴바만큼 줄어든다. 390×844만 보면 못 잡는다 → 375×600·390×664·1280×560에서 진행도별로 "카피 bottom ≤ innerHeight"를 판정.
2. 핀 안을 가운데 정렬하면 넘친 만큼 위로 새어 고정 헤더 밑에 숨는다 → `flex-start` + `padding-top ≥ 헤더+16px`.
3. 진행 UI는 모바일에서 `top:`(내비 아래)로. 아래에 두면 툴바·태그와 겹친다.
4. 그림 크기는 svh 기반 max-width로 제한, `@media (max-width:860px) and (max-height:620px)`에서 제목·여백 축소.
5. canvas는 `top/bottom`만 줘서는 높이가 안 늘어난다 → `height:100%`.

## 레이아웃
6. 히어로 안 래퍼가 flex column + `margin:auto`면 폭이 줄어 가운데로 쏠린다 → `width:100%`.
7. 필름 그레인 오버레이는 `inset:-10%`로 키워야 가장자리 띠가 안 생긴다.
8. `.ln span` 같은 후손 선택자가 안쪽 span까지 먹는다 → `.ln>span`.
9. `line-height:.84` + `overflow:hidden` 제목은 g·y 꼬리가 잘린다 → `padding-bottom:.22em; margin-bottom:-.18em`.
10. 한글에 모노 넓은 자간 금지. 목록 항목(li)에 grid 금지 — 좁은 폭에서 글자가 세로로 쌓인다.
11. 입력칸(date·number)은 `min-width:0`, 320~430 × 글꼴 배율 확대에서 넘침 확인.

## 연출
12. 부드러운 가장자리 마스크 구멍은 `radial-gradient(… transparent calc(var(--hole) - 120px), #000 var(--hole))` 순서. 반대로 쓰면 대기 중에도 가운데가 비친다.
13. 진입은 반드시 4초 강제 개봉 + 클릭·스크롤·키 건너뛰기 + reduced-motion 생략. 이게 없으면 느린 망에서 빈 화면에 갇힌다.
14. 폰 흔들기(DeviceMotion)는 iOS에서 권한 요청 버튼이 필요하고 데스크톱에서 검증이 안 된다 → 탭 대체 동작을 같이 둔다.

## 검증
15. 캡처 전 `document.fonts.ready` 대기. 대체 글꼴 화면으로는 판단하지 않는다.
16. 풀페이지 캡처는 리빌이 안 걸린다 → `.rv`에 `lit`(또는 사이트의 표시 클래스)를 강제로 붙이고 찍는다.
17. 계산기 요율(중개보수 등)은 기억에 의존하지 말고 공개 전 공식 출처로 확인한다.
