# web-card — 사람 한 명을 소개하는 웹 명함 (Claude Code 스킬)

개인사업자·전문직·프리랜서를 소개하는 **원페이지 웹 명함**을 HTML 파일 하나로 만든다.

- 업종의 행위를 재현하는 진입 연출 → 휠을 내리면 장면이 바뀌는 핀 스크롤 센터피스 → 서비스·가격·후기·예약 → 만지는 명함 사물 + 연락처 저장(vCard)·전화·지도·.ics
- 15개 업종 실제 제작본(카페·필라테스·세무사·인테리어·헤어·개발자·치과·스냅·네일·꽃집·변호사·공인중개사·PT·타투·캔들)의 설계표
- 공통 부품 코드, 사진 생성·병렬 제작·배포 절차, 모바일 함정 17개
- 예시 사이트(법률사무소 단정, 사진 포함)와 뷰포트 7종 playwright 검증 스크립트

## 설치 (한 줄)
```bash
curl -fsSL https://raw.githubusercontent.com/manabout-town/web-card-skill/main/install.sh | bash
```
`~/.claude/skills/web-card` 에 설치된다. Claude Code를 새로 열고 "수의사 웹명함 만들어줘"처럼 말하면 된다.
설치 위치를 바꾸려면 `CLAUDE_SKILLS_DIR=... curl ... | bash`.

<details><summary>레포를 통째로 받고 싶다면</summary>

```bash
git clone https://github.com/manabout-town/web-card-skill.git
cd web-card-skill && ./install.sh
```
</details>

## 구성
```
skill/web-card/
├── SKILL.md                 네 칸 결정 → 가상 정보 → 뼈대 → 부품 → 디자인 기준 → 검증 → 배포
├── assets/example/          법률사무소 단정 (index.html + img/)
├── references/
│   ├── catalog.md           15개 업종 표 + 후보 8개
│   ├── parts.md             진입·리빌·핀 스크롤·명함 뒤집기·vCard·.ics 코드
│   ├── production.md        사진 · 병렬 에이전트 · 배포
│   └── pitfalls.md          실제로 밟은 함정
└── scripts/verify.mjs       뷰포트 7종 × 진입·핀 진행도·풀페이지 검사
```
자매 스킬: 가게 메뉴판 `web-menu`, 쇼핑몰 `web-market`.

예시의 인물·연락처·주소·사진(AI 생성)은 전부 가상이다. MIT.
