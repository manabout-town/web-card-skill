# 사진 · 병렬 제작 · 배포

## 1. 사진

API 키가 없으면 로그인된 브라우저에서 이미지 웹앱을 자동화한다(Claude in Chrome).
- **Google Flow**(flow.google.com): 프로젝트 → 에이전트 창에 `Generate this image exactly: …`, 약 20초/장. Nano Banana Pro는 하루 약 22장, 이후 Nano Banana 2. 비율 16:9·4:3·1:1·3:4·9:16 (4:5는 3:4로 만들고 크롭). 결과 img는 fetch→blob→`a.download`로 이름 지정 저장.
- **Gemini 웹**: 무료 하루 약 30장. 입력은 `ed.focus(); document.execCommand('insertText',false,t)` 후 보내기 버튼 클릭. 한 탭에서 여러 장 다운로드하면 Chrome이 조용히 막는다 → 새 탭 또는 canvas 이름 지정 저장.

요령:
- 업종별 **공통 스타일 문구** 하나를 모든 프롬프트 끝에(조명·렌즈·색감·"no text, no logo, no watermark").
- **같은 인물·같은 공간 연속 컷**: 첫 장을 참조로 붙이거나 같은 채팅에서 `Edit the last image: the exact same woman, same face, same top, same backdrop… but …`. 전/후 비교는 `the exact same room from the exact same camera angle and framing, but BEFORE renovation…`.
- 서로 무관한 사진은 새 채팅(이전 이미지 재출력 방지).
- **안전 필터**: 여성 운동 자세(런지·스트레칭)·트레이너 신체 접촉은 반복 차단 → 남성 회원으로 바꾸거나 접촉 없는 구도.
- 가상 가게 외관은 빈 간판 때문에 AI 티가 난다 → 내부·손·진열 클로즈업으로.
- 워터마크 ✦(우하단): 크롭하거나 `ffmpeg -vf "delogo=x=W-134:y=H-134:w=64:h=64"`(W,H 숫자 직접).
- 원본 `img/raw/`(gitignore·vercelignore), 웹용 긴 변 1100~1600 JPG. 프롬프트는 `img/PROMPTS.md`(배포 제외).
- `~/Downloads`를 다른 작업과 공유하면 파일이 섞인다 → 파일명 접두어, 마커 파일 이후 mtime(`find -newer`)으로만 판정.

## 2. 병렬 제작 (업종 여러 개)

- 사이트당 에이전트 1명, 폴더·로컬 포트 분리.
- 브리프에 반드시: 가상 정보 범위, 폴더, 읽을 파일(이 스킬 + catalog.md + 예시), **네 칸 결정(스타일·진입·센터피스·명함 사물)**, 사진 파일명·비율 목록, "사진 없이도 완성돼 보일 것", 폭별 검증(verify.mjs), git commit까지만(push·배포는 메인), **브라우저 도구 금지**(메인이 사진 생성에 씀).
- 메인은 에이전트가 코드를 짜는 동안 브리프의 파일명대로 사진을 만든다 → 완료 보고가 오면 배치·재검증·push·배포.
- 실측: 사이트 3개 코드 30~40분, 사진 16장 약 60분.

## 3. 레포 · 배포

```bash
gh repo create <계정>/<폴더> --private --source . --push        # 만든 날 바로
vercel --prod --yes
curl -s https://<이름>.vercel.app | grep -o '<title>[^<]*'        # 남의 사이트가 아닌지
curl -so /dev/null -w '%{http_code}\n' https://<이름>.vercel.app/img/PROMPTS.md   # 404
```
- `.vercelignore`: `img/raw` `img/PROMPTS.md` `.env*`.
- `<폴더>.vercel.app` 선점 시: `vercel project add <새이름>` → `vercel link --project <새이름> --yes` → 배포(link가 만든 `.env.local`은 삭제). 또는 `vercel domains add <새이름>.vercel.app <project>`. `vercel alias set`은 보호 설정(302)에 걸린다.
- Vercel Hobby: private 레포 커밋 작성자 이메일이 계정과 연결돼 있어야 배포됨. 하루 배포 100회 한도 — 여러 사이트 수정은 모아서.
